goog.provide('ocean.onlineAI.Workflow');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.style');

goog.require('ocean.onlineAI.Data');

goog.scope(function() {
  var exports = ocean.onlineAI;
  var dataModel = exports.Data;


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
    if(e == this.elements_.workflowMenu_[0]) {
      goog.dom.classes.add(div, 'jPart');
    } else if(e == this.elements_.workflowMenu_[1]) {
      goog.dom.classes.add(div, 'sePart');
    } else if(e == this.elements_.workflowMenu_[2]) {
      goog.dom.classes.add(div, 'ioPart');
    } else if(e == this.elements_.workflowMenu_[3]) {
      goog.dom.classes.add(div, 'sPart');
    }
    goog.dom.appendChild(this.elements_.workflowSpace_, div);
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
});
