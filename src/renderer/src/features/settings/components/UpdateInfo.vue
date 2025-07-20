<template>
    <div :class="['setting-section my-6', appStore.isDarkMode ? 'bg-gray-700' : 'bg-white']">
        <div class="text-center mb-10 p-6 rounded-lg">
            <p
                :class="[
                    'text-lg font-medium',
                    appStore.isDarkMode ? 'text-gray-200' : 'text-gray-700',
                ]"
            >
                Current Version: {{ autoUpdateStore.appVersion }}
                <span v-if="autoUpdateStore.newVersion" class="block text-sm mt-1">
                    New Version Available: {{ autoUpdateStore.newVersion }}
                </span>
            </p>

            <button
                v-if="!autoUpdateStore.updateAvailable && autoUpdateStore.showDownloadButton"
                @click="autoUpdateStore.checkForUpdate"
                class="mt-4 blue-button px-5 py-2.5 rounded-lg shadow-sm transition-colors"
            >
                Check for Update
            </button>

            <div v-if="autoUpdateStore.showUpdateUI" class="mt-6 space-y-4">
                <div v-if="autoUpdateStore.updateAvailable && autoUpdateStore.showDownloadButton">
                    <button
                        @click="startDownload"
                        class="blue-button px-5 py-2.5 rounded-lg shadow-sm transition-colors"
                    >
                        Download Update
                    </button>
                </div>

                <p class="text-sm" :class="appStore.isDarkMode ? 'text-blue-300' : 'text-blue-600'">
                    {{ autoUpdateStore.updateMessage }}
                </p>

                <div
                    v-if="
                        autoUpdateStore.downloadPercent >= 0 &&
                        autoUpdateStore.downloadPercent < 100 &&
                        autoUpdateStore.showDownloadPercent
                    "
                    class="w-full max-w-lg mx-auto bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden"
                >
                    <div
                        class="bg-blue-500 h-2.5 transition-all duration-300"
                        :style="{ width: autoUpdateStore.downloadPercent + '%' }"
                    ></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAutoUpdateStore } from '../../../shared/stores/index'
import { useAppStore } from '../../../shared/stores/index'

const appStore = useAppStore()

const autoUpdateStore = useAutoUpdateStore()
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
</script>
