<template>
    <div data-aos="zoom-in" data-aos-offset="120">
        <div class="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-6 items-center gap-4 py-4">
            <TeamImageField
                :teamImage="teamImages[index]"
                :index="index"
                :onAddClick="openTeamImageOrFlagDialog"
                :onRemoveClick="removeTeamImageOrFlag"
            />

            <TeamFlagField
                :teamFlag="teamFlags[index]"
                :index="index"
                :onAddClick="openTeamImageOrFlagDialog"
                :onRemoveClick="removeTeamImageOrFlag"
            />

            <TeamInput title="Team Name" :team="team" />

            <TeamInput title="Team Score" :team="team" />
        </div>
    </div>
</template>

<script setup>
import TeamImageField from './TeamImageField.vue'
import TeamFlagField from './TeamFlagField.vue'
import TeamInput from './TeamInput.vue'

defineProps({
    team: Object,
    index: Number,
    teamImages: Array,
    teamFlags: Array,
    openTeamImageOrFlagDialog: Function,
    removeTeamImageOrFlag: Function
})
</script>
