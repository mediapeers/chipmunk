import UriTemplate from 'uri-templates'
import {first, compact, attempt, values, merge, pick, assign as write, reduce, map, get, flatten, each, isEmpty, isArray} from 'lodash'

import {IConfig} from './config'
import getContext, {IAction, IContext} from './context'
import action, {IResult} from './action'

interface IRefs extends Array<{ [s: string]: any }> {
  isHabtm: boolean
}

export const extractReferences = (objects, name):IRefs => {
  const result = flatten(compact(map(objects, (o) => get(o, `@associations.${name}`)))) as IRefs
  result.isHabtm = isArray(get(first(objects), `@associations.${name}`))

  return result
}

export const extractProps = (context: IContext, references) => {
  const memberGet = context.member_actions['get']
  const collectionGet = context.collection_actions['query']

  const result = {}

  each([memberGet, collectionGet], (action) => {
    const template = UriTemplate(action.template)

    try {
      each(references, (reference) => {
        const values = template.fromUri(reference)

        each(action.mappings, (mapping) => {
          const value = values[mapping.variable]
          if (!value) return
          if (!result[mapping.source]) result[mapping.source] = []

          result[mapping.source].push(value)
        })
      })
    }
    catch {}
  })

  return result
}

const buildParams = (context: IContext, props) => {
  const collectionGet = context.collection_actions['get']

  const result = {}

  each(collectionGet.mappings || [], (mapping) => {
    if (props[mapping.source]) result[mapping.variable] = props[mapping.source]
  })

  return result
}

const readProp = (object, name) => {
  try {
    return object[name]
  }
  catch (e) {
    if (e.name !== 'NotLoadedError') throw e
  }
}

export const fetch = async (objects: any[], name: string, config: IConfig):Promise<IResult> => {
  const objectContext = await getContext(first(objects)['@context'], config)

  const associationProperty = objectContext.associations[name]
  const associationContext = await getContext(associationProperty.type, config)

  const references = extractReferences(objects, name)
  const extractedProps = extractProps(associationContext, references)
  const params = buildParams(associationContext, extractedProps)

  const actionName = associationProperty.collection && !references.isHabtm ? 'query' : 'get'
  return action(associationProperty.type, actionName, { params }, config)
}

export const assign = (targets: any[], objects: any[], name: string, config: IConfig):void => {
  const objectsById = reduce(objects, (acc, object) => write(acc, { [object['@id']]: object }), {})
  const targetsById = reduce(targets, (acc, target) => write(acc, { [target['@id']]: target }), {})

  /*
   * if our target association references match any of the objects by @id, simply assign them
   * this satisfies 'belongs_to', 'has_one' & 'HABTM' associations
   */
  each(targets, (target) => {
    const ref = get(target, `@associations[${name}]`)

    if (isArray(ref)) {
      const matches = pick(objectsById, ref)
      if (!isEmpty(matches)) Object.defineProperty(target, name, { value: values(matches) })
    }
    else {
      const match = objectsById[ref]
      if (!isEmpty(match)) Object.defineProperty(target, name, { value: match })
    }
  })

  /*
   * if any of our object association references point to one of our targets, assign them
   * this satifies 'has many' associations
  */
  each(objects, (object) => {
    each(get(object, '@associations', []), (ref) => {
      // if we get an array, this can't be an has_many association -> something is wrong
      if (isArray(ref)) throw new Error('got array of references, but expecting one reference only!')

      const target = targetsById[ref]
      if (!isEmpty(target)) {
        const value = readProp(target, name)

        if (value) target[name].push(object)
        else Object.defineProperty(target, name, { value: [object] })
      }
    })
  })

  // set to null for all targets we didn't find association data for..
  // aka remove the NotLoadedError
  each(targets, (target) => {
    const value = readProp(target, name)
    if (!value) Object.defineProperty(target, name, { value: null })
  })
}
