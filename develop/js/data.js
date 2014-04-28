goog.provide('ocean.onlineAI.Data');

goog.scope(function() {
  var exports = ocean.onlineAI;

  exports.Data.setCharacter = function(width, height, src, opt_posX, opt_posY) {
    return {
      'w': width,
      'h': height,
      's': src,
      'x': opt_posX,
      'y': opt_posY
    };
  };

  
  exports.Data.getCharacter = function(data) {
    return {
      width: data['w'],
      height: data['h'],
      src: data['s'],
      opt_posX: data['x'],
      opt_posY: data['y']
    };
  };
});
