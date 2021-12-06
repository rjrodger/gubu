declare const GUBU: {
    gubu$: symbol;
    version: string;
};
declare type ValType = 'any' | 'node' | 'custom' | 'null' | // TODO: test
'list' | 'string' | 'number' | 'boolean' | 'object' | 'array' | 'bigint' | 'symbol' | 'function';
declare type ValSpec = {
    $: typeof GUBU;
    t: ValType;
    d: number;
    v: any;
    r: boolean;
    k: string;
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
    node?: ValSpec;
    type?: ValType;
    nI?: number;
    sI?: number;
    pI?: number;
    cN?: number;
    err?: boolean | ErrSpec | ErrSpec[];
    why?: string;
};
declare type ErrSpec = {
    node: ValSpec;
    s: any;
    p: string;
    w: string;
    m: number;
    t: string;
};
declare function norm(spec?: any): ValSpec;
declare function make(inspec?: any): GubuSchema;
declare const Required: Builder;
declare const Optional: Builder;
declare const Any: Builder;
declare const One: Builder;
declare const Some: Builder;
declare const All: Builder;
declare const Before: Builder;
declare const After: Builder;
declare const Closed: Builder;
declare const Define: Builder;
declare const Refer: Builder;
declare const Rename: Builder;
declare function buildize(invs?: any): ValSpec;
declare type GubuSchema = (<T>(inroot?: T, inctx?: any) => T) & {
    spec: () => any;
};
declare type Gubu = typeof make & {
    desc: () => any;
    Required: typeof Required;
    Optional: typeof Optional;
    Any: typeof Any;
    One: typeof One;
    Some: typeof Some;
    All: typeof All;
    Closed: typeof Closed;
    Rename: typeof Rename;
    Define: typeof Define;
    Refer: typeof Refer;
    Before: typeof Before;
    After: typeof After;
};
declare const gubu: Gubu;
export type { Validate, Update, };
export { gubu, norm, buildize, Required, Optional, Any, One, Some, All, Closed, Rename, Define, Refer, Before, After, };
