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
