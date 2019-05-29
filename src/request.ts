import superagent, {Request, Response, SuperAgentStatic, SuperAgentRequest} from 'superagent'
import superdebug from 'superdebug'
import {get, each, merge, isEmpty, isPlainObject} from 'lodash'
import {stringify} from 'querystringify'
import {IConfig} from './config'
import {enqueueRequest, clearRequest} from './watcher'

export interface IRequestError extends Error {
  message: string
  status?: number
  text?: string
  object?: any
  url?: string
}

export const isNode = (): boolean => {
  return typeof window === 'undefined'
}

export const request = (config: IConfig, headers?: { [s: string]: any }): SuperAgentStatic => {
  const req = superagent.agent()
    //.use(superdebug(console.info))

  req.set({ 'Accept-Encoding' : 'gzip,deflate' })

  headers = merge({}, config.headers, headers)

  each(headers, (value, key) => {
    if (!value) return

    isPlainObject(value) ?
      req.set(key, stringify(value)) :
      req.set(key, value)
  })

  return req
}

export const run = async (key: string, req: SuperAgentRequest, config: IConfig):Promise<Response>  => {
  try {
    const promise = req
    enqueueRequest(key, promise, config)

    return await promise
  }
  catch (err) {
    const error = err as IRequestError
    error.name = 'RequestError'
    error.object = get(err, 'response.body')
    error.text   = get(err, 'response.body.description') || err.message
    error.url    = get(req, 'url')

    throw error
  }
  finally {
    clearRequest(key, config)
  }
}
