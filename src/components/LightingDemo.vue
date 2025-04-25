<script setup lang="ts">
import { TresCanvas, useRenderLoop } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import * as THREE from 'three'
import { ref, onMounted } from 'vue'

// 场景配置
const sceneConfig = {
  clearColor: '#000000',
  shadows: true,
  camera: {
    position: new THREE.Vector3(0, 2, 5),
    fov: 45,
    near: 0.1,
    far: 1000,
    aspect: window.innerWidth / window.innerHeight
  } as THREE.PerspectiveCamera
}

// 灯光控制
const ambientIntensity = ref(0.5)
const pointIntensity = ref(1)
const spotIntensity = ref(1)
const directionalIntensity = ref(1)

// 创建目标对象
const spotLightTarget = new THREE.Object3D()
spotLightTarget.position.set(0, 0, 0)

// 光源位置
const pointLightPosition = new THREE.Vector3(-2, 2, 2)
const spotLightPosition = new THREE.Vector3(2, 4, 2)
const directionalLightPosition = new THREE.Vector3(2, 2, -2)

// 材质
const standardMaterial = {
  color: '#ffffff',
  metalness: 0.5,
  roughness: 0.2
}

const floorMaterial = {
  color: '#808080',
  metalness: 0.1,
  roughness: 0.8
}

// 引用聚光灯
const spotLight = ref<THREE.SpotLight>()

onMounted(() => {
  if (spotLight.value) {
    spotLight.value.target = spotLightTarget
  }
})
</script>

<template>
  <div class="lighting-demo">
    <!-- 控制面板 -->
    <div class="controls">
      <div class="control-item">
        <label>环境光强度</label>
        <input type="range" v-model="ambientIntensity" min="0" max="1" step="0.1" />
        <span>{{ ambientIntensity }}</span>
      </div>
      <div class="control-item">
        <label>点光源强度</label>
        <input type="range" v-model="pointIntensity" min="0" max="2" step="0.1" />
        <span>{{ pointIntensity }}</span>
      </div>
      <div class="control-item">
        <label>聚光灯强度</label>
        <input type="range" v-model="spotIntensity" min="0" max="2" step="0.1" />
        <span>{{ spotIntensity }}</span>
      </div>
      <div class="control-item">
        <label>平行光强度</label>
        <input type="range" v-model="directionalIntensity" min="0" max="2" step="0.1" />
        <span>{{ directionalIntensity }}</span>
      </div>
    </div>

    <!-- 3D场景 -->
    <TresCanvas v-bind="sceneConfig">
      <!-- 环境光 -->
      <TresAmbientLight :intensity="ambientIntensity" color="#ffffff" />
      
      <!-- 点光源 -->
      <TresPointLight
        :position="pointLightPosition"
        :intensity="pointIntensity"
        :distance="10"
        color="#ff0000"
        :cast-shadow="true"
      />
      
      <!-- 聚光灯 -->
      <TresSpotLight
        ref="spotLight"
        :position="spotLightPosition"
        :intensity="spotIntensity"
        :angle="Math.PI / 6"
        :penumbra="0.1"
        color="#00ff00"
        :cast-shadow="true"
      />
      
      <!-- 聚光灯目标对象 -->
      <TresMesh :position="[0, 0, 0]">
        <TresBoxGeometry :args="[0.1, 0.1, 0.1]" />
        <TresMeshBasicMaterial :transparent="true" :opacity="0" />
      </TresMesh>
      
      <!-- 平行光 -->
      <TresDirectionalLight
        :position="directionalLightPosition"
        :intensity="directionalIntensity"
        color="#0000ff"
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
      
      <!-- 中心球体 -->
      <TresMesh :position="[0, 0, 0]" :cast-shadow="true" :receive-shadow="true">
        <TresSphereGeometry :args="[1, 32, 32]" />
        <TresMeshStandardMaterial v-bind="standardMaterial" />
      </TresMesh>
      
      <!-- 小立方体 -->
      <TresMesh 
        :position="[-2, 0, -2]" 
        :cast-shadow="true" 
        :receive-shadow="true"
      >
        <TresBoxGeometry :args="[1, 1, 1]" />
        <TresMeshStandardMaterial v-bind="standardMaterial" />
      </TresMesh>
      
      <!-- 轨道控制器 -->
      <OrbitControls 
        :enable-damping="true"
        :damping-factor="0.05"
        :min-distance="3"
        :max-distance="20"
      />
    </TresCanvas>
  </div>
</template>

<style scoped>
.lighting-demo {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #000;
}

.controls {
  position: fixed;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.7);
  padding: 20px;
  border-radius: 8px;
  color: white;
  z-index: 100;
}

.control-item {
  margin-bottom: 15px;
}

.control-item label {
  display: block;
  margin-bottom: 5px;
}

.control-item input {
  width: 200px;
  margin-right: 10px;
}

.control-item span {
  display: inline-block;
  width: 30px;
  text-align: right;
}
</style> 