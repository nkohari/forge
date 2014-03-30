expect          = require('chai').expect
Forge           = require '../src/Forge'
ResolutionError = require '../src/errors/ResolutionError'

{CircularA, CircularB} = require './lib/types'

describe 'Resolution', ->

#---------------------------------------------------------------------------------------------------

  describe 'given two bindings, a->CircularA and b->CircularB', ->

    forge = new Forge()
    forge.bind('a').to.type(CircularA)
    forge.bind('b').to.type(CircularB)

    expectedMessage = (name) ->
      "Could not resolve binding for component named #{name}: Circular dependencies detected"

    it 'should throw a ResolutionError when "a" is requested', ->
      resolve = -> forge.get('a')
      expect(resolve).to.throw(ResolutionError, expectedMessage('a'))

    it 'should throw a ResolutionError when "b" is requested', ->
      resolve = -> forge.get('b')
      expect(resolve).to.throw(ResolutionError, expectedMessage('b'))

#---------------------------------------------------------------------------------------------------
