"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HINT_PROPERTY = '__FORGE_DEPENDENCY_HINTS__';
function inject(hints) {
    return (target) => {
        const normalized = {};
        for (const name in hints) {
            if (typeof hints[name] === 'string') {
                normalized[name] = { name: hints[name] };
            }
            else {
                normalized[name] = Object.assign({ name }, hints[name]);
            }
        }
        target[exports.HINT_PROPERTY] = normalized;
        return target;
    };
}
exports.default = inject;
//# sourceMappingURL=inject.js.map