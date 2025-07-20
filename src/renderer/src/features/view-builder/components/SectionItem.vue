<template>
    <div
        class="border transition-all rounded-xl shadow-md overflow-hidden"
        :class="appStore.isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'"
    >
        <div
            class="flex justify-between items-center p-4 border-b"
            :class="
                appStore.isDarkMode
                    ? 'border-gray-700 bg-gray-900/50'
                    : 'border-gray-200 bg-gray-50'
            "
        >
            <div class="flex items-center gap-3 w-full">
                <i
                    class="pi pi-bars section-handle cursor-grab text-lg"
                    :class="appStore.isDarkMode ? 'text-gray-400' : 'text-gray-500'"
                ></i>
                <div class="relative w-full">
                    <input
                        type="text"
                        v-model.lazy="section.name"
                        @change="viewBuilderStore.validateSectionName(sectionIndex)"
                        class="text-lg font-medium w-full px-3 py-2 rounded-lg transition focus:outline-none"
                        :class="[
                            appStore.isDarkMode
                                ? 'text-white placeholder-gray-500'
                                : 'text-gray-900 placeholder-gray-400',
                            viewBuilderStore.sectionErrors[sectionIndex]?.nameError
                                ? 'border focus:ring-2 input-error-ring'
                                : '',
                        ]"
                        placeholder="Section Name"
                    />
                    <p
                        v-if="viewBuilderStore.sectionErrors[sectionIndex]?.nameError"
                        class="mt-2 text-sm flex items-center gap-2 text-red-500 absolute"
                    >
                        <i class="pi pi-exclamation-circle"></i>
                        {{ viewBuilderStore.sectionErrors[sectionIndex]?.nameError }}
                    </p>
                </div>
                <div
                    :class="[
                        viewBuilderStore.sectionErrors[sectionIndex]?.nameError ? 'pb-22' : '',
                    ]"
                ></div>
            </div>
            <button
                @click="viewBuilderStore.removeSection(sectionIndex)"
                class="ml-2 p-2 rounded-full transition-colors hover:bg-opacity-20"
            >
                <i class="pi pi-trash text-red-600 hover:text-red-700"></i>
            </button>
        </div>

        <div class="p-4">
            <draggable
                v-model="section.lines"
                tag="div"
                item-key="index"
                handle=".line-handle"
                group="lines"
                class="space-y-4"
            >
                <template #item="{ element: line, index: lineIndex }">
                    <LineItem
                        :line="line"
                        :lineIndex="lineIndex"
                        :sectionIndex="sectionIndex"
                        :newView="newView"
                    />
                </template>
            </draggable>

            <button
                @click="viewBuilderStore.addLine(sectionIndex)"
                class="w-full mt-4 px-4 py-3 rounded-lg text-md font-medium center-center gap-2 transition-all duration-300 shadow-sm"
                :class="
                    appStore.isDarkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                "
            >
                <i class="pi pi-plus text-lg text-green-600"></i>
                Add New Line
            </button>
        </div>
    </div>
</template>

<script setup>
import draggable from 'vuedraggable'
import LineItem from './LineItem.vue'
import { useAppStore } from '../../../shared/stores'
import { useViewBuilderStore } from '../viewBuilderStore'

const appStore = useAppStore()
const viewBuilderStore = useViewBuilderStore()
const props = defineProps({
    section: Object,
    sectionIndex: Number,
    newView: Object,
})
</script>
