<script setup>
import { useAppStore } from '../../../shared/stores'

const appStore = useAppStore()

defineProps({
    matchInfo: {
        type: Object,
        required: true,
    },
})
</script>

<template>
    <h2
        class="section-header"
        :class="appStore.isDarkMode ? 'text-white bg-[#22292f]' : 'text-black bg-gray-200'"
    >
        INFO
    </h2>

    <div
        class="p-4 mb-10 rounded-b-lg shadow-md relative"
        :class="appStore.isDarkMode ? 'bg-[#1f2937]' : ''"
    >
        <label
            v-if="matchInfo.date !== ''"
            class="px-2 z-5 w-max absolute left-1/2 top-1.5 -translate-x-1/2 block mb-1 text-sm font-semibold"
            :class="appStore.isDarkMode ? 'text-white bg-[#1f2937]' : 'text-black bg-white'"
        >
            Date
        </label>
        <div class="relative">
            <i class="pi pi-pencil pencil"></i>
            <input
                type="text"
                placeholder="Date"
                v-model="matchInfo.date"
                class="pl-8 w-full border p-3 rounded-md"
            />
        </div>
    </div>
</template>
