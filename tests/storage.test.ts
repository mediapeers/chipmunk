import 'mocha'
import {expect} from 'chai'
import {get, merge} from 'lodash'
import sinon from 'sinon'

import context from '../src/context'
import createConfig from '../src/config'
import {internalStorage} from '../src/storage'

import {setup} from './setup'
import createChipmunk from '../src'

const config = setup()
let chipmunk

describe('runtimeStorage', () => {
  beforeEach(() => {
    chipmunk = createChipmunk(config)
  })
  afterEach(() => {
    chipmunk.runtimeStorage.clear()
  })

  it('saves into storage', () => {
    sinon.stub(Date, 'now').returns(0)
    const expected = { foo: { expires: 60*60000, value: 'bar' } }

    chipmunk.runtimeStorage.put('foo', 'bar')
    expect(internalStorage).to.eql(expected)
  })

  it('writes & reads from storage', () => {
    chipmunk.runtimeStorage.put('foo', 'bar')
    expect(chipmunk.runtimeStorage.fetch('foo')).to.equal('bar')
  })

  it('returns null if value has expired', () => {
    sinon.stub(Date, 'now').returns(60*60000 + 1)
    internalStorage['foo'] = { expires: 60*60000, value: 'bar' }

    expect(chipmunk.runtimeStorage.fetch('foo')).to.be.null
  })

  it('updates existing value', () => {
    chipmunk.runtimeStorage.put('foo', 2)
    chipmunk.runtimeStorage.change('foo', (value) => value+1)

    expect(chipmunk.runtimeStorage.fetch('foo')).to.equal(3)
  })

  it('updates or creates a value', () => {
    chipmunk.runtimeStorage.change('foo', (value) => value+1, 5)

    expect(chipmunk.runtimeStorage.fetch('foo')).to.equal(6)
  })

  it(`saves into storage, taking into account the current's config cache relevant headers`, () => {
    chipmunk.updateConfig({ headers: { 'Affiliation-Id': null, 'Role-Id': 5 } })
    sinon.stub(Date, 'now').returns(0)

    const expected = { '5-foo': { expires: 60*60000, value: 'bar' } }

    chipmunk.runtimeStorage.set('foo', 'bar')
    expect(internalStorage).to.eql(expected)
  })
})
