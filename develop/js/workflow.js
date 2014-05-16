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
  exports.Workflow.prototype.selected_ = null;
  exports.Workflow.prototype.selectedPoint_ = null;
  exports.Workflow.prototype.linkSet_ = null;
  exports.Workflow.prototype.partIndex_ = null;


  exports.Workflow.prototype.init = function() {
    this.elements_ = {};
    this.workflowSet_ = [];
    this.linkSet_ = {};
    this.workflowIndex_ = 0;
    this.wTotleIndex_ = 0;
    this.partIndex_ = 0;
    this.selected_ = false;
  };

  
  exports.Workflow.prototype.getElement = function() {
    this.elements_.workflowList_ = goog.dom.getElementByClass('workflowList');
    this.elements_.workflowPart_ = goog.dom.getElementByClass('workflowPart');
    this.elements_.workflowMenu_ = goog.dom.getElementsByClass('wfp', this.elements_.workflowPart_);
    this.elements_.removeMenu_ = goog.dom.getElementByClass('wfpRemove', this.elements_.workflowPart_);
    this.elements_.workflowSpace_ = goog.dom.getElementByClass('workflowspace');
    this.elements_.cellName_ = goog.dom.getElementByClass('cellName');
    this.elements_.chooseType_ = goog.dom.getElementByClass('chooseType');
    this.elements_.eventList_ = goog.dom.getElementByClass('eventList');
    this.elements_.canvas_ = goog.dom.getElementByClass('workflowCanvas');
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
  exports.Workflow.prototype.addWorkflowPart = function(e, opt_type, opt_index) {
    if(e) {
      e = e.event_;
      e = e.target || e.srcElement;
    }
    var div = goog.dom.createElement('div');
    goog.dom.classes.add(div, 'part');
    var up = goog.dom.createElement('p');
    goog.dom.classes.add(up, 'up');
    goog.dom.classes.add(up, 'pp');
    goog.dom.setTextContent(up, '+');
    var left = goog.dom.createElement('p');
    goog.dom.classes.add(left, 'left');
    goog.dom.classes.add(left, 'pp');
    goog.dom.setTextContent(left, '+');
    var right = goog.dom.createElement('p');
    goog.dom.classes.add(right, 'right');
    goog.dom.classes.add(right, 'pp');
    goog.dom.setTextContent(right, '+');
    var down = goog.dom.createElement('p');
    goog.dom.classes.add(down, 'down');
    goog.dom.classes.add(down, 'pp');
    goog.dom.setTextContent(down, '+');
    goog.dom.appendChild(div, up);
    goog.dom.appendChild(div, left);
    if(e == this.elements_.workflowMenu_[2] || opt_type == 'jPart') {
      goog.dom.classes.add(div, 'jPart');
      goog.dom.appendChild(div, this.createSelect());
      this.editLinks(up, left, right, down, 2);
    } else if(e == this.elements_.workflowMenu_[0] || opt_type == 'sePart') {
      goog.dom.classes.add(div, 'sePart');
      var select = goog.dom.htmlToDocumentFragment(templates.startAndEnd());
      goog.dom.classes.add(select, 'sel');
      goog.dom.appendChild(div, select);
      this.editLinks(up, left, right, down, 1);
    } else if(e == this.elements_.workflowMenu_[1] || opt_type == 'ioPart') {
      goog.dom.classes.add(div, 'ioPart', 1);
      this.editLinks(up, left, right, down);
    } else if(e == this.elements_.workflowMenu_[3] || opt_type == 'sPart') {
      goog.dom.classes.add(div, 'sPart');
      goog.dom.appendChild(div, this.createSelect());
      this.editLinks(up, left, right, down, 1);
    }
    goog.dom.appendChild(div, right);
    goog.dom.appendChild(div, down);
    if(!e) {
      this.partIndex_ = opt_index;
    }
    div.index_ = this.partIndex_;
    up.index_ = this.partIndex_ * 10 + 0;
    left.index_ = this.partIndex_ * 10 + 1;
    right.index_ = this.partIndex_ * 10 + 2;
    down.index_ = this.partIndex_ * 10 + 3;
    ++this.partIndex_;
    goog.dom.appendChild(this.elements_.workflowSpace_, div);
    this.dragAnddrop(div);
    return div;
  };


  exports.Workflow.prototype.editLinks = function(u, l, r, d, n) {
    var this_ = this;
    var linking = function(e) {
      e = e.event_;
      e = e.target || e.srcElement;
      if(this_.selected_) {
        if(e != this_.selectedPoint_ && e.parentNode != this_.selectedPoint_.parentNode) {
          this_.linkSet_[this_.selectedPoint_.index_] = [this_.selectedPoint_, e];
        } else if(e == this_.selectedPoint_) {
          this_.linkSet_[this_.selectedPoint_.index_] = null;
        }
        this_.selected_ = false;
      } else {
        this_.selectedPoint_ = e;
        this_.selected_ = true;
      }
      this_.draw();
    };
    goog.events.listen(u, 'click', function(e) {linking(e);}, false, this);
    goog.events.listen(l, 'click', function(e) {linking(e);}, false, this);
    goog.events.listen(r, 'click', function(e) {linking(e);}, false, this);
    goog.events.listen(d, 'click', function(e) {linking(e);}, false, this);
  };


  exports.Workflow.prototype.dragAnddrop = function(node) {
    var sign = false;
    var orgX = 0;
    var orgY = 0;
    var this_ = this;
    goog.events.listen(node, 'mousedown', function(e) {
      if(this_.elements_.removeMenu_.checked) {
        for(var key in this.linkSet_) {
          if(this.linkSet_[key]) {
            var start = Math.floor(this.linkSet_[key][0].index_ / 10);
            var end = Math.floor(this.linkSet_[key][1].index_ / 10);
            if(start == node.index_ || end == node.index_) {
              this.linkSet_[key] = null;
            }
          }
        }
        goog.dom.removeNode(node);
        this_.draw();
        return false;
      }
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
      this_.draw();
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
    goog.dom.classes.add(select, 'sel');
    var rules = goog.dom.getElementsByClass('me', this.elements_.eventList_);
    for(var i = 0, l = rules.length; i < l; ++i) {
      var option = goog.dom.createElement('option');
      goog.dom.setTextContent(option, goog.dom.getTextContent(rules[i]));
      goog.dom.classes.add(option, 'new');
      goog.dom.classes.add(option, 'judge');
      goog.dom.appendChild(select, option);
    }
    var rules2 = goog.dom.getElementsByClass('me', this.elements_.workflowList_);
    for(var i = 1, l = rules2.length; i < l; ++i) {
      var option = goog.dom.createElement('option');
      goog.dom.setTextContent(option, goog.dom.getTextContent(rules2[i]));
      goog.dom.classes.add(option, 'new');
      goog.dom.classes.add(option, 'workflow');
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
      goog.dom.classes.add(option, 'judge');
      goog.dom.appendChild(e, option);
    }
    var rules2 = goog.dom.getElementsByClass('me', this.elements_.workflowList_);
    for(var i = 1, l = rules2.length; i < l; ++i) {
      var option = goog.dom.createElement('option');
      goog.dom.setTextContent(option, goog.dom.getTextContent(rules2[i]));
      goog.dom.classes.add(option, 'new');
      goog.dom.classes.add(option, 'workflow');
      goog.dom.appendChild(e, option);
    }
    e.options.selectedIndex = index;
  };


  exports.Workflow.prototype.draw = function() {
    var c = this.elements_.canvas_.getContext('2d');
    c.clearRect(0, 0, 800, 600);
    var left = this.elements_.canvas_.getBoundingClientRect().left - 5;
    var top = this.elements_.canvas_.getBoundingClientRect().top;
    for(var key in this.linkSet_) {
      if(this.linkSet_[key] == null) {
        continue;
      }
      var start = this.linkSet_[key][0].getBoundingClientRect();
      var end = this.linkSet_[key][1].getBoundingClientRect();
      var sx = start.left - left;
      var sy = start.top - top;
      var ex = end.left - left;
      var ey = end.top - top;
      c.beginPath();
      c.moveTo(sx, sy);
      c.lineTo(ex, ey);
      c.fillStyle="#FF0000";
      c.stroke();
      c.beginPath();
      c.arc(ex, ey, 7, 0, Math.PI * 2, true);
      c.closePath();
      c.fill();
    }
  };


  exports.Workflow.prototype.makeSure = function() {
    var name = (this.elements_.cellName_.value != '' ? this.elements_.cellName_.value : '空');
    var type = this.elements_.chooseType_.options.selectedIndex;
    (type != -1) && (type = this.elements_.chooseType_.options[type].value);
    var node = goog.dom.getElementsByClass('part', this.elements_.workflowSpace_);
    var nodeSet = [];
    for(var i = 0, l = node.length; i < l; ++i) {
      var left = goog.style.getStyle(node[i], 'margin-left');
      var top = goog.style.getStyle(node[i], 'margin-top');
      var select = goog.dom.getElementByClass('sel', node[i]);
      var selectIndex = select.options.selectedIndex;
      var val = (selectIndex != -1 ? select.options[selectIndex].value : '');
      var types = goog.dom.classes.get(node[i])[1];
      nodeSet.push(dataModel.setWorkflowPart(left, top, types, node[i].index_, val));
    }
    var linkSet = [];
    for(var key in this.linkSet_) {
      if(this.linkSet_[key]) {
        linkSet.push([this.linkSet_[key][0].index_, this.linkSet_[key][1].index_]);
      }
    }
    var list = goog.dom.getElementsByClass('me', this.elements_.workflowList_);
    if(this.workflowSet_[this.workflowIndex_]) {
      this.workflowSet_[this.workflowIndex_] = dataModel.setWorkflow(nodeSet, linkSet, name, type);
      goog.dom.setTextContent(list[this.workflowIndex_], name);
    } else {
      this.workflowSet_[this.workflowIndex_] = dataModel.setWorkflow(nodeSet, linkSet, name, type);
      var li = goog.dom.createElement('li');
      goog.dom.setTextContent(li, name);
      goog.dom.classes.add(li, 'me');
      li.index_ = this.workflowIndex_;
      this.elements_.workflowList_.appendChild(li);
      goog.events.listen(li, 'click', this.reBuild, false, this);
      ++this.wTotleIndex_;
    }
  };


  exports.Workflow.prototype.findOption = function(node, val) {
    for(var i = 0, l = node.options.length; i < l; ++i) {
      if(node.options[i].value == val) {
        node.options.selectedIndex = i;
        break;
      }
    }
  };


  exports.Workflow.prototype.reBuild = function(e) {
    this.clear();
    e = e.event_;
    e = e.target || e.srcElement;
    this.workflowIndex_ = e.index_;
    this.selected_ = false;
    var data = dataModel.getWorkflow(this.workflowSet_[this.workflowIndex_]);
    this.elements_.cellName_.value = data.name;
    this.findOption(this.elements_.chooseType_, data.type);
    var maxIndex = 0;
    var partSet = {};
    for(var i = 0, l = data.nodes.length; i < l; ++i) {
      node = dataModel.getWorkflowPart(data.nodes[i]);
      (node.index > maxIndex) && (maxIndex = node.index);
      var part = this.addWorkflowPart(null, node.type, node.index);
      goog.style.setStyle(part, 'margin-left', node.left);
      goog.style.setStyle(part, 'margin-top', node.top);
      this.findOption(goog.dom.getElementByClass('sel', part), node.val);
      partSet[node.index] = part;
    }
    this.partIndex_ = ++maxIndex;
    for(var i = 0, l = data.links.length; i < l; ++i) {
      var start = Math.floor(parseInt(data.links[i][0]) / 10);
      var startP = Math.floor(parseInt(data.links[i][0]) % 10);
      var end = Math.floor(parseInt(data.links[i][1]) / 10);
      var endP = Math.floor(parseInt(data.links[i][1]) % 10);
      var startPNode = goog.dom.getElementsByClass('pp', partSet[start]);
      var endPNode = goog.dom.getElementsByClass('pp', partSet[end]);
      this.linkSet_[parseInt(data.links[i][0])] = [startPNode[startP], endPNode[endP]];
    }
    this.draw();
  };


  exports.Workflow.prototype.clear = function() {
    this.workflowIndex_ = this.wTotleIndex_;
    var c = this.elements_.canvas_.getContext('2d');
    c.clearRect(0, 0, 800, 600);
    var node = goog.dom.getElementsByClass('part', this.elements_.workflowSpace_);
    for(var i = node.length - 1; i >= 0; --i) {
      goog.dom.removeNode(node[i]);
    }
    this.selected_ = false;
    this.linkSet_ = {};
    this.partIndex_ = 0;
  };


  exports.Workflow.prototype.getWorkflow = function() {
    return this.workflowSet_;
  };


  exports.Workflow.prototype.setWorkflow = function(data) {
    this.workflowIndex_ = 0;
    if(data) {
      this.wTotleIndex_ = data.length;
      this.workflowSet_ = data;
      for(var i = 0, l = data.length; i < l; ++i) {
        var tmp = dataModel.getWorkflow(data[i]);
        var li = goog.dom.createElement('li');
        goog.dom.setTextContent(li, tmp.name);
        goog.dom.classes.add(li, 'me');
        li.index_ = i;
        this.elements_.workflowList_.appendChild(li);
        goog.events.listen(li, 'click', this.reBuild, false, this);
      }
    }
  };
});
