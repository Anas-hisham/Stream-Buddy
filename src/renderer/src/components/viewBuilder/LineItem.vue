<template>
    <div
        class="transition-all rounded-lg overflow-hidden"
        :class="displayMode === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'"
    >
        <div
            class="flex items-center p-3 border-b"
            :class="
                displayMode === 'dark'
                    ? 'border-gray-600 bg-gray-700'
                    : 'border-gray-200 bg-gray-100'
            "
        >
            <i
                class="pi pi-bars line-handle mr-3 cursor-grab text-lg"
                :class="displayMode === 'dark' ? 'text-gray-400' : 'text-gray-500'"
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
                        :displayMode="displayMode"
                        :newView="newView"
                        :fieldErrors="fieldErrors"
                        :validateFieldName="validateFieldName"
                        :removeField="removeField"
                    />
                </template>
            </draggable>

            <div class="flex gap-3 mt-4 w-full">
                <button
                    @click="addFieldToLine(sectionIndex, lineIndex)"
                    class="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all shadow-sm flex-shrink-0"
                    :class="
                        displayMode === 'dark'
                            ? 'bg-gray-600 hover:bg-gray-500 text-white'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    "
                >
                    <i class="pi pi-plus text-xs"></i>
                    Add Field
                </button>
                <button
                    @click="removeLine(sectionIndex, lineIndex)"
                    class="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all shadow-sm flex-shrink-0"
                    :class="
                        displayMode === 'dark'
                            ? 'bg-gray-600 hover:bg-gray-500 text-white'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    "
                >
                    <i class="pi pi-trash text-xs"></i>
                    Remove Line
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import draggable from 'vuedraggable'
import FieldItem from './FieldItem.vue'

const props = defineProps({
    line: Object,
    lineIndex: Number,
    sectionIndex: Number,
    displayMode: String,
    fieldErrors: Object,
    validateFieldName: Function,
    removeField: Function,
    addFieldToLine: Function,
    removeLine: Function,
    newView: Object,
})
</script>
