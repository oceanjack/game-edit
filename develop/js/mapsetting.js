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
  exports.MapSetting.prototype.map_ = null;


  exports.MapSetting.prototype.init = function(x, y) {
    x = parseInt(x);
    y = parseInt(y);
    x == 'NaN' && (x = 20);
    y == 'NaN' && (y = 15);
    this.size_ = [x, y];
    this.elements_ = {};
    this.map_ = [];
  };


  exports.MapSetting.prototype.getElements = function() {
    this.elements_.canvas_ = goog.dom.getElement('canvas');
    this.elements_.map_ = goog.dom.htmlToDocumentFragment(templates.mapArea());
    this.elements_.mapimgdiv_ = goog.dom.getElementByClass('mapimgdiv');
  };


  exports.MapSetting.prototype.settings = function() {
    var el = this.elements_;
    var widthPercent = 100 / this.size_[0] + '%';
    var heightPercent = 100 / this.size_[1] + '%';
    for(var j = 0; j < this.size_[1]; ++j) {
      this.map_[j] = [];
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
        this.map_[j].push(tmp);
      }
    }
    goog.dom.appendChild(el.mapimgdiv_, el.map_);
  };


  exports.MapSetting.prototype.addEvents = function() {
    var el = this.elements_;
    goog.events.listen(el.map_, 'dragover', this.onDragOver, false ,this);
    goog.events.listen(el.map_, 'drop', this.onFileSelect, false ,this);
  };


  exports.MapSetting.prototype.setData = function(img) {
    var tmpMap = [];
    for(var j = 0, l = this.map_.length; j < l; ++j) {
      for(var i = 0, ll = this.map_[j].length; i < ll; ++i) {
        if(goog.dom.classes.has(this.map_[j][i], 'selected'))
          tmpMap.push([j, i]);
      }
    }
    var blockWidth = window.getComputedStyle(this.map_[0][0])['width'];
    var blockHeight = window.getComputedStyle(this.map_[0][0])['height'];
    blockWidth = parseFloat(blockWidth.substr(blockWidth, blockWidth.length - 2));
    blockHeight = parseFloat(blockHeight.substr(blockHeight, blockHeight.length - 2));
    if(tmpMap.length > 0) {
      img.posX = blockWidth * tmpMap[0][1];
      img.posY = blockHeight * tmpMap[0][0];
      img.width = blockWidth * (tmpMap[tmpMap.length - 1][1] - tmpMap[0][1] + 1);
      img.height = blockHeight * (tmpMap[tmpMap.length - 1][0] - tmpMap[0][0] + 1);
    } else {
      img.posX = 0;
      img.posY = 0;
      img.width = 0;
      img.height = 0;
    }
    return img;
  };


  exports.MapSetting.prototype.onDragOver = function(e) {
    e = e.event_;
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };


  exports.MapSetting.prototype.onFileSelect = function(e) {
    e = e.event_;
    var this_ = this;
    var el = this.elements_;
    var onImageRendered = function(e) {
      var img = e.target || e.srcElement;
      img = this_.setData(img);
      var context = el.canvas_.getContext('2d');
      context.drawImage(img, img.posX, img.posY, img.width, img.height);
    };
    var onFileReaded = function(e) {
      var img = new Image();
      img.onload = onImageRendered;
      img.src = e.target.result;
    };
    e.stopPropagation();
    e.preventDefault();
    var container = e.dataTransfer || e.target;
    var file = container.files[0];
    if (!/image/.test(file.type)) {
      alert('That\'s not an image file!');
      return;
    }
    var reader = new FileReader();
    reader.onload = onFileReaded;
    reader.readAsDataURL(file);
  };
});