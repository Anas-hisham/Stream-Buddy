<template>
    <div
        :class="[
            'app-container flex h-screen flex-col transition-colors duration-500 relative',
            appStore.isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black',
        ]"
    >
        <AppToolbar />
        <div class="grid grid-cols-15 pt-15">
            <SideNav
                :class="[
                    appStore.isFullNavMode
                        ? 'col-span-4 md:col-span-3 lg:col-span-2'
                        : 'col-span-1 lg:col-span-1',
                ]"
            />
            <MainContent :path="route.path" />
        </div>
        <UpdateModal />
    </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import AOS from 'aos'
import { useAppStore } from '../../stores/index'
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
watch(
    () => route.path,
    (newPath) => {
        appStore.updateLastViewedPath(newPath)
        initializeAnimation()
    },
)

function initializeAnimation() {
    AOS.refresh()
}
</script>

<!--
<template>
    <div
        :class="[
            'app-container flex h-screen flex-col transition-colors duration-500 relative',
            appStore.isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black',
        ]"
    >
        <AppToolbar />

        <div class="mt-15">
            <Splitpanes
                :class="[appStore.isDarkMode ? 'bg-[#2a3444] text-white' : 'bg-white text-black']"
            >
                <Pane min-size="5" max-size="20">
                    <SideNav />
                </Pane>
                <Pane min-size="80">
                    <MainContent :path="route.path" />
                </Pane>
            </Splitpanes>
        </div>

        <UpdateModal />
    </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

import AOS from 'aos'
import { useAppStore } from '../../stores/index'
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
watch(
    () => route.path,
    (newPath) => {
        appStore.updateLastViewedPath(newPath)
        initializeAnimation()
    },
)

function initializeAnimation() {
    AOS.refresh()
}
</script>
<style>
.splitpanes__splitter {
    background-color: #e5e7eb4b;
    width: 5px;
    cursor: col-resize;
    transition: all 0.3s;
    z-index: 1000;
    border-radius: 10px;
}
</style>

-->
