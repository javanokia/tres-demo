<script setup lang="ts">
import { TresCanvas, useTexture } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import * as THREE from 'three'
import { ref, watch } from 'vue'

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

// 纹理参数控制
const repeatX = ref(2)
const repeatY = ref(2)
const normalScale = ref(1)
const roughnessScale = ref(1)
const aoIntensity = ref(1)
const displacementScale = ref(0.2)

// 加载纹理
const setup = async () => {
  // 使用 useTexture 加载 PBR 纹理
  const pbrTexture = await useTexture({
    map: '/textures/black-rock/Rock035_2K-JPG_Color.jpg',
    displacementMap: '/textures/black-rock/Rock035_2K-JPG_Displacement.jpg',
    roughnessMap: '/textures/black-rock/Rock035_2K-JPG_Roughness.jpg',
    normalMap: '/textures/black-rock/Rock035_2K-JPG_NormalGL.jpg',
    aoMap: '/textures/black-rock/Rock035_2K-JPG_AmbientOcclusion.jpg',
  })

  // 设置纹理重复
  Object.values(pbrTexture).forEach(texture => {
    if (texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(repeatX.value, repeatY.value)
    }
  })

  return {
    pbrTexture
  }
}

const { pbrTexture } = await setup()

// 监听纹理参数变化
watch([repeatX, repeatY], ([newX, newY]) => {
  Object.values(pbrTexture).forEach(texture => {
    if (texture) {
      texture.repeat.set(newX, newY)
    }
  })
})
</script>

<template>
  <div class="texture-demo">
    <!-- 控制面板 -->
    <div class="controls">
      <div class="control-item">
        <label>水平重复</label>
        <input type="range" v-model="repeatX" min="1" max="4" step="0.5" />
        <span>{{ repeatX }}</span>
      </div>
      <div class="control-item">
        <label>垂直重复</label>
        <input type="range" v-model="repeatY" min="1" max="4" step="0.5" />
        <span>{{ repeatY }}</span>
      </div>
      <div class="control-item">
        <label>法线强度</label>
        <input type="range" v-model="normalScale" min="0" max="2" step="0.1" />
        <span>{{ normalScale }}</span>
      </div>
      <div class="control-item">
        <label>位移强度</label>
        <input type="range" v-model="displacementScale" min="0" max="0.4" step="0.01" />
        <span>{{ displacementScale }}</span>
      </div>
      <div class="control-item">
        <label>环境光遮蔽</label>
        <input type="range" v-model="aoIntensity" min="0" max="2" step="0.1" />
        <span>{{ aoIntensity }}</span>
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
      <TresPointLight 
        :position="[-5, 5, -5]" 
        :intensity="0.5" 
        color="#ff0000"
      />

      <!-- 展示球体 -->
      <TresMesh 
        :position="[0, 0, 0]"
        :cast-shadow="true"
        :receive-shadow="true"
      >
        <TresSphereGeometry :args="[1, 32, 32]" />
        <TresMeshStandardMaterial
          :map="pbrTexture.map"
          :normalMap="pbrTexture.normalMap"
          :normalScale="[normalScale, normalScale]"
          :displacementMap="pbrTexture.displacementMap"
          :displacementScale="displacementScale"
          :roughnessMap="pbrTexture.roughnessMap"
          :aoMap="pbrTexture.aoMap"
          :aoMapIntensity="aoIntensity"
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
.texture-demo {
  position: relative;
  width: 100vw;
  height: 100vh;
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

.loading {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #333;
  font-size: 1.2rem;
}
</style>
