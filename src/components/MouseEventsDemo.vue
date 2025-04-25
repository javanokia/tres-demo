<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import * as THREE from 'three'
import { ref } from 'vue'
import type { ThreeEvent } from '@tresjs/core'

// 场景配置
const sceneConfig = {
  clearColor: '#ffffff',
  shadows: true,
  camera: {
    position: new THREE.Vector3(0, 2, 5),
    fov: 45,
    near: 0.1,
    far: 1000,
    aspect: window.innerWidth / window.innerHeight
  } as THREE.PerspectiveCamera
}

// 事件日志
const eventLogs = ref<string[]>([])
const maxLogs = 10

// 添加日志
const addLog = (eventName: string, details: string = '') => {
  const log = `${eventName} ${details}`
  eventLogs.value = [log, ...eventLogs.value.slice(0, maxLogs - 1)]
}

// 鼠标事件处理器
const handleClick = (event: MouseEvent) => {
  addLog('click', `at (${event.clientX}, ${event.clientY})`)
}

const handleContextMenu = (event: MouseEvent) => {
  event.preventDefault()
  addLog('context-menu', '右键点击')
}

const handleDoubleClick = (event: MouseEvent) => {
  addLog('double-click', `at (${event.clientX}, ${event.clientY})`)
}

const handlePointerMove = (event: PointerEvent) => {
  addLog('pointer-move', `at (${event.clientX}, ${event.clientY})`)
}

const handlePointerEnter = (event: ThreeEvent<PointerEvent>) => {
  addLog('pointer-enter')
  document.body.style.cursor = 'pointer'
}

const handlePointerLeave = (event: ThreeEvent<PointerEvent>) => {
  addLog('pointer-leave')
  document.body.style.cursor = 'default'
}

const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
  addLog('pointer-down', `button: ${event.button}`)
}

const handlePointerUp = (event: ThreeEvent<PointerEvent>) => {
  addLog('pointer-up', `button: ${event.button}`)
}

const handleWheel = (event: WheelEvent) => {
  addLog('wheel', `deltaY: ${event.deltaY}`)
}

const handlePointerMissed = () => {
  addLog('pointer-missed', '未击中任何物体')
}

// 物体状态
const isHovered = ref(false)
const isPressed = ref(false)

// 获取物体颜色
const getObjectColor = () => {
  if (isPressed.value) return '#ff0000'
  if (isHovered.value) return '#00ff00'
  return '#4287f5'
}
</script>

<template>
  <div class="mouse-events-demo">
    <!-- 事件日志面板 -->
    <div class="event-logs">
      <h3>事件日志</h3>
      <div class="log-list">
        <div v-for="(log, index) in eventLogs" :key="index" class="log-item">
          {{ log }}
        </div>
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

      <!-- 交互物体 -->
      <TresMesh
        :position="[0, 0, 0]"
        :cast-shadow="true"
        :receive-shadow="true"
        @click="handleClick"
        @context-menu="handleContextMenu"
        @double-click="handleDoubleClick"
        @pointer-move="handlePointerMove"
        @pointer-enter="(e) => { handlePointerEnter(e); isHovered = true }"
        @pointer-leave="(e) => { handlePointerLeave(e); isHovered = false }"
        @pointer-down="(e) => { handlePointerDown(e); isPressed = true }"
        @pointer-up="(e) => { handlePointerUp(e); isPressed = false }"
        @wheel="handleWheel"
      >
        <TresBoxGeometry :args="[1, 1, 1]" />
        <TresMeshStandardMaterial 
          :color="getObjectColor()"
          :metalness="0.5"
          :roughness="0.5"
        />
      </TresMesh>

      <!-- 地面 -->
      <TresMesh 
        :rotation="[-Math.PI / 2, 0, 0]" 
        :position="[0, -2, 0]"
        :receive-shadow="true"
        @pointer-missed="handlePointerMissed"
      >
        <TresPlaneGeometry :args="[20, 20]" />
        <TresMeshStandardMaterial 
          color="#90EE90"
          :metalness="0.1"
          :roughness="0.8"
        />
      </TresMesh>

      <!-- 轨道控制器 -->
      <OrbitControls 
        :enable-damping="true"
        :damping-factor="0.05"
      />
    </TresCanvas>
  </div>
</template>

<style scoped>
.mouse-events-demo {
  position: relative;
  width: 100vw;
  height: 100vh;
}

.event-logs {
  position: fixed;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 20px;
  border-radius: 8px;
  z-index: 100;
  width: 300px;
  max-height: 400px;
  overflow-y: auto;
}

.event-logs h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
}

.log-list {
  font-family: monospace;
}

.log-item {
  padding: 5px 0;
  font-size: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.log-item:last-child {
  border-bottom: none;
}
</style> 