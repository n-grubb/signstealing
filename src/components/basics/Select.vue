<script>
import IconAngleDown from '/@vite-icons/uil/angle-down'

export default {
  components: { IconAngleDown },
  props: {
    title: {
      type: String,
      default: ''
    },

    id: {
      type: String,
      default: ''
    },

    name: {
      type: String,
      default: ''
    },

    /**
     * An array of option objects. 
     * See `defaultOption` to see the option object format.
     */
    options: {
      type: Array,
      required: true
    },

    defaultOption: {
      type: Object,
      default: () => { 
        return {
          value: '', 
          label: 'Please select an option' 
        }
      }
    },

    selected: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      open: false
    }
  },
  methods: {
    selectOption(event) {
      const selectedOptionValue = event.target.value
      if (selectedOptionValue !== this.selected) {
        this.open = false
        this.$emit('selected', selectedOptionValue)
      }
    }
  }
}
</script>

<template>
  <div class="select-wrapper">
    <label 
      v-if="title"
      :for="id"
    >
      {{ title }}
    </label>
    <div class="select">
      <select 
        :id="id"
        :name="name"
        aria-label="Select menu example"
        :data-open="open"
        @click="open = true"
        @change="selectOption"
      >
        <option 
          v-if="defaultOption" 
          :value="defaultOption.value"
          :selected="selected === defaultOption.value"
        >
          {{ defaultOption.label }}
        </option>
        <option 
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          :selected="selected === option.value"
        >
          {{ option.label }}
        </option>
      </select>
      <span :class="['caret', { 'caret-up': open }]" >
        <IconAngleDown />
      </span>
    </div>
  </div>
</template>

<style scoped>
.select-wrapper {
  display: inline-block;
}

.select-wrapper label {
  display: block;
  margin-bottom: var(--space-xxs);
  font-size: var(--text-sm);
  font-weight: var(--font-semi);
}

.select {
  display: block;
  width: 100%;
  position: relative;
  background-color: var(--white);
}

select {
  appearance: none;
  position: relative;
  display: block;
  width: 100%;
  padding: var(--space-xs);
  padding-right: calc(var(--space) * 3);
  border: 1px solid var(--neutral-light);
  border-radius: var(--border-radius);
  margin: 0;
  background-color: transparent;
  box-shadow: 2px 2px 2px rgba(0,0,0,.15);
  text-align: left;
  z-index: 2;
}

.caret {
  position: absolute;
  top: 0;
  right: 0;
  display: block;
  width: 2rem;
  height: 100%;
  border-left: 1px solid var(--neutral-light);
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.caret svg {
  width: 1.75rem;
  height: 1.75rem;
  margin-top: .25rem;
  transition: transform .2s;
}

.caret.caret-up svg {
  transform: rotate(-180deg);
}
</style>
