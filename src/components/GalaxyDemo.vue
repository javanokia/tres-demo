<script setup lang="ts">
import { TresCanvas, useRenderLoop } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import * as THREE from 'three'
import { ref, reactive, watch, onMounted } from 'vue'

// 场景配置
const sceneConfig = {
  clearColor: '#000000',
  camera: {
    position: new THREE.Vector3(3, 3, 3),
    fov: 75,
    near: 0.1,
    far: 1000,
    aspect: window.innerWidth / window.innerHeight
  } as THREE.PerspectiveCamera
}

// 银河参数
const parameters = reactive({
  count: 10000,
  size: 0.02,
  radius: 5,
  branches: 3,
  spin: 1,
  randomness: 0.2,
  randomnessPower: 3,
  insideColor: '#ff6030',
  outsideColor: '#1b3984'
})

// 着色器 uniforms
const shaderUniforms = reactive({
  uTime: { value: 0 },
  uSize: { value: parameters.size }
})

// 着色器代码
const vertexShader = `
  uniform float uTime;
  uniform float uSize;
  
  varying vec3 vColor;
  
  void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    // 旋转
    float angle = atan(modelPosition.x, modelPosition.z);
    float distanceToCenter = length(modelPosition.xz);
    float angleOffset = (1.0 / distanceToCenter) * uTime;
    angle += angleOffset;
    
    modelPosition.x = cos(angle) * distanceToCenter;
    modelPosition.z = sin(angle) * distanceToCenter;
    
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;
    
    // 大小
    gl_PointSize = uSize;
    gl_PointSize *= (1.0 / - viewPosition.z);
    
    // 颜色
    vColor = color;
  }
`

const fragmentShader = `
  varying vec3 vColor;
  
  void main() {
    // 圆形
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 1.0 - strength;
    strength = pow(strength, 10.0);
    
    // 最终颜色
    vec3 color = mix(vec3(0.0), vColor, strength);
    gl_FragColor = vec4(color, strength);
  }
`

// 创建几何体
const geometry = new THREE.BufferGeometry()
const positions = new Float32Array(parameters.count * 3)
const colors = new Float32Array(parameters.count * 3)

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

// 创建材质
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: shaderUniforms,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  vertexColors: true
})

// 创建点云
const points = ref(new THREE.Points(geometry, material))

// 生成星系
const generateGalaxy = () => {
  const positions = new Float32Array(parameters.count * 3)
  const colors = new Float32Array(parameters.count * 3)

  const colorInside = new THREE.Color(parameters.insideColor)
  const colorOutside = new THREE.Color(parameters.outsideColor)

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3
    const radius = Math.random() * parameters.radius
    const spinAngle = radius * parameters.spin
    const branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2

    const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
    const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
    const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)

    positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
    positions[i3 + 1] = randomY
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

    const mixedColor = colorInside.clone()
    mixedColor.lerp(colorOutside, radius / parameters.radius)

    colors[i3] = mixedColor.r
    colors[i3 + 1] = mixedColor.g
    colors[i3 + 2] = mixedColor.b
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
}

// 动画
const { onLoop } = useRenderLoop()

onLoop(({ elapsed }) => {
  shaderUniforms.uTime.value = elapsed * 0.5
})

// 监听参数变化
watch(parameters, () => {
  generateGalaxy()
  shaderUniforms.uSize.value = parameters.size
}, { deep: true })

// 初始生成
onMounted(() => {
  generateGalaxy()
})
</script>

<template>
  <div class="galaxy-demo">
    <div class="controls">
      <div class="control-item">
        <label>粒子数量</label>
        <input type="range" v-model.number="parameters.count" min="1000" max="100000" step="1000" />
        <span>{{ parameters.count }}</span>
      </div>
      <div class="control-item">
        <label>粒子大小</label>
        <input type="range" v-model.number="parameters.size" min="0.001" max="0.1" step="0.001" />
        <span>{{ parameters.size.toFixed(3) }}</span>
      </div>
      <div class="control-item">
        <label>银河半径</label>
        <input type="range" v-model.number="parameters.radius" min="0.01" max="20" step="0.01" />
        <span>{{ parameters.radius.toFixed(2) }}</span>
      </div>
      <div class="control-item">
        <label>分支数量</label>
        <input type="range" v-model.number="parameters.branches" min="2" max="20" step="1" />
        <span>{{ parameters.branches }}</span>
      </div>
      <div class="control-item">
        <label>旋转程度</label>
        <input type="range" v-model.number="parameters.spin" min="-5" max="5" step="0.001" />
        <span>{{ parameters.spin.toFixed(3) }}</span>
      </div>
      <div class="control-item">
        <label>随机程度</label>
        <input type="range" v-model.number="parameters.randomness" min="0" max="2" step="0.001" />
        <span>{{ parameters.randomness.toFixed(3) }}</span>
      </div>
      <div class="control-item">
        <label>随机幂次</label>
        <input type="range" v-model.number="parameters.randomnessPower" min="1" max="10" step="0.001" />
        <span>{{ parameters.randomnessPower.toFixed(3) }}</span>
      </div>
      <div class="control-item">
        <label>内部颜色</label>
        <input type="color" v-model="parameters.insideColor" />
      </div>
      <div class="control-item">
        <label>外部颜色</label>
        <input type="color" v-model="parameters.outsideColor" />
      </div>
    </div>

    <TresCanvas v-bind="sceneConfig">
      <primitive :object="points" />
      
      <OrbitControls 
        :enable-damping="true"
        :damping-factor="0.05"
      />
    </TresCanvas>
  </div>
</template>

<style scoped>
.galaxy-demo {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #000;
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
  backdrop-filter: blur(10px);
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

.control-item input[type="color"] {
  width: 50px;
  height: 25px;
}

.control-item span {
  display: inline-block;
  width: 60px;
  text-align: right;
}
</style>