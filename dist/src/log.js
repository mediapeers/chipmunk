"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (...args) => {
    args.unshift('chowchow:log');
    console.warn.apply(null, args);
};
//# sourceMappingURL=log.js.map