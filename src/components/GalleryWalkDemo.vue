<script setup lang="ts">
import { ref } from 'vue'
import { TresCanvas } from '@tresjs/core'
import { OrbitControls, Stats, GLTFModel } from '@tresjs/cientos'
import { PCFSoftShadowMap, SRGBColorSpace, NoToneMapping } from 'three'

// 状态管理
const modelError = ref(false)
const loadingProgress = ref(0)

// 场景配置
const gl = {
    clearColor: '#1a1a1a',
    shadows: true,
    alpha: false,
    shadowMapType: PCFSoftShadowMap,
    outputColorSpace: SRGBColorSpace,
    toneMapping: NoToneMapping,
    windowSize: true,
    antialias: true
}

// 模型加载进度处理
const handleProgress = (event: ProgressEvent) => {
    if (event.lengthComputable) {
        loadingProgress.value = (event.loaded / event.total) * 100
    }
}

// 错误处理
const handleError = (error: Error) => {
    console.error('模型加载失败:', error)
    modelError.value = true
}
</script>

<template>
    <div class="scene-container">
        <TresCanvas v-bind="gl">
            <TresPerspectiveCamera 
                :position="[5, 5, 10]" 
                :look-at="[0, 0, 0]"
                :fov="75"
            />
            
            <OrbitControls 
                :enableDamping="true" 
                :dampingFactor="0.05"
                :maxPolarAngle="Math.PI / 2"
            />
            
            <!-- 使用 Suspense 和 GLTFModel 加载模型 -->
            <Suspense>
                <GLTFModel 
                    path="/model/gallery_room.glb"
                    :draco="true"
                    @progress="handleProgress"
                    @error="handleError"
                />
                <template #fallback>
                    <div class="overlay loading">
                        <div class="progress-bar">
                            <div 
                                class="progress-fill"
                                :style="{ width: `${loadingProgress}%` }"
                            />
                        </div>
                        <span>加载中 {{ Math.round(loadingProgress) }}%</span>
                    </div>
                </template>
            </Suspense>
            
            <!-- 光照系统 -->
            <TresDirectionalLight 
                :position="[10, 10, 10]" 
                :intensity="2.5"
                cast-shadow
            />
            <TresAmbientLight :intensity="0.5" />
            
            <Stats />
        </TresCanvas>

        <div v-if="modelError" class="overlay error">
            加载失败，请刷新重试
        </div>
    </div>
</template>

<style scoped>
.scene-container {
    position: relative;
    width: 100%;
    height: 100%;
}

.overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 1rem;
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    text-align: center;
}

.error {
    color: #ff4444;
}

.progress-bar {
    width: 200px;
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
    margin: 8px 0;
    border-radius: 2px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: #4CAF50;
    transition: width 0.3s ease;
}
</style>