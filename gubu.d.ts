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
declare function G$(opts: any): ValSpec;
declare function make(inspec?: any): <T>(insrc?: T | undefined) => T;
declare function Required(term?: any): void;
declare function Optional(term?: any): void;
declare function Custom(handler?: any): void;
declare type Gubu = typeof make & {
    Required: typeof Required;
    Optional: typeof Optional;
    Custom: typeof Custom;
};
declare const gubu: Gubu;
export { gubu, G$, Required, Optional, Custom };
