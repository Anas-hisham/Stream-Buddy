<template>
    <div class="rounded-lg w-full mb-8">
        <div class="">
            <h3
                class="text-sm font-semibold mb-4 px-1"
                :class="appStore.isDarkMode ? 'text-gray-300' : 'text-gray-600'"
            >
                Field Types
            </h3>
            <draggable
                :list="fieldTypes"
                :group="{ name: 'fields', pull: 'clone', put: false }"
                :clone="cloneField"
                item-key="type"
                class="flex flex-col gap-3"
            >
                <template #item="{ element }">
                    <div
                        class="p-3 rounded-lg cursor-grab flex items-center gap-2 max-h-12"
                        :class="
                            appStore.settings.displayMode === DISPLAY_MODE.DARK
                                ? 'gray-button-dark'
                                : 'gray-button-light'
                        "
                    >
                        <i
                            class="pi pi-circle-fill text-sm"
                            :class="
                                appStore.settings.displayMode === DISPLAY_MODE.DARK
                                    ? 'text-gray-400'
                                    : 'text-gray-500'
                            "
                        ></i>
                        <span class="text-sm capitalize">{{ element.name }}</span>
                    </div>
                </template>
            </draggable>
        </div>
    </div>
</template>

<script setup>
import draggable from 'vuedraggable'
import { DISPLAY_MODE } from '../../../shared/constants/displayMode'
import { useAppStore } from '../../../shared/stores'

const appStore = useAppStore()

const fieldTypes = [
    { type: 'text', name: 'Text' },
    { type: 'integer', name: 'Number' },
    { type: 'image', name: 'Image' },
]

const cloneField = (field) => {
    return {
        name: '',
        type: field.type,
        value: '',
        filePath: field.type === 'image' ? '' : undefined,
    }
}
</script>
