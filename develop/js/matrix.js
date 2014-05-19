goog.provide('ocean.onlineAI.Matrix');

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
    this.stop_ = false;
    this.initData();
  };


  exports.Matrix.prototype.size_ = null;
  exports.Matrix.prototype.cellSet_ = null;
  exports.Matrix.prototype.background_ = null;
  exports.Matrix.prototype.realWorld_ = null;
  exports.Matrix.prototype.eventSet_ = null;
  exports.Matrix.prototype.workflow_ = null;
  exports.Matrix.prototype.canvas_ = null;
  exports.Matrix.prototype.clock_ = null;
  exports.Matrix.prototype.stop_ = null;


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
        var nx = Math.floor(parseInt(ii) % this.size_[0]);
        var ny = Math.floor(parseInt(ii) / this.size_[0]);
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
    var this_ = this;
    this.stop_ = false;
    this.clock_ = window.setInterval(function () {this_.draw();}, 40);
    this.runWorkflow(this.workflow_.import__);
  };


  exports.Matrix.prototype.stop = function() {
    this.clock_ && window.clearInterval(this.clock_);
    this.stop_ = true;
  };


  exports.Matrix.prototype.runWorkflow = function(input, opt_data) {
    var order = this.workflow_[input];
    var index = order.startIndex;
    var node = order.nodes[index];
    var result = null;
    var clock = null;
    var this_ = this;
    var workflowPipe = function () {
      if(this_.stop_)
        return;
      index = order.links[node.index];
      switch(node.type) {
        case 'sePart':
          for(var i = 0, l = index.length; i < l; ++i) {
            index = index[i][1];
            break;
          }
          node = order.nodes[index];
          break;
        case 'jPart':
          result = this_.runWorkflowPart(node.val, false);
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
          result = this_.runWorkflowPart(node.val, true);
          for(var i = 0, l = index.length; i < l; ++i) {
            index = index[i][1];
            break;
          }
          node = order.nodes[index];
          break;
        default:
          break;
      }
      //this_.draw();
      if(node.index != order.endIndex) {
        clock = window.setTimeout(function() {
          workflowPipe();
        }, 20);
      }
    }
    workflowPipe();
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
    var result = {judge: true, val: null};
    var order = null;
    var order0 = data[0];
    var foundInMap = false;
    var canBe = false;
    if(order0.firstAttr == '形状' && father.eventMapConfig.std) {
      //TODO: 匹配固定形状
    }
    for(var j = 0, yMax = this.realWorld_.length; j < yMax && !canBe; ++j) {
      for(var i = 0, xMax = this.realWorld_[j].length; i < xMax && !canBe; ++i) {
        nodes = {x: -1, y: -1, node: null};
        result = {judge: true, val: null};
        if(order0.firstAttr == '形状') {
          foundInMap = true;
          //对当前(x, y)匹配形状及后续条件
          var ok = true;
          var type = '';
          var startX = -1;
          var startY = -1;
          for(var k = 0, l = father.eventMap.length; k < l; ++k) {
            var nx = i + father.eventMap[k].pos[0];
            var ny = j + father.eventMap[k].pos[1];
            if(!this.isIn(nx, ny)) {
              ok = false;
              break;
            }
            if(!this.realWorld_[ny][nx]) {
              ok = false;
              break;
            }
            //检测匹配节点类型..任意/同一/特定的
            if(k <= 0) {
              type = this.realWorld_[ny][nx].getName();
              startX = nx;
              startY = ny;
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
            if(!ok) break;
            //检测后续条件
            nodes.x = nx;
            nodes.y = ny;
            for(var p = 1, pl = data.length; p < pl && ok; ++p) {
              order = data[p];
              var logic = '并且';
              if(p >= 1) {
                logic = data[p - 1].logic;
              }
              this.runOneJudge(order, nodes, result, logic);
              ok = result.judge;
            }
          }
          if(ok) {
            nodes.x = startX;
            nodes.y = startY;
            canBe = ok;
            break;
          }
        } else {
          //对当前点匹配条件
          nodes.x = i;
          nodes.y = j;
          var ok = true;
          for(var p = 0, pl = data.length; p < pl && ok; ++p) {
            order = data[p];
            var logic = '并且';
            if(p >= 1) {
              logic = data[p - 1].logic;
            }
            this.runOneJudge(order, nodes, result, logic);
            ok = result.judge;
            ok && (foundInMap = true); 
          }
          if(ok) {
            canBe = ok;
            break;
          }
        }
      }
    }
    if(!foundInMap) {
      nodes = {x: -1, y: -1, node: null};
      result = {judge: true, val: null};
      var ok = true;
      for(var k = 0, l = data.length && ok; k < l; ++k) {
        //未在map中找到，所以在cellSet中匹配条件
        order = data[k];
        var logic = '并且';
        if(k >= 1) {
          logic = data[k - 1].logic;
        }
        this.runOneJudge(order, nodes, result, logic);
        ok = result.judge;
      }
      canBe = ok;
    }
    return {judge: canBe, nodes: nodes, result: result};
  };


  exports.Matrix.prototype.runOneJudge = function(data, nodes, result, logic) {
    var s0 = (data.firstAttr == '横坐标');
    var s1 = (data.firstAttr == '纵坐标');
    var s2 = (data.secondAttr == '横坐标');
    var s3 = (data.secondAttr == '纵坐标');
    var s4 = (data.firstNode.indexOf('任意') != -1 || data.firstNode.indexOf('同一') != -1);
    var s5 = (data.secondNode.indexOf('任意') != -1 || data.secondNode.indexOf('同一') != -1);
    var s6 = (data.firstNode == '结果');
    var s7 = (data.secondNode == '');
    if(s0 || s1) {
      if(s2 || s3) {
        s0 && s2 && (nodes.nx = nodes.x);
        s0 && s3 && (nodes.nx = nodes.y);
        s1 && s2 && (nodes.ny = nodes.x);
        s1 && s3 && (nodes.ny = nodes.y);
        this.changeJudge(result, logic, true);
        return;
      }
      if(s7) {
        if(!window['isNaN'](parseInt(data.secondAttr))) {
          data.secondAttr = parseInt(data.secondAttr);
        }
        switch(data.operation) {
          case '减去':
            result.val = (s0 ? (nodes.x) : (nodes.y)) - data.secondAttr;
            break;
          case '加上':
            result.val = (s0 ? (nodes.x) : (nodes.y)) + data.secondAttr;
            break;
          case '乘以':
            result.val = (s0 ? (nodes.x) : (nodes.y)) * data.secondAttr;
            break;
          case '除以':
            result.val = (s0 ? (nodes.x) : (nodes.y)) / data.secondAttr;
            break;
        }
        this.changeJudge(result, logic, true);
        return;
      }
    } else if(s2 || s3) {
      s2 && (nodes.nx = result.val);
      s3 && (nodes.ny = result.val);
      this.changeJudge(result, logic, this.isIn(nodes.nx, nodes.ny));
      return;
    }
    var val = this.getNodeVal(data.firstNode, data.firstAttr, result.val, nodes);
    var val2 = this.getNodeVal(data.secondNode, data.secondAttr, result.val, nodes);
    var judge = false;
    var res = 0;
    if(!window['isNaN'](parseInt(val))) {
      val = parseInt(val);
    }
    if(!window['isNaN'](parseInt(val2))) {
      val2 = parseInt(val2);
    }
    switch(data.operation) {
      case '小于':
        judge = (val < val2);
        break;
      case '大于':
        judge = (val > val2);
        break;
      case '等于':
        judge = (val == val2);
        break;
      case '不等于':
        judge = (val != val2);
        break;
      case '大于等于':
        judge = (val >= val2);
        break;
      case '小于等于':
        judge = (val <= val2);
        break;
      case '减去':
        res = (val - val2);
        judge = true;
        break;
      case '加上':
        res = (val + val2);
        judge = true;
        break;
      case '乘以':
        res = (val * val2);
        judge = true;
        break;
      case '除以':
        res = (val / val2);
        judge = true;
        break;
      default:
        judge = true;
        break;
    };
    this.changeJudge(result, logic, judge);
    result.val = res;
  };


  exports.Matrix.prototype.changeJudge = function(result, logic, judge) {
    switch(logic) {
      case '并且':
        result.judge = result.judge && judge;
        break;
      case '或者':
        result.judge = result.judge || judge;
        break;
      case '并且不是':
        result.judge = result.judge && !judge;
        break;
      case '或者不是':
        result.judge = result.judge || !judge;
        break;
      default:
        result.judge = result.judge || judge;
    };
  };


  exports.Matrix.prototype.getNodeVal = function(node, attr, res, nodes) {
    //获取节点值
    var val = null;
    switch(node) {
      case '结果':
        val = res;
        (attr == '绝对值') && (val < 0) && (val = -val);
        break;
      case '':
        val = attr;
        break;
      default:
        if(nodes.x == -1) {
          val = (this.cellSet_[node]) && (val = this.cellSet_[node].getAttribute(attr));
        } else {
          if(node == '任意2' || node == '同一2') {
            val = this.realWorld_[nodes.ny][nodes.nx];
          } else {
            val = this.realWorld_[nodes.y][nodes.x];
          }
          if(val == null || val == undefined) {
            val = '不存在';
          } else {
            if(attr != '') {
              val = val.getAttribute(attr);
            } else {
              val = '存在';
            }
          }
        }
        break;
    };
    return val;
  };


  exports.Matrix.prototype.runEventAction = function(data, father, result) {
    var goOn = true;
    for(var i = 0, l = data.length; i < l; ++i) {
      //执行一条指令
      this.runOneAction(data[i], father, result);
      if(!result.judge) {
        goOn = false;
        break;
      }
    }
    return {result: result, next: goOn, action: data};
  };


  exports.Matrix.prototype.runOneAction = function(data, father, result) {
    switch(data.action) {
      case '消除':
        if(data.firstAttr == '形状') {
          for(var i = 0, l = father.eventMap.length; i < l; ++i) {
            var x = result.nodes.x + father.eventMap[i].pos[0];
            var y = result.nodes.y + father.eventMap[i].pos[1];
            this.realWorld_[y][x] = null;
          }
        }
        break;
      case '创建':
        if(data.firstAttr == '形状') {
        } else {
          var x = result.nodes.x, y = result.nodes.y;
          var dataSet = [];
          if(data.firstNode.indexOf('任意') != -1 || data.firstNode.indexOf('同一') != -1) {
            for(var key in this.cellSet_) {
              if(this.cellSet_[key].getAttribute(data.firstAttr) == data.secondAttr) {
                dataSet.push(key);
              }
            }
          } else {
            dataSet.push(data.firstNode);
          }
          var len = dataSet.length;
          this.realWorld_[y][x] = actionModel.CreateOne(
              x, y, 
              this.cellSet_[dataSet[Math.floor(Math.random() * 100) % len]]
          );
        }
        break;
      case '改变属性':
        if(data.firstNode == '任意' || data.firstNode == '同一') {
          actionModel.ChangeAttr(
            this.realWorld_[result.nodes.y][result.nodes.x],
            data.firstAttr,
            data.secondAttr
          );
        } else if(data.firstNode == '任意2' || data.firstNode == '同一2') {
          actionModel.ChangeAttr(
            this.realWorld_[result.nodes.ny][result.nodes.nx],
            data.firstAttr,
            data.secondAttr
          );
        } else {
          actionModel.ChangeAttr(
            this.cellSet_[data.firstNode],
            data.firstAttr,
            data.secondAttr
          );
        } 
        break;
      case '交换':
        break;
      case '向下移动':
        if(data.firstNode == '任意' || data.firstNode == '同一') {
          actionModel.Move(this.realWorld_[result.nodes.y][result.nodes.x], this.realWorld_);
        } else if(data.firstNode == '任意2' || data.firstNode == '同一2') {
          actionModel.Move(this.realWorld_[result.nodes.ny][result.nodes.nx], this.realWorld_);
        }
        break;
      case '数值增加':
        if(data.firstNode == '任意' || data.firstNode == '同一') {
          actionModel.AddNum(
            this.realWorld_[result.nodes.y][result.nodes.x],
            data.firstAttr,
            data.secondAttr
          );
        } else if(data.firstNode == '任意2' || data.firstNode == '同一2') {
          actionModel.AddNum(
            this.realWorld_[result.nodes.ny][result.nodes.nx],
            data.firstAttr,
            data.secondAttr
          );
        } else {
          actionModel.AddNum(
            this.cellSet_[data.firstNode],
            data.firstAttr,
            data.secondAttr
          );
        }
        break;
      case '数值减少':
        if(data.firstNode == '任意' || data.firstNode == '同一') {
          actionModel.ReduceNum(
            this.realWorld_[result.nodes.y][result.nodes.x],
            data.firstAttr,
            data.secondAttr
          );
        } else if(data.firstNode == '任意2' || data.firstNode == '同一2') {
          actionModel.ReduceNum(
            this.realWorld_[result.nodes.ny][result.nodes.nx],
            data.firstAttr,
            data.secondAttr
          );
        } else {
          actionModel.ReduceNum(
            this.cellSet_[data.firstNode],
            data.firstAttr,
            data.secondAttr
          );
        }
        break;
      case '结束游戏':
        window.clearInterval(this.clock_);
        break;
      case '结束事件':
        result.judge = false;
        break;
    };
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
