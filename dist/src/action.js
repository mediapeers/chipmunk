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
const request_1 = require("./request");
const context_1 = __importDefault(require("./context"));
const format_1 = __importDefault(require("./format"));
const schema_1 = __importDefault(require("./schema"));
const association_1 = require("./association");
class NotLoadedError extends Error {
}
exports.NotLoadedError = NotLoadedError;
const DEFAULT_OPTS = {
    ROR: false,
    raw: false,
    params: {},
};
const extractParamsFromBody = (action, body = {}) => {
    const result = {};
    lodash_1.each(action.mappings || [], (mapping) => {
        if (body[mapping.source])
            result[mapping.variable] = body[mapping.source];
    });
    return result;
};
const validateParams = (action, params, config) => {
    const required = lodash_1.filter(action.mappings, 'required');
    for (let index in required) {
        const variable = lodash_1.get(required[index], 'variable');
        if (!params[variable]) {
            const msg = `Required param '${variable}' for '${action.template}' missing!`;
            if (config.devMode)
                throw new Error(msg);
            else
                console.log(msg);
            return false;
        }
    }
    return true;
};
const resolve = (objects, schema, config) => __awaiter(this, void 0, void 0, function* () {
    lodash_1.merge(schema, {
        '@context': true,
        '@id': true,
        '@type': true,
        '@associations': true,
    });
    const associations = lodash_1.pickBy(schema, lodash_1.isPlainObject);
    const promises = lodash_1.map(associations, (assocSchema, assocName) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield association_1.fetch(objects, assocName, config);
            const resolved = yield resolve(result.objects, assocSchema, config);
            return association_1.assign(objects, resolved, assocName, config);
        }
        catch (_a) {
            console.warn(`failed to resolve association ${assocName}`);
            return objects;
        }
    }));
    yield Promise.all(promises);
    return lodash_1.map(objects, (o) => lodash_1.pick(o, lodash_1.keys(schema)));
});
exports.associationNotLoaded = (name) => {
    return () => {
        const err = new NotLoadedError(`'${name}' association not loaded`);
        err.name = 'NotLoadedError';
        throw err;
    };
};
exports.default = (appModel, actionName, opts, config) => __awaiter(this, void 0, void 0, function* () {
    opts = lodash_1.merge({}, DEFAULT_OPTS, opts);
    const context = yield context_1.default(appModel, config);
    const action = context.action(actionName);
    const body = format_1.default(opts.body, action.collection, opts.ROR);
    const uriTemplate = uri_templates_1.default(action.template);
    const params = lodash_1.merge({}, extractParamsFromBody(action, body), opts.params);
    validateParams(action, params, config);
    const uri = uriTemplate.fillFromObject(params);
    let req;
    switch (action.method) {
        case 'POST':
            req = request_1.request(config, opts.headers)
                .post(uri)
                .send(body);
            break;
        default:
            req = request_1.request(config, opts.headers)
                .get(uri);
    }
    if (config.timestamp)
        req.query({ t: config.timestamp });
    const response = yield request_1.run(uri, req, config);
    let objects = [];
    if (lodash_1.get(response, 'body.members'))
        objects = response.body.members;
    else if (!lodash_1.isEmpty(response.body))
        objects = [response.body];
    if (!opts.raw) {
        lodash_1.each(objects, (object) => {
            object['@associations'] = {};
            lodash_1.each(context.associations, (_def, name) => {
                const data = object[name];
                if (object[name]) {
                    object['@associations'][name] = lodash_1.isArray(data) ? lodash_1.map(data, '@id') : lodash_1.get(data, '@id');
                }
                Object.defineProperty(object, name, {
                    get: () => exports.associationNotLoaded(name)()
                });
            });
        });
    }
    if (!(opts.raw) && !lodash_1.isEmpty(opts.schema)) {
        const schema = schema_1.default(opts.schema);
        objects = yield resolve(objects, schema, config);
    }
    const result = {
        objects,
        get object() { return lodash_1.first(objects); },
        headers: lodash_1.get(response, 'headers', {}),
    };
    return result;
});
//# sourceMappingURL=action.js.map