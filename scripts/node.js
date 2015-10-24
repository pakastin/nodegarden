
import {defined} from './utils'

export default function Node (garden) {
  this.garden = garden
  this.reset()
}

Node.prototype.reset = function ({x, y, vx, vy, m} = {}) {
  this.x = defined(x, Math.random() * this.garden.width)
  this.y = defined(y, Math.random() * this.garden.height)
  this.vx = defined(vx, Math.random() * 1 - 0.5)
  this.vy = defined(vy, Math.random() * 1 - 0.5)
  this.m = defined(m, Math.random() * 2 + 1)
  this.pos = Math.random() >= 0.5
}

Node.prototype.addForce = function (force, direction) {
  this.vx += force * direction.x / this.m
  this.vy += force * direction.y / this.m
}

Node.prototype.distanceTo = function (node) {
  var x = node.x - this.x
  var y = node.y - this.y
  var total = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))

  return {x, y, total}
}

Node.prototype.squaredDistanceTo = function (node) {
  return (node.x - this.x) * (node.x - this.x) + (node.y - this.y) * (node.y - this.y)
}

Node.prototype.collideTo = function (node) {
  node.vx = node.m * node.vx / (this.m + node.m) + this.m * this.vx / (this.m + node.m)
  node.vy = node.m * node.vy / (this.m + node.m) + this.m * this.vy / (this.m + node.m)

  this.reset()
}
