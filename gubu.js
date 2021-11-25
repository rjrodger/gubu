"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Custom = exports.Optional = exports.Required = exports.gubu = void 0;
function make(spec) {
    return function gubu(src) {
        return { ...spec, ...src };
    };
}
function Required(term) { }
exports.Required = Required;
function Optional(term) { }
exports.Optional = Optional;
function Custom(handler) { }
exports.Custom = Custom;
Object.assign(make, {
    Required,
    Optional,
    Custom,
});
Object.defineProperty(make, 'name', { value: 'gubu' });
const gubu = make;
exports.gubu = gubu;
//# sourceMappingURL=gubu.js.map