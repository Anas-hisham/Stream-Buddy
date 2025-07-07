<template>
  <div class="grid gap-6 py-4 ">
    <PlayerInputField
      :value="player.playerName"
      label="Player Name"
      placeholder="Player Name"
      :displayMode="displayMode"
      :onInputChange="(val) => (player.playerName = val)"
    />

    <PlayerInputField
      :value="player.teamName"
      label="Team Name"
      placeholder="Team Name"
      :displayMode="displayMode"
      :onInputChange="(val) => (player.teamName = val)"
    />

    <PlayerInputField
      :value="player.favouriteWeapon"
      label="Favorite Weapon"
      placeholder="Favorite Weapon"
      :displayMode="displayMode"
      :onInputChange="(val) => (player.favouriteWeapon = val)"
    />

    <PlayerInputField
      :value="player.economyScore"
      label="Economy Score"
      placeholder="Economy Score"
      :displayMode="displayMode"
      type="number"
      :onInputChange="(val) => (player.economyScore = Number(val))"
    />

    <div class="grid gap-2">
      <div
        class="flex justify-between border px-4 h-14 items-center gap-3"
        :class="displayMode === 'dark' ? 'text-white border-white' : 'text-black border-black'"
      >
        <span class="text-sm opacity-65">Hero Image</span>
        <div v-if="heroImage" class="flex items-center gap-2">
          <img
            :src="heroImage"
            alt="Hero"
            class="w-12 h-12 object-cover cursor-pointer"
            @click="onImageChange(index)"
            title="Click to change image"
          />
          <button
            type="button"
            class="text-red-500 font-semibold hover:underline"
            @click="onImageRemove(index)"
            title="Delete image"
          >
            Delete
          </button>
        </div>
        <button
          v-else
          class="font-semibold cursor-pointer"
          :class="displayMode === 'dark' ? 'text-green-400' : 'text-green-600'"
          @click="onImageChange(index)"
        >
          + ADD
        </button>
      </div>
    </div>

    <PlayerInputField
      :value="player.kills"
      label="Kills"
      placeholder="Kills"
      :displayMode="displayMode"
      type="number"
      :onInputChange="(val) => (player.kills = Number(val))"
    />

    <PlayerInputField
      :value="player.deaths"
      label="Deaths"
      placeholder="Deaths"
      :displayMode="displayMode"
      type="number"
      :onInputChange="(val) => (player.deaths = Number(val))"
    />

    <PlayerInputField
      :value="player.assists"
      label="Assists"
      placeholder="Assists"
      :displayMode="displayMode"
      type="number"
      :onInputChange="(val) => (player.assists = Number(val))"
    />
  </div>
</template>

<script setup>
import PlayerInputField from './PlayerInputField.vue';

defineProps({
  player: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  displayMode: {
    type: String,
    default: 'light',
  },
  heroImage: {
    type: String,
    default: '',
  },
  onImageChange: {
    type: Function,
    required: true,
  },
  onImageRemove: {
    type: Function,
    required: true,
  },
});
</script>
