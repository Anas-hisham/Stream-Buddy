<template>
    <h1
        class="text-4xl font-bold text-center"
        :class="displayMode === 'dark' ? 'text-white' : 'text-black'"
    >
        Players Stats
    </h1>
</template>

<script setup>
defineProps({
    displayMode: {
        type: String,
        default: 'light',
    },
})
</script>
