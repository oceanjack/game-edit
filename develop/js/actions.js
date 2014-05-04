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
    switch(dir) {
      case '上':
        break;
      case '下':
        break;
      case '左':
        break;
      case '右':
        break;
      default:
        break;
    }
  };
});
