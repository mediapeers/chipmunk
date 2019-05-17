import context, {IContext} from './context'
import action, {IResult, IActionOpts} from './action'
import {fetch, assign} from './association'
import createConfig, {IConfig} from './config'

export interface IInterface {
  config: IConfig
  context: (urlOrAppModel: string) => Promise<IContext>
  action: (appModel: string, actionName: string, opts?: IActionOpts) => Promise<IResult>
  fetch: (objects: any[], name: string) => Promise<IResult>
  assign: (targets: any[], objects: any[], name: string) => void
  fetchAndAssign: (targets: any[], name: string) => Promise<void>
}

export interface IChipmunk extends IInterface {
  updateConfig: (overrides?: Partial<IConfig>) => IConfig
  run: (ch: IChipmunk, errorHandler?: Function) => Promise<any>
}

export default (...overrides: Partial<IConfig>[]): IChipmunk => {
  let config = createConfig.apply(null, overrides)

  const ch: IInterface = {
    get config() { return config },
    context: (urlOrAppModel) => context(urlOrAppModel, config),
    action: (appModel, actionName, opts = {}) => action(appModel, actionName, opts, config),
    fetch: (objects, name) => fetch(objects, name, config),
    assign: (targets, objects, name) => assign(targets, objects, name, config),
    fetchAndAssign: async (targets, name) => {
      const result = await fetch(targets, name, config)
      assign(targets, result.objects, name, config)
    },
  }

  const updateConfig = (overrides) => {
    return config = createConfig(config, overrides)
  }

  const run = async (block, errorHandler?) => {
    try {
      await block(ch)
    }
    catch (e) {
      if (config.errorInterceptor) {
        if (config.errorInterceptor(e) === true) return
      }

      if (errorHandler) return errorHandler(e)

      throw e
    }
  }

  return {
    run,
    updateConfig,
    ...ch,
  }
}
