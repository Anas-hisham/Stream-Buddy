<template>
    <main
        :class="[
            'container min-h-[calc(100vh-60px)]',
            appStore.isFullNavMode
                ? 'col-span-11 md:col-span-12 lg:col-span-12 xl:col-span-13'
                : 'col-span-13 md:col-span-14',
        ]"
    >
        <component :is="currentView" v-if="currentView" />
    </main>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '../stores'
import Welcome from '../../pages/Welcome.vue'
import AppOverView from '../../pages/AppOverView.vue'
import Brackets from '../../features/brackets/Brackets.vue'
import PlayersStats from '../../features/players-stats/PlayersStats.vue'
import TodaysMatches from '../../features/todays-matches/TodaysMatches.vue'
import Settings from '../../features/settings/Settings.vue'
import ViewBuilder from '../../features/view-builder/ViewBuilder.vue'
import CustomView from '../../features/custom-view/CustomView.vue'
import { PATHS } from '../constants/paths'
import { withoutInit } from '../utils/withoutPaths'
import AOS from 'aos'

const route = useRoute()
const appStore = useAppStore()

// Check if the current path is a custom view
const currentViewComponent = computed(() => {
    return appStore.allViews.some((view) => view.path === route.path && view.config)
})

// Map of paths to view components
const viewMap = {
    [PATHS.WELCOME]: Welcome,
    [PATHS.OVER_VIEW]: AppOverView,
    [PATHS.TEAMS]: Brackets,
    [PATHS.PLAYERS]: PlayersStats,
    [PATHS.MATCHES]: TodaysMatches,
    [PATHS.SETTINGS]: Settings,
    [PATHS.VIEW_BUILDER]: ViewBuilder,
}

// Dynamically select which component to show
const currentView = computed(() => {
    return viewMap[route.path] || (currentViewComponent.value ? CustomView : null)
})

// Watch for route changes
watch(
    () => route.path,
    (newPath) => {
        if (withoutInit(newPath)) {
            appStore.updateLastViewedPath(newPath)
        }
        AOS.refresh()
    },
)
</script>
