<script setup>
const props = defineProps({
    show: Boolean,
    isPreset: Boolean,
    message: String,
    displayMode: {
        type: String,
        default: 'dark',
    },
    onCancel: Function,
    onConfirm: Function,
})
</script>

<template>
    <div
        v-if="show"
        class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
        @click.self="onCancel"
    >
        <div
            class="relative p-6 rounded-xl shadow-2xl w-[90%] max-w-md text-center transition-all"
            :class="displayMode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'"
        >
            <button
                @click="onCancel"
                class="absolute top-3 right-3 text-gray-400 hover:text-red-600 text-2xl font-bold"
            >
                ×
            </button>

            <p class="mb-6 text-base">{{ message }}</p>

            <div class="flex gap-3">
                <template v-if="isPreset">
                    <button
                        class="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
                        @click="onConfirm(false)"
                    >
                        Create New Preset
                    </button>
                    <button
                        class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                        @click="onConfirm(true)"
                    >
                        Update
                    </button>
                </template>
                <template v-else>
                    <button
                        class="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
                        @click="onCancel"
                    >
                        Cancel
                    </button>
                    <button
                        class="flex-1 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg transition"
                        @click="onConfirm"
                    >
                        Confirm
                    </button>
                </template>
            </div>
        </div>
    </div>
</template>
