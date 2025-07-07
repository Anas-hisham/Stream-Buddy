<template>
    <div
        class="border transition-all rounded-xl shadow-md overflow-hidden"
        :class="displayMode === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'"
    >
        <div
            class="flex justify-between items-center p-4 border-b"
            :class="
                displayMode === 'dark'
                    ? 'border-gray-700 bg-gray-900/50'
                    : 'border-gray-200 bg-gray-50'
            "
        >
            <div class="flex items-center gap-3 w-full">
                <i
                    class="pi pi-bars section-handle cursor-grab text-lg"
                    :class="displayMode === 'dark' ? 'text-gray-400' : 'text-gray-500'"
                ></i>
                <div class="relative w-full">
                    <input
                        type="text"
                        v-model.lazy="section.name"
                        @change="validateSectionName(sectionIndex)"
                        class="text-lg font-medium w-full px-3 py-2 rounded-lg transition focus:outline-none"
                        :class="[
                            displayMode === 'dark'
                                ? 'text-white placeholder-gray-500'
                                : 'text-gray-900 placeholder-gray-400',
                            sectionErrors[sectionIndex]?.nameError
                                ? 'border focus:ring-2 border-red-500 focus:border-red-500 focus:ring-red-500/30'
                                : '',
                        ]"
                        placeholder="Section Name"
                    />
                    <p
                        v-if="sectionErrors[sectionIndex]?.nameError"
                        class="mt-2 text-sm flex items-center gap-2 text-red-500 absolute"
                    >
                        <i class="pi pi-exclamation-circle"></i>
                        {{ sectionErrors[sectionIndex]?.nameError }}
                    </p>
                </div>
                <div :class="[sectionErrors[sectionIndex]?.nameError ? 'pb-22' : '']"></div>
            </div>
            <button
                @click="removeSection(sectionIndex)"
                class="ml-2 p-2 rounded-full transition-colors hover:bg-opacity-20"
            >
                <i class="pi pi-trash text-red-500 hover:text-red-600"></i>
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
                        :displayMode="displayMode"
                        :fieldErrors="fieldErrors"
                        :validateFieldName="validateFieldName"
                        :removeField="removeField"
                        :addFieldToLine="addFieldToLine"
                        :removeLine="removeLine"
                        :newView="newView"
                    />
                </template>
            </draggable>

            <button
                @click="addLine(sectionIndex)"
                class="w-full mt-4 px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all shadow-sm"
                :class="
                    displayMode === 'dark'
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                "
            >
                <i class="pi pi-plus"></i>
                Add New Line
            </button>
        </div>
    </div>
</template>

<script setup>
import draggable from 'vuedraggable'
import LineItem from './LineItem.vue'

const props = defineProps({
    section: Object,
    sectionIndex: Number,
    displayMode: String,
    validateSectionName: Function,
    sectionErrors: Object,
    removeSection: Function,
    fieldErrors: Object,
    validateFieldName: Function,
    removeField: Function,
    addFieldToLine: Function,
    removeLine: Function,
    addLine: Function,
    newView: Object,
})
</script>
