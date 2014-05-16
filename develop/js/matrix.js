goog.provide('ocean.onlineAI.Matrix');

goog.require('goog.dom');

goog.require('ocean.onlineAI.Data');

goog.scope(function() {
  var exports = ocean.onlineAI;
  var dataModel = exports.Data;


  exports.Matrix = function(data, context) {
    this.data_ = data;
    this.canvas_ = context;
    this.initData();
    this.run();
  };

  exports.Matrix.prototype.data_ = null;
  exports.Matrix.prototype.canvas_ = null;


  exports.Matrix.prototype.initData = function() {
  };


  exports.Matrix.prototype.run = function() {
  };
});
