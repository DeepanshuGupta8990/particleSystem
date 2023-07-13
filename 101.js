//setup
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.strokeStyle = 'white'
ctx.lineWidth = 0.5;

// window.addEventListener("resize",()=>{
//   console.log("Resized");
//   canvas.width = window.innerWidth;
//   canvas.height = window.innerHeight;
// })


const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient.addColorStop(0, 'white');
gradient.addColorStop(0.5, 'yellow');
gradient.addColorStop(1, 'orange');

class Particle {
  constructor(effect) {
    this.effect = effect;
    this.radius =Math.floor( Math.random() * 15)+ 1;
    this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
    this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
    this.vx = Math.random()*1-0.5;
    this.vy = Math.random()*1-0.5;
    this.pushX = 0;
    this.pushY = 0;
    this.friction = 0.95;
  }
  draw(context) {
    // context.fillStyle = `hsl(${this.x},100%,50%)`
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fill();
    context.stroke()
  }
  update() {
    if(this.effect.mouse.pressed){
      const dx = this.x - this.effect.mouse.x;
      const dy = this.y - this.effect.mouse.y;
      const dist1 = Math.hypot(dx,dy);
      const force = (this.effect.mouse.radius/dist1)
      if(dist1<this.effect.mouse.radius){
        const angle = Math.atan2(dy,dx);
        this.pushX += Math.cos(angle)*force;
        this.pushY += Math.sin(angle)*force;
      }
    }
    this.x += ((this.pushX *= this.friction )+ this.vx);
    this.y += ((this.pushY  *= this.friction)+ this.vy);
 
   if(this.x<this.radius){
    this.x = this.radius;
    this.vx *= -1;
   }
   else if(this.x>(this.effect.width-this.radius)){
this.x = this.effect.width-this.radius;
this.vx *= -1
   }
   if(this.y<this.radius){
    this.y = this.radius;
    this.vy *= -1;
   }
   else if(this.y>(this.effect.height-this.radius)){
this.y = this.effect.height-this.radius;
this.vy *= -1
   }


  }
  reset(){
    this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
    this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
  }
}

class Effect {
  constructor(canvas, context) {
    this.context = context
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.particles = [];
    this.numberOfParticles = 100
    this.createParticles();

    this.mouse = {
      x:0,
      y:0,
      pressed: false,
      radius: 150
    }

    window.addEventListener("resize", (e) => {
      this.resize(e.target.window.innerWidth, e.target.window.innerHeight)
    })

    window.addEventListener("mousemove",(e)=>{
      if(this.mouse.pressed){
      this.mouse.x = e.x;
      this.mouse.y = e.y;   
     
    }
    })
    window.addEventListener("mousedown",(e)=>{
      this.mouse.x = e.x;
      this.mouse.y = e.y;
      this.mouse.pressed = true;
    })
    window.addEventListener("mouseup",(e)=>{
      this.mouse.x = e.x;
      this.mouse.y = e.y;
      this.mouse.pressed = false;
    })
    
  }
  createParticles() {
    for (let i = 0; i < this.numberOfParticles; i++) {
      this.particles.push(new Particle(this));
    }
  }
  handleParticles(context) {
    this.particles.forEach((ELparticle) => {
      ELparticle.draw(context);
      ELparticle.update();
    })
  }
  connectParticles(context) {
    const maxDist = 80;
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distBetweenPArticles = Math.hypot(dx, dy);
        if (distBetweenPArticles < maxDist) {
          context.save();
          const opacity = 1 - (distBetweenPArticles / maxDist);
          context.globalAlpha = opacity
          context.beginPath();
          context.moveTo(this.particles[i].x, this.particles[i].y);
          context.lineTo(this.particles[j].x, this.particles[j].y);
          context.stroke();
          context.restore();
        }
      }
    }
  }
  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.width = width;
    this.height = height;

    const gradient = this.context.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
    gradient.addColorStop(0, 'white');
    gradient.addColorStop(0.5, 'yellow');
    gradient.addColorStop(1, 'orange');

    this.context.fillStyle = gradient
    this.context.strokeStyle = 'white'

    this.particles.forEach((el)=>{
      el.reset();
    })

  }
}

const effect = new Effect(canvas, ctx)
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  effect.handleParticles(ctx);
  effect.connectParticles(ctx);
  requestAnimationFrame(animate);
}
animate();
