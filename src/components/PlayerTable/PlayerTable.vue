<script>
import PositionFilter from '@/components/PositionFilter/PositionFilter.vue'
import Table from '../Table/Table.vue'

export default {
	components: { PositionFilter, Table },
	props: {
		players: {
			type: Array,
			required: true
		},
		columns: {
			type: Array,
			required: true
		},
		positions: {
			type: Array,
			default: []
		},
		header: {
			type: String,
			default: 'Players'
		},
		size: {
			type: String,
			default: 'large'
		},
		editing: {
			type: Boolean,
			default: false
		}
	},
  data() {
		return {
	    filters: {},
			hiddenColumns: [],
			selectedPositionFilters: [],
			newRanking: [] // holder for ranking changes
		}
	},
	computed: {
		tableColumns() {
			return columns.filter(column => !hiddenColumns.include(column))
		},

		playersFiltered() {
			return (this.selectedPositionFilters.length > 0) 
				? this.players.filter(player => (
					player.pos && player.pos.some(position => this.selectedPositionFilters.includes(position)) 
				))
				: this.players
		}
	},
	methods: {
		togglePosition(payload) {
			this.selectedPositionFilters = payload
		},

		updateRanking(received) {
			console.log('New Ranking:', received)
			const newRanking = received.map((player,index) => {
				return { 
					rank: index,
					player: player.name,
					playerId: player._id
				}
			})
			this.newRanking = newRanking
		}
	},
	watch: {
		// remap old value and new value to more easily understood labels
		editing(isEditing, wasEditing) {
			if (wasEditing && !isEditing) {
				this.$emit('ranking-updated', this.newRanking)
			}
		}
	}
}
</script>

<template>
	<div :class="`player-table ${size}`">
		<h5 class="player-table__header">{{ header }}</h5>
		<div class="table-toolbar">
			<PositionFilter 
				v-if="positions.length > 1"
				:positions="positions" 
				@change="togglePosition"
			/>
		</div>
		<Table
			class="player-table"
			:columns="columns"
			:data="playersFiltered"
			numbered
			numberedLabel="Rk"
			emptyCellContent=" "
			stickyHeader
			stickyFirstColumn
			:draggable="editing"
			@drag-change="updateRanking"
		/>
	</div>
</template>

<style lang="postcss">
.player-table {
	--table-header-bg-color: var(--neutral-lighter);
	--empty-cell-bg: var(--neutral-lighter);
	/* --table-scrollable-border:  */
}

.player-table__header {
	font-size: var(--text-xl);
	font-weight: var(--font-bold);
}

.player-table th div {
	border-bottom: 1px solid var(--neutral-light);
}

.tb-table {
	@apply shadow;
	margin-top: var(--space);
}

.tb-table table {
	margin-right: 0 !important;
}

.player-table .tb-table td {
	border-bottom: 1px solid var(--neutral-light);
	font-weight: var(--font-light);
}

.player-table.large {
	--table-cell-padding: var(--space-sm);
}

.player-table.medium {
	--table-cell-padding: var(--space-xs);
}

.player-table.medium th, 
.player-table.medium td {
	font-size: var(--text-sm);
}

.player-table.small {
	--table-cell-padding: var(--space-xxs);
}

.player-table.small th, 
.player-table.small td {
	font-size: var(--text-xs);
}
</style>