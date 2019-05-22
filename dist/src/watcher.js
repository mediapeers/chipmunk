"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
exports.next = (config) => {
    lodash_1.delay(() => {
        if (!lodash_1.isEmpty(config.watcher.pendingRequests))
            return;
        const handler = config.watcher.performLaterHandlers.pop();
        handler && handler();
    }, 50);
};
exports.enqueuePerformLater = (cb, config) => {
    lodash_1.delay(() => {
        config.watcher.performLaterHandlers.push(cb);
        exports.next(config);
    }, 50);
};
exports.enqueueRequest = (key, payload, config) => {
    config.watcher.pendingRequests[key] = payload;
};
exports.clearRequest = (key, config) => {
    delete config.watcher.pendingRequests[key];
    exports.next(config);
};
exports.pending = (key, config) => {
    return config.watcher.pendingRequests[key];
};
//# sourceMappingURL=watcher.js.map