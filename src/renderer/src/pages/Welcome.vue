<template>
    <div class="flex-col center-center min-h-[calc(100vh-60px)]">
        <div class="center-center flex-col gap-5">
            <h1 class="font-bold mb-2 text-center text-4xl">Welcome to Our Stream</h1>
            <router-link :to="PATHS.OVER_VIEW" class="blue-button rounded-lg w-fit px-4 py-3">
                Get Started
            </router-link>
        </div>
    </div>
</template>
<script setup>
import { PATHS } from '../shared/constants/paths'
</script>
