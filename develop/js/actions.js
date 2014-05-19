goog.provide('ocean.onlineAI.Actions');

goog.require('goog.events');

goog.require('ocean.onlineAI.Data');
goog.require('ocean.onlineAI.One');

goog.scope(function() {
  var exports = ocean.onlineAI;
  var dataModel = exports.Data;
  
  exports.Actions = function() {
  };


  exports.Actions.Move = function(data, world) {
    var posX = data.getAttribute(dataModel.attributeSet.posX);
    var posY = data.getAttribute(dataModel.attributeSet.posY);
    var speed = data.getAttribute(dataModel.attributeSet.speed);
    var dir = data.getAttribute(dataModel.attributeSet.dir);
    var tmp = world[posY][posX];
    world[posY][posX] = null;
    posX = parseInt(posX);
    posY = parseInt(posY);
    var oldX = posX;
    var oldY = posY;
    var oldStatus = data.getAttribute(dataModel.attributeSet.status);
    speed = parseInt(speed);
    switch(dir) {
      case '上':
        posY -= speed;
        break;
      case '下':
        posY += speed;
        break;
      case '左':
        posX -= speed;
        break;
      case '右':
        posX += speed;
        break;
      default:
        break;
    }
    world[posY][posX] = tmp;
    world[posY][posX].setAttribute(dataModel.attributeSet.status, 'moving');
    var ll = 0.05;
    var step = function() {
      var nowX = tmp.getAttribute(dataModel.attributeSet.posX);
      var nowY = tmp.getAttribute(dataModel.attributeSet.posY);
      var change = false;
      if(nowX - posX > 0.01) {
        nowX -= ll;
        change = true;
      } else if(posX - nowX > 0.01) {
        nowX += ll;
        change = true;
      }
      if(nowY - posY > 0.01) {
        nowY -= ll;
        change = true;
      } else if(posY - nowY > 0.01) {
        nowY += ll;
        change = true;
      }
      if(change) {
        tmp.setAttribute(dataModel.attributeSet.posX, nowX);
        tmp.setAttribute(dataModel.attributeSet.posY, nowY); 
        window.setTimeout(function() {step()}, 30);
      } else {
        tmp.setAttribute(dataModel.attributeSet.posX, posX);
        tmp.setAttribute(dataModel.attributeSet.posY, posY); 
        tmp.setAttribute(dataModel.attributeSet.status, oldStatus);
      }
    };
    step();
  };


  exports.Actions.MoveForce = function(data, dir) {
    var posX = data.getAttribute(dataModel.attributeSet.posX);
    var posY = data.getAttribute(dataModel.attributeSet.posY);
    var speed = data.getAttribute(dataModel.attributeSet.speed);
    posX = parseInt(posX);
    posY = parseInt(posY);
    speed = parseInt(speed);
    switch(dir) {
      case '上':
        posY -= speed;
        break;
      case '下':
        posY += speed;
        break;
      case '左':
        posX -= speed;
        break;
      case '右':
        posX += speed;
        break;
      default:
        break;
    };
    data.setAttribute(dataModel.attributeSet.posX, posX);
    data.setAttribute(dataModel.attributeSet.posY, posY);
    data.setAttribute(dataModel.attributeSet.dir, dir);
  };


  exports.Actions.Swap = function(data, data2, key, opt_key) {
    var val = data.getAttribute(key, opt_key);
    var val2 = data2.getAttribute(key, opt_key);
    data.setAttribute(key, val2, opt_key);
    data2.setAttribute(key, val, opt_key);
  };


  exports.Actions.CreateOne = function(posX, posY, data) {
    var one = new exports.One(data);
    one.setAttribute(dataModel.attributeSet.posX, posX);
    one.setAttribute(dataModel.attributeSet.posY, posY);
    return one;
  };


  exports.Actions.KillOne = function(data) {
    data = null;
  };


  exports.Actions.ChangeAttr = function(data, key, val, opt_key) {
    data.setAttribute(key, val, opt_key);
  };


  exports.Actions.End = function(status) {
    status.end && (status.end = true);
  };


  exports.Actions.Nothing = function() {
  };


  exports.Actions.AddNum = function(data, key, val) {
    if(data == null || data == undefined) {
      return;
    }
    var tmp = data.getAttribute(key);
    if(window.isNaN(parseInt(tmp)) || window.isNaN(parseInt(val))) {
      return;
    }
    tmp = parseInt(tmp) + parseInt(val);
    data.setAttribute(key, tmp);
  };


  exports.Actions.ReduceNum = function(data, key, val) {
    if(data == null || data == undefined) {
      return;
    }
    var tmp = data.getAttribute(key);
    if(window.isNaN(parseInt(tmp)) || window.isNaN(parseInt(val))) {
      return;
    }
    tmp = parseInt(tmp) - parseInt(val);
    data.setAttribute(key, tmp);
  };
});
