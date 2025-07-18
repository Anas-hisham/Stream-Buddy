<template>
    <div
        :class="[
            'setting-section',
            appStore.settings.displayMode === DISPLAY_MODE.DARK ? 'bg-gray-700' : 'bg-white'
        ]"
    >
        <h2 class="text-xl font-semibold mb-4 flex justify-center gap-2">Storage Settings</h2>
        <div class="flex flex-col justify-between gap-5">
            <div class="flex flex-col">
                <label
                    :class="[
                        'block text-sm font-medium mb-2',
                        appStore.settings.displayMode === DISPLAY_MODE.DARK
                            ? 'text-gray-200'
                            : 'text-gray-700'
                    ]"
                >
                    Save JSONs Location
                </label>
                <input
                    v-model="appStore.settings.savePath"
                    type="text"
                    :placeholder="
                        settingsStore.folderPath
                            ? settingsStore.folderPath
                            : appStore.settings.savePath
                    "
                    class="flex-grow p-2.5 input-ring"
                    :class="
                        appStore.settings.displayMode === DISPLAY_MODE.DARK
                            ? 'bg-gray-700 text-white border-gray-500'
                            : 'bg-white text-gray-900 border-gray-300'
                    "
                />
            </div>
            <div class="flex justify-between gap-2 flex-grow">
                <button
                    @click="selectFolder"
                    class="flex-1 px-4 py-2.5 rounded-lg shadow transition-colors"
                    :class="
                        appStore.settings.displayMode === DISPLAY_MODE.DARK
                            ? 'gray-button-dark'
                            : 'gray-button-light'
                    "
                >
                    Browse
                </button>
                <button
                    @click="resetSavePath"
                    class="flex-1 px-4 py-2.5 rounded-lg shadow transition-colors"
                    :class="
                        appStore.settings.displayMode === DISPLAY_MODE.DARK
                            ? 'gray-button-dark'
                            : 'gray-button-light'
                    "
                >
                    Reset
                </button>
                <button
                    @click="applySavePath"
                    class="flex-1 blue-button px-4 py-2.5 rounded-lg shadow transition-colors"
                >
                    Apply
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { DISPLAY_MODE } from '../../../shared/constants/displayMode'
import { useAppStore, useSettingsStore } from '../../../shared/stores/index'

const appStore = useAppStore()
const settingsStore = useSettingsStore()
defineProps({
    selectFolder: Function,
    applySavePath: Function,
    resetSavePath: Function
})
</script>
