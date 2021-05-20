<script>
import Select from '@/components/basics/Select.vue'
import Button from '@/components/basics/Button.vue'
import IconPlus from '/@vite-icons/uil/plus'

export default {
  components: { 
    Select, 
    Button, 
    IconPlus 
  },
  props: {
    rankings: {
      type: Array,
      default: () => []
    },
    // The ID of the current ranking.
    currentRanking: {
      type: String,
      default: ''
    },
    canAddRanking: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    options() {
      return this.rankings.map(ranking => ({
        value: ranking._id.toString(),
        label: ranking.name
      }))
    }
  }
}
</script>

<template>
  <div class="ranking-selector">
    <Select 
      title="My Rankings:"
      :options="options"
      :selected="currentRanking"
      :default-option="{ value: '', label: 'Default:ADP' }"
      @selected="selectedRanking => { $emit('selected', selectedRanking) }"
    />
    <Button 
      v-if="canAddRanking"
      class="add-ranking-button"
      @click="$emit('add')"
    >
      <IconPlus />
    </Button>
  </div>
</template>

<style scoped>
.ranking-selector {
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
}

.add-ranking-button {
  margin-left: var(--space-sm);
}
</style>