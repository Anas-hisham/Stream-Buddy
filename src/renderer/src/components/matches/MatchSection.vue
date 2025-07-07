<script setup>
import MatchHeader from './MatchHeader.vue'
import MatchTimeInput from './MatchTimeInput.vue'
import TeamNameInput from './TeamNameInput.vue'
import LogoFlagUpload from './LogoFlagUpload.vue'

defineProps({
    match: {
        type: Object,
        required: true,
    },
    matchIndex: {
        type: Number,
        required: true,
    },
    displayMode: {
        type: String,
        default: 'dark',
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
    <div>
        <MatchHeader :matchIndex="matchIndex" :displayMode="displayMode" />

        <div
            class="p-4 grid gap-6"
            :class="displayMode === 'dark' ? 'bg-[#1f2937]' : 'bg-gray-100'"
        >
            <MatchTimeInput :match="match" :matchIndex="matchIndex" :displayMode="displayMode" />

            <div class="grid grid-cols-2 gap-4">
                <TeamNameInput
                    side="left"
                    :match="match"
                    :matchIndex="matchIndex"
                    :displayMode="displayMode"
                />
                <TeamNameInput
                    side="right"
                    :match="match"
                    :matchIndex="matchIndex"
                    :displayMode="displayMode"
                />
            </div>

            <div class="grid grid-cols-2 gap-4">
                <LogoFlagUpload
                    type="logo"
                    side="left"
                    :match="match"
                    :matchIndex="matchIndex"
                    :uploadImage="uploadImage"
                    :removeImage="removeImage"
                />
                <LogoFlagUpload
                    type="logo"
                    side="right"
                    :match="match"
                    :matchIndex="matchIndex"
                    :uploadImage="uploadImage"
                    :removeImage="removeImage"
                />
                <LogoFlagUpload
                    type="flag"
                    side="left"
                    :match="match"
                    :matchIndex="matchIndex"
                    :uploadImage="uploadImage"
                    :removeImage="removeImage"
                />
                <LogoFlagUpload
                    type="flag"
                    side="right"
                    :match="match"
                    :matchIndex="matchIndex"
                    :uploadImage="uploadImage"
                    :removeImage="removeImage"
                />
            </div>
        </div>
    </div>
</template>
