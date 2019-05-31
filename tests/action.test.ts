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
        .reply(200, { members: [
          { '@context': 'https://um.api.mediapeers.mobi/v20140601/context/user', id: 'first' },
          { '@context': 'https://um.api.mediapeers.mobi/v20140601/context/user', id: 'second' },
        ]})

      await chipmunk.run(async (ch) => {
        const result = await ch.action('um.user', 'query')
        expect(result.objects.length).to.be.gt(1)
      })
    })

    it('throws if trying to access (not yet) resolved association data', async () => {
      const scope = nock(config.endpoints.um)
        .get(matches('/users'))
        .reply(200, { members: [
          { '@context': 'https://um.api.mediapeers.mobi/v20140601/context/user', id: 'first' },
          { '@context': 'https://um.api.mediapeers.mobi/v20140601/context/user', id: 'second' },
        ]})

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
        .reply(200, { members: [
          {
            '@context': 'https://um.api.mediapeers.mobi/v20140601/context/user',
            id: 'first',
            organization: { '@id': 'http://um.app/organization/1' },
          },
          {
            '@context': 'https://um.api.mediapeers.mobi/v20140601/context/user',
            id: 'second',
          },
        ]})

      await chipmunk.run(async (ch) => {
        const result = await ch.action('um.user', 'query')
        expect(result.object['@associations'].organization).to.eql('http://um.app/organization/1')
      })
    })

    // this is required because subclasses can have associations defined the super class has not
    // in this example the manager context has a 'geo_scopes' association, which the base user context is lacking
    it(`moves subclass specific association references`, async () => {
      const scope = nock(config.endpoints.um)
        .get(matches('/users'))
        .reply(200, {
          members: [
            {
              '@context': 'https://um.api.mediapeers.mobi/v20140601/context/user/manager',
              id: 'first',
              organization: { '@id': 'http://um.app/organizations/1' },
              geo_scopes: [
                { '@id': 'https://um.api.mediapeers.mobi/v20140601/geo_scope/UGA' },
                { '@id': 'https://um.api.mediapeers.mobi/v20140601/geo_scope/SWZ' },
              ],
            },
            {
              '@context': 'https://um.api.mediapeers.mobi/v20140601/context/user',
              id: 'second',
              organization: { '@id': 'http://um.app/organizations/1' },
            }
          ]
        })

      await chipmunk.run(async (ch) => {
        const result = await ch.action('um.user', 'query')
        expect(result.objects[0]['@associations'].organization).to.equal('http://um.app/organizations/1')
        expect(result.objects[0]['@associations'].geo_scopes).to.eql([
          'https://um.api.mediapeers.mobi/v20140601/geo_scope/UGA',
          'https://um.api.mediapeers.mobi/v20140601/geo_scope/SWZ',
        ])

        expect(result.objects[1]['@associations'].organization).to.equal('http://um.app/organizations/1')
      })
    })

    it(`returns pagination results`, async () => {
      const scope = nock(config.endpoints.um)
        .get(matches('/users'))
        .reply(200, {
          members: [ { '@context': 'https://um.api.mediapeers.mobi/v20140601/context/user', id: 'first' } ],
          '@total_pages': 3,
          '@total_count': 14,
          '@current_page': 1,
        })

      const expected = {
        total_pages: 3,
        total_count: 14,
        current_page: 1,
      }

      await chipmunk.run(async (ch) => {
        const result = await ch.action('um.user', 'query')
        expect(result.pagination).to.eql(expected)
      })
    })

    it(`returns reformatted aggregations`, async () => {
      const scope = nock(config.endpoints.um)
        .get(matches('/users'))
        .reply(200, {
          members: [ { '@context': 'https://um.api.mediapeers.mobi/v20140601/context/user', id: 'first' } ],
          aggregations: {
            count_by_gender: {
              buckets: [
                { key: 'male', doc_count: 13 },
                { key: 'female', doc_count: 21 },
              ]
            },
          },
        })

      const expected = {
        count_by_gender: [
          { value: 'male', count: 13 },
          { value: 'female', count: 21 },
        ]
      }

      await chipmunk.run(async (ch) => {
        const result = await ch.action('um.user', 'query')
        expect(result.aggregations).to.eql(expected)
      })
    })

    it('sends uri params', async () => {
      nock(config.endpoints.um)
        .get(matches('users/1659'))
        .reply(200, { '@context': 'https://um.api.mediapeers.mobi/v20140601/context/user', id: 'one' })

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
