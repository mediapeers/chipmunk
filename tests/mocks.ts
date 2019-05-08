import nock from 'nock'

import {IConfig} from '../src/config'
import {matches} from './setup'

import userContext from './fixtures/user.context'
import sessionContext from './fixtures/session.context'

export const mockContexts = (config: IConfig) => {
  nock(config.endpoints.um)
    .persist()

    .get(matches('context/session'))
    .optionally()
    .reply(200, sessionContext)

    .get(matches('context/user'))
    .optionally()
    .reply(200, userContext)

    .get(matches('context/foo'))
    .optionally()
    .reply(404)
}
