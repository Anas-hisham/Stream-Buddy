<script setup>
import { computed } from 'vue'

const props = defineProps({
    type: {
        type: String,
        required: true,
        validator: (value) => ['logo', 'flag'].includes(value),
    },
    side: {
        type: String,
        required: true,
        validator: (value) => ['left', 'right'].includes(value),
    },
    match: {
        type: Object,
        required: true,
    },
    matchIndex: {
        type: Number,
        required: true,
    },
    uploadImage: {
        type: Function,
        required: true,
    },
    removeImage: {
        type: Function,
        required: true,
    },
})

// Compute image key and value
const imageKey = computed(() => `${props.side}Team${props.type === 'logo' ? 'Logo' : 'Flag'}`)
const image = computed(
    () =>
        props.match[props.matchIndex === 0 ? 'firstMatchImages' : 'secondMatchImages'][
            imageKey.value
        ],
)
const label = computed(
    () =>
        `${props.side === 'left' ? 'Left' : 'Right'} Team ${props.type === 'logo' ? 'Logo' : 'Flag'}`,
)
</script>

<template>
    <div
        class="px-3 h-14 max-h-14 img-input border flex items-center justify-between gap-3 rounded-md cursor-pointer"
        @click="uploadImage(matchIndex, imageKey)"
    >
        <span class="text-sm opacity-60 truncate">{{ label }}</span>

        <div v-if="image" class="flex items-center gap-2 max-w-full overflow-hidden">
            <img :src="image" alt="Team Image" class="img h-12.5 w-12.5" title="Click to change" />
            <button
                type="button"
                class="img-delete"
                @click.stop="removeImage(matchIndex, imageKey)"
                title="Delete image"
            >
                Delete
            </button>
        </div>

        <span v-else class="img-add"> + ADD </span>
    </div>
</template>
