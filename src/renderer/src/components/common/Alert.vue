<script setup>
const props = defineProps({
    alert: {
        type: Object,
        required: true,
    },
    displayMode: {
        type: String,
        default: 'dark',
    },
    closeAlert: {
        type: Function,
        required: true,
    },
})
</script>

<template>
    <div
        v-if="props.alert.showAlert"
        class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
        @click.self="props.closeAlert"
    >
        <div
            class="relative p-6 rounded-xl shadow-2xl w-[90%] max-w-md text-center transition-all"
            :class="props.displayMode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'"
        >
            <button
                @click="props.closeAlert"
                class="absolute top-3 right-3 text-gray-400 hover:text-red-600 text-2xl font-bold"
            >
                ×
            </button>

            <p class="mb-6 text-base">{{ props.alert.text }}</p>

            <button
                class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                @click="props.closeAlert"
            >
                OK
            </button>
        </div>
    </div>
</template>
