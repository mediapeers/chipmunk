"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const DEFAULTS = {
    endpoints: {},
    timestamp: Date.now() / 1000 | 0,
    headers: {
        'Mpx-Flavours': {},
    },
    devMode: false,
    verbose: false,
    cache: {
        default: null,
        prefix: 'anonymous',
        enabled: false,
    },
    watcher: {
        pendingRequests: {},
        performLaterHandlers: [],
    },
    errorInterceptor: null,
};
exports.default = (...configs) => {
    const conf = lodash_1.cloneDeep(configs);
    conf.unshift({}, DEFAULTS);
    const result = lodash_1.merge.apply(null, conf);
    if (lodash_1.get(result, `headers['Affiliation-Id']`) && lodash_1.get(result, `headers['Role-Id']`)) {
        result.cache.prefix = `${result.headers['Affiliation-Id']}-${result.headers['Role-Id']}`;
    }
    else if (lodash_1.get(result, `headers['Role-Id']`)) {
        result.cache.prefix = result.headers['Role-Id'];
    }
    else if (lodash_1.get(result, `headers['Session-Id']`)) {
        result.cache.prefix = result.headers['Session-Id'];
    }
    return result;
};
//# sourceMappingURL=config.js.map