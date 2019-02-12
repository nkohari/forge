"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigurationError_1 = require("../errors/ConfigurationError");
const ResolutionError_1 = require("../errors/ResolutionError");
const SingletonLifecycle_1 = require("../lifecycles/SingletonLifecycle");
const TransientLifecycle_1 = require("../lifecycles/TransientLifecycle");
const FunctionResolver_1 = require("../resolvers/FunctionResolver");
const InstanceResolver_1 = require("../resolvers/InstanceResolver");
const TypeResolver_1 = require("../resolvers/TypeResolver");
const ensure_1 = require("../util/ensure");
class Binding {
    constructor(forge, name) {
        ensure_1.default('forge', forge);
        ensure_1.default('name', name);
        this.forge = forge;
        this.name = name;
        this.lifecycle = new SingletonLifecycle_1.default();
        this.arguments = {};
    }
    type(target) {
        ensure_1.default('target', target);
        this.resolver = new TypeResolver_1.default(this.forge, this, target);
        return this;
    }
    function(target) {
        ensure_1.default('target', target);
        this.resolver = new FunctionResolver_1.default(this.forge, this, target);
        return this;
    }
    instance(target) {
        ensure_1.default('target', target);
        this.resolver = new InstanceResolver_1.default(this.forge, this, target);
        return this;
    }
    singleton() {
        this.lifecycle = new SingletonLifecycle_1.default();
        return this;
    }
    transient() {
        this.lifecycle = new TransientLifecycle_1.default();
        return this;
    }
    with(args) {
        ensure_1.default('args', args);
        this.arguments = args;
        return this;
    }
    when(condition) {
        ensure_1.default('condition', condition);
        if (condition instanceof Function) {
            this.predicate = condition;
        }
        else {
            this.predicate = hint => hint == condition;
        }
        return this;
    }
    get to() {
        return this;
    }
    get as() {
        return this;
    }
    matches(hint) {
        return this.predicate ? this.predicate(hint) : true;
    }
    resolve(context, hint, args = {}) {
        ensure_1.default('context', context);
        if (this.lifecycle == null) {
            throw new ConfigurationError_1.default(this.name, 'No lifecycle defined');
        }
        if (this.resolver == null) {
            throw new ConfigurationError_1.default(this.name, 'No resolver defined');
        }
        if (context.has(this)) {
            throw new ResolutionError_1.default(this.name, hint, context, 'Circular dependencies detected');
        }
        context.push(this);
        const result = this.lifecycle.resolve(this.resolver, context, args);
        context.pop();
        return result;
    }
    toString() {
        const tokens = [];
        if (this.predicate) {
            tokens.push('(conditional)');
        }
        tokens.push(this.name);
        tokens.push('->');
        tokens.push(this.resolver ? this.resolver.toString() : '<undefined resolver>');
        tokens.push(`(${this.lifecycle.toString()})`);
        if (this.resolver && this.resolver.dependencies && this.resolver.dependencies.length > 0) {
            const deps = this.resolver.dependencies.map(dep => (dep.hint ? `${dep.name}:${dep.hint}` : dep.name));
            tokens.push(`depends on: [${deps.join(', ')}]`);
        }
        return tokens.join(' ');
    }
}
exports.default = Binding;
//# sourceMappingURL=Binding.js.map