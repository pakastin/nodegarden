
import NodeGarden from './nodegarden';

const pixelRatio = window.devicePixelRatio;
const $container = document.getElementById('container');
const $moon = document.getElementsByClassName('moon')[0];

const nodeGarden = new NodeGarden($container);

// start simulation
nodeGarden.start();

// trigger nightMode automatically
const date = new Date();

if (date.getHours() > 18 || date.getHours() < 6) {
  nodeGarden.toggleNightMode();
}

let resetNode = 0;

$container.addEventListener('click', (e) => {
  const bcr = $container.getBoundingClientRect();
  const scrollPos = {
    x: window.scrollX,
    y: window.scrollY
  };
  resetNode++;
  if (resetNode > nodeGarden.nodes.length - 1) {
    resetNode = 1;
  }
  nodeGarden.nodes[resetNode].reset({
    x: (e.pageX - scrollPos.x - bcr.left) * pixelRatio,
    y: (e.pageY - scrollPos.y - bcr.top) * pixelRatio,
    vx: 0,
    vy: 0
  });
});

$moon.addEventListener('click', () => {
  nodeGarden.toggleNightMode();
});

window.addEventListener('resize', () => {
  nodeGarden.resize();
});
