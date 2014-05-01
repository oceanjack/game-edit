goog.provide('ocean.onlineAI.MapSetting');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.style');

goog.require('ocean.onlineAI.Data');
goog.require('ocean.onlineAI.Cell');
goog.require('ocean.onlineAI.OnlineAI.templates');

goog.scope(function() {
  var exports = ocean.onlineAI;
  var dataModel = exports.Data;
  var templates = ocean.onlineAI.OnlineAI.templates;


  exports.MapSetting = function(x, y, background) {
    this.init(x, y, background);
    this.getElements();
    this.settings();
    this.addEvents();
  };


  exports.MapSetting.prototype.size_ = null; //网格尺寸
  exports.MapSetting.prototype.elements_ = null; //元素集
  exports.MapSetting.prototype.map_ = null; //网格
  exports.MapSetting.prototype.mode_ = null; //模式
  exports.MapSetting.prototype.cellSet_ = null; //模型集合
  exports.MapSetting.prototype.cellIndex_ = null; //当前模型id
  exports.MapSetting.prototype.totleIndex_ = null; //总模型id
  exports.MapSetting.prototype.tmpData_ = null; //临时数据
  exports.MapSetting.prototype.background_ = null; //背景图片
  exports.MapSetting.prototype.count_ = null; //选中格数量


  exports.MapSetting.prototype.init = function(x, y, background) {
    x = parseInt(x);
    y = parseInt(y);
    x == 'NaN' && (x = 20);
    y == 'NaN' && (y = 15);
    this.count_ = 0;
    this.totleIndex_ = 0;
    this.cellSet_ = [];
    this.cellIndex_ = 0;
    this.size_ = [x, y];
    this.elements_ = {};
    this.tmpData_ = {};
    this.map_ = [];
    this.background_ = background;
    this.mode_ = 1; // 1 人物 2 属性 3 行为 4 事件 5 策略 default 1
  };


  exports.MapSetting.prototype.getElements = function() {
    this.elements_.canvas_ = goog.dom.getElement('canvas');
    this.elements_.map_ = goog.dom.htmlToDocumentFragment(templates.mapArea());
    this.elements_.mapimgdiv_ = goog.dom.getElementByClass('mapimgdiv');
    this.elements_.attribute_ = goog.dom.getElementByClass('attribute');
    this.elements_.makeSure_ = goog.dom.getElementByClass('makeSure');
    this.elements_.cellName_ = goog.dom.getElementByClass('cellName');
    this.elements_.message_ = goog.dom.getElementByClass('message');
    this.elements_.productList_ = goog.dom.getElementByClass('productlist');
    this.elements_.attributeList_ = goog.dom.getElementByClass('attributeList');
    this.elements_.addCharacter_ = goog.dom.getElementByClass('addCharacter');
    this.elements_.addAttribute_ = goog.dom.getElementByClass('addAttribute');
  };


  /*
   * 生成网格
   */
  exports.MapSetting.prototype.settings = function() {
    var el = this.elements_;
    var this_ = this;
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
                if(--this_.count_ <= 0) {
                  this_.elements_.makeSure_.style.display = 'none';
                }
              } else {
                goog.dom.classes.add(node, 'selected');
                ++this_.count_;
                this_.elements_.makeSure_.style.display = 'inline-block';
              }
            });
        })(tmp);
        goog.dom.appendChild(el.map_, tmp);
        this.map_[j].push(tmp);
      }
    }
    goog.dom.appendChild(el.mapimgdiv_, el.map_);
  
    el.message_.style.display = 'block';
  };


  /*
   * 添加元素监听事件
   */
  exports.MapSetting.prototype.addEvents = function() {
    var el = this.elements_;
    goog.events.listen(el.map_, 'dragover', this.onDragOver, false , this);
    goog.events.listen(el.map_, 'drop', this.onFileSelect, false , this);
    goog.events.listen(el.makeSure_, 'click', this.makeSure, false, this);
    goog.events.listen(el.addCharacter_, 'click', this.createCharacter, false, this);
    goog.events.listen(el.addAttribute_, 'click', this.createAttribute, false, this);
  };


  /*
   * 设置图片数据
   */
  exports.MapSetting.prototype.setData = function(img) {
    var blockWidth = window.getComputedStyle(this.map_[0][0])['width'];
    var blockHeight = window.getComputedStyle(this.map_[0][0])['height'];
    blockWidth = parseFloat(blockWidth.substr(blockWidth, blockWidth.length - 2));
    blockHeight = parseFloat(blockHeight.substr(blockHeight, blockHeight.length - 2));
    var size = this.getSize();
    if(size.length > 0) {
      img.posX = size[0];
      img.posY = size[1];
      img.width = size[2];
      img.height = size[3];
    } else {
      img.posX = 0;
      img.posY = 0;
      img.width = 0;
      img.height = 0;
    }
    this.tmpData_.src = img;
    img.posX *= blockWidth;
    img.posY *= blockHeight;
    img.width *= blockWidth;
    img.height *= blockHeight;
    return img;
  };


  /*
   * 确定按钮处理
   */
  exports.MapSetting.prototype.makeSure = function(e) {
    e = e.event_;
    switch(this.mode_) {
      case 1:
        var t = this.tmpData_;
        var size = this.getSize();
        this.tmpData_.posX = size[0];
        this.tmpData_.posY = size[1];
        this.tmpData_.width = size[2];
        this.tmpData_.height = size[3];
        if(this.cellSet_[this.cellIndex_]) {
          this.cellSet_[this.cellIndex_].setData(dataModel.setCharacter(t.width, t.height, t.src, t.posX, t.posY));
          var list = goog.dom.getElementsByClass('ch', this.elements_.productList_);
          var node = list[this.cellIndex_];
          goog.dom.setTextContent(node, (this.elements_.cellName_.value != '' ? this.elements_.cellName_.value : '空'));
        } else {
          this.cellSet_[this.cellIndex_] = new exports.Cell(dataModel.setCharacter(t.width, t.height, t.src, t.posX, t.posY));
          var node = goog.dom.createElement('li');
          goog.dom.setTextContent(node, (this.elements_.cellName_.value != '' ? this.elements_.cellName_.value : '空'));
          goog.dom.classes.add(node, 'ch');
          node.index_ = this.cellIndex_;
          this.elements_.productList_.appendChild(node);
          goog.events.listen(node, 'click', this.reBuild, false, this);
          ++this.totleIndex_;
        }
        break;
      case 2:
        var node = goog.dom.createElement('li');
        goog.dom.classes.add(node, 'at');
        if(this.elements_.cellName_.value != '') {
          goog.dom.setTextContent(node, this.elements_.cellName_.value);
          goog.dom.appendChild(this.elements_.attributeList_, node);
        }
        goog.events.listen(node, 'click', this.changeAttribute, false, this);
        break;
      case 3:
        break;
      case 4:
        break;
      case 5:
        break;
      default:
        break;
    };
  };


  /*
   * 改变属性
   */
  exports.MapSetting.prototype.changeAttribute = function(e) {
    e = e.event_;
    e = e.target || e.srcElement;
    var data = this.cellSet_[this.cellIndex_];
    if(goog.dom.classes.has(e, 'selected')) {
      goog.dom.classes.remove(e, 'selected');
      if(data.getAllAttribute()) {
        var tmp = data.getAttribute(dataModel.attributeSet.others);
        tmp[goog.dom.getTextContent(e)] = null;
        data.setAttribute(dataModel.attributeSet.others, tmp);
      }
    } else {
      goog.dom.classes.add(e, 'selected');
      if(data.getAllAttribute()) {
        var tmp = data.getAttribute(dataModel.attributeSet.others);
        tmp[goog.dom.getTextContent(e)] = 0;
        data.setAttribute(dataModel.attributeSet.others, tmp);
      }
    }
  };


  /*
   * 获取网格内所选格子尺寸（左上和右下来确定尺寸）
   */
  exports.MapSetting.prototype.getSize = function() {
    var tmpMap = [];
    for(var j = 0, l = this.map_.length; j < l; ++j) {
      for(var i = 0, ll = this.map_[j].length; i < ll; ++i) {
        if(goog.dom.classes.has(this.map_[j][i], 'selected'))
          tmpMap.push([j, i]);
      }
    }
    if(tmpMap.length > 0) {
      return [tmpMap[0][1], tmpMap[0][0], (tmpMap[tmpMap.length - 1][1] - tmpMap[0][1] + 1), (tmpMap[tmpMap.length - 1][0] - tmpMap[0][0] + 1)];
    } else {
      return [];
    }
  };


  /*
   * 清除
   */
  exports.MapSetting.prototype.clear = function() {
    for(var j = 0, l = this.map_.length; j < l; ++j) {
      for(var i = 0, ll = this.map_[j].length; i < ll; ++i) {
        if(goog.dom.classes.has(this.map_[j][i], 'selected')) {
          goog.dom.classes.remove(this.map_[j][i], 'selected');
        }
      }
    }
    var context = this.elements_.canvas_.getContext('2d');
    context.clearRect(0, 0, 800, 600);
    this.background_ && context.drawImage(this.background_, 0, 0, this.background_.width, this.background_.height);
    this.elements_.cellName_.value = '';
    this.tmpData_ = null;
    this.tmpData_ = {};
  };


  /*
   * 元素显示控制
   */
  exports.MapSetting.prototype.display_ = function() {
    this.elements_.mapimgdiv_.style.display = 'none';
    this.elements_.attribute_.style.display = 'none';
    this.elements_.makeSure_.style.display = 'none';
    switch(this.mode_) {
      case 1:
        this.elements_.mapimgdiv_.style.display = 'block';
        break;
      case 2:
        this.elements_.attribute_.style.display = 'block';
        this.elements_.makeSure_.style.display = 'inline-block';
        break;
    };
  };


  /*
   * 添加人物
   */
  exports.MapSetting.prototype.createCharacter = function() {
    this.mode_ = 1;
    this.display_();
    this.clear();
    this.cellIndex_ = this.totleIndex_;
  };


  /*
   * 添加属性
   */
  exports.MapSetting.prototype.createAttribute = function() {
    this.mode_ = 2;
    this.display_();
    this.clear();
  };


  /*
   * 重建相关属性
   */
  exports.MapSetting.prototype.reBuild = function(e) {
    e = e.event_;
    e = e.target || e.srcElement;
    this.clear();
    switch(this.mode_) {
      case 1:
        this.cellIndex_ = e.index_;
        var data = dataModel.getCharacter(this.cellSet_[this.cellIndex_].getData());
        var nodeOne = this.map_[data.opt_posY][data.opt_posX];
        var nodeTwo = this.map_[data.opt_posY + data.height - 1][data.opt_posX + data.width - 1];
        goog.dom.classes.add(nodeOne, 'selected');
        goog.dom.classes.add(nodeTwo, 'selected');
        var context = this.elements_.canvas_.getContext('2d');
        var blockWidth = window.getComputedStyle(this.map_[0][0])['width'];
        var blockHeight = window.getComputedStyle(this.map_[0][0])['height'];
        blockWidth = parseFloat(blockWidth.substr(blockWidth, blockWidth.length - 2));
        blockHeight = parseFloat(blockHeight.substr(blockHeight, blockHeight.length - 2));
        data.src && context.drawImage(data.src, data.opt_posX * blockWidth, data.opt_posY * blockHeight, data.width * blockWidth, data.height * blockHeight);
        this.elements_.cellName_.value = goog.dom.getTextContent(e);
        break;
      case 2:
        this.cellIndex_ = e.index_;
        var data = this.cellSet_[this.cellIndex_].getAllAttribute();
        if(data == null) {
          this.cellSet_[this.cellIndex_].setAllAttribute(dataModel.setAttribute(
            -1, -1, -1, 0, true, -1, -1, {}
          ));
        }
        var tmp = this.cellSet_[this.cellIndex_].getAttribute(dataModel.attributeSet.others);
        var node = goog.dom.getElementsByClass('at', this.elements_.attributeList_);
        for(var i = 0, l = node.length; i < l; ++i) {
          goog.dom.classes.remove(node[i], 'selected'); 
          if(tmp[goog.dom.getTextContent(node[i])] != undefined && tmp[goog.dom.getTextContent(node[i])] != null) {
            goog.dom.classes.add(node[i], 'selected'); 
          }
        }
        break;
    }
  };


  /*
   * 处理拖动
   */
  exports.MapSetting.prototype.onDragOver = function(e) {
    e = e.event_;
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };


  /*
   * 处理图片文件加载
   */
  exports.MapSetting.prototype.onFileSelect = function(e) {
    e = e.event_;
    var this_ = this;
    var el = this.elements_;
    var onImageRendered = function(e) {
      var img = e.target || e.srcElement;
      img = this_.setData(img);
      if(el.canvas_.width != 800) {
        el.canvas_.width = 800;
        el.canvas_.height = 600;
      }
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
