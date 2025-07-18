<template>
    <div class="my-15">
        <ViewTitle title="Today's Matches" />

        <div class="mt-6">
            <div data-aos="zoom-in">
                <InfoSection :matchInfo="matchInfo" />
            </div>

            <MatchSection
                v-for="(match, matchIndex) in matches"
                :key="matchIndex"
                :match="match"
                :matchIndex="matchIndex"
                :uploadImage="handleuploadImage"
                :removeImage="handleRemoveImage"
            />
        </div>
    </div>
    <ViewButtons :onSave="saveToJSON" :onClear="clearData" />

    <Confirm
        :show="confirmDialog.show"
        :isPreset="confirmDialog.isPreset"
        :message="confirmDialog.message"
        :onCancel="handleCancel"
        :onConfirm="handleConfirm"
    />
    <AlertComponent v-if="alert.showAlert" :alert="alert" :closeAlert="closeAlert" />
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import MatchSection from './components/MatchSection.vue'
import InfoSection from './components/InfoSection.vue'
import AlertComponent from '../../shared/components/Alert.vue'
import ViewButtons from '../../shared/components/ViewButtons.vue'
import Confirm from '../../shared/components/Confirm.vue'
import { useConfirmDialog } from '../../shared/composables/useConfirmDialog'
import { useAlert } from '../../shared/composables/useAlert'
import { useImageHandling } from '../../shared/composables/useImageHandling'
import { useAppStore } from '../../shared/stores'
import ViewTitle from '../../shared/components/ViewTitle.vue'

const appStore = useAppStore()

// Composable functions
const { confirmDialog, showConfirm, handleCancel, handleConfirm } = useConfirmDialog()
const { alert, showAlert, closeAlert } = useAlert()
const { uploadImage, loadImage, removeImage } = useImageHandling()

// State
const matchInfo = ref({ date: '' })
const matches = ref(
    Array(2)
        .fill()
        .map(() => ({
            firstMatch: {
                matchTime: '',
                leftTeamName: '',
                rightTeamName: '',
                leftTeamLogo: '',
                rightTeamLogo: '',
                leftTeamFlag: '',
                rightTeamFlag: ''
            },
            firstMatchImages: {
                leftTeamLogo: '',
                rightTeamLogo: '',
                leftTeamFlag: '',
                rightTeamFlag: ''
            },
            secondMatch: {
                matchTime: '',
                leftTeamName: '',
                rightTeamName: '',
                leftTeamLogo: '',
                rightTeamLogo: '',
                leftTeamFlag: '',
                rightTeamFlag: ''
            },
            secondMatchImages: {
                leftTeamLogo: '',
                rightTeamLogo: '',
                leftTeamFlag: '',
                rightTeamFlag: ''
            }
        }))
)

// Image handling
async function handleuploadImage(matchIndex, field) {
    const imagePath = await uploadImage()
    if (!imagePath) return

    const matchKey = matchIndex === 0 ? 'firstMatch' : 'secondMatch'
    const imagesKey = matchIndex === 0 ? 'firstMatchImages' : 'secondMatchImages'

    // Clean up previous image
    removeImage(matches.value[matchIndex][imagesKey][field])

    matches.value[matchIndex][matchKey][field] = imagePath
    matches.value[matchIndex][imagesKey][field] = await loadImage(imagePath)
}

function handleRemoveImage(matchIndex, field) {
    const matchKey = matchIndex === 0 ? 'firstMatch' : 'secondMatch'
    const imagesKey = matchIndex === 0 ? 'firstMatchImages' : 'secondMatchImages'

    removeImage(matches.value[matchIndex][imagesKey][field])
    matches.value[matchIndex][matchKey][field] = ''
    matches.value[matchIndex][imagesKey][field] = ''
}

// Data operations
async function saveToJSON() {
    try {
        const dataToSave = {
            info: matchInfo.value,
            matches: matches.value.map((match) => ({
                firstMatch: match.firstMatch,
                secondMatch: match.secondMatch
            }))
        }
        await window.myAPI.saveMatches(JSON.stringify(dataToSave))
        showAlert('Matches saved successfully!')
    } catch (err) {
        console.error('Error saving Matches:', err)
        window.myAPI.logError(`Error saving Matches: ${err.message}`)
    }
}

async function clearData() {
    const shouldOverwrite = await showConfirm(
        `Are you sure you want to clear data in this view?`,
        false
    )
    if (shouldOverwrite) {
        matchInfo.value = { date: '' }
        matches.value.forEach((match) => {
            Object.values(match.firstMatchImages).forEach(removeImage)
            Object.values(match.secondMatchImages).forEach(removeImage)
        })
        matches.value = matches.value.map(() => ({
            firstMatch: {
                matchTime: '',
                leftTeamName: '',
                rightTeamName: '',
                leftTeamLogo: '',
                rightTeamLogo: '',
                leftTeamFlag: '',
                rightTeamFlag: ''
            },
            firstMatchImages: {
                leftTeamLogo: '',
                rightTeamLogo: '',
                leftTeamFlag: '',
                rightTeamFlag: ''
            },
            secondMatch: {
                matchTime: '',
                leftTeamName: '',
                rightTeamName: '',
                leftTeamLogo: '',
                rightTeamLogo: '',
                leftTeamFlag: '',
                rightTeamFlag: ''
            },
            secondMatchImages: {
                leftTeamLogo: '',
                rightTeamLogo: '',
                leftTeamFlag: '',
                rightTeamFlag: ''
            }
        }))
    }
}

async function loadDataCache() {
    try {
        const loaded = await window.myAPI.loadMatchesCache()
        if (!loaded) return

        const parsedData = typeof loaded === 'string' ? JSON.parse(loaded) : loaded

        if (parsedData.info) {
            matchInfo.value = { ...matchInfo.value, ...parsedData.info }
        }

        if (Array.isArray(parsedData.matches)) {
            for (let i = 0; i < parsedData.matches.length; i++) {
                const matchData = parsedData.matches[i]

                if (matchData.firstMatch) {
                    matches.value[i].firstMatch = { ...matchData.firstMatch }
                    await loadImageFields(i, 'firstMatch')
                }
                if (matchData.secondMatch) {
                    matches.value[i].secondMatch = { ...matchData.secondMatch }
                    await loadImageFields(i, 'secondMatch')
                }
            }
        }
    } catch (e) {
        console.error('Error loading Matches:', e)
        window.myAPI.logError(`Error loading Matches: ${e.message}`)
    }
}

async function loadImageFields(matchIndex, matchKey) {
    const fields = ['leftTeamLogo', 'rightTeamLogo', 'leftTeamFlag', 'rightTeamFlag']
    const imagesKey = matchKey === 'firstMatch' ? 'firstMatchImages' : 'secondMatchImages'

    for (const field of fields) {
        const path = matches.value[matchIndex][matchKey][field]
        if (path) {
            matches.value[matchIndex][imagesKey][field] = await loadImage(path)
        }
    }
}

// Lifecycle hooks
onMounted(() => {
    loadDataCache()
})

// Watchers
watch(
    [() => matchInfo.value, () => matches.value],
    () => {
        const dataToSave = {
            info: matchInfo.value,
            matches: matches.value.map((match) => ({
                firstMatch: match.firstMatch,
                secondMatch: match.secondMatch
            }))
        }
        window.myAPI.saveMatchesCache(JSON.stringify(dataToSave))
    },
    { deep: true }
)
</script>
