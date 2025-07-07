<template>
    <div>
        <h1
            class="text-4xl font-bold text-center"
            :class="displayMode === 'dark' ? 'text-white' : 'text-black'"
        >
            {{ title }}
        </h1>
    </div>
</template>

<script setup>
defineProps({
    title: String,
    displayMode: String
})
</script>
