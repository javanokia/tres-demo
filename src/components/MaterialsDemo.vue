<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import * as THREE from 'three'
import { ref, watch } from 'vue'

// 场景配置
const sceneConfig = {
  clearColor: '#1a1a1a',
  shadows: true,
  camera: {
    position: new THREE.Vector3(0, 2, 10),
    fov: 45,
    near: 0.1,
    far: 1000,
    aspect: window.innerWidth / window.innerHeight
  } as THREE.PerspectiveCamera
}

// 材质参数控制
const metalness = ref(0.5)
const roughness = ref(0.5)
const wireframe = ref(false)
const opacity = ref(1)

// 创建基础材质
const standardMaterial = new THREE.MeshStandardMaterial({
  color: '#ff6b6b',
  metalness: metalness.value,
  roughness: roughness.value
})

const physicalMaterial = new THREE.MeshPhysicalMaterial({
  color: '#4ecdc4',
  metalness: metalness.value,
  roughness: roughness.value,
  clearcoat: 1,
  clearcoatRoughness: 0.1
})

const basicMaterial = new THREE.MeshBasicMaterial({
  color: '#ffe66d',
  wireframe: wireframe.value
})

const phongMaterial = new THREE.MeshPhongMaterial({
  color: '#6c5ce7',
  shininess: 100,
  specular: '#ffffff'
})

const lambertMaterial = new THREE.MeshLambertMaterial({
  color: '#a8e6cf',
  emissive: '#000000'
})

const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: '#ffffff',
  metalness: 0,
  roughness: 0,
  transmission: 1,
  transparent: true,
  opacity: opacity.value
})

// 材质列表
const materials = [
  { name: 'Standard', material: standardMaterial },
  { name: 'Physical', material: physicalMaterial },
  { name: 'Basic', material: basicMaterial },
  { name: 'Phong', material: phongMaterial },
  { name: 'Lambert', material: lambertMaterial },
  { name: 'Glass', material: glassMaterial }
]

// 监听参数变化
watch([metalness, roughness, wireframe, opacity], ([newMetalness, newRoughness, newWireframe, newOpacity]) => {
  standardMaterial.metalness = newMetalness
  standardMaterial.roughness = newRoughness
  physicalMaterial.metalness = newMetalness
  physicalMaterial.roughness = newRoughness
  basicMaterial.wireframe = newWireframe
  glassMaterial.opacity = newOpacity
})
</script>

<template>
  <div class="materials-demo">
    <!-- 控制面板 -->
    <div class="controls">
      <div class="control-item">
        <label>金属度</label>
        <input type="range" v-model="metalness" min="0" max="1" step="0.1" />
        <span>{{ metalness }}</span>
      </div>
      <div class="control-item">
        <label>粗糙度</label>
        <input type="range" v-model="roughness" min="0" max="1" step="0.1" />
        <span>{{ roughness }}</span>
      </div>
      <div class="control-item">
        <label>透明度</label>
        <input type="range" v-model="opacity" min="0" max="1" step="0.1" />
        <span>{{ opacity }}</span>
      </div>
      <div class="control-item">
        <label>
          <input type="checkbox" v-model="wireframe" />
          线框模式
        </label>
      </div>
    </div>

    <!-- 3D场景 -->
    <TresCanvas v-bind="sceneConfig">
      <!-- 灯光 -->
      <TresAmbientLight :intensity="0.5" />
      <TresDirectionalLight :position="[5, 5, 5]" :intensity="1" :cast-shadow="true" />
      <TresPointLight :position="[-5, 5, -5]" :intensity="0.5" color="#ff0000" />
      <TresPointLight :position="[5, -5, -5]" :intensity="0.5" color="#0000ff" />

      <!-- 材质展示网格 -->
      <template v-for="(item, index) in materials" :key="item.name">
        <TresMesh 
          :position="[
            (index % 3) * 3 - 3,
            Math.floor(index / 3) * -3 + 1.5,
            0
          ]"
          :cast-shadow="true"
          :receive-shadow="true"
        >
          <TresSphereGeometry :args="[1, 32, 32]" />
          <primitive :object="item.material" />
        </TresMesh>
      </template>

      <!-- 地面 -->
      <TresMesh 
        :rotation="[-Math.PI / 2, 0, 0]" 
        :position="[0, -3, 0]"
        :receive-shadow="true"
      >
        <TresPlaneGeometry :args="[20, 20]" />
        <TresMeshStandardMaterial 
          color="#2d3436"
          :metalness="0.3"
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
  </div>
</template>

<style scoped>
.materials-demo {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #1a1a1a;
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

.control-item input[type="range"] {
  width: 200px;
  margin-right: 10px;
}

.control-item input[type="checkbox"] {
  margin-right: 8px;
}

.control-item span {
  display: inline-block;
  width: 30px;
  text-align: right;
}
</style> 