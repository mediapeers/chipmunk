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
const sinon_1 = __importDefault(require("sinon"));
const setup_1 = require("./setup");
const src_1 = __importDefault(require("../src"));
const config = setup_1.setup();
let chipmunk;
describe('chipmunk.run', () => {
    beforeEach(() => {
        chipmunk = src_1.default(config);
    });
    describe('with error interceptor', () => {
        it('ignores the error if the interceptor returns true', () => __awaiter(this, void 0, void 0, function* () {
            chipmunk.updateConfig({ errorInterceptor: (err) => true });
            const block = chipmunk.run((ch) => __awaiter(this, void 0, void 0, function* () {
                const context = yield ch.context('um.foo');
            }));
            yield chai_1.expect(block).to.eventually.be.fulfilled;
        }));
        it('throws an error if the interceptor does not return true', () => __awaiter(this, void 0, void 0, function* () {
            chipmunk.updateConfig({ errorInterceptor: (err) => null });
            const block = chipmunk.run((ch) => __awaiter(this, void 0, void 0, function* () {
                const context = yield ch.context('um.foo');
            }));
            yield chai_1.expect(block).to.be.rejectedWith('Not Found');
        }));
        it('throws an error if the original error was not because of an unsuccessful request', () => __awaiter(this, void 0, void 0, function* () {
            chipmunk.updateConfig({ errorInterceptor: (err) => err.name === 'RequestError' });
            const block = chipmunk.run((ch) => __awaiter(this, void 0, void 0, function* () {
                throw new Error('random error');
                const context = yield ch.context('um.foo');
            }));
            yield chai_1.expect(block).to.be.rejectedWith('random');
        }));
        it('passes an un-intercepted error to the optional error handler', () => __awaiter(this, void 0, void 0, function* () {
            const handler = sinon_1.default.fake();
            yield chipmunk.run((ch) => __awaiter(this, void 0, void 0, function* () {
                throw new Error('random error');
                const context = yield ch.context('um.foo');
            }), handler);
            chai_1.expect(handler.called).to.be.true;
        }));
        it('returns the result of the run block', () => __awaiter(this, void 0, void 0, function* () {
            const returnValue = yield chipmunk.run((ch) => __awaiter(this, void 0, void 0, function* () {
                return 'yay';
            }));
            chai_1.expect(returnValue).to.equal('yay');
        }));
    });
    describe('#performLater', () => {
        it('calls perform later handlers after requests have been made', () => __awaiter(this, void 0, void 0, function* () {
            const handler1 = sinon_1.default.fake();
            const handler2 = sinon_1.default.fake();
            chipmunk.performLater(handler1);
            chipmunk.performLater(handler2);
            yield chipmunk.context('um.user');
            yield chipmunk.context('um.organization');
            yield setup_1.nap(200);
            chai_1.expect(handler1.called).to.be.true;
            chai_1.expect(handler2.called).to.be.true;
        }));
    });
});
//# sourceMappingURL=chipmunk.test.js.map