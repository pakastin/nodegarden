
import Node from './node'

var pixelRatio = window.devicePixelRatio

export default function NodeGarden (container) {
  this.nodes = []
  this.container = container
  this.canvas = document.createElement('canvas')
  this.ctx = this.canvas.getContext('2d')
  this.started = false
  this.nightmode = false

  window.addEventListener('mousedown', (e) => {
    mouseNode.m = 15
  })

  window.addEventListener('mouseup', (e) => {
    mouseNode.m = 0
  })

  if (pixelRatio !== 1) {
    // if retina screen, scale canvas
    this.canvas.style.transform = 'scale(' + 1 / pixelRatio + ')'
    this.canvas.style.transformOrigin = '0 0'
  }
  this.canvas.id = 'nodegarden'

  // Add mouse node
  var mouseNode = new Node(this)
  mouseNode.m = 0

  mouseNode.update = function () {}
  mouseNode.reset = function () {}
  mouseNode.render = function () {}
  // Move coordinates to unreachable zone
  mouseNode.x = Number.MAX_SAFE_INTEGER
  mouseNode.y = Number.MAX_SAFE_INTEGER

  document.addEventListener('mousemove', (e) => {
    mouseNode.x = e.pageX
    mouseNode.y = e.pageY
  })

  document.documentElement.addEventListener('mouseleave', (e) => {
    mouseNode.x = Number.MAX_SAFE_INTEGER
    mouseNode.y = Number.MAX_SAFE_INTEGER
  })

  this.nodes.unshift(mouseNode)

  this.resize()
  this.container.appendChild(this.canvas)
}

NodeGarden.prototype.start = function () {
  if (!this.playing) {
    this.playing = true
    this.render(true)
  }
}

NodeGarden.prototype.stop = function () {
  if (this.playing) {
    this.playing = false
  }
}

NodeGarden.prototype.resize = function () {
  this.width = window.innerWidth * pixelRatio
  this.height = window.innerHeight * pixelRatio
  this.area = this.width * this.height

  // calculate nodes needed
  this.nodes.length = Math.sqrt(this.area) / 25 | 0

  // set canvas size
  this.canvas.width = this.width
  this.canvas.height = this.height

  if (this.nightMode) {
    this.ctx.fillStyle = '#ffffff'
  } else {
    this.ctx.fillStyle = '#000000'
  }

  // create nodes
  for (var i = 0; i < this.nodes.length; i++) {
    if (this.nodes[i]) {
      continue
    }
    this.nodes[i] = new Node(this)
  }
}

NodeGarden.prototype.toggleNightMode = function () {
  this.nightMode = !this.nightMode
  if (this.nightMode) {
    this.ctx.fillStyle = '#ffffff'
    document.body.classList.add('nightmode')
  } else {
    this.ctx.fillStyle = '#000000'
    document.body.classList.remove('nightmode')
  }
}

NodeGarden.prototype.render = function (start) {
  if (!this.playing) {
    return
  }

  if (start) {
    requestAnimationFrame(() => {
      this.render(true)
    })
  }

  // clear canvas
  this.ctx.clearRect(0, 0, this.width, this.height)

  // update links
  var nodeA, nodeB
  for (var i = 0; i < this.nodes.length - 1; i++) {
    nodeA = this.nodes[i]
    for (var j = i + 1; j < this.nodes.length; j++) {
      nodeB = this.nodes[j]
      var squaredDistance = nodeA.squaredDistanceTo(nodeB)

      // calculate gravity force
      var force = 3 * (nodeA.m * nodeB.m) / squaredDistance

      var opacity = force * 100

      if (opacity < 0.025) {
        continue
      }

      if (squaredDistance <= (nodeA.m / 2 + nodeB.m / 2) * (nodeA.m / 2 + nodeB.m / 2)) {
        // collision: remove smaller or equal - never both of them
        if (nodeA.m <= nodeB.m) {
          nodeA.collideTo(nodeB)
        } else {
          nodeB.collideTo(nodeA)
        }
        continue
      }

      var distance = nodeA.distanceTo(nodeB)

      // calculate gravity direction
      var direction = {
        x: distance.x / distance.total,
        y: distance.y / distance.total
      }

      // draw gravity lines
      this.ctx.beginPath()
      if (this.nightMode) {
        this.ctx.strokeStyle = 'rgba(191,191,191,' + (opacity < 1 ? opacity : 1) + ')'
      } else {
        this.ctx.strokeStyle = 'rgba(63,63,63,' + (opacity < 1 ? opacity : 1) + ')'
      }
      this.ctx.moveTo(nodeA.x, nodeA.y)
      this.ctx.lineTo(nodeB.x, nodeB.y)
      this.ctx.stroke()

      nodeA.addForce(force, direction)
      nodeB.addForce(-force, direction)
    }
  }
  // render and update nodes
  for (i = 0; i < this.nodes.length; i++) {
    this.nodes[i].render()
    this.nodes[i].update()
  }
}
