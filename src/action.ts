import UriTemplate from 'uri-templates'
import {each, includes, uniq, flatten, omit, pick, pickBy, keys, reduce, filter, get, merge, first, map, isArray, isEmpty, isPlainObject} from 'lodash'
import {stringify} from 'querystringify'

import {IConfig, cleanConfig} from './config'
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
      if (config.verbose) console.error(msg)
      else log(msg)

      return false
    }
  }

  return true
}

const resolve = async (objects, schema, config) => {
  if (isEmpty(objects)) return []
  if (schema === '*') return objects

  merge(schema, {
    '@context': true,
    '@id': true,
    '@type': true,
    '@associations': true,
  })

  const refs = uniq(flatten(map(objects, x => keys(x['@associations']))))
  const associations = reduce(schema, (acc, val, key) => {
    // detecting associations
    if (isPlainObject(val)) {
      // prop is an association if nested schema is provided
      return merge(acc, { [key]: val })
    }
    else if (includes(refs, key)) {
      // prop is an association if any object's context has a reference to it
      return merge(acc, { [key]: '*' })
    }
    else {
      return acc
    }
  }, {})

  const promises = map(associations, async (assocSchema, assocName) => {
    try {
      const result = await fetch(objects, assocName, config)
      const resolved = await resolve(result.objects, assocSchema, config)
      assign(objects, resolved, assocName, config)
    }
    catch (err) {
      // if we fail to resolve an association, continue anyways
      assign(objects, [], assocName, config)
      log(`failed to resolve association ${assocName}`)
      if (config.verbose) log(err, objects, schema)
      return objects
    }
  })

  await Promise.all(promises)

  return map(objects, (o) => pick(o, keys(schema)))
}

const performAction = async (appModel: string, actionName: string, opts: IActionOpts, config: IConfig): Promise<IResult> => {
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

    case 'PUT':
      req = request(config, opts.headers)
        .put(uri)
        .send(body)
      break;

    case 'PATCH':
      req = request(config, opts.headers)
        .patch(uri)
        .send(body)
      break;

    case 'DELETE':
      req = request(config, opts.headers)
        .delete(uri)
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

  if (!opts.raw && !isEmpty(opts.schema)) {
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

const performProxiedAction = async (appModel: string, actionName: string, opts: IActionOpts, config: IConfig): Promise<IResult> => {
  const context = await getContext('tuco.request', config)
  const action = context.action('proxy')

  const body = {
    appModel,
    actionName,
    opts: omit(opts, 'proxy'),
    config: cleanConfig(config),
  }

  const req = request(config)
    .post(action.template)
    .send(body)

  const response = await run(action.template, req, config)
  const objects = get(response, 'body.objects', []) as IObject[]

  const result: IResult = {
    objects: objects,
    get object() { return first(objects) },
    headers: get(response, 'body.headers', {}),
    type: get(response, 'body.type'),
    aggregations: get(response, 'body.aggregations'),
    pagination: get(response, 'body.pagination'),
  }

  return result
}

export const associationNotLoaded = (name) => {
  return () => {
    const err = new NotLoadedError(`'${name}' association not loaded`)
    err.name = 'NotLoadedError'

    throw err
  }
}

export default async (appModel: string, actionName: string, opts: IActionOpts, config: IConfig): Promise<IResult> => {
  opts = merge({}, DEFAULT_OPTS, { proxy: !isEmpty(opts.schema) }, opts)

  if (opts.proxy && isEmpty(opts.schema)) {
    throw new Error('Proxying is supported only if a schema is given, too.')
  }

  return opts.proxy ?
    performProxiedAction(appModel, actionName, opts, config) :
    performAction(appModel, actionName, opts, config)
}
