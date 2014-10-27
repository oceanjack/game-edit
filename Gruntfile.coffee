path = require('path')
settings = require('./grunt/settings')

module.exports = (grunt) ->
  require('load-grunt-config')(grunt, {
    configPath: path.join(process.cwd(), 'grunt/config')
    init: true
    config:
      settings: settings
      pkg:  require('./package.json')
    loadGruntTasks:
      pattern: 'grunt-*'
      config: require('./package.json')
      scope: 'devDependencies'
  })

  grunt.renameTask 'closureDepsWriter', 'deps'
  grunt.renameTask 'closureSoys', 'soy'
  grunt.renameTask 'closureBuilder', 'compile'

  grunt.registerTask 'build', ->
    for dir in settings.assets
      grunt.file.mkdir dir

  # Default
  grunt.registerTask 'default', ->
    grunt.task.run ['build', 'soy', 'less:dev', 'deps']

  # Stage
  grunt.registerTask 'pre_stage', ->
    grunt.task.run 'soy', 'less:dev', 'clean:plovr'

  grunt.registerMultiTask 'stage', 'stage environment auto tool', ->
    grunt.task.run 'build', 'pre_stage'
    for target in @data
      grunt.task.run "plovr:stage_#{target}"
    grunt.task.run 'wrap'

  # Deploy
  grunt.registerTask 'pre_deploy', ->
    grunt.task.run 'soy', 'less:prod', 'clean:plovr'

  grunt.registerMultiTask 'deploy', 'deploy environment auto tool', ->
    grunt.task.run 'build', 'pre_deploy'
    for target in @data
      grunt.task.run "plovr:prod_#{target}"
    grunt.task.run 'wrap'
