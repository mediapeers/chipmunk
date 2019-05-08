import 'mocha'
import {expect} from 'chai'
import nock from 'nock'

import createChipmunk from '../src'
import {setup, matches} from './setup'

const config = setup()
let chipmunk

//before(async () => {
  //await chipmunk(async (ch) => {
    //const result = await ch.action('um.session', 'create', {
      //body: {
        //email: 'johannes.gotzinger@bydeluxe.com',
        //password: 'xxx',
      //},
    //})

    //config = testConfig({
      //headers: {
        //'Session-Id': result.object.id
      //}
    //})
  //})
//})

describe('action', () => {
  beforeEach(() => {
    chipmunk = createChipmunk(config)
  })

  //afterEach(() => nock.cleanAll())

  describe('GET', () => {
    it('queries for users', async () => {
      nock(config.endpoints.um)
        .get(matches('/users'))
        .reply(200, { members: [ { id: 'first' }, { id: 'second' } ]})

      await chipmunk.run(async (ch) => {
        const result = await ch.action('um.user', 'query')
        expect(result.objects.length).to.be.gt(1)
      })
    })

    it('sends uri params', async () => {
      nock(config.endpoints.um)
        .get(matches('users/1659'))
        .reply(200, { id: 'one' })

      await chipmunk.run(async (ch) => {
        const result = await ch.action('um.user', 'get', { params: { user_ids: 1659 } })
        expect(result.objects.length).to.equal(1)
      })
    })

    it('sends additional params', async () => {
      nock(config.endpoints.um)
        .get(matches('users'))
        .query({ sort: 'created_at' })
        .reply(200, {})

      await chipmunk.run(async (ch) => {
        const result = await ch.action('um.user', 'query', { params: { sort: 'created_at' } })
        expect(result).to.be.ok
      })
    })
  })
})
