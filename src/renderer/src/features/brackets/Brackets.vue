<template>
    <div class="my-15">
        <ViewTitle title="Brackets view" />

        <div class="flex justify-center mt-6">
            <div class="w-full grid gap-2">
                <TeamInputs
                    v-for="(team, index) in teams"
                    :key="index"
                    :team="team"
                    :index="index"
                    :teamImages="teamImages"
                    :teamFlags="teamFlags"
                    :openTeamImageOrFlagDialog="handleOpenTeamImageOrFlag"
                    :removeTeamImageOrFlag="handleRemoveTeamImageOrFlag"
                />
            </div>
        </div>
        <ViewButtons :onSave="saveToJSON" :onClear="clearData" />
        <Alert v-if="alert.showAlert" :alert="alert" :closeAlert="closeAlert" />
        <Confirm
            :show="confirmDialog.show"
            :isPreset="confirmDialog.isPreset"
            :message="confirmDialog.message"
            :onCancel="handleCancel"
            :onConfirm="handleConfirm"
        />
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import TeamInputs from './components/TeamInputs.vue'
import Alert from '../../shared/components/Alert.vue'
import Confirm from '../../shared/components/Confirm.vue'
import ViewButtons from '../../shared/components/ViewButtons.vue'
import { useConfirmDialog } from '../../shared/composables/useConfirmDialog'
import { useAlert } from '../../shared/composables/useAlert'
import { useImageHandling } from '../../shared/composables/useImageHandling'
import ViewTitle from '../../shared/components/ViewTitle.vue'

// Composable functions
const { confirmDialog, showConfirm, handleCancel, handleConfirm } = useConfirmDialog()
const { alert, showAlert, closeAlert } = useAlert()
const { uploadImage, loadImage, removeImage } = useImageHandling()

// State
const teams = ref([])
const teamImages = ref([])
const teamFlags = ref([])

function createEmptyTeam() {
    return {
        teamImage: '',
        teamFlag: '',
        teamName: '',
        teamScore: '',
    }
}

// Initialize teams
function initializeTeams() {
    teams.value = Array.from({ length: 32 }, createEmptyTeam)
    teamImages.value = Array(32).fill('')
    teamFlags.value = Array(32).fill('')
}

// Image handling
async function handleOpenTeamImageOrFlag(index, type) {
    const imagePath = await uploadImage()
    if (!imagePath) return

    const targetList = type === 'image' ? teamImages : teamFlags
    const teamProp = type === 'image' ? 'teamImage' : 'teamFlag'

    removeImage(targetList.value[index])
    teams.value[index][teamProp] = imagePath
    targetList.value[index] = await loadImage(imagePath)
}

function handleRemoveTeamImageOrFlag(index, type) {
    const targetList = type === 'image' ? teamImages : teamFlags
    const teamProp = type === 'image' ? 'teamImage' : 'teamFlag'

    removeImage(targetList.value[index])
    targetList.value[index] = ''
    teams.value[index][teamProp] = ''
}

// Data operations
async function saveToJSON() {
    try {
        await window.myAPI.saveTeams(JSON.stringify(teams.value))
        showAlert('Teams saved successfully!')
    } catch (err) {
        console.error('Error saving teams:', err)
        window.myAPI.logError(`Error saving teams: ${err.message}`)
    }
}

async function clearData() {
    const shouldOverwrite = await showConfirm(
        `Are you sure you want to clear data in this view?`,
        false,
    )
    if (shouldOverwrite) {
        teamImages.value.forEach(removeImage)
        teamFlags.value.forEach(removeImage)
        initializeTeams()
    }
}

async function loadTeamsFromCache() {
    try {
        const cached = await window.myAPI.loadTeamsCache()
        if (!Array.isArray(cached)) return

        // Initialize empty arrays first
        teamImages.value = Array(cached.length).fill('')
        teamFlags.value = Array(cached.length).fill('')

        for (let i = 0; i < cached.length; i++) {
            if (!teams.value[i]) teams.value[i] = createEmptyTeam()

            teams.value[i].teamName = cached[i].teamName || ''
            teams.value[i].teamScore = cached[i].teamScore || ''

            // Load team image if exists
            if (cached[i].teamImage) {
                teams.value[i].teamImage = cached[i].teamImage
                teamImages.value[i] = await loadImage(cached[i].teamImage)
            }

            // Load team flag if exists
            if (cached[i].teamFlag) {
                teams.value[i].teamFlag = cached[i].teamFlag
                teamFlags.value[i] = await loadImage(cached[i].teamFlag)
            }
        }
    } catch (err) {
        console.error('Error loading teams cache:', err)
        window.myAPI.logError(`Error loading teams cache: ${err.message}`)
    }
}

// Lifecycle hooks
onMounted(() => {
    initializeTeams()
    loadTeamsFromCache()
})

// Watchers
watch(
    teams,
    () => {
        window.myAPI.saveTeamsCache(JSON.stringify(teams.value))
    },
    { deep: true },
)
</script>
