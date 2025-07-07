<template>
    <header
        :class="[
            ' app-toolbar pr-7 pl-11 py-4 flex items-center justify-between fixed top-0 left-0 right-0 z-50 ',
            appStore.isDarkMode
                ? 'bg-[#2a3444] border-gray-700 text-gray-100 '
                : 'bg-white border-gray-200 text-gray-800',
        ]"
    >
        <div data-aos="fade-right" data-aos-offset="0">
            <h1 class="text-xl font-semibold m-0">
                {{ currentTitle }}
            </h1>
        </div>
        <div data-aos="fade-left" data-aos-offset="0">
            <div class="toolbar-actions flex gap-5">
                <button
                    @click="appStore.openSettings"
                    title="Settings"
                    :class="[
                        ' rounded-lg transition-colors ',
                        appStore.isDarkMode ? 'text-gray-200' : 'text-gray-700',
                    ]"
                >
                    <i
                        class="pi pi-cog transition-transform duration-500 hover:rotate-180 hover:scale-125"
                        style="font-size: 1.3rem"
                    ></i>
                </button>
            </div>
        </div>
    </header>
</template>

<script setup>
import { useAppStore } from '../../stores/index'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const appStore = useAppStore()

const currentTitle = computed(() => {
    if (route.meta?.isCustomView) {
        const customView = appStore.allViews.find(
            (view) => view.path === `/${route.params.customView}`,
        )
        return customView?.title || 'Custom View'
    }
    return route.meta?.title || 'Settings'
})
</script>
<!-- <style>.app-toolbar{
    z-index: 1001;
}</style> -->
