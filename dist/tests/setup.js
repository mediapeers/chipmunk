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
const config_1 = __importDefault(require("../src/config"));
const chai_as_promised_1 = __importDefault(require("chai-as-promised"));
const chai_1 = __importDefault(require("chai"));
const nock_1 = __importDefault(require("nock"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const child_process_1 = require("child_process");
const sinon_1 = __importDefault(require("sinon"));
const mocks_1 = require("./mocks");
const DEFAULT_CONFIG = {
    timestamp: null,
    headers: {
        'Affiliation-Id': 'mpx',
    },
    endpoints: {
        um: "https://um.api.mediapeers.mobi/v20140601",
        pm: "https://pm.api.mediapeers.mobi/v20140601",
        am: "https://am.api.mediapeers.mobi/v20140601",
        ac: "https://ac.api.mediapeers.mobi/v20140601",
        sm: "https://sm.api.mediapeers.mobi/v20140601",
        mc: "https://mc.api.mediapeers.mobi/v20140601",
    },
};
exports.setup = (overrides) => {
    const conf = config_1.default(DEFAULT_CONFIG, overrides);
    before(() => {
        nock_1.default.cleanAll();
        mocks_1.mockContexts(conf);
        chai_1.default.use(chai_as_promised_1.default);
    });
    afterEach(() => {
        sinon_1.default.restore();
    });
    return conf;
};
exports.nap = (milliseconds = 100) => __awaiter(this, void 0, void 0, function* () {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
});
exports.matches = (needle) => {
    return (uri) => uri.includes(needle);
};
exports.readCredentials = () => {
    const content = child_process_1.execSync('scrambler read tests/credentials.yml').toString();
    return js_yaml_1.default.safeLoad(content);
};
//# sourceMappingURL=setup.js.map