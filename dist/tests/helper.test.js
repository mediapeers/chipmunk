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
const nock_1 = __importDefault(require("nock"));
const src_1 = __importDefault(require("../src"));
const setup_1 = require("./setup");
const config = setup_1.setup();
const credentials = setup_1.readCredentials();
let chipmunk;
const inactive = (...args) => { };
inactive('helper runs', () => {
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        nock_1.default.restore();
        chipmunk = src_1.default(config);
        const { email, password } = credentials;
        const result = yield chipmunk.action('um.session', 'create', {
            body: {
                email,
                password,
            }
        });
        chipmunk.updateConfig({ headers: { 'Session-Id': result.object.id } });
    }));
    it('prints organization context', () => __awaiter(this, void 0, void 0, function* () {
        const context = yield chipmunk.context('um.organization');
    }));
    it('prints geo_scope context', () => __awaiter(this, void 0, void 0, function* () {
        const context = yield chipmunk.context('um.geo_scope');
        console.log(context);
    }));
    it('fetches users', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield chipmunk.action('um.user', 'query', { params: { per: 3 } });
    }));
});
const sampleUser = {
    '@id': 'https://um.api.mediapeers.mobi/v20140601/user/1659',
    '@context': 'https://um.api.mediapeers.mobi/v20140601/context/user',
    '@type': 'user',
    id: 1659,
    access_level: 'viewable',
    organization_id: 104,
    role_id: null,
    responsible_user_id: 9999729,
    created_at: '2013-11-25T12:00:24.082Z',
    updated_at: '2018-05-31T11:21:52.748Z',
    geo_scopes: [
        { '@id': 'https://um.api.mediapeers.mobi/v20140601/geo_scope/UGA' },
        { '@id': 'https://um.api.mediapeers.mobi/v20140601/geo_scope/SWZ' },
        { '@id': 'https://um.api.mediapeers.mobi/v20140601/geo_scope/UZB' },
        { '@id': 'https://um.api.mediapeers.mobi/v20140601/geo_scope/XEU' }
    ],
    groups: { '@id': 'https://um.api.mediapeers.mobi/v20140601/users/1659/groups' },
    organization: { '@id': 'https://um.api.mediapeers.mobi/v20140601/organization/104' },
    responsible_user: { '@id': 'https://um.api.mediapeers.mobi/v20140601/user/9999729' },
    password: { '@id': 'https://um.api.mediapeers.mobi/v20140601/users/1659/password' },
    phones: { '@id': 'https://um.api.mediapeers.mobi/v20140601/users/1659/phones' },
    im_contacts: { '@id': 'https://um.api.mediapeers.mobi/v20140601/users/1659/im_contacts' },
    social_media_profiles: { '@id': 'https://um.api.mediapeers.mobi/v20140601/users/1659/social_media_profiles' },
    address: { '@id': 'https://um.api.mediapeers.mobi/v20140601/users/1659/address' },
    country: { '@id': 'https://um.api.mediapeers.mobi/v20140601/geography/DEU' }
};
//# sourceMappingURL=helper.test.js.map