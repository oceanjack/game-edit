goog.provide('ocean.onlineAI.MapSetting');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.style');

goog.require('ocean.onlineAI.OnlineAI.templates');

goog.scope(function() {
  var exports = ocean.onlineAI;
  var templates = ocean.onlineAI.OnlineAI.templates;


  exports.MapSetting = function(x, y) {
    this.init(x, y);
    this.getElements();
    this.settings();
    this.addEvents();
  };


  exports.MapSetting.prototype.size_ = null;
  exports.MapSetting.prototype.elements_ = null;


  exports.MapSetting.prototype.init = function(x, y) {
    x = parseInt(x);
    y = parseInt(y);
    x == 'NaN' && (x = 20);
    y == 'NaN' && (y = 15);
    this.size_ = [x, y];
    this.elements_ = {};
  };


  exports.MapSetting.prototype.getElements = function() {
    this.elements_.canvas_ = goog.dom.getElement('canvas');
    this.elements_.map_ = goog.dom.htmlToDocumentFragment(templates.mapArea());
    this.elements_.editarea_ = goog.dom.getElementByClass('map');
  };


  exports.MapSetting.prototype.settings = function() {
    var el = this.elements_;
    var widthPercent = 100 / this.size_[0] + '%';
    var heightPercent = 100 / this.size_[1] + '%';
    for(var j = 0; j < this.size_[1]; ++j) {
      for(var i = 0; i < this.size_[0]; ++i) {
        var tmp = goog.dom.htmlToDocumentFragment(templates.mapBlock());
        goog.style.setStyle(tmp, 'width', widthPercent);
        goog.style.setStyle(tmp, 'height', heightPercent);
        (function(node) {
            goog.events.listen(node, 'click', function() {
              if(goog.dom.classes.has(node, 'selected')) {
                goog.dom.classes.remove(node, 'selected');
              } else {
                goog.dom.classes.add(node, 'selected');
              }
            });
        })(tmp);
        goog.dom.appendChild(el.map_, tmp);
      }
    }
    goog.dom.appendChild(el.editarea_, el.map_);
  };


  exports.MapSetting.prototype.addEvents = function() {
  };
});