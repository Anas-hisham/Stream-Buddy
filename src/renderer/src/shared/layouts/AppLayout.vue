<template>
    <div
        :class="[
            'flex flex-col transition-colors duration-300 relative',
            appStore.isDarkMode ? 'bg-[#2a3444] text-white' : 'bg-white text-black',
        ]"
    >
        <AppToolbar />
        <div class="grid grid-cols-15 pt-15">
            <SideNav
                :class="[
                    appStore.isFullNavMode
                        ? 'col-span-4 md:col-span-3 lg:col-span-3 xl:col-span-2 '
                        : 'col-span-2  md:col-span-1',
                ]"
            />
            <MainContent />
        </div>
        <UpdateModal />
    </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import AOS from 'aos'
import { useAppStore } from '../stores/index'
import AppToolbar from './AppToolbar.vue'
import SideNav from './SideNav.vue'
import MainContent from './MainContent.vue'
import UpdateModal from './UpdateModal.vue'

const route = useRoute()
const appStore = useAppStore()

onMounted(async () => {
    initializeAnimation()
    await appStore.initializeSettings()
})

watch(() => appStore.settings, appStore.handleSettingsChange, { deep: true })
watch(() => route.path, initializeAnimation)

function initializeAnimation() {
    AOS.refresh()
}
</script>
