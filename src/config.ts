import {merge, get} from 'lodash'
import {IRequestError} from './request'

export interface ICookieSettings {
  timeout: number
  domain?: string
}

export interface IHeaderSettings {
  'Session-Id'?: string
  'Affiliation-Id'?: string
  'Role-Id'?: any
  'Mpx-Flavours'?: { [s: string]: any }
}

export interface IConfig {
  endpoints: { [s: string]: string }
  cookies: ICookieSettings
  headers: IHeaderSettings
  timestamp: number
  errorInterceptor?: (err: IRequestError) => boolean
  devMode: boolean
  cachePrefix: string
}

const DEFAULTS:IConfig = {
  endpoints: {},
  timestamp: Date.now() / 1000 | 0,
  cookies: {
    timeout: 30*24*60*60, // 1 month
  },
  headers: {
    'Mpx-Flavours': {},
  },
  devMode: false,
  cachePrefix: 'anonymous',
}

export default (...configs: Partial<IConfig>[]):IConfig => {
  configs.unshift({}, DEFAULTS)
  const result = merge.apply(null, configs)

  if (get(result, `headers['Affiliation-Id']`) && get(result, `headers['Role-Id']`)) {
    result.cachePrefix = `${result.headers['Affiliation-Id']}-${result.headers['Role-Id']}`
  }
  else if (get(result, `headers['Session-Id']`)) {
    result.cachePrefix = result.headers['Session-Id']
  }
  return result
}
