"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ensure_1 = require("../util/ensure");
class Resolver {
    constructor(forge, binding) {
        ensure_1.default('forge', forge);
        ensure_1.default('binding', binding);
        this.forge = forge;
        this.binding = binding;
    }
    resolveDependencies(context, dependencies, args) {
        return dependencies.map(dep => {
            if (dep.name === 'forge')
                return this.forge;
            if (args && args[dep.name])
                return args[dep.name];
            if (this.binding.arguments[dep.name])
                return this.binding.arguments[dep.name];
            return this.forge.resolve(dep.name, context, dep.hint, null, dep.mode);
        });
    }
}
exports.default = Resolver;
//# sourceMappingURL=Resolver.js.map