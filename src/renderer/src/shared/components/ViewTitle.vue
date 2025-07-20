<template>
    <div data-aos="zoom-in">
        <h1 class="text-4xl font-bold text-center">{{ title }}</h1>
    </div>
</template>

<script setup>
defineProps({
    title: String,
})
</script>
