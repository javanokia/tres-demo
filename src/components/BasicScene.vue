<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import * as THREE from 'three'

const sceneConfig = {
  clearColor: '#201919',
  shadows: true,
  camera: {
    position: new THREE.Vector3(0, 2, 5),
    fov: 45,
    near: 0.1,
    far: 1000,
    aspect: window.innerWidth / window.innerHeight
  } as THREE.PerspectiveCamera
}
</script>

<template>
  <TresCanvas v-bind="sceneConfig">
    <TresAmbientLight :intensity="1" />
    <TresDirectionalLight :position="[0, 2, 4]" :intensity="1" />
    
    <TresMesh :position="[0, 0, 0]">
      <TresBoxGeometry :args="[1, 1, 1]" />
      <TresMeshStandardMaterial color="#42b883" />
    </TresMesh>
    
    <OrbitControls />
  </TresCanvas>
</template>

<style scoped>
canvas {
  width: 100vw;
  height: 100vh;
}
</style> 