goog.provide('ocean.onlineAI.Cell');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.style');

goog.scope(function() {
  var exports = ocean.onlineAI;


  exports.Cell = function() {
    this.attributes_ = {};
    this.actions_ = {};
    this.events_ = {};
  };


  exports.Cell.prototype.attributes_ = null;
  exports.Cell.prototype.actions_ = null;
  exports.Cell.prototype.events_ = null;


  exports.Cell.prototype.setAttribute = function(key, val) {
    this.attributes_[key] = val;
  };


  exports.Cell.prototype.getAttribute = function(key, val) {
    return this.attributes_[key] ? this.attributes_[key] : null;
  };


  exports.Cell.prototype.setAction = function(key, func) {
    this.actions_[key] = func;
  };


  exports.Cell.prototype.runAction = function(key, opt_var) {
    if(this.actions_[key]) {
      return this.actions_[key](this, opt_var);
    } else {
      return null;
    }
  };


  exports.Cell.prototype.clearAction = function(key) {
    this.actions_[key] && (this.actions_[key] == null);
  };


  exports.Cell.prototype.setEvent = function(key, func) {
    this.events_[key] = func;
  };


  exports.Cell.prototype.checkEvent = function() {
    var this_ = this;
    for(var key in this.events_) {
      this.events_[key](this_);
    }
  };
});