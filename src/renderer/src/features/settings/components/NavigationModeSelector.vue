<template>
    <div>
        <label
            :class="[
                'block text-sm font-medium mb-2',
                appStore.isDarkMode ? 'text-gray-200' : 'text-gray-700',
            ]"
        >
            Navigation Mode
        </label>
        <select
            v-model="appStore.settings.navMode"
            class="w-full p-2.5 input-ring"
            :class="
                appStore.isDarkMode
                    ? 'bg-gray-700 text-white border-gray-600'
                    : 'bg-white text-gray-900 border-gray-300'
            "
        >
            <option value="full">Full</option>
            <option value="mini">Mini</option>
        </select>
    </div>
</template>

<script setup>
import { useAppStore } from '../../../shared/stores/index'

const appStore = useAppStore()
</script>
