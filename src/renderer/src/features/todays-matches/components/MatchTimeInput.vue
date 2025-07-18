<script setup>
import { DISPLAY_MODE } from '../../../shared/constants/displayMode'

defineProps({
    match: {
        type: Object,
        required: true
    },
    matchIndex: {
        type: Number,
        required: true
    },
    displayMode: {
        type: String,
        default: DISPLAY_MODE.DARK
    }
})
</script>

<template>
    <div
        class="relative mt-2"
        :class="displayMode === DISPLAY_MODE.DARK ? 'text-white' : 'text-black'"
    >
        <label
            v-if="match[matchIndex === 0 ? 'firstMatch' : 'secondMatch'].matchTime !== ''"
            class="px-2 z-5 w-max absolute left-1/2 -top-2.5 -translate-x-1/2 block mb-1 text-sm font-semibold"
            :class="
                displayMode === DISPLAY_MODE.DARK
                    ? 'text-white bg-[#1f2937]'
                    : 'text-black bg-white'
            "
        >
            Match Time
        </label>
        <div class="relative">
            <i
                class="pi pi-pencil pencil"
                :class="displayMode === DISPLAY_MODE.DARK ? 'text-white' : 'text-black'"
            ></i>
            <input
                v-model="match[matchIndex === 0 ? 'firstMatch' : 'secondMatch'].matchTime"
                type="text"
                placeholder="Match Time"
                class="pl-8 w-full border p-3.5 placeholder-opacity-100 rounded-md"
            />
        </div>
    </div>
</template>
