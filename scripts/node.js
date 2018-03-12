
import {defined} from './utils';

const targetFPS = 1000 / 60;

export default class Node {
  constructor (garden) {
    this.garden = garden;
    this.reset();
  }

  reset ({x, y, vx, vy, m} = {}) {
    this.x = defined(x, Math.random() * this.garden.width);
    this.y = defined(y, Math.random() * this.garden.height);
    this.vx = defined(vx, Math.random() * 0.5 - 0.25);
    this.vy = defined(vy, Math.random() * 0.5 - 0.25);
    this.m = defined(m, Math.random() * 2.5 + 0.5);
  }

  addForce (force, direction) {
    this.vx += force * direction.x / this.m;
    this.vy += force * direction.y / this.m;
  }

  distanceTo (node) {
    const x = node.x - this.x;
    const y = node.y - this.y;
    const total = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

    return { x, y, total };
  }

  update (deltaTime) {
    this.x += this.vx * deltaTime / targetFPS;
    this.y += this.vy * deltaTime / targetFPS;

    if (this.x > this.garden.width + 50 || this.x < -50 || this.y > this.garden.height + 50 || this.y < -50) {
      // if node over screen limits - reset to a init position
      this.reset();
    }
  }

  squaredDistanceTo (node) {
    return (node.x - this.x) * (node.x - this.x) + (node.y - this.y) * (node.y - this.y);
  }

  collideTo (node) {
    node.vx = node.m * node.vx / (this.m + node.m) + this.m * this.vx / (this.m + node.m);
    node.vy = node.m * node.vy / (this.m + node.m) + this.m * this.vy / (this.m + node.m);

    this.reset();
  }

  render () {
    this.garden.ctx.beginPath();
    this.garden.ctx.arc(this.x, this.y, this.getDiameter(), 0, 2 * Math.PI);
    this.garden.ctx.fill();
  }

  getDiameter () {
    return this.m;
  }
}
