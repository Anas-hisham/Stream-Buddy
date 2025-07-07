<template>
    <div :class="['rounded-lg shadow-md p-6', displayMode === 'dark' ? 'bg-gray-700' : 'bg-white']">
        <h2 class="text-xl font-semibold mb-4 flex justify-center gap-2">Storage Settings</h2>
        <div class="flex flex-col justify-between gap-5">
            <div class="flex flex-col">
                <label
                    :class="[
                        'block text-sm font-medium mb-2',
                        displayMode === 'dark' ? 'text-gray-200' : 'text-gray-700',
                    ]"
                >
                    Save JSONs Location
                </label>
                <input
                    v-model="settings.savePath"
                    type="text"
                    :placeholder="folderPath ? folderPath : settings.savePath"
                    class="flex-grow p-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    :class="
                        displayMode === 'dark'
                            ? 'bg-gray-700 text-white border-gray-600'
                            : 'bg-white text-gray-900 border-gray-300'
                    "
                />
            </div>
            <div class="flex justify-between gap-2">
                <button
                    @click="selectFolder"
                    class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2.5 rounded-lg shadow transition-colors"
                    :class="
                        displayMode === 'dark' ? 'bg-gray-600 hover:bg-gray-500 text-white' : ''
                    "
                >
                    Browse
                </button>
                <button
                    @click="resetSavePath"
                    class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2.5 rounded-lg shadow transition-colors"
                    :class="
                        displayMode === 'dark' ? 'bg-gray-600 hover:bg-gray-500 text-white' : ''
                    "
                >
                    Reset
                </button>
                <button
                    @click="applySavePath"
                    class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg shadow transition-colors"
                >
                    Apply
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    settings: Object,
    folderPath: String,
    selectFolder: Function,
    applySavePath: Function,
    resetSavePath: Function,
    displayMode: String,
})
</script>
