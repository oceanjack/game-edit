goog.provide('ocean.onlineAI.OnlineAI');


goog.scope(function() {
  var exports = ocean.onlineAI;


  exports.OnlineAI = function() {
    this.init();
  };


  exports.OnlineAI.prototype.init = function() {
    alert('init success!');
  };


  new exports.OnlineAI();
});