goog.provide('ocean.onlineAI.Actions');

goog.require('goog.events');

goog.require('ocean.onlineAI.Data');
goog.require('ocean.onlineAI.One');

goog.scope(function() {
  var exports = ocean.onlineAI;
  var dataModel = exports.Data;
  
  exports.Actions = function() {
  };


  exports.Actions.Move = function(data) {
    var posX = data.getAttribute(dataModel.attributeSet.posX);
    var posY = data.getAttribute(dataModel.attributeSet.posY);
    var speed = data.getAttribute(dataModel.attributeSet.speed);
    var dir = data.getAttribute(dataModel.attributeSet.dir);
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
    }
    data.setAttribute(dataModel.attributeSet.posX, posX);
    data.setAttribute(dataModel.attributeSet.posY, posY);
  };


  exports.Actions.SwapPos = function(data, data2) {
    var posX = data.getAttribute(dataModel.attributeSet.posX);
    var posY = data.getAttribute(dataModel.attributeSet.posY);
    var posX2 = data2.getAttribute(dataModel.attributeSet.posX);
    var posY2 = data2.getAttribute(dataModel.attributeSet.posY);
    posX = parseInt(posX);
    posY = parseInt(posY);
    posX2 = parseInt(posX2);
    posY2 = parseInt(posY2);
    data.setAttribute(dataModel.attributeSet.posX, posX2);
    data.setAttribute(dataModel.attributeSet.posY, posY2);
    data2.setAttribute(dataModel.attributeSet.posX, posX);
    data2.setAttribute(dataModel.attributeSet.posY, posY);
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


  exports.Actions.AddNum = function(data, key, val, opt_key) {
    var tmp = data.getAttribute(key, opt_key);
    tmp = parseInt(tmp) + parseInt(val);
    data.setAttribute(key, tmp, opt_key);
  };


  exports.Actions.ReduceNum = function(data, key, val, opt_key) {
    var tmp = data.getAttribute(key, opt_key);
    tmp = parseInt(tmp) - parseInt(val);
    data.setAttribute(key, tmp, opt_key);
  };
});
