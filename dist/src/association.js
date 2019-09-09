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
const uri_templates_1 = __importDefault(require("uri-templates"));
const lodash_1 = require("lodash");
const context_1 = __importDefault(require("./context"));
const action_1 = __importDefault(require("./action"));
exports.extractReferences = (objects, name) => {
    const result = lodash_1.flatten(lodash_1.compact(lodash_1.map(objects, (o) => lodash_1.get(o, `@associations.${name}`))));
    result.isHabtm = lodash_1.some(objects, (object) => lodash_1.isArray(lodash_1.get(object, `@associations.${name}`)));
    return result;
};
exports.extractProps = (context, references) => {
    const memberGet = context.member_actions['get'];
    const collectionGet = context.collection_actions['query'];
    const result = {};
    lodash_1.each(lodash_1.compact([memberGet, collectionGet]), (action) => {
        const template = uri_templates_1.default(action.template);
        try {
            lodash_1.each(references, (reference) => {
                const values = template.fromUri(reference);
                lodash_1.each(action.mappings, (mapping) => {
                    const value = values[mapping.variable];
                    if (!value)
                        return;
                    if (!result[mapping.source])
                        result[mapping.source] = [];
                    if (lodash_1.includes(result[mapping.source], value))
                        return;
                    result[mapping.source].push(value);
                });
            });
        }
        catch (_a) { }
    });
    return result;
};
const buildParams = (context, props) => {
    const collectionGet = context.collection_actions['get'];
    const result = {};
    lodash_1.each(collectionGet.mappings || [], (mapping) => {
        if (props[mapping.source])
            result[mapping.variable] = props[mapping.source];
    });
    return result;
};
const readProp = (object, name) => {
    try {
        return object[name];
    }
    catch (e) {
        if (e.name !== 'NotLoadedError')
            throw e;
    }
};
exports.fetch = (objects, name, config) => __awaiter(this, void 0, void 0, function* () {
    const contexts = yield Promise.all(lodash_1.map(objects, (obj) => context_1.default(obj['@context'], config)));
    const objectContext = lodash_1.find(contexts, (context) => context.associations[name]);
    if (!objectContext) {
        throw new Error(`could not find the requested association '${name}'`);
    }
    const associationProperty = objectContext.associations[name];
    const associationContext = yield context_1.default(associationProperty.type, config);
    const references = exports.extractReferences(objects, name);
    const extractedProps = exports.extractProps(associationContext, references);
    const params = buildParams(associationContext, extractedProps);
    const actionName = associationProperty.collection && !references.isHabtm ? 'query' : 'get';
    return action_1.default(associationProperty.type, actionName, { params }, config);
});
exports.assign = (targets, objects, name, config) => {
    const objectsById = lodash_1.reduce(objects, (acc, object) => lodash_1.assign(acc, { [object['@id']]: object }), {});
    const targetsById = lodash_1.reduce(targets, (acc, target) => lodash_1.assign(acc, { [target['@id']]: target }), {});
    lodash_1.each(targets, (target) => {
        const ref = lodash_1.get(target, `@associations[${name}]`);
        if (lodash_1.isArray(ref)) {
            const matches = lodash_1.pick(objectsById, ref);
            if (!lodash_1.isEmpty(matches))
                Object.defineProperty(target, name, { value: lodash_1.values(matches) });
        }
        else {
            const match = objectsById[ref];
            if (!lodash_1.isEmpty(match))
                Object.defineProperty(target, name, { value: match });
        }
    });
    lodash_1.each(objects, (object) => {
        lodash_1.each(lodash_1.get(object, '@associations', []), (ref) => {
            const target = targetsById[ref];
            if (!lodash_1.isEmpty(target)) {
                const value = readProp(target, name);
                if (value && !lodash_1.isArray(value))
                    return;
                if (value)
                    target[name].push(object);
                else
                    Object.defineProperty(target, name, { value: [object] });
            }
        });
    });
    lodash_1.each(targets, (target) => {
        const value = readProp(target, name);
        if (!value)
            Object.defineProperty(target, name, { value: null });
    });
};
//# sourceMappingURL=association.js.map