<script>
import Table from '../Table/Table.vue'
import playerProjections from './player-projections.json'

export default {
	components: { Table },
  data() {
		return {
	    filters: {},
			positions: [ 'C', '1B', '2B', 'SS', '3B', 'OF', 'SP', 'RP' ],
			selectedPositionFilters: []
		}
	},
	computed: {
		columns() {
			// filters? 
			return [
				{ name: 'name', label: 'NAME', sticky: true, align: 'left', minWidth: 200 },
				{ name: 'team', label: 'TEAM' },
				{ name: 'pos', label: 'POS', sortable: true },
				{ name: 'ADP', label: 'ADP', sortable: true, maxWidth: 100 },
				{ name: 'R', label: 'R', sortable: true },
				{ name: 'HR', label: 'HR', sortable: true },
				{ name: 'RBI', label: 'RBI', sortable: true },
				{ name: 'SB', label: 'SB', sortable: true },
				{ name: 'OBP', label: 'OBP', sortable: true },
				{ name: 'IP', label: 'IP', sortable: true },
				{ name: 'K', label: 'K', sortable: true },
				{ name: 'SV', label: 'SV', sortable: true },
				{ name: 'ERA', label: 'ERA', sortable: true },
				{ name: 'WHIP', label: 'WHIP', sortable: true },
			]
		},

		players() {
			if (this.selectedPositionFilters.length > 0) {
				return playerProjections.filter(player => (
					player.pos && player.pos.some(position => this.selectedPositionFilters.includes(position)) 
				))
			}
			return playerProjections
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
		}
	}
    // created() {
		// // When the app is created, fetch players from the api.
		// fetch('/.netlify/functions/api/players')
		//   .then(response => response.json())
		//   .then(data => this.players = data.players)
		//   .catch(error => alert(error))
	// }
}
</script>

<template>
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
	<Table
		class="player-table"
		:columns="columns"
		:data="players"
		numbered
		numberedLabel="Rk"
		emptyCellContent=" "
		stickyHeader
		stickyFirstColumn
		draggable
	/>
</template>

<style scoped>
.position-filters {
	display: flex;
	justify-content: flex-start;
	align-items: center;
}

.position-filters li {
	padding: var(--space-xs);
	font-size: var(--text-sm);
	font-weight: var(--font-light);
	position: relative;
	cursor: pointer;
}

.position-filters li.filter-active {
	color: var(--accent);
	font-weight: var(--font-bold);
}

.position-filters li + li:after {
	content: '';
	position: absolute;
	left: 0;
	width: 1px;
	height: 50%;
	margin: auto;
	background-color: var(--neutral);
}
</style>