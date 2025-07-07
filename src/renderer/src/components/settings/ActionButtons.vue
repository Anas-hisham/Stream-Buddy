<template>
    <div
        :class="[
            'rounded-lg shadow-md p-6 mb-8',
            displayMode === 'dark' ? 'bg-gray-700' : 'bg-white',
        ]"
    >
        <h2 class="text-xl font-semibold mb-4 flex justify-center gap-2">Danger Zone</h2>
        <div class="flex justify-around gap-4 my-8">
            <button
                @click="onReset"
                class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg shadow-sm transition-colors"
            >
                Reset to Defaults
            </button>
            <button
                @click="clearInputs"
                class="bg-red-800 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg shadow-sm transition-colors"
            >
                Clear Inputs Data
            </button>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    onReset: {
        type: Function,
        required: true,
    },
    displayMode: String,
    clearInputs: Function,
})
</script>
