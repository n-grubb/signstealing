<script>
export default {
  computed: {
    lastUpdated() {
      if (this.$store.state.lastUpdated) {
        let [month, date, year] = this.$store.state.lastUpdated.toLocaleDateString("en-US").split("/")
        return `${month}/${date}/${year}`
      }
      return undefined
    }
  }
}
</script>

<template>
  <div class="app-info">
    <p>Projections provided by Steamer.</p>
    <p>ADP sourced from FanGraphs.</p>
    <p v-if="lastUpdated" class="updated">Last Updated: {{ lastUpdated }}</p>
  </div>
</template>


<style scoped>
.app-info {
  width: 100%;
  padding: var(--space-lg);
  border-top: var(--border-thickness) solid var(--neutral-light);
  font-size: var(--text-xs);
}

.updated {
  margin-top: var(--space-sm);
}
</style>