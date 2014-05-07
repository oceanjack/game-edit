goog.provide('ocean.onlineAI.MapSetting');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.style');

goog.require('ocean.onlineAI.Data');
goog.require('ocean.onlineAI.Cell');
goog.require('ocean.onlineAI.One');
goog.require('ocean.onlineAI.Actions');
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
  exports.MapSetting.prototype.realWorld_ = null; //编辑的地图
  exports.MapSetting.prototype.eventSet_ = null; //事件集合
  exports.MapSetting.prototype.eventIndex_ = null; //当前事件id
  exports.MapSetting.prototype.eTotleIndex_ = null; //总事件
  exports.MapSetting.prototype.modefive_ = null;


  exports.MapSetting.prototype.init = function(x, y, background) {
    x = parseInt(x);
    y = parseInt(y);
    x == 'NaN' && (x = 20);
    y == 'NaN' && (y = 15);
    this.count_ = 0;
    this.totleIndex_ = 0;
    this.cellSet_ = [];
    this.cellIndex_ = 0;
    this.eTotleIndex_ = 0;
    this.eventSet_ = [];
    this.eventIndex_ = 0;
    this.size_ = [x, y];
    this.elements_ = {};
    this.tmpData_ = {};
    this.map_ = [];
    this.realWorld_ = [];
    this.background_ = background;
    this.modefive_ = true;
    this.mode_ = 1; // 1 人物 2 属性 3 地图 4 行为 5 事件 6 策略 default 1
  };


  exports.MapSetting.prototype.getElements = function() {
    this.elements_.canvas_ = goog.dom.getElement('canvas');
    this.elements_.map_ = goog.dom.htmlToDocumentFragment(templates.mapArea());
    this.elements_.mapimgdiv_ = goog.dom.getElementByClass('mapimgdiv');
    this.elements_.attribute_ = goog.dom.getElementByClass('attribute');
    this.elements_.chooseAction_ = goog.dom.getElementByClass('chooseAction');
    this.elements_.makeSure_ = goog.dom.getElementByClass('makeSure');
    this.elements_.cellName_ = goog.dom.getElementByClass('cellName');
    this.elements_.checkOption_ = goog.dom.getElementByClass('checkOption');
    this.elements_.checkOptions_ = goog.dom.getElementsByClass('cpt', this.elements_.checkOption_);
    this.elements_.message_ = goog.dom.getElementByClass('message');
    this.elements_.selectAttr_ = goog.dom.getElementByClass('selectAttr');
    this.elements_.productList_ = goog.dom.getElementByClass('productlist');
    this.elements_.eventList_ = goog.dom.getElementByClass('eventList');
    this.elements_.attributeList_ = goog.dom.getElementByClass('attributeList');
    this.elements_.addCharacter_ = goog.dom.getElementByClass('addCharacter');
    this.elements_.addAttribute_ = goog.dom.getElementByClass('addAttribute');
    this.elements_.addWorld_ = goog.dom.getElementByClass('addWorld');
    this.elements_.addEvent_ = goog.dom.getElementByClass('addEvent');
    this.elements_.addActionBtn_ = goog.dom.getElementByClass('addActionBtn');
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
      this.realWorld_[j] = [];
      for(var i = 0; i < this.size_[0]; ++i) {
        var tmp = goog.dom.htmlToDocumentFragment(templates.mapBlock());
        goog.style.setStyle(tmp, 'width', widthPercent);
        goog.style.setStyle(tmp, 'height', heightPercent);
        tmp.posX_ = i;
        tmp.posY_ = j;
        (function(node) {
            goog.events.listen(node, 'click', function() {
              if(this_.mode_ == 5 && this_.elements_.checkOptions_[2].checked) {
                if(goog.dom.classes.has(node, 'selectedEffect')) {
                  goog.dom.classes.remove(node, 'selectedEffect');
                } else {
                  goog.dom.classes.add(node, 'selectedEffect');
                }
                return;
              }
              if(goog.dom.classes.has(node, 'selected')) {
                goog.dom.classes.remove(node, 'selected');
                switch(this_.mode_) {
                  case 1:
                    if(--this_.count_ <= 0) {
                      this_.elements_.makeSure_.style.display = 'none';
                    }
                    break;
                  case 3:
                    this_.realWorld_[node.posY_][node.posX_] = null;
                    this_.drawWorld();
                    break;
                  case 5:
                    if(goog.dom.classes.has(node, 'selectedNo')) {
                      goog.dom.classes.remove(node, 'selectedNo');
                      goog.dom.classes.add(node, 'selected');
                      goog.dom.classes.add(node, 'selectedHave');
                    } else if(goog.dom.classes.has(node, 'selectedHave')) {
                      goog.dom.classes.remove(node, 'selectedHave');
                      goog.dom.classes.add(node, 'selected');
                      goog.dom.classes.add(node, 'selectedNone');
                    } else if(goog.dom.classes.has(node, 'selectedNone')) {
                      goog.dom.classes.remove(node, 'selectedNone');
                    }
                    break;
                };
              } else {
                goog.dom.classes.add(node, 'selected');
                switch(this_.mode_) {
                  case 1:
                    ++this_.count_;
                    this_.elements_.makeSure_.style.display = 'inline-block';
                    break;
                  case 3:
                    this_.realWorld_[node.posY_][node.posX_] = new exports.One(this_.cellSet_[this_.cellIndex_], node);
                    this_.realWorld_[node.posY_][node.posX_].setAttribute(dataModel.attributeSet.posX, node.posX_);
                    this_.realWorld_[node.posY_][node.posX_].setAttribute(dataModel.attributeSet.posY, node.posY_);
                    this_.drawWorld();
                    break;
                  case 5:
                    goog.dom.classes.add(node, 'selectedNo');
                    break;
                };
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
    goog.events.listen(el.addWorld_, 'click', this.editWorld, false, this);
    goog.events.listen(el.addEvent_, 'click', this.editEvent, false, this);
    goog.events.listen(el.addActionBtn_, 'click', this.addActionBtn, false, this);
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
        var p = goog.dom.createElement('p');
        goog.dom.classes.add(node, 'at');
        if(this.elements_.cellName_.value != '') {
          goog.dom.setTextContent(p, this.elements_.cellName_.value);
          var editbox = goog.dom.htmlToDocumentFragment(templates.selectInput());
          goog.dom.classes.add(p, 'val');
          goog.dom.appendChild(node, p);
          goog.dom.appendChild(node, editbox);
          goog.dom.appendChild(this.elements_.attributeList_, node);
          var input = goog.dom.getElementByClass('editboxinput', editbox);
          var select = goog.dom.getElementByClass('editboxselect', editbox);
          this.valChange(select, input);
        }
        goog.events.listen(node, 'click', this.changeAttribute, false, this);
        break;
      case 3:
        break;
      case 4:
        break;
      case 5:
        var node = goog.dom.createElement('li');
        goog.dom.setTextContent(node, (this.elements_.cellName_.value != '' ? this.elements_.cellName_.value : '空'));
        goog.dom.classes.add(node, 'me');
        node.index_ = this.eventIndex_;
        this.elements_.eventList_.appendChild(node);
        goog.events.listen(node, 'click', this.reBuild, false, this);
        ++this.eTotleIndex_;
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
    while(!goog.dom.classes.has(e, 'at')) {
      e = e.parentNode;
    }
    var data = this.cellSet_[this.cellIndex_];
    if(goog.dom.classes.has(e, 'selected')) {
      goog.dom.classes.remove(e, 'selected');
      if(data.getAllAttribute()) {
        var tmp = data.getAttribute(dataModel.attributeSet.others);
        tmp[goog.dom.getTextContent(goog.dom.getElementByClass('val', e))] = null;
        data.setAttribute(dataModel.attributeSet.others, tmp);
      }
    } else {
      goog.dom.classes.add(e, 'selected');
      if(data.getAllAttribute()) {
        var tmp = data.getAttribute(dataModel.attributeSet.others);
        tmp[goog.dom.getTextContent(goog.dom.getElementByClass('val', e))] = 0;
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
        if(goog.dom.classes.has(this.map_[j][i], 'selectedNo')) {
          goog.dom.classes.remove(this.map_[j][i], 'selectedNo');
        }
        if(goog.dom.classes.has(this.map_[j][i], 'selectedNone')) {
          goog.dom.classes.remove(this.map_[j][i], 'selectedNone');
        }
        if(goog.dom.classes.has(this.map_[j][i], 'selectedHave')) {
          goog.dom.classes.remove(this.map_[j][i], 'selectedHave');
        }
        if(goog.dom.classes.has(this.map_[j][i], 'selectedEffect')) {
          goog.dom.classes.remove(this.map_[j][i], 'selectedEffect');
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
    this.elements_.chooseAction_.style.display = 'none';
    this.elements_.message_.style.display = 'none';
    this.elements_.checkOption_.style.display = 'none';
    this.elements_.productList_.style.display = 'none';
    this.elements_.eventList_.style.display = 'none';
    this.elements_.selectAttr_.style.display = 'none';
    switch(this.mode_) {
      case 1:
        this.elements_.mapimgdiv_.style.display = 'block';
        this.elements_.message_.style.display = 'block';
        this.elements_.productList_.style.display = 'block';
        break;
      case 2:
        this.elements_.attribute_.style.display = 'block';
        this.elements_.makeSure_.style.display = 'inline-block';
        this.elements_.message_.style.display = 'block';
        this.elements_.productList_.style.display = 'block';
        break;
      case 3:
        this.elements_.mapimgdiv_.style.display = 'block';
        this.elements_.productList_.style.display = 'block';
        break;
      case 5:
        this.elements_.chooseAction_.style.display = 'block';
        this.elements_.makeSure_.style.display = 'inline-block';
        this.elements_.message_.style.display = 'block';
        this.elements_.eventList_.style.display = 'block';
        this.elements_.selectAttr_.style.display = 'block';
        this.elements_.mapimgdiv_.style.display = 'block';
        this.elements_.checkOption_.style.display = 'block';
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
    var tmp = goog.dom.getElementsByClass('atd', this.elements_.attributeList_);
    for(var i = 0, l = tmp.length; i < l; ++i) {
      tmp[i].attrIndex_ = i;
      if(goog.dom.getElementsByClass('editbox', tmp[i]).length) {
        continue;
      }
      var editbox = goog.dom.htmlToDocumentFragment(templates.selectInput());
      var input = goog.dom.getElementByClass('editboxinput', editbox);
      var select = goog.dom.getElementByClass('editboxselect', editbox)
      switch(i) {
        case 0:
          input.value = '无';
          var op = goog.dom.createElement('option');
          goog.dom.setTextContent(op, '无');
          goog.dom.appendChild(select, op);
          break;
        case 1:
          input.value = '无';
          var op = goog.dom.createElement('option');
          goog.dom.setTextContent(op, '无');
          goog.dom.appendChild(select, op);
          break;
        case 2:
          input.value = '上';
          var op = goog.dom.createElement('option');
          var op2 = goog.dom.createElement('option');
          var op3 = goog.dom.createElement('option');
          var op4 = goog.dom.createElement('option');
          goog.dom.setTextContent(op, '上');
          goog.dom.setTextContent(op2, '下');
          goog.dom.setTextContent(op3, '左');
          goog.dom.setTextContent(op4, '右');
          goog.dom.appendChild(select, op);
          goog.dom.appendChild(select, op2);
          goog.dom.appendChild(select, op3);
          goog.dom.appendChild(select, op4);
          break;
        case 3:
          input.value = '1';
          var op = goog.dom.createElement('option');
          goog.dom.setTextContent(op, '1');
          goog.dom.appendChild(select, op);
          break;
        case 4:
          input.value = '否';
          var op = goog.dom.createElement('option');
          var op2 = goog.dom.createElement('option');
          goog.dom.setTextContent(op, '否');
          goog.dom.setTextContent(op2, '是');
          goog.dom.appendChild(select, op);
          goog.dom.appendChild(select, op2);
          break;
        case 5:
          input.value = '无';
          var op = goog.dom.createElement('option');
          goog.dom.setTextContent(op, '无');
          goog.dom.appendChild(select, op);
          break;
        case 6:
          input.value = '无';
          var op = goog.dom.createElement('option');
          goog.dom.setTextContent(op, '无');
          goog.dom.appendChild(select, op);
          break;
      };
      goog.dom.appendChild(tmp[i], editbox);
      this.valChange(select, input);
    }
  };


  /*
   * 编辑世界
   */
  exports.MapSetting.prototype.editWorld = function() {
    this.mode_ = 3;
    this.display_();
    this.clear();
    for(var j = 0; j < this.realWorld_.length; ++j) {
      for(var i = 0; i < this.realWorld_[j].length; ++i) {
        if(this.realWorld_[j][i]) {
          goog.dom.classes.add(this.realWorld_[j][i].getNode(), 'selected');
        }
      }
    }
    this.drawWorld();
  };
  
  
  /*
   * 编辑事件
   */
  exports.MapSetting.prototype.editEvent = function() {
    this.mode_ = 5;
    if(this.modefive_) {
      this.editJudge();
      this.modefive_ = false;
    }
    this.display_();
    this.clear();
  };


  /*
   * 属性单元
   */
  exports.MapSetting.prototype.editAttr = function() {
    var this_ = this;
    var node =  goog.dom.htmlToDocumentFragment(templates.cellAttr());
    var selectInput = goog.dom.htmlToDocumentFragment(templates.selectInputV());
    var select = goog.dom.getElementByClass('editboxselect', selectInput);
    var input = goog.dom.getElementByClass('editboxinput', selectInput);
    goog.dom.appendChild(node, selectInput);
    input.value = '横坐标';
    goog.events.listen(select, 'change', function() {
      var index = select.options.selectedIndex;
      (index >= 0) && (input.value = select.options[index].value);
    }, false, this);
    var one = goog.dom.getElementByClass('cellAttro', node);
    var attr = goog.dom.getElementByClass('cellAttrv', node); 
    goog.events.listen(one, 'mousedown', function() {
      var clearList = goog.dom.getElementsByClass('new', one);
      for(var i = clearList.length - 1; i >= 0; --i) {
        if(goog.dom.classes.has(clearList[i], 'new')) {
          goog.dom.removeNode(clearList[i]);
        }
      }
      var oneList = goog.dom.getElementsByClass('ch', this_.elements_.productList_);
      for(var i = 0, l = oneList.length; i < l; ++i) {
        var option = goog.dom.createElement('option');
        goog.dom.classes.add(option, 'new');
        goog.dom.setTextContent(option, goog.dom.getTextContent(oneList[i]));
        goog.dom.appendChild(one, option);
      }
    }, false, this);
    goog.events.listen(attr, 'mousedown', function() {
      var clearList = goog.dom.getElementsByClass('new', attr);
      for(var i = clearList.length - 1; i >= 0; --i) {
        if(goog.dom.classes.has(clearList[i], 'new')) {
          goog.dom.removeNode(clearList[i]);
        }
      }
      var attrList = goog.dom.getElementsByClass('at', this_.elements_.attributeList_);
      for(var i = 0, l = attrList.length; i < l; ++i) {  
        var option = goog.dom.createElement('option');
        goog.dom.classes.add(option, 'new');
        goog.dom.setTextContent(option, goog.dom.getTextContent(goog.dom.getElementByClass('val', attrList[i])));
        goog.dom.appendChild(attr, option);
      }
    }, false. this);
    return node;
  };


  /*
   * 执行单元
   */
  exports.MapSetting.prototype.editAction = function() {
    var this_ = this;
    var div = goog.dom.createElement('div');
    var p1 = goog.dom.createElement('p');
    goog.dom.setTextContent(p1, '执行');
    var p2 = goog.dom.createElement('p');
    goog.dom.setTextContent(p2, '作用于');
    var actionList = goog.dom.htmlToDocumentFragment(templates.actionList());
    var btn = goog.dom.createElement('button');
    goog.dom.setTextContent(btn, '删除');
    goog.dom.appendChild(div, p1);
    goog.dom.appendChild(div, actionList);
    goog.dom.appendChild(div, p2);
    goog.dom.appendChild(div, this.editAttr());
    goog.dom.appendChild(div, this.editAttr());
    goog.dom.appendChild(div, btn);
    goog.dom.appendChild(this.elements_.chooseAction_, div);
    goog.events.listen(btn, 'click', function() {
      goog.dom.removeNode(div);
    }, false, this);
  };


  /*
   * 逻辑单元
   */
  exports.MapSetting.prototype.editJudge = function() {
    var this_ = this;
    var father = goog.dom.createElement('div');
    goog.dom.classes.add(father, 'attr');
    var operation =  goog.dom.htmlToDocumentFragment(templates.operation());
    var inputSelect =  goog.dom.htmlToDocumentFragment(templates.selectInput());
    var logic =  goog.dom.htmlToDocumentFragment(templates.logic());
    goog.dom.appendChild(father, this_.editAttr());
    goog.dom.appendChild(father, operation);
    goog.dom.appendChild(father, this_.editAttr());
    goog.dom.appendChild(father, logic);
    goog.dom.appendChild(this.elements_.selectAttr_, father);
    var newJudge = null;
    goog.events.listen(logic, 'change', function() {
      if(logic.childNodes[0].options.selectedIndex == 0) {
        newJudge && goog.dom.removeNode(newJudge);
      } else {
        newJudge = this_.editJudge();
      }
    }, false, this);
    return father;
  };


  /*
   * 绘图
   */
  exports.MapSetting.prototype.drawWorld = function() {
    var c = this.elements_.canvas_.getContext('2d');
    var blockWidth = window.getComputedStyle(this.map_[0][0])['width'];
    var blockHeight = window.getComputedStyle(this.map_[0][0])['height'];
    blockWidth = parseFloat(blockWidth.substr(blockWidth, blockWidth.length - 2));
    blockHeight = parseFloat(blockHeight.substr(blockHeight, blockHeight.length - 2));
    c.clearRect(0, 0, 800, 600);
    this.background_ && c.drawImage(this.background_, 0, 0, this.background_.width, this.background_.height);
    for(var j = 0; j < this.realWorld_.length; ++j) {
      for(var i = 0; i < this.realWorld_[j].length; ++i) {
        if(this.realWorld_[j][i]) {
          var posX = this.realWorld_[j][i].getAttribute(dataModel.attributeSet.posX);
          var posY = this.realWorld_[j][i].getAttribute(dataModel.attributeSet.posY);
          var img = dataModel.getCharacter(this.realWorld_[j][i].getImgData());
          img.src && c.drawImage(img.src, posX * blockWidth, posY * blockHeight, img.width * blockWidth, img.height * blockHeight);
        }
      }
    }
  };


  /*
   * 添加动作
   */
  exports.MapSetting.prototype.addActionBtn = function() {
    this.editAction();
  };


  /*
   * 检测属性值变化
   */
  exports.MapSetting.prototype.valChange = function(select, input) {
    var this_ = this;
    goog.events.listen(select, 'change', function() {
      var index = select.options.selectedIndex;
      (index >= 0) && (input.value = select.options[index].value);
      this_.inputChange(input, select);
    }, false, this);
    goog.events.listen(select, 'mousedown', function() {
      var tag = 1;
      for(var i = 0, l = select.options.length; i < l; ++i) {
        if(input.value == select.options[i].value) {
          tag = 0;
          break;
        }
      }
      if(tag) {
        var node = goog.dom.createElement('option');
        goog.dom.setTextContent(node, input.value);
        goog.dom.appendChild(select, node);
      }
    }, false, this);
    goog.events.listen(input, 'change', function() {
      this_.inputChange(input, select);
    }, false, this);
  };


  /*
   * 属性输入框发生变化
   */
  exports.MapSetting.prototype.inputChange = function(input, select) {
    var this_ = this;
    var e = input;
    while(!goog.dom.classes.has(e, 'at') && !goog.dom.classes.has(e, 'atd')) {
      e = e.parentNode;
    }
    var index = this_.cellIndex_;
    var data = this_.cellSet_[index];
    if(goog.dom.classes.has(e, 'atd')) {
      switch(e.attrIndex_) {
        case 0:
          data.setAttribute(dataModel.attributeSet.posX, input.value);
          break;
        case 1:
          data.setAttribute(dataModel.attributeSet.posY, input.value);
          break;
        case 2:
          data.setAttribute(dataModel.attributeSet.dir, input.value);
          break;
        case 3:
          data.setAttribute(dataModel.attributeSet.speed, input.value);
          break;
        case 4:
          data.setAttribute(dataModel.attributeSet.visiable, input.value);
          break;
        case 5:
          data.setAttribute(dataModel.attributeSet.status, input.value);
          break;
        case 6:
          data.setAttribute(dataModel.attributeSet.belong, input.value);
          break;
      };
    } else {
      var tmp = data.getAttribute(dataModel.attributeSet.others);
      tmp[goog.dom.getTextContent(goog.dom.getElementByClass('val', e))] = input.value;
      data.setAttribute(dataModel.attributeSet.others, tmp);
    }
  };


  /*
   * 重建相关属性
   */
  exports.MapSetting.prototype.reBuild = function(e) {
    e = e.event_;
    e = e.target || e.srcElement;
    switch(this.mode_) {
      case 1:
        this.clear();
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
            '无', '无', '上', '1', '否', '无', '无', {}
          ));
        }
        data = this.cellSet_[this.cellIndex_].getAllAttribute();
        var tmp = this.cellSet_[this.cellIndex_].getAttribute(dataModel.attributeSet.others);
        var node = goog.dom.getElementsByClass('at', this.elements_.attributeList_);
        for(var i = 0, l = node.length; i < l; ++i) {
          goog.dom.classes.remove(node[i], 'selected'); 
          if(tmp[goog.dom.getTextContent(goog.dom.getElementByClass('val', node[i]))] != undefined && tmp[goog.dom.getTextContent(goog.dom.getElementByClass('val', node[i]))] != null) {
            goog.dom.classes.add(node[i], 'selected'); 
          }
        }
        var line = [dataModel.attributeSet.posX, dataModel.attributeSet.posY, dataModel.attributeSet.dir, dataModel.attributeSet.speed, dataModel.attributeSet.visiable, dataModel.attributeSet.status, dataModel.attributeSet.belong, dataModel.attributeSet.others];
        var noded = goog.dom.getElementsByClass('atd', this.elements_.attributeList_);
        for(var i = 0, l = noded.length; i < l; ++i) {
          goog.dom.getElementByClass('editboxinput', noded[i]).value = data[line[i]];
          goog.dom.getElementByClass('editboxselect', noded[i]).options.selectedIndex = -1;
        }
        for(var i = 0, l = node.length; i < l; ++i) { 
          var t = tmp[goog.dom.getTextContent(goog.dom.getElementByClass('val', node[i]))];
          if(t != undefined && t != null) {   
            goog.dom.getElementByClass('editboxinput', node[i]).value = t;
          } else {
            goog.dom.getElementByClass('editboxinput', node[i]).value = '';
          }
        }
        break;
      case 3:
        this.cellIndex_ = e.index_;
        break;
      case 5:
        this.eventIndex_ = e.index_;
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
