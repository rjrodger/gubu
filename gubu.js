"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gubu = void 0;
function gubu(spec) {
    return function gubu(src) {
        return { ...spec, ...src };
    };
}
exports.gubu = gubu;
//# sourceMappingURL=gubu.js.map