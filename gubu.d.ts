declare const GUBU: {
    gubu$: symbol;
    v$: string;
};
declare type Options = {
    name?: string;
};
declare type Context = Record<string, any> & {
    err?: ErrDesc[];
};
declare type ValType = 'any' | 'node' | 'custom' | 'null' | // TODO: test
'list' | 'string' | 'number' | 'boolean' | 'object' | 'array' | 'bigint' | 'symbol' | 'function' | 'instance';
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
    err?: boolean | ErrDesc | ErrDesc[];
    why?: string;
};
declare type ErrDesc = {
    node: ValSpec;
    s: any;
    p: string;
    w: string;
    m: number;
    t: string;
};
declare function norm(spec?: any): ValSpec;
declare function make(inspec?: any, inopts?: Options): GubuShape;
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
declare type GubuShape = (<T>(inroot?: T, inctx?: any) => T) & {
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
declare const G$: (spec: any) => ValSpec;
declare const gubu: Gubu;
declare const GRequired: Builder;
declare const GOptional: Builder;
declare const GAny: Builder;
declare const GOne: Builder;
declare const GSome: Builder;
declare const GAll: Builder;
declare const GClosed: Builder;
declare const GRename: Builder;
declare const GDefine: Builder;
declare const GRefer: Builder;
declare const GBefore: Builder;
declare const GAfter: Builder;
export type { Validate, Update, Context, };
export { gubu, G$, norm, buildize, After, All, Any, Before, Closed, Define, One, Optional, Refer, Rename, Required, Some, GAfter, GAll, GAny, GBefore, GClosed, GDefine, GOne, GOptional, GRefer, GRename, GRequired, GSome, };
