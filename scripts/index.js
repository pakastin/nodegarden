
import NodeGarden from './nodegarden'

var $container = document.getElementById('container')
var $moon = document.getElementsByClassName('moon')[0]

var nodeGarden = new NodeGarden($container)
var date = new Date()

// start simulation
nodeGarden.start()

// trigger nightMode automatically
if (date.getHours() > 18 || date.getHours() < 6) {
  switchNightMode()
}

var resetNode = -1

$container.addEventListener('click', function (e) {
  resetNode++
  if (resetNode > nodeGarden.nodes.length - 1) {
    resetNode = 0
  }
  nodeGarden.nodes[resetNode].reset({x: e.pageX, y: e.pageY})
})
$moon.addEventListener('click', switchNightMode)
window.addEventListener('resize', () => { nodeGarden.resize() })

function switchNightMode () {
  nodeGarden.nightMode = !nodeGarden.nightMode
  if (nodeGarden.nightMode) {
    document.body.classList.add('nightmode')
  } else {
    document.body.classList.remove('nightmode')
  }
}
