declare const GUBU: {
    gubu$: symbol;
    v$: string;
};
declare type Options = {
    name?: string;
};
declare type Context = Record<string, any> & {
    err?: ErrDesc[] | boolean;
};
declare type ValType = 'any' | // Any type.
'array' | // An array.
'bigint' | // A BigInt value.
'boolean' | // The values `true` or `false`.
'custom' | // Custom type defined by a validation function.
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
declare type Node = {
    $: typeof GUBU;
    t: ValType;
    d: number;
    v: any;
    r: boolean;
    p: boolean;
    u: Record<string, any>;
    b: Validate[];
    a: Validate[];
    s?: string;
};
declare type Builder = (opts?: any, // Builder options.
...vals: any[]) => Node & // Builders build Nodes.
{
    [name: string]: Builder | any;
};
declare type Validate = (val: any, update: Update, state: State) => boolean;
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
    ignoreVal: boolean;
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
    constructor(root: any, top: Node, ctx?: Context, match?: boolean);
    next(): void;
    updateVal(val: any): void;
}
declare type Update = {
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
declare type ErrDesc = {
    k: string;
    n: Node;
    v: any;
    p: string;
    w: string;
    m: number;
    t: string;
    u: any;
};
declare function norm(shape?: any, depth?: number): Node;
declare function make<S>(intop?: S, inopts?: Options): {
    <R>(root?: R | undefined, ctx?: Context | undefined): R & S;
    valid: <D>(root?: D | undefined, ctx?: Context | undefined) => root is D & S;
    match(root?: any, ctx?: Context | undefined): boolean;
    spec(): any;
    toString(): string;
    gubu: {
        gubu$: symbol;
        v$: string;
    };
};
declare const Required: Builder;
declare const Skip: Builder;
declare const Empty: Builder;
declare const Any: Builder;
declare const Never: Builder;
declare const All: Builder;
declare const Some: Builder;
declare const One: Builder;
declare const Exact: Builder;
declare const Before: Builder;
declare const After: Builder;
declare const Closed: Builder;
declare const Define: Builder;
declare const Refer: Builder;
declare const Rename: Builder;
declare function truncate(str?: string, len?: number): string;
declare const Min: Builder;
declare const Max: Builder;
declare const Above: Builder;
declare const Below: Builder;
declare const Value: Builder;
declare function buildize(node0?: any, node1?: any): Node;
declare function makeErr(state: State, text?: string, why?: string, user?: any): ErrDesc;
declare function stringify(src: any, replacer?: any, expand?: boolean): string;
declare type GubuShape = ReturnType<typeof make> & {
    valid: <D, S>(root?: D, ctx?: any) => root is (D & S);
    match: (root?: any, ctx?: any) => boolean;
    spec: () => any;
    gubu: typeof GUBU;
};
declare const G$: (node: any) => Node;
declare type Gubu = typeof make & {
    G$: typeof G$;
    buildize: typeof buildize;
    makeErr: typeof makeErr;
    stringify: typeof stringify;
    truncate: typeof truncate;
    Args: typeof Args;
    Above: typeof Above;
    After: typeof After;
    All: typeof All;
    Any: typeof Any;
    Before: typeof Before;
    Below: typeof Below;
    Closed: typeof Closed;
    Define: typeof Define;
    Empty: typeof Empty;
    Exact: typeof Exact;
    Max: typeof Max;
    Min: typeof Min;
    Never: typeof Never;
    One: typeof One;
    Refer: typeof Refer;
    Rename: typeof Rename;
    Required: typeof Required;
    Some: typeof Some;
    Value: typeof Value;
    Skip: typeof Skip;
    GAbove: typeof Above;
    GAfter: typeof After;
    GAll: typeof All;
    GAny: typeof Any;
    GBefore: typeof Before;
    GBelow: typeof Below;
    GClosed: typeof Closed;
    GDefine: typeof Define;
    GEmpty: typeof Empty;
    GExact: typeof Exact;
    GMax: typeof Max;
    GMin: typeof Min;
    GNever: typeof Never;
    GOne: typeof One;
    GRefer: typeof Refer;
    GRename: typeof Rename;
    GRequired: typeof Required;
    GSome: typeof Some;
    GValue: typeof Value;
    GSkip: typeof Skip;
};
declare const Gubu: Gubu;
declare function Args(shapes: Record<string, any>, wrapped?: any): {
    <R>(root?: R | undefined, ctx?: Context | undefined): any;
    valid: <D>(root?: D | undefined, ctx?: Context | undefined) => root is any;
    match(root?: any, ctx?: Context | undefined): boolean;
    spec(): any;
    toString(): string;
    gubu: {
        gubu$: symbol;
        v$: string;
    };
} | ((this: any) => any);
declare const GAbove: Builder;
declare const GAfter: Builder;
declare const GAll: Builder;
declare const GAny: Builder;
declare const GBefore: Builder;
declare const GBelow: Builder;
declare const GClosed: Builder;
declare const GDefine: Builder;
declare const GEmpty: Builder;
declare const GExact: Builder;
declare const GMax: Builder;
declare const GMin: Builder;
declare const GNever: Builder;
declare const GOne: Builder;
declare const GRefer: Builder;
declare const GRename: Builder;
declare const GRequired: Builder;
declare const GSome: Builder;
declare const GValue: Builder;
declare const GSkip: Builder;
export type { Validate, Update, Context, Builder, Node, State, GubuShape, };
export { Gubu, G$, norm, buildize, makeErr, stringify, truncate, Args, Above, After, All, Any, Before, Below, Closed, Define, Empty, Exact, Max, Min, Never, One, Refer, Rename, Required, Some, Value, Skip, GAbove, GAfter, GAll, GAny, GBefore, GBelow, GClosed, GDefine, GEmpty, GExact, GMax, GMin, GNever, GOne, GRefer, GRename, GRequired, GSome, GValue, GSkip, };
