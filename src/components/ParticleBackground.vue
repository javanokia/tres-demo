<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'

class Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  canvas: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height
    this.size = Math.random() * 2
    this.speedX = Math.random() * 2 - 1
    this.speedY = Math.random() * 2 - 1
    this.opacity = Math.random() * 0.5 + 0.2
  }

  update() {
    this.x += this.speedX
    this.y += this.speedY

    if (this.x > this.canvas.width) this.x = 0
    if (this.x < 0) this.x = this.canvas.width
    if (this.y > this.canvas.height) this.y = 0
    if (this.y < 0) this.y = this.canvas.height
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(66, 184, 131, ${this.opacity})`
    ctx.fill()
  }
}

let animationFrameId: number
const particles: Particle[] = []
const particleCount = 100

onMounted(() => {
  const canvas = document.getElementById('bg-canvas') as HTMLCanvasElement
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const initCanvas = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  initCanvas()

  // 创建粒子
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(canvas))
  }

  // 连接附近的粒子
  function connectParticles() {
    if (!ctx) return
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 100) {
          ctx.beginPath()
          ctx.strokeStyle = `rgba(66, 184, 131, ${0.1 * (1 - distance / 100)})`
          ctx.lineWidth = 1
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.stroke()
        }
      }
    }
  }

  // 动画循环
  function animate() {
    if (!ctx) return
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    particles.forEach(particle => {
      particle.update()
      if (ctx) {
        particle.draw(ctx)
      }
    })

    connectParticles()
    animationFrameId = requestAnimationFrame(animate)
  }

  animate()

  // 响应窗口大小变化
  const handleResize = () => {
    initCanvas()
  }

  window.addEventListener('resize', handleResize)

  // 清理函数
  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
    cancelAnimationFrame(animationFrameId)
  })
})
</script>

<template>
  <canvas id="bg-canvas" class="background-canvas"></canvas>
</template>

<style scoped>
.background-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background: #1a1a1a;
}
</style> 