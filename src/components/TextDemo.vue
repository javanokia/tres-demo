<script setup lang="ts">
import { TresCanvas, useRenderLoop } from '@tresjs/core'
import { OrbitControls, Text3D } from '@tresjs/cientos'
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

// 文本控制
const text = ref('TresJS')
const size = ref(1)
const height = ref(0.2)
const curveSegments = ref(12)
const bevelEnabled = ref(true)
const bevelThickness = ref(0.1)
const bevelSize = ref(0.02)
const bevelSegments = ref(5)

// 材质参数
const metalness = ref(0.5)
const roughness = ref(0.2)
const color = ref('#42b883')

// 字体路径
const fontPath = 'fonts/helvetiker_regular.typeface.json'
</script>

<template>
  <div class="text-demo">
    <!-- 控制面板 -->
    <div class="controls">
      <div class="control-item">
        <label>文本内容</label>
        <input type="text" v-model="text" />
      </div>
      <div class="control-item">
        <label>字体大小</label>
        <input type="range" v-model="size" min="0.5" max="2" step="0.1" />
        <span>{{ size }}</span>
      </div>
      <div class="control-item">
        <label>文字厚度</label>
        <input type="range" v-model="height" min="0.1" max="0.5" step="0.05" />
        <span>{{ height }}</span>
      </div>
      <div class="control-item">
        <label>曲线分段</label>
        <input type="range" v-model="curveSegments" min="4" max="20" step="1" />
        <span>{{ curveSegments }}</span>
      </div>
      <div class="control-item">
        <label>
          <input type="checkbox" v-model="bevelEnabled" />
          启用斜角
        </label>
      </div>
      <div class="control-item" v-if="bevelEnabled">
        <label>斜角厚度</label>
        <input type="range" v-model="bevelThickness" min="0.01" max="0.2" step="0.01" />
        <span>{{ bevelThickness }}</span>
      </div>
      <div class="control-item" v-if="bevelEnabled">
        <label>斜角大小</label>
        <input type="range" v-model="bevelSize" min="0.01" max="0.1" step="0.01" />
        <span>{{ bevelSize }}</span>
      </div>
      <div class="control-item" v-if="bevelEnabled">
        <label>斜角分段</label>
        <input type="range" v-model="bevelSegments" min="1" max="10" step="1" />
        <span>{{ bevelSegments }}</span>
      </div>
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
        <label>颜色</label>
        <input type="color" v-model="color" />
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

      <!-- 3D文本 -->
      <Text3D
        :font="fontPath"
        :text="text"
        :size="size"
        :height="height"
        :curve-segments="curveSegments"
        :bevel-enabled="bevelEnabled"
        :bevel-thickness="bevelThickness"
        :bevel-size="bevelSize"
        :bevel-segments="bevelSegments"
        :position="[-2, 0, 0]"
        :cast-shadow="true"
        :receive-shadow="true"
      >
        <TresMeshStandardMaterial
          :color="color"
          :metalness="metalness"
          :roughness="roughness"
        />
      </Text3D>

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
.text-demo {
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
  max-height: 90vh;
  overflow-y: auto;
}

.control-item {
  margin-bottom: 15px;
}

.control-item label {
  display: block;
  margin-bottom: 5px;
}

.control-item input[type="range"],
.control-item input[type="text"] {
  width: 200px;
  margin-right: 10px;
}

.control-item input[type="checkbox"] {
  margin-right: 8px;
}

.control-item input[type="color"] {
  width: 50px;
  height: 25px;
  padding: 0;
  border: none;
}

.control-item span {
  display: inline-block;
  width: 30px;
  text-align: right;
}
</style> 