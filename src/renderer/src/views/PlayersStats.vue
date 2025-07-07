<template>
    <div class="mt-15 mb-15">
        <div data-aos="zoom-in">
            <PlayerStatsTitle :displayMode="appStore.settings.displayMode" />
        </div>

        <div class="flex justify-center mt-5">
            <div class="w-full grid gap-6">
                <div data-aos="zoom-in">
                    <PlayerStatsForm
                        v-for="(player, index) in players"
                        :key="index"
                        :player="player"
                        :index="index"
                        :displayMode="appStore.settings.displayMode"
                        :heroImage="heroImages[index]"
                        :onImageChange="handleOpenHeroImage"
                        :onImageRemove="handleRemoveHeroImage"
                    />
                </div>
            </div>
        </div>
        <ViewButtons
            :displayMode="appStore.settings.displayMode"
            :onSave="saveToJSON"
            :onClear="clearData"
        />
        <Confirm
            :show="confirmDialog.show"
            :isPreset="confirmDialog.isPreset"
            :message="confirmDialog.message"
            :displayMode="appStore.settings.displayMode"
            :onCancel="handleCancel"
            :onConfirm="handleConfirm"
        />
        <AlertComponent
            v-if="alert.showAlert"
            :alert="alert"
            :displayMode="appStore.settings.displayMode"
            :closeAlert="closeAlert"
        />
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import PlayerStatsTitle from '../components/playersStats/PlayerStatsTitle.vue'
import PlayerStatsForm from '../components/playersStats/PlayerStatsForm.vue'
import AlertComponent from '../components/common/Alert.vue'
import ViewButtons from '../components/common/ViewButtons.vue'
import Confirm from '../components/common/Confirm.vue'
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
const players = ref([createEmptyPlayer()])
const heroImages = ref([''])

function createEmptyPlayer() {
    return {
        playerName: '',
        teamName: '',
        favouriteWeapon: '',
        economyScore: '',
        heroImage: '',
        kills: '',
        deaths: '',
        assists: '',
    }
}

// Image handling
async function handleOpenHeroImage(index) {
    const imagePath = await uploadImage()
    if (!imagePath) return

    removeImage(heroImages.value[index])
    players.value[index].heroImage = imagePath
    heroImages.value[index] = await loadImage(imagePath)
}

function handleRemoveHeroImage(index) {
    removeImage(heroImages.value[index])
    heroImages.value[index] = ''
    players.value[index].heroImage = ''
}

// Data operations
async function saveToJSON() {
    try {
        await window.myAPI.savePlayer(JSON.stringify(players.value[0]))
        showAlert('Player saved successfully!')
    } catch (err) {
        console.error('Error saving player:', err)
        window.myAPI.logError(`Error saving player: ${err.message}`)
    }
}

async function clearData() {
    const shouldOverwrite = await showConfirm(
        `Are you sure you want to clear data in this view?`,
        false,
    )
    if (shouldOverwrite) {
        heroImages.value.forEach(removeImage)
        players.value = [createEmptyPlayer()]
        heroImages.value = ['']
    }
}

async function loadCachedPlayers() {
    try {
        const cached = await window.myAPI.loadPlayerCache()
        if (!Array.isArray(cached)) return

        players.value = cached
        heroImages.value = []

        for (let i = 0; i < cached.length; i++) {
            if (cached[i].heroImage) {
                heroImages.value[i] = await loadImage(cached[i].heroImage)
            } else {
                heroImages.value[i] = ''
            }
        }
    } catch (err) {
        console.error('Error loading player cache:', err)
        window.myAPI.logError(`Error loading player cache: ${err.message}`)
    }
}

// Lifecycle hooks
onMounted(() => {
    loadCachedPlayers()
})

// Watchers
watch(
    players,
    () => {
        window.myAPI.savePlayerCache(JSON.stringify(players.value))
    },
    { deep: true },
)
</script>
