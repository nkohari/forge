assert = require 'assert'
_      = require 'underscore'

class Resolver

  constructor: (@forge, @binding) ->
    assert @forge?,   'The argument "forge" must have a value'
    assert @binding?, 'The argument "binding" must have a value'

  resolve: (context, args) ->
    throw new Error("You must implement resolve() on #{@constructor.name}")

  resolveDependencies: (context, dependencies, args) ->
    _.map dependencies, (dep) =>
      return @forge if dep.name is 'forge'
      override = args[dep.name] ? @binding.arguments[dep.name]
      return override ? @forge.resolve(dep.name, context, dep.hint, dep.all)

module.exports = Resolver
