
import {defined} from './utils'

export default function Node (garden) {
  this.garden = garden
  this.reset()
}

Node.prototype.reset = function ({x, y, vx, vy, m} = {}) {
  this.x = defined(x, Math.random() * this.garden.width)
  this.y = defined(y, Math.random() * this.garden.height)
  this.vx = defined(vx, Math.random() * 0.5 - 0.25)
  this.vy = defined(vy, Math.random() * 0.5 - 0.25)
  this.m = defined(m, Math.random() * 2.5 + 0.5)
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

Node.prototype.update = function () {
  this.x += this.vx
  this.y += this.vy

  if (this.x > this.garden.width + 50 || this.x < -50 || this.y > this.garden.height + 50 || this.y < -50) {
    // if node over screen limits - reset to a init position
    this.reset()
  }
}

Node.prototype.squaredDistanceTo = function (node) {
  return (node.x - this.x) * (node.x - this.x) + (node.y - this.y) * (node.y - this.y)
}

Node.prototype.collideTo = function (node) {
  node.vx = node.m * node.vx / (this.m + node.m) + this.m * this.vx / (this.m + node.m)
  node.vy = node.m * node.vy / (this.m + node.m) + this.m * this.vy / (this.m + node.m)

  this.reset()
}

Node.prototype.render = function () {
  this.garden.ctx.beginPath()
  this.garden.ctx.arc(this.x, this.y, this.getDiameter(), 0, 2 * Math.PI)
  this.garden.ctx.fill()
}

Node.prototype.getDiameter = function () {
  return this.m
}
