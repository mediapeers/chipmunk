import 'mocha'
import {expect} from 'chai'
import sinon from 'sinon'
import {get, merge} from 'lodash'
import context from '../src/context'
import createConfig from '../src/config'

import {setup} from './setup'
import createChipmunk from '../src'

const config = setup()
let chipmunk

describe('chipmunk.run', () => {
  beforeEach(() => {
    chipmunk = createChipmunk(config)
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

    it('passes an un-intercepted error to the optional error handler', async () => {
      const handler = sinon.fake()

      await chipmunk.run(async (ch) => {
        throw new Error('random error')
        const context = await ch.context('um.foo')
      }, handler)

      expect(handler.called).to.be.true
    })
  })
})
