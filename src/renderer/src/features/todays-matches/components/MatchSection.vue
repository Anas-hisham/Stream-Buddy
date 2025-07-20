<script setup>
import MatchHeader from './MatchHeader.vue'
import MatchTimeInput from './MatchTimeInput.vue'
import TeamNameInput from './TeamNameInput.vue'
import LogoFlagUpload from './LogoFlagUpload.vue'
import { useAppStore } from '../../../shared/stores'

const appStore = useAppStore()

defineProps({
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
    <div data-aos="zoom-in">
        <div class="matches mb-7">
            <MatchHeader :matchIndex="matchIndex" />

            <div
                class="p-4 grid gap-6 shadow-md rounded-b-lg"
                :class="appStore.isDarkMode ? 'bg-[#1f2937]' : ''"
            >
                <MatchTimeInput :match="match" :matchIndex="matchIndex" />

                <div class="grid grid-cols-2 gap-4 mt-2">
                    <TeamNameInput side="left" :match="match" :matchIndex="matchIndex" />
                    <TeamNameInput side="right" :match="match" :matchIndex="matchIndex" />
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
    </div>
</template>
