import { IRequestError } from './request';
export interface IHeaderSettings {
    'Session-Id'?: string;
    'Affiliation-Id'?: string;
    'Role-Id'?: any;
    'Mpx-Flavours'?: {
        [s: string]: any;
    };
}
export interface ICacheSettings {
    enabled?: boolean;
    default?: 'runtime' | 'storage' | null;
    prefix?: string;
}
export interface IWatcher {
    pendingRequests: {
        [s: string]: any;
    };
    performLaterHandlers: Function[];
}
export interface IConfig {
    endpoints: {
        [s: string]: string;
    };
    headers: IHeaderSettings;
    timestamp: number;
    errorInterceptor(err: IRequestError): boolean;
    devMode: boolean;
    verbose: boolean;
    cache: ICacheSettings;
    watcher: IWatcher;
}
declare const _default: (...configs: Partial<IConfig>[]) => IConfig;
export default _default;
