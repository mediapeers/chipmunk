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
const association_1 = require("../src/association");
const setup_1 = require("./setup");
const config = setup_1.setup();
let chipmunk;
describe('association', () => {
    beforeEach(() => {
        chipmunk = src_1.default(config);
    });
    describe('extractProps', () => {
        it('extracts from belongs to references', () => __awaiter(this, void 0, void 0, function* () {
            const context = yield chipmunk.context('um.organization');
            const references = [
                'https://um.api.mediapeers.mobi/v20140601/organization/104',
                'https://um.api.mediapeers.mobi/v20140601/organization/105',
            ];
            const expected = {
                id: ['104', '105']
            };
            chai_1.expect(association_1.extractProps(context, references)).to.eql(expected);
        }));
        it('extracts from has many references', () => __awaiter(this, void 0, void 0, function* () {
            const context = yield chipmunk.context('um.user/phone');
            const references = [
                'https://um.api.mediapeers.mobi/v20140601/users/1659/phones',
                'https://um.api.mediapeers.mobi/v20140601/users/1660/phones',
            ];
            const expected = {
                user_id: ['1659', '1660']
            };
            chai_1.expect(association_1.extractProps(context, references)).to.eql(expected);
        }));
    });
    describe('fetch', () => {
        describe('belongs to', () => {
            it('fetches the organizations for a set of users', () => __awaiter(this, void 0, void 0, function* () {
                nock_1.default(config.endpoints.um)
                    .get(setup_1.matches('/organizations/104,105'))
                    .reply(200, { members: [
                        { '@context': 'https://um.api.mediapeers.mobi/v20140601/context/user', id: 'first' },
                        { '@context': 'https://um.api.mediapeers.mobi/v20140601/context/user', id: 'second' },
                    ] });
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
                ];
                const result = yield chipmunk.fetch(users, 'organization');
                chai_1.expect(result.objects.length).to.be.gt(1);
            }));
        });
        describe('has many', () => {
            it('fetches the phones for a set of users', () => __awaiter(this, void 0, void 0, function* () {
                nock_1.default(config.endpoints.um)
                    .get(setup_1.matches('/users/1659,1660/phones'))
                    .reply(200, { members: [
                        { '@context': 'https://um.api.mediapeers.mobi/v20140601/context/user', id: 'first' },
                        { '@context': 'https://um.api.mediapeers.mobi/v20140601/context/user', id: 'second' },
                    ] });
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
                ];
                const result = yield chipmunk.fetch(users, 'phones');
                chai_1.expect(result.objects.length).to.be.gt(1);
            }));
        });
        describe('has and belongs to many', () => {
            it('fetches the geo scopes for a set of users', () => __awaiter(this, void 0, void 0, function* () {
                nock_1.default(config.endpoints.um)
                    .get(setup_1.matches('/geo_scopes/UGA,SWZ,UZB,XEU'))
                    .reply(200, { members: [
                        { '@context': 'https://um.api.mediapeers.mobi/v20140601/context/geo_scope', id: 'UGA' },
                        { '@context': 'https://um.api.mediapeers.mobi/v20140601/context/geo_scope', id: 'SWZ' },
                        { '@context': 'https://um.api.mediapeers.mobi/v20140601/context/geo_scope', id: 'UZB' },
                        { '@context': 'https://um.api.mediapeers.mobi/v20140601/context/geo_scope', id: 'XEU' },
                    ] });
                const users = [
                    {
                        '@id': 'https://um.api.mediapeers.mobi/v20140601/user/1',
                        '@context': 'https://um.api.mediapeers.mobi/v20140601/context/user',
                        '@type': 'user',
                        '@associations': {},
                        id: 1,
                    },
                    {
                        '@id': 'https://um.api.mediapeers.mobi/v20140601/user/1659',
                        '@context': 'https://um.api.mediapeers.mobi/v20140601/context/user/manager',
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
                        '@context': 'https://um.api.mediapeers.mobi/v20140601/context/user/manager',
                        '@type': 'user',
                        '@associations': {
                            geo_scopes: [
                                'https://um.api.mediapeers.mobi/v20140601/geo_scope/UZB',
                                'https://um.api.mediapeers.mobi/v20140601/geo_scope/XEU',
                            ],
                        },
                        id: 1660,
                    }
                ];
                const result = yield chipmunk.fetch(users, 'geo_scopes');
                chai_1.expect(result.objects.length).to.be.gt(1);
            }));
        });
    });
    describe('assign', () => {
        it('assigns belongs to associations', () => {
            const targets = [
                {
                    '@type': 'user',
                    '@associations': {},
                    organization: null,
                },
                {
                    '@type': 'user',
                    '@associations': {
                        organization: 'https://um.api.mediapeers.mobi/v20140601/organization/105',
                    },
                    organization: null,
                },
            ];
            const objects = [
                {
                    '@type': 'organization',
                    '@id': 'https://um.api.mediapeers.mobi/v20140601/organization/105',
                },
                {
                    '@type': 'organization',
                    '@id': 'https://um.api.mediapeers.mobi/v20140601/organization/106',
                },
            ];
            chipmunk.assign(targets, objects, 'organization');
            chai_1.expect(targets[0]['organization']).to.be.null;
            chai_1.expect(targets[1]['organization']).to.exist;
        });
        it('assigns HABTM associations', () => {
            const targets = [
                {
                    '@type': 'user',
                    '@associations': {
                        geo_scopes: [
                            'https://um.api.mediapeers.mobi/v20140601/geo_scope/UGA',
                            'https://um.api.mediapeers.mobi/v20140601/geo_scope/SWZ',
                        ],
                    },
                    geo_scopes: null,
                },
                {
                    '@type': 'user',
                    '@associations': {
                        organization: 'https://um.api.mediapeers.mobi/v20140601/organization/105',
                        geo_scopes: [
                            'https://um.api.mediapeers.mobi/v20140601/geo_scope/XEU',
                            'https://um.api.mediapeers.mobi/v20140601/geo_scope/UGA',
                        ],
                    },
                    geo_scopes: null,
                },
            ];
            const objects = [
                {
                    '@type': 'geo_scope',
                    '@id': 'https://um.api.mediapeers.mobi/v20140601/geo_scope/SWZ',
                },
                {
                    '@type': 'geo_scope',
                    '@id': 'https://um.api.mediapeers.mobi/v20140601/geo_scope/UGA',
                },
                {
                    '@type': 'geo_scope',
                    '@id': 'https://um.api.mediapeers.mobi/v20140601/geo_scope/XEU',
                },
            ];
            chipmunk.assign(targets, objects, 'geo_scopes');
            chai_1.expect(lodash_1.get(targets, `[0].geo_scopes[0]['@id']`)).to.equal('https://um.api.mediapeers.mobi/v20140601/geo_scope/UGA');
            chai_1.expect(lodash_1.get(targets, `[1].geo_scopes[0]['@id']`)).to.equal('https://um.api.mediapeers.mobi/v20140601/geo_scope/XEU');
            chai_1.expect(lodash_1.get(targets, `[1].geo_scopes[1]['@id']`)).to.equal('https://um.api.mediapeers.mobi/v20140601/geo_scope/UGA');
        });
        it('assigns has many associations', () => {
            const targets = [
                {
                    '@type': 'user',
                    '@id': 'https://um.api.mediapeers.mobi/v20140601/user/1660',
                    '@associations': {
                        phones: 'https://um.api.mediapeers.mobi/v20140601/users/1660/phones',
                    },
                    phones: null,
                },
                {
                    '@type': 'user',
                    '@id': 'https://um.api.mediapeers.mobi/v20140601/user/1661',
                    '@associations': {
                        phones: 'https://um.api.mediapeers.mobi/v20140601/users/1661/phones',
                    },
                    phones: null,
                },
            ];
            const objects = [
                {
                    '@type': 'phone',
                    '@id': 'https://um.api.mediapeers.mobi/v20140601/user/phone/4',
                    '@associations': {
                        user: 'https://um.api.mediapeers.mobi/v20140601/user/1660',
                    },
                },
                {
                    '@type': 'phone',
                    '@id': 'https://um.api.mediapeers.mobi/v20140601/user/phone/5',
                    '@associations': {
                        user: 'https://um.api.mediapeers.mobi/v20140601/user/1660',
                    },
                },
            ];
            chipmunk.assign(targets, objects, 'phones');
            chai_1.expect(lodash_1.get(targets, '[0].phones.length')).to.equal(2);
            chai_1.expect(lodash_1.get(targets, '[1].phones')).to.be.null;
        });
    });
});
//# sourceMappingURL=association.test.js.map