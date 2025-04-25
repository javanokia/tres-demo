<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import * as THREE from 'three'

// 场景配置
const sceneConfig = {
  clearColor: '#ffffff',
  shadows: true,
  camera: {
    position: new THREE.Vector3(10, 12, 10),
    fov: 45,
    near: 0.1,
    far: 1000,
    aspect: window.innerWidth / window.innerHeight
  } as THREE.PerspectiveCamera
}
</script>

<template>
  <TresCanvas v-bind="sceneConfig">
    <!-- 环境光 -->
    <TresAmbientLight :intensity="1" />
    
    <!-- 主光源 -->
    <TresDirectionalLight 
      :position="[10, 10, 10]"
      :intensity="1"
      :cast-shadow="true"
    />
    
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
      :min-distance="5"
      :max-distance="20"
    />
  </TresCanvas>
</template>

<style scoped>
canvas {
  width: 100vw;
  height: 100vh;
}
</style> 