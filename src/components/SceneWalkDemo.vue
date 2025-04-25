<script setup lang="ts">
import { TresCanvas, useRenderLoop } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import * as THREE from 'three'
import { ref, onMounted, onBeforeUnmount } from 'vue'

// 场景配置
const sceneConfig = {
  clearColor: '#87CEEB', // 天空蓝
  shadows: true,
  camera: {
    position: new THREE.Vector3(0, 2, 10),
    fov: 75,
    near: 0.1,
    far: 1000,
    aspect: window.innerWidth / window.innerHeight
  } as THREE.PerspectiveCamera
}

// 控制模式
const controlMode = ref<'orbit' | 'firstPerson'>('orbit')

// 相机位置
const cameraPosition = ref(new THREE.Vector3(0, 2, 10))
const cameraTarget = ref(new THREE.Vector3(0, 0, 0))

// 预设视角
const viewpoints = [
  { name: '正面视角', position: new THREE.Vector3(0, 2, 10), target: new THREE.Vector3(0, 0, 0) },
  { name: '俯视视角', position: new THREE.Vector3(0, 10, 0), target: new THREE.Vector3(0, 0, 0) },
  { name: '侧面视角', position: new THREE.Vector3(10, 2, 0), target: new THREE.Vector3(0, 0, 0) },
  { name: '近距离', position: new THREE.Vector3(3, 2, 3), target: new THREE.Vector3(0, 0, 0) }
]

// 切换视角
const switchViewpoint = (viewpoint: typeof viewpoints[0]) => {
  cameraPosition.value.copy(viewpoint.position)
  cameraTarget.value.copy(viewpoint.target)
}

// 键盘控制
const keys = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  up: false,
  down: false
}

const moveSpeed = 0.1
const { onLoop } = useRenderLoop()

onLoop(() => {
  if (controlMode.value === 'firstPerson') {
    const direction = new THREE.Vector3()
    
    if (keys.forward) direction.z -= moveSpeed
    if (keys.backward) direction.z += moveSpeed
    if (keys.left) direction.x -= moveSpeed
    if (keys.right) direction.x += moveSpeed
    if (keys.up) direction.y += moveSpeed
    if (keys.down) direction.y -= moveSpeed
    
    // 应用移动
    if (direction.length() > 0) {
      direction.normalize()
      cameraPosition.value.add(direction.multiplyScalar(moveSpeed))
    }
  }
})

// 键盘事件处理
const handleKeyDown = (event: KeyboardEvent) => {
  switch (event.code) {
    case 'KeyW': keys.forward = true; break
    case 'KeyS': keys.backward = true; break
    case 'KeyA': keys.left = true; break
    case 'KeyD': keys.right = true; break
    case 'Space': keys.up = true; break
    case 'ShiftLeft': keys.down = true; break
  }
}

const handleKeyUp = (event: KeyboardEvent) => {
  switch (event.code) {
    case 'KeyW': keys.forward = false; break
    case 'KeyS': keys.backward = false; break
    case 'KeyA': keys.left = false; break
    case 'KeyD': keys.right = false; break
    case 'Space': keys.up = false; break
    case 'ShiftLeft': keys.down = false; break
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
})

// 修改位置数组的类型
const cubePositions: [number, number, number][] = [
  [-5, 0, -5], [5, 0, -5],
  [-5, 0, 5], [5, 0, 5]
]
</script>

<template>
  <div class="scene-walk-demo">
    <!-- 控制面板 -->
    <div class="controls">
      <div class="control-group">
        <h3>控制模式</h3>
        <label>
          <input 
            type="radio" 
            v-model="controlMode" 
            value="orbit"
          > 轨道控制
        </label>
        <label>
          <input 
            type="radio" 
            v-model="controlMode" 
            value="firstPerson"
          > 第一人称
        </label>
      </div>

      <div class="control-group">
        <h3>预设视角</h3>
        <button 
          v-for="viewpoint in viewpoints" 
          :key="viewpoint.name"
          @click="switchViewpoint(viewpoint)"
        >
          {{ viewpoint.name }}
        </button>
      </div>

      <div class="control-group" v-if="controlMode === 'firstPerson'">
        <h3>键盘控制</h3>
        <p>WASD: 移动</p>
        <p>空格: 上升</p>
        <p>Shift: 下降</p>
      </div>
    </div>

    <!-- 3D场景 -->
    <TresCanvas v-bind="sceneConfig">
      <!-- 灯光 -->
      <TresAmbientLight :intensity="0.5" />
      <TresDirectionalLight 
        :position="[5, 5, 5]" 
        :intensity="1" 
        :cast-shadow="true"
      />

      <!-- 示例物体 -->
      <!-- 中心立方体 -->
      <TresMesh
        :position="[0, 0, 0]"
        :cast-shadow="true"
        :receive-shadow="true"
      >
        <TresBoxGeometry :args="[2, 2, 2]" />
        <TresMeshStandardMaterial color="#4287f5" />
      </TresMesh>

      <!-- 周围的小立方体 -->
      <TresMesh
        v-for="(pos, index) in cubePositions"
        :key="index"
        :position="pos"
        :cast-shadow="true"
        :receive-shadow="true"
      >
        <TresBoxGeometry :args="[1, 1, 1]" />
        <TresMeshStandardMaterial color="#ff6b6b" />
      </TresMesh>

      <!-- 地面 -->
      <TresMesh 
        :rotation="[-Math.PI / 2, 0, 0]" 
        :position="[0, -2, 0]"
        :receive-shadow="true"
      >
        <TresPlaneGeometry :args="[50, 50]" />
        <TresMeshStandardMaterial 
          color="#90EE90"
          :metalness="0.1"
          :roughness="0.8"
        />
      </TresMesh>

      <!-- 控制器 -->
      <OrbitControls 
        v-if="controlMode === 'orbit'"
        :enable-damping="true"
        :damping-factor="0.05"
      />
      <FirstPersonControls
        v-else
        :position="cameraPosition"
        :target="cameraTarget"
        :speed="0.1"
      />
    </TresCanvas>
  </div>
</template>

<style scoped>
.scene-walk-demo {
  position: relative;
  width: 100vw;
  height: 100vh;
}

.controls {
  position: fixed;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 20px;
  border-radius: 8px;
  z-index: 100;
}

.control-group {
  margin-bottom: 20px;
}

.control-group:last-child {
  margin-bottom: 0;
}

h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
}

label {
  display: block;
  margin-bottom: 5px;
}

button {
  display: block;
  width: 100%;
  padding: 8px;
  margin-bottom: 5px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
}

button:hover {
  background: rgba(255, 255, 255, 0.2);
}

p {
  margin: 5px 0;
  font-size: 14px;
}
</style> 