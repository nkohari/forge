class Resolver

  constructor: (@forge) ->

  resolve: ->
    throw new Error("You must implement resolve() on #{@constructor.name}")

module.exports = Resolver
