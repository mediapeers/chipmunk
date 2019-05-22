import { IConfig } from './config';
export interface IProperty {
    type: string;
    readable: boolean;
    writable: boolean;
    exportable: boolean;
    required?: boolean;
    validations?: any[];
    collection?: boolean;
}
export interface IAction {
    method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
    collection: boolean;
    template: string;
    mappings: {
        [s: string]: string;
    }[];
    expects?: string;
    resource?: string;
    response?: string;
}
export interface IContext {
    properties: {
        [s: string]: IProperty;
    };
    associations: {
        [s: string]: IProperty;
    };
    constants: {
        [s: string]: string[];
    };
    member_actions: IAction[];
    collection_actions: IAction[];
    action: (name: string) => IAction;
}
declare const _default: (urlOrAppModel: string, config: IConfig) => Promise<IContext>;
export default _default;
