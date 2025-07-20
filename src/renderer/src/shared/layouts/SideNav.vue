<template>
    <nav
        :class="[
            'transition-all duration-300 flex flex-col relative items-center',
            appStore.isDarkMode ? 'bg-[#2a3444] shadow-md' : 'bg-white border-gray-100 shadow-sm',
        ]"
    >
        <!-- Toggle Button - Only visible in builder mode -->
        <div
            @click="toggleBuilderMode"
            v-if="isBuilder"
            class="fixed w-10 h-10 center-center rounded-full cursor-pointer z-10"
            :class="[appStore.isDarkMode ? 'gray-button-dark' : 'gray-button-light']"
        >
            <i class="pi pi-arrow-left"></i>
        </div>

        <div class="center-center h-[calc(100vh-60px)] fixed">
            <!-- Builder Components - Only shown in builder mode -->
            <div class="flex flex-col items-start w-full px-4" v-if="isBuilder">
                <FieldTypesPalette />
                <SectionTypesPalette />
            </div>

            <!-- Navigation Items - Only shown when NOT in builder mode -->
            <div data-aos="fade-right" data-aos-offset="0" v-if="!isBuilder">
                <ul
                    class="space-y-1 px-2"
                    :class="appStore.visibleViews.length > 7 ? 'mb-20' : 'mb-0'"
                >
                    <li v-for="view in appStore.visibleViews" :key="view.path" class="">
                        <div v-if="viewTemplates(view.path)">
                            <router-link
                                :to="view.path"
                                :class="[
                                    'group mx-1 flex items-center py-3 rounded-xl transition-all duration-300 w-[98%]',
                                    'hover:shadow-md',
                                    appStore.isFullNavMode
                                        ? 'justify-start  hover:translate-x-1'
                                        : 'justify-center',
                                    appStore.isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
                                    route.path === view.path
                                        ? appStore.isDarkMode
                                            ? 'bg-blue-900/50 text-white shadow-lg'
                                            : 'bg-blue-100 text-blue-600 shadow-lg'
                                        : appStore.isDarkMode
                                          ? 'text-white'
                                          : 'text-black',
                                ]"
                                :title="!appStore.isFullNavMode ? view.title : ''"
                            >
                                <span v-if="appStore.isFullNavMode" class="ml-3 font-medium">
                                    {{ view.title }}
                                </span>
                                <span
                                    v-else
                                    class="font-bold text-lg"
                                    :class="
                                        route.path === view.path
                                            ? appStore.isDarkMode
                                                ? 'text-white'
                                                : 'text-blue-600'
                                            : ''
                                    "
                                >
                                    {{ getFirstLetter(view.title) }}
                                </span>

                                <!-- Active indicator -->
                                <span
                                    v-if="route.path === view.path"
                                    class="absolute left-0 w-1 h-6 rounded-r-full"
                                    :class="appStore.isDarkMode ? 'bg-blue-400' : 'bg-blue-500'"
                                ></span>
                            </router-link>
                        </div>
                    </li>

                    <!-- Add New View Button -->
                    <li class="builder pt-4">
                        <router-link
                            :to="PATHS.VIEW_BUILDER"
                            @click="enterBuilderMode"
                            :class="[
                                'group flex items-center p-3 rounded-xl transition-all duration-300',
                                'hover:shadow-md',
                                appStore.isFullNavMode ? 'justify-start' : 'justify-center',
                                appStore.isDarkMode
                                    ? ' text-green-400'
                                    : 'hover:bg-gray-50 text-green-600',
                                route.path === PATHS.VIEW_BUILDER
                                    ? appStore.isDarkMode
                                        ? 'bg-gray-700 shadow-lg'
                                        : 'bg-gray-50 shadow-lg'
                                    : '',
                            ]"
                            :title="!appStore.isFullNavMode ? 'New View' : ''"
                        >
                            <div
                                class="flex items-center justify-center rounded-full p-2"
                                :class="
                                    appStore.isDarkMode
                                        ? 'bg-green-900/30 group-hover:bg-green-900/50'
                                        : 'bg-green-100 group-hover:bg-green-200'
                                "
                            >
                                <i
                                    class="pi pi-plus transition-all duration-300 group-hover:scale-125"
                                ></i>
                            </div>
                            <span class="ml-2 font-medium" v-if="appStore.isFullNavMode"
                                >New View</span
                            >
                        </router-link>
                    </li>
                </ul>
            </div>

            <!-- Settings Button - Only shown when NOT in builder mode -->
            <div class="settings absolute bottom-5 pt-2 border-t border-zinc-500">
                <div data-aos="fade-right" data-aos-offset="0">
                    <router-link
                        :to="PATHS.SETTINGS"
                        :class="[
                            'group flex items-center p-3 rounded-xl transition-all ',
                            'hover:shadow-md ',
                            appStore.isFullNavMode ? 'justify-start' : 'justify-center',
                            route.path === PATHS.SETTINGS
                                ? appStore.isDarkMode
                                    ? 'bg-gray-700 shadow-lg text-white'
                                    : 'bg-gray-50 shadow-lg text-black'
                                : '',
                        ]"
                        :title="!appStore.isFullNavMode ? TITLES.SETTINGS : ''"
                        @click="appStore.openSettings"
                    >
                        <div class="center-center rounded-full">
                            <i
                                class="pi pi-cog animate-spin-slow transition-transform duration-500 group-hover:rotate-180 group-hover:scale-125"
                            ></i>
                        </div>
                        <span class="ml-3 font-medium" v-if="appStore.isFullNavMode">Settings</span>
                    </router-link>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
import FieldTypesPalette from '../../features/view-builder/components/FieldTypesPalette.vue'
import SectionTypesPalette from '../../features/view-builder/components/AddSectionButton.vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '../stores'
import { PATHS } from '../constants/paths'
import { viewTemplates } from '../utils/withoutPaths'
import { TITLES } from '../constants/titles'
import { NAV_MODE } from '../constants/navMode'
import { ref, watch, onMounted, onUnmounted } from 'vue'

const appStore = useAppStore()

const route = useRoute()
const router = useRouter()
const originalNavMode = ref(appStore.settings.navMode)
const isBuilder = ref(false)

const enterBuilderMode = () => {
    isBuilder.value = true
    originalNavMode.value = appStore.settings.navMode
    appStore.settings.navMode = NAV_MODE.FULL
}

const toggleBuilderMode = () => {
    isBuilder.value = false
    appStore.settings.navMode = originalNavMode.value
}

// Set initial state based on current route
onMounted(() => {
    isBuilder.value = route.path === PATHS.VIEW_BUILDER
    if (isBuilder.value) {
        originalNavMode.value = appStore.settings.navMode
        appStore.settings.navMode = NAV_MODE.FULL
    }
})

watch(
    () => route.path,
    (newPath, oldPath) => {
        const enteringBuilder = newPath === PATHS.VIEW_BUILDER
        const leavingBuilder = oldPath === PATHS.VIEW_BUILDER && newPath !== PATHS.VIEW_BUILDER

        if (enteringBuilder) {
            if (!isBuilder.value) {
                originalNavMode.value = appStore.settings.navMode // Save before switching
            }
            appStore.settings.navMode = NAV_MODE.FULL
        }

        if (leavingBuilder) {
            appStore.settings.navMode = originalNavMode.value // Restore when leaving builder
        }

        isBuilder.value = enteringBuilder
    },
)

const getFirstLetter = (title) => {
    return title.charAt(0)
}
</script>
