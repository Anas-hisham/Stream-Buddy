<template>
    <div data-aos="zoom-in">
        <h1
            class="text-4xl font-bold text-center"
            :class="displayMode === 'dark' ? 'text-white' : 'text-gray-900'"
        >
            {{
                currentViewBeingEdited
                    ? `Edit View: ${currentViewBeingEdited.title}`
                    : 'View Builder'
            }}
        </h1>
    </div>
</template>

<script setup>
defineProps({
    currentViewBeingEdited: {
        type: Object,
        default: null
    },
    displayMode: {
        type: String,
        required: true
    }
});
</script>
