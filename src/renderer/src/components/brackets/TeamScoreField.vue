<template>
  <div class="col-span-1 relative mt-7 md:mt-0">
    <label
      class="w-max absolute left-1/2 -top-7 -translate-x-1/2 block mb-1 text-sm font-semibold"
      :class="displayMode === 'dark' ? 'text-white' : 'text-black'"
    >
      Team Score
    </label>
    <div
      class="relative px-4 py-3 border"
      :class="displayMode === 'dark' ? 'text-white border-white' : 'text-black border-black'"
    >
      <i
        class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
        :class="displayMode === 'dark' ? 'text-white' : 'text-black'"
      ></i>
      <input
        type="number"
        min="0"
        v-model.number="team.teamScore"
        placeholder="Team Score"
        class="outline-none pl-5 w-full bg-transparent"
        :class="
          displayMode === 'dark' ? 'placeholder-white text-white' : 'placeholder-black text-black'
        "
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  team: Object,
  displayMode: String,
})
</script>
