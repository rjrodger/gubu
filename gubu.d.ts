declare const GUBU: {
    gubu$: boolean;
};
declare type ValType = 'any' | 'null' | 'string' | 'number' | 'boolean' | 'object' | 'array' | 'bigint' | 'symbol' | 'function';
declare type ArrayKind = '' | // Not an array.
'fill' | // Fill empty array with defaults.
'empty';
declare type ValSpec = {
    $: typeof GUBU;
    t: ValType;
    a: ArrayKind;
    v: any;
    c: {
        r: boolean;
    };
};
declare type Builder = (spec?: any) => ValSpec & {
    [name: string]: Builder | any;
};
declare function G$(opts: any): ValSpec;
declare function norm(spec?: any): ValSpec;
declare function make(inspec?: any): <T>(insrc?: T | undefined) => T;
declare const Required: Builder;
declare const Optional: Builder;
declare const Any: Builder;
declare function Custom(handler?: any): void;
declare function buildize(invs: any): ValSpec;
declare type Gubu = typeof make & {
    Required: typeof Required;
    Optional: typeof Optional;
    Custom: typeof Custom;
};
declare const gubu: Gubu;
export { gubu, G$, norm, buildize, Required, Optional, Any, Custom };
