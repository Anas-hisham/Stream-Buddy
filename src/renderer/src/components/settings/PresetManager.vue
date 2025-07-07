<template>
    <div
        :class="[
            'rounded-lg shadow-md p-6 mb-6 text-center',
            appStore.settings.displayMode === 'dark' ? 'bg-gray-700' : 'bg-white',
        ]"
    >
        <h2 class="text-xl font-semibold mb-4 flex justify-center gap-2">Presets Management</h2>
        <div
            class="mt-8 p-6 rounded-lg"
            :class="appStore.settings.displayMode === 'dark' ? 'bg-gray-700' : 'bg-gray-50'"
        >
            <div class="flex gap-2 mb-6">
                <input
                    v-model="settingsStore.newPresetName"
                    type="text"
                    placeholder="New preset name"
                    class="flex-grow p-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    :class="
                        appStore.settings.displayMode === 'dark'
                            ? 'bg-gray-600 text-gray-100 border-gray-500 placeholder-gray-400'
                            : 'bg-white text-gray-800 border-gray-200 placeholder-gray-500'
                    "
                />
                <button
                    @click="settingsStore.handleSavePreset(showConfirm, showAlert)"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg shadow-sm transition-colors"
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
                        appStore.settings.displayMode === 'dark' ? 'bg-gray-600/80' : 'bg-white',
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
                                    class="p-2 rounded-lg border text-sm flex-grow focus:ring-1 focus:ring-blue-500/50"
                                    :class="
                                        appStore.settings.displayMode === 'dark'
                                            ? 'bg-gray-500 text-gray-100 border-gray-400'
                                            : 'bg-white text-gray-800 border-gray-200'
                                    "
                                />
                                <div class="flex gap-1">
                                    <button
                                        @click="settingsStore.confirmRename(preset.name, showAlert)"
                                        class="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg shadow-sm"
                                    >
                                        Save
                                    </button>
                                    <button
                                        @click="settingsStore.cancelRename()"
                                        class="text-sm bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-lg shadow-sm"
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
                                    class="px-4 py-1.5 rounded-lg font-medium truncate max-w-[200px] shadow-sm"
                                    :class="[
                                        appStore.settings.displayMode === 'dark'
                                            ? 'bg-gray-500 hover:bg-gray-400 text-gray-100'
                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700',
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
                                class="text-sm px-3 py-1.5 rounded-lg bg-blue-500/90 hover:bg-blue-600 text-white shadow-sm transition-colors"
                            >
                                Rename
                            </button>

                            <template v-if="settingsStore.updatingPreset === preset.name">
                                <button
                                    @click="
                                        settingsStore.confirmUpdatePreset(preset.name, showAlert)
                                    "
                                    class="text-sm px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
                                >
                                    Save
                                </button>
                                <button
                                    @click="settingsStore.cancelUpdatePreset()"
                                    class="text-sm px-3 py-1.5 rounded-lg bg-gray-500 hover:bg-gray-600 text-white shadow-sm transition-colors"
                                >
                                    Cancel
                                </button>
                            </template>
                            <template v-else>
                                <button
                                    @click="settingsStore.startUpdatingPreset(preset)"
                                    class="text-sm px-3 py-1.5 rounded-lg bg-blue-500/90 hover:bg-blue-600 text-white shadow-sm transition-colors"
                                >
                                    Update
                                </button>
                            </template>

                            <button
                                @click="settingsStore.deletePreset(preset.name, showAlert,showConfirm)"
                                class="text-sm px-3 py-1.5 rounded-lg bg-red-500/90 hover:bg-red-600 text-white shadow-sm transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>

                    <div
                        v-if="settingsStore.updatingPreset === preset.name"
                        class="mt-4 pl-4 space-y-3 border-l-2"
                        :class="
                            appStore.settings.displayMode === 'dark'
                                ? 'border-gray-500/50'
                                : 'border-gray-200'
                        "
                    >
                        <template v-for="(view, i) in settingsStore.tempUpdatedViews" :key="i">
                            <div
                                v-if="view.title !== 'Settings'"
                                class="flex items-center justify-between"
                            >
                                <span
                                    :class="[
                                        'font-medium text-sm',
                                        appStore.settings.displayMode === 'light'
                                            ? 'text-gray-700'
                                            : 'text-gray-200',
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
                                        :class="
                                            appStore.settings.displayMode === 'dark'
                                                ? 'bg-gray-500'
                                                : ''
                                        "
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
import { defineProps } from 'vue'
import { useAppStore, useSettingsStore } from '../../stores/index'

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
</script>
