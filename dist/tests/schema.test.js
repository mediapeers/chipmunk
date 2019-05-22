"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const schema_1 = __importDefault(require("../src/schema"));
let chipmunk;
describe('config', () => {
    it('parses simple non-nested schema', () => {
        const input = `foo, bar,`;
        const expected = { foo: true, bar: true };
        chai_1.expect(schema_1.default(input)).to.eql(expected);
    });
    it('parses nested schema', () => {
        const input = `foo, bar { baz { name }, }`;
        const expected = {
            foo: true,
            bar: {
                baz: {
                    name: true,
                }
            }
        };
        chai_1.expect(schema_1.default(input)).to.eql(expected);
    });
    it('deals with empty input', () => {
        const expected = {};
        chai_1.expect(schema_1.default('')).to.eql(expected);
        chai_1.expect(schema_1.default(null)).to.eql(expected);
    });
});
//# sourceMappingURL=schema.test.js.map