<script setup lang="ts">
import { onMounted } from 'vue';
import navigator from './components/navigator.vue';
import { getPipelineLayout, setCustomPipelineLayout } from '../GPUCompute/pipeline/pipeline';

onMounted(async () => {
    setCustomPipelineLayout({
        label:"test",
        staticInfoEntries:[],
        storageInfoEntries:[],
        main:"",
        otherFunctionEntries:[]
    });
    const layout = await getPipelineLayout("ad");
    console.log(layout);
})
</script>
<template>
    <navigator/>
    <div class="main-box">
        <RouterView></RouterView>
    </div>
</template>

<style lang="css" scoped>
.main-box {
    width:85vw;
    height:100vh;
    position:absolute;
    top:0;
    left:15vw;
}
</style>