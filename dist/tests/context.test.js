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
const nock_1 = __importDefault(require("nock"));
const src_1 = __importDefault(require("../src"));
const setup_1 = require("./setup");
const user_context_1 = __importDefault(require("./fixtures/user.context"));
const config = setup_1.setup();
let chipmunk;
describe('context', () => {
    beforeEach(() => {
        chipmunk = src_1.default(config);
    });
    it('returns a valid context', () => __awaiter(this, void 0, void 0, function* () {
        yield chipmunk.run((ch) => __awaiter(this, void 0, void 0, function* () {
            const userContext = yield ch.context('um.user');
            chai_1.expect(userContext.properties).not.to.be.empty;
        }));
    }));
    it('exposes associations', () => __awaiter(this, void 0, void 0, function* () {
        yield chipmunk.run((ch) => __awaiter(this, void 0, void 0, function* () {
            const userContext = yield ch.context('um.user');
            chai_1.expect(userContext.associations.firt_name).to.be.undefined;
            chai_1.expect(userContext.associations.organization).not.to.be.empty;
        }));
    }));
    it('fails to find a random context', () => __awaiter(this, void 0, void 0, function* () {
        yield chipmunk.run((ch) => __awaiter(this, void 0, void 0, function* () {
            const promise = ch.context('um.foo');
            yield chai_1.expect(promise).to.be.rejectedWith('Not Found');
        }));
    }));
    it('makes the request to get a context for a sub-model', () => __awaiter(this, void 0, void 0, function* () {
        nock_1.default(config.endpoints.pm)
            .get(setup_1.matches('/context/product/asset'))
            .reply(200, { '@context': {} });
        yield chipmunk.context('pm.product/asset');
    }));
    it('makes the request to get a context only once, i.e. caches the result', () => __awaiter(this, void 0, void 0, function* () {
        chipmunk.updateConfig({ cache: { enabled: true, default: 'runtime' } });
        chipmunk.cache.clear();
        nock_1.default(config.endpoints.um)
            .get(setup_1.matches('/context/dontgetmewrong'))
            .once()
            .reply(200, user_context_1.default);
        yield chipmunk.context('um.dontgetmewrong');
        yield chipmunk.context('um.dontgetmewrong');
    }));
    it('runs only one of multiple parallel identical requests', () => __awaiter(this, void 0, void 0, function* () {
        chipmunk.updateConfig({ cache: { enabled: true, default: 'runtime' } });
        chipmunk.cache.clear();
        nock_1.default(config.endpoints.um)
            .get(setup_1.matches('/context/dontgetmewrong'))
            .once()
            .reply(200, user_context_1.default);
        const promises = [
            chipmunk.context('um.dontgetmewrong'),
            chipmunk.context('um.dontgetmewrong'),
        ];
        yield Promise.all(promises);
    }));
});
//# sourceMappingURL=context.test.js.map