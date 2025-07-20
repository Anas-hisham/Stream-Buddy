<template>
    <div class="grid gap-6 py-4">
        <PlayerInputField
            :value="player.playerName"
            label="Player Name"
            placeholder="Player Name"
            :onInputChange="(val) => (player.playerName = val)"
        />

        <PlayerInputField
            :value="player.teamName"
            label="Team Name"
            placeholder="Team Name"
            :onInputChange="(val) => (player.teamName = val)"
        />

        <PlayerInputField
            :value="player.favouriteWeapon"
            label="Favorite Weapon"
            placeholder="Favorite Weapon"
            :onInputChange="(val) => (player.favouriteWeapon = val)"
        />

        <PlayerInputField
            :value="player.economyScore"
            label="Economy Score"
            placeholder="Economy Score"
            type="number"
            :onInputChange="(val) => (player.economyScore = Number(val))"
        />

        <div class="grid gap-2">
            <div
                class="img-input cursor-pointer border px-4 h-14 flex items-center justify-between gap-3 rounded-md"
                @click="onImageChange(index)"
            >
                <span class="text-sm opacity-65 truncate">Hero Image</span>

                <div v-if="heroImage" class="flex items-center gap-2 max-w-full overflow-hidden">
                    <img
                        :src="heroImage"
                        alt="Hero"
                        class="img h-12.5 w-12.5"
                        title="Click to change image"
                    />
                    <button
                        type="button"
                        class="img-delete"
                        @click.stop="onImageRemove(index)"
                        title="Delete image"
                    >
                        Delete
                    </button>
                </div>

                <span v-else class="img-add"> + ADD </span>
            </div>
        </div>

        <PlayerInputField
            :value="player.kills"
            label="Kills"
            placeholder="Kills"
            type="number"
            :onInputChange="(val) => (player.kills = Number(val))"
        />

        <PlayerInputField
            :value="player.deaths"
            label="Deaths"
            placeholder="Deaths"
            type="number"
            :onInputChange="(val) => (player.deaths = Number(val))"
        />

        <PlayerInputField
            :value="player.assists"
            label="Assists"
            placeholder="Assists"
            type="number"
            :onInputChange="(val) => (player.assists = Number(val))"
        />
    </div>
</template>

<script setup>
import PlayerInputField from './PlayerInputField.vue'

defineProps({
    player: {
        type: Object,
        required: true
    },
    index: {
        type: Number,
        required: true
    },
    displayMode: {
        type: String
    },
    heroImage: {
        type: String,
        default: ''
    },
    onImageChange: {
        type: Function,
        required: true
    },
    onImageRemove: {
        type: Function,
        required: true
    }
})
</script>
