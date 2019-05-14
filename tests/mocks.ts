import nock from 'nock'

import {IConfig} from '../src/config'
import {matches} from './setup'

import userContext from './fixtures/user.context'
import phoneContext from './fixtures/phone.context'
import organizationContext from './fixtures/organization.context'
import sessionContext from './fixtures/session.context'
import geoScopeContext from './fixtures/geo_scope.context'

export const mockContexts = (config: IConfig) => {
  nock(config.endpoints.um)
    .persist()

    .get(matches('context/session'))
    .optionally()
    .reply(200, sessionContext)

    .get(matches('context/user/phone'))
    .optionally()
    .reply(200, phoneContext)

    .get(matches('context/user'))
    .optionally()
    .reply(200, userContext)

    .get(matches('context/organization'))
    .optionally()
    .reply(200, organizationContext)

    .get(matches('context/geo_scope'))
    .optionally()
    .reply(200, geoScopeContext)

    .get(matches('context/foo'))
    .optionally()
    .reply(404)
}
