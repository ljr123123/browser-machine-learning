<script setup lang="ts">
import navigator from './components/navigator.vue';
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