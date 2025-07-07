<template>
    <div data-aos="zoom-in" data-aos-offset="120">
        <div class="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-6 items-center gap-4 py-4">
            <!-- Team Image Component -->
            <TeamImageField
                :teamImage="teamImages[index]"
                :displayMode="displayMode"
                :index="index"
                :onAddClick="openTeamImageOrFlagDialog"
                :onRemoveClick="removeTeamImageOrFlag"
            />

            <!-- Team Flag Component -->
            <TeamFlagField
                :teamFlag="teamFlags[index]"
                :displayMode="displayMode"
                :index="index"
                :onAddClick="openTeamImageOrFlagDialog"
                :onRemoveClick="removeTeamImageOrFlag"
            />

            <!-- Team Name Component -->
            <TeamNameField :team="team" :displayMode="displayMode" />

            <!-- Team Score Component -->
            <TeamScoreField :team="team" :displayMode="displayMode" />
        </div>
    </div>
</template>

<script setup>
import TeamImageField from '../brackets/TeamImageField.vue'
import TeamFlagField from '../brackets/TeamFlagField.vue'
import TeamNameField from '../brackets/TeamNameField.vue'
import TeamScoreField from '../brackets/TeamScoreField.vue'
defineProps({
    team: Object,
    index: Number,
    teamImages: Array,
    teamFlags: Array,
    openTeamImageOrFlagDialog: Function,
    removeTeamImageOrFlag: Function,

    displayMode: {
        type: String,
        default: 'light',
    },
})
</script>
