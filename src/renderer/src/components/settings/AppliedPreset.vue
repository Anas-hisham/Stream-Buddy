<template>
    <div
        v-if="lastAppliedPreset"
        class="p-4 rounded-lg flex items-center justify-center"
        :class="displayMode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'"
    >
        <span
            class="font-medium mr-2"
            :class="displayMode === 'dark' ? 'text-gray-200' : 'text-gray-700'"
        >
            Active Preset:
        </span>
        <span class="font-bold" :class="displayMode === 'dark' ? 'text-blue-300' : 'text-blue-600'">
            {{ lastAppliedPreset }}
        </span>
    </div>
</template>

<script setup>
const props = defineProps({
    lastAppliedPreset: {
        type: String,
        default: null,
    },
    displayMode: {
        type: String,
        default: 'light',
    },
})
</script>
