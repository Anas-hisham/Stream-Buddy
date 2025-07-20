<template>
    <div data-aos="zoom-in">
        <div
            class="border p-6 transition-all mb-6 rounded-xl shadow-md"
            :class="
                appStore.isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            "
        >
            <div class="mb-6">
                <label for="viewName" class="block text-sm font-medium mb-3">
                    <span class="flex items-center gap-2"> View Name </span>
                </label>
                <div class="relative">
                    <input
                        type="text"
                        id="viewName"
                        v-model.lazy="viewBuilderStore.newView.name"
                        @change="viewBuilderStore.validateViewName"
                        class="w-full px-4 py-3 input-ring"
                        :class="[viewBuilderStore.viewNameError ? 'input-error-ring' : '']"
                        placeholder="Enter a unique name for your view"
                    />
                    <p
                        v-if="viewBuilderStore.viewNameError"
                        class="mt-2 text-sm flex items-center gap-2 text-red-500"
                    >
                        <i class="pi pi-exclamation-circle"></i>
                        {{ viewBuilderStore.viewNameError }}
                    </p>
                </div>
            </div>

            <!-- <div class="mb-4">
                <label class="block text-sm font-medium mb-3">
                    <span class="flex items-center gap-2">
                        <i class="pi pi-th-large"></i>
                        Layout Style
                    </span>
                </label>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                        @click="viewBuilderStore.newView.layoutStyle = 'single'"
                        :class="[
                            'cursor-pointer border rounded-xl p-4 transition-all',
                            'flex flex-col gap-3 hover:shadow-md',
                            viewBuilderStore.newView.layoutStyle === 'single'
                                ? appStore.isDarkMode
                                    ? 'border-blue-500 bg-blue-900/20 ring-2 ring-blue-500/30'
                                    : 'border-blue-400 bg-blue-50 ring-2 ring-blue-400/30'
                                : appStore.isDarkMode
                                  ? 'border-gray-700 hover:border-gray-600 bg-gray-700'
                                  : 'border-gray-200 hover:border-gray-300 bg-white',
                        ]"
                    >
                        <div class="flex flex-col gap-2">
                            <div class="flex flex-col gap-1">
                                <div
                                    class="h-2.5 rounded-full"
                                    :class="
                                        appStore.isDarkMode
                                            ? 'bg-gray-600'
                                            : 'bg-gray-300'
                                    "
                                ></div>
                                <div
                                    class="h-2.5 rounded-full"
                                    :class="
                                        appStore.isDarkMode
                                            ? 'bg-gray-600'
                                            : 'bg-gray-300'
                                    "
                                ></div>
                                <div
                                    class="h-2.5 rounded-full"
                                    :class="
                                        appStore.isDarkMode
                                            ? 'bg-gray-600'
                                            : 'bg-gray-300'
                                    "
                                ></div>
                            </div>
                        </div>
                        <p class="text-sm font-medium mt-2">Single Column</p>
                    </div>

                    <div
                        @click="viewBuilderStore.newView.layoutStyle = 'grid'"
                        :class="[
                            'cursor-pointer border rounded-xl p-4 transition-all',
                            'flex flex-col gap-3 hover:shadow-md',
                            viewBuilderStore.newView.layoutStyle === 'grid'
                                ? appStore.isDarkMode
                                    ? 'border-blue-500 bg-blue-900/20 ring-2 ring-blue-500/30'
                                    : 'border-blue-400 bg-blue-50 ring-2 ring-blue-400/30'
                                : appStore.isDarkMode
                                  ? 'border-gray-700 hover:border-gray-600 bg-gray-700'
                                  : 'border-gray-200 hover:border-gray-300 bg-white',
                        ]"
                    >
                        <div class="grid grid-cols-2 gap-2">
                            <div
                                class="h-2.5 rounded-full"
                                :class="
                                    appStore.isDarkMode
                                        ? 'bg-gray-600'
                                        : 'bg-gray-300'
                                "
                            ></div>
                            <div
                                class="h-2.5 rounded-full"
                                :class="
                                    appStore.isDarkMode
                                        ? 'bg-gray-600'
                                        : 'bg-gray-300'
                                "
                            ></div>
                            <div
                                class="h-2.5 rounded-full"
                                :class="
                                    appStore.isDarkMode
                                        ? 'bg-gray-600'
                                        : 'bg-gray-300'
                                "
                            ></div>
                            <div
                                class="h-2.5 rounded-full"
                                :class="
                                    appStore.isDarkMode
                                        ? 'bg-gray-600'
                                        : 'bg-gray-300'
                                "
                            ></div>
                            <div
                                class="h-2.5 rounded-full"
                                :class="
                                    appStore.isDarkMode
                                        ? 'bg-gray-600'
                                        : 'bg-gray-300'
                                "
                            ></div>
                            <div
                                class="h-2.5 rounded-full"
                                :class="
                                    appStore.isDarkMode
                                        ? 'bg-gray-600'
                                        : 'bg-gray-300'
                                "
                            ></div>
                        </div>
                        <p class="text-sm font-medium mt-2">Grid Layout</p>
                    </div>
                </div>
            </div> -->
        </div>
    </div>
</template>

<script setup>
import { useAppStore } from '../../../shared/stores'
import { useViewBuilderStore } from '../viewBuilderStore'

const viewBuilderStore = useViewBuilderStore()
const appStore = useAppStore()
</script>
