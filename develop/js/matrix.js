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
      this.eventSet_[i].eventMapConfig = dataModel.getEventMapConfig(this.eventSet_[i].eventMapConfig);
      for(var j = 0, n = this.eventSet_[i].eventMap.length; j < n; ++j) {
        this.eventSet_[i].eventMap[j] = dataModel.getEventMap(this.eventSet_[i].eventMap[j]);
        var ii = this.eventSet_[i].eventMap[j].pos;
        var nx = Math.floor(parseInt(ii) / this.size_[0]);
        var ny = Math.floor(parseInt(ii) % this.size_[0]);
        if(j <= 0) {
          ox = nx;
          oy = ny;
        }
        if(this.eventSet_[i].eventMapConfig.std == false) {
          this.eventSet_[i].eventMap[j].pos = [nx - ox, ny - oy];
        } else {
          this.eventSet_[i].eventMap[j].pos = [nx, ny];
        }
      }
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
    return [result.judge, action];
  };


  exports.Matrix.prototype.isIn = function(x, y) {
    return (0 <= x && x < this.size_[0] && 0 <= y && y < this.size_[1]);
  };


  exports.Matrix.prototype.runEventJudge = function(data, father) {
    var nodes = {x: -1, y: -1, node: null};
    var result = {judge: false, val: null};
    var order = null;
    var order0 = data[0];
    var foundInMap = false;
    var canBe = false;
    if(order0.firstAttr == '形状' && father.eventMapConfig.std) {
      //TODO: 匹配固定形状
    }
    for(var j = 0, yMax = this.realWorld_.length; j < yMax && !canBe; ++j) {
      for(var i = 0, xMax = this.realWorld_[j].length; i < xMax &&!canBe; ++i) {
        if(order0.firstAttr == '形状') {
          foundInMap = true;
          //对当前(x, y)匹配形状及后续条件
          var ok = true;
          var type = '';
          for(var k = 0, l = father.eventMap.length && ok; k < l; ++k) {
            var nx = i + father.eventMap[k].pos[0];
            var ny = j + father.eventMap[k].pos[1];
            if(!this.isIn(nx, ny)) {
              ok = false;
              break;
            }
            //检测匹配节点类型..任意/同一/特定的
            if(k <= 0) {
              type = this.realWorld_[ny][nx].getName();
            }
            switch(order0.firstNode) {
              case '任意':
              case '':
                break;
              case '同一':
                ok = (this.realWorld_[ny][nx].getName() == type);
                break;
              default:
                ok = (this.realWorld_[ny][nx].getName() == order0.firstNode);
                break;
            }
            //检测后续条件
            nodes.x = nx;
            nodes.y = ny;
            for(var p = 1, pl = data.length; p < pl && ok; ++p) {
              order = data[p];
              this.runOneJudge(order, nodes, result);
              ok = result.judge;
            }
          }
          if(ok) {
            canbe = ok;
            break;
          }
        } else {
          //对当前点匹配条件
          nodes.x = i;
          nodes.y = j;
          var ok = true;
          for(var p = 0, pl = data.length; p < pl && ok; ++p) {
            order = data[p];
            this.runOneJudge(order, nodes, result);
            ok = result.judge;
            ok && (foundInMap = true); 
          }
        }
      }
    }
    if(!foundInMap) {
      var ok = true;
      for(var k = 0, l = data.length && ok; k < l; ++k) {
        //未在map中找到，所以在cellSet中匹配条件
        order = data[k];
        if(k <= 0) {
          if(this.cellSet_[order.firstNode]) {
            nodes.node = this.cellSet_[order.firstNode];
          }
        }
        this.runOneJudge(order, nodes, result);
        ok = result.judge;
      }
      canBe = ok;
    }
    return {judge: canBe, nodes: nodes, result: result};
  };


  exports.Matrix.prototype.runOneJudge = function(data, nodes, result) {
  };


  exports.Matrix.prototype.getNodeVal = function(node, attr, res, nodes) {
    //获取节点值
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
    var nodes = result.nodes;
    var result = result.result;
    var order = null;
    var order0 = data[0];
    var goOn = true;
    for(var i = 0, l = data.length; i < l && goOn; ++i) {
      //执行一条指令
      var order = data[i];
    }
    return {nodes: nodes, next: goOn, action: data};
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
