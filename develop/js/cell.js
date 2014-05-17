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

  
  exports.Cell.prototype.setData = function(data) {
    this.data_ = data;
  };


  exports.Cell.prototype.getData = function() {
    return this.data_;
  };


  exports.Cell.prototype.setAttribute = function(key, val) {
    this.attributes_[key] = val;
  };


  exports.Cell.prototype.getAttribute = function(key) {
    return this.attributes_[key] ? this.attributes_[key] : null;
  };


  exports.Cell.prototype.getAllAttribute = function() {
    return this.attributes_;
  };


  exports.Cell.prototype.setAllAttribute = function(data) {
    this.attributes_ = data;
  };
});
