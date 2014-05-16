goog.provide('ocean.onlineAI.Matrix');

goog.require('goog.dom');

goog.require('ocean.onlineAI.Cell');
goog.require('ocean.onlineAI.Actions');
goog.require('ocean.onlineAI.One');
goog.require('ocean.onlineAI.Data');

goog.scope(function() {
  var exports = ocean.onlineAI;
  var dataModel = exports.Data;
  var actionModel = exports.Actions;


  exports.Matrix = function(cellSet, background, realWorld, eventSet, workflow, context) {
    this.cellSet_ = cellSet;
    this.background_ = background;
    this.realWorld_ = realWorld;
    this.eventSet_ = eventSet;
    this.workflow_ = workflow;
    this.canvas_ = context;
    this.initData();
  };


  exports.Matrix.prototype.cellSet_ = null;
  exports.Matrix.prototype.background_ = null;
  exports.Matrix.prototype.realWorld_ = null;
  exports.Matrix.prototype.eventSet_ = null;
  exports.Matrix.prototype.workflow_ = null;
  exports.Matrix.prototype.canvas_ = null;


  exports.Matrix.prototype.initData = function() {
  };


  exports.Matrix.prototype.run = function() {
    alert('You have the final fight!')
  };
});
