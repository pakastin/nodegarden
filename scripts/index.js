
var wWidth = window.innerWidth
var wHeight = window.innerHeight
var wArea = wWidth * wHeight

var nodes = new Array(Math.sqrt(wArea) / 10 | 0)

var canvas = document.createElement('canvas')
var ctx = canvas.getContext('2d')

var $container = document.getElementById('container')

canvas.width = wWidth
canvas.height = wHeight
canvas.id = 'nodegarden'

document.body.insertBefore(canvas, $container)

init()
render()

window.addEventListener('resize', function () {
  wWidth = window.innerWidth
  wHeight = window.innerHeight
  wArea = wWidth * wHeight
  nodes.length = Math.sqrt(wArea) / 25 | 0
  init()
})

function init () {
  var i, len
  for (i = 0, len = nodes.length; i < len; i++) {
    if (nodes[i]) {
      continue
    }
    nodes[i] = {
      x: Math.random() * wWidth,
      y: Math.random() * wHeight,
      vx: Math.random() * 3 - 1.5,
      vy: Math.random() * 3 - 1.5,
      m: Math.random() * 1.5 + 1,
      link: null,
      pos: false
    }
  }
}

function render () {
  requestAnimationFrame(render)
  var distance
  var direction
  var force
  var xForce, yForce
  var xDistance, yDistance
  var i, j, nodeA, nodeB, len

  // clear canvas
  canvas.width = wWidth
  canvas.height = wHeight

  // update links
  for (i = 0, len = nodes.length - 1; i < len; i++) {
    for (j = i + 1; j < len + 1; j++) {
      nodeA = nodes[i]
      nodeB = nodes[j]
      xDistance = nodeB.x - nodeA.x
      yDistance = nodeB.y - nodeA.y

      distance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2))

      if (distance < Math.max(nodeA.m, nodeB.m)) {
        if (nodeA.m <= nodeB.m) {
          nodeA.x = Math.random() * wWidth
          nodeA.y = Math.random() * wHeight
          nodeA.vx = Math.random() * 2 - 1
          nodeA.vy = Math.random() * 2 - 1
        }

        if (nodeB.m <= nodeA.m) {
          nodeB.x = Math.random() * wWidth
          nodeB.y = Math.random() * wHeight
          nodeB.vx = Math.random() * 2 - 1
          nodeB.vy = Math.random() * 2 - 1
        }
        continue
      }

      if (distance > 200) {
        continue
      }

      direction = {
        x: xDistance / distance,
        y: yDistance / distance
      }

      force = (10 * nodeA.m * nodeB.m) / Math.pow(distance, 2)

      if (force > 0.025) {
        force = 0.025
      }

      ctx.beginPath()
      ctx.strokeStyle = 'rgba(63,63,63,' + force * 40 + ')'
      ctx.moveTo(nodeA.x, nodeA.y)
      ctx.lineTo(nodeB.x, nodeB.y)
      ctx.stroke()

      xForce = force * direction.x
      yForce = force * direction.y

      if (nodeA.pos !== nodeB.pos) {
        nodeA.vx -= xForce
        nodeA.vy -= yForce

        nodeB.vx += xForce
        nodeB.vy += yForce
      } else {
        nodeA.vx += xForce
        nodeA.vy += yForce

        nodeB.vx -= xForce
        nodeB.vy -= yForce
      }
    }
  }
  // update nodes
  for (i = 0, len = nodes.length; i < len; i++) {
    ctx.beginPath()
    ctx.arc(nodes[i].x, nodes[i].y, nodes[i].m, 0, 2 * Math.PI)
    ctx.fill()

    nodes[i].x += nodes[i].vx
    nodes[i].y += nodes[i].vy

    if (nodes[i].x > wWidth + 25 || nodes[i].x < -25 || nodes[i].y > wHeight + 25 || nodes[i].y < -25) {
      nodes[i].x = Math.random() * wWidth
      nodes[i].y = Math.random() * wHeight
      nodes[i].vx = Math.random() * 2 - 1
      nodes[i].vy = Math.random() * 2 - 1
    }
  }
}
