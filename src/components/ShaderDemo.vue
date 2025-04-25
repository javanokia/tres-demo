<script setup lang="ts">
import { TresCanvas, useRenderLoop } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import * as THREE from 'three'
import { ref, watch } from 'vue'

// 场景配置
const sceneConfig = {
  clearColor: '#000000',
  camera: {
    position: new THREE.Vector3(0, 0, 2),
    fov: 45,
    near: 0.1,
    far: 1000,
    aspect: window.innerWidth / window.innerHeight
  } as THREE.PerspectiveCamera
}

// 着色器参数
const amplitude = ref(0.2)
const frequency = ref(1.0)
const speed = ref(1.0)

// 定义着色器 uniforms 类型
type ShaderUniforms = {
  [key: string]: THREE.IUniform<any>;
  uTime: THREE.IUniform<number>;
  uAmplitude: THREE.IUniform<number>;
  uFrequency: THREE.IUniform<number>;
}

// 顶点着色器
const vertexShader = `
  uniform float uTime;
  uniform float uAmplitude;
  uniform float uFrequency;
  
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    float elevation = sin(modelPosition.x * uFrequency + uTime) * 
                     sin(modelPosition.y * uFrequency + uTime) * uAmplitude;
                     
    modelPosition.z += elevation;
    
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    
    gl_Position = projectedPosition;
    
    vUv = uv;
    vElevation = elevation;
  }
`

// 片元着色器
const fragmentShader = `
  uniform float uTime;
  
  varying vec2 vUv;
  varying float vElevation;
  
  void main() {
    float r = vUv.x + vElevation * 2.0;
    float g = vUv.y + vElevation * 2.0;
    float b = sin(uTime) * 0.5 + 0.5;
    
    gl_FragColor = vec4(r, g, b, 1.0);
  }
`

// 创建着色器材质
const shaderMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uTime: { value: 0 },
    uAmplitude: { value: amplitude.value },
    uFrequency: { value: frequency.value }
  } as ShaderUniforms,
  side: THREE.DoubleSide
})

// 监听参数变化
watch(amplitude, (newValue: number) => {
  shaderMaterial.uniforms.uAmplitude.value = newValue
})

watch(frequency, (newValue: number) => {
  shaderMaterial.uniforms.uFrequency.value = newValue
})

// 动画循环
const { onLoop } = useRenderLoop()

onLoop(({ elapsed }) => {
  shaderMaterial.uniforms.uTime.value = elapsed * speed.value
})
</script>

<template>
  <div class="shader-demo">
    <!-- 控制面板 -->
    <div class="controls">
      <div class="control-item">
        <label>振幅</label>
        <input type="range" v-model="amplitude" min="0" max="0.5" step="0.01" />
        <span>{{ amplitude }}</span>
      </div>
      <div class="control-item">
        <label>频率</label>
        <input type="range" v-model="frequency" min="0" max="5" step="0.1" />
        <span>{{ frequency }}</span>
      </div>
      <div class="control-item">
        <label>速度</label>
        <input type="range" v-model="speed" min="0" max="2" step="0.1" />
        <span>{{ speed }}</span>
      </div>
    </div>

    <!-- 3D场景 -->
    <TresCanvas v-bind="sceneConfig">
      <!-- 网格 -->
      <TresMesh>
        <TresPlaneGeometry :args="[2, 2, 32, 32]" />
        <primitive :object="shaderMaterial" />
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
.shader-demo {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #000;
}

.controls {
  position: fixed;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.1);
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