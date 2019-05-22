import { IConfig } from '../src/config';
export declare const setup: (overrides?: Partial<IConfig>) => IConfig;
export declare const nap: (milliseconds?: number) => Promise<void>;
export declare const matches: (needle: string) => (uri: any) => any;
export declare const readCredentials: () => any;
