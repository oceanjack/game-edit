module.exports =
  dev:
    files: [
      {src: './develop/less/style.less', dest: './release/css/style.css'}
    ]
  prod:
    options: {
      yuicompress: true
    }
    files: [
      {src: './develop/less/style.less', dest: './release/css/style.css'}
    ]
