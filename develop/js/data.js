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
    status: 'status',
    belong: 'belong',
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


  exports.Data.setEventData = function(eventJudge, eventAction, eventMap, eventMapConfig) {
    return {
      'ej': eventJudge,
      'ea': eventAction ,
      'em': eventMap,
      'mc': eventMapConfig
    };
  };


  exports.Data.getEventData = function(data) {
    return {
      eventJudge: data['ej'],
      eventAction: data['ea'] ,
      eventMap: data['em'],
      eventMapConfig: data['mc']
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


  exports.Data.setEventMapConfig = function(rotate, turn) {
    return {
      'r': rotate,
      't': turn
    };
  };


  exports.Data.getEventMapConfig = function(data) {
    return {
      rotate: data['r'],
      turn: data['t']
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
