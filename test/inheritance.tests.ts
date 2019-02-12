import Forge from '../src';
import { expect } from 'chai';

import {
  Foo,
  Bar,
  ChildWithAutoConstructor,
  ChildWithExplicitConstructor,
  ChildOfChildWithAutoConstructor,
  ChildOfChildWithExplicitConstructor,
} from './lib/types';

describe('Inheritance', function() {
  //---------------------------------------------------------------------------------------------------

  describe('One level', function() {
    describe('given two bindings: foo->type{Foo} and dependent->type{ChildWithAutoConstructor}', function() {
      const forge = new Forge();
      forge.bind('foo').to.type(Foo);
      forge.bind('dependent').to.type(ChildWithAutoConstructor);

      it('should inject an instance of Foo into an instance of ChildWithAutoConstructor', function() {
        const result = forge.get('dependent');
        expect(result).to.be.an.instanceOf(ChildWithAutoConstructor);
        expect(result.foo).to.be.an.instanceOf(Foo);
      });
    });

    describe('given three bindings: foo->type{Foo}, bar->type{Bar}, and dependent->type{ChildWithExplicitConstructor}', function() {
      const forge = new Forge();
      forge.bind('foo').to.type(Foo);
      forge.bind('bar').to.type(Bar);
      forge.bind('dependent').to.type(ChildWithExplicitConstructor);

      it('should inject instances of Foo and Bar into an instance of ChildWithExplicitConstructor', function() {
        const result = forge.get('dependent');
        expect(result).to.be.an.instanceOf(ChildWithExplicitConstructor);
        expect(result.foo).to.be.an.instanceOf(Foo);
        expect(result.bar).to.be.an.instanceOf(Bar);
      });
    });
  });

  //---------------------------------------------------------------------------------------------------

  describe('Two levels', function() {
    describe('given two bindings: foo->type{Foo} and dependent->type{ChildOfChildWithAutoConstructor}', function() {
      const forge = new Forge();
      forge.bind('foo').to.type(Foo);
      forge.bind('dependent').to.type(ChildOfChildWithAutoConstructor);

      it('should inject an instance of Foo into an instance of ChildOfChildWithAutoConstructor', function() {
        const result = forge.get('dependent');
        expect(result).to.be.an.instanceOf(ChildOfChildWithAutoConstructor);
        expect(result.foo).to.be.an.instanceOf(Foo);
      });
    });

    describe('given three bindings: foo->type{Foo}, bar->type{Bar}, and dependent->type{ChildOfChildWithExplicitConstructor}', function() {
      const forge = new Forge();
      forge.bind('foo').to.type(Foo);
      forge.bind('bar').to.type(Bar);
      forge.bind('dependent').to.type(ChildOfChildWithExplicitConstructor);

      it('should inject instances of Foo and Bar into an instance of ChildOfChildWithExplicitConstructor', function() {
        const result = forge.get('dependent');
        expect(result).to.be.an.instanceOf(ChildOfChildWithExplicitConstructor);
        expect(result.foo).to.be.an.instanceOf(Foo);
        expect(result.bar).to.be.an.instanceOf(Bar);
      });
    });
  });
});

//---------------------------------------------------------------------------------------------------
