<template>
    <div data-aos="zoom-in">
        <div
            class="transition-all pb-5 my-7 rounded-lg overflow-hidden shadow-md"
            :class="
                appStore.settings.displayMode === DISPLAY_MODE.DARK
                    ? 'bg-gray-800 text-white'
                    : 'bg-white text-black'
            "
        >
            <div class="flex items-center justify-between mb-3">
                <h2
                    class="section-header"
                    :class="
                        appStore.settings.displayMode === DISPLAY_MODE.DARK
                            ? 'text-white bg-[#22292f]'
                            : 'text-black bg-gray-200'
                    "
                >
                    <i
                        class="pi pi-bars section-handle cursor-grab mr-2"
                        :class="
                            appStore.settings.displayMode === DISPLAY_MODE.DARK
                                ? 'text-gray-400'
                                : 'text-gray-500'
                        "
                    ></i>
                    {{ section.name }}
                </h2>
            </div>

            <draggable
                v-model="section.lines"
                tag="div"
                item-key="index"
                handle=".line-handle"
                class="space-y-3"
                @end="handleDragEnd"
                group="lines"
            >
                <template #item="{ element: line, index: lineIndex }">
                    <ViewLine
                        :line="line"
                        :lineIndex="lineIndex"
                        :sectionIndex="sectionIndex"
                        :handleDragEnd="handleDragEnd"
                        :isLastLine="lineIndex === section.lines.length - 1"
                    />
                </template>
            </draggable>
        </div>
    </div>
</template>

<script setup>
import draggable from 'vuedraggable'
import ViewLine from './ViewLine.vue'
import { DISPLAY_MODE } from '../../../shared/constants/displayMode'
import { useAppStore } from '../../../shared/stores'
import { useCustomViewStore } from '../customViewStore'

const appStore = useAppStore()
const customViewStore = useCustomViewStore()

const props = defineProps({
    section: Object,
    sectionIndex: Number,
    handleDragEnd: Function
})
</script>
