import config, {IConfig} from '../src/config'
import {merge, isEmpty} from 'lodash'
import chaiAsPromised from 'chai-as-promised'
import chai, {expect} from 'chai'
import nock from 'nock'
import fs from 'fs'
import yaml from 'js-yaml'
import {execSync} from 'child_process'
import sinon from 'sinon'

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
    nock.cleanAll()
    mockContexts(conf)
    chai.use(chaiAsPromised)
  })

  afterEach(() => {
    sinon.restore()
  })

  return conf
}

export const matches = (needle: string) => {
  return (uri) => uri.includes(needle)
}

export const readCredentials = () => {
  const content = execSync('scrambler read tests/credentials.yml').toString()
  return yaml.safeLoad(content)
}
