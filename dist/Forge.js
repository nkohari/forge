"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ResolutionError_1 = require("./errors/ResolutionError");
const Binding_1 = require("./framework/Binding");
const Context_1 = require("./framework/Context");
const Mode_1 = require("./framework/Mode");
const RegexInspector_1 = require("./inspectors/RegexInspector");
const ensure_1 = require("./util/ensure");
class Forge {
    constructor(config = {}) {
        this.bindings = {};
        this.inspector = config.inspector || new RegexInspector_1.default();
    }
    bind(name) {
        ensure_1.default('name', name);
        const binding = new Binding_1.default(this, name);
        const list = this.bindings[name] ? this.bindings[name] : (this.bindings[name] = []);
        list.push(binding);
        return binding;
    }
    unbind(name) {
        ensure_1.default('name', name);
        const count = this.bindings[name] != null ? this.bindings[name].length : 0;
        this.bindings[name] = [];
        return count;
    }
    rebind(name) {
        ensure_1.default('name', name);
        this.unbind(name);
        return this.bind(name);
    }
    get(name, hint = null, args = null) {
        ensure_1.default('name', name);
        return this.resolve(name, new Context_1.default(), hint, args, Mode_1.default.AtLeastOne);
    }
    getOne(name, hint = null, args = null) {
        ensure_1.default('name', name);
        return this.resolve(name, new Context_1.default(), hint, args, Mode_1.default.AtMostOne);
    }
    getAll(name, args = null) {
        ensure_1.default('name', name);
        return this.resolve(name, new Context_1.default(), undefined, args, Mode_1.default.All);
    }
    resolve(name, context, hint, args, mode = Mode_1.default.AtLeastOne) {
        ensure_1.default('name', name);
        let bindings;
        if (mode === Mode_1.default.All) {
            bindings = this.bindings[name];
        }
        else {
            bindings = this.getMatchingBindings(name, hint);
        }
        if (!bindings || bindings.length === 0) {
            throw new ResolutionError_1.default(name, hint, context, 'No matching bindings were available');
        }
        if (mode == Mode_1.default.AtMostOne && bindings.length !== 1) {
            throw new ResolutionError_1.default(name, hint, context, 'Multiple matching bindings were available');
        }
        const results = bindings.map(binding => binding.resolve(context, hint, args));
        if (mode !== Mode_1.default.All && results.length === 1) {
            return results[0];
        }
        else {
            return results;
        }
    }
    inspect() {
        const lines = [];
        Object.keys(this.bindings).forEach(name => {
            this.bindings[name].forEach(binding => {
                lines.push(binding.toString());
            });
        });
        return lines.join('\n');
    }
    getMatchingBindings(name, hint) {
        ensure_1.default('name', name);
        if (!this.bindings[name]) {
            return [];
        }
        else {
            return this.bindings[name].filter(binding => binding.matches(hint));
        }
    }
}
exports.default = Forge;
//# sourceMappingURL=Forge.js.map