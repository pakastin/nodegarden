"use strict";function _classCallCheck(t,s){if(!(t instanceof s))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function t(t,s){for(var e=0;e<s.length;e++){var i=s[e];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(s,e,i){return e&&t(s.prototype,e),i&&t(s,i),s}}();!function(){var t=function(){function t(){_classCallCheck(this,t),this.x=0,this.y=0,this.velocityX=0,this.velocityY=0,this.mass=0}return _createClass(t,[{key:"update",value:function(){this.x+=this.velocityX,this.y+=this.velocityY}},{key:"reset",value:function(t,s){this.x=Math.random()*t,this.y=Math.random()*s,this.velocityX=1*Math.random()-.5,this.velocityY=1*Math.random()-.5,this.mass=2*Math.random()+1}},{key:"isInvisible",value:function(t,s){return this.x>t+25||this.x<-25||this.y>t+25||this.y<-25}}]),t}(),s=function(){function s(){_classCallCheck(this,s)}return _createClass(s,[{key:"init",value:function(){var t=this;this.canvas=document.createElement("canvas"),this.canvas.id="nodegarden",1!==window.devicePixelRatio&&(this.canvas.style.transform="scale("+1/window.devicePixelRatio+")",this.canvas.style.transformOrigin="0 0"),document.getElementById("container").appendChild(this.canvas),document.getElementsByClassName("moon")[0].addEventListener("click",function(s){s.stopPropagation(),t.toggleNightMode()}),this._ctx=this.canvas.getContext("2d"),this._ctx.fillStyle="#ffffff",this._nodes=[],this.resize(),window.addEventListener("resize",function(){t.resize()}),document.getElementById("container").addEventListener("click",function(s){s.stopPropagation(),t.resetRandomNode(s.pageX,s.pageY)}),this.render()}},{key:"resize",value:function(){this.canvas.width=window.innerWidth*window.devicePixelRatio,this.canvas.height=window.innerHeight*window.devicePixelRatio,this._nodes.length=Math.sqrt(this.canvas.width*this.canvas.height)/25|0;for(var s=0;s<this._nodes.length;s++)if(!this._nodes[s]){var e=new t;e.reset(this.canvas.width,this.canvas.height),this._nodes[s]=e}this.toggleNightMode(),this.toggleNightMode()}},{key:"render",value:function(){var t=this;requestAnimationFrame(function(){t.render()}),this._ctx.clearRect(0,0,this.canvas.width,this.canvas.height);for(var s=0;s<this._nodes.length-1;s++)for(var e=this._nodes[s],i=s+1;i<this._nodes.length;i++){var a=this._nodes[i],n=a.x-e.x,o=a.y-e.y,h=n*n+o*o;if(!(h>2e4))if(h<(e.mass/2+a.mass/2)*(e.mass/2+a.mass/2)){if(e.mass<=a.mass){a.velocityX=a.mass*a.velocityX/(e.mass+a.mass)+e.mass*e.velocityX/(e.mass+a.mass),a.velocityY=a.mass*a.velocityY/(e.mass+a.mass)+e.mass*e.velocityX/(e.mass+a.mass),e.reset(this.canvas.width,this.canvas.height);continue}e.velocityX=e.mass*e.velocityX/(e.mass+a.mass)+a.mass*a.velocityX/(e.mass+a.mass),e.velocityY=e.mass*e.velocityY/(e.mass+a.mass)+a.mass*a.velocityX/(e.mass+a.mass),a.reset(this.canvas.width,this.canvas.height)}else{var c=3*(e.mass*a.mass)/h,r=100*c;if(!(.05>r)){var l=Math.sqrt(h),v={x:n/l,y:o/l};this._ctx.beginPath(),this.isNightMode()?this._ctx.strokeStyle="rgba(191,191,191,"+(1>r?r:1)+")":this._ctx.strokeStyle="rgba(63,63,63,"+(1>r?r:1)+")",this._ctx.moveTo(e.x,e.y),this._ctx.lineTo(a.x,a.y),this._ctx.stroke();var d=c*v.x/e.mass,m=c*v.x/e.mass,y=c*v.y/a.mass,f=c*v.y/a.mass;e.velocityX+=d,e.velocityY+=y,a.velocityX-=m,a.velocityY-=f}}}this._nodes.forEach(function(s,e){t._ctx.beginPath(),t._ctx.arc(s.x,s.y,s.mass,0,2*Math.PI),t._ctx.fill(),s.update(),s.isInvisible(t.canvas.width,t.canvas.height)&&s.reset(t.canvas.width,t.canvas.height)})}},{key:"toggleNightMode",value:function(){document.body.classList.toggle("nightmode"),this.isNightMode()?this._ctx.fillStyle="#ffffff":this._ctx.fillStyle="#000000"}},{key:"isNightMode",value:function(){return document.body.classList.contains("nightmode")}},{key:"resetRandomNode",value:function(t,s){var e=this._nodes[Math.floor(Math.random()*(this._nodes.length-1))];e.reset(this.canvas.width,this.canvas.height)}}]),s}();(new s).init()}();