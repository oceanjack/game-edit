goog.provide('ocean.onlineAI.One');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.style');

goog.require('ocean.onlineAI.Data');
goog.require('ocean.onlineAI.Cell');

goog.scope(function() {
  var exports = ocean.onlineAI;
  var dataModel = exports.Data;


  exports.One = function(data, opt_node) {
    this.data_ = data;
    this.attribute_ = {};
    this.attrLink_ = {};
    opt_node && (this.node_ = opt_node);
    this.initLink();
  };


  exports.One.prototype.data_ = null;
  exports.One.prototype.attribute_ = null;
  exports.One.prototype.attrLink_ = null;
  exports.One.prototype.node_ = null;


  exports.One.prototype.initLink = function() {
    var attr = this.data_.getAllAttribute();
    for(key in attr) {
      this.attrLink_[key] = -1;
      if(key == dataModel.attributeSet.others) {
        this.attrLink_[key] = {};
        for(okey in attr[key]) {
          this.attrLink_[key][okey] = -1;
        }
      }
    }
  };


  exports.One.prototype.getLinks = function() {
    return this.attrLink_;
  };


  exports.One.prototype.getAttr = function() {
    return this.attribute_;
  };


  exports.One.prototype.setAttribute = function(key, val, opt_key) {
    if(key != dataModel.attributeSet.others) {
      this.attribute_[key] = val;
      this.attrLink_[key] = 1;
    } else {
      if(!this.attribute_[key]) {
        this.attribute_[key] = {};
      }
      this.attribute_[key][opt_key] = val;
      this.attribute_[key][opt_key] = 1;
    }
  };


  exports.One.prototype.getAttribute = function(key, opt_key) {
    if(key != dataModel.attributeSet.others) {
      if(this.attrLink_[key] == 1) {
        return this.attribute_[key];
      }
      return this.data_.getAttribute(key);
    } else {
      if(!this.attribute_[key]) {
        this.attribute_[key] = {};
      }
      if(this.attribute_[key][opt_key] == 1) {
        return this.attribute_[key][opt_key];
      }
      return this.data_.getAttribute(key)[opt_key];
    }
  };


  exports.One.prototype.getIndex = function() {
    var data = dataModel.getCharacter(this.data_.getData());
    return data.index;
  };


  exports.One.prototype.getImgData = function() {
    return this.data_.getData();
  };


  exports.One.prototype.getNode = function() {
    return this.node_;
  };
});
