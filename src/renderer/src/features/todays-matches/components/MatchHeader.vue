<script setup>
import { DISPLAY_MODE } from '../../../shared/constants/displayMode'

defineProps({
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
    <h2
        class="section-header"
        :class="
            displayMode === DISPLAY_MODE.DARK ? 'text-white bg-[#22292f]' : 'text-black bg-gray-200'
        "
    >
        {{ matchIndex === 0 ? 'first Match' : 'second Match' }}
    </h2>
</template>
