goog.provide('ocean.onlineAI.Actions');

goog.require('goog.events');

goog.require('ocean.onlineAI.Data');
goog.require('ocean.onlineAI.One');

goog.scope(function() {
  var exports = ocean.onlineAI;
  var dataModel = exports.Data;
  
  exports.Actions = function() {
  };


  exports.Actions.Move = function(data, world, opt_dir) {
    var posX = data.getAttribute(dataModel.attributeSet.posX);
    var posY = data.getAttribute(dataModel.attributeSet.posY);
    var speed = data.getAttribute(dataModel.attributeSet.speed);
    opt_dir && data.setAttribute(dataModel.attributeSet.dir, opt_dir);
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
        posY -= 1;
        break;
      case '下':
        posY += 1;
        break;
      case '左':
        posX -= 1;
        break;
      case '右':
        posX += 1;
        break;
      default:
        break;
    }
    world[posY][posX] = tmp;
    world[posY][posX].setAttribute(dataModel.attributeSet.status, 'moving');
    var ll = 0.05 * speed;
    var step = function() {
      if(!tmp) {
        return;
      }
      var nowX = tmp.getAttribute(dataModel.attributeSet.posX);
      var nowY = tmp.getAttribute(dataModel.attributeSet.posY);
      var change = false;
      if(nowX - posX > ll) {
        nowX -= ll;
        change = true;
      } else if(posX - nowX > ll) {
        nowX += ll;
        change = true;
      }
      if(nowY - posY > ll) {
        nowY -= ll;
        change = true;
      } else if(posY - nowY > ll) {
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


  exports.Actions.Swap = function(data, data2, key) {
    var val = data.getAttribute(key);
    var val2 = data2.getAttribute(key);
    data.setAttribute(key, val2);
    data2.setAttribute(key, val);
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


  exports.Actions.ChangeAttr = function(data, key, val) {
    data.setAttribute(key, val);
  };


  exports.Actions.AddNum = function(data, key, val) {
    if(data == null || data == undefined) {
      return;
    }
    var tmp = data.getAttribute(key);
    if(window['isNaN'](parseInt(tmp)) || window['isNaN'](parseInt(val))) {
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
    if(window['isNaN'](parseInt(tmp)) || window['isNaN'](parseInt(val))) {
      return;
    }
    tmp = parseInt(tmp) - parseInt(val);
    data.setAttribute(key, tmp);
  };
});
