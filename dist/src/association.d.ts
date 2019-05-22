import { IConfig } from './config';
import { IContext } from './context';
import { IResult } from './action';
interface IRefs extends Array<{
    [s: string]: any;
}> {
    isHabtm: boolean;
}
export declare const extractReferences: (objects: any, name: any) => IRefs;
export declare const extractProps: (context: IContext, references: any) => {};
export declare const fetch: (objects: any[], name: string, config: IConfig) => Promise<IResult>;
export declare const assign: (targets: any[], objects: any[], name: string, config: IConfig) => void;
export {};
