<script setup>
import { useAppStore } from '../stores'
const appStore = useAppStore()
const props = defineProps({
    show: Boolean,
    isPreset: Boolean,
    message: String,
    onCancel: Function,
    onConfirm: Function,
})
</script>

<template>
    <div
        v-if="show"
        class="fixed inset-0 bg-black/30 backdrop-blur-sm center-center z-50"
        @click.self="onCancel"
    >
        <div
            class="relative p-6 rounded-xl shadow-2xl w-[90%] max-w-md text-center transition-all"
            :class="appStore.isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'"
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
                        class="flex-1 px-4 py-2 rounded-lg text-white transition duration-300"
                        :class="
                            appStore.isDarkMode
                                ? 'gray-button-dark'
                                : 'bg-gray-500 hover:bg-gray-600'
                        "
                        @click="onConfirm(false)"
                    >
                        Create New Preset
                    </button>
                    <button
                        class="flex-1 blue-button px-4 py-2 rounded-lg"
                        @click="onConfirm(true)"
                    >
                        Update
                    </button>
                </template>
                <template v-else>
                    <button
                        class="flex-1 px-4 py-2 rounded-lg text-white transition duration-300"
                        :class="
                            appStore.isDarkMode
                                ? 'gray-button-dark'
                                : 'bg-gray-500 hover:bg-gray-600'
                        "
                        @click="onCancel"
                    >
                        Cancel
                    </button>
                    <button class="flex-1 red-button px-4 py-2 rounded-lg" @click="onConfirm">
                        Confirm
                    </button>
                </template>
            </div>
        </div>
    </div>
</template>
