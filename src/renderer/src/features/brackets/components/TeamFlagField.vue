<template>
    <div
        class="img-input cursor-pointer lg:col-span-2 md:col-span-2 px-4 h-14 flex items-center justify-between gap-3 rounded-md overflow-hidden"
        :class="
            appStore.isDarkMode ? 'bg-[#1f2937] text-white' : 'bg-gray-100 text-black shadow-md'
        "
        @click="onAddClick(index, 'flag')"
    >
        <span class="text-sm truncate">Team Flag</span>

        <div v-if="teamFlag" class="flex items-center gap-2 max-w-full overflow-hidden">
            <img
                :src="teamFlag"
                alt="Team Flag"
                class="img h-12.5 w-12.5"
                title="Click to change flag"
            />
            <button
                type="button"
                class="img-delete"
                @click.stop="onRemoveClick(index, 'flag')"
                title="Delete flag"
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
    teamFlag: String,
    index: Number,
    onAddClick: Function,
    onRemoveClick: Function,
})
</script>
