import UriTemplate from 'uri-templates'
import {each, pick, pickBy, keys, reduce, filter, get, merge, first, map, isArray, isEmpty, isPlainObject} from 'lodash'
import {stringify} from 'querystringify'

import {IConfig} from './config'
import {request, run} from './request'
import getContext, {IAction} from './context'
import format from './format'
import parseSchema from './schema'
import {fetch, assign} from './association'
import log from './log'

export class NotLoadedError extends Error {}

export interface IActionOpts {
  // converts to ruby on rails accepts nested attributes compatible body
  ROR?: boolean
  // returns raw data, without moving association references, does not support schema resolving
  raw?: boolean
  // if enabled, this request is routed via tuco
  proxy?: boolean
  // indicates, if provided array body should be converted into hash, where 'id' is the key of each
  multi?: boolean

  headers?: { [s: string]: any }
  body?: { [s: string]: any }
  params?: { [s: string]: any }
  schema?: string
}

export interface IObject {
  '@associations': { [s: string]: any }
  [s: string]: any
}

export interface IPagination {
  total_pages: number
  total_count: number
  current_page: number
}

export interface IResult {
  object: IObject
  objects: IObject[]
  pagination?: IPagination
  type?: string
  headers?: { [s: string]: string }
  aggregations?: any
}

const DEFAULT_OPTS: IActionOpts = {
  ROR: false,
  raw: false,
  proxy: false,
  multi: false,
  params: {},
}

const PAGINATION_PROPS = ['@total_pages', '@total_count', '@current_page']

const extractParamsFromBody = (action: IAction, body = {}): {[s:string]:any} => {
  const result = {}

  each(action.mappings || [], (mapping) => {
    if (body[mapping.source]) result[mapping.variable] = body[mapping.source]
  })

  return result
}

const validateParams = (action: IAction, params, config): boolean => {
  const required = filter(action.mappings, 'required')

  for (let index in required) {
    const variable = get(required[index], 'variable')

    if (!params[variable]) {
      const msg = `Required param '${variable}' for '${action.template}' missing!`
      if (config.devMode) throw new Error(msg)
      else log(msg)

      return false
    }
  }

  return true
}

const resolve = async (objects, schema, config) => {
  merge(schema, {
    '@context': true,
    '@id': true,
    '@type': true,
    '@associations': true,
  })

  const associations = pickBy(schema, isPlainObject)

  const promises = map(associations, async (assocSchema, assocName) => {
    try {
      const result = await fetch(objects, assocName, config)
      const resolved = await resolve(result.objects, assocSchema, config)
      return assign(objects, resolved, assocName, config)
    }
    catch (err) {
      // if we fail to resolve an association, continue anyways
      log(`failed to resolve association ${assocName}`)
      if (config.devMode) log(err, objects, schema)
      return objects
    }
  })

  await Promise.all(promises)

  return map(objects, (o) => pick(o, keys(schema)))
}

export const associationNotLoaded = (name) => {
  return () => {
    const err = new NotLoadedError(`'${name}' association not loaded`)
    err.name = 'NotLoadedError'

    throw err
  }
}

export default async (appModel: string, actionName: string, opts: IActionOpts, config: IConfig): Promise<IResult> => {
  opts = merge({}, DEFAULT_OPTS, opts)

  const context = await getContext(appModel, config)
  const action = context.action(actionName)
  const body = format(opts.body, opts.multi, opts.ROR)
  const uriTemplate = UriTemplate(action.template)
  const params = merge({}, extractParamsFromBody(action, body), opts.params)

  validateParams(action, params, config)

  const uri = uriTemplate.fillFromObject(params)

  let req

  switch (action.method) {
    case 'POST':
      req = request(config, opts.headers)
        .post(uri)
        .send(body)
      break;

    default:
      req = request(config, opts.headers)
        .get(uri)
  }

  if (config.timestamp) req.query({ t: config.timestamp })

  const response = await run(uri, req, config)
  let objects = []

  if (get(response, 'body.members')) objects = response.body.members
  else if (!isEmpty(response.body))  objects = [response.body]

  if (!opts.raw) {
    // objects can have different context, e.g. series vs seasons vs episodes
    // for this reason we have to check all possible contexts for association definitions

    const promises = map(objects, async (object) => {
      const objectContext = await getContext(object['@context'], config)
      object['@associations'] = {}

      each(objectContext.associations, (_def, name) => {
        const data = object[name]
        if (object[name]) {
          object['@associations'][name] = isArray(data) ? map(data, '@id') : get(data, '@id')
        }

        Object.defineProperty(object, name, {
          get: () => associationNotLoaded(name)()
        })
      })
    })

    await Promise.all(promises)
  }

  if (!(opts.raw) && !isEmpty(opts.schema)) {
    const schema = parseSchema(opts.schema)
    objects = await resolve(objects, schema, config)
  }

  const result: IResult = {
    objects,
    get object() { return first(objects) },
    headers: get(response, 'headers', {}),
    type: get(response, `body['@type']`),
  }

  if (get(response, 'body.aggregations')) {
    result.aggregations = reduce(response.body.aggregations, (acc, agg, name) => {
      acc[name] = map(get(agg, 'buckets'), (tranche) => ({ value: tranche.key, count: tranche.doc_count }))
      return acc
    }, {})
  }

  if (get(response, `body['@total_count']`)) {
    result.pagination = {} as IPagination

    each(PAGINATION_PROPS, (prop) => {
      if (response.body[prop]) {
        result.pagination[prop.substr(1)] = response.body[prop]
      }
    })
  }

  return result
}
