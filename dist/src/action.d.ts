import { IConfig } from './config';
export declare class NotLoadedError extends Error {
}
export interface IActionOpts {
    ROR?: boolean;
    raw?: boolean;
    proxy?: boolean;
    multi?: boolean;
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
export interface IPagination {
    total_pages: number;
    total_count: number;
    current_page: number;
}
export interface IResult {
    object: IObject;
    objects: IObject[];
    pagination?: IPagination;
    type?: string;
    headers?: {
        [s: string]: string;
    };
    aggregations?: any;
}
declare const _default: (appModel: string, actionName: string, opts: IActionOpts, config: IConfig) => Promise<IResult>;
export default _default;
