"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nock_1 = __importDefault(require("nock"));
const setup_1 = require("./setup");
const user_context_1 = __importDefault(require("./fixtures/user.context"));
const user_manager_context_1 = __importDefault(require("./fixtures/user_manager.context"));
const phone_context_1 = __importDefault(require("./fixtures/phone.context"));
const organization_context_1 = __importDefault(require("./fixtures/organization.context"));
const session_context_1 = __importDefault(require("./fixtures/session.context"));
const geo_scope_context_1 = __importDefault(require("./fixtures/geo_scope.context"));
exports.mockContexts = (config) => {
    nock_1.default(config.endpoints.um)
        .persist()
        .get(setup_1.matches('context/session'))
        .optionally()
        .reply(200, session_context_1.default)
        .get(setup_1.matches('context/user/phone'))
        .optionally()
        .reply(200, phone_context_1.default)
        .get(setup_1.matches('context/user/manager'))
        .optionally()
        .reply(200, user_manager_context_1.default)
        .get(setup_1.matches('context/user'))
        .optionally()
        .reply(200, user_context_1.default)
        .get(setup_1.matches('context/organization'))
        .optionally()
        .reply(200, organization_context_1.default)
        .get(setup_1.matches('context/geo_scope'))
        .optionally()
        .reply(200, geo_scope_context_1.default)
        .get(setup_1.matches('context/foo'))
        .optionally()
        .reply(404);
};
//# sourceMappingURL=mocks.js.map