import { IConfig } from './config';
export declare class NotLoadedError extends Error {
}
export interface IActionOpts {
    ROR?: boolean;
    raw?: boolean;
    headers?: {
        [s: string]: any;
    };
    body?: {
        [s: string]: any;
    };
    params?: {
        [s: string]: any;
    };
    schema?: string;
}
export interface IObject {
    '@associations': {
        [s: string]: any;
    };
    [s: string]: any;
}
export interface IResult {
    object: IObject;
    objects: IObject[];
    headers?: {
        [s: string]: string;
    };
    aggregations?: any;
}
export declare const associationNotLoaded: (name: any) => () => never;
declare const _default: (appModel: string, actionName: string, opts: IActionOpts, config: IConfig) => Promise<IResult>;
export default _default;
