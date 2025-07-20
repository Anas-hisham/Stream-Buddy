<template>
    <div v-if="settingsStore.lastAppliedPreset" class="p-4 rounded-lg center-center">
        <span class="font-medium mr-2"> Active Preset: </span>
        <span class="font-bold" :class="appStore.isDarkMode ? 'text-blue-300' : 'text-blue-600'">
            {{ settingsStore.lastAppliedPreset }}
        </span>
    </div>
</template>

<script setup>
import { useAppStore, useSettingsStore } from '../../../shared/stores/index'

const settingsStore = useSettingsStore()

const appStore = useAppStore()
</script>
