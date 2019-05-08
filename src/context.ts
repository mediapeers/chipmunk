import {get, first} from 'lodash'
import {IConfig} from './config'
import {request, run} from './request'

const uriCheck = /https?:\/\//i

export interface IProperty {
  type: string
  readable: boolean
  writable: boolean
  exportable: boolean
  required?: boolean
  validations?: any[]
  collection?: boolean
}

export interface IAction {
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  collection: boolean
  template: string
  mappings: { [s:string]: string }[]
  expects?: string
  resource?: string
  response?: string
}

export interface IContext {
  properties: IProperty[]
  constants: { [s:string]: string[] }
  member_actions: IAction[]
  collection_actions: IAction[]
  action: (name: string) => IAction
}

export default async (urlOrAppModel: string, config: IConfig):Promise<IContext> => {
  let url

  if (uriCheck.test(urlOrAppModel)) {
    url = first(urlOrAppModel.split('?'))
  }
  else {
    const [app, model] = urlOrAppModel.split('.')
    url = `${config.endpoints[app]}/context/${model}`
  }

  const req = request(config)
    .get(url)

  if (config.timestamp) req.query({ t: config.timestamp })

  const res = await run(req)
  const context = get(res, `body['@context']`) as IContext

  if (!context) throw new Error(`Failed to fetch context ${urlOrAppModel}`)

  context.action = (name: string):IAction => {
    let action
    if (context.collection_actions[name]) {
      action = context.collection_actions[name]
      action.collection = true
    }
    else if (context.member_actions[name]) {
      action = context.member_actions[name]
      action.collection = false
    }

    return action
  }

  return context
}
