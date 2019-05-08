import context, {IContext} from './context'
import action, {IResult, IActionOpts} from './action'
import createConfig, {IConfig} from './config'

export interface IInterface {
  config: IConfig
  context: (urlOrAppModel: string) => Promise<IContext>
  action: (appModel: string, actionName: string, opts?: IActionOpts) => Promise<IResult>
}

export interface IChipmunk extends IInterface {
  updateConfig: (overrides?: Partial<IConfig>) => IConfig
  run: (ch: IChipmunk) => Promise<any>
}

export default (...overrides: Partial<IConfig>[]): IChipmunk => {
  let config = createConfig.apply(null, overrides)

  const ch: IInterface = {
    get config() { return config },
    context: (urlOrAppModel) => context(urlOrAppModel, config),
    action: (appModel, actionName, opts = {}) => action(appModel, actionName, opts, config),
  }

  const updateConfig = (overrides) => {
    return config = createConfig(config, overrides)
  }

  const run = async (block) => {
    try {
      await block(ch)
    }
    catch (e) {
      if (config.errorInterceptor) {
        if (config.errorInterceptor(e) === true) return
      }

      throw e
    }
  }

  return {
    run,
    updateConfig,
    ...ch,
  }
}
