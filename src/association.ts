import UriTemplate from 'uri-templates'
import {first, compact, map, get, flatten, each, isArray} from 'lodash'

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
