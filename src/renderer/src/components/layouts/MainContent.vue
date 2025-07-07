<template>
    <main
        :class="[
            'main-content px-4 sm:px-8 md:px-12 lg:px-15 min-h-full transition-colors duration-500',
            appStore.settings.navMode === 'full'
                ? 'col-span-11 xs:col-span-10 sm:col-span-11 md:col-span-12 lg:col-span-13'
                : 'col-span-14 xs:col-span-14 sm:col-span-14 lg:col-span-14',
            appStore.settings.displayMode === 'dark'
                ? 'bg-[#2a3444] text-white'
                : 'bg-white text-black',
        ]"
    >
        <component
            :is="currentViewComponent"
            v-if="currentViewComponent"
            v-bind="currentViewProps"
        />
        <Spinner v-else />
    </main>
</template>

<script setup>
import { computed } from 'vue';
import { useAppStore } from '../../stores/index';
import Spinner from '../common/Spinner.vue';

import Welcome from '../../views/Welcome.vue';
import Brackets from '../../views/Brackets.vue';
import PlayersStats from '../../views/PlayersStats.vue';
import TodaysMatches from '../../views/TodaysMatches.vue';
import Settings from '../../views/Settings.vue';
import ViewBuilder from '../../views/ViewBuilder.vue';
import CustomView from '../../views/CustomView.vue';

const appStore = useAppStore();

const props = defineProps({
    path: String,
});

const staticRoutes = {
    '/welcome': Welcome,
    '/brackets': Brackets,
    '/players': PlayersStats,
    '/matches': TodaysMatches,
    '/settings': Settings,
    '/view-builder': ViewBuilder,
};

// Compute the current view component based on the path
const currentViewComponent = computed(() => {
    // Check if path matches any static route
    if (staticRoutes[props.path]) {
        return staticRoutes[props.path];
    }

    // Check if path matches any custom view
    const isCustomView = appStore.allViews.some(
        (view) => view.path === props.path && view.config
    );

    return isCustomView ? CustomView : null;
});

// Compute props to pass to the current view component
const currentViewProps = computed(() => {
    if (props.path === '/view-builder') {
        return {
            displayMode: appStore.settings.displayMode,
            settings: appStore.settings,
            allViews: appStore.allViews,
            setSettings: appStore.setSettings,
        };
    }

    if (appStore.allViews.some((view) => view.path === props.path && view.config)) {
        return {
            displayMode: appStore.settings.displayMode,
            allViews: appStore.allViews,
            setSettings: appStore.setSettings,
        };
    }

    return {};
});
</script>
