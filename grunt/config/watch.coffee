module.exports =
  options:
    goog: true
    spawn: false
    livereload: true
  less:
    files: ['src/**/*.less']
    tasks: ['less:dev', 'notify:less']
  soy:
    files: ['src/**/*.soy']
    tasks: ['soy:all', 'notify:soy']
