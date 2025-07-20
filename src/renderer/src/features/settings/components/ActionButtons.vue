<template>
    <div :class="['setting-section mb-8', appStore.isDarkMode ? 'bg-gray-700' : 'bg-white']">
        <h2 class="text-xl font-semibold mb-4 flex justify-center gap-2">Danger Zone</h2>
        <div class="flex justify-around gap-4 my-8">
            <button
                @click="onReset"
                class="blue-button px-6 py-2.5 rounded-lg shadow-sm transition-colors"
            >
                Reset to Defaults
            </button>
            <button
                @click="clearInputs"
                class="red-button px-6 py-2.5 rounded-lg shadow-sm transition-colors"
            >
                Clear Inputs Data
            </button>
        </div>
    </div>
</template>

<script setup>
import { useAppStore } from '../../../shared/stores/index'

const appStore = useAppStore()
const props = defineProps({
    onReset: {
        type: Function,
        required: true,
    },
    clearInputs: Function,
})
</script>
