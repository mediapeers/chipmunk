"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const PREFIX = 'chipmunk';
const DEFAULT_EXPIRY = 60;
const minutesFromNow = (min) => {
    return Date.now() + min * 60000;
};
const cacheKey = (suffix, config) => {
    return `${config.cache.prefix}-${suffix}`;
};
exports._runtimeCache = {};
exports.runtimeFetch = (key) => {
    const obj = exports._runtimeCache[key];
    if (obj && Date.now() > obj.expires) {
        exports.runtimeDrop(key);
        return null;
    }
    return obj && obj.value;
};
exports.runtimePut = (key, value, expires) => {
    expires = minutesFromNow(expires || DEFAULT_EXPIRY);
    const obj = { value, expires };
    exports._runtimeCache[key] = obj;
};
exports.runtimeDrop = (key) => {
    const keyparts = key.split('*');
    if (keyparts.length > 1) {
        const toDelete = [];
        lodash_1.each(exports._runtimeCache, (_val, key) => {
            if (lodash_1.startsWith(key, keyparts[0]))
                toDelete.push(key);
        });
        lodash_1.each(toDelete, (key) => delete exports._runtimeCache[key]);
    }
    else {
        delete exports._runtimeCache[key];
    }
};
exports.runtimeClear = () => {
    exports._runtimeCache = {};
};
exports.storageFetch = (key) => {
    const { localStorage } = window;
    key = `${PREFIX}-${key}`;
    const obj = JSON.parse(localStorage.getItem(key) || null);
    if (obj && Date.now() > obj.expires) {
        exports.storageDrop(key);
        return null;
    }
    return obj && obj.value;
};
exports.storagePut = (key, value, expires) => {
    const { localStorage } = window;
    key = `${PREFIX}-${key}`;
    expires = minutesFromNow(expires || DEFAULT_EXPIRY);
    const obj = { value, expires };
    localStorage.setItem(key, JSON.stringify(obj));
};
exports.storageDrop = (key) => {
    const { localStorage } = window;
    key = `${PREFIX}-${key}`;
    const keyparts = key.split('*');
    if (keyparts.length > 1) {
        const toDelete = [];
        for (var i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (lodash_1.startsWith(key, keyparts[0]))
                toDelete.push(key);
        }
        lodash_1.each(toDelete, (key) => localStorage.removeItem(key));
    }
    else {
        localStorage.removeItem(key);
    }
};
exports.storageClear = () => {
    const { localStorage } = window;
    const toDelete = [];
    for (var i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (lodash_1.startsWith(key, PREFIX))
            toDelete.push(key);
    }
    lodash_1.each(toDelete, (key) => localStorage.removeItem(key));
};
const defaultCallOpts = {
    engine: 'runtime',
    noPrefix: false,
};
exports.set = (key, value, opts, config) => {
    opts = lodash_1.merge({ expires: DEFAULT_EXPIRY }, defaultCallOpts, opts);
    key = opts.noPrefix ? key : `${config.cache.prefix}-${key}`;
    const putFn = opts.engine === 'storage' ? exports.storagePut : exports.runtimePut;
    return putFn(key, value, opts.expires);
};
exports.get = (key, opts, config) => {
    opts = lodash_1.merge({}, defaultCallOpts, opts);
    key = opts.noPrefix ? key : `${config.cache.prefix}-${key}`;
    const fetchFn = opts.engine === 'storage' ? exports.storageFetch : exports.runtimeFetch;
    return fetchFn(key);
};
exports.remove = (key, opts, config) => {
    opts = lodash_1.merge({}, defaultCallOpts, opts);
    key = opts.noPrefix ? key : `${config.cache.prefix}-${key}`;
    const dropFn = opts.engine === 'storage' ? exports.storageDrop : exports.runtimeDrop;
    return dropFn(key);
};
exports.update = (key, cb, opts, config) => {
    opts = lodash_1.merge({ expires: DEFAULT_EXPIRY }, defaultCallOpts, opts);
    key = opts.noPrefix ? key : `${config.cache.prefix}-${key}`;
    const fetchFn = opts.engine === 'storage' ? exports.storageFetch : exports.runtimeFetch;
    const putFn = opts.engine === 'storage' ? exports.storagePut : exports.runtimePut;
    const currentValue = fetchFn(key) || opts.defaultValue;
    const value = cb(currentValue);
    return putFn(key, value, opts.expires);
};
exports.clear = (opts) => {
    opts = lodash_1.merge({}, defaultCallOpts, opts);
    const clearFn = opts.engine === 'storage' ? exports.storageClear : exports.runtimeClear;
    return clearFn();
};
//# sourceMappingURL=cache.js.map