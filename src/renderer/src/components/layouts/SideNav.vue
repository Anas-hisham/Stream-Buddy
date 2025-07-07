<template>
    <nav
        :class="[
            'transition-all duration-300 flex flex-col relative items-center ',
            appStore.isDarkMode ? 'bg-[#2a3444] shadow-md' : 'bg-white border-gray-100 shadow-sm',
        ]"
    >
        <div class="flex justify-center items-center h-[calc(100vh-60px)] fixed">
            <!-- Navigation Items -->
            <div data-aos="fade-right " data-aos-offset="0">
                <ul
                    class="space-y-1 px-2"
                    :class="appStore.visibleViews.length > 7 ? 'mb-20' : 'mb-0'"
                >
                    <li v-for="view in appStore.visibleViews" :key="view.path" class="">
                        <div v-if="viewNotInSideNav(view.path)">
                            <router-link
                                :to="view.path"
                                :class="[
                                    'group mx-1 flex items-center py-3 rounded-xl transition-all duration-300 w-[98%]',
                                    'hover:shadow-md',
                                    appStore.settings.navMode === 'full'
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
                                :title="appStore.settings.navMode === 'mini' ? view.title : ''"
                            >
                                <span
                                    v-if="appStore.settings.navMode === 'full'"
                                    class="ml-3 font-medium"
                                >
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
                            to="/view-builder"
                            :class="[
                                'group flex items-center p-3 rounded-xl transition-all duration-300',
                                'hover:shadow-md',
                                appStore.settings.navMode === 'full'
                                    ? 'justify-start'
                                    : 'justify-center',
                                appStore.isDarkMode
                                    ? ' text-green-400'
                                    : 'hover:bg-gray-50 text-green-600',
                                route.path === '/view-builder'
                                    ? appStore.isDarkMode
                                        ? 'bg-gray-700 shadow-lg'
                                        : 'bg-gray-50 shadow-lg'
                                    : '',
                            ]"
                            :title="appStore.settings.navMode === 'mini' ? 'New View' : ''"
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
                            <span
                                class="ml-2 font-medium"
                                v-if="appStore.settings.navMode === 'full'"
                                >New View</span
                            >
                        </router-link>
                    </li>
                </ul>
            </div>
            <!-- Settings Button -->
            <div class="settings absolute bottom-5 pt-2 border-t border-zinc-500">
                <div data-aos="fade-right" data-aos-offset="0">
                    <router-link
                        to="/settings"
                        :class="[
                            'group flex items-center p-3 rounded-xl transition-all ',
                            'hover:shadow-md ',
                            appStore.settings.navMode === 'full'
                                ? 'justify-start'
                                : 'justify-center',
                            route.path === '/settings'
                                ? appStore.isDarkMode
                                    ? 'bg-gray-700 shadow-lg text-white'
                                    : 'bg-gray-50 shadow-lg text-black'
                                : '',
                        ]"
                        :title="appStore.settings.navMode === 'mini' ? 'Settings' : ''"
                        @click="appStore.openSettings"
                    >
                        <div class="flex items-center justify-center rounded-full">
                            <i
                                class="pi pi-cog transition-transform duration-500 group-hover:rotate-180 group-hover:scale-125"
                            ></i>
                        </div>
                        <span class="ml-3 font-medium" v-if="appStore.settings.navMode === 'full'"
                            >Settings</span
                        >
                    </router-link>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useAppStore } from '../../stores/index'

const route = useRoute()
const appStore = useAppStore()

const viewNotInSideNav = (path) => {
    const without = path !== '/settings' && path !== '/welcome'
    return without
}
const getFirstLetter = (title) => {
    return title && title.length > 0 ? title.charAt(0) : '?'
}
</script>
