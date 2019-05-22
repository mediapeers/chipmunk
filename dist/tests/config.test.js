"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const lodash_1 = require("lodash");
const config_1 = __importDefault(require("../src/config"));
const setup_1 = require("./setup");
const src_1 = __importDefault(require("../src"));
const config = setup_1.setup();
let chipmunk;
describe('config', () => {
    beforeEach(() => {
        chipmunk = src_1.default(config);
    });
    it('returns an object', () => {
        chai_1.expect(config_1.default()).to.be.a('Object');
    });
    it('updates the settings', () => {
        const conf = config_1.default({ endpoints: { um: 'http://um.app' } });
        let value = lodash_1.get(conf, 'endpoints.um');
        chai_1.expect(value).to.equal('http://um.app');
    });
    it('merges multiple configs', () => {
        const conf = config_1.default({ endpoints: { um: 'http://um.app' } }, { devMode: true });
        chai_1.expect(conf.endpoints.um).to.equal('http://um.app');
        chai_1.expect(conf.devMode).to.be.true;
    });
    describe('#cachePrefix', () => {
        it('uses affiliation and role as prefix', () => {
            const conf = config_1.default({ cache: { enabled: true }, headers: { 'Affiliation-Id': 'mpx', 'Role-Id': 5, 'Session-Id': '24FA' } });
            chai_1.expect(conf.cache.prefix).to.equal('mpx-5');
        });
        it('uses the session id as prefix', () => {
            const conf = config_1.default({ cache: { enabled: true }, headers: { 'Session-Id': '24FA' } });
            chai_1.expect(conf.cache.prefix).to.equal('24FA');
        });
        it('uses _anonymous_ as prefix', () => {
            const conf = config_1.default();
            chai_1.expect(conf.cache.prefix).to.equal('anonymous');
        });
    });
});
//# sourceMappingURL=config.test.js.map