goog.provide('ocean.onlineAI.Data');

goog.scope(function() {
  var exports = ocean.onlineAI;


  exports.Data.setImg = function(img) {
    if(img) {
      return {
        's': img.src,
        'w': img.width,
        'h': img.height
      };
    }
    return null;
  };
  
  
  exports.Data.getImg = function(data) {
    if(data) {
      var img = new Image();
      img.src = data['s'];
      img.width = data['w'];
      img.height = data['h'];
      return img;
    }
    return null;
  };


  exports.Data.setCharacter = function(width, height, src, opt_posX, opt_posY, name, index) {
    return {
      'w': width,
      'h': height,
      's': src,
      'x': opt_posX,
      'y': opt_posY,
      'n': name,
      'i': index
    };
  };

 
  exports.Data.getCharacter = function(data) {
    return {
      width: data['w'],
      height: data['h'],
      src: data['s'],
      opt_posX: data['x'],
      opt_posY: data['y'],
      name: data['n'],
      index: data['i']
    };
  };


  exports.Data.attributeSet = {
    posX: 'posX',
    posY: 'posY',
    dir: 'dir',
    speed: 'speed',
    visiable: 'visiable',
    status: 'status',
    belong: 'belong',
    others: 'others'
  };


  exports.Data.setAttrList = function(options, name) {
    return {
      'o': options,
      'n': name
    };
  };


  exports.Data.getAttrList = function(data) {
    return {
      options: data['o'],
      name: data['n']
    };
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


  exports.Data.setRealMapData = function(posX, posY, link, attr, index) {
    return {
      'x': posX,
      'y': posY,
      'l': link,
      'a': attr,
      'i': index
    };
  };
  
  
  exports.Data.getRealMapData = function(data) {
    return {
      posX: data['x'],
      posY: data['y'],
      link: data['l'],
      attr: data['a'],
      index: data['i']
    };
  };

  exports.Data.setEventData = function(eventJudge, eventAction, eventMap, eventMapConfig, name, type) {
    return {
      'ej': eventJudge,
      'ea': eventAction ,
      'em': eventMap,
      'mc': eventMapConfig,
      'nm': name,
      'ty': type
    };
  };


  exports.Data.getEventData = function(data) {
    return {
      eventJudge: data['ej'],
      eventAction: data['ea'] ,
      eventMap: data['em'],
      eventMapConfig: data['mc'],
      name: data['nm'],
      type: data['ty']
    };
  };


  exports.Data.setEventJudge = function(firstNode, firstAttr, operation, secondNode, secondAttr, logic) {
    return {
      'fn': firstNode,
      'fa': firstAttr,
      'op': operation,
      'sn': secondNode,
      'sa': secondAttr,
      'lo': logic
    };
  };


  exports.Data.getEventJudge = function(data) {
    return {
      firstNode: data['fn'],
      firstAttr: data['fa'],
      operation: data['op'],
      secondNode: data['sn'],
      secondAttr: data['sa'],
      logic: data['lo']
    };
  };


  exports.Data.setEventAction = function(action, firstNode, firstAttr, secondNode, secondAttr) {
    return {
      'ac': action,
      'fn': firstNode,
      'fa': firstAttr,
      'sn': secondNode,
      'sa': secondAttr
    };
  };


  exports.Data.getEventAction = function(data) {
    return {
      action: data['ac'],
      firstNode: data['fn'],
      firstAttr: data['fa'],
      secondNode: data['sn'],
      secondAttr: data['sa']
    };
  };


  exports.Data.setEventMap = function(pos, status) {
    return {
      'p': pos,
      's': status
    };
  };


  exports.Data.getEventMap = function(data) {
    return {
      pos: data['p'],
      status: data['s']
    };
  };


  exports.Data.setEventMapConfig = function(rotate, turn, std) {
    return {
      'r': rotate,
      't': turn,
      's': std,
    };
  };


  exports.Data.getEventMapConfig = function(data) {
    return {
      rotate: data['r'],
      turn: data['t'],
      std: data['s']
    };
  };


  exports.Data.setGameData = function(size, background, cellSet, attrSet, world, event) {
    return {
      's': size,
      'b': background,
      'c': cellSet,
      'a': attrSet,
      'w': world,
      'e': event
    };
  };


  exports.Data.getGameData = function(data) {
    return {
      size: data['s'],
      background: data['b'] ,
      cellSet: data['c'] ,
      attrSet: data['a'] ,
      world: data['w'] ,
      event: data['e']
    };
  };
});
