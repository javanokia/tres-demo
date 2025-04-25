<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import { Text3D, OrbitControls, MeshGlassMaterial } from '@tresjs/cientos'

</script>
<template>
    <TresCanvas clearColor="#202022">
        <TresPerspectiveCamera :position="[0, 0.5, 5]" />
        <OrbitControls :auto-rotate="true" />
        <TresAmbientLight />
        <Suspense>
            <Text3D text="让vue写可视化更简单" center :font="'/font/FiraCodeRegular.json'">
                <MeshGlassMaterial />
            </Text3D>
        </Suspense>
        <TresMesh :position="[0, 0, -1]">
            <TresPlaneGeometry :args="[5, 2]" />
            <TresMeshBasicMaterial color="#1f86e6" />
        </TresMesh>
        <TresPointLight :args="[0xffffff, 10, 0, 10]" :position="[0, 0, -1]" />
        <TresGridHelper :position="[0, -1, 0]" />
    </TresCanvas>
</template>
