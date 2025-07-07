<template>
    <div class="mb-5">
        <label
            :class="[
                'block text-sm font-medium mb-2',
                displayMode === 'dark' ? 'text-gray-200' : 'text-gray-700',
            ]"
        >
            Display Mode
        </label>
        <select
            v-model="settings.displayMode"
            class="w-full p-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            :class="
                displayMode === 'dark'
                    ? 'bg-gray-700 text-white border-gray-600'
                    : 'bg-white text-gray-900 border-gray-300'
            "
        >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
        </select>
    </div>
</template>

<script setup>
defineProps({
    settings: Object,
    displayMode: String,
})
</script>
