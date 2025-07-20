<template>
    <div :class="['setting-section mb-6', appStore.isDarkMode ? 'bg-gray-700' : 'bg-white']">
        <h2 class="text-xl font-semibold mb-4 flex justify-center gap-2">Views Management</h2>

        <div class="mt-8">
            <draggable
                v-model="localViews"
                item-key="title"
                @end="updateViewsOrder"
                class="bg-opacity-50 py-4 rounded flex flex-col gap-2"
            >
                <template #item="{ element, index }">
                    <div
                        v-if="viewTemplates(element.path)"
                        class="flex items-center justify-between py-4 px-3 transition-all duration-300 rounded-lg cursor-grab"
                        :class="appStore.isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'"
                    >
                        <span
                            :class="[
                                'font-medium',
                                appStore.isDarkMode ? 'text-white' : 'text-black',
                            ]"
                        >
                            {{ element.title }}
                        </span>
                        <div class="flex items-center space-x-4">
                            <button
                                v-if="withoutEditButton(element.path)"
                                @click="editView(element, router)"
                                class="px-3 py-1 rounded-md text-sm font-medium blue-button"
                            >
                                Edit
                            </button>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    v-model="localViews[index].visible"
                                    class="sr-only peer"
                                />
                                <div
                                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                                    :class="
                                        appStore.isDarkMode
                                            ? 'peer-checked:bg-blue-600 bg-gray-500'
                                            : 'peer-checked:bg-blue-500 bg-gray-300'
                                    "
                                ></div>
                            </label>
                        </div>
                    </div>
                </template>
            </draggable>
        </div>

        <AppliedPreset :lastAppliedPreset="lastAppliedPreset" />
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import draggable from 'vuedraggable'
import AppliedPreset from './AppliedPreset.vue'
import { viewTemplates, withoutEditButton } from '../../../shared/utils/withoutPaths'
import { editView } from '../../../shared/utils/editViewHandler'
import { useAppStore, useSettingsStore } from '../../../shared/stores'

const appStore = useAppStore()
const settingsStore = useSettingsStore()
const props = defineProps({
    lastAppliedPreset: {
        type: String,
    },
})

const router = useRouter()
const localViews = ref([...appStore.allViews]) // clone views to be draggable

// When drag ends, update the store and persist settings
function updateViewsOrder() {
    appStore.settings.views = [...localViews.value]
    appStore.handleSettingsChange(appStore.settings)

    settingsStore.updatingPreset = ''
}

// Optional: sync props when updated externally
watch(
    () => appStore.allViews,
    (newViews) => {
        localViews.value = [...newViews]
    },
)
</script>
