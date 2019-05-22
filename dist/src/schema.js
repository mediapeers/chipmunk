"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const detectProps = (structure) => {
    let result = {};
    let edges = [0];
    let delimiter = /({|}|,)/g;
    let count = 0;
    var match;
    while ((match = delimiter.exec(structure)) != null) {
        let character = lodash_1.first(match);
        if (character == '{')
            count++;
        else if (character == '}')
            count--;
        else if (character == ',' && count == 0) {
            edges.push(match.index - 1);
            edges.push(match.index + 1);
        }
    }
    if (count != 0)
        throw new Error('bad structure');
    edges.push(structure.length - 1);
    while (edges.length > 0) {
        let curly;
        let start = edges.shift();
        let end = edges.shift();
        let length = end - start;
        let prop = lodash_1.trim(structure.substr(start, length + 1));
        if (lodash_1.isEmpty(prop))
            continue;
        if ((curly = prop.indexOf('{')) >= 0) {
            let rest = prop.length - curly - 2;
            let name = lodash_1.trim(prop.substr(0, curly));
            let inner = prop.substr(curly + 1, rest);
            result[name] = detectProps(inner);
        }
        else {
            result[prop] = true;
        }
    }
    return result;
};
exports.default = (structure) => {
    if (lodash_1.isObject(structure))
        return structure;
    structure = (structure || '').replace(/\n|\r/g, "");
    return detectProps(structure);
};
//# sourceMappingURL=schema.js.map