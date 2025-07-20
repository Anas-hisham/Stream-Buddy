<template>
    <div data-aos="zoom-in">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold flex items-center gap-3">
                <i class="pi pi-layer-group" />
                Sections
            </h2>
            <button
                class="px-5 py-2.5 blue-button font-medium flex items-center gap-2 rounded-lg"
                @click="viewBuilderStore.addSection"
            >
                <i class="pi pi-plus" />
                Add Section
            </button>
        </div>
    </div>
</template>
<script setup>
import {  useViewBuilderStore } from '../viewBuilderStore'

const viewBuilderStore = useViewBuilderStore()
</script>
