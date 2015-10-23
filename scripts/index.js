class Node {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.velocityX = 0;
    this.velocityY = 0;
    this.mass = 0; //diameter as well
  }

  update() {
    this.x += this.velocityX;
    this.y += this.velocityY;
  }

  reset(width, height) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.velocityX = Math.random() * 1 - 0.5;
    this.velocityY = Math.random() * 1 - 0.5;
    this.mass = Math.random() * 2 + 1;
  }

  isInvisible(width, height) {
    return this.x > width + 25 || this.x < -25 || this.y > width + 25 || this.y < -25;
  }
}

class NodeGarden {
  init() {
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
    document.getElementsByClassName('moon')[0].addEventListener('click',(e)=>{
      console.log("da");
      e.stopPropagation();
      console.log("dud");
      this.toggleNightMode();
    });

    this._ctx = this.canvas.getContext('2d');
    this._ctx.fillStyle = '#ffffff';
    this._nodes = [];
    this.resize();

    window.addEventListener('resize', () => {this.resize();});

    window.addEventListener('click', (e) => {
      e.stopPropagation();
      this.resetRandomNode(e.pageX, e.pageY);
    });
    //Init rendering
    this.render();
  }

  resize() {
    this.canvas.width = window.innerWidth * window.devicePixelRatio;
    this.canvas.height = window.innerHeight * window.devicePixelRatio;
    this._nodes.length = Math.sqrt(this.canvas.width * this.canvas.height) / 25 | 0;
    //Fill if empty space
    for(let i=0;i<this._nodes.length;i++) {
      if(this._nodes[i]) {
        continue;
      }
      let node = new Node();
      node.reset(this.canvas.width, this.canvas.height);
      this._nodes[i] = node;
    }
    this.toggleNightMode();
    this.toggleNightMode();
  }

  render() {
    //requestAnimationFrame(()=>{setTimeout(()=>{this.render();},50);});
    requestAnimationFrame(()=>{this.render();});
    //Clear canvas

    this._ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    //Update links
    for (var i = 0; i < this._nodes.length-1; i++) {
      var nodeA = this._nodes[i];
      for (var j = i + 1; j < this._nodes.length; j++) {
        var nodeB = this._nodes[j];
        var xDistance = nodeB.x - nodeA.x;
        var yDistance = nodeB.y - nodeA.y;

        var distanceSquared = xDistance*xDistance + yDistance*yDistance;

        //Increase with force increase
        if (distanceSquared > 20000) {
          continue;
        }

        if (distanceSquared < (nodeA.mass / 2 + nodeB.mass / 2)*(nodeA.mass / 2 + nodeB.mass / 2)) {
          // collision: remove smaller or equal - never both of them
          if (nodeA.mass <= nodeB.mass) {
            nodeA.reset(this.canvas.width,this.canvas.height);
            continue;
          } else {
            nodeB.reset(this.canvas.width,this.canvas.height);
            continue;
          }
        }
        var force = 3 * (nodeA.mass * nodeB.mass) / distanceSquared;

        var opacity = force * 100;

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
    this._nodes.forEach((node,index)=>{
      this._ctx.beginPath();
      this._ctx.arc(node.x, node.y, node.mass, 0, 2 * Math.PI);
      this._ctx.fill();
      node.update();
      if (node.isInvisible(this.canvas.width, this.canvas.height)) {
        node.reset(this.canvas.width, this.canvas.height);
      }
    });
  }

  toggleNightMode() {
    document.body.classList.toggle('nightmode');
    if (this.isNightMode()) {
      this._ctx.fillStyle = '#ffffff';
    } else {
      this._ctx.fillStyle = '#000000';
    }
  }

  isNightMode() {
    return document.body.classList.contains('nightmode');
  }

  resetRandomNode(x, y) {
    let node = this._nodes[Math.floor(Math.random() * (this._nodes.length - 1))];
    node.reset(this.canvas.width, this.canvas.height);
    //node.x = x;
    //node.y = y;
  }
}

new NodeGarden().init();
