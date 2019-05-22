import 'mocha'
import {expect} from 'chai'
import nock from 'nock'

import createChipmunk from '../src'
import {setup, matches} from './setup'

const config = setup()
let chipmunk

describe('action', () => {
  beforeEach(() => {
    chipmunk = createChipmunk(config)
  })

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

    it('throws if trying to access (not yet) resolved association data', async () => {
      const scope = nock(config.endpoints.um)
        .get(matches('/users'))
        .reply(200, { members: [ { id: 'first' }, { id: 'second' } ]})

      await chipmunk.run(async (ch) => {
        const result = await ch.action('um.user', 'query')
        expect(() => result.objects[0].organization).to.throw(/association not loaded/)
        expect(() => result.objects[1].organization).to.throw(/association not loaded/)
        expect(() => result.objects[1].country.name).to.throw(/association not loaded/)
      })
    })

    it(`moves association reference into '@associations'`, async () => {
      const scope = nock(config.endpoints.um)
        .get(matches('/users'))
        .reply(200, { members: [ { id: 'first', organization: { '@id': 'http://um.app/organization/1' } }, { id: 'second' } ]})

      await chipmunk.run(async (ch) => {
        const result = await ch.action('um.user', 'query')
        expect(result.object['@associations'].organization).to.eql('http://um.app/organization/1')
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

    it('throws an error in devMode if required param was missing', async () => {
      chipmunk.updateConfig({ devMode: true })

      nock(config.endpoints.um)
        .get(matches('users'))
        .reply(200, {})

      const promise = chipmunk.action('um.user', 'get', { params: {} })

      await expect(promise).to.be.rejectedWith('Required param')
    })

    it('sends additional headers', async () => {
			chipmunk.updateConfig({ headers: { 'Session-Id': '56BA' } })

      nock(config.endpoints.um)
				.matchHeader('Session-Id', '56BA')
				.matchHeader('Funky-Header', 'hu')
        .get(matches('users'))
        .reply(200, {})

      const promise = chipmunk.action('um.user', 'query', { headers: { 'Funky-Header': 'hu', 'Ignored': null } })
			await expect(promise).to.be.fulfilled
    })

		// 'badheaders' option seems not to work with superagent :(
    it('does not send a session id', async () => {
			chipmunk.updateConfig({ headers: { 'Session-Id': '56BA' } })

      nock(config.endpoints.um)
        // nock performs a string check on the value. meaning we have to check for Session-Id to equal to '' to verify it is not sent
				.matchHeader('Session-Id', '')
        .get(matches('users'))
        .reply(404, {})

      const promise = chipmunk.action('um.user', 'query', { headers: { 'Session-Id': null } })
			await expect(promise).to.be.rejected
    })

    it('resolves schema', async () => {
      nock(config.endpoints.um)
        .get(matches('/users'))
        .reply(200, {
          members: [
            {
              '@type': 'user',
              '@context': 'https://um.api.mediapeers.mobi/v20140601/context/user',
              '@id': 'https://um.api.mediapeers.mobi/v20140601/user/1',
              organization: {
                '@id': 'https://um.api.mediapeers.mobi/v20140601/organization/3',
              },
              id: 1,
              first_name: 'philipp',
              last_name: 'goetzinger',
              gender: 'male'
            },
            {
              '@type': 'user',
              '@context': 'https://um.api.mediapeers.mobi/v20140601/context/user',
              '@id': 'https://um.api.mediapeers.mobi/v20140601/user/2',
              organization: {
                '@id': 'https://um.api.mediapeers.mobi/v20140601/organization/3',
              },
              id: 2,
              first_name: 'antonie',
              gender: 'female'
            },
          ]
        })

        .get(matches('/organizations/3'))
        .reply(200, {
          members: [
            {
              '@type': 'organization',
              '@context': 'https://um.api.mediapeers.mobi/v20140601/context/organization',
              '@id': 'https://um.api.mediapeers.mobi/v20140601/organization/3',
              id: 3,
              name: 'graefschaft',
            },
          ]
        })

      const expected = [
        {
          '@type': 'user',
          '@context': 'https://um.api.mediapeers.mobi/v20140601/context/user',
          '@id': 'https://um.api.mediapeers.mobi/v20140601/user/1',
          '@associations': {
            organization: 'https://um.api.mediapeers.mobi/v20140601/organization/3',
          },
          first_name: 'philipp',
          last_name: 'goetzinger',
          organization: {
            '@type': 'organization',
            '@context': 'https://um.api.mediapeers.mobi/v20140601/context/organization',
            '@id': 'https://um.api.mediapeers.mobi/v20140601/organization/3',
            '@associations': {},
            name: 'graefschaft',
          },
        },
        {
          '@type': 'user',
          '@context': 'https://um.api.mediapeers.mobi/v20140601/context/user',
          '@id': 'https://um.api.mediapeers.mobi/v20140601/user/2',
          '@associations': {
            organization: 'https://um.api.mediapeers.mobi/v20140601/organization/3',
          },
          first_name: 'antonie',
          organization: {
            '@type': 'organization',
            '@context': 'https://um.api.mediapeers.mobi/v20140601/context/organization',
            '@id': 'https://um.api.mediapeers.mobi/v20140601/organization/3',
            '@associations': {},
            name: 'graefschaft',
          },
        },
      ]

      await chipmunk.run(async (ch) => {
        const result = await ch.action('um.user', 'query', {
          schema: 'first_name, last_name, organization { name }'
        })

        expect(result.objects).to.eql(expected)
      })
    })

    it('returns raw results', async () => {
      nock(config.endpoints.um)
        .get(matches('/users'))
        .reply(200, { members: [ { id: 'first', organization: { name: 'nested' } }, { id: 'second' } ]})

      const expected = { id: 'first', organization: { name: 'nested' } }

      await chipmunk.run(async (ch) => {
        const result = await ch.action('um.user', 'query', { raw: true })
        expect(result.objects[0]).to.eql(expected)
      })
    })
  })
})
