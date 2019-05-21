import {startsWith, each} from 'lodash'

import {IConfig} from './config'

declare var window

const PREFIX = 'chipmunk'
const DEFAULT_EXPIRY = 60

export interface IExplicitStorage {
  put(extkey: string, val: any, expires?: number): void
  fetch(extkey: string): any
  drop(extkey: string): void
  clear(): void
}

export interface IImplicitStorage {
  change(extkey: any, fn: (value: any) => any, defaultValue?: any, expires?: number): void
  set(key: string, val: any, expires?: number): void
  get(key: string): any
  remove(key: string): void
  update(key: string, fn: (value: any) => any, defaultValue?: any, expires?: number): void
}

export interface IStorage extends IExplicitStorage, IImplicitStorage {}

const minutesFromNow = (min:number): number => {
  return Date.now() + min*60000
}

const cacheKey = (suffix: string, config: IConfig): string => {
  return `${config.cache.prefix}-${suffix}`
}

const prefixedKey = (suffix: string): string => {
  return `${PREFIX}-${suffix}`
}

const implicitStorage = (explicitInterface: IExplicitStorage, config: IConfig): IImplicitStorage => {
  const implicitInterface = {
    change: (key, cb?, defaultValue?, expires?): void => {
      if (!expires) expires = DEFAULT_EXPIRY

      const currentValue = explicitInterface.fetch(key) || defaultValue
      const value = cb(currentValue)
      explicitInterface.put(key, value, expires)
    },
    set: (key, value, expires) => {
      explicitInterface.put(cacheKey(key, config), value, expires)
    },
    get: (key) => {
      return explicitInterface.fetch(cacheKey(key, config))
    },
    remove: (key) => {
      explicitInterface.drop(cacheKey(key, config))
    },
    update: (key, cb, defaultValue, expires) => {
      implicitInterface.change(cacheKey(key, config), cb, defaultValue, expires)
    },
  }

  return implicitInterface
}

export const createLocalStorage = (config: IConfig): IStorage => {
  const explicitInterface = {
    put: (key, value, expires?) => {
      key = prefixedKey(key)
      expires = minutesFromNow(expires || DEFAULT_EXPIRY)

      const obj = { value, expires }
      window.localStorage.setItem(key, JSON.stringify(obj))
    },
    fetch: (key) => {
      key = prefixedKey(key)
      const obj = JSON.parse(window.localStorage.getItem(key) || null)

      if (obj && Date.now() > obj.expires) {
        explicitInterface.drop(key)
        return null
      }

      return obj && obj.value
    },
    drop: (key) => {
      key = prefixedKey(key)
      const {localStorage} = window
      const keyparts = key.split('*')

      if (keyparts.length > 1) {
        const toDelete = []

        for (var i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (startsWith(key, keyparts[0])) toDelete.push(key)
        }

        each(toDelete, (key) => localStorage.removeItem(key))
      }
      else {
        localStorage.removeItem(key)
      }
    },
    clear: () => {
      const {localStorage} = window
      const toDelete = []

      for (var i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (startsWith(key, PREFIX)) toDelete.push(key)
      }

      each(toDelete, (key) => localStorage.removeItem(key))
    }
  }

  const implicitInterface = implicitStorage(explicitInterface, config)

  return {
    ...explicitInterface,
    ...implicitInterface,
  }
}

export let internalStorage = {}
export const createRuntimeStorage = (config: IConfig): IStorage => {
  const explicitInterface = {
    put: (key, value, expires?) => {
      expires = minutesFromNow(expires || DEFAULT_EXPIRY)

      const obj = { value, expires }
      internalStorage[key] = obj
    },
    fetch: (key) => {
      const obj = internalStorage[key]

      if (obj && Date.now() > obj.expires) {
        explicitInterface.drop(key)
        return null
      }

      return obj && obj.value
    },
    drop: (key) => {
      const keyparts = key.split('*')

      if (keyparts.length > 1) {
        const toDelete = []

        each(internalStorage, (_val, key) => {
          if (startsWith(key, keyparts[0])) toDelete.push(key)
        })

        each(toDelete, (key) => delete internalStorage[key])
      }
      else {
        delete internalStorage[key]
      }
    },
    clear: () => {
      internalStorage = {}
    }
  }

  const implicitInterface = implicitStorage(explicitInterface, config)

  return {
    ...explicitInterface,
    ...implicitInterface,
  }
}
