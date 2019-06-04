"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const lodash_1 = require("lodash");
const nock_1 = __importDefault(require("nock"));
const src_1 = __importDefault(require("../src"));
const setup_1 = require("./setup");
const config = setup_1.setup();
let chipmunk;
describe('action', () => {
    beforeEach(() => {
        chipmunk = src_1.default(config);
    });
    it('queries for users', () => __awaiter(this, void 0, void 0, function* () {
        nock_1.default(config.endpoints.um)
            .get(setup_1.matches('/users'))
            .reply(200, { members: [
                { '@context': 'https://um.api.mediapeers.mobi/v20140601/context/user', id: 'first' },
                { '@context': 'https://um.api.mediapeers.mobi/v20140601/context/user', id: 'second' },
            ] });
        yield chipmunk.run((ch) => __awaiter(this, void 0, void 0, function* () {
            const result = yield ch.action('um.user', 'query');
            chai_1.expect(result.objects.length).to.be.gt(1);
        }));
    }));
    it('throws if trying to access (not yet) resolved association data', () => __awaiter(this, void 0, void 0, function* () {
        const scope = nock_1.default(config.endpoints.um)
            .get(setup_1.matches('/users'))
            .reply(200, { members: [
                { '@context': 'https://um.api.mediapeers.mobi/v20140601/context/user', id: 'first' },
                { '@context': 'https://um.api.mediapeers.mobi/v20140601/context/user', id: 'second' },
            ] });
        yield chipmunk.run((ch) => __awaiter(this, void 0, void 0, function* () {
            const result = yield ch.action('um.user', 'query');
            chai_1.expect(() => result.objects[0].organization).to.throw(/association not loaded/);
            chai_1.expect(() => result.objects[1].organization).to.throw(/association not loaded/);
            chai_1.expect(() => result.objects[1].country.name).to.throw(/association not loaded/);
        }));
    }));
    it(`moves association reference into '@associations'`, () => __awaiter(this, void 0, void 0, function* () {
        const scope = nock_1.default(config.endpoints.um)
            .get(setup_1.matches('/users'))
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
            ] });
        yield chipmunk.run((ch) => __awaiter(this, void 0, void 0, function* () {
            const result = yield ch.action('um.user', 'query');
            chai_1.expect(result.object['@associations'].organization).to.eql('http://um.app/organization/1');
        }));
    }));
    it(`moves subclass specific association references`, () => __awaiter(this, void 0, void 0, function* () {
        const scope = nock_1.default(config.endpoints.um)
            .get(setup_1.matches('/users'))
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
        });
        yield chipmunk.run((ch) => __awaiter(this, void 0, void 0, function* () {
            const result = yield ch.action('um.user', 'query');
            chai_1.expect(result.objects[0]['@associations'].organization).to.equal('http://um.app/organizations/1');
            chai_1.expect(result.objects[0]['@associations'].geo_scopes).to.eql([
                'https://um.api.mediapeers.mobi/v20140601/geo_scope/UGA',
                'https://um.api.mediapeers.mobi/v20140601/geo_scope/SWZ',
            ]);
            chai_1.expect(result.objects[1]['@associations'].organization).to.equal('http://um.app/organizations/1');
        }));
    }));
    it(`returns pagination results`, () => __awaiter(this, void 0, void 0, function* () {
        const scope = nock_1.default(config.endpoints.um)
            .get(setup_1.matches('/users'))
            .reply(200, {
            members: [{ '@context': 'https://um.api.mediapeers.mobi/v20140601/context/user', id: 'first' }],
            '@total_pages': 3,
            '@total_count': 14,
            '@current_page': 1,
        });
        const expected = {
            total_pages: 3,
            total_count: 14,
            current_page: 1,
        };
        yield chipmunk.run((ch) => __awaiter(this, void 0, void 0, function* () {
            const result = yield ch.action('um.user', 'query');
            chai_1.expect(result.pagination).to.eql(expected);
        }));
    }));
    it(`returns reformatted aggregations`, () => __awaiter(this, void 0, void 0, function* () {
        const scope = nock_1.default(config.endpoints.um)
            .get(setup_1.matches('/users'))
            .reply(200, {
            members: [{ '@context': 'https://um.api.mediapeers.mobi/v20140601/context/user', id: 'first' }],
            aggregations: {
                count_by_gender: {
                    buckets: [
                        { key: 'male', doc_count: 13 },
                        { key: 'female', doc_count: 21 },
                    ]
                },
            },
        });
        const expected = {
            count_by_gender: [
                { value: 'male', count: 13 },
                { value: 'female', count: 21 },
            ]
        };
        yield chipmunk.run((ch) => __awaiter(this, void 0, void 0, function* () {
            const result = yield ch.action('um.user', 'query');
            chai_1.expect(result.aggregations).to.eql(expected);
        }));
    }));
    it('sends uri params', () => __awaiter(this, void 0, void 0, function* () {
        nock_1.default(config.endpoints.um)
            .get(setup_1.matches('users/1659'))
            .reply(200, { '@context': 'https://um.api.mediapeers.mobi/v20140601/context/user', id: 'one' });
        yield chipmunk.run((ch) => __awaiter(this, void 0, void 0, function* () {
            const result = yield ch.action('um.user', 'get', { params: { user_ids: 1659 } });
            chai_1.expect(result.objects.length).to.equal(1);
        }));
    }));
    it('uses forced member action endpoint', () => __awaiter(this, void 0, void 0, function* () {
        nock_1.default(config.endpoints.um)
            .get(setup_1.matches('user/1659'))
            .reply(200, { '@context': 'https://um.api.mediapeers.mobi/v20140601/context/user', id: 'one' });
        yield chipmunk.action('um.user', 'member.get', { params: { user_id: 1659 } });
    }));
    it('sends additional params', () => __awaiter(this, void 0, void 0, function* () {
        nock_1.default(config.endpoints.um)
            .get(setup_1.matches('users'))
            .query({ sort: 'created_at' })
            .reply(200, {});
        yield chipmunk.run((ch) => __awaiter(this, void 0, void 0, function* () {
            const result = yield ch.action('um.user', 'query', { params: { sort: 'created_at' } });
            chai_1.expect(result).to.be.ok;
        }));
    }));
    it('sends additional headers', () => __awaiter(this, void 0, void 0, function* () {
        chipmunk.updateConfig({ headers: { 'Session-Id': '56BA' } });
        nock_1.default(config.endpoints.um)
            .matchHeader('Session-Id', '56BA')
            .matchHeader('Funky-Header', 'hu')
            .get(setup_1.matches('users'))
            .reply(200, {});
        const promise = chipmunk.action('um.user', 'query', { headers: { 'Funky-Header': 'hu', 'Ignored': null } });
        yield chai_1.expect(promise).to.be.fulfilled;
    }));
    it('does not send a session id', () => __awaiter(this, void 0, void 0, function* () {
        chipmunk.updateConfig({ headers: { 'Session-Id': '56BA' } });
        nock_1.default(config.endpoints.um)
            .matchHeader('Session-Id', '')
            .get(setup_1.matches('users'))
            .reply(404, {});
        const promise = chipmunk.action('um.user', 'query', { headers: { 'Session-Id': null } });
        yield chai_1.expect(promise).to.be.rejected;
    }));
    it('resolves schema', () => __awaiter(this, void 0, void 0, function* () {
        nock_1.default(config.endpoints.um)
            .get(setup_1.matches('/users'))
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
            .get(setup_1.matches('/organizations/3'))
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
        });
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
        ];
        yield chipmunk.run((ch) => __awaiter(this, void 0, void 0, function* () {
            const result = yield ch.action('um.user', 'query', {
                schema: 'first_name, last_name, organization { name }'
            });
            chai_1.expect(result.objects).to.eql(expected);
        }));
    }));
    it('returns raw results', () => __awaiter(this, void 0, void 0, function* () {
        nock_1.default(config.endpoints.um)
            .get(setup_1.matches('/users'))
            .reply(200, { members: [{ id: 'first', organization: { name: 'nested' } }, { id: 'second' }] });
        const expected = { id: 'first', organization: { name: 'nested' } };
        yield chipmunk.run((ch) => __awaiter(this, void 0, void 0, function* () {
            const result = yield ch.action('um.user', 'query', { raw: true });
            chai_1.expect(result.objects[0]).to.eql(expected);
        }));
    }));
    describe('proxied via tuco', () => {
        it('throws an error if proxy was requested but no schema given', () => __awaiter(this, void 0, void 0, function* () {
            const block = chipmunk.run((ch) => __awaiter(this, void 0, void 0, function* () {
                yield ch.action('um.user', 'query', {
                    proxy: true,
                });
            }));
            yield chai_1.expect(block).to.be.rejectedWith(/supported only if a schema is given/);
        }));
        it('forwards the request to tuco', () => __awaiter(this, void 0, void 0, function* () {
            let body;
            nock_1.default(config.endpoints.tuco)
                .post('/proxy', (_body) => {
                body = _body;
                return true;
            })
                .reply(200, { members: [
                    { '@context': 'https://um.api.mediapeers.mobi/v20140601/context/user', id: 'first' },
                    { '@context': 'https://um.api.mediapeers.mobi/v20140601/context/user', id: 'second' },
                ] });
            yield chipmunk.action('um.user', 'query', {
                proxy: true,
                schema: 'id, first_name',
            });
            chai_1.expect(lodash_1.get(body, 'config.endpoints')).to.exist;
            chai_1.expect(lodash_1.get(body, 'config.headers')).to.exist;
            chai_1.expect(lodash_1.get(body, 'config.errorInterceptor')).not.to.exist;
            chai_1.expect(lodash_1.get(body, 'config.watcher')).not.to.exist;
            chai_1.expect(lodash_1.get(body, 'opts.schema')).to.exist;
            chai_1.expect(lodash_1.get(body, 'opts.proxy')).not.to.exist;
        }));
    });
});
//# sourceMappingURL=action.test.js.map