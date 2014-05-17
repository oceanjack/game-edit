goog.provide('ocean.onlineAI.Matrix');

goog.require('goog.cloneObject');

goog.require('ocean.onlineAI.Cell');
goog.require('ocean.onlineAI.Actions');
goog.require('ocean.onlineAI.One');
goog.require('ocean.onlineAI.Data');

goog.scope(function() {
  var exports = ocean.onlineAI;
  var dataModel = exports.Data;
  var actionModel = exports.Actions;


  exports.Matrix = function(size, cellSet, background, realWorld, eventSet, workflow, context) {
    this.size_ = size;
    this.cellSet_ = goog.cloneObject(cellSet);
    this.background_ = background;
    this.realWorld_ = goog.cloneObject(realWorld);
    this.eventSet_ = goog.cloneObject(eventSet);
    this.workflow_ = goog.cloneObject(workflow);
    this.canvas_ = context;
    this.initData();
  };


  exports.Matrix.prototype.size_ = null;
  exports.Matrix.prototype.cellSet_ = null;
  exports.Matrix.prototype.background_ = null;
  exports.Matrix.prototype.realWorld_ = null;
  exports.Matrix.prototype.eventSet_ = null;
  exports.Matrix.prototype.workflow_ = null;
  exports.Matrix.prototype.canvas_ = null;


  exports.Matrix.prototype.initData = function() {
    //handle eventSet
    var eventSet = {};
    for(var i = 0, l = this.eventSet_.length; i < l; ++i) {
      this.eventSet_[i] = dataModel.getEventData(this.eventSet_[i]);
      for(var j = 0, n = this.eventSet_[i].eventJudge.length; j < n; ++j) {
        this.eventSet_[i].eventJudge[j] = dataModel.getEventJudge(this.eventSet_[i].eventJudge[j]);
      }
      for(var j = 0, n = this.eventSet_[i].eventAction.length; j < n; ++j) {
        this.eventSet_[i].eventAction[j] = dataModel.getEventAction(this.eventSet_[i].eventAction[j]);
      }
      for(var j = 0, n = this.eventSet_[i].eventMap.length; j < n; ++j) {
        this.eventSet_[i].eventMap[j] = dataModel.getEventMap(this.eventSet_[i].eventMap[j]);
        var ii = this.eventSet_[i].eventMap[j].pos;
        var nx = Math.floor(parseInt(ii) / this.size_[0]);
        var ny = Math.floor(parseInt(ii) % this.size_[0]);
        this.eventSet_[i].eventMap[j].pos = [nx, ny];
      }
      this.eventSet_[i].eventMapConfig = dataModel.getEventMapConfig(this.eventSet_[i].eventMapConfig);
      eventSet[this.eventSet_[i].name] = this.eventSet_[i];
    }
    this.eventSet_ = eventSet;
    
    //handle workflow
    var workflows = {};
    for(var i = 0, l = this.workflow_.length; i < l; ++i) {
      this.workflow_[i] = dataModel.getWorkflow(this.workflow_[i]);
      this.workflow_[i].startIndex = -1;
      this.workflow_[i].endIndex = -1;
      var workflow = {};
      for(j = 0, n = this.workflow_[i].nodes.length; j < n; ++j) {
        var tmp = this.workflow_[i].nodes[j];
        tmp = dataModel.getWorkflowPart(tmp);
        workflow[tmp.index] = tmp;
        if(tmp.type == 'sePart') {
          if(tmp.val == '开始') {
            this.workflow_[i].startIndex = tmp.index;
          } else {
            this.workflow_[i].endIndex = tmp.index;
          }
        }
      }
      this.workflow_[i].nodes = workflow;
      var links = {};
      for(var j = 0, n = this.workflow_[i].links.length; j < n; ++j) {
        var lk = this.workflow_[i].links[j];
        var sn = Math.floor(parseInt(lk[0]) / 10);
        var sp = Math.floor(parseInt(lk[0]) % 10);
        var en = Math.floor(parseInt(lk[1]) / 10);
        var ep = Math.floor(parseInt(lk[1]) % 10);
        (!links[sn]) && (links[sn] = []);
        links[sn].push([sp, en, ep]); 
      };
      this.workflow_[i].links = links;
      workflows[this.workflow_[i].name] = this.workflow_[i];
      (i == 0) && (workflows.import__ = this.workflow_[i].name);
    }
    this.workflow_ = workflows;
    //handle cellset
    var cellSet = {};
    for(var i = 0, l = this.cellSet_.length; i < l; ++i) {
      var data = dataModel.getCharacter(this.cellSet_[i].getData());
      data.src = dataModel.getImg(data.src);
      this.cellSet_[i].setData(data);
      cellSet[this.cellSet_[i].getData().name] = this.cellSet_[i];
    }
    this.cellSet_ = cellSet;
    //handle map
    for(var j = 0, n = this.realWorld_.length; j < n; ++j) {
      for(var i = 0, l = this.realWorld_[j].length; i < l; ++i) {
        if(this.realWorld_[j][i]) {
          this.realWorld_[j][i].setNewData(this.cellSet_[this.realWorld_[j][i].getName()]);
        }
      }
    }
  };


  exports.Matrix.prototype.run = function() {
    this.runWorkflow(this.workflow_.import__);
  };


  exports.Matrix.prototype.runWorkflow = function(input, opt_data) {
    var order = this.workflow_[input];
    var index = order.startIndex;
    var node = order.nodes[index];
    while(node.index != order.endIndex) {
      index = order.links[node.index];
      if(index == undefined) {
        break;
      }
      switch(node.type) {
        case 'sePart':
          for(var i = 0, l = index.length; i < l; ++i) {
            index = index[i][1];
            break;
          }
          node = order.nodes[index];
          break;
        case 'jPart':
          var result = this.runWorkflowPart(node.val, false);
          for(var i = 0, l = index.length; i < l; ++i) {
            if(result[0]) {
              if(index[i][0] == 3) {
                index = index[i][1];
                break;
              }
            } else {
              if(index[i][0] != 3) {
                index = index[i][1];
                break;
              }
            }
          };
          node = order.nodes[index];
          break;
        case 'sPart':
          var result = this.runWorkflowPart(node.val, true);
          for(var i = 0, l = index.length; i < l; ++i) {
            index = index[i][1];
            break;
          }
          node = order.nodes[index];
          break;
        default:
          break;
      }
    }
  };


  exports.Matrix.prototype.runWorkflowPart = function(data, isDo) {
    var result = null;
    var judge = (Math.random() * 10 > 5) ? true : false;
    return [judge, result];
  };


  exports.Matrix.prototype.draw = function() {
    var c = this.canvas_;
    var w = 800 / this.size_[0];
    var h = 600 / this.size_[1];
    c.clearRect(0, 0, 800, 600);
    this.background_ && c.drawImage(this.background_, 0, 0, this.background_.width, this.background_.height);
    for(var j = 0, n = this.realWorld_.length; j < n; ++j) {
      for(var i = 0, l = this.realWorld_[j].length; i < l; ++i) {
        var tmp = this.realWorld_[j][i];
        if(tmp) {
          var x = tmp.getAttribute(dataModel.attributeSet.posX);
          var y = tmp.getAttribute(dataModel.attributeSet.posY);
          var data = tmp.getImgData().src;
          data && c.drawImage(data, x * w, y * h, data.width, data.height);
        }
      }
    }
  };
});
