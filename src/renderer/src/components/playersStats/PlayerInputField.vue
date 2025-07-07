<template>
  <div class="grid gap-2">
    <label
      v-if="value !== '' && value !== null && value !== undefined"
      class="text-sm font-semibold"
      :class="[displayMode === 'dark' ? 'text-white' : 'text-black']"
    >
      {{ label }}
    </label>

    <div
      class="px-4 py-3 border relative"
      :class="displayMode === 'dark' ? 'text-white border-white' : 'text-black border-black'"
    >
      <i
        class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2"
        :class="displayMode === 'dark' ? 'text-white' : 'text-black'"
      ></i>

      <input
        :type="type || 'text'"
        :value="value"
        :placeholder="placeholder"
        class="outline-hidden pl-5 w-full bg-transparent"
        :class="displayMode === 'dark'
          ? 'placeholder-white text-white'
          : 'placeholder-black text-black'"
        @input="onInput($event)"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  value: [String, Number],
  label: String,
  placeholder: String,
  displayMode: {
    type: String,
    default: 'light',
  },
  type: {
    type: String,
    default: 'text',
  },
  onInputChange: {
    type: Function,
    required: true,
  },
});

function onInput(event) {
  props.onInputChange(event.target.value);
}
</script>
