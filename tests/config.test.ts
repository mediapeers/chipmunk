import 'mocha'
import {expect} from 'chai'
import {get, merge} from 'lodash'
import context from '../src/context'
import createConfig from '../src/config'

import {setup} from './setup'
import createChipmunk from '../src'

const config = setup()
let chipmunk

describe('config', () => {
  beforeEach(() => {
    chipmunk = createChipmunk(config)
  })

  it('returns an object', () => {
    expect(createConfig()).to.be.a('Object')
  })

  it('updates the settings', () => {
    const conf = createConfig({ endpoints: { um: 'http://um.app' } })

    let value = get(conf, 'endpoints.um')
    expect(value).to.equal('http://um.app')
  })

  it('merges multiple configs', () => {
    const conf = createConfig(
      { endpoints: { um: 'http://um.app' } },
      { devMode: true }
    )

    expect(conf.endpoints.um).to.equal('http://um.app')
    expect(conf.devMode).to.be.true
  })

  describe('#cachePrefix', () => {
    it('uses affiliation and role as prefix', () => {
      const conf = createConfig({ headers: { 'Affiliation-Id': 'mpx', 'Role-Id': 5, 'Session-Id': '24FA' } })
      expect(conf.cachePrefix).to.equal('mpx-5')
    })

    it('uses the session id as prefix', () => {
      const conf = createConfig({ headers: { 'Session-Id': '24FA' } })
      expect(conf.cachePrefix).to.equal('24FA')
    })

    it('uses _anonymous_ as prefix', () => {
      const conf = createConfig()
      expect(conf.cachePrefix).to.equal('anonymous')
    })
  })

  describe('with error interceptor', () => {
    it('ignores the error if the interceptor returns true', async () => {
      chipmunk.updateConfig({ errorInterceptor: (err) => true })

      const block = chipmunk.run(async (ch) => {
        const context = await ch.context('um.foo')
      })

      await expect(block).to.eventually.be.fulfilled
    })

    it('throws an error if the interceptor does not return true', async () => {
      chipmunk.updateConfig({ errorInterceptor: (err) => null })

      const block = chipmunk.run(async (ch) => {
        const context = await ch.context('um.foo')
      })

      await expect(block).to.be.rejectedWith('Not Found')
    })

    // NOTE: this is an example how differentiate request specific errors from other errors..
    it('throws an error if the original error was not because of an unsuccessful request', async () => {
      chipmunk.updateConfig({ errorInterceptor: (err) => err.name === 'RequestError' })

      const block = chipmunk.run(async (ch) => {
        throw new Error('random error')
        const context = await ch.context('um.foo')
      })

      await expect(block).to.be.rejectedWith('random')
    })
  })
})
