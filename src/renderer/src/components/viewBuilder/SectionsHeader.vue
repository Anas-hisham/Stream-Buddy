<template>
    <div data-aos="zoom-in">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold flex items-center gap-3">
                <i class="pi pi-layer-group"></i>
                Sections
            </h2>
            <button
                @click="addSection"
                class="px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
                :class="
                    displayMode === 'dark'
                        ? 'bg-blue-700 hover:bg-blue-600 text-white'
                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                "
            >
                <i class="pi pi-plus"></i>
                Add Section
            </button>
        </div>
    </div>
</template>
<script setup>
import { defineProps } from 'vue'

const props = defineProps({
    displayMode: String,
    addSection: Function,
})
</script>
