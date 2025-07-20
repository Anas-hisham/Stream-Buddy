<template>
    <div
        class="px-3 transition-all flex relative"
        :class="[
            appStore.isDarkMode ? 'border-white' : 'border-black',
            !line.fields.length > 0 ? 'py-5' : 'py-0',
        ]"
    >
        <div v-if="line.fields.length > 0" class="absolute left-2 top-1/2">
            <i
                class="pi pi-bars line-handle mr-4 cursor-grab"
                :class="appStore.isDarkMode ? 'text-gray-400' : 'text-gray-500'"
            ></i>
        </div>

        <draggable
            v-model="line.fields"
            tag="div"
            item-key="name"
            class="flex flex-wrap gap-3 w-full pl-5"
            handle=".field-handle"
            group="fields"
            @end="handleDragEnd"
        >
            <template #item="{ element: field, index: fieldIndex }">
                <ViewField
                    :field="field"
                    :fieldIndex="fieldIndex"
                    :lineIndex="lineIndex"
                    :sectionIndex="sectionIndex"
                />
            </template>
        </draggable>
    </div>
</template>

<script setup>
import draggable from 'vuedraggable'
import ViewField from './ViewField.vue'
import { useAppStore } from '../../../shared/stores'
import { useCustomViewStore } from '../customViewStore'

const appStore = useAppStore()
const customViewStore = useCustomViewStore()
const props = defineProps({
    line: Object,
    lineIndex: Number,
    sectionIndex: Number,
    handleDragEnd: Function,
    isLastLine: Boolean, // Add this prop
})
</script>
