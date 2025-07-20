<template>
    <div class="mb-5">
        <label
            :class="[
                'block text-sm font-medium mb-2',
                appStore.isDarkMode ? 'text-gray-200' : 'text-gray-700',
            ]"
        >
            Display Mode
        </label>
        <select
            v-model="appStore.settings.displayMode"
            class="w-full p-2.5 input-ring"
            :class="
                appStore.isDarkMode
                    ? 'bg-gray-700 text-white border-gray-600'
                    : 'bg-white text-gray-900 border-gray-300'
            "
        >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
        </select>
    </div>
</template>

<script setup>
import { useAppStore } from '../../../shared/stores/index'

const appStore = useAppStore()
</script>
