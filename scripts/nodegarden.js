
import Node from './node'

var pixelRatio = window.devicePixelRatio

export default function NodeGarden (container) {
  this.nodes = []
  this.container = container
  this.canvas = document.createElement('canvas')
  this.ctx = this.canvas.getContext('2d')
  this.ctx.fillStyle = '#000000'
  this.started = false

  if (pixelRatio !== 1) {
    // if retina screen, scale canvas
    this.canvas.style.transform = 'scale(' + 1 / pixelRatio + ')'
    this.canvas.style.transformOrigin = '0 0'
  }
  this.canvas.id = 'nodegarden'
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

  // create nodes
  for (var i = 0; i < this.nodes.length; i++) {
    if (this.nodes[i]) {
      continue
    }
    this.nodes[i] = new Node(this)
  }
}

NodeGarden.prototype.isNightMode = function () {
  return document.body.classList.contains('nightmode')
}

NodeGarden.prototype.toggleNightMode = function () {
  document.body.classList.toggle('nightmode')
  if (this.isNightMode()) {
    this.ctx.fillStyle = '#ffffff'
  } else {
    this.ctx.fillStyle = '#000000'
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
  var node, nodeA, nodeB
  for (let i = 0; i < this.nodes.length - 1; i++) {
    nodeA = this.nodes[i]
    for (let j = i + 1; j < this.nodes.length; j++) {
      nodeB = this.nodes[j]
      let squaredDistance = nodeA.squaredDistanceTo(nodeB)

      // calculate gravity force
      let force = 3 * (nodeA.m * nodeB.m) / squaredDistance

      let opacity = force * 100

      if (opacity < 0.05) {
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

      let distance = nodeA.distanceTo(nodeB)

      // calculate gravity direction
      let direction = {
        x: distance.x / distance.total,
        y: distance.y / distance.total
      }

      var charge = nodeA.pos === nodeB.pos ? -1 : 1

      // draw gravity lines
      this.ctx.beginPath()
      if (charge === 1) {
        this.ctx.strokeStyle = 'rgba(191,63,31,' + (opacity < 1 ? opacity : 1) + ')'
      } else {
        this.ctx.strokeStyle = 'rgba(31,63,191,' + (opacity < 1 ? opacity : 1) + ')'
      }
      this.ctx.moveTo(nodeA.x, nodeA.y)
      this.ctx.lineTo(nodeB.x, nodeB.y)
      this.ctx.stroke()

      nodeA.addForce(charge * force, direction)
      nodeB.addForce(charge * -force, direction)
    }
  }
  // update nodes
  for (let i = 0; i < this.nodes.length; i++) {
    node = this.nodes[i]
    this.ctx.beginPath()
    this.ctx.arc(node.x, node.y, node.m, 0, 2 * Math.PI)
    this.ctx.fill()

    node.x += node.vx
    node.y += node.vy

    if (node.x > this.width + 25 || node.x < -25 || node.y > this.height + 25 || node.y < -25) {
      // if node over screen limits - reset to a init position
      node.reset()
    }
  }
}
