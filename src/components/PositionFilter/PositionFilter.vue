<script>
/**
 * Toggle Positions to display within the Players table
 */
export default {
	props: {
		positions: {
			type: Array,
			required: true
		}
	},
  data() {
    return {
			selectedPositionFilters: []
    }
  },
  methods: {
    togglePositionFilter(position) {
			const filterIndex = this.selectedPositionFilters.indexOf(position)
			if (filterIndex >= 0) {
				this.selectedPositionFilters.splice(filterIndex, 1)
			} else {
				this.selectedPositionFilters.push(position)
			}
      this.$emit('change', this.selectedPositionFilters)
		},
  }
}
</script>

<template>
  <div class="position-filters-wrapper">
    <span>Filter by Position:</span>
		<ul class="position-filters">
			<li 
				v-for="position in positions"
				:key="position"
				:class="{ 'filter-active': selectedPositionFilters.includes(position) }"
				@click="togglePositionFilter(position)"
			>
			{{ position }}
			</li>
		</ul>
  </div>
</template>

<style scoped>
.position-filters-wrapper span {
	font-size: var(--text-xs);
}

.position-filters {
	width: max-content;
	border: 1px solid var(--neutral-light);
	border-radius: 4px;
	background: var(--white);

	display: flex;
	justify-content: flex-start;
	align-items: center;
}

.position-filters li {
	width: 50px;
	padding: var(--space-xs);
	font-size: var(--text-sm);
	font-weight: var(--font-light);
	text-align: center;
	position: relative;
	cursor: pointer;
}

.position-filters li + li {
	border-left: 1px solid var(--neutral-light);
}

.position-filters li.filter-active {
	background: var(--accent);
	color: var(--white);
	font-weight: var(--font-bold);
}
</style>