<script>
import PositionFilter from '@/components/PositionFilter/PositionFilter.vue'
import Table from '@/components/Table/Table.vue'
import Button from '@/components/basics/Button.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

export default {
	components: { 
		DataTable,
		Column,
    PositionFilter, 
		Button,
    Table 
  },
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
	},
  data() {
		return {
			selectedPositionFilters: [],
      taken: [],
      drafted: [],
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

    toggleTaken(player) {
			const takenIndex = this.taken.indexOf(player._id)
      if (takenIndex < 0) {
        this.taken.push(player._id)
      } else {
        this.taken.splice(takenIndex, 1)
      }
    },

    draftPlayer(player) {
			const draftedIndex = this.drafted.indexOf(player._id)
      // if player not yet in drafted array
      if (draftedIndex < 0) {
        this.drafted.push(player._id)
        this.$emit('player-drafted', player)
      } else {
				this.drafted.splice(draftedIndex, 1)
        this.$emit('player-undrafted', player)
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
		<div class="draft-table">
			<DataTable 
				:value="playersFiltered" 
				:scrollable="true"
				class="p-datatable-sm"
			>
				<Column 
					field="rank"
					header="Rank"
					:sortable="true"					
					headerStyle="min-width: 50px"
					:style="{ minWidth: '50px', textAlign: 'center' }"
				>
					<template #body="{ index }">
						<span>{{ index + 1 }}</span>
					</template>
				</Column>
				<Column 
					v-for="column in columns" 
					:key="column.name"
					:field="column.name" 
					:header="column.label"
					:sortable="column.sortable"
					:headerStyle="{ minWidth: `${column.minWidth ? column.minWidth : 80}px`, textAlign: column.align || 'left' }"
					:style="{ minWidth: `${column.minWidth ? column.minWidth : 80}px`, textAlign: column.align || 'left' }"
					:resizableColumns="true"
				>
					<template #body="{ data }">
						<span
							v-if="column.name === 'name'" 
							:class="{ 'name': true, drafted: drafted.indexOf(data._id) !== -1, taken: taken.indexOf(data._id) !== -1 }" 
						>
							{{ data.name }}
						</span>
						<span 
							v-else-if="column.name === 'pos'"
							:class="{ drafted: drafted.indexOf(data._id) !== -1, taken: taken.indexOf(data._id) !== -1 }" 
						>
							{{ data.pos.join(' | ') }}
						</span>
						<span 
							v-else
							:class="{ drafted: drafted.indexOf(data._id) !== -1, taken: taken.indexOf(data._id) !== -1 }" 
						>
							{{ data[column.name] }}
						</span>
					</template>
				</Column>
				<Column 
					field="actions" 
					header="Actions"
					:headerStyle="{ minWidth: `200px`}"
					:style="{ minWidth: `200px`}"
				>
					<template #body="{ data }">
						<div class="draft-actions">
							<Button v-if="drafted.indexOf(data._id) < 0"
								@click="toggleTaken(data)"
							>
								{{ taken.indexOf(data._id) === -1 ? 'taken' : 'undo' }}
							</Button>
							<Button 
								v-if="taken.indexOf(data._id) < 0"
								@click="draftPlayer(data)"
							>
								{{ drafted.indexOf(data._id) === -1 ? 'draft' : 'undraft' }}
							</Button>
						</div>
					</template>
				</Column>
			</DataTable>
		</div>
	</div>
</template>

<style>

.taken, .drafted {
	text-decoration: line-through;
}

.drafted {
	color: var(--accent);
}

.draft-actions {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.draft-actions .button {
	min-width: 5rem;
}

.draft-actions .button + button {
	margin-left: .5rem;
}

.draft-table {
	border: 1px solid var(--neutral-light);
	border-radius: 4px;
	margin-top: var(--space-sm);
}

.draft-table td {
	background: white;
}

.draft-table td span:not(.p-column-title):not(.name) {
	display: block;
	width: 100%;
	text-align: center;
}

.draft-table th > .p-column-header-content {
	display: block;
	width: 100%;
	text-align: center;
}
</style>