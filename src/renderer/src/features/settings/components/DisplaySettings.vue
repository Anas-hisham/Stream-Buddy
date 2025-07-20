<template>
    <div :class="['setting-section', appStore.isDarkMode ? 'bg-gray-700' : 'bg-white']">
        <h2 class="text-xl font-semibold mb-4 flex justify-center gap-2">Display Settings</h2>
        <DisplayModeSelector />
        <NavigationModeSelector />
    </div>
</template>

<script setup>
import DisplayModeSelector from './DisplayModeSelector.vue'
import NavigationModeSelector from './NavigationModeSelector.vue'
import { useAppStore } from '../../../shared/stores/index'

const appStore = useAppStore()
</script>
