import { IContext } from './context';
import { IResult, IActionOpts } from './action';
import { IConfig, cleanConfig } from './config';
import { ICallOpts, ISetOpts, IUpdateOpts } from './cache';
export * from './cache';
export interface ICache {
    set(key: string, value: any, opts?: ISetOpts): void;
    get(key: string, opts?: ICallOpts): any;
    remove(key: string, opts?: ICallOpts): void;
    update(key: string, cb: (any: any) => any, opts?: IUpdateOpts): any;
    clear(opts?: ICallOpts): void;
}
export interface IInterface {
    currentConfig(): IConfig;
    updateConfig(overrides?: Partial<IConfig>): IConfig;
    context(urlOrAppModel: string): Promise<IContext>;
    action(appModel: string, actionName: string, opts?: IActionOpts): Promise<IResult>;
    fetch(objects: any[], name: string): Promise<IResult>;
    assign(targets: any[], objects: any[], name: string): void;
    fetchAndAssign(targets: any[], name: string): Promise<void>;
    performLater(cb: Function): void;
    cache: ICache;
}
export { IContext, IResult, IConfig, IActionOpts, cleanConfig };
export interface IChipmunk extends IInterface {
    run: (block: (ch: IInterface) => Promise<any>, errorHandler?: Function) => Promise<any>;
}
declare const _default: (...overrides: Partial<IConfig>[]) => IChipmunk;
export default _default;
