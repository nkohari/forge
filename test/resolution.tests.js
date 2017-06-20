import { expect } from 'chai';
import Forge from '../src/Forge';
import ResolutionError from '../src/errors/ResolutionError';

import { Foo, DependsOnFoo, CircularA, CircularB } from './lib/types';

describe('Resolution', function() {

//---------------------------------------------------------------------------------------------------

  describe('Circular dependency checking', () =>

    describe('given two bindings, a->CircularA and b->CircularB', function() {

      const forge = new Forge();
      forge.bind('a').to.type(CircularA);
      forge.bind('b').to.type(CircularB);

      const expectedMessage = name => `Could not resolve component named ${name}: Circular dependencies detected`;

      it('should throw a ResolutionError when "a" is requested', function() {
        const resolve = () => forge.get('a');
        expect(resolve).to.throw(ResolutionError, expectedMessage('a'));
      });

      it('should throw a ResolutionError when "b" is requested', function() {
        const resolve = () => forge.get('b');
        expect(resolve).to.throw(ResolutionError, expectedMessage('b'));
      });
    })
  );

//---------------------------------------------------------------------------------------------------

  describe('Contextual argument overrides', function() {

    describe('given one binding, a->DependsOnFoo, with a singconston lifecycle', function() {

      const forge = new Forge();
      forge.bind('a').to.type(DependsOnFoo);

      it('should inject the overridden argument that is passed to the first call to get()', function() {
        const foos = [new Foo(), new Foo()];
        const results = foos.map(foo => forge.get('a', null, {foo}));
        results.forEach((result, index) => {
          expect(result).to.be.an.instanceOf(DependsOnFoo);
          expect(result.foo).to.equal(foos[0]);
        });
      });
    }); // Always the first one

    describe('given one binding, a->DependsOnFoo, with a transient lifecycle', function() {

      const forge = new Forge();
      forge.bind('a').to.type(DependsOnFoo).as.transient();

      it('should inject the overridden argument when one is supplied to get()', function() {
        const foos = [new Foo(), new Foo()];
        const results = foos.map(foo => forge.get('a', null, {foo}));
        return results.forEach((result, index) => {
          expect(result).to.be.an.instanceOf(DependsOnFoo);
          expect(result.foo).to.equal(foos[index]);
        });
      });
    });
  });

//---------------------------------------------------------------------------------------------------

  describe('Ephemeral bindings', function() {

    describe('given one binding: foo->type{Foo}, and an unregistered type DependsOnFoo', function() {

      const forge = new Forge();
      forge.bind('foo').to.type(Foo);

      it('should inject an instance of Foo when create() is called with DependsOnFoo', function() {
        const result = forge.create(DependsOnFoo);
        expect(result).to.be.an.instanceOf(DependsOnFoo);
        expect(result.foo).to.be.an.instanceOf(Foo);
      });
    });

    describe('given no bindings, and an unregistered type DependsOnFoo', function() {

      const forge = new Forge();

      it('should throw an exception when create() is called with DependsOnFoo', function() {
        const resolve = () => forge.create(DependsOnFoo);
        expect(resolve).to.throw(ResolutionError, "Could not resolve component named foo: No matching bindings were available");
      });
    });
  });
});

//---------------------------------------------------------------------------------------------------
