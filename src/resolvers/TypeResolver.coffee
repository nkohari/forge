_        = require 'underscore'
Resolver = require './Resolver'

class TypeResolver extends Resolver

  constructor: (forge, @type) ->
    super(forge)
    params = @getParameterNames(@type)
    hints  = @getHints(@type)
    @dependencies = _.map params, (param) -> hints[param] ? param

  resolve: ->
    args = _.map @dependencies, (name) => @forge.get(name)
    ctor = @type.bind.apply(@type, [null].concat(args))
    return new ctor()

  getParameterNames: (type) ->
    regex   = /function .*\(([^)]+)/g
    matches = regex.exec type.toString()
    return [] if !matches? or matches[1].length == 0
    return matches[1].split /[,\s]+/

  getHints: (type) ->
    regex = /"(.*?)\s*->\s*(.*?)";/g
    hints = {}
    while match = regex.exec(type.toString())
      [hint, argument, dependency] = match
      hints[argument] = dependency
    return hints

module.exports = TypeResolver
