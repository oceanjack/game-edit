goog.provide('ocean.onlineAI.OnlineAI');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.style');


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
    this.settings();
    this.addEvents();
  };


  exports.OnlineAI.prototype.initVar = function() {
    this.elements_ = {};
    this.size_ = [20, 20];
  };


  exports.OnlineAI.prototype.getElements = function() {
    this.elements_.defsize_ = goog.dom.getElement('defsize');
    this.elements_.canvas_ = goog.dom.getElement('canvas');
    this.elements_.defsizeX_ = goog.dom.getElementsByClass('defsize')[0];
    this.elements_.defsizeY_ = goog.dom.getElementsByClass('defsize')[1];
    this.elements_.sizeArea_ = goog.dom.getElementByClass('size');
    this.elements_.mapImgDiv_ = goog.dom.getElementByClass('mapimgdiv');
    this.elements_.mapImg_ = goog.dom.getElementByClass('mapimg');
    this.elements_.menuList_ = goog.dom.getElementsByClass('menulist');
  };


  exports.OnlineAI.prototype.addEvents = function() {
    var el = this.elements_;
    goog.events.listen(el.defsize_, 'click', this.defsize, false, this);
    goog.events.listen(el.mapImgDiv_, 'dragover', this.onDragOver, false ,this);
    goog.events.listen(el.mapImgDiv_, 'drop', this.onFileSelect, false ,this);
  };


  exports.OnlineAI.prototype.settings = function() {
    var el = this.elements_;
  };


  exports.OnlineAI.prototype.defsize = function() {
    var el = this.elements_;
    this.size_ = [
      el.defsizeX_.value,
      el.defsizeY_.value
    ];
    goog.style.setStyle(el.menuList_[0], 'display', 'none');
    goog.style.setStyle(el.sizeArea_, 'display', 'none');
    goog.style.setStyle(el.mapImgDiv_, 'display', 'none');
    goog.style.setStyle(el.canvas_, 'display', 'block');
    goog.style.setStyle(el.menuList_[1], 'display', 'block');
  };


  exports.OnlineAI.prototype.onDragOver = function(e) {
    e = e.event_;
    e.stopPropagation();
    e.preventDefault();
    e['dataTransfer']['dropEffect'] = 'copy';
  };


  exports.OnlineAI.prototype.onFileSelect = function(e) {
    e = e.event_;
    var this_ = this;
    var el = this.elements_;
    var onImageRendered = function(e) {
      var img = e.target || e.srcElement;
      var width = window.getComputedStyle(el.mapImgDiv_)['width'];
      var height = window.getComputedStyle(el.mapImgDiv_)['height'];
      width = width.substr(width, width.length - 2);
      height = height.substr(height, height.length - 2);
      el.mapImg_.width = width;
      el.mapImg_.src = img.src;
      el.canvas_.width = width;
      el.canvas_.height = height;

      var context = el.canvas_.getContext('2d');
      context.clearRect(0, 0, width, height);
      context.drawImage(el.mapImg_, 0, 0, el.mapImg_.width, el.mapImg_.height);
    };
    var onFileReaded = function(e) {
      var img = new Image();
      img.onload = onImageRendered;
      img.src = e.target.result;
    };
    e.stopPropagation();
    e.preventDefault();
    var container = e.dataTransfer || e.target;	//选择文件和拖放的差别
    var file = container.files[0];
    if (!/image/.test(file.type)) {
      alert('That\'s not an image file!');
      return;
    }
    var reader = new FileReader();
    reader.onload = onFileReaded;
    reader.readAsDataURL(file);
  };


  new exports.OnlineAI();
});