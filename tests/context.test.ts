import 'mocha'
import {expect} from 'chai'
import {keys} from 'lodash'

import createChipmunk from '../src'
import {setup} from './setup'

const config = setup()
let chipmunk

describe('context', () => {
  beforeEach(() => {
    chipmunk = createChipmunk(config)
  })

  it('returns a valid context', async () => {
    await chipmunk.run(async (ch) => {
      const userContext = await ch.context('um.user')
      expect(userContext.properties).not.to.be.empty
    })
  })

  it('exposes associations', async () => {
    await chipmunk.run(async (ch) => {
      const userContext = await ch.context('um.user')
      expect(userContext.associations.firt_name).to.be.undefined
      expect(userContext.associations.organization).not.to.be.empty
    })
  })

  it('fails to find a random context', async () => {
    await chipmunk.run(async (ch) => {
      const promise = ch.context('um.foo')
      await expect(promise).to.be.rejectedWith('Not Found')
    })
  })
})
