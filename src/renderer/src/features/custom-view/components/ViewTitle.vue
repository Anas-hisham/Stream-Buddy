<template>
    <div data-aos="zoom-in">
        <div>
            <h1
                class="text-4xl font-bold text-center"
                :class="appStore.isDarkMode ? 'text-white' : 'text-black'"
            >
                {{ title }}
            </h1>
        </div>
    </div>
</template>

<script setup>
import { useAppStore } from '../../../shared/stores'
const appStore = useAppStore()
defineProps({
    title: String,
    displayMode: String,
})
</script>
