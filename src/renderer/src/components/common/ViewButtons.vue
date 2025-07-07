<template>
    <div class="fixed top-20 right-4 z-50">
        <!-- Save Button -->
        <div data-aos="zoom-in">
            <div class="flex flex-col gap-3">
                <button
                    @click="props.onSave"
                    class="p-3 rounded-full shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center"
                    :class="
                        props.displayMode === 'dark'
                            ? 'bg-green-600 hover:bg-green-500 text-white'
                            : 'bg-green-500 hover:bg-green-400 text-white'
                    "
                    title="Save View"
                >
                    <i class="pi pi-save text-xl"></i>
                </button>

                <!-- Edit Button -->
                <button
                    v-if="isCustom"
                    @click="editView(props.editableCustomViewConfig)"
                    class="p-3 rounded-full shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center"
                    :class="
                        props.displayMode === 'dark'
                            ? 'bg-blue-600 hover:bg-blue-500 text-white'
                            : 'bg-blue-500 hover:bg-blue-400 text-white'
                    "
                    title="Edit View"
                >
                    <i class="pi pi-file-edit text-xl"></i>
                </button>

                <!-- Clear Button -->
                <button
                    v-if="!saveOnly"
                    @click="props.onClear"
                    class="p-3 rounded-full shadow-lg hover:scale-105 transition-all duration-200 text-white flex items-center justify-center"
                    :class="
                        props.displayMode === 'dark'
                            ? 'bg-amber-500 hover:bg-amber-600'
                            : 'bg-amber-500 hover:bg-amber-400'
                    "
                    title="Clear Data"
                >
                    <i class="pi pi-eraser text-xl"></i>
                </button>

                <!-- Delete Button -->
                <button
                    v-if="isCustom && !saveOnly"
                    @click="props.onDelete"
                    class="p-3 rounded-full shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center"
                    :class="
                        props.displayMode === 'dark'
                            ? 'bg-red-700 hover:bg-red-600 text-white'
                            : 'bg-red-600 hover:bg-red-500 text-white'
                    "
                    title="Delete View"
                >
                    <i class="pi pi-trash text-xl"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
    displayMode: {
        type: String,
    },
    onSave: {
        type: Function,
        required: true,
    },
    onClear: {
        type: Function,
    },
    onDelete: {
        type: Function,
    },
    isCustom: {
        type: Boolean,
    },
    saveOnly: {
        type: Boolean,
    },
    editableCustomViewConfig: {
        type: Object,
    },
})
const router = useRouter()

const editView = (viewToEdit) => {
    router.push({
        path: '/view-builder',
        query: { editPath: viewToEdit.path },
    })
}
</script>
