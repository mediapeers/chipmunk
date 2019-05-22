import 'mocha'
import {expect} from 'chai'
import sinon from 'sinon'
import {get, merge} from 'lodash'
import context from '../src/context'
import createConfig from '../src/config'

import {setup, nap} from './setup'
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

  describe('#performLater', () => {
    it('calls perform later handlers after requests have been made', async () => {
      const handler1 = sinon.fake()
      const handler2 = sinon.fake()

      chipmunk.performLater(handler1)
      chipmunk.performLater(handler2)

      await chipmunk.context('um.user')
      await chipmunk.context('um.organization')

      await nap(200)

      expect(handler1.called).to.be.true
      expect(handler2.called).to.be.true
    })
  })
})
