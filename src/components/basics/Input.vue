<script>
/**
 * A generic, resuable form input
 */
export default {
  props: {
    id: {
      type: String,
      default: ''
    },

    label: {
      type: String,
      default: ''
    },

    modelValue: {
      type: String,
      default: ''
    }
  },

  methods: {
    emitValue(e) {
      let value = e.target.value
      this.$emit('update:modelValue', value)
    }
  }
}
</script>

<template>
  <div class="field">
    <label 
      v-if="label"
      :for="id" 
    >
      {{ label }}
    </label>
    <input 
      :id="id"
      :value="modelValue"
      v-bind="$attrs"
      @input="emitValue"
    >
  </div>
</template>

<style scoped>
input {
  appearance: none;
  display: block; 
  width: 100%; 
  padding: var(--space-xs);
  margin-bottom: var(--space);
  border: var(--border-thickness) solid var(--neutral-light);
  border-radius: var(--border-radius);
  color: var(--neutral-dark);
}

input::placeholder {
  color: var(--neutral);
}
</style>