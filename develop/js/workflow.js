goog.provide('ocean.onlineAI.Workflow');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.style');

goog.require('ocean.onlineAI.Data');
goog.require('ocean.onlineAI.OnlineAI.templates');

goog.scope(function() {
  var exports = ocean.onlineAI;
  var dataModel = exports.Data;
  var templates = ocean.onlineAI.OnlineAI.templates;

  exports.Workflow = function() {
    this.init();
    this.getElement();
    this.addEvent();
  };


  exports.Workflow.prototype.elements_ = null;
  exports.Workflow.prototype.workflowSet_ = null; //流程集合
  exports.Workflow.prototype.workflowIndex_ = null; //当流程id
  exports.Workflow.prototype.wTotleIndex_ = null; //总流程


  exports.Workflow.prototype.init = function() {
    this.elements_ = {};
    this.workflowSet_ = [];
    this.workflowIndex_ = 0;
    this.wTotleIndex_ = 0;
  };

  
  exports.Workflow.prototype.getElement = function() {
    this.elements_.workflowList_ = goog.dom.getElementByClass('workflowList');
    this.elements_.workflowPart_ = goog.dom.getElementByClass('workflowPart');
    this.elements_.workflowMenu_ = goog.dom.getElementsByClass('wfp', this.elements_.workflowPart_);
    this.elements_.workflowSpace_ = goog.dom.getElementByClass('workflowspace');
    this.elements_.cellName_ = goog.dom.getElementByClass('cellName');
    this.elements_.chooseType_ = goog.dom.getElementByClass('chooseType');
    this.elements_.eventList_ = goog.dom.getElementByClass('eventList');
  };


  exports.Workflow.prototype.addEvent = function() {
    var el = this.elements_;
    goog.events.listen(el.workflowMenu_[0], 'click', this.addWorkflowPart, false, this);
    goog.events.listen(el.workflowMenu_[1], 'click', this.addWorkflowPart, false, this);
    goog.events.listen(el.workflowMenu_[2], 'click', this.addWorkflowPart, false, this);
    goog.events.listen(el.workflowMenu_[3], 'click', this.addWorkflowPart, false, this);
  };


  /*
   * 添加流程图组件
   */
  exports.Workflow.prototype.addWorkflowPart = function(e) {
    e = e.event_;
    e = e.target || e.srcElement;
    var div = goog.dom.createElement('div');
    goog.dom.classes.add(div, 'part');
    var up = goog.dom.createElement('p');
    goog.dom.classes.add(up, 'up');
    goog.dom.setTextContent(up, 'o');
    var left = goog.dom.createElement('p');
    goog.dom.classes.add(left, 'left');
    goog.dom.setTextContent(left, 'o');
    var right = goog.dom.createElement('p');
    goog.dom.classes.add(right, 'right');
    goog.dom.setTextContent(right, 'o');
    var down = goog.dom.createElement('p');
    goog.dom.classes.add(down, 'down');
    goog.dom.setTextContent(down, 'o');
    goog.dom.appendChild(div, up);
    goog.dom.appendChild(div, left);
    if(e == this.elements_.workflowMenu_[2]) {
      goog.dom.classes.add(div, 'jPart');
      goog.dom.appendChild(div, this.createSelect());
    } else if(e == this.elements_.workflowMenu_[0]) {
      goog.dom.classes.add(div, 'sePart');
      goog.dom.appendChild(div, goog.dom.htmlToDocumentFragment(templates.startAndEnd()));
    } else if(e == this.elements_.workflowMenu_[1]) {
      goog.dom.classes.add(div, 'ioPart');
    } else if(e == this.elements_.workflowMenu_[3]) {
      goog.dom.classes.add(div, 'sPart');
      goog.dom.appendChild(div, this.createSelect());
    }
    goog.dom.appendChild(div, right);
    goog.dom.appendChild(div, down);
    goog.dom.appendChild(this.elements_.workflowSpace_, div);
    this.dragAnddrop(div);
  };


  exports.Workflow.prototype.dragAnddrop = function(node) {
    var sign = false;
    var orgX = 0;
    var orgY = 0;
    goog.events.listen(node, 'mousedown', function(e) {
      sign = true;
      e = e.event_;
      var pos = {x: e.x, y: e.y};
      orgX = pos.x - parseInt(window.getComputedStyle(node)['margin-left'].split('px')[0]);
      orgY = pos.y - parseInt(window.getComputedStyle(node)['margin-top'].split('px')[0]);
    }, false, this);
    goog.events.listen(node, 'mousemove', function(e) {
      if(!sign) {
        return false;
      }
      e = e.event_;
      e.preventDefault();
      var pos = {x: e.x, y: e.y};
      if(e.y - orgY >= 5 && e.y - orgY <= 550) {
        goog.style.setStyle(node, 'margin-top', e.y - orgY + 'px');
      }
      if(e.x - orgX >= 30 && e.x - orgX <= 690) {
        goog.style.setStyle(node, 'margin-left', e.x - orgX +'px');
      }
      return false;
    }, false, this);
    goog.events.listen(node, 'mouseup', function(e) {
      e = e.event_;
      e.preventDefault();
      sign = false;
      return false;
    }, false, this);

  };


  exports.Workflow.prototype.createSelect = function() {
    var select = goog.dom.htmlToDocumentFragment(templates.actionList());
    var rules = goog.dom.getElementsByClass('me', this.elements_.eventList_);
    for(var i = 0, l = rules.length; i < l; ++i) {
      var option = goog.dom.createElement('option');
      goog.dom.setTextContent(option, goog.dom.getTextContent(rules[i]));
      goog.dom.classes.add(option, 'new');
      goog.dom.appendChild(select, option);
    }
    goog.events.listen(select, 'mousedown', this.changeOptions, false, this);
    return select;
  };


  exports.Workflow.prototype.changeOptions = function(e) {
    e = e.event_;
    e = e.target || e.srcElement;
    var index = e.options.selectedIndex;
    for(var i = e.options.length - 1; i >= 0; --i) {
      if(goog.dom.classes.has(e.options[i], 'new')) {
        goog.dom.removeNode(e.options[i]);
      }
    }
    var rules = goog.dom.getElementsByClass('me', this.elements_.eventList_);
    for(var i = 0, l = rules.length; i < l; ++i) {
      var option = goog.dom.createElement('option');
      goog.dom.setTextContent(option, goog.dom.getTextContent(rules[i]));
      goog.dom.classes.add(option, 'new');
      goog.dom.appendChild(e, option);
    }
    e.options.selectedIndex = index;
  };


  exports.Workflow.prototype.makeSure = function() {
    var name = (this.elements_.cellName_.value != '' ? this.elements_.cellName_.value : '空');
    var type = this.elements_.chooseType_.options.selectedIndex;
    (type != -1) && (type = this.elements_.chooseType_.options[type].value);
    var node = goog.dom.createElement('li');
    goog.dom.setTextContent(node, name);
    goog.dom.classes.add(node, 'me');
    node.index_ = this.workflowIndex_;
    this.elements_.workflowList_.appendChild(node);
    goog.events.listen(node, 'click', this.reBuild, false, this);
    ++this.wTotleIndex_; 
  };


  exports.Workflow.prototype.reBuild = function() {
  };
});
