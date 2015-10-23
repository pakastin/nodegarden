'use strict';

(function () {
  'use strict';

  function defined(a, b) {
    return a != null ? a : b;
  }

  function Node(garden) {
    this.garden = garden;
    this.reset();
  }

  Node.prototype.reset = function () {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var x = _ref.x;
    var y = _ref.y;
    var vx = _ref.vx;
    var vy = _ref.vy;
    var m = _ref.m;

    this.x = defined(x, Math.random() * this.garden.width);
    this.y = defined(y, Math.random() * this.garden.height);
    this.vx = defined(vx, Math.random() * 1 - 0.5);
    this.vy = defined(vy, Math.random() * 1 - 0.5);
    this.m = defined(m, Math.random() * 2 + 1);
  };

  Node.prototype.addForce = function (force, direction) {
    this.vx += force * direction.x / this.m;
    this.vy += force * direction.y / this.m;
  };

  Node.prototype.distanceTo = function (node) {
    var x = node.x - this.x;
    var y = node.y - this.y;
    var total = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

    return { x: x, y: y, total: total };
  };

  Node.prototype.collideTo = function (node) {
    node.vx = node.m * node.vx / (this.m + node.m) + this.m * this.vx / (this.m + node.m);
    node.vy = node.m * node.vy / (this.m + node.m) + this.m * this.vy / (this.m + node.m);

    this.reset();
  };

  var pixelRatio = window.devicePixelRatio;

  function NodeGarden(container) {
    this.nodes = [];
    this.container = container;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.nightMode = false;
    this.started = false;

    if (pixelRatio !== 1) {
      // if retina screen, scale canvas
      this.canvas.style.transform = 'scale(' + 1 / pixelRatio + ')';
      this.canvas.style.transformOrigin = '0 0';
    }
    this.canvas.style.position = 'absolute';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.id = 'nodegarden';
    this.resize();
    this.container.appendChild(this.canvas);
  }

  NodeGarden.prototype.start = function () {
    if (!this.playing) {
      this.playing = true;
      this.render(true);
    }
  };

  NodeGarden.prototype.stop = function () {
    if (this.playing) {
      this.playing = false;
    }
  };

  NodeGarden.prototype.resize = function () {
    this.width = window.innerWidth * pixelRatio;
    this.height = window.innerHeight * pixelRatio;
    this.area = this.width * this.height;

    // calculate nodes needed
    this.nodes.length = Math.sqrt(this.area) / 25 | 0;

    // set canvas size
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // create nodes
    for (var i = 0, len = this.nodes.length; i < len; i++) {
      if (this.nodes[i]) {
        continue;
      }
      this.nodes[i] = new Node(this);
    }
  };

  NodeGarden.prototype.render = function (start) {
    var _this = this;

    var distance;
    var direction;
    var force;
    var node, nodeA, nodeB;
    var i, j, len;

    if (!this.playing) {
      return;
    }

    if (start) {
      requestAnimationFrame(function () {
        _this.render(true);
      });
    }

    // clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);

    // update links
    for (i = 0, len = this.nodes.length - 1; i < len; i++) {
      for (j = i + 1; j < len + 1; j++) {
        nodeA = this.nodes[i];
        nodeB = this.nodes[j];

        distance = nodeA.distanceTo(nodeB);

        if (distance.total <= nodeA.m / 2 + nodeB.m / 2) {
          // collision: remove smaller or equal - never both of them
          if (nodeA.m <= nodeB.m) {
            nodeA.collideTo(nodeB);
            continue;
          }
          if (nodeB.m <= nodeA.m) {
            nodeB.collideTo(nodeA);
            continue;
          }
        }

        // calculate gravity direction
        direction = {
          x: distance.x / distance.total,
          y: distance.y / distance.total
        };

        // calculate gravity force
        force = 3 * (nodeA.m * nodeB.m) / Math.pow(distance.total, 2);

        var opacity = force * 100;

        if (opacity < 0.05) {
          continue;
        }

        // draw gravity lines
        this.ctx.beginPath();
        if (this.nightMode) {
          this.ctx.strokeStyle = 'rgba(191,191,191,' + (opacity < 1 ? opacity : 1) + ')';
        } else {
          this.ctx.strokeStyle = 'rgba(63,63,63,' + (opacity < 1 ? opacity : 1) + ')';
        }
        this.ctx.moveTo(nodeA.x, nodeA.y);
        this.ctx.lineTo(nodeB.x, nodeB.y);
        this.ctx.stroke();

        nodeA.addForce(force, direction);
        nodeB.addForce(-force, direction);
      }
    }
    if (this.nightMode) {
      this.ctx.fillStyle = '#ffffff';
    } else {
      this.ctx.fillStyle = '#000000';
    }
    // update nodes
    for (i = 0, len = this.nodes.length; i < len; i++) {
      node = this.nodes[i];
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, node.m, 0, 2 * Math.PI);
      this.ctx.fill();

      node.x += node.vx;
      node.y += node.vy;

      if (node.x > this.width + 25 || node.x < -25 || node.y > this.height + 25 || node.y < -25) {
        // if node over screen limits - reset to a init position
        node.reset();
      }
    }
  };

  var $container = document.getElementById('container');
  var $moon = document.getElementsByClassName('moon')[0];

  var nodeGarden = new NodeGarden($container);
  var date = new Date();

  // start simulation
  nodeGarden.start();

  // trigger nightMode automatically
  if (date.getHours() > 18 || date.getHours() < 6) {
    switchNightMode();
  }

  var resetNode = -1;

  $container.addEventListener('click', function (e) {
    resetNode++;
    if (resetNode > nodeGarden.nodes.length - 1) {
      resetNode = 0;
    }
    nodeGarden.nodes[resetNode].reset({ x: e.pageX, y: e.pageY, vx: 0, vy: 0 });
  });
  $moon.addEventListener('click', switchNightMode);
  window.addEventListener('resize', function () {
    nodeGarden.resize();
  });

  function switchNightMode() {
    nodeGarden.nightMode = !nodeGarden.nightMode;
    if (nodeGarden.nightMode) {
      document.body.classList.add('nightmode');
    } else {
      document.body.classList.remove('nightmode');
    }
  }
})();
