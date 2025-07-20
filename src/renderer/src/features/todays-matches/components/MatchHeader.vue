<script setup>
import { useAppStore } from '../../../shared/stores'

const appStore = useAppStore()
defineProps({
    matchIndex: {
        type: Number,
        required: true,
    },
})
</script>

<template>
    <h2
        class="section-header"
        :class="appStore.isDarkMode ? 'text-white bg-[#22292f]' : 'text-black bg-gray-200'"
    >
        {{ matchIndex === 0 ? 'first Match' : 'second Match' }}
    </h2>
</template>
