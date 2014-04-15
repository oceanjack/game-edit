goog.provide('ocean.onlineAI.OnlineAI');

goog.require('goog.dom');
goog.require('goog.events');


goog.scope(function() {
  var exports = ocean.onlineAI;


  exports.OnlineAI = function() {
    this.init();
  };


  exports.OnlineAI.prototype.elements_ = null;
  exports.OnlineAI.prototype.size_ = null;


  exports.OnlineAI.prototype.init = function() {
    this.initVar();
    this.getElements();
    this.addEvents();
  };


  exports.OnlineAI.prototype.initVar = function() {
    this.elements_ = {};
    this.size_ = [20, 20];
  };


  exports.OnlineAI.prototype.getElements = function() {
    this.elements_.defsize_ = goog.dom.getElement('defsize');
    this.elements_.defsizeX_ = goog.dom.getElementsByClass('defsize')[0];
    this.elements_.defsizeY_ = goog.dom.getElementsByClass('defsize')[1];
  };


  exports.OnlineAI.prototype.addEvents = function() {
    var el = this.elements_;
    goog.events.listen(el.defsize_, 'click', this.defsize, false, this);
  };


  exports.OnlineAI.prototype.defsize = function() {
    var el = this.elements_;
    this.size_ = [
      el.defsizeX_.value,
      el.defsizeY_.value
    ];
  };


  new exports.OnlineAI();
});