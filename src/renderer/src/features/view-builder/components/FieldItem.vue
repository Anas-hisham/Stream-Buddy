<template>
    <div
        :style="{
            flex:
                newView.layoutStyle === 'grid'
                    ? (() => {
                          const perRow = 4
                          const total = line.fields.length
                          const rowIndex = Math.floor(perRow)
                          const lastRowIndex = Math.floor((total - 1) / perRow)
                          const itemsInLastRow = total % perRow || perRow
                          const columns = rowIndex === lastRowIndex ? itemsInLastRow : perRow
                          return `1 0 calc(${100 / columns}% - 12px)`
                      })()
                    : '1 0 100%',
        }"
        class="mb-4 flex-grow relative"
        :class="[
            viewBuilderStore.fieldErrors[`${sectionIndex}-${lineIndex}-${fieldIndex}`]
                ? 'mb-10'
                : '',
        ]"
    >
        <div class="flex items-center gap-2 w-full">
            <i
                v-if="newView.layoutStyle === 'grid'"
                class="pi pi-circle-fill field-handle cursor-grab text-sm flex-shrink-0"
                :class="appStore.isDarkMode ? 'text-gray-400' : 'text-gray-500'"
            ></i>

            <div class="flex-grow">
                <div class="relative">
                    <input
                        type="text"
                        v-model.lazy="field.name"
                        @change="
                            viewBuilderStore.validateFieldName(sectionIndex, lineIndex, fieldIndex)
                        "
                        class="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        :class="[
                            appStore.isDarkMode
                                ? 'bg-gray-700 border-gray-600'
                                : 'bg-white border-gray-300',
                            viewBuilderStore.fieldErrors[
                                `${sectionIndex}-${lineIndex}-${fieldIndex}`
                            ]
                                ? 'input-error-ring'
                                : '',
                        ]"
                        placeholder="Field Name"
                    />
                </div>
            </div>
            <div
                :class="[
                    viewBuilderStore.fieldErrors[`${sectionIndex}-${lineIndex}-${fieldIndex}`]
                        ? 'pb-10'
                        : '',
                ]"
            ></div>
            <div class="min-w-[80px] max-w-[180px]">
                <div class="relative w-full">
                    <select
                        v-model="field.type"
                        class="appearance-none w-full px-4 py-2.5 pr-8 border rounded-lg transition-all input-ring"
                        :class="[
                            appStore.isDarkMode
                                ? 'bg-gray-700 border-gray-600'
                                : 'bg-white border-gray-300 ',
                        ]"
                    >
                        <option value="text">Text</option>
                        <option value="integer">Number</option>
                        <option value="image">Image</option>
                    </select>
                    <i
                        class="pi pi-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none opacity-70"
                    ></i>
                </div>
            </div>

            <button
                @click="viewBuilderStore.removeField(sectionIndex, lineIndex, fieldIndex)"
                class="rounded-full transition-colors hover:bg-opacity-20 flex-shrink-0"
            >
                <i class="pi pi-times text-red-600 hover:text-red-700"></i>
            </button>
        </div>
        <p
            v-if="viewBuilderStore.fieldErrors[`${sectionIndex}-${lineIndex}-${fieldIndex}`]"
            class="absolute left-5 mt-2 text-sm flex items-center gap-2 text-red-500"
        >
            <i class="pi pi-exclamation-circle"></i>
            {{ viewBuilderStore.fieldErrors[`${sectionIndex}-${lineIndex}-${fieldIndex}`] }}
        </p>
    </div>
</template>

<script setup>
import { useAppStore } from '../../../shared/stores'
import { useViewBuilderStore } from '../viewBuilderStore'

const appStore = useAppStore()
const viewBuilderStore = useViewBuilderStore()
const props = defineProps({
    field: Object,
    fieldIndex: Number,
    line: Object,
    lineIndex: Number,
    sectionIndex: Number,
    newView: Object,
})
</script>
