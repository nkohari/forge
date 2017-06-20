import { expect } from 'chai';
import Forge from '../src/Forge';
import ResolutionError from '../src/errors/ResolutionError';

import {
  Foo,
  Bar,
  DependsOnFoo,
  TypeWithBindingHints,
  TypeWithAllBindingHint,
  TypeWithConditionalBindingHint,
  DependsOnForge
} from './lib/types';

describe('Binding', function() {

//---------------------------------------------------------------------------------------------------

  describe('Basics', function() {

    describe('given one binding: a->type{Foo}', function() {

      const forge = new Forge();
      forge.bind('a').to.type(Foo);

      it('should create an instance of Foo when "a" is requested', function() {
        const a = forge.get('a');
        expect(a).to.be.an.instanceOf(Foo);
      });
    });

    describe('given two bindings: a->type{Foo} and b->type{Bar}', function() {

      const forge = new Forge();
      forge.bind('a').to.type(Foo);
      forge.bind('b').to.type(Bar);

      it('should create an instance of Foo when "a" is requested and Bar when "b" is requested', function() {
        const a = forge.get('a');
        const b = forge.get('b');
        expect(a).to.be.an.instanceOf(Foo);
        expect(b).to.be.an.instanceOf(Bar);
      });
    });
  });

//---------------------------------------------------------------------------------------------------

  describe('Dependency resolution', function() {

    describe('given two bindings: foo->type{Foo} and dependent->type{DependsOnFoo}', function() {

      const forge = new Forge();
      forge.bind('foo').to.type(Foo);
      forge.bind('dependent').to.type(DependsOnFoo);

      it('should inject an instance of Foo into an instance of DependsOnFoo when "dependent" is requested', function() {
        const result = forge.get('dependent');
        expect(result).to.be.an.instanceOf(DependsOnFoo);
        expect(result.foo).to.be.an.instanceOf(Foo);
      });
    });

    describe('given one binding: dependent->type{DependsOnFoo}, and no binding for foo', function() {

      const forge = new Forge();
      forge.bind('dependent').to.type(DependsOnFoo);

      it('should throw a ResolutionError if "dependent" is requested', function() {
        const resolve = () => forge.get('dependent');
        expect(resolve).to.throw(ResolutionError);
      });
    });
  });

//---------------------------------------------------------------------------------------------------

  describe('Instance and function bindings', function() {

    describe('given one binding: a->instance{Foo}', function() {

      const forge = new Forge();
      const instance = new Foo();
      forge.bind('a').to.instance(instance);

      it('should return the bound instance when "a" is requested', function() {
        const result = forge.get('a');
        expect(result).to.equal(instance);
      });
    });

    describe('given one binding: a->function', function() {

      let wasCalled = false;
      const func = function() {
        wasCalled = true;
        return new Foo();
      };

      const forge = new Forge();
      forge.bind('a').to.function(func);

      it('should call the bound function when "a" is requested', function() {
        const a = forge.get('a');
        expect(a).to.be.instanceOf(Foo);
        expect(wasCalled).to.be.true;
      });
    });
  });

//---------------------------------------------------------------------------------------------------

  describe('Binding hints', function() {

    describe('given a binding to a type that contains binding hints', function() {

      const forge = new Forge();
      forge.bind('a').to.type(Foo);
      forge.bind('b').to.type(Bar);
      forge.bind('hints').to.type(TypeWithBindingHints);

      it('should inject an instance of Foo and Bar into an instance of TypeWithBindingHints', function() {
        const result = forge.get('hints');
        expect(result).to.be.an.instanceOf(TypeWithBindingHints);
        expect(result.depA).to.be.an.instanceOf(Foo);
        expect(result.depB).to.be.an.instanceOf(Bar);
      });
    });

    describe('given a binding to a type that contains an "all" binding hint', function() {

      const forge = new Forge();
      forge.bind('dep').to.type(Foo).when('foo');
      forge.bind('dep').to.type(Bar).when('bar');
      forge.bind('hints').to.type(TypeWithAllBindingHint);

      it('should inject an array containing instances of Foo and Bar into an instance of TypeWithAllBindingHint', function() {
        const result = forge.get('hints');
        expect(result).to.be.an.instanceOf(TypeWithAllBindingHint);
        expect(result.deps).to.be.an.instanceOf(Array);
        expect(result.deps[0]).to.be.an.instanceOf(Foo);
        expect(result.deps[1]).to.be.an.instanceOf(Bar);
      });
    });

    describe('given a binding to a type that contains a conditional binding hint', function() {

      const forge = new Forge();
      forge.bind('dep').to.type(Foo).when('foo');
      forge.bind('dep').to.type(Bar).when('bar');
      forge.bind('hints').to.type(TypeWithConditionalBindingHint);

      it('should inject an instance of Foo into an instance of TypeWithConditionalBindingHint', function() {
        const result = forge.get('hints');
        expect(result).to.be.an.instanceOf(TypeWithConditionalBindingHint);
        expect(result.dep).to.be.an.instanceOf(Foo);
      });
    });
  });

//---------------------------------------------------------------------------------------------------

  describe('Multiple bindings for same service', () =>

    describe('given two bindings: a->type{Foo} and a->type{Foo}', function() {

      const forge = new Forge();
      forge.bind('a').to.type(Foo);
      forge.bind('a').to.type(Foo);

      it('should return an array of two instances of Foo when get() is called for "a"', function() {
        const results = forge.get('a');
        expect(results).to.be.an('array');
        expect(results.length).to.equal(2);
        expect(results[0]).to.be.an.instanceOf(Foo);
        expect(results[1]).to.be.an.instanceOf(Foo);
      });

      it('should throw an exception if getOne() is called for "a"', function() {
        const resolve = () => forge.getOne('a');
        expect(resolve).to.throw(ResolutionError);
      });
    })
  );

//---------------------------------------------------------------------------------------------------

  describe('Conditional bindings and resolution hints', function() {

    describe('given two conditional bindings: a?->type{Foo} and a?->type{Bar}, using equality conditions', function() {

      const forge = new Forge();
      forge.bind('a').to.type(Foo).when(1);
      forge.bind('a').to.type(Bar).when(2);

      it('should throw an exception if get() is called for "a" with no resolution hint', function() {
        const resolve = () => forge.get('a');
        expect(resolve).to.throw(ResolutionError);
      });

      it('should return an instance of Foo when get() is called for "a" with the correct hint', function() {
        const a = forge.get('a', 1);
        expect(a).to.be.an.instanceOf(Foo);
      });

      it('should return an instance of Bar when get() is called for "a" with the correct hint', function() {
        const a = forge.get('a', 2);
        expect(a).to.be.an.instanceOf(Bar);
      });

      it('should return an array of an instance of Foo and Bar when getAll() is called for "a"', function() {
        const results = forge.getAll('a');
        expect(results.length).to.equal(2);
        expect(results[0]).to.be.an.instanceOf(Foo);
        expect(results[1]).to.be.an.instanceOf(Bar);
      });
    });

    describe('given two conditional bindings: a?->type{Foo} and a?->type{Bar}, using explicit predicates', function() {

      const forge = new Forge();
      forge.bind('a').to.type(Foo).when(hint => hint == 1);
      forge.bind('a').to.type(Bar).when(hint => hint == 2);

      it('should throw an exception if get() is called for "a" with no resolution hint', function() {
        const resolve = () => forge.get('a');
        expect(resolve).to.throw(ResolutionError);
      });

      it('should return an instance of Foo when get() is called for "a" with the correct hint', function() {
        const a = forge.get('a', 1);
        expect(a).to.be.an.instanceOf(Foo);
      });

      it('should return an instance of Bar when get() is called for "a" with the correct hint', function() {
        const a = forge.get('a', 2);
        expect(a).to.be.an.instanceOf(Bar);
      });

      it('should return an array of an instance of Foo and Bar when getAll() is called for "a"', function() {
        const results = forge.getAll('a');
        expect(results.length).to.equal(2);
        expect(results[0]).to.be.an.instanceOf(Foo);
        expect(results[1]).to.be.an.instanceOf(Bar);
      });
    });
  });

//---------------------------------------------------------------------------------------------------

  describe('Unbinding', function() {

    describe('given one binding: a->type{Foo}', function() {

      let forge = undefined;
      beforeEach(function() {
        forge = new Forge();
        return forge.bind('a').to.type(Foo);
      });

      it('should return 1 when unbind() is called for "a"', function() {
        const result = forge.unbind('a');
        expect(result).to.equal(1);
      });

      it('should return 0 when unbind() is called for "b"', function() {
        const result = forge.unbind('b');
        expect(result).to.equal(0);
      });

      it('should throw an exception if get() is called for "a" after unbinding', function() {
        forge.unbind('a');
        const resolve = () => forge.get('a');
        expect(resolve).to.throw(ResolutionError);
      });
    });

    describe('given two bindings: a->type{Foo}, a->type{Bar}', function() {

      let forge = undefined;
      beforeEach(function() {
        forge = new Forge();
        forge.bind('a').to.type(Foo);
        return forge.bind('a').to.type(Bar);
      });

      it('should return 2 when unbind() is called for "a"', function() {
        const result = forge.unbind('a');
        expect(result).to.equal(2);
      });

      it('should return 0 when unbind() is called for "b"', function() {
        const result = forge.unbind('b');
        expect(result).to.equal(0);
      });

      it('should throw an exception if get() is called for "a" after unbinding', function() {
        forge.unbind('a');
        const resolve = () => forge.get('a');
        expect(resolve).to.throw(ResolutionError);
      });
    });

    describe('given two bindings: a->type{Foo}, b->type{Bar}', function() {

      let forge = undefined;
      beforeEach(function() {
        forge = new Forge();
        forge.bind('a').to.type(Foo);
        forge.bind('b').to.type(Bar);
      });

      it('should return 1 when unbind() is called for "a"', function() {
        const result = forge.unbind('a');
        expect(result).to.equal(1);
      });

      it('should return 1 when unbind() is called for "b"', function() {
        const result = forge.unbind('b');
        expect(result).to.equal(1);
      });

      it('should throw an exception if get() is called for "a" after unbinding "a"', function() {
        forge.unbind('a');
        const resolve = () => forge.get('a');
        expect(resolve).to.throw(ResolutionError);
      });

      it('should return an instance of Bar if get() is called for "b" after unbinding "a"', function() {
        forge.unbind('a');
        const b = forge.get('b');
        expect(b).to.be.an.instanceOf(Bar);
      });
    });
  });

//---------------------------------------------------------------------------------------------------

  describe('Rebinding', function() {

    describe('given one binding: a->type{Foo}', function() {

      let forge = undefined;
      beforeEach(function() {
        forge = new Forge();
        return forge.bind('a').to.type(Foo);
      });

      describe('and a rebinding: a->type{Bar}', () =>
        it('should return an instance of Bar when get() is called for "a"', function() {
          forge.rebind('a').to.type(Bar);
          const a = forge.get('a');
          expect(a).to.be.an.instanceOf(Bar);
        })
      );

      describe('and a rebinding: b->type{Bar}', () =>
        it('should return an instance of Bar when get() is called for "b"', function() {
          forge.rebind('b').to.type(Bar);
          const b = forge.get('b');
          expect(b).to.be.an.instanceOf(Bar);
        })
      );
    });

    describe('given two bindings: a->type{Foo} and a->type{Bar}', function() {

      let forge = undefined;
      beforeEach(function() {
        forge = new Forge();
        forge.bind('a').to.type(Foo);
        forge.bind('a').to.type(Bar);
      });

      describe('and a rebinding: a->type{Bar}', () =>

        it('should return an instance of Bar when get() is called for "a"', function() {
          forge.rebind('a').to.type(Bar);
          const a = forge.get('a');
          expect(a).to.be.an.instanceOf(Bar);
        })
      );

      describe('and a rebinding: b->type{Bar}', () =>

        it('should return an instance of Bar when get() is called for "b"', function() {
          forge.rebind('b').to.type(Bar);
          const b = forge.get('b');
          expect(b).to.be.an.instanceOf(Bar);
        })
      );
    });

    describe('given two bindings: a->type{Foo} and b->type{Bar}', function() {

      let forge = undefined;
      beforeEach(function() {
        forge = new Forge();
        forge.bind('a').to.type(Foo);
        forge.bind('b').to.type(Bar);
      });

      describe('and a rebinding: a->type{Bar}', function() {

        it('should return an instance of Bar when get() is called for "a"', function() {
          forge.rebind('a').to.type(Bar);
          const a = forge.get('a');
          expect(a).to.be.an.instanceOf(Bar);
        });

        it('should return an instance of Bar when get() is called for "b"', function() {
          forge.rebind('a').to.type(Bar);
          const b = forge.get('b');
          expect(b).to.be.an.instanceOf(Bar);
        });
      });

      describe('and a rebinding: b->type{Bar}', function() {

        it('should return an instance of Foo when get() is called for "a"', function() {
          forge.rebind('b').to.type(Bar);
          const a = forge.get('a');
          expect(a).to.be.an.instanceOf(Foo);
        });

        it('should return an instance of Bar when get() is called for "b"', function() {
          forge.rebind('b').to.type(Bar);
          const b = forge.get('b');
          expect(b).to.be.an.instanceOf(Bar);
        });
      });
    });
  });

//---------------------------------------------------------------------------------------------------

  describe('Argument overrides', function() {

    describe('given one binding, a->type{DependsOnFoo}, with an argument override', function() {

      const expectedDependency = new Foo();

      const forge = new Forge();
      forge.bind('a').to.type(DependsOnFoo).with({foo: expectedDependency});

      it('should inject the overridden argument into the constructor', function() {
        const a = forge.get('a');
        expect(a).to.be.an.instanceOf(DependsOnFoo);
        expect(a.foo).to.equal(expectedDependency);
      });
    });

    describe('given one binding, a->function, with an argument override', function() {

      const expectedDependency = new Foo();

      let argumentReceived = undefined;
      const resolve = function(foo) {
        argumentReceived = foo;
        return new DependsOnFoo(foo);
      };

      const forge = new Forge();
      forge.bind('a').to.function(resolve).with({foo: expectedDependency});

      it('should pass the overridden argument to the function', function() {
        const a = forge.get('a');
        expect(argumentReceived).to.equal(expectedDependency);
        expect(a).to.be.an.instanceOf(DependsOnFoo);
        expect(a.foo).to.equal(expectedDependency);
      });
    });

    describe('given one binding, a->function, with a dependency hint and an argument override', function() {

      const expectedDependency = new Foo();

      let argumentReceived = undefined;
      const resolve = function(arg) {
        "arg->foo";
        argumentReceived = arg;
        return new DependsOnFoo(arg);
      };

      const forge = new Forge();
      forge.bind('a').to.function(resolve).with({foo: expectedDependency});

      it('should pass the overridden argument to the function', function() {
        const a = forge.get('a');
        expect(argumentReceived).to.equal(expectedDependency);
        expect(a).to.be.an.instanceOf(DependsOnFoo);
        expect(a.foo).to.equal(expectedDependency);
      });
    });
  });

//---------------------------------------------------------------------------------------------------

  describe('Dependencies on the Forge', () =>

    describe('given a binding, a->type{DependsOnForge}', function() {

      const forge = new Forge();
      forge.bind('a').to.type(DependsOnForge);

      it('should inject the Forge when get() is called for "a"', function() {
        const a = forge.get('a');
        expect(a).to.be.an.instanceOf(DependsOnForge);
        expect(a.forge).to.equal(forge);
      });
    })
  );

//---------------------------------------------------------------------------------------------------

});
