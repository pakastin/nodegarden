
import Node from './node'

var pixelRatio = window.devicePixelRatio

export default function NodeGarden (container) {
  this.nodes = []
  this.container = container
  this.canvas = document.createElement('canvas')
  this.ctx = this.canvas.getContext('2d')
  this.nightMode = false
  this.started = false

  if (pixelRatio !== 1) {
    // if retina screen, scale canvas
    this.canvas.style.transform = 'scale(' + 1 / pixelRatio + ')'
    this.canvas.style.transformOrigin = '0 0'
  }
  this.canvas.style.position = 'absolute'
  this.canvas.style.width = '100%'
  this.canvas.style.height = '100%'
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
  for (var i = 0, len = this.nodes.length; i < len; i++) {
    if (this.nodes[i]) {
      continue
    }
    this.nodes[i] = new Node(this)
  }
}

NodeGarden.prototype.render = function (start) {
  var distance
  var direction
  var force
  var node, nodeA, nodeB
  var i, j, len

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
  for (i = 0, len = this.nodes.length - 1; i < len; i++) {
    for (j = i + 1; j < len + 1; j++) {
      nodeA = this.nodes[i]
      nodeB = this.nodes[j]

      distance = nodeA.distanceTo(nodeB)

      if (distance.total <= nodeA.m / 2 + nodeB.m / 2) {
        // collision: remove smaller or equal - never both of them
        if (nodeA.m <= nodeB.m) {
          nodeA.collideTo(nodeB)
          continue
        }
        if (nodeB.m <= nodeA.m) {
          nodeB.collideTo(nodeA)
          continue
        }
      }

      // calculate gravity direction
      direction = {
        x: distance.x / distance.total,
        y: distance.y / distance.total
      }

      // calculate gravity force
      force = 3 * (nodeA.m * nodeB.m) / Math.pow(distance.total, 2)

      var opacity = force * 100

      if (opacity < 0.05) {
        continue
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
  if (this.nightMode) {
    this.ctx.fillStyle = '#ffffff'
  } else {
    this.ctx.fillStyle = '#000000'
  }
  // update nodes
  for (i = 0, len = this.nodes.length; i < len; i++) {
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
