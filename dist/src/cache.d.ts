import { IConfig } from './config';
export declare let _runtimeCache: {};
export declare const runtimeFetch: (key: string) => any;
export declare const runtimePut: (key: string, value: any, expires?: number) => void;
export declare const runtimeDrop: (key: string) => void;
export declare const runtimeClear: () => void;
export declare const storageFetch: (key: string) => any;
export declare const storagePut: (key: string, value: any, expires?: number) => void;
export declare const storageDrop: (key: string) => void;
export declare const storageClear: () => void;
export interface ICallOpts {
    engine: 'runtime' | 'storage';
    noPrefix: boolean;
}
export interface ISetOpts extends ICallOpts {
    expires: number;
}
export interface IUpdateOpts extends ICallOpts {
    expires: number;
    defaultValue: any;
}
export declare const set: (key: string, value: any, opts: Partial<ISetOpts>, config: IConfig) => void;
export declare const get: (key: string, opts: Partial<ICallOpts>, config: IConfig) => any;
export declare const remove: (key: string, opts: Partial<ICallOpts>, config: IConfig) => any;
export declare const update: (key: string, cb: (any: any) => any, opts: Partial<IUpdateOpts>, config: IConfig) => any;
export declare const clear: (opts: Partial<ICallOpts>) => void;
