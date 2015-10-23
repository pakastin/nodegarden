
var pixelRatio = window.devicePixelRatio
var wWidth
var wHeight
var wArea

var nodes = new Array(Math.sqrt(wArea) / 10 | 0)

var canvas = document.createElement('canvas')
var ctx = canvas.getContext('2d')

var $container = document.getElementById('container')
var $moon = document.getElementsByClassName('moon')[0]

var nightMode = false

if (pixelRatio !== 1) {
  // if retina screen, scale canvas
  canvas.style.transform = 'scale(' + 1 / pixelRatio + ')'
  canvas.style.transformOrigin = '0 0'
}
canvas.id = 'nodegarden'

$container.appendChild(canvas)

init()
render()

window.addEventListener('resize', init)
window.addEventListener('click', resetRandom)
$moon.addEventListener('click', switchNightmode)

function init () {
  wWidth = window.innerWidth * pixelRatio
  wHeight = window.innerHeight * pixelRatio
  wArea = wWidth * wHeight

  // calculate nodes needed
  nodes.length = Math.sqrt(wArea) / 25 | 0

  // set canvas size
  canvas.width = wWidth
  canvas.height = wHeight

  // create nodes
  var i, len
  for (i = 0, len = nodes.length; i < len; i++) {
    if (nodes[i]) {
      continue
    }
    nodes[i] = {
      x: Math.random() * wWidth,
      y: Math.random() * wHeight,
      vx: Math.random() * 1 - 0.5,
      vy: Math.random() * 1 - 0.5,
      m: Math.random() * 1.5 + 1,
      pos: Math.random() >= 0.5
    }
  }
}

function resetRandom (e) {
  var target = {
    x: e.pageX,
    y: e.pageY
  }
  var node = nodes[Math.floor(Math.random() * (nodes.length - 1))]
  node.x = target.x
  node.y = target.y
  node.vx = 0
  node.vy = 0
  node.m = Math.random() * 1.5 + 1
}

function render () {
  var distance
  var direction
  var force
  var xDistance, yDistance
  var i, j, nodeA, nodeB, len

  // request new animationFrame
  requestAnimationFrame(render)

  // clear canvas
  ctx.clearRect(0, 0, wWidth, wHeight)

  // update links
  for (i = 0, len = nodes.length - 1; i < len; i++) {
    for (j = i + 1; j < len + 1; j++) {
      nodeA = nodes[i]
      nodeB = nodes[j]
      xDistance = nodeB.x - nodeA.x
      yDistance = nodeB.y - nodeA.y

      // calculate distance
      distance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2))

      if (distance < nodeA.m / 2 + nodeB.m / 2) {
        // collision: remove smaller or equal - never both of them
        if (nodeA.m <= nodeB.m) {
          nodeA.x = Math.random() * wWidth
          nodeA.y = Math.random() * wHeight
          nodeA.vx = Math.random() * 1 - 0.5
          nodeA.vy = Math.random() * 1 - 0.5
          nodeA.m = Math.random() * 1.5 + 1
          continue
        }

        if (nodeB.m <= nodeA.m) {
          nodeB.x = Math.random() * wWidth
          nodeB.y = Math.random() * wHeight
          nodeB.vx = Math.random() * 1 - 0.5
          nodeB.vy = Math.random() * 1 - 0.5
          nodeB.m = Math.random() * 1.5 + 1
          continue
        }
      }

      // calculate gravity direction
      direction = {
        x: xDistance / distance,
        y: yDistance / distance
      }

      // calculate gravity force
      force = 2 * (nodeA.m * nodeB.m) / Math.pow(distance, 2)

      var opacity = force * 200

      if (opacity < 0.05) {
        continue
      }

      var charge = nodeA.pos === nodeB.pos ? -1 : 1

      // draw gravity lines
      ctx.beginPath()
      if (charge === 1) {
        ctx.strokeStyle = 'rgba(191,63,31,' + (opacity < 1 ? opacity : 1) + ')'
      } else {
        ctx.strokeStyle = 'rgba(31,63,191,' + (opacity < 1 ? opacity : 1) + ')'
      }
      ctx.moveTo(nodeA.x, nodeA.y)
      ctx.lineTo(nodeB.x, nodeB.y)
      ctx.stroke()

      var xAccA = force * direction.x / nodeA.m
      var xAccB = force * direction.x / nodeA.m
      var yAccA = force * direction.y / nodeB.m
      var yAccB = force * direction.y / nodeB.m

      // calculate new velocity after gravity
      nodeA.vx += charge * xAccA
      nodeA.vy += charge * yAccA

      nodeB.vx -= charge * xAccB
      nodeB.vy -= charge * yAccB
    }
  }
  if (nightMode) {
    ctx.fillStyle = '#ffffff'
  } else {
    ctx.fillStyle = '#000000'
  }
  // update nodes
  for (i = 0, len = nodes.length; i < len; i++) {
    ctx.beginPath()
    ctx.arc(nodes[i].x, nodes[i].y, nodes[i].m, 0, 2 * Math.PI)
    ctx.fill()

    nodes[i].x += nodes[i].vx
    nodes[i].y += nodes[i].vy

    if (nodes[i].x > wWidth + 25 || nodes[i].x < -25 || nodes[i].y > wHeight + 25 || nodes[i].y < -25) {
      // if node over screen limits - reset to a init position
      nodes[i].x = Math.random() * wWidth
      nodes[i].y = Math.random() * wHeight
      nodes[i].vx = Math.random() * 1 - 0.5
      nodes[i].vy = Math.random() * 1 - 0.5
    }
  }
}

function switchNightmode (e) {
  e.stopPropagation()

  nightMode = !nightMode
  if (nightMode) {
    document.body.classList.add('nightmode')
  } else {
    document.body.classList.remove('nightmode')
  }
}
