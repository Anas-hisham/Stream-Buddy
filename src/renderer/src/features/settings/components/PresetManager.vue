<template>
    <div :class="['setting-section', appStore.isDarkMode ? 'bg-gray-700' : 'bg-white']">
        <h2 class="text-xl font-semibold mb-4 flex justify-center gap-2">Presets Management</h2>
        <div
            class="mt-8 p-6 rounded-lg"
            :class="appStore.isDarkMode ? 'bg-gray-700' : 'bg-gray-50'"
        >
            <div class="flex gap-2 mb-6">
                <input
                    v-model="settingsStore.newPresetName"
                    type="text"
                    placeholder="New preset name"
                    class="flex-grow p-2.5 input-ring border"
                    :class="
                        appStore.isDarkMode
                            ? 'bg-gray-700 text-white border-gray-500'
                            : 'bg-white text-gray-900 border-gray-300'
                    "
                />
                <button
                    @click="settingsStore.handleSavePreset(showConfirm, showAlert)"
                    class="blue-button px-4 py-2.5 rounded-lg"
                >
                    Save Preset
                </button>
            </div>

            <div class="space-y-3">
                <div
                    v-for="(preset, index) in settingsStore.presetList"
                    :key="index"
                    class="p-4 rounded-lg transition-all"
                    :class="[
                        appStore.isDarkMode ? 'bg-gray-600/50' : 'bg-white',
                        settingsStore.updatingPreset === preset.name
                            ? 'ring-1 ring-blue-500/50'
                            : '',
                    ]"
                >
                    <div class="flex items-center justify-between gap-3">
                        <div class="flex items-center gap-2 min-w-0 flex-grow">
                            <template v-if="settingsStore.editingName === preset.name">
                                <input
                                    v-model="settingsStore.editedPresetName"
                                    type="text"
                                    class="p-2 rounded-lg border text-sm flex-grow input-ring"
                                    :class="
                                        appStore.isDarkMode
                                            ? 'bg-gray-600 text-gray-100 border-gray-400'
                                            : 'bg-gray-100 text-black border-gray-200'
                                    "
                                />
                                <div class="flex gap-1">
                                    <button
                                        @click="settingsStore.confirmRename(preset.name, showAlert)"
                                        class="text-sm blue-button px-3 py-1 rounded-lg"
                                    >
                                        Save
                                    </button>
                                    <button
                                        @click="settingsStore.cancelRename()"
                                        class="text-sm px-3 py-1 rounded-lg"
                                        :class="[
                                            appStore.isDarkMode
                                                ? 'gray-button-dark '
                                                : 'gray-button-white ',
                                        ]"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </template>
                            <template v-else>
                                <button
                                    @click="
                                        settingsStore.applyPresetFromButton(preset.name, showAlert)
                                    "
                                    class="px-4 py-1.5 rounded-lg font-medium truncate max-w-[200px] shadow-sm duration-300"
                                    :class="[
                                        appStore.isDarkMode
                                            ? 'gray-button-dark'
                                            : 'bg-gray-100 hover:bg-gray-200 ',
                                        settingsStore.lastAppliedPreset === preset.name
                                            ? 'ring-1 ring-blue-500'
                                            : '',
                                    ]"
                                >
                                    {{ preset.name }}
                                </button>
                            </template>
                        </div>

                        <div class="flex gap-2 flex-shrink-0">
                            <button
                                v-if="settingsStore.editingName !== preset.name"
                                @click="settingsStore.startRenaming(preset.name)"
                                class="text-sm px-3 py-1.5 rounded-lg blue-button"
                            >
                                Rename
                            </button>

                            <template v-if="settingsStore.updatingPreset === preset.name">
                                <button
                                    @click="
                                        settingsStore.confirmUpdatePreset(preset.name, showAlert)
                                    "
                                    class="text-sm px-3 py-1.5 rounded-lg blue-button"
                                >
                                    Save
                                </button>
                                <button
                                    @click="settingsStore.cancelUpdatePreset()"
                                    class="text-sm px-3 py-1.5 rounded-lg"
                                    :class="[
                                        appStore.isDarkMode
                                            ? 'gray-button-dark '
                                            : 'gray-button-white ',
                                    ]"
                                >
                                    Cancel
                                </button>
                            </template>
                            <template v-else>
                                <button
                                    @click="settingsStore.startUpdatingPreset(preset)"
                                    class="text-sm px-3 py-1.5 rounded-lg blue-button"
                                >
                                    Update
                                </button>
                            </template>

                            <button
                                @click="
                                    settingsStore.deletePreset(preset.name, showAlert, showConfirm)
                                "
                                class="text-sm px-3 py-1.5 rounded-lg red-button"
                            >
                                Delete
                            </button>
                        </div>
                    </div>

                    <div
                        v-if="settingsStore.updatingPreset === preset.name"
                        class="mt-4 pl-4 border-l-2"
                        :class="appStore.isDarkMode ? 'border-gray-500/50' : 'border-gray-200'"
                    >
                        <template v-for="(view, i) in settingsStore.tempUpdatedViews" :key="i">
                            <div
                                v-if="viewTemplates(view.path, view.title)"
                                class="flex items-center justify-between transition-all duration-300 p-3 rounded-lg"
                                :class="[
                                    appStore.isDarkMode ? 'hover:bg-gray-500' : 'hover:bg-gray-200',
                                ]"
                            >
                                <span
                                    :class="[
                                        'font-medium text-sm',
                                        appStore.isDarkMode ? 'text-gray-200' : 'text-gray-700',
                                    ]"
                                >
                                    {{ view.title }}
                                </span>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        v-model="settingsStore.tempUpdatedViews[i].visible"
                                        class="sr-only peer"
                                    />
                                    <div
                                        class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"
                                        :class="appStore.isDarkMode ? 'bg-gray-500' : ''"
                                    ></div>
                                </label>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, onUnmounted } from 'vue'
import { useAppStore, useSettingsStore } from '../../../shared/stores/index'
import { viewTemplates } from '../../../shared/utils/withoutPaths'

const appStore = useAppStore()
const settingsStore = useSettingsStore()

const props = defineProps({
    showAlert: {
        type: Function,
        required: true,
    },
    showConfirm: {
        type: Function,
        required: true,
    },
})
onUnmounted(() => {
    settingsStore.updatingPreset = ''
})
</script>
