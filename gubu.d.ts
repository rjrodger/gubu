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
    o: boolean;
    k: string;
    u: Record<string, any>;
    b: Validate[];
    a: Validate[];
};
declare type Builder = (opts?: any, // Builder options.
...vals: any[]) => Node & // Builders build Nodes.
{
    [name: string]: Builder | any;
};
declare type Validate = (val: any, update: Update, state: State) => boolean;
declare class State {
    dI: number;
    nI: number;
    pI: number;
    sI: number;
    stype: string;
    err: any[];
    nextSibling: boolean;
    node: Node;
    key: string;
    val: any;
    parent: any;
    nodes: (Node | number)[];
    srcs: any[];
    parents: Node[];
    path: string[];
    ctx: any;
    oval: any;
    constructor(root: any, top: Node, ctx: Context);
}
declare type Update = {
    done?: boolean;
    val?: any;
    node?: Node;
    type?: ValType;
    nI?: number;
    sI?: number;
    pI?: number;
    err?: boolean | ErrDesc | ErrDesc[];
    why?: string;
};
declare type ErrDesc = {
    n: Node;
    s: any;
    p: string;
    w: string;
    m: number;
    t: string;
};
declare function norm(spec?: any): Node;
declare function make(inspec?: any, inopts?: Options): GubuShape;
declare const Required: Builder;
declare const Optional: Builder;
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
declare const Min: Builder;
declare const Max: Builder;
declare const Above: Builder;
declare const Below: Builder;
declare function buildize(invs0?: any, invs1?: any): Node;
declare function makeErr(val: any, state: State, text?: string, why?: string): ErrDesc;
declare type GubuShape = (<T>(inroot?: T, inctx?: any) => T) & {
    spec: () => any;
    gubu: typeof GUBU;
};
declare const G$: (spec: any) => Node;
declare type Gubu = typeof make & {
    desc: () => any;
    G$: typeof G$;
    buildize: typeof buildize;
    makeErr: typeof makeErr;
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
    Optional: typeof Optional;
    Refer: typeof Refer;
    Rename: typeof Rename;
    Required: typeof Required;
    Some: typeof Some;
};
declare const Gubu: Gubu;
declare function Args(spec: any, wrapped?: any): GubuShape | ((this: any) => any);
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
declare const GOptional: Builder;
declare const GRefer: Builder;
declare const GRename: Builder;
declare const GRequired: Builder;
declare const GSome: Builder;
export type { Validate, Update, Context, Builder, Node, State, };
export { Gubu, G$, norm, buildize, makeErr, Args, Above, After, All, Any, Before, Below, Closed, Define, Empty, Exact, Max, Min, Never, One, Optional, Refer, Rename, Required, Some, GAbove, GAfter, GAll, GAny, GBefore, GBelow, GClosed, GDefine, GEmpty, GExact, GMax, GMin, GNever, GOne, GOptional, GRefer, GRename, GRequired, GSome, };
