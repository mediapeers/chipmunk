"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const lodash_1 = require("lodash");
const sinon_1 = __importDefault(require("sinon"));
const cache_1 = require("../src/cache");
const setup_1 = require("./setup");
const src_1 = __importDefault(require("../src"));
const config = setup_1.setup();
let chipmunk;
let storage = {};
const storageMock = {
    setItem: (key, value) => storage[key] = value,
    getItem: (key) => storage[key],
    removeItem: (key) => delete storage[key],
    get length() { return lodash_1.keys(storage).length; },
    key: (index) => lodash_1.keys(storage)[index],
    clear: () => storage = {}
};
describe('runtime cache', () => {
    beforeEach(() => {
        chipmunk = src_1.default(config, { cache: { default: 'runtime' } });
    });
    afterEach(() => {
        chipmunk.cache.clear();
    });
    describe('basic functionality', () => {
        it('saves into cache', () => {
            sinon_1.default.stub(Date, 'now').returns(0);
            const expected = { foo: { expires: 60 * 60000, value: 'bar' } };
            chipmunk.cache.set('foo', 'bar', { noPrefix: true });
            chai_1.expect(cache_1._runtimeCache).to.eql(expected);
        });
        it('writes & reads from cache', () => {
            chipmunk.cache.set('foo', 'bar');
            chai_1.expect(chipmunk.cache.get('foo')).to.equal('bar');
        });
        it('returns null if value has expired', () => {
            sinon_1.default.stub(Date, 'now').returns(60 * 60000 + 1);
            cache_1._runtimeCache['foo'] = { expires: 60 * 60000, value: 'bar' };
            chai_1.expect(chipmunk.cache.get('foo', { noPrefix: true })).to.be.null;
        });
        it('drops single value from cache', () => {
            sinon_1.default.stub(Date, 'now').returns(0);
            cache_1._runtimeCache['foo'] = { expires: 60 * 60000, value: 'bar' };
            cache_1._runtimeCache['baz'] = { expires: 60 * 60000, value: 'bam' };
            const expected = {
                'foo': { expires: 60 * 60000, value: 'bar' }
            };
            chipmunk.cache.remove('baz', { noPrefix: true });
            chai_1.expect(cache_1._runtimeCache).to.eql(expected);
        });
        it('drops multiple values from cache by prefix', () => {
            sinon_1.default.stub(Date, 'now').returns(0);
            cache_1._runtimeCache['mallorca-foo'] = { expires: 60 * 60000, value: 'bar' };
            cache_1._runtimeCache['menorca-foo'] = { expires: 60 * 60000, value: 'bar' };
            cache_1._runtimeCache['mallorca-baz'] = { expires: 60 * 60000, value: 'bam' };
            const expected = {
                'menorca-foo': { expires: 60 * 60000, value: 'bar' }
            };
            chipmunk.cache.remove('mallorca*', { noPrefix: true });
            chai_1.expect(cache_1._runtimeCache).to.eql(expected);
        });
    });
    describe('convenience functionality', () => {
        it('updates existing value', () => {
            chipmunk.cache.set('foo', 2);
            chipmunk.cache.update('foo', (value) => value + 1);
            chai_1.expect(chipmunk.cache.get('foo')).to.equal(3);
        });
        it('updates or creates a value', () => {
            chipmunk.cache.update('foo', (value) => value + 1, { defaultValue: 5 });
            chai_1.expect(chipmunk.cache.get('foo')).to.equal(6);
        });
        it(`saves into cache, taking into account the current's config cache relevant headers`, () => {
            chipmunk.updateConfig({ headers: { 'Affiliation-Id': null, 'Role-Id': 5 } });
            sinon_1.default.stub(Date, 'now').returns(0);
            const expected = { '5-foo': { expires: 60 * 60000, value: 'bar' } };
            chipmunk.cache.set('foo', 'bar');
            chai_1.expect(cache_1._runtimeCache).to.eql(expected);
        });
    });
});
describe('storage cache', () => {
    beforeEach(() => {
        global['window'] = {
            localStorage: storageMock,
        };
        chipmunk = src_1.default(config, { cache: { default: 'storage' } });
    });
    afterEach(() => {
        chipmunk.cache.clear();
    });
    describe('basic functionality', () => {
        it('writes & reads from cache', () => {
            chipmunk.cache.set('foo', 'bar');
            chai_1.expect(chipmunk.cache.get('foo')).to.equal('bar');
        });
        it('returns null if value has expired', () => {
            const stub = sinon_1.default.stub(Date, 'now').returns(0);
            chipmunk.cache.set('foo', 'bar');
            stub.restore();
            sinon_1.default.stub(Date, 'now').returns(60 * 60000 + 1);
            chai_1.expect(chipmunk.cache.get('foo')).to.be.null;
        });
        it('drops single value from cache', () => {
            chipmunk.cache.set('foo', 'bar');
            chipmunk.cache.set('baz', 'bam');
            chipmunk.cache.remove('baz');
            chai_1.expect(chipmunk.cache.get('foo')).to.equal('bar');
            chai_1.expect(chipmunk.cache.get('baz')).to.be.null;
        });
        it('drops multiple values from cache by prefix', () => {
            chipmunk.cache.set('mallorca-foo', 'bar');
            chipmunk.cache.set('menorca-foo', 'bar');
            chipmunk.cache.set('mallorca-baz', 'bam');
            chipmunk.cache.remove('mallorca*');
            chai_1.expect(chipmunk.cache.get('mallorca-foo')).to.be.null;
            chai_1.expect(chipmunk.cache.get('mallorca-baz')).to.be.null;
            chai_1.expect(chipmunk.cache.get('menorca-foo')).to.equal('bar');
        });
    });
    describe('convenience functionality', () => {
        it('updates existing value', () => {
            chipmunk.cache.set('foo', 2);
            chipmunk.cache.update('foo', (value) => value + 1);
            chai_1.expect(chipmunk.cache.get('foo')).to.equal(3);
        });
        it('updates or creates a value', () => {
            chipmunk.cache.update('foo', (value) => value + 1, { defaultValue: 5 });
            chai_1.expect(chipmunk.cache.get('foo')).to.equal(6);
        });
        it(`saves into cache, taking into account the current's config cache relevant headers`, () => {
            chipmunk.updateConfig({ headers: { 'Affiliation-Id': null, 'Role-Id': 5 } });
            chipmunk.cache.set('foo', 'bar');
            chai_1.expect(chipmunk.cache.get('foo')).to.equal('bar');
            chipmunk.updateConfig({ headers: { 'Affiliation-Id': null, 'Role-Id': 8 } });
            chai_1.expect(chipmunk.cache.get('foo')).to.be.null;
        });
    });
});
//# sourceMappingURL=cache.test.js.map