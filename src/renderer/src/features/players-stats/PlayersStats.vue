<template>
    <div class="my-15">
        <ViewTitle title="Players Stats" />

        <div class="flex justify-center mt-6">
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
        <ViewButtons :onSave="saveToJSON" :onClear="clearData" />
        <Confirm
            :show="confirmDialog.show"
            :isPreset="confirmDialog.isPreset"
            :message="confirmDialog.message"
            :onCancel="handleCancel"
            :onConfirm="handleConfirm"
        />
        <AlertComponent v-if="alert.showAlert" :alert="alert" :closeAlert="closeAlert" />
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import ViewTitle from '../../shared/components/ViewTitle.vue'
import PlayerStatsForm from './components/PlayerStatsForm.vue'
import AlertComponent from '../../shared/components/Alert.vue'
import ViewButtons from '../../shared/components/ViewButtons.vue'
import Confirm from '../../shared/components/Confirm.vue'
import { useConfirmDialog } from '../../shared/composables/useConfirmDialog'
import { useAlert } from '../../shared/composables/useAlert'
import { useImageHandling } from '../../shared/composables/useImageHandling'
import { useAppStore } from '../../shared/stores'

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
