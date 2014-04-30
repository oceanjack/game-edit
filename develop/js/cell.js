goog.provide('ocean.onlineAI.Cell');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.style');

goog.scope(function() {
  var exports = ocean.onlineAI;


  exports.Cell = function(data) {
    this.data_ = data;
  };


  exports.Cell.prototype.data_ = null;
  exports.Cell.prototype.attributes_ = null;
  exports.Cell.prototype.actions_ = null;
  exports.Cell.prototype.events_ = null;

  
  exports.Cell.prototype.setData = function(data) {
    this.data_ = data;
  };


  exports.Cell.prototype.getData = function() {
    return this.data_;
  };


  exports.Cell.prototype.setAttribute = function(key, val) {
    this.attributes_[key] = val;
  };


  exports.Cell.prototype.getAttribute = function(key, val) {
    return this.attributes_[key] ? this.attributes_[key] : null;
  };


  exports.Cell.prototype.getAllAttribute = function() {
    return this.attributes_;
  };


  exports.Cell.prototype.setAllAttribute = function(data) {
    this.attributes_ = data;
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
