declare const GUBU: {
    gubu$: symbol;
    v$: string;
};
type GubuOptions = {
    name?: string;
    meta?: {
        active?: boolean;
        suffix?: string;
    };
    keyexpr?: {
        active?: boolean;
    };
    prefix?: string;
};
type Context = Record<string, any> & {
    err?: ErrDesc[] | boolean;
    log?: (point: string, state: State) => void;
};
type ValType = 'any' | // Any type.
'array' | // An array.
'bigint' | // A BigInt value.
'boolean' | // The values `true` or `false`.
'function' | // A function.
'instance' | // An instance of a constructed object.
'list' | // A list of types under a given logical rule.
'nan' | // The `NaN` value.
'never' | // No type.
'null' | // The `null` value.
'number' | // A number.
'object' | // A plain object.
'string' | // A string (but *not* the empty string).
'symbol' | // A symbol reference.
'regexp' | // A regular expression.
'undefined';
type Node<V> = {
    $: typeof GUBU;
    o: any;
    t: ValType;
    d: number;
    v: any;
    f: any;
    r: boolean;
    p: boolean;
    n: number;
    c: any;
    k: string[];
    e: boolean;
    u: Record<string, any>;
    b: Validate[];
    a: Validate[];
    m: NodeMeta;
    s?: string;
    z?: string;
} & {
    [name: string]: Builder<V>;
};
type NodeMeta = Record<string, any>;
type Builder<S> = (opts?: any, // Builder options.
...vals: any[]) => Node<S>;
type Validate = (val: any, update: Update, state: State) => boolean;
declare class State {
    match: boolean;
    dI: number;
    nI: number;
    cI: number;
    pI: number;
    sI: number;
    valType: string;
    isRoot: boolean;
    key: string;
    type: string;
    stop: boolean;
    nextSibling: boolean;
    fromDflt: boolean;
    ignoreVal: boolean | undefined;
    curerr: any[];
    err: any[];
    parents: Node<any>[];
    keys: string[];
    path: string[];
    node: Node<any>;
    root: any;
    val: any;
    parent: any;
    nodes: (Node<any> | number)[];
    vals: any[];
    ctx: any;
    oval: any;
    check?: Function;
    checkargs?: Record<string, any>;
    constructor(root: any, top: Node<any>, ctx?: Context, match?: boolean);
    next(): void;
    updateVal(val: any): void;
}
type Update = {
    done?: boolean;
    val?: any;
    uval?: any;
    node?: Node<any>;
    type?: ValType;
    nI?: number;
    sI?: number;
    pI?: number;
    err?: string | ErrDesc | ErrDesc[];
    why?: string;
    fatal?: boolean;
};
type ErrDesc = {
    k: string;
    n: Node<any>;
    v: any;
    p: string;
    w: string;
    c: string;
    a: Record<string, any>;
    m: number;
    t: string;
    u: any;
};
declare class GubuError extends TypeError {
    gubu: boolean;
    code: string;
    prefix: string;
    props: ({
        path: string;
        type: string;
        value: any;
    }[]);
    desc: () => ({
        name: string;
        code: string;
        err: ErrDesc[];
        ctx: any;
    });
    constructor(code: string, prefix: string | undefined, err: ErrDesc[], ctx: any);
    toJSON(): this & {
        err: any;
        name: string;
        message: string;
    };
}
declare function nodize<S>(shape?: any, depth?: number, meta?: NodeMeta): Node<S>;
declare function make<S>(intop?: S | Node<S>, inopts?: GubuOptions): {
    <V>(root?: V | undefined, ctx?: Context): V & S;
    valid: <V_1>(root?: V_1 | undefined, ctx?: Context) => root is V_1 & S;
    match(root?: any, ctx?: Context): boolean;
    error(root?: any, ctx?: Context): GubuError[];
    spec(): any;
    node(): Node<S>;
    stringify(shape?: any): string;
    toString(): string;
    gubu: {
        gubu$: symbol;
        v$: string;
    };
};
declare function expr(spec: {
    src: string;
    val: any;
    tokens?: string[];
    i?: number;
}): any;
declare function truncate(str?: string, len?: number): string;
declare const Required: <V>(this: any, shape?: V | Node<V> | undefined) => Node<V>;
declare const Open: <V>(this: any, shape?: V | Node<V> | undefined) => Node<V>;
declare const Optional: <V>(this: any, shape?: V | Node<V> | undefined) => Node<V>;
declare const Any: <V>(this: any, shape?: V | Node<V> | undefined) => Node<V>;
declare const Fault: <V>(this: any, msg: string, shape?: V | Node<V> | undefined) => Node<V>;
declare const Skip: <V>(this: any, shape?: V | Node<V> | undefined) => Node<V>;
declare const Ignore: <V>(this: any, shape?: V | Node<V> | undefined) => Node<V>;
declare const Func: <V>(this: any, shape?: V | Node<V> | undefined) => Node<V>;
declare const Default: <V>(this: any, dval?: any, shape?: V | Node<V> | undefined) => Node<V>;
declare const Empty: <V>(this: any, shape?: V | Node<V> | undefined) => Node<V>;
declare const Never: <V>(this: any, shape?: V | Node<V> | undefined) => Node<V>;
declare const Key: (this: any, depth?: number | Function, join?: string) => Node<unknown>;
declare const All: (this: any, ...inshapes: any[]) => Node<unknown>;
declare const Some: (this: any, ...inshapes: any[]) => Node<unknown>;
declare const One: (this: any, ...inshapes: any[]) => Node<unknown>;
declare const Exact: (this: any, ...vals: any[]) => Node<unknown>;
declare const Before: <V>(this: any, validate: Validate, shape?: V | Node<V> | undefined) => Node<V>;
declare const After: <V>(this: any, validate: Validate, shape?: V | Node<V> | undefined) => Node<V>;
declare const Check: <V>(this: any, check: Validate | RegExp | string, shape?: V | Node<V> | undefined) => Node<V>;
declare const Closed: <V>(this: any, shape?: V | Node<V> | undefined) => Node<V>;
declare const Define: <V>(this: any, inopts: any, shape?: V | Node<V> | undefined) => Node<V>;
declare const Refer: <V>(this: any, inopts: any, shape?: V | Node<V> | undefined) => Node<V>;
declare const Rename: <V>(this: any, inopts: any, shape?: V | Node<V> | undefined) => Node<V>;
declare const Min: <V>(this: any, min: number | string, shape?: V | Node<V> | undefined) => Node<V>;
declare const Max: <V>(this: any, max: number | string, shape?: V | Node<V> | undefined) => Node<V>;
declare const Above: <V>(this: any, above: number | string, shape?: V | Node<V> | undefined) => Node<V>;
declare const Below: <V>(this: any, below: number | string, shape?: V | Node<V> | undefined) => Node<V>;
declare const Len: <V>(this: any, len: number, shape?: V | Node<V> | undefined) => Node<V>;
declare const Child: <V>(this: any, child?: any, shape?: V | Node<V> | undefined) => Node<V>;
declare const Rest: <V>(this: any, child?: any, shape?: V | Node<V> | undefined) => Node<V>;
declare function buildize<V>(node0?: any, node1?: any): Node<V>;
declare function makeErr(state: State, text?: string, why?: string, user?: any): ErrDesc;
declare function stringify(src: any, replacer?: any, dequote?: boolean, expand?: boolean): string;
declare const G$: (node: any) => Node<any>;
declare const BuilderMap: {
    Above: <V>(this: any, above: number | string, shape?: V | Node<V> | undefined) => Node<V>;
    After: <V_1>(this: any, validate: Validate, shape?: V_1 | Node<V_1> | undefined) => Node<V_1>;
    All: (this: any, ...inshapes: any[]) => Node<unknown>;
    Any: <V_2>(this: any, shape?: V_2 | Node<V_2> | undefined) => Node<V_2>;
    Before: <V_3>(this: any, validate: Validate, shape?: V_3 | Node<V_3> | undefined) => Node<V_3>;
    Below: <V_4>(this: any, below: number | string, shape?: V_4 | Node<V_4> | undefined) => Node<V_4>;
    Check: <V_5>(this: any, check: Validate | RegExp | string, shape?: V_5 | Node<V_5> | undefined) => Node<V_5>;
    Child: <V_6>(this: any, child?: any, shape?: V_6 | Node<V_6> | undefined) => Node<V_6>;
    Closed: <V_7>(this: any, shape?: V_7 | Node<V_7> | undefined) => Node<V_7>;
    Default: <V_8>(this: any, dval?: any, shape?: V_8 | Node<V_8> | undefined) => Node<V_8>;
    Define: <V_9>(this: any, inopts: any, shape?: V_9 | Node<V_9> | undefined) => Node<V_9>;
    Empty: <V_10>(this: any, shape?: V_10 | Node<V_10> | undefined) => Node<V_10>;
    Exact: (this: any, ...vals: any[]) => Node<unknown>;
    Fault: <V_11>(this: any, msg: string, shape?: V_11 | Node<V_11> | undefined) => Node<V_11>;
    Func: <V_12>(this: any, shape?: V_12 | Node<V_12> | undefined) => Node<V_12>;
    Ignore: <V_13>(this: any, shape?: V_13 | Node<V_13> | undefined) => Node<V_13>;
    Key: (this: any, depth?: number | Function, join?: string) => Node<unknown>;
    Len: <V_14>(this: any, len: number, shape?: V_14 | Node<V_14> | undefined) => Node<V_14>;
    Max: <V_15>(this: any, max: number | string, shape?: V_15 | Node<V_15> | undefined) => Node<V_15>;
    Min: <V_16>(this: any, min: number | string, shape?: V_16 | Node<V_16> | undefined) => Node<V_16>;
    Never: <V_17>(this: any, shape?: V_17 | Node<V_17> | undefined) => Node<V_17>;
    One: (this: any, ...inshapes: any[]) => Node<unknown>;
    Open: <V_18>(this: any, shape?: V_18 | Node<V_18> | undefined) => Node<V_18>;
    Optional: <V_19>(this: any, shape?: V_19 | Node<V_19> | undefined) => Node<V_19>;
    Refer: <V_20>(this: any, inopts: any, shape?: V_20 | Node<V_20> | undefined) => Node<V_20>;
    Rename: <V_21>(this: any, inopts: any, shape?: V_21 | Node<V_21> | undefined) => Node<V_21>;
    Required: <V_22>(this: any, shape?: V_22 | Node<V_22> | undefined) => Node<V_22>;
    Skip: <V_23>(this: any, shape?: V_23 | Node<V_23> | undefined) => Node<V_23>;
    Some: (this: any, ...inshapes: any[]) => Node<unknown>;
    Rest: <V_24>(this: any, child?: any, shape?: V_24 | Node<V_24> | undefined) => Node<V_24>;
};
type GubuShape = ReturnType<typeof make> & {
    valid: <D, S>(root?: D, ctx?: any) => root is (D & S);
    match: (root?: any, ctx?: any) => boolean;
    error: (root?: any, ctx?: Context) => GubuError[];
    spec: () => any;
    node: () => Node<any>;
    isShape: (v: any) => boolean;
    gubu: typeof GUBU;
};
type Gubu = typeof make & typeof BuilderMap & {
    G$: typeof G$;
    buildize: typeof buildize;
    makeErr: typeof makeErr;
    stringify: typeof stringify;
    truncate: typeof truncate;
    nodize: typeof nodize;
    expr: typeof expr;
    MakeArgu: typeof MakeArgu;
};
declare const Gubu: Gubu;
declare const GAbove: <V>(this: any, above: number | string, shape?: V | Node<V> | undefined) => Node<V>;
declare const GAfter: <V>(this: any, validate: Validate, shape?: V | Node<V> | undefined) => Node<V>;
declare const GAll: (this: any, ...inshapes: any[]) => Node<unknown>;
declare const GAny: <V>(this: any, shape?: V | Node<V> | undefined) => Node<V>;
declare const GBefore: <V>(this: any, validate: Validate, shape?: V | Node<V> | undefined) => Node<V>;
declare const GBelow: <V>(this: any, below: number | string, shape?: V | Node<V> | undefined) => Node<V>;
declare const GCheck: <V>(this: any, check: Validate | RegExp | string, shape?: V | Node<V> | undefined) => Node<V>;
declare const GChild: <V>(this: any, child?: any, shape?: V | Node<V> | undefined) => Node<V>;
declare const GRest: <V>(this: any, child?: any, shape?: V | Node<V> | undefined) => Node<V>;
declare const GClosed: <V>(this: any, shape?: V | Node<V> | undefined) => Node<V>;
declare const GDefault: <V>(this: any, dval?: any, shape?: V | Node<V> | undefined) => Node<V>;
declare const GDefine: <V>(this: any, inopts: any, shape?: V | Node<V> | undefined) => Node<V>;
declare const GEmpty: <V>(this: any, shape?: V | Node<V> | undefined) => Node<V>;
declare const GExact: (this: any, ...vals: any[]) => Node<unknown>;
declare const GFault: <V>(this: any, msg: string, shape?: V | Node<V> | undefined) => Node<V>;
declare const GFunc: <V>(this: any, shape?: V | Node<V> | undefined) => Node<V>;
declare const GIgnore: <V>(this: any, shape?: V | Node<V> | undefined) => Node<V>;
declare const GKey: (this: any, depth?: number | Function, join?: string) => Node<unknown>;
declare const GLen: <V>(this: any, len: number, shape?: V | Node<V> | undefined) => Node<V>;
declare const GMax: <V>(this: any, max: number | string, shape?: V | Node<V> | undefined) => Node<V>;
declare const GMin: <V>(this: any, min: number | string, shape?: V | Node<V> | undefined) => Node<V>;
declare const GNever: <V>(this: any, shape?: V | Node<V> | undefined) => Node<V>;
declare const GOne: (this: any, ...inshapes: any[]) => Node<unknown>;
declare const GOpen: <V>(this: any, shape?: V | Node<V> | undefined) => Node<V>;
declare const GOptional: <V>(this: any, shape?: V | Node<V> | undefined) => Node<V>;
declare const GRefer: <V>(this: any, inopts: any, shape?: V | Node<V> | undefined) => Node<V>;
declare const GRename: <V>(this: any, inopts: any, shape?: V | Node<V> | undefined) => Node<V>;
declare const GRequired: <V>(this: any, shape?: V | Node<V> | undefined) => Node<V>;
declare const GSkip: <V>(this: any, shape?: V | Node<V> | undefined) => Node<V>;
declare const GSome: (this: any, ...inshapes: any[]) => Node<unknown>;
type args = any[] | IArguments;
type Argu = (args: args | string, whence: string | Record<string, any>, spec?: Record<string, any>) => (typeof args extends string ? ((args: args) => Record<string, any>) : Record<string, any>);
declare function MakeArgu(prefix: string): Argu;
export type { Validate, Update, Context, Builder, Node, State, GubuShape, };
export { Gubu, G$, nodize, buildize, makeErr, stringify, truncate, expr, MakeArgu, Above, After, All, Any, Before, Below, Check, Child, Closed, Default, Define, Empty, Exact, Fault, Func, Ignore, Key, Len, Max, Min, Never, One, Open, Optional, Refer, Rename, Required, Skip, Some, Rest, GAbove, GAfter, GAll, GAny, GBefore, GBelow, GCheck, GChild, GClosed, GDefault, GDefine, GEmpty, GExact, GFault, GFunc, GIgnore, GKey, GLen, GMax, GMin, GNever, GOne, GOpen, GOptional, GRefer, GRename, GRequired, GSkip, GSome, GRest, };
