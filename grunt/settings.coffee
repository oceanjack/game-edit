assets = ('assets/'+subdir for subdir in ['js'])
assets.push('assets')

module.exports =
  # paths
  closurebuilder: './lib/closure-library/closure/bin/build/closurebuilder.py'
  soyCompiler: './lib/closure-template/SoyToJsSrcCompiler.jar'
  closureCompiler: './lib/closure-compiler/compiler.jar'
  closureLibrary: './lib/closure-library/'
  depswriter: './lib/closure-library/closure/bin/build/depswriter.py'
  roots: [
    'lib/closure-template'
    'lib/closure-library'
    'develop'
  ]
  assets: assets
  externs: ['w3c_css.js']
    .map (name) -> "tasks/externs/#{name}"
  plovrBasePath: 'grunt/plovr'
