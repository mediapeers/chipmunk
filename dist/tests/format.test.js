"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const format_1 = __importDefault(require("../src/format"));
describe('format', () => {
    it('returns an equal object', () => {
        const input = { foo: 'bar' };
        chai_1.expect(format_1.default(input, false, false)).to.eql(input);
    });
    it('returns an object with useless data removed', () => {
        const input = {
            id: 3,
            name: 'john',
            isMale: () => true,
            brothers: [{}, { name: 'Lukas', errors: 2 }],
            errors: 'none',
            '@associations': {},
        };
        const expected = {
            id: 3,
            name: 'john',
            brothers: [{ name: 'Lukas' }],
        };
        chai_1.expect(format_1.default(input, false, false)).to.eql(expected);
    });
    it('returns a suitable multi action object', () => {
        const input = { id: 3, name: 'john' };
        const expected = {
            '3': { id: 3, name: 'john' }
        };
        chai_1.expect(format_1.default(input, true, false)).to.eql(expected);
    });
    it('returns a another suitable multi action object', () => {
        const input = [
            { id: 3, name: 'john' },
            { id: 4, name: 'lukas' },
        ];
        const expected = {
            '3': { id: 3, name: 'john' },
            '4': { id: 4, name: 'lukas' },
        };
        chai_1.expect(format_1.default(input, true, false)).to.eql(expected);
    });
    it('returns a ruby-on-rails-nested-attributes object', () => {
        const input = {
            id: 3,
            name: 'john',
            interest_ids: '3,4,5',
            brother: {
                id: 4,
                name: 'lukas',
            }
        };
        const expected = {
            id: 3,
            name: 'john',
            interest_ids: ['3', '4', '5'],
            brother_attributes: {
                id: 4,
                name: 'lukas',
            }
        };
        chai_1.expect(format_1.default(input, false, true)).to.eql(expected);
    });
    it('returns a multi action ruby-on-rails-nested-attributes object', () => {
        const input = {
            id: 3,
            name: 'john',
            interest_ids: '3,4,5',
            brother: {
                id: 4,
                name: 'lukas',
            }
        };
        const expected = {
            '3': {
                id: 3,
                name: 'john',
                interest_ids: ['3', '4', '5'],
                brother_attributes: {
                    id: 4,
                    name: 'lukas',
                }
            }
        };
        chai_1.expect(format_1.default(input, true, true)).to.eql(expected);
    });
});
//# sourceMappingURL=format.test.js.map