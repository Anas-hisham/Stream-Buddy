<template>
    <button
        @click="viewBuilderStore.addSection"
        class="w-fit px-4 py-3 rounded-lg text-md font-medium center-center gap-2 transition-all duration-300 shadow-sm"
        :class="appStore.isDarkMode ? 'gray-button-dark' : 'gray-button-light'"
    >
        <i class="pi pi-plus text-lg text-green-600"></i>
        Section
    </button>
</template>

<script setup>
import { useAppStore } from '../../../shared/stores'

const appStore = useAppStore()

import { useViewBuilderStore } from '../viewBuilderStore'

const viewBuilderStore = useViewBuilderStore()
</script>
