import { expect } from 'chai';
import Forge from '../src/Forge';
import ResolutionError from '../src/errors/ResolutionError';

import { Foo, DependsOnFoo } from './lib/types';

describe('Lifecycle', function() {

//---------------------------------------------------------------------------------------------------

  describe('Singleton lifecycle', function() {

    describe('given one binding: a->Foo(singleton)', function() {

      const forge = new Forge();
      forge.bind('a').to.type(Foo).as.singleton();

      it('should create an instance of Foo when "a" is requested', function() {
        const result = forge.get('a');
        expect(result).to.be.an.instanceOf(Foo);
      });

      it('should return the same instance of Foo for subsequent requests', function() {
        const result1 = forge.get('a');
        const result2 = forge.get('a');
        expect(result1).to.equal(result2);
      });
    });

    describe('given two bindings: dependent->DependsOnFoo(transient) and foo->Foo(singleton)', function() {

      const forge = new Forge();
      forge.bind('dependent').to.type(DependsOnFoo).as.transient();
      forge.bind('foo').to.type(Foo).as.singleton();

      it('should inject the same instance of Foo into DependsOnFoo as is returned when "foo" is requested', function() {
        const foo = forge.get('foo');
        const dependent = forge.get('dependent');
        expect(foo).to.equal(dependent.foo);
      });

      it('should inject the same instance of Foo into each instance of DependsOnFoo', function() {
        const dependent1 = forge.get('dependent');
        const dependent2 = forge.get('dependent');
        expect(dependent1.foo).to.equal(dependent2.foo);
      });
    });
  });

//---------------------------------------------------------------------------------------------------

  describe('Transient lifecycle', function() {

    describe('given one binding: a->Foo, with a transient lifecycle', function() {

      const forge = new Forge();
      forge.bind('a').to.type(Foo).as.transient();

      it('should create an instance of Foo when "a" is requested', function() {
        const result = forge.get('a');
        expect(result).to.be.an.instanceOf(Foo);
      });

      it('should return a different instance of Foo for each request', function() {
        const result1 = forge.get('a');
        const result2 = forge.get('a');
        expect(result1).to.not.equal(result2);
      });
    });

    describe('given two bindings: dependent->DependsOnFoo(transient) and foo->Foo(transient)', function() {

      const forge = new Forge();
      forge.bind('dependent').to.type(DependsOnFoo).as.transient();
      forge.bind('foo').to.type(Foo).as.transient();

      it('should inject different instances of Foo into DependsOnFoo as that returned when "foo" is requested', function() {
        const foo = forge.get('foo');
        const dependent = forge.get('dependent');
        expect(foo).not.to.equal(dependent.foo);
      });

      it('should inject different instances of Foo into each instance of DependsOnFoo', function() {
        const dependent1 = forge.get('dependent');
        const dependent2 = forge.get('dependent');
        expect(dependent1.foo).not.to.equal(dependent2.foo);
      });
    });
  });
});

//---------------------------------------------------------------------------------------------------
