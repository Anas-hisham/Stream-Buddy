<template>
    <div class="flex-col center-center min-h-[calc(100vh-60px)]">
        <div class="w-full max-w-5xl space-y-20 flex flex-col center-center gap-5">
            <section
                :class="[
                    'rounded-lg shadow-md px-6 py-10 w-fit space-y-8  mb-0',
                    appStore.isDarkMode ? 'bg-gray-700' : 'bg-white',
                ]"
            >
                <h1
                    class="text-3xl font-extrabold"
                    :class="appStore.isDarkMode ? 'text-white' : 'text-black'"
                >
                    Ready-Made View Templates
                </h1>
                <p class="text-md text-gray-400">
                    Quickly start by selecting from a variety of prebuilt views.
                </p>
                <div class="flex flex-wrap justify-center gap-6">
                    <div v-for="(view, index) in appStore.staticViews()" :key="index">
                        <router-link :to="view.path">
                            <button class="blue-button px-4 py-3 rounded-xl">
                                {{ view.title }}
                            </button>
                        </router-link>
                    </div>
                </div>
            </section>
            <div class="flex justify-between gap-5">
                <section
                    :class="[
                        'rounded-lg shadow-md px-6 py-10 w-fit space-y-8 flex flex-col items-center ',
                        appStore.isDarkMode ? 'bg-gray-700' : 'bg-white',
                    ]"
                >
                    <h1
                        class="text-3xl font-extrabold"
                        :class="appStore.isDarkMode ? 'text-white' : 'text-black'"
                    >
                        Build a Custom View
                    </h1>
                    <p class="text-md text-gray-400">
                        Tailor a view exactly for your business or project needs.
                    </p>
                    <router-link
                        :to="PATHS.VIEW_BUILDER"
                        :class="['green-button center-center w-fit gap-2 p-3 rounded-xl ']"
                    >
                        <i class="pi pi-plus"></i>
                        <span class="">New View</span>
                    </router-link>
                </section>

                <section
                    :class="[
                        'rounded-lg shadow-md px-6 py-10 w-fit space-y-8 flex flex-col items-center ',
                        appStore.isDarkMode ? 'bg-gray-700' : 'bg-white',
                    ]"
                >
                    <h1
                        class="text-3xl font-extrabold"
                        :class="appStore.isDarkMode ? 'text-white' : 'text-black'"
                    >
                        Customize Your Preferences
                    </h1>
                    <p class="text-md text-gray-400">
                        Adjust settings to personalize your experience.
                    </p>
                    <router-link
                        :to="PATHS.SETTINGS"
                        @click="appStore.openSettings"
                        :class="['blue-button center-center w-fit gap-2 p-3 rounded-xl  ']"
                    >
                        <i class="pi pi-cog animate-spin-slow"></i>
                        <span class="">Settings</span>
                    </router-link>
                </section>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { PATHS } from '../shared/constants/paths'
import { useAppStore } from '../shared/stores'

const appStore = useAppStore()
const route = useRoute()
</script>
