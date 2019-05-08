import config, {IConfig} from '../src/config'
import {merge} from 'lodash'
import chaiAsPromised from 'chai-as-promised'
import chai from 'chai'
import chipmunk, {IChipmunk} from '../src'

import {mockContexts} from './mocks'

const DEFAULT_CONFIG = {
  timestamp: null,
  headers: {
    'Affiliation-Id': 'mpx',
  },
  endpoints: {
    um: "https://um.api.mediapeers.mobi/v20140601",
    pm: "https://pm.api.mediapeers.mobi/v20140601",
    am: "https://am.api.mediapeers.mobi/v20140601",
    ac: "https://ac.api.mediapeers.mobi/v20140601",
    sm: "https://sm.api.mediapeers.mobi/v20140601",
    mc: "https://mc.api.mediapeers.mobi/v20140601",
  },
}

export const setup = (overrides?: Partial<IConfig>): IConfig => {
  const conf = config(DEFAULT_CONFIG, overrides)

  before(() => {
    mockContexts(conf)
    chai.use(chaiAsPromised)
  })

  return conf
}

export const matches = (needle: string) => {
  return (uri) => uri.includes(needle)
}
