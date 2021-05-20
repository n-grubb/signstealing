<script>
/**
 * An accessible radio input with convenient style defaults.
 */
export default {
  props: {
    label: {
      type: String,
      required: true
    },
    name: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: 'true'
    },
    checked: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click']
}
</script>

<template>
  <label
    class="tb-radio"
    :for="id"
    @click="$emit('click')"
  > 
    <input
      type="radio"
      class="visually-hidden"
      :id="id"
      :name="name"
      :value="value"
      :checked="checked"
    />
    <span>{{ label }}</span>
  </label>
</template>

<style scoped>
.tb-radio {
  cursor: pointer;
  margin: var(--radio-wrapper-margin, 0 1rem 0 0);
}

/* Default, unchecked style */
.tb-radio input + span:before {
  display: inline-block;
  content: '';
  width: var(--radio-width, 1rem);
  height: var(--radio-height, 1rem);
  margin: var(--radio-margin, 0 .5rem 0 0);
  border: .125rem solid var(--radio-fill, white);
  border-radius: 100%;
  box-shadow: 0 0 0 .125rem var(--radio-border, black);
  vertical-align: -.125rem;
  transition: var(--radio-transition-duration, 0.1s) ease all;
}

/* Hover style */
.tb-radio:hover input:not(:checked) + span:before {
  background-color: var(--input-hover);
  border-color: var(--input-hover);
}

/* Checked style */
.tb-radio input:checked + span:before {
  background: var(--radio-fill-selected, var(--accent, black));
  box-shadow: 0 0 0 .125rem var(--radio-border, black);
}

/* Focus styling */
.tb-radio input:focus + span:before {
  outline: 2px solid transparent; /* fallback for high-contrast mode. */
  box-shadow: 
    0 0 0 .125rem var(--radio-border, black),
    0 0 0 .25rem var(--radio-fill, white), 
    0 0 0 .375rem var(--focus-color);
}
</style>
