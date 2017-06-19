assert = require 'assert'
_      = require 'underscore'

class Inspector

  constructor: (@unmangleNames = false) ->

  getDependencies: (func) ->
    assert func?, 'The argument "func" must have a value'
    params = @getParameterNames(func)
    hints  = @getDependencyHints(func)
    return _.map params, (param) ->
      hints[param] ? {name: param, all: false, hint: undefined}

  getParameterNames: (func) ->
    assert func?, 'The argument "func" must have a value'
    regex   = /(?:function|constructor)[ A-Za-z0-9]*\(([^)]+)/g;
    matches = regex.exec func.toString()
    return [] if !matches? or matches[1].length == 0
    args = matches[1].split /[,\s]+/
    if @unmangleNames
      return _.map args, (arg) -> arg.replace(/\d+$/, '')
    else
      return args

  getDependencyHints: (func) ->
    assert func?, 'The argument "func" must have a value'

    if _.isObject(func.__hints__)
      return func.__hints__

    regex = /"(.*?)\s*->\s*(all)?\s*(.*?)";/gi
    hints = {}
    while match = regex.exec(func.toString())
      [pattern, argument, all, dependency] = match
      all = true if all?
      if dependency.indexOf(':')
        [name, hint] = dependency.split(/\s*:\s*/, 2)
      else
        name = dependency
        hint = undefined
      hints[argument] = {name, all, hint}
    return hints

  isAutoConstructor: (constructor) ->
    assert constructor?, 'The argument "constructor" must have a value'
    name = constructor.name
    body = constructor.toString()
    return body.indexOf("#{name}.__super__.constructor.apply(this, arguments);") > 0

module.exports = Inspector
