goog.provide('ocean.onlineAI.Cell');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.style');

goog.require('ocean.onlineAI.Data');

goog.scope(function() {
  var exports = ocean.onlineAI;
  var dataModel = exports.Data;


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
    (dataModel.attributeSet[key]) && (key = dataModel.attributeSet[key]);
    var s = false;
    for(var v in dataModel.attributeSet) {
      if(dataModel.attributeSet[v] == key) {
        this.attributes_[key] = val;
        s = true;
        break;
      }
    }
    if(!s) {
      this.attributes_[dataModel.attributeSet.others][key] = val;
    }
  };


  exports.Cell.prototype.getAttribute = function(key) {
    (dataModel.attributeSet[key]) && (key = dataModel.attributeSet[key]);
    if(this.attributes_[key] != null && this.attributes_[key] != undefined) {
      return this.attributes_[key];
    } else if(this.attributes_[dataModel.attributeSet.others][key] != null && this.attributes_[dataModel.attributeSet.others][key] != undefined) {
      return this.attributes_[dataModel.attributeSet.others][key];
    }
    return null;
  };


  exports.Cell.prototype.getAllAttribute = function() {
    return this.attributes_;
  };


  exports.Cell.prototype.setAllAttribute = function(data) {
    this.attributes_ = data;
  };
});
