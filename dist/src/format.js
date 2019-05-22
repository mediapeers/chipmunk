"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
exports.default = (objects, multi, ROR) => {
    if (!lodash_1.isArray(objects))
        objects = [objects];
    objects = lodash_1.map(objects, (member) => {
        return ROR ? toROR(cleanup(member)) : cleanup(member);
    });
    if (!multi) {
        return lodash_1.first(objects);
    }
    else {
        return lodash_1.reduce(objects, (acc, member) => lodash_1.assign(acc, { [member.id]: member }), {});
    }
};
const cleanup = (object) => {
    if (lodash_1.isEmpty(object))
        return {};
    const cleaned = {};
    lodash_1.each(object, (value, key) => {
        if (/^\@/.test(key) || key === 'errors' || lodash_1.isFunction(value)) {
        }
        else if (lodash_1.isArray(value)) {
            if (lodash_1.isPlainObject(value[0])) {
                const subset = lodash_1.map(value, (x) => cleanup(x));
                cleaned[key] = lodash_1.reject(subset, (x) => lodash_1.isEmpty(x));
            }
            else {
                cleaned[key] = value;
            }
        }
        else if (lodash_1.isPlainObject(value)) {
            const cleanedValue = cleanup(value);
            if (!lodash_1.isEmpty(cleanedValue))
                cleaned[key] = cleanedValue;
        }
        else {
            cleaned[key] = value;
        }
    });
    return cleaned;
};
const toROR = (object) => {
    lodash_1.each(object, (value, key) => {
        if (lodash_1.isString(value) && /_ids$/.test(key)) {
            var values = lodash_1.filter(value.split(','), (item) => {
                return !lodash_1.isEmpty(item);
            });
            object[key] = values;
        }
        else if (lodash_1.isPlainObject(value) || (lodash_1.isArray(value) && lodash_1.isPlainObject(lodash_1.first(value)))) {
            object[`${key}_attributes`] = value;
            delete object[key];
        }
    });
    return object;
};
//# sourceMappingURL=format.js.map