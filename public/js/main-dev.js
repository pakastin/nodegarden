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
    this.vx = defined(vx, Math.random() * 0.5 - 0.25);
    this.vy = defined(vy, Math.random() * 0.5 - 0.25);
    this.m = defined(m, Math.random() * 2.5 + 0.5);
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

  Node.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x > this.garden.width + 50 || this.x < -50 || this.y > this.garden.height + 50 || this.y < -50) {
      // if node over screen limits - reset to a init position
      this.reset();
    }
  };

  Node.prototype.squaredDistanceTo = function (node) {
    return (node.x - this.x) * (node.x - this.x) + (node.y - this.y) * (node.y - this.y);
  };

  Node.prototype.collideTo = function (node) {
    node.vx = node.m * node.vx / (this.m + node.m) + this.m * this.vx / (this.m + node.m);
    node.vy = node.m * node.vy / (this.m + node.m) + this.m * this.vy / (this.m + node.m);

    this.reset();
  };

  Node.prototype.render = function () {
    this.garden.ctx.beginPath();
    this.garden.ctx.arc(this.x, this.y, this.getDiameter(), 0, 2 * Math.PI);
    this.garden.ctx.fill();
  };

  Node.prototype.getDiameter = function () {
    return this.m;
  };

  var pixelRatio$1 = window.devicePixelRatio;

  function NodeGarden(container) {
    this.nodes = [];
    this.container = container;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.started = false;
    this.nightmode = false;

    window.addEventListener('mousedown', function (e) {
      mouseNode.m = 15;
    });

    window.addEventListener('mouseup', function (e) {
      mouseNode.m = 0;
    });

    if (pixelRatio$1 !== 1) {
      // if retina screen, scale canvas
      this.canvas.style.transform = 'scale(' + 1 / pixelRatio$1 + ')';
      this.canvas.style.transformOrigin = '0 0';
    }
    this.canvas.id = 'nodegarden';

    // Add mouse node
    var mouseNode = new Node(this);
    mouseNode.m = 0;

    mouseNode.update = function () {};
    mouseNode.reset = function () {};
    mouseNode.render = function () {};
    // Move coordinates to unreachable zone
    mouseNode.x = Number.MAX_SAFE_INTEGER;
    mouseNode.y = Number.MAX_SAFE_INTEGER;

    document.addEventListener('mousemove', function (e) {
      mouseNode.x = e.pageX * pixelRatio$1;
      mouseNode.y = e.pageY * pixelRatio$1;
    });

    document.documentElement.addEventListener('mouseleave', function (e) {
      mouseNode.x = Number.MAX_SAFE_INTEGER;
      mouseNode.y = Number.MAX_SAFE_INTEGER;
    });

    this.nodes.unshift(mouseNode);

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
    this.width = window.innerWidth * pixelRatio$1;
    this.height = window.innerHeight * pixelRatio$1;
    this.area = this.width * this.height;

    // calculate nodes needed
    this.nodes.length = Math.sqrt(this.area) / 25 | 0;

    // set canvas size
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    if (this.nightMode) {
      this.ctx.fillStyle = '#ffffff';
    } else {
      this.ctx.fillStyle = '#000000';
    }

    // create nodes
    for (var i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i]) {
        continue;
      }
      this.nodes[i] = new Node(this);
    }
  };

  NodeGarden.prototype.toggleNightMode = function () {
    this.nightMode = !this.nightMode;
    if (this.nightMode) {
      this.ctx.fillStyle = '#ffffff';
      document.body.classList.add('nightmode');
    } else {
      this.ctx.fillStyle = '#000000';
      document.body.classList.remove('nightmode');
    }
  };

  NodeGarden.prototype.render = function (start) {
    var _this = this;

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
    var nodeA, nodeB;
    for (var i = 0; i < this.nodes.length - 1; i++) {
      nodeA = this.nodes[i];
      for (var j = i + 1; j < this.nodes.length; j++) {
        nodeB = this.nodes[j];
        var squaredDistance = nodeA.squaredDistanceTo(nodeB);

        // calculate gravity force
        var force = 3 * (nodeA.m * nodeB.m) / squaredDistance;

        var opacity = force * 100;

        if (opacity < 0.025) {
          continue;
        }

        if (squaredDistance <= (nodeA.m / 2 + nodeB.m / 2) * (nodeA.m / 2 + nodeB.m / 2)) {
          // collision: remove smaller or equal - never both of them
          if (nodeA.m <= nodeB.m) {
            nodeA.collideTo(nodeB);
          } else {
            nodeB.collideTo(nodeA);
          }
          continue;
        }

        var distance = nodeA.distanceTo(nodeB);

        // calculate gravity direction
        var direction = {
          x: distance.x / distance.total,
          y: distance.y / distance.total
        };

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
    // render and update nodes
    for (i = 0; i < this.nodes.length; i++) {
      this.nodes[i].render();
      this.nodes[i].update();
    }
  };

  var pixelRatio = window.devicePixelRatio;
  var $container = document.getElementById('container');
  var $moon = document.getElementsByClassName('moon')[0];

  var nodeGarden = new NodeGarden($container);

  // start simulation
  nodeGarden.start();

  // trigger nightMode automatically
  var date = new Date();
  if (date.getHours() > 18 || date.getHours() < 6) {
    nodeGarden.toggleNightMode();
  }

  var resetNode = 0;

  $container.addEventListener('click', function (e) {
    resetNode++;
    if (resetNode > nodeGarden.nodes.length - 1) {
      resetNode = 1;
    }
    nodeGarden.nodes[resetNode].reset({ x: e.pageX * pixelRatio, y: e.pageY * pixelRatio, vx: 0, vy: 0 });
  });

  $moon.addEventListener('click', function () {
    nodeGarden.toggleNightMode();
  });
  window.addEventListener('resize', function () {
    nodeGarden.resize();
  });
})();
