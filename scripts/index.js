
import NodeGarden from './nodegarden'

var pixelRatio = window.devicePixelRatio
var $container = document.getElementById('container')
var $moon = document.getElementsByClassName('moon')[0]

var nodeGarden = new NodeGarden($container)

// start simulation
nodeGarden.start()

// trigger nightMode automatically
var date = new Date()
if (date.getHours() > 18 || date.getHours() < 6) {
  nodeGarden.toggleNightMode()
}

var resetNode = 0

$container.addEventListener('click', function (e) {
  resetNode++
  if (resetNode > nodeGarden.nodes.length - 1) {
    resetNode = 1
  }
  nodeGarden.nodes[resetNode].reset({x: e.pageX * pixelRatio, y: e.pageY * pixelRatio, vx: 0, vy: 0})
})

$moon.addEventListener('click', () => { nodeGarden.toggleNightMode() })
window.addEventListener('resize', () => { nodeGarden.resize() })
