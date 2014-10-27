settings = require('../settings')
module.exports =
  options:
    closureLibraryPath: settings.closureLibrary
    depswriter: settings.depswriter
    root_with_prefix: settings.roots.map (root) ->
      "\"#{root} ../../../../#{root}\""
  deps:
    dest: 'assets/js/deps.js'
