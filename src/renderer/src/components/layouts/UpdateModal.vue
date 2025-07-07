<template>
    <div
        v-if="autoUpdateStore.updateAvailable && showLocalUI"
        class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
        @click.self="cancelUpdate"
    >
        <div
            class="relative p-6 rounded shadow-lg w-96 text-center"
            :class="appStore.isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'"
        >
            <button
                @click="cancelUpdate"
                class="absolute top-2 right-2 text-gray-400 hover:text-red-600 text-xl font-bold"
            >
                ×
            </button>

            <h2 class="text-xl font-bold mb-2">Update Available</h2>
            <p class="mb-2">Current version: {{ autoUpdateStore.appVersion }}</p>
            <p class="mb-4">New version: {{ autoUpdateStore.newVersion }}</p>

            <div
                v-if="
                    autoUpdateStore.downloadPercent >= 0 &&
                    autoUpdateStore.downloadPercent < 100 &&
                    autoUpdateStore.showDownloadPercent
                "
                class="mb-4"
            >
                <p>Downloading... {{ autoUpdateStore.downloadPercent.toFixed(0) }}%</p>
                <div class="w-full bg-gray-300 h-2 rounded">
                    <div
                        class="bg-blue-500 h-2 rounded"
                        :style="{ width: autoUpdateStore.downloadPercent + '%' }"
                    ></div>
                </div>
            </div>

            <button
                v-if="autoUpdateStore.updateAvailable && autoUpdateStore.showDownloadButton"
                class="px-4 py-2 rounded transition-colors duration-200"
                :class="
                    appStore.isDarkMode
                        ? 'bg-blue-700 hover:bg-blue-600 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                "
                @click="startDownload"
            >
                Download Update
            </button>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAutoUpdateStore } from '../../stores/index'
import { useAppStore } from '../../stores/index'

const showLocalUI = ref(true)

const autoUpdateStore = useAutoUpdateStore()
const appStore = useAppStore()

onMounted(async () => {
    try {
        await autoUpdateStore.init()
    } catch (error) {
        console.error('Initialization error:', error)
    }
})

async function startDownload() {
    autoUpdateStore.showDownloadPercent = true
    autoUpdateStore.showDownloadButton = false
    await autoUpdateStore.downloadUpdate()
}

function cancelUpdate() {
    showLocalUI.value = false
}
</script>
