<template>
    <div
        :class="[
            'rounded-lg shadow-md p-6',
            settings.displayMode === 'dark' ? 'bg-gray-700' : 'bg-white',
        ]"
    >
        <h2 class="text-xl font-semibold mb-4 flex justify-center gap-2">Display Settings</h2>
        <DisplayModeSelector :settings="settings" :displayMode="displayMode" />
        <NavigationModeSelector :settings="settings" :displayMode="displayMode" />
    </div>
</template>

<script setup>
import DisplayModeSelector from './DisplayModeSelector.vue'
import NavigationModeSelector from './NavigationModeSelector.vue'
defineProps({
    settings: Object,
    displayMode: String,
})
</script>
