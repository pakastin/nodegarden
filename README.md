# HTML5 Node Garden

https://nodegarden.js.org

## Description

Really simple node garden made with HTML5. No Barnes-Hut n-body optimization, just simple physics. I used to do these back in the Flash times, when I worked as a Flash developer. [BIT-101](https://github.com/bit101) released [a great article](http://www.bit-101.com/tutorials/nodes.doc) back then, which got me inspired.

- Click to add nodes
- Drag to make mouse a "black hole"

## Rules

- Circles represent nodes
- Node's mass is proportional to it's size
- Lines visualize the gravitational force between nodes
- Line opacity equals to the strength of force
- When two nodes collide, smaller one will reset to a new location and size
- When node travels over screen limits it will reset to a new location and size

## Alternate version

Electrons & positrons instead of "planets":

https://nodegarden.js.org/electrons.html

- red lines visualize attraction force
- blue lines visualize repel force

## Also check out

My other projects:

- [HTML5 Deck of Cards](https://deck-of-cards.js.org)
- [FRZR](https://frzr.js.org) view library

## Development

Download/clone and then:

```
npm install
npm start
```

Starts listening file changes and builds automagically to ```/public``` folder

## License
MIT
