<template>
    <div class="fixed top-20 right-4 z-50">
        <div data-aos="zoom-in">
            <div class="flex flex-col gap-3">
                <button
                    @click="props.onSave"
                    class="green-button p-3 rounded-full hover:scale-105 center-center"
                    title="Save View"
                >
                    <i class="pi pi-save text-xl"></i>
                </button>

                <button
                    v-if="isCustom"
                    @click="editView(props.editableCustomViewConfig, router)"
                    class="blue-button p-3 rounded-full hover:scale-105 center-center"
                    title="Edit View"
                >
                    <i class="pi pi-file-edit text-xl"></i>
                </button>

                <button
                    v-if="!saveOnly"
                    @click="props.onClear"
                    class="orange-button p-3 rounded-full hover:scale-105 center-center"
                    title="Clear Data"
                >
                    <i class="pi pi-eraser text-xl"></i>
                </button>

                <button
                    v-if="isCustom && !saveOnly"
                    @click="props.onDelete"
                    class="red-button p-3 rounded-full hover:scale-105 center-center red-button"
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
import { editView } from '../../shared/utils/editViewHandler'

const props = defineProps({
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
</script>
