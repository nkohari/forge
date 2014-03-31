assert = require 'assert'

class Resolver

  constructor: (@forge) ->
    assert @forge?, 'The argument "forge" must have a value'

  resolve: ->
    throw new Error("You must implement resolve() on #{@constructor.name}")

module.exports = Resolver
