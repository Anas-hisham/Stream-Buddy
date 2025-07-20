<script setup>
import { useAppStore } from '../stores'
const appStore = useAppStore()

const props = defineProps({
    alert: {
        type: Object,
        required: true,
    },
    closeAlert: {
        type: Function,
        required: true,
    },
})
</script>

<template>
    <div
        v-if="props.alert.showAlert"
        class="fixed inset-0 bg-black/30 backdrop-blur-sm center-center z-50"
        @click.self="props.closeAlert"
    >
        <div
            class="relative p-6 rounded-xl shadow-2xl w-[90%] max-w-md text-center transition-all"
            :class="appStore.isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'"
        >
            <button
                @click="props.closeAlert"
                class="absolute top-3 right-3 text-gray-400 hover:text-red-600 text-2xl font-bold"
            >
                ×
            </button>

            <p class="mb-6 text-base">{{ props.alert.text }}</p>

            <button
                class="blue-button px-6 py-2 rounded-lg font-semibold"
                @click="props.closeAlert"
            >
                OK
            </button>
        </div>
    </div>
</template>
