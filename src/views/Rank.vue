

<script>
import Banner from '@/components/basics/Banner.vue'
import Button from '@/components/basics/Button.vue'
import AlgoDefiner from '@/components/AlgoDefiner/AlgoDefiner.vue'
import RankingSelector from '@/components/RankingSelector/RankingSelector.vue'
import DisplayTypeToggle from '@/components/DisplayTypeToggle/DisplayTypeToggle.vue'
import PlayerTable from '@/components/PlayerTable/PlayerTable.vue'
import AddRankingModal from '@/components/patterns/AddRankingModal.vue'
import InfoModal from '@/components/patterns/InfoModal.vue'
import playerData from '@/data/player-projections.json'

export default {
	components: { 
		Banner,
		Button,
		AlgoDefiner,
		RankingSelector,
		DisplayTypeToggle,
		PlayerTable,
		AddRankingModal,
		InfoModal
	},
	data() {
		return {
			loading: true,
			loadedRanking: null,
			rankings: [],
			displayMode: 'ovr',
			displayAddRankingModal: false,
			displaySettingsModal: false,
			editing: false
		}
	},
	created() {
		// Load rankings from DB
		this.getAllRankings()
	},
	computed: {
		isLoggedIn() {
			return this.$store.state.isLoggedIn
		},

		players() {
			return this.rankPlayers(playerData)

			// if (this.loadedRanking) {
			// 	let players
			// 	if (this.loadedRanking.algorithm) {
			// 		players = playerData.map(player => { 
			// 			return {
			// 				...player,
			// 				score: this.getAlgoScore(player),
			// 			}
			// 		})
			// 	} else {
			// 		players = playerData
			// 	}

			// 	if (this.loadedRanking.ranking) {
			// 		// sort the players by the loaded ranking
			// 		players.sort((playerA, playerB) => {
      //     	return this.getPlayerRanking(playerA) - this.getPlayerRanking(playerB)
			// 		})
			// 	}
			// 	return players
			// }
			// else {
			// 	return playerData
			// }

			// return this.loadedRanking && this.loadedRanking.algorithm && playerData 
			// 	? playerData.map(player => { 
			// 		return {
			// 			...player,
			// 			score: this.getAlgoScore(player)
			// 		}
			// 	}) 
			// 	: playerData
		},

		loadedRankingId() {
			return (this.loadedRanking && this.loadedRanking._id && this.loadedRanking._id.toString()) ? this.loadedRanking._id.toString() : ''
		}
	},
	methods: {
		/**
		 * Query the DB and return all of a users saved rankings.
		 */
		async getAllRankings() {
			this.loading = true
			const mongodb = this.$realm.currentUser.mongoClient("mongodb-atlas")
			const rankings = mongodb.db("signstealing").collection("rankings")
			this.rankings = await rankings.find()
			if (!this.loadedRanking) {
				this.loadRanking()
			}
			this.loading = false
		},

		/**
		 * Load a ranking from the user's saved rankings.
		 * If a ranking id is not provided, load from local storage or pull the first ranking.
		 */
		loadRanking(rankingId) {
			// if provided an empty string by clicking the default value.
			if (rankingId === '') {
				console.log('ranking is empty string, loading default.')
				// the user selected the default ranking.
				this.loadedRanking = null
				localStorage.removeItem('last-loaded-ranking')
			}
			// The user selected a ranking to load.
			else if (rankingId) {
				console.log('ranking id provided, loading chosen ranking.')
				this.loadedRanking = this.rankings.find(ranking => ranking._id.toString() === rankingId)
				console.log('loaded:', this.loadedRanking)
				localStorage.setItem('last-loaded-ranking', this.loadedRankingId)
			} 
			// initial load: // if an entry for last-loaded-ranking exists in the local storage, pull it.
			else if (localStorage.getItem('last-loaded-ranking')) {
				console.log('no ranking id provided, loading from local storage.')
				this.loadedRanking = this.rankings.find(ranking => ranking._id.toString() === localStorage.getItem('last-loaded-ranking'))
			} else {
				console.log('no ranking id provided, no value in local storage, loading first from db.')
				// otherwise, grab the first ranking returned from the DB.
				this.loadedRanking = this.rankings[0]
				localStorage.setItem('last-loaded-ranking', this.loadedRankingId)
			}
		},

		async createOrUpdateRanking({ name, algorithm, ranking, addNew = false }) {
			const mongodb = this.$realm.currentUser.mongoClient("mongodb-atlas")
			const rankings = mongodb.db("signstealing").collection("rankings")

			let data 
			this.loading = true
			data = {
				name: name ? name : this.loadedRanking.name,
				algorithm: algorithm ? algorithm : this.loadedRanking.algorithm,
				ranking: ranking ? ranking : 
					this.loadedRanking.ranking.length ? this.loadedRanking.ranking : []
			}
			console.log('db operation with data:', data)
			if (this.loadedRankingId && !addNew) {
				console.log('updating...')
				rankings.updateOne(
					{ 
						"_id": this.loadedRanking._id
					}, // query
					{ $set: data }, // fields to update
				)  
					.then(result => {
						console.log(result)
						const { matchedCount, modifiedCount } = result;
						if(matchedCount && modifiedCount) {
							console.log(`Successfully updated the item.`)
						}
					})
					.catch(err => console.error(`Failed to update the item: ${err}`))
			} 
			else if (addNew) {
				const newRanking = await rankings.insertOne({
					...data,
					userId: this.$realm.currentUser.id
				})
				// this.loadRanking(newRanking.insertedId)
			}
			
			await this.getAllRankings()
			this.loading = false
		},

		createNewRanking(rankingName) {
			this.createOrUpdateRanking({ name: rankingName, algorithm: {}, ranking: [], addNew: true })
			this.displayAddRankingModal = false
		},

		/**
		 * Save the ranking to the DB.
		 */
		handleAlgoSave(updatedAlgorithm) {
			this.createOrUpdateRanking({ algorithm: updatedAlgorithm });
			this.loadedRanking.algorithm = updatedAlgorithm
		},

		/**
		 * Only load updates on @save 
		 * -adjustment causes breakage.
		 */
		getAlgoScore(player) {
			let score = 0
			if (this.loadedRanking.algorithm.batting) {
				this.loadedRanking.algorithm.batting.forEach(stat => {
					if (player[stat.name]) {
						score += (parseFloat(player[stat.name]) + parseFloat(stat.adjustment)) * parseFloat(stat.weight)
					}
				})
			}
			if (this.loadedRanking.algorithm.pitching) {
				this.loadedRanking.algorithm.pitching.forEach(stat => {
					if (player[stat.name]) {
						score += (parseFloat(player[stat.name]) + parseFloat(stat.adjustment)) * parseFloat(stat.weight)
					}
				})
			}
			return parseFloat(score.toFixed(1))
		},

		updateDisplayMode(newDisplayMode) {
			this.displayMode = newDisplayMode
		},

		playersByPositions(positionsToInclude) {
			return this.players.filter(player => player.pos && player.pos.some(position => positionsToInclude.includes(position)))
		},

		batters() {
			const batters = this.playersByPositions(['C', '1B', '2B', 'SS', '3B', 'OF', 'DH'])
			return batters.sort((playerA, playerB) => {
        return this.getPlayerRanking(playerA, 'batting') - this.getPlayerRanking(playerB, 'batting')
			})
		},

		pitchers() {
			const pitchers = this.playersByPositions(['SP', 'RP'])
			return pitchers.sort((playerA, playerB) => {
        return this.getPlayerRanking(playerA, 'pitching') - this.getPlayerRanking(playerB, 'pitching')
			})
		},

		columnsByPositions(positionsToInclude) {
			let columns = [
				{ name: 'name', label: 'NAME', sticky: true, align: 'left', minWidth: this.displayMode === 'positions' ? 135 : 200 },
				{ name: 'team', label: 'TEAM' },
				{ name: 'pos', label: 'POS', sortable: true, minWidth: this.displayMode === 'positions' ? 135 : 160 },
				{ name: 'ADP', label: 'ADP', sortable: true, maxWidth: 100 },
			]
			if (positionsToInclude.includes('C') || positionsToInclude.includes('1B') || positionsToInclude.includes('2B') ||
				positionsToInclude.includes('SS') || positionsToInclude.includes('3B') || positionsToInclude.includes('OF') ||
				positionsToInclude.includes('DH')
			) {
				const battingColumns = [
					{ name: 'R', label: 'R', sortable: true },
					{ name: 'HR', label: 'HR', sortable: true },
					{ name: 'RBI', label: 'RBI', sortable: true },
					{ name: 'SB', label: 'SB', sortable: true },
					{ name: 'AVG', label: 'AVG', sortable: true },
					{ name: 'OBP', label: 'OBP', sortable: true },
					{ name: 'wOBA', label: 'wOBA', sortable: true },
					{ name: 'wRC', label: 'wRC', sortable: true }
				]
				columns = columns.concat(battingColumns)
			}
			if (positionsToInclude.includes('SP') || positionsToInclude.includes('RP'))	{
				const pitchingColumns = [
					{ name: 'IP', label: 'IP', sortable: true },
					{ name: 'W', label: 'W', sortable: true },
					{ name: 'K', label: 'K', sortable: true },
					{ name: 'SV', label: 'SV', sortable: true },
					{ name: 'ERA', label: 'ERA', sortable: true },
					{ name: 'WHIP', label: 'WHIP', sortable: true },
					{ name: 'FIP', label: 'FIP', sortable: true },
					{ name: 'K9', label: 'K9', sortable: true },
					{ name: 'BB9', label: 'BB9', sortable: true }
				]
				columns = columns.concat(pitchingColumns)
			} 
			if (this.loadedRanking && this.loadedRanking.algorithm) {
				columns.push({ name: 'score', label: 'Score', sortable: true })
			}
			return columns
		},

		async updateRanking(newRanking, type = 'ovr') {
			this.loading = true
			if (type === 'pitching') {
				await setTimeout(() => console.log('waiting 1 second for other operation to complete'), 1000)
			}

			if (newRanking.length) {
				console.log('New ranking received, saving to DB...', newRanking)
				let updatedRanking
				if (this.loadedRanking.ranking.length) {
					updatedRanking = newRanking.map(newPlayerRanking => {
						// check if this player already has a ranking.
						let previousPlayerRanking = this.loadedRanking.ranking.find(prev => prev.playerId === newPlayerRanking.playerId)
						// if exists, modify the previous record with the new ranking for this type.
						if (previousPlayerRanking) {
							previousPlayerRanking[type] = newPlayerRanking.rank + 1
							console.log('updating prev ranking to: ', previousPlayerRanking)
							return previousPlayerRanking // return the updated player ranking
						} else {
							// if no record already exists, just load the new rank & add type prop.
							newPlayerRanking[type] = newPlayerRanking.rank + 1
							return newPlayerRanking
						}
					})
					// concat the arrays so that players that were not updated get carried across the update
					updatedRanking = [ ...this.loadedRanking.ranking, ...updatedRanking ]
				} else {
					updatedRanking = newRanking.map(newPlayerRanking => {
						newPlayerRanking[type] = newPlayerRanking.rank + 1
						return newPlayerRanking
					})
				}
				this.createOrUpdateRanking({ ranking: updatedRanking })
				this.loadedRanking.ranking = updatedRanking
			}
		},

		updateRankingName(newName) {
			console.log('New name received, saving to DB...', newName)
			this.createOrUpdateRanking({ name: newName })
			this.displaySettingsModal = false
		},

		deleteRanking() {
			this.loading = true
			const mongodb = this.$realm.currentUser.mongoClient("mongodb-atlas")
			const rankings = mongodb.db("signstealing").collection("rankings")
			rankings.deleteOne({ 
				"_id": this.loadedRanking._id
			})
				.then(result => console.log(`Deleted ${result.deletedCount} item.`))
  			.catch(err => console.error(`Delete failed with error: ${err}`))
			// remove from local store
			this.rankings = this.rankings.filter(ranking => ranking._id.toString() !== this.loadedRankingId)
			// reset to default 
			this.loadRanking('')
			this.loading = false
			this.displaySettingsModal = false
		},

		getPlayerRanking(player, type = 'ovr') {
			let playerRanking
			if (this.loadedRanking && this.loadedRanking.ranking) {
				playerRanking = this.loadedRanking.ranking.find(playerRank => playerRank.playerId === player._id)
			}						
      return playerRanking ? playerRanking[type] : null
    },

		rankPlayers(players) {
      if (this.loadedRanking) {
        const playersWithScores = (this.loadedRanking && this.loadedRanking.algorithm) 
          ? this.calculatePlayersAlgoScores(players)
          : players
        return this.sortPlayersBySelectedRanking(playersWithScores)
      }
      return players
    },

		calculatePlayersAlgoScores(players) {
			if (this.loadedRanking.algorithm) {
				const playersWithScores = players.map(player => { 
					return {
            ovr: this.getPlayerRanking(player),
						batting: this.getPlayerRanking(player, 'batting'),
						pitching: this.getPlayerRanking(player, 'pitching'),
						...player,
						score: this.getAlgoScore(player),
					}
				})
        return playersWithScores
			} else {
				return players
			}
    },

		sortPlayersBySelectedRanking(players) {
      // Double check that a ranking is available.
      if (this.loadedRanking.ranking && this.loadedRanking.ranking.length) {
        // Sort the players by the loaded ranking
        players.sort((playerA, playerB) => {
          return this.getPlayerRanking(playerA) - this.getPlayerRanking(playerB)
        })
      }
      // return the sorted players
      return players
    },
	}
}
</script>

