<template>
    <div
        class="transition-all rounded-lg overflow-hidden"
        :class="appStore.isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'"
    >
        <div
            class="flex items-center p-3 border-b"
            :class="
                appStore.isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-100'
            "
        >
            <i
                class="pi pi-bars line-handle mr-3 cursor-grab text-lg"
                :class="appStore.isDarkMode ? 'text-gray-400' : 'text-gray-500'"
            ></i>
            <span class="text-sm font-medium">Line {{ lineIndex + 1 }}</span>
        </div>

        <div class="p-4 w-full">
            <draggable
                v-model="line.fields"
                tag="div"
                item-key="name"
                class="flex flex-wrap gap-4 w-full"
                handle=".field-handle"
                group="fields"
            >
                <template #item="{ element: field, index: fieldIndex }">
                    <FieldItem
                        :field="field"
                        :fieldIndex="fieldIndex"
                        :line="line"
                        :lineIndex="lineIndex"
                        :sectionIndex="sectionIndex"
                        :newView="newView"
                    />
                </template>
            </draggable>

            <div class="flex gap-3 mt-4 w-full">
                <template
                    v-if="
                        newView.layoutStyle === 'grid' ||
                        (newView.layoutStyle === 'single' && line.fields.length === 0)
                    "
                >
                    <button
                        @click="viewBuilderStore.addFieldToLine(sectionIndex, lineIndex)"
                        class="px-4 py-2 rounded-lg text-md font-medium flex items-center gap-2 transition-all duration-300 shadow-sm flex-shrink-0"
                        :class="
                            appStore.isDarkMode
                                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                        "
                    >
                        <i class="pi pi-plus text-lg text-green-600"></i>
                        Add Field
                    </button>
                </template>
                <button
                    @click="viewBuilderStore.removeLine(sectionIndex, lineIndex)"
                    class="px-4 py-2 rounded-lg text-md font-medium flex items-center gap-2 transition-all duration-300 shadow-sm flex-shrink-0"
                    :class="
                        appStore.isDarkMode
                            ? 'bg-gray-700 hover:bg-gray-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    "
                >
                    <i class="pi pi-trash text-lg text-red-600"></i>
                    Remove Line
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import draggable from 'vuedraggable'
import FieldItem from './FieldItem.vue'
import { useAppStore } from '../../../shared/stores'
import { useViewBuilderStore } from '../viewBuilderStore'

const appStore = useAppStore()
const viewBuilderStore = useViewBuilderStore()
const props = defineProps({
    line: Object,
    lineIndex: Number,
    sectionIndex: Number,
    newView: Object,
})
</script>
