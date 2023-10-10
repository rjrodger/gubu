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
'undefined';
type Node = {
    $: typeof GUBU;
    t: ValType;
    d: number;
    v: any;
    f: any;
    r: boolean;
    p: boolean;
    n: number;
    c: any;
    u: Record<string, any>;
    b: Validate[];
    a: Validate[];
    s?: string;
    m?: NodeMeta;
};
type NodeMeta = {
    short: string;
};
type Builder = (opts?: any, // Builder options.
...vals: any[]) => Node & // Builders build Nodes.
{
    [name: string]: Builder | any;
};
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
    fromDefault: boolean;
    ignoreVal: boolean | undefined;
    err: any[];
    parents: Node[];
    keys: string[];
    path: string[];
    node: Node;
    root: any;
    val: any;
    parent: any;
    nodes: (Node | number)[];
    vals: any[];
    ctx: any;
    oval: any;
    check?: Function;
    checkargs?: Record<string, any>;
    constructor(root: any, top: Node, ctx?: Context, match?: boolean);
    next(): void;
    updateVal(val: any): void;
    printStacks(): void;
}
type Update = {
    done?: boolean;
    val?: any;
    uval?: any;
    node?: Node;
    type?: ValType;
    nI?: number;
    sI?: number;
    pI?: number;
    err?: string | ErrDesc | ErrDesc[];
    why?: string;
};
type ErrDesc = {
    k: string;
    n: Node;
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
    desc: () => ({
        name: string;
        code: string;
        err: ErrDesc[];
        ctx: any;
    });
    constructor(code: string, err: ErrDesc[], ctx: any);
    toJSON(): this & {
        err: any;
        name: string;
        message: string;
    };
}
declare function nodize(shape?: any, depth?: number, meta?: NodeMeta): Node;
declare function make<S>(intop?: S, inopts?: GubuOptions): {
    <R>(root?: R | undefined, ctx?: Context): R & S;
    valid: <D>(root?: D | undefined, ctx?: Context) => root is D & S;
    match(root?: any, ctx?: Context): boolean;
    error(root?: any, ctx?: Context): GubuError[];
    spec(): any;
    node(): Node;
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
declare const Required: Builder;
declare const Optional: Builder;
declare const Skip: Builder;
declare const Func: Builder;
declare const Default: Builder;
declare const Empty: Builder;
declare const Any: Builder;
declare const Never: Builder;
declare const Key: Builder;
declare const All: Builder;
declare const Some: Builder;
declare const One: Builder;
declare const Exact: Builder;
declare const Before: Builder;
declare const After: Builder;
declare const Check: Builder;
declare const Open: Builder;
declare const Closed: Builder;
declare const Define: Builder;
declare const Refer: Builder;
declare const Rename: Builder;
declare function truncate(str?: string, len?: number): string;
declare const Min: Builder;
declare const Max: Builder;
declare const Above: Builder;
declare const Below: Builder;
declare const Len: Builder;
declare const Child: Builder;
declare function buildize(node0?: any, node1?: any): Node;
declare function makeErr(state: State, text?: string, why?: string, user?: any): ErrDesc;
declare function stringify(src: any, replacer?: any, dequote?: boolean, expand?: boolean): string;
type GubuShape = ReturnType<typeof make> & {
    valid: <D, S>(root?: D, ctx?: any) => root is (D & S);
    match: (root?: any, ctx?: any) => boolean;
    error: (root?: any, ctx?: Context) => GubuError[];
    spec: () => any;
    node: () => Node;
    isShape: (v: any) => boolean;
    gubu: typeof GUBU;
};
declare const G$: (node: any) => Node;
type Gubu = typeof make & {
    G$: typeof G$;
    buildize: typeof buildize;
    makeErr: typeof makeErr;
    stringify: typeof stringify;
    truncate: typeof truncate;
    nodize: typeof nodize;
    Above: typeof Above;
    After: typeof After;
    All: typeof All;
    Any: typeof Any;
    Before: typeof Before;
    Below: typeof Below;
    Check: typeof Check;
    Child: typeof Child;
    Closed: typeof Closed;
    Define: typeof Define;
    Default: typeof Default;
    Empty: typeof Empty;
    Exact: typeof Exact;
    Func: typeof Func;
    Key: typeof Key;
    Max: typeof Max;
    Min: typeof Min;
    Never: typeof Never;
    Len: typeof Len;
    One: typeof One;
    Open: typeof Open;
    Optional: typeof Optional;
    Refer: typeof Refer;
    Rename: typeof Rename;
    Required: typeof Required;
    Skip: typeof Skip;
    Some: typeof Some;
    GAbove: typeof Above;
    GAfter: typeof After;
    GAll: typeof All;
    GAny: typeof Any;
    GBefore: typeof Before;
    GBelow: typeof Below;
    GCheck: typeof Check;
    GChild: typeof Child;
    GClosed: typeof Closed;
    GDefine: typeof Define;
    GDefault: typeof Default;
    GEmpty: typeof Empty;
    GExact: typeof Exact;
    GFunc: typeof Func;
    GKey: typeof Key;
    GMax: typeof Max;
    GMin: typeof Min;
    GNever: typeof Never;
    GLen: typeof Len;
    GOne: typeof One;
    GOpen: typeof Open;
    GOptional: typeof Optional;
    GRefer: typeof Refer;
    GRename: typeof Rename;
    GRequired: typeof Required;
    GSkip: typeof Skip;
    GSome: typeof Some;
};
declare const Gubu: Gubu;
declare const GAbove: Builder;
declare const GAfter: Builder;
declare const GAll: Builder;
declare const GAny: Builder;
declare const GBefore: Builder;
declare const GBelow: Builder;
declare const GCheck: Builder;
declare const GChild: Builder;
declare const GClosed: Builder;
declare const GDefine: Builder;
declare const GDefault: Builder;
declare const GEmpty: Builder;
declare const GExact: Builder;
declare const GFunc: Builder;
declare const GKey: Builder;
declare const GMax: Builder;
declare const GMin: Builder;
declare const GNever: Builder;
declare const GLen: Builder;
declare const GOne: Builder;
declare const GOpen: Builder;
declare const GOptional: Builder;
declare const GRefer: Builder;
declare const GRename: Builder;
declare const GRequired: Builder;
declare const GSkip: Builder;
declare const GSome: Builder;
export type { Validate, Update, Context, Builder, Node, State, GubuShape, };
export { Gubu, G$, nodize, buildize, makeErr, stringify, truncate, expr, Above, After, All, Any, Before, Below, Check, Child, Closed, Define, Default, Empty, Exact, Func, Key, Max, Min, Never, Len, One, Open, Optional, Refer, Rename, Required, Skip, Some, GAbove, GAfter, GAll, GAny, GBefore, GBelow, GCheck, GChild, GClosed, GDefine, GDefault, GEmpty, GExact, GFunc, GKey, GMax, GMin, GNever, GLen, GOne, GOpen, GOptional, GRefer, GRename, GRequired, GSkip, GSome, };
