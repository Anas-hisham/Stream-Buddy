<template>
    <div data-aos="zoom-in">
        <div
            class="transition-all pb-5 my-7 rounded-lg overflow-hidden shadow-md"
            :class="displayMode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'"
        >
            <div class="flex items-center justify-between mb-3">
                <h2
                    class="font-semibold uppercase text-sm w-full py-4 text-start px-5"
                    :class="
                        displayMode === 'dark'
                            ? 'text-white bg-[#22292f]'
                            : 'text-black bg-gray-200'
                    "
                >
                    <i
                        class="pi pi-bars section-handle cursor-grab mr-2"
                        :class="displayMode === 'dark' ? 'text-gray-400' : 'text-gray-500'"
                    ></i>
                    {{ section.name }}
                </h2>
            </div>

            <draggable
                v-model="section.lines"
                tag="div"
                item-key="index"
                handle=".line-handle"
                @end="handleDragEnd"
                class="space-y-3"
            >
                <template #item="{ element: line, index: lineIndex }">
                    <ViewLine
                        :line="line"
                        :lineIndex="lineIndex"
                        :sectionIndex="sectionIndex"
                        :displayMode="displayMode"
                        :layoutStyle="layoutStyle"
                        :updateFieldValue="updateFieldValue"
                        :openImageDialog="uploadImageFunction"
                        :removeImage="removeImage"
                        :handleDragEnd="handleDragEnd"
                    />
                </template>
            </draggable>
        </div>
    </div>
</template>

<script setup>
import draggable from 'vuedraggable'
import ViewLine from './ViewLine.vue'

const props = defineProps({
    section: Object,
    sectionIndex: Number,
    displayMode: String,
    layoutStyle: String,
    updateFieldValue: Function,
    uploadImageFunction: Function,
    removeImage: Function,
    handleDragEnd: Function,
})
</script>
