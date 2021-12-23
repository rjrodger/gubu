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
declare type ValType = 'any' | 'none' | 'custom' | 'null' | 'undefined' | 'list' | 'string' | 'number' | 'boolean' | 'object' | 'array' | 'bigint' | 'symbol' | 'function' | 'instance' | 'nan';
declare type ValSpec = {
    $: typeof GUBU;
    t: ValType;
    d: number;
    v: any;
    r: boolean;
    o: boolean;
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
    done?: boolean;
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
    n: ValSpec;
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
declare const Empty: Builder;
declare const Any: Builder;
declare const None: Builder;
declare const One: Builder;
declare const All: Builder;
declare const Exact: Builder;
declare const Before: Builder;
declare const After: Builder;
declare const Closed: Builder;
declare const Define: Builder;
declare const Refer: Builder;
declare const Rename: Builder;
declare function buildize(invs0?: any, invs1?: any): ValSpec;
declare function makeErr(val: any, state: State, text?: string, why?: string): ErrDesc;
declare type GubuShape = (<T>(inroot?: T, inctx?: any) => T) & {
    spec: () => any;
    gubu: typeof GUBU;
};
declare const G$: (spec: any) => ValSpec;
declare type Gubu = typeof make & {
    desc: () => any;
    G$: typeof G$;
    buildize: typeof buildize;
    makeErr: typeof makeErr;
    After: typeof After;
    All: typeof All;
    Any: typeof Any;
    Before: typeof Before;
    Closed: typeof Closed;
    Define: typeof Define;
    Empty: typeof Empty;
    Exact: typeof Exact;
    None: typeof None;
    One: typeof One;
    Optional: typeof Optional;
    Refer: typeof Refer;
    Rename: typeof Rename;
    Required: typeof Required;
};
declare const Gubu: Gubu;
declare const GAfter: Builder;
declare const GAll: Builder;
declare const GAny: Builder;
declare const GBefore: Builder;
declare const GClosed: Builder;
declare const GDefine: Builder;
declare const GEmpty: Builder;
declare const GExact: Builder;
declare const GNone: Builder;
declare const GOne: Builder;
declare const GOptional: Builder;
declare const GRefer: Builder;
declare const GRename: Builder;
declare const GRequired: Builder;
export type { Validate, Update, Context, Builder, ValSpec, State, };
export { Gubu, G$, norm, buildize, makeErr, After, All, Any, Before, Closed, Define, Empty, Exact, None, One, Optional, Refer, Rename, Required, GAfter, GAll, GAny, GBefore, GClosed, GDefine, GEmpty, GExact, GNone, GOne, GOptional, GRefer, GRename, GRequired, };
