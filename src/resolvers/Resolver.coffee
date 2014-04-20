assert = require 'assert'
_      = require 'underscore'

class Resolver

  constructor: (@forge, @binding) ->
    assert @forge?,   'The argument "forge" must have a value'
    assert @binding?, 'The argument "binding" must have a value'

  resolve: (context, args) ->
    throw new Error("You must implement resolve() on #{@constructor.name}")

  resolveDependencies: (context, names, args) ->
    _.map names, (name) =>
      return @forge if name is 'forge'
      return args[name] ? @binding.arguments[name] ? @forge.resolve(context, name)

module.exports = Resolver
