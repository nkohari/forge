_        = require 'underscore'
Resolver = require './Resolver'

class TypeResolver extends Resolver

  constructor: (container, @type) ->
    super(container)
    @parameters = @getParameterNames(@type)

  resolve: ->
    args = _.map @parameters, (param) => @container.get(param)
    ctor = @type.bind.apply(@type, [null].concat(args))
    return new ctor()

  getParameterNames: (type) ->
    regex   = /function .*\(([^)]+)/g
    matches = regex.exec type.toString()
    if !matches? or matches[1].length == 0
      return []
    else
      args = matches[1].split /[,\s]+/
      return args

module.exports = TypeResolver
