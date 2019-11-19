"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const context_1 = __importDefault(require("./context"));
const action_1 = __importDefault(require("./action"));
const association_1 = require("./association");
const config_1 = __importStar(require("./config"));
exports.cleanConfig = config_1.cleanConfig;
const cache_1 = require("./cache");
const watcher_1 = require("./watcher");
__export(require("./cache"));
exports.default = (...overrides) => {
    let config = config_1.default.apply(null, overrides);
    const callOpts = (opts) => lodash_1.merge({ engine: config.cache.default }, opts);
    const ch = {
        currentConfig: () => config,
        updateConfig: (overrides) => {
            return config = config_1.default(config, overrides);
        },
        context: (urlOrAppModel) => context_1.default(urlOrAppModel, config),
        action: (appModel, actionName, opts = {}) => action_1.default(appModel, actionName, opts, config),
        fetch: (objects, name) => association_1.fetch(objects, name, config),
        assign: (targets, objects, name) => association_1.assign(targets, objects, name, config),
        fetchAndAssign: (targets, name) => __awaiter(this, void 0, void 0, function* () {
            const result = yield association_1.fetch(targets, name, config);
            association_1.assign(targets, result.objects, name, config);
        }),
        cache: {
            set: (key, value, opts) => cache_1.set(key, value, callOpts(opts), config),
            get: (key, opts) => cache_1.get(key, callOpts(opts), config),
            remove: (key, opts) => cache_1.remove(key, callOpts(opts), config),
            update: (key, cb, opts) => cache_1.update(key, cb, callOpts(opts), config),
            clear: (opts) => cache_1.clear(callOpts(opts))
        },
        performLater: (cb) => watcher_1.enqueuePerformLater(cb, config),
    };
    const run = (block, errorHandler) => __awaiter(this, void 0, void 0, function* () {
        try {
            return yield block(ch);
        }
        catch (e) {
            if (config.errorInterceptor) {
                if (config.errorInterceptor(e) === true)
                    return;
            }
            if (errorHandler)
                return errorHandler(e);
            throw e;
        }
    });
    return Object.assign({ run }, ch);
};
//# sourceMappingURL=index.js.map