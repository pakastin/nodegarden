'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
  'use strict';

  var Node = (function () {
    function Node() {
      _classCallCheck(this, Node);

      this.x = 0;
      this.y = 0;
      this.velocityX = 0;
      this.velocityY = 0;
      this.mass = 0; //diameter as well
    }

    _createClass(Node, [{
      key: 'update',
      value: function update() {
        this.x += this.velocityX;
        this.y += this.velocityY;
      }
    }, {
      key: 'reset',
      value: function reset(width, height) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.velocityX = Math.random() * 1 - 0.5;
        this.velocityY = Math.random() * 1 - 0.5;
        this.mass = Math.random() * 2 + 1;
      }
    }, {
      key: 'isInvisible',
      value: function isInvisible(width, height) {
        return this.x > width + 25 || this.x < -25 || this.y > width + 25 || this.y < -25;
      }
    }]);

    return Node;
  })();

  var NodeGarden = (function () {
    function NodeGarden() {
      _classCallCheck(this, NodeGarden);
    }

    _createClass(NodeGarden, [{
      key: 'init',
      value: function init() {
        var _this = this;

        //Create context
        this.canvas = document.createElement('canvas');
        this.canvas.id = "nodegarden";
        if (window.devicePixelRatio !== 1) {
          // if retina screen, scale canvas
          this.canvas.style.transform = 'scale(' + 1 / window.devicePixelRatio + ')';
          this.canvas.style.transformOrigin = '0 0';
        }

        //Add to DOM
        document.getElementById('container').appendChild(this.canvas);

        //Night mode
        document.getElementsByClassName('moon')[0].addEventListener('click', function (e) {
          e.stopPropagation();
          _this.toggleNightMode();
        });

        this._ctx = this.canvas.getContext('2d');
        this._ctx.fillStyle = '#ffffff';
        this._nodes = [];
        this.resize();

        window.addEventListener('resize', function () {
          _this.resize();
        });

        document.getElementById('container').addEventListener('click', function (e) {
          e.stopPropagation();
          _this.resetRandomNode(e.pageX, e.pageY);
        });
        //Init rendering
        this.render();
      }
    }, {
      key: 'resize',
      value: function resize() {
        this.canvas.width = window.innerWidth * window.devicePixelRatio;
        this.canvas.height = window.innerHeight * window.devicePixelRatio;
        this._nodes.length = Math.sqrt(this.canvas.width * this.canvas.height) / 25 | 0;
        //Fill if empty space
        for (var i = 0; i < this._nodes.length; i++) {
          if (this._nodes[i]) {
            continue;
          }
          var node = new Node();
          node.reset(this.canvas.width, this.canvas.height);
          this._nodes[i] = node;
        }
        this.toggleNightMode();
        this.toggleNightMode();
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        //requestAnimationFrame(()=>{setTimeout(()=>{this.render();},50);});
        requestAnimationFrame(function () {
          _this2.render();
        });
        //Clear canvas

        this._ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //Update links
        for (var i = 0; i < this._nodes.length - 1; i++) {
          var nodeA = this._nodes[i];
          for (var j = i + 1; j < this._nodes.length; j++) {
            var nodeB = this._nodes[j];
            var xDistance = nodeB.x - nodeA.x;
            var yDistance = nodeB.y - nodeA.y;

            var distanceSquared = xDistance * xDistance + yDistance * yDistance;

            //Increase with force increase
            if (distanceSquared > 20000) {
              continue;
            }

            if (distanceSquared < (nodeA.mass / 2 + nodeB.mass / 2) * (nodeA.mass / 2 + nodeB.mass / 2)) {
              // collision: remove smaller or equal - never both of them
              if (nodeA.mass <= nodeB.mass) {
                nodeB.velocityX = nodeB.mass * nodeB.velocityX / (nodeA.mass + nodeB.mass) + nodeA.mass * nodeA.velocityX / (nodeA.mass + nodeB.mass);
                nodeB.velocityY = nodeB.mass * nodeB.velocityY / (nodeA.mass + nodeB.mass) + nodeA.mass * nodeA.velocityX / (nodeA.mass + nodeB.mass);
                nodeA.reset(this.canvas.width, this.canvas.height);
                continue;
              } else {
                nodeA.velocityX = nodeA.mass * nodeA.velocityX / (nodeA.mass + nodeB.mass) + nodeB.mass * nodeB.velocityX / (nodeA.mass + nodeB.mass);
                nodeA.velocityY = nodeA.mass * nodeA.velocityY / (nodeA.mass + nodeB.mass) + nodeB.mass * nodeB.velocityX / (nodeA.mass + nodeB.mass);
                nodeB.reset(this.canvas.width, this.canvas.height);
                continue;
              }
            }
            var force = 3 * (nodeA.mass * nodeB.mass) / distanceSquared;

            var opacity = force * 100;

            if (opacity < 0.05) {
              continue;
            }

            // calculate distance
            var distance = Math.sqrt(distanceSquared);
            var direction = {
              x: xDistance / distance,
              y: yDistance / distance
            };
            this._ctx.beginPath();
            if (!this.isNightMode()) {
              this._ctx.strokeStyle = 'rgba(63,63,63,' + (opacity < 1 ? opacity : 1) + ')';
            } else {
              this._ctx.strokeStyle = 'rgba(191,191,191,' + (opacity < 1 ? opacity : 1) + ')';
            }
            this._ctx.moveTo(nodeA.x, nodeA.y);
            this._ctx.lineTo(nodeB.x, nodeB.y);
            this._ctx.stroke();

            var xAccA = force * direction.x / nodeA.mass;
            var xAccB = force * direction.x / nodeA.mass;
            var yAccA = force * direction.y / nodeB.mass;
            var yAccB = force * direction.y / nodeB.mass;

            // calculate new velocity after gravity
            nodeA.velocityX += xAccA;
            nodeA.velocityY += yAccA;

            nodeB.velocityX -= xAccB;
            nodeB.velocityY -= yAccB;
          }
        }

        //Render nodes
        this._nodes.forEach(function (node, index) {
          _this2._ctx.beginPath();
          _this2._ctx.arc(node.x, node.y, node.mass, 0, 2 * Math.PI);
          _this2._ctx.fill();
          node.update();
          if (node.isInvisible(_this2.canvas.width, _this2.canvas.height)) {
            node.reset(_this2.canvas.width, _this2.canvas.height);
          }
        });
      }
    }, {
      key: 'toggleNightMode',
      value: function toggleNightMode() {
        document.body.classList.toggle('nightmode');
        if (this.isNightMode()) {
          this._ctx.fillStyle = '#ffffff';
        } else {
          this._ctx.fillStyle = '#000000';
        }
      }
    }, {
      key: 'isNightMode',
      value: function isNightMode() {
        return document.body.classList.contains('nightmode');
      }
    }, {
      key: 'resetRandomNode',
      value: function resetRandomNode(x, y) {
        var node = this._nodes[Math.floor(Math.random() * (this._nodes.length - 1))];
        node.reset(this.canvas.width, this.canvas.height);
        node.x = x;
        node.y = y;
      }
    }]);

    return NodeGarden;
  })();

  new NodeGarden().init();
})();
