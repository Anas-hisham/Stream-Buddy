<template>
    <div class="mt-15 mb-15">
        <div data-aos="zoom-in">
            <h1
                class="text-4xl font-bold text-center"
                :class="appStore.settings.displayMode === 'dark' ? 'text-white' : 'text-black'"
            >
                Brackets view
            </h1>
        </div>

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
                    :displayMode="appStore.settings.displayMode"
                />
            </div>
        </div>
        <ViewButtons
            :displayMode="appStore.settings.displayMode"
            :onSave="saveToJSON"
            :onClear="clearData"
        />
        <Alert
            v-if="alert.showAlert"
            :alert="alert"
            :displayMode="appStore.settings.displayMode"
            :closeAlert="closeAlert"
        />
        <Confirm
            :show="confirmDialog.show"
            :isPreset="confirmDialog.isPreset"
            :message="confirmDialog.message"
            :displayMode="appStore.settings.displayMode"
            :onCancel="handleCancel"
            :onConfirm="handleConfirm"
        />
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import TeamInputs from '../components/brackets/TeamInputs.vue'
import Alert from '../components/common/Alert.vue'
import Confirm from '../components/common/Confirm.vue'
import ViewButtons from '../components/common/ViewButtons.vue'
import { useConfirmDialog } from '../composables/useConfirmDialog'
import { useAlert } from '../composables/useAlert'
import { useImageHandling } from '../composables/useImageHandling'
import { useAppStore } from '../stores/appStore'

const appStore = useAppStore()

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
