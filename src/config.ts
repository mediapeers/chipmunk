import {merge, get, cloneDeep} from 'lodash'
import {IRequestError} from './request'

export interface IHeaderSettings {
  'Session-Id'?: string
  'Affiliation-Id'?: string
  'Role-Id'?: any
  'Mpx-Flavours'?: { [s: string]: any }
}

export interface ICacheSettings {
  enabled?: boolean
  default?: 'runtime' | 'storage' | null
  prefix?: string
}

export interface IWatcher {
  pendingRequests: { [s: string]: any }
  performLaterHandlers: Function[]
}

export interface IConfig {
  endpoints?: { [s: string]: string }
  headers?: IHeaderSettings
  errorInterceptor?(err: IRequestError): boolean
  verbose?: boolean
  cache?: ICacheSettings
  watcher?: IWatcher
  timestamp?: number
}

const DEFAULTS:IConfig = {
  endpoints: {},
  timestamp: Date.now() / 1000 | 0,
  headers: {
    'Mpx-Flavours': {},
  },
  verbose: false,
  cache: {
    default: null,
    prefix: 'anonymous',
    enabled: false,
  },
  watcher: {
    pendingRequests: {},
    performLaterHandlers: [],
  },
  errorInterceptor: null,
}

export default (...configs: Partial<IConfig>[]):IConfig => {
  const conf = cloneDeep(configs)
  conf.unshift({}, DEFAULTS)
  const result = merge.apply(null, conf)

  if (get(result, `headers['Affiliation-Id']`) && get(result, `headers['Role-Id']`)) {
    result.cache.prefix = `${result.headers['Affiliation-Id']}-${result.headers['Role-Id']}`
  }
  else if (get(result, `headers['Role-Id']`)) {
    result.cache.prefix = result.headers['Role-Id']
  }
  else if (get(result, `headers['Session-Id']`)) {
    result.cache.prefix = result.headers['Session-Id']
  }

  return result
}
