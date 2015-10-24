import Node from './node'
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

$container.addEventListener('click', function (e) {
  let node = new Node(nodeGarden)
  let angle = Math.random()*2*Math.PI
  node.reset({x: e.pageX + 100*Math.cos(angle), y: e.pageY + 100*Math.sin(angle)})
  nodeGarden.nodes.push(node)
})

$moon.addEventListener('click', () => { nodeGarden.toggleNightMode() })
window.addEventListener('resize', () => { nodeGarden.resize() })
