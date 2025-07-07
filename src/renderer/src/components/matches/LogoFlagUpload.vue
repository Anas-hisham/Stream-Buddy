<script setup>
defineProps({
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
</script>

<template>
    <div class="flex justify-between items-center border px-4 py-2">
        <span class="opacity-60"
            >{{ side === 'left' ? 'Left' : 'Right' }} Team
            {{ type === 'logo' ? 'Logo' : 'Flag' }}</span
        >
        <div class="flex items-center gap-2">
            <img
                v-if="
                    match[matchIndex === 0 ? 'firstMatchImages' : 'secondMatchImages'][
                        `${side}Team${type === 'logo' ? 'Logo' : 'Flag'}`
                    ]
                "
                :src="
                    match[matchIndex === 0 ? 'firstMatchImages' : 'secondMatchImages'][
                        `${side}Team${type === 'logo' ? 'Logo' : 'Flag'}`
                    ]
                "
                class="w-8 h-8 object-cover cursor-pointer"
                @click="uploadImage(matchIndex, `${side}Team${type === 'logo' ? 'Logo' : 'Flag'}`)"
                title="Click to change image"
            />
            <button
                v-if="
                    match[matchIndex === 0 ? 'firstMatchImages' : 'secondMatchImages'][
                        `${side}Team${type === 'logo' ? 'Logo' : 'Flag'}`
                    ]
                "
                class="text-red-600 font-semibold hover:underline"
                @click="removeImage(matchIndex, `${side}Team${type === 'logo' ? 'Logo' : 'Flag'}`)"
            >
                Delete
            </button>
            <button
                v-else
                class="text-green-400 font-semibold cursor-pointer"
                @click="uploadImage(matchIndex, `${side}Team${type === 'logo' ? 'Logo' : 'Flag'}`)"
            >
                + ADD
            </button>
        </div>
    </div>
</template>
