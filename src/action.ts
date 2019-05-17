import UriTemplate from 'uri-templates'
import {each, filter, get, merge, first, map, isArray, isEmpty, isPlainObject} from 'lodash'
import {stringify} from 'querystringify'

import {IConfig} from './config'
import {request, run} from './request'
import getContext, {IAction} from './context'
import format from './format'

export class NotLoadedError extends Error {}

export interface IActionOpts {
  ROR?: boolean
  withoutSession?: boolean
  headers?: { [s: string]: any }
  body?: { [s: string]: any }
  params?: { [s: string]: any }
  schema?: string
}

export interface IObject {
  '@associations': { [s: string]: any }
  [s: string]: any
}

export interface IResult {
  object: IObject
  objects: IObject[]
  headers?: { [s: string]: string }
  aggregations?: any
}

const DEFAULT_OPTS: IActionOpts = {
  ROR: false,
  params: {},
}

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
      else console.log(msg)

      return false
    }
  }

  return true
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
  const body = format(opts.body, action.collection, opts.ROR)
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

  const response = await run(req)
  let objects = []

  if (get(response, 'body.members')) objects = response.body.members
  else if (!isEmpty(response.body))  objects = [response.body]

  each(objects, (object) => {
    object['@associations'] = {}

    each(context.associations, (_def, name) => {
      const data = object[name]
      if (object[name]) {
        object['@associations'][name] = isArray(data) ? map(data, '@id') : get(data, '@id')
      }

      Object.defineProperty(object, name, {
        get: () => associationNotLoaded(name)()
      })
    })
  })

  const result: IResult = {
    objects,
    get object() { return first(objects) },
    headers: get(response, 'headers', {}),
  }

  return result
}
