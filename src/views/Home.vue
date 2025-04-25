<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ParticleBackground from '../components/ParticleBackground.vue'

const router = useRouter()

interface MenuItem {
  title: string
  path: string
  description: string
  icon: string
}

const menuItems = ref<MenuItem[]>([
  {
    title: '基础场景',
    path: '/basic-scene',
    description: '展示 TresJS 基础场景搭建',
    icon: '🎮'
  },
  {
    title: '模型加载',
    path: '/model',
    description: '3D 模型加载和控制',
    icon: '📦'
  },
  {
    title: '纹理映射',
    path: '/texture',
    description: '展示纹理加载和映射效果',
    icon: '🎨'
  },
  {
    title: '着色器效果',
    path: '/shader',
    description: '展示自定义着色器效果',
    icon: '✨'
  },
  {
    title: '鼠标事件',
    path: '/mouse-events',
    description: '展示3D场景中的鼠标事件处理',
    icon: '🖱️'
  },
  {
    title: '场景漫游',
    path: '/scene-walk',
    description: '展示场景漫游和视角控制',
    icon: '🚶'
  },
  {
    title: '银河生成器',
    path: '/galaxy',
    description: '生成可交互的3D银河系',
    icon: '🌌'
  },
  {
    title: '数据中心',
    path: '/datacenter',
    description: '展示3D数据中心模型',
    icon: '🏢'
  },
  {
    title: '画廊漫游',
    path: '/gallery-walk',
    description: '体验画廊虚拟漫游',
    icon: '🖼️'
  }
])

const navigateTo = (path: string) => {
  router.push(path)
}

// 添加鼠标移动跟踪
onMounted(() => {
  const handleMouseMove = (e: MouseEvent) => {
    const cards = document.querySelectorAll<HTMLElement>('.demo-card')
    cards.forEach(card => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      card.style.setProperty('--mouse-x', `${x}px`)
      card.style.setProperty('--mouse-y', `${y}px`)
    })
  }

  document.addEventListener('mousemove', handleMouseMove)

  return () => {
    document.removeEventListener('mousemove', handleMouseMove)
  }
})
</script>

<template>
  <div class="home">
    <ParticleBackground />
    <div class="content">
      <header>
        <h1>TresJS Demo</h1>
        <p class="subtitle">基于 Vue 3 + TresJS 的 3D 演示项目</p>
      </header>

      <main class="demo-grid">
        <div v-for="item in menuItems" :key="item.path" class="demo-card" @click="navigateTo(item.path)">
          <div class="card-content">
            <div class="card-icon">{{ item.icon }}</div>
            <h2>{{ item.title }}</h2>
            <p>{{ item.description }}</p>
          </div>
          <div class="card-bg"></div>
          <div class="card-border"></div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.content {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

header {
  text-align: center;
  margin-bottom: 3rem;
  color: #fff;
}

h1 {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #42b883, #35495e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 30px rgba(66, 184, 131, 0.5);
}

.subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
}

.demo-card {
  position: relative;
  border-radius: 15px;
  padding: 1.5rem;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.05);
  overflow: hidden;
  transition: transform 0.3s ease;
}

.card-content {
  position: relative;
  z-index: 3;
}

.card-bg {
  position: absolute;
  inset: 1px;
  background: radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
      rgba(66, 184, 131, 0.06),
      transparent 40%);
  z-index: 1;
  border-radius: 14px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card-border {
  position: absolute;
  inset: 0;
  border-radius: 15px;
  padding: 1px;
  background: linear-gradient(135deg,
      rgba(66, 184, 131, 0.5),
      rgba(255, 255, 255, 0.1));
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.demo-card:hover {
  transform: translateY(-5px);
}

.demo-card:hover .card-bg,
.demo-card:hover .card-border {
  opacity: 1;
}

.card-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.demo-card h2 {
  color: #fff;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.demo-card p {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
}

@media (max-width: 768px) {
  .content {
    padding: 1rem;
  }

  h1 {
    font-size: 2.5rem;
  }

  .demo-grid {
    grid-template-columns: 1fr;
  }
}
</style>
