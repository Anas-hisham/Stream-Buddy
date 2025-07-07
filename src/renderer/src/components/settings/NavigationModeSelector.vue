<template>
    <div>
        <label
            :class="['block text-sm font-medium mb-2', displayMode ==='dark' ? 'text-gray-200' : 'text-gray-700']"
        >
            Navigation Mode
        </label>
        <select
            v-model="settings.navMode"
            class="w-full p-2.5 rounded-lg border focus:outline-none  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            :class="
                displayMode ==='dark'
                    ? 'bg-gray-700 text-white border-gray-600'
                    : 'bg-white text-gray-900 border-gray-300'
            "
        >
            <option value="full">Full</option>
            <option value="mini">Mini</option>
        </select>
    </div>
</template>

<script setup>
defineProps({
    settings: Object,
    displayMode: String,
})
</script>
