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
      }
      this.eventSet_[i].eventMapConfig = dataModel.getEventMapConfig(this.eventSet_[i].eventMapConfig);
    }
    //handle workflow
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
    }
  };


  exports.Matrix.prototype.run = function() {
    alert('You have the final fight!')
  };
});
