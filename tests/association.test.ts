import 'mocha'
import {expect} from 'chai'
import nock from 'nock'

import createChipmunk from '../src'
import {extractProps} from '../src/association'
import {setup, matches} from './setup'

const config = setup()
let chipmunk

describe('association', () => {
  beforeEach(() => {
    chipmunk = createChipmunk(config)
  })

  describe('extractProps', () => {
    it('extracts from belongs to references', async () => {
      const context = await chipmunk.context('um.organization')
      const references = [
        'https://um.api.mediapeers.mobi/v20140601/organization/104',
        'https://um.api.mediapeers.mobi/v20140601/organization/105',
      ]

      const expected = {
        id: ['104', '105']
      }

      expect(extractProps(context, references)).to.eql(expected)
    })

    it('extracts from has many references', async () => {
      const context = await chipmunk.context('um.user/phone')
      const references = [
        'https://um.api.mediapeers.mobi/v20140601/users/1659/phones',
        'https://um.api.mediapeers.mobi/v20140601/users/1660/phones',
      ]

      const expected = {
        user_id: ['1659', '1660']
      }

      expect(extractProps(context, references)).to.eql(expected)
    })
  })

  describe('fetch', () => {
    describe('belongs to', () => {
      it('fetches the organizations for a set of users', async () => {
        nock(config.endpoints.um)
          .get(matches('/organizations/104,105'))
          .reply(200, { members: [ { id: 'first' }, { id: 'second' } ]})

        const users = [
          {
            '@id': 'https://um.api.mediapeers.mobi/v20140601/user/1659',
            '@context': 'https://um.api.mediapeers.mobi/v20140601/context/user',
            '@type': 'user',
            '@associations': {
              organization: 'https://um.api.mediapeers.mobi/v20140601/organization/104',
            },
            id: 1659,
            organization_id: 104,
          },
          {
            '@id': 'https://um.api.mediapeers.mobi/v20140601/user/1660',
            '@context': 'https://um.api.mediapeers.mobi/v20140601/context/user',
            '@type': 'user',
            '@associations': {
              organization: 'https://um.api.mediapeers.mobi/v20140601/organization/105',
            },
            id: 1659,
            organization_id: 105,
          }
        ]

        const result = await chipmunk.fetch(users, 'organization')
        expect(result.objects.length).to.be.gt(1)
      })
    })

    describe('has many', () => {
      it('fetches the phones for a set of users', async () => {
        nock(config.endpoints.um)
          .get(matches('/users/1659,1660/phones'))
          .reply(200, { members: [ { id: 'first' }, { id: 'second' } ]})

        const users = [
          {
            '@id': 'https://um.api.mediapeers.mobi/v20140601/user/1659',
            '@context': 'https://um.api.mediapeers.mobi/v20140601/context/user',
            '@type': 'user',
            '@associations': {
              phones: 'https://um.api.mediapeers.mobi/v20140601/users/1659/phones',
            },
            id: 1659,
          },
          {
            '@id': 'https://um.api.mediapeers.mobi/v20140601/user/1660',
            '@context': 'https://um.api.mediapeers.mobi/v20140601/context/user',
            '@type': 'user',
            '@associations': {
              phones: 'https://um.api.mediapeers.mobi/v20140601/users/1660/phones',
            },
            id: 1660,
          }
        ]

        const result = await chipmunk.fetch(users, 'phones')
        expect(result.objects.length).to.be.gt(1)
      })
    })

    describe('has and belongs to many', () => {
      it('fetches the geo scopes for a set of users', async () => {
        nock(config.endpoints.um)
          .get(matches('/geo_scopes/UGA,SWZ,UZB,XEU'))
          .reply(200, { members: [ { id: 'first' }, { id: 'second' } ]})

        const users = [
          {
            '@id': 'https://um.api.mediapeers.mobi/v20140601/user/1659',
            '@context': 'https://um.api.mediapeers.mobi/v20140601/context/user',
            '@type': 'user',
            '@associations': {
              geo_scopes: [
                'https://um.api.mediapeers.mobi/v20140601/geo_scope/UGA',
                'https://um.api.mediapeers.mobi/v20140601/geo_scope/SWZ',
              ],
            },
            id: 1659,
          },
          {
            '@id': 'https://um.api.mediapeers.mobi/v20140601/user/1660',
            '@context': 'https://um.api.mediapeers.mobi/v20140601/context/user',
            '@type': 'user',
            '@associations': {
              geo_scopes: [
                'https://um.api.mediapeers.mobi/v20140601/geo_scope/UZB',
                'https://um.api.mediapeers.mobi/v20140601/geo_scope/XEU',
              ],
            },
            id: 1660,
          }
        ]

        const result = await chipmunk.fetch(users, 'geo_scopes')
        expect(result.objects.length).to.be.gt(1)
      })
    })
  })
})
