<template>
    <div class="col-span-1 relative mt-7 md:mt-0">
        <!-- Label for Team Name -->
        <label
            v-if="title === 'Team Name' && team.teamName"
            class="px-2 z-5 w-max absolute left-1/2 -top-2.5 -translate-x-1/2 block mb-1 text-sm font-semibold"
            :class="appStore.isDarkMode ? 'text-white bg-[#2a3444]' : 'text-black bg-white'"
        >
            {{ title }}
        </label>

        <!-- Label for Team Score -->
        <label
            v-if="title === 'Team Score' && team.teamScore !== '' && team.teamScore !== null"
            class="px-2 z-5 w-max absolute left-1/2 -top-2.5 -translate-x-1/2 block mb-1 text-sm font-semibold"
            :class="appStore.isDarkMode ? 'text-white bg-[#2a3444]' : 'text-black bg-white'"
        >
            {{ title }}
        </label>

        <!-- Input container -->
        <div
            class="relative px-4 py-3 border rounded-md"
            :class="appStore.isDarkMode ? 'text-white border-white' : 'text-black border-black'"
        >
            <i
                class="pi pi-pencil pencil"
                :class="appStore.isDarkMode ? 'text-white' : 'text-black'"
            ></i>

            <!-- Team Name Input -->
            <input
                v-if="title === 'Team Name'"
                type="text"
                v-model="team.teamName"
                maxlength="13"
                placeholder="Team Name"
                class="outline-none pl-5 w-full bg-transparent"
                :class="
                    appStore.isDarkMode
                        ? 'placeholder-white text-white'
                        : 'placeholder-black text-black'
                "
            />

            <!-- Team Score Input -->
            <input
                v-if="title === 'Team Score'"
                type="number"
                min="0"
                v-model.number="team.teamScore"
                placeholder="Team Score"
                class="outline-none pl-5 w-full bg-transparent"
                :class="
                    appStore.isDarkMode
                        ? 'placeholder-white text-white'
                        : 'placeholder-black text-black'
                "
            />
        </div>
    </div>
</template>

<script setup>
import { useAppStore } from '../../../shared/stores'

const appStore = useAppStore()
const props = defineProps({
    team: Object,
    title: String,
})
</script>

