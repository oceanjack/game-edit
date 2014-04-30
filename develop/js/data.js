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


  exports.Data.attributeSet = {
    posX: 'posX',
    posY: 'posY',
    dir: 'dir',
    speed: 'speed',
    visiable: 'visiable',
    belong: 'belog',
    others: 'others'
  };


  exports.Data.setAttribute = function(posX, posY, dir, speed, visiable, status, belong, others) {
    return {
      'posX': posX,
      'posY': posY,
      'dir': dir,
      'speed': speed,
      'visiable': visiable,
      'status': status,
      'belong': belong,
      'others': others
    };
  };


  exports.Data.getAttribute = function(data) {
    return {
      posX: data['posX'],
      posY: data['posY'],
      dir: data['dir'],
      speed: data['speed'],
      visiable: data['visiable'],
      status: data['status'],
      belong: data['belong'],
      others: data['others']
    };
  };
});
