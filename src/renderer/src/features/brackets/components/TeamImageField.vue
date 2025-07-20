<template>
    <div
        class="img-input cursor-pointer lg:col-span-2 md:col-span-2 px-4 h-14 flex items-center justify-between gap-3 rounded-md overflow-hidden"
        :class="
            appStore.isDarkMode ? 'bg-[#1f2937] text-white' : 'bg-gray-100 text-black shadow-md'
        "
        @click="onAddClick(index, 'image')"
    >
        <span class="text-sm truncate">Team Image</span>

        <div v-if="teamImage" class="flex items-center gap-2 max-w-full overflow-hidden">
            <img
                :src="teamImage"
                alt="Team Image"
                class="img h-12.5 w-12.5"
                title="Click to change image"
            />
            <button
                type="button"
                class="img-delete"
                @click.stop="onRemoveClick(index, 'image')"
                title="Delete image"
            >
                Delete
            </button>
        </div>

        <span v-else class="img-add"> + ADD </span>
    </div>
</template>

<script setup>
import { useAppStore } from '../../../shared/stores'

const appStore = useAppStore()
const props = defineProps({
    teamImage: String,
    index: Number,
    onAddClick: Function,
    onRemoveClick: Function,
})
</script>
