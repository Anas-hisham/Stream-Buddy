<script setup>
import { useAppStore } from '../../../shared/stores'

const appStore = useAppStore()
defineProps({
    side: {
        type: String,
        required: true,
        validator: (value) => ['left', 'right'].includes(value),
    },
    match: {
        type: Object,
        required: true,
    },
    matchIndex: {
        type: Number,
        required: true,
    },
})
</script>

<template>
    <div class="relative">
        <label
            v-if="match[matchIndex === 0 ? 'firstMatch' : 'secondMatch'][`${side}TeamName`]"
            class="px-2 z-5 w-max absolute left-1/2 -top-2.5 -translate-x-1/2 block mb-1 text-sm font-semibold"
            :class="
                appStore.isDarkMode
                    ? 'text-white bg-[#1f2937]'
                    : 'text-black bg-white'
            "
        >
            {{ side === 'left' ? 'Left' : 'Right' }} Team Name
        </label>
        <div class="relative">
            <i
                class="pi pi-pencil pencil"
                :class="appStore.isDarkMode ? 'text-white' : 'text-black'"
            ></i>
            <input
                v-model="match[matchIndex === 0 ? 'firstMatch' : 'secondMatch'][`${side}TeamName`]"
                type="text"
                :placeholder="`${side === 'left' ? 'Left' : 'Right'} Team Name`"
                class="pl-8 w-full border p-3.5 placeholder-opacity-100 rounded-md"
            />
        </div>
    </div>
</template>
