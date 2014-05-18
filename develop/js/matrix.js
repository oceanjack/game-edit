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
      var ox = 0;
      var oy = 0;
      for(var j = 0, n = this.eventSet_[i].eventMap.length; j < n; ++j) {
        this.eventSet_[i].eventMap[j] = dataModel.getEventMap(this.eventSet_[i].eventMap[j]);
        var ii = this.eventSet_[i].eventMap[j].pos;
        var nx = Math.floor(parseInt(ii) / this.size_[0]);
        var ny = Math.floor(parseInt(ii) % this.size_[0]);
        if(j == 0) {
          ox = nx;
          oy = ny;
        }
        if(this.eventSet_[i].eventMapConfig.std == false) {
          this.eventSet_[i].eventMap[j].pos = [nx - ox, ny - oy];
        } else {
          this.eventSet_[i].eventMap[j].pos = [nx, ny];
        }
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
    var result = null;
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
          result = this.runWorkflowPart(node.val, false);
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
          result = this.runWorkflowPart(node.val, true);
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
    return result;
  };


  exports.Matrix.prototype.runWorkflowPart = function(data, isDo) {
    if(this.workflow_[data]) {
      return this.runWorkflow(data);
    } else if(this.eventSet_[data]) {
      return this.runEvent(data, isDo);
    } else {
      return this.runDefault(data, isDo);
    }
  };


  exports.Matrix.prototype.runEvent = function(data, isDo) {
    var order = this.eventSet_[data];
    var result = null;
    var action = null;
    do {
      result = this.runEventJudge(order.eventJudge, order);
      if(result.judge && isDo) {
        action = this.runEventAction(order.eventAction, order, result);
      } else {
        return [result.judge, null];
      }
    } while(action.next);
    return [reslut.judge, action];
  };


  exports.Matrix.prototype.runEventJudge = function(data, father) {
    var nodes = {x: -1, y: -1, h: false, v: null};
    var result = 0;
    for(var i = 0, l = data.length; i < l; ++i) {
      var order = data[i];
      var foundInMap = false;
      if(order.firstAttr == '形状') {
        foundInMap = true;
      } else {
      }
      if(!foundInMap) {
        var val = this.getNodeVal(order.firstNode, order.firstAttr, result, nodes);
      }
    }
    return [canBe, nodes, result];
  };


  exports.Matrix.prototype.getNodeVal = function(node, attr, res, nodes) {
    var val = null;
    switch(node) {
      case '结果':
        val = res;
        (attr == '绝对值') && (val < 0) && (val = -val);
        break;
      default:
        (this.cellSet_[node]) && (val = this.cellSet_[node].getAttribute(attr));
        break;
    };
    return val;
  };


  exports.Matrix.prototype.runEventAction = function(data, father, result) {
    var nodes = result[1];
    var reslut = reslut[2];
    var goon = false;
    for(var i = 0, l = data.length; i < l && goon; ++i) {
      var order = data[i];
      goon = this.runOneAction(data[i], nodes, result, father);
    }
    return [nodes, data, goon];
  };
  
  

  exports.Matrix.prototype.runDefault = function(data, isDo) {
    if(!isDo) {
      return [false, null];
    }
    return [(Math.random() * 10 > 5) ? true : false, null];
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
