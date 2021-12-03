declare const GUBU: {
    gubu$: symbol;
    version: string;
};
declare type ValType = 'any' | 'custom' | 'null' | // TODO: test
'list' | 'string' | 'number' | 'boolean' | 'object' | 'array' | 'bigint' | 'symbol' | 'function';
declare type ValSpec = {
    $: typeof GUBU;
    t: ValType;
    d: number;
    v: any;
    r: boolean;
    k: string;
    f?: Validate;
    u?: any;
    b?: Validate;
    a?: Validate;
};
declare type Builder = (opts?: any, ...specs: any[]) => ValSpec & {
    [name: string]: Builder | any;
};
declare type Validate = (val: any, update: Update, state: State) => boolean;
declare type State = {
    key: string;
    node: ValSpec;
    src: any;
    dI: number;
    nI: number;
    sI: number;
    pI: number;
    cN: number;
    nodes: (ValSpec | number)[];
    srcs: any[];
    path: string[];
    terr: any[];
    err: any[];
    ctx: any;
};
declare type Update = {
    pass: boolean;
    val?: any;
    nI?: number;
    sI?: number;
    pI?: number;
    cN?: number;
    err?: boolean | any;
    why?: string;
};
declare function norm(spec?: any): ValSpec;
declare function make(inspec?: any): GubuSchema;
declare const Required: Builder;
declare const Optional: Builder;
declare const Any: Builder;
declare const One: Builder;
declare const Some: Builder;
declare const All: Builder;
declare function Custom(validate: Validate): ValSpec;
declare const Closed: Builder;
declare const Rename: Builder;
declare function buildize(invs?: any): ValSpec;
declare type GubuSchema = (<T>(inroot?: T, inctx?: any) => T) & {
    spec: () => any;
};
declare type Gubu = typeof make & {
    desc: () => any;
    Required: typeof Required;
    Optional: typeof Optional;
    Custom: typeof Custom;
    Any: typeof Any;
    One: typeof One;
    Some: typeof Some;
    All: typeof All;
    Closed: typeof Closed;
    Rename: typeof Rename;
};
declare function G$(spec: any): ValSpec;
declare const gubu: Gubu;
export { gubu, G$, norm, buildize, Required, Optional, Any, Custom, One, Some, All, Closed, Rename, };
