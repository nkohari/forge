import Forge, { ResolutionError } from '../src';
import { expect } from 'chai';

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
    }));

  //---------------------------------------------------------------------------------------------------

  describe('Contextual argument overrides', function() {
    describe('given one binding, a->DependsOnFoo, with a singleton lifecycle', function() {
      const forge = new Forge();
      forge.bind('a').to.type(DependsOnFoo);

      it('should inject the overridden argument that is passed to the first call to get()', function() {
        const foos = [new Foo(), new Foo()];
        const results = foos.map(foo => forge.get('a', null, { foo }));
        results.forEach((result, index) => {
          expect(result).to.be.an.instanceOf(DependsOnFoo);
          expect(result.foo).to.equal(foos[0]);
        });
      });
    }); // Always the first one

    describe('given one binding, a->DependsOnFoo, with a transient lifecycle', function() {
      const forge = new Forge();
      forge
        .bind('a')
        .to.type(DependsOnFoo)
        .as.transient();

      it('should inject the overridden argument when one is supplied to get()', function() {
        const foos = [new Foo(), new Foo()];
        const results = foos.map(foo => forge.get('a', null, { foo }));
        return results.forEach((result, index) => {
          expect(result).to.be.an.instanceOf(DependsOnFoo);
          expect(result.foo).to.equal(foos[index]);
        });
      });
    });
  });
});

//---------------------------------------------------------------------------------------------------
