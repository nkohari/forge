class Resolver

  constructor: (@container) ->

  resolve: ->
    throw new Error("You must implement resolve() on #{@constructor.name}")

module.exports = Resolver
