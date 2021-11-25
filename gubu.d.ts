declare function make(spec?: any): <T>(src?: T | undefined) => T;
declare function Required(term?: any): void;
declare function Optional(term?: any): void;
declare function Custom(handler?: any): void;
declare type Gubu = typeof make & {
    Required: typeof Required;
    Optional: typeof Optional;
    Custom: typeof Custom;
};
declare const gubu: Gubu;
export { gubu, Required, Optional, Custom };
