<script>
import RadioButton from '@/components/basics/RadioButton.vue'

export default {
  components: { RadioButton },
  props: {
    checked: {
      type: String,
      default: 'ovr'
    }
  },
  data() {
    return {
      options: ['ovr', 'split', 'positions']
    }
  },
  methods: {
    toggle(options) {
      this.$emit('toggle', options)
    }
  }
}
</script>

<template>
  <fieldset class="toggle-group">
    <legend class="toggle-group-legend">
      Display Mode
    </legend>
    <RadioButton
      v-for="(option, index) in options"
      :key="index"
      :id="`displayMode-${option}`"
      name="displayMode"
      :value="option"
      :label="option"
      :checked="checked === option"
      @click="toggle(option)"
    />
  </fieldset>
</template>

<style scoped>
.toggle-group {
  max-width: max-content;
  padding: var(--space-xxs) var(--space-sm) var(--space-xs);
  border: var(--border-thickness) solid var(--border-color);
  border-radius: var(--border-radius);
}

.toggle-group-legend {
  padding: 0 var(--space-xs);
  font-weight: var(--font-bold);
}

.toggle-group .tb-radio:last-of-type {
  margin-right: 0;
}
</style>