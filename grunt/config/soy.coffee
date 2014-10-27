module.exports =
  all:
    src: 'develop/**/*.soy'
    soyToJsJarPath: '<%= settings.soyCompiler %>'
    options:
      shouldGenerateJsdoc: true,
      shouldProvideRequireSoyNamespaces: true
