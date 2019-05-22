import { IConfig } from './config';
export declare const next: (config: IConfig) => void;
export declare const enqueuePerformLater: (cb: Function, config: IConfig) => void;
export declare const enqueueRequest: (key: string, payload: any, config: IConfig) => void;
export declare const clearRequest: (key: string, config: IConfig) => void;
export declare const pending: (key: string, config: IConfig) => any;
