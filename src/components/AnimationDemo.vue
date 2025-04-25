<script setup lang="ts">
import { TresCanvas, useRenderLoop, extend } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import * as THREE from 'three'
import { ref, onMounted } from 'vue'

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

// 动画对象引用
const rotatingCube = ref()
const bouncingSphere = ref()
const scalingBox = ref()
const wavingCylinder = ref()

// 动画参数
const rotationSpeed = ref(0.02)
const bounceHeight = ref(1)
const bounceSpeed = ref(0.03)
const scaleSpeed = ref(0.02)
const waveSpeed = ref(0.03)

// 动画状态
const time = ref(0)
const bounceTime = ref(0)
const scaleTime = ref(0)

// 使用渲染循环
const { onLoop } = useRenderLoop()

// 动画更新函数
onLoop(() => {
  // 旋转立方体
  if (rotatingCube.value) {
    rotatingCube.value.rotation.x += rotationSpeed.value
    rotatingCube.value.rotation.y += rotationSpeed.value
  }

  // 弹跳球体
  if (bouncingSphere.value) {
    bounceTime.value += bounceSpeed.value
    bouncingSphere.value.position.y = Math.sin(bounceTime.value) * bounceHeight.value + 2
  }

  // 缩放方块
  if (scalingBox.value) {
    scaleTime.value += scaleSpeed.value
    const scale = Math.abs(Math.sin(scaleTime.value)) + 0.5
    scalingBox.value.scale.set(scale, scale, scale)
  }

  // 波浪圆柱
  if (wavingCylinder.value) {
    time.value += waveSpeed.value
    const vertices = wavingCylinder.value.geometry.attributes.position
    const originalPositions = wavingCylinder.value.geometry.userData.originalPositions

    for (let i = 0; i < vertices.count; i++) {
      const x = originalPositions[i * 3]
      const y = originalPositions[i * 3 + 1]
      const z = originalPositions[i * 3 + 2]
      
      vertices.setY(
        i,
        y + Math.sin(x * 2 + time.value) * 0.2
      )
    }
    vertices.needsUpdate = true
  }
})

// 初始化波浪圆柱的顶点数据
onMounted(() => {
  if (wavingCylinder.value) {
    const vertices = wavingCylinder.value.geometry.attributes.position
    const originalPositions = new Float32Array(vertices.array)
    wavingCylinder.value.geometry.userData.originalPositions = originalPositions
  }
})
</script>

<template>
  <div class="animation-demo">
    <!-- 控制面板 -->
    <div class="controls">
      <div class="control-item">
        <label>旋转速度</label>
        <input type="range" v-model="rotationSpeed" min="0" max="0.1" step="0.01" />
      </div>
      <div class="control-item">
        <label>弹跳高度</label>
        <input type="range" v-model="bounceHeight" min="0" max="2" step="0.1" />
      </div>
      <div class="control-item">
        <label>弹跳速度</label>
        <input type="range" v-model="bounceSpeed" min="0" max="0.1" step="0.01" />
      </div>
      <div class="control-item">
        <label>波浪速度</label>
        <input type="range" v-model="waveSpeed" min="0" max="0.1" step="0.01" />
      </div>
    </div>

    <!-- 3D场景 -->
    <TresCanvas v-bind="sceneConfig">
      <!-- 灯光 -->
      <TresAmbientLight :intensity="0.5" />
      <TresDirectionalLight :position="[5, 5, 5]" :intensity="1" :cast-shadow="true" />
      
      <!-- 旋转的立方体 -->
      <TresMesh
        ref="rotatingCube"
        :position="[-3, 2, 0]"
        :cast-shadow="true"
      >
        <TresBoxGeometry :args="[1, 1, 1]" />
        <TresMeshStandardMaterial color="#ff6b6b" />
      </TresMesh>

      <!-- 弹跳的球体 -->
      <TresMesh
        ref="bouncingSphere"
        :position="[-1, 2, 0]"
        :cast-shadow="true"
      >
        <TresSphereGeometry :args="[0.5, 32, 32]" />
        <TresMeshStandardMaterial color="#4ecdc4" />
      </TresMesh>

      <!-- 缩放的方块 -->
      <TresMesh
        ref="scalingBox"
        :position="[1, 2, 0]"
        :cast-shadow="true"
      >
        <TresBoxGeometry :args="[1, 1, 1]" />
        <TresMeshStandardMaterial color="#ffe66d" />
      </TresMesh>

      <!-- 波浪圆柱 -->
      <TresMesh
        ref="wavingCylinder"
        :position="[3, 2, 0]"
        :cast-shadow="true"
      >
        <TresCylinderGeometry :args="[0.5, 0.5, 2, 32, 20]" />
        <TresMeshStandardMaterial 
          color="#6c5ce7"
          :wireframe="true"
        />
      </TresMesh>

      <!-- 地面 -->
      <TresMesh 
        :rotation="[-Math.PI / 2, 0, 0]" 
        :position="[0, 0, 0]"
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
.animation-demo {
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

.control-item input {
  width: 200px;
}
</style> 