<template>
	<section class="rank">
		<div class="ranking-toolbar">
			<RankingSelector 
				:rankings="rankings" 
				:current-ranking="loadedRankingId"
				@selected="loadRanking" 
				@add="displayAddRankingModal = true"
			/>
			<div class="ranking-actions">
				<span v-if="loading">Saving...</span>
				<Button 
					v-if="isLoggedIn && loadedRankingId && displayMode !== 'positions'"
					:disabled="loading"
					@click="editing = !editing"
				>
					{{ editing ? 'SAVE' : 'EDIT' }}
				</Button>
				<DisplayTypeToggle 
					class="display-mode-toggle"
					:checked="displayMode" 
					@toggle="updateDisplayMode" 
				/>
				<Button @click="displaySettingsModal = true">Settings</Button>
			</div>
		</div>

		<Banner v-if="!isLoggedIn">
			<p><router-link to="login">Login</router-link> to create a custom algorithm for sorting players.</p>
		</Banner>

		<AlgoDefiner 
			v-if="isLoggedIn && loadedRanking"
			:key="loadedRankingId"
			:algorithm="loadedRanking.algorithm" 
			:loading="loading"
			@save-algorithm="handleAlgoSave" 
		/>

		<div :class="`player-display ${displayMode}`">
			<template v-if="displayMode === 'ovr'">
				<div class="panel">
					<PlayerTable 
						:players="players" 
						:columns="columnsByPositions(['C', '1B', '2B', 'SS', '3B', 'OF', 'DH', 'SP', 'RP'])"
						:positions="['C', '1B', '2B', 'SS', '3B', 'OF', 'DH', 'SP', 'RP']"
						header="All Players"
						:editing="editing"
						@ranking-updated="updateRanking"
					/>
				</div>
			</template>
			<template v-if="displayMode === 'split'">
				<div class="panel">
					<PlayerTable 
						:columns="columnsByPositions(['C', '1B', '2B', 'SS', '3B', 'OF', 'DH'])"
						:players="batters()"
						:positions="['C', '1B', '2B', 'SS', '3B', 'OF', 'DH']" 
						header="Batters"
						size="medium"
						:editing="editing"
						@ranking-updated="payload => updateRanking(payload, 'batting')"
					/>
				</div>
				<div class="panel">
					<PlayerTable 
						:columns="columnsByPositions(['SP', 'RP'])"
						:players="pitchers()"
						:positions="['SP', 'RP']"
						header="Pitchers"
						size="medium"
						:editing="editing"
						@ranking-updated="payload => updateRanking(payload, 'pitching')"
					/>
				</div>
			</template>
			<template v-if="displayMode === 'positions'">
				<div 
					v-for="position in ['C', '1B', '2B', 'SS', '3B', 'OF', 'DH', 'SP', 'RP']"
					:key="position"
					:class="`panel pos-${position}`"
				>
					<PlayerTable 
						:columns="columnsByPositions([position])"
						:players="playersByPositions([position])" 
						:header="position"
						size="small"
					/>
				</div>
			</template>
		</div>

		<AddRankingModal 
			v-if="displayAddRankingModal"
			@create="createNewRanking"
			@close="displayAddRankingModal = false" 
		/>

		<InfoModal 
			v-if="displaySettingsModal"
			:ranking="loadedRanking"
			@save="updateRankingName"
			@delete="deleteRanking"
			@close="displaySettingsModal = false"
		/>
	</section>
