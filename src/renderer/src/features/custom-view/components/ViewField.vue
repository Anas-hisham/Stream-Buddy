<template>
    <div
        :style="{
            flex:
                customViewStore.editableCustomViewConfig.layoutStyle === 'grid'
                    ? (() => {
                          const perRow = 10
                          const total = line.fields.length
                          const rowIndex = Math.floor(perRow)
                          const lastRowIndex = Math.floor((total - 1) / perRow)
                          const itemsInLastRow = total % perRow || perRow

                          const columns = rowIndex === lastRowIndex ? itemsInLastRow : perRow
                          return `1 0 calc(${100 / columns}% - 12px)`
                      })()
                    : '1 0 100%',
        }"
        class="mb-1 relative"
        :class="[
            customViewStore.fieldErrors[`${sectionIndex}-${lineIndex}-${fieldIndex}`]
                ? 'mb-10'
                : '',
        ]"
    >
        <div class="grid gap-1 relative">
            <label class="text-sm font-semibold flex items-baseline gap-1">
                <i
                    v-if="customViewStore.editableCustomViewConfig.layoutStyle === 'grid'"
                    class="pi pi-circle-fill field-handle cursor-grab text-xs"
                    :class="appStore.isDarkMode ? 'text-gray-400' : 'text-gray-500'"
                ></i>
                {{ field.name }}
            </label>

            <template v-if="field.type === 'text' || field.type === 'integer'">
                <div
                    class="mt-1 pl-3 h-14 max-h-14 border relative rounded-md flex"
                    :class="[
                        appStore.isDarkMode
                            ? customViewStore.fieldErrors[
                                  `${sectionIndex}-${lineIndex}-${fieldIndex}`
                              ]
                                ? 'border-red-600'
                                : 'border-white'
                            : customViewStore.fieldErrors[
                                    `${sectionIndex}-${lineIndex}-${fieldIndex}`
                                ]
                              ? 'border-red-600'
                              : 'border-black',
                    ]"
                >
                    <i
                        class="pi pi-pencil pencil"
                        :class="appStore.isDarkMode ? 'text-gray-400' : 'text-gray-500'"
                    ></i>
                    <input
                        :type="field.type === 'integer' ? 'number' : 'text'"
                        :value="field.value"
                        @input="
                            (e) =>
                                customViewStore.updateFieldValue(
                                    sectionIndex,
                                    lineIndex,
                                    fieldIndex,
                                    field.type === 'integer'
                                        ? parseInt(e.target.value) || 0
                                        : e.target.value,
                                )
                        "
                        class="outline-none px-5 w-full"
                        :class="
                            (appStore.isDarkMode
                                ? 'text-white placeholder-gray-400'
                                : 'text-black placeholder-gray-500',
                            customViewStore.fieldErrors[
                                `${sectionIndex}-${lineIndex}-${fieldIndex}`
                            ]
                                ? 'input-error-ring'
                                : '')
                        "
                        :placeholder="`Enter ${field.name}`"
                    />
                </div>
            </template>

            <template v-else-if="field.type === 'image'">
                <div
                    class="mt-1 px-3 h-14 max-h-14 img-input cursor-pointer border relative flex items-center justify-between gap-3"
                    :class="[
                        appStore.isDarkMode
                            ? customViewStore.fieldErrors[
                                  `${sectionIndex}-${lineIndex}-${fieldIndex}`
                              ]
                                ? 'border-red-600'
                                : 'border-white'
                            : customViewStore.fieldErrors[
                                    `${sectionIndex}-${lineIndex}-${fieldIndex}`
                                ]
                              ? 'border-red-600'
                              : 'border-black',
                    ]"
                    @click="
                        customViewStore.uploadImageFunction(sectionIndex, lineIndex, fieldIndex)
                    "
                >
                    <span class="text-sm opacity-80 whitespace-nowrap truncate">
                        {{ field.name }}
                    </span>

                    <div
                        v-if="field.value"
                        class="flex items-center gap-2 max-w-full overflow-hidden"
                    >
                        <img :src="field.value" alt="Uploaded image" class="img h-12.5 w-12.5" />
                        <button
                            type="button"
                            class="img-delete"
                            @click.stop="
                                customViewStore.removeImageFunction(
                                    sectionIndex,
                                    lineIndex,
                                    fieldIndex,
                                )
                            "
                        >
                            Delete
                        </button>
                    </div>

                    <span v-else class="img-add text-sm"> + ADD </span>
                </div>
            </template>
        </div>
        <p
            v-if="customViewStore.fieldErrors[`${sectionIndex}-${lineIndex}-${fieldIndex}`]"
            class="absolute left-5 mt-2 text-sm flex items-center gap-2 text-red-500"
        >
            <i class="pi pi-exclamation-circle"></i>
            {{ customViewStore.fieldErrors[`${sectionIndex}-${lineIndex}-${fieldIndex}`] }}
        </p>
    </div>
</template>

<script setup>
import { useAppStore } from '../../../shared/stores'
import { useCustomViewStore } from '../customViewStore'

const appStore = useAppStore()
const customViewStore = useCustomViewStore()

const props = defineProps({
    field: Object,
    fieldIndex: Number,
    lineIndex: Number,
    sectionIndex: Number,
})

const line = {
    fields: [],
}
</script>
