<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import * as THREE from 'three'
import { ref } from 'vue'

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

// 交互状态
const hoveredObject = ref<string | null>(null)
const selectedObject = ref<string | null>(null)
const draggedObject = ref<string | null>(null)

// 物体颜色
const colors = {
  cube: '#ff6b6b',
  sphere: '#4ecdc4',
  cylinder: '#ffe66d'
}

// 鼠标事件处理
const handlePointerEnter = (event: PointerEvent, objectName: string) => {
  hoveredObject.value = objectName
}

const handlePointerLeave = () => {
  hoveredObject.value = null
}

const handlePointerDown = (event: PointerEvent, objectName: string) => {
  selectedObject.value = objectName
  draggedObject.value = objectName
}

const handlePointerUp = () => {
  draggedObject.value = null
}

// 获取物体颜色
const getObjectColor = (objectName: string) => {
  if (draggedObject.value === objectName) {
    return '#ff0000' // 拖拽时变红
  }
  if (selectedObject.value === objectName) {
    return '#00ff00' // 选中时变绿
  }
  if (hoveredObject.value === objectName) {
    return '#0000ff' // 悬停时变蓝
  }
  return colors[objectName as keyof typeof colors]
}

// 获取物体缩放
const getObjectScale = (objectName: string) => {
  return hoveredObject.value === objectName ? 1.2 : 1
}

// 信息提示
const getMessage = () => {
  if (draggedObject.value) {
    return `正在拖拽: ${draggedObject.value}`
  }
  if (selectedObject.value) {
    return `已选中: ${selectedObject.value}`
  }
  if (hoveredObject.value) {
    return `悬停在: ${hoveredObject.value}`
  }
  return '点击或悬停物体进行交互'
}
</script>

<template>
  <div class="interaction-demo">
    <!-- 信息提示 -->
    <div class="message">
      {{ getMessage() }}
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

      <!-- 立方体 -->
      <TresMesh
        :position="[-2, 0, 0]"
        :scale="[getObjectScale('cube'), getObjectScale('cube'), getObjectScale('cube')]"
        :cast-shadow="true"
        :receive-shadow="true"
        @pointerenter="(e) => handlePointerEnter(e, 'cube')"
        @pointerleave="handlePointerLeave"
        @pointerdown="(e) => handlePointerDown(e, 'cube')"
        @pointerup="handlePointerUp"
      >
        <TresBoxGeometry :args="[1, 1, 1]" />
        <TresMeshStandardMaterial 
          :color="getObjectColor('cube')"
          :metalness="0.5"
          :roughness="0.5"
        />
      </TresMesh>

      <!-- 球体 -->
      <TresMesh
        :position="[0, 0, 0]"
        :scale="[getObjectScale('sphere'), getObjectScale('sphere'), getObjectScale('sphere')]"
        :cast-shadow="true"
        :receive-shadow="true"
        @pointerenter="(e) => handlePointerEnter(e, 'sphere')"
        @pointerleave="handlePointerLeave"
        @pointerdown="(e) => handlePointerDown(e, 'sphere')"
        @pointerup="handlePointerUp"
      >
        <TresSphereGeometry :args="[0.5, 32, 32]" />
        <TresMeshStandardMaterial 
          :color="getObjectColor('sphere')"
          :metalness="0.5"
          :roughness="0.5"
        />
      </TresMesh>

      <!-- 圆柱体 -->
      <TresMesh
        :position="[2, 0, 0]"
        :scale="[getObjectScale('cylinder'), getObjectScale('cylinder'), getObjectScale('cylinder')]"
        :cast-shadow="true"
        :receive-shadow="true"
        @pointerenter="(e) => handlePointerEnter(e, 'cylinder')"
        @pointerleave="handlePointerLeave"
        @pointerdown="(e) => handlePointerDown(e, 'cylinder')"
        @pointerup="handlePointerUp"
      >
        <TresCylinderGeometry :args="[0.5, 0.5, 1, 32]" />
        <TresMeshStandardMaterial 
          :color="getObjectColor('cylinder')"
          :metalness="0.5"
          :roughness="0.5"
        />
      </TresMesh>

      <!-- 地面 -->
      <TresMesh 
        :rotation="[-Math.PI / 2, 0, 0]" 
        :position="[0, -2, 0]"
        :receive-shadow="true"
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
.interaction-demo {
  position: relative;
  width: 100vw;
  height: 100vh;
}

.message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 16px;
  z-index: 100;
}
</style> 