</template>

<style>
.rank {
	--table-border-thickness: 1px;
	--table-border-color: var(--neutral-light);
	--table-header-bg-color: var(--neutral-light);
	--table-header-text-color: var(--text-color);
}

.ranking-toolbar {
	margin: var(--space-xl) 0 var(--space);
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.ranking-actions {
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
}

.ranking-actions > * {
	margin-left: var(--space);
}

.player-display {
	display: grid;
	max-width: 100%;
}

.player-display.full {
	grid-template: auto / 1fr;
}

.player-display.split {
	grid-template: auto / 1fr 1fr;
}

.player-display.positions {
	grid-template: auto / 1fr 1fr 1fr;
	/* grid-template-rows: masonry; */
}

.panel {
	width: 100%;
	padding: var(--space-xxs);
	overflow-x: auto;
	margin-top: var(--space-xl);
}

.panel.pos-OF {
	grid-row: 1 / span 2;
	grid-column: 1;
}

.panel.pos-SS {
	grid-row: 1;
	grid-column: 2;
}

.panel.pos-SP {
	grid-row: 1 / span 2;
	grid-column: 3;
}

.panel.pos-3B {
	grid-row: 2;
	grid-column: 2;
}

.panel.pos-1B {
	grid-row: 3;
	grid-column: 1;
}

.panel.pos-2B {
	grid-row: 3;
	grid-column: 2;
}

.panel.pos-RP {
	grid-row: 3;
	grid-column: 3;
}

.panel.pos-C {
	grid-row: 4;
	grid-column: 1;
}

.panel.pos-DH {
	grid-row: 4;
	grid-column: 2;
}


</style>