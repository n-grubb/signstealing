<script>
import RankingSelector from '@/components/RankingSelector/RankingSelector.vue'
import Button from '@/components/basics/Button.vue'
import DraftTable from '@/components/patterns/DraftTable.vue'
import MyRoster from '@/components/patterns/MyRoster.vue'
import players from '@/data/player-projections.json'

export default {
  components: { 
    RankingSelector,
    Button,
    DraftTable,
    MyRoster
  },
  data() {
		return {
      loading: true,
      draftInProgress: false,
      draftCompleted: false,
      rankings: [],
      selectedRanking: null,
      draftedPlayers: [],
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

    selectedRankingId() {
			return (this.selectedRanking && this.selectedRanking._id && this.selectedRanking._id.toString()) ? this.selectedRanking._id.toString() : ''
		},

    batters() {
			return this.filterPlayersByPositions(['C', '1B', '2B', 'SS', '3B', 'OF', 'DH'])
    },

    pitchers() {
      return this.filterPlayersByPositions(['SP', 'RP'])
    },

    rankedBatters() {
      return this.rankPlayers(this.batters, 'batting')
    },

    rankedPitchers() {
      return this.rankPlayers(this.pitchers, 'pitching')
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
			if (!this.selectedRanking) {
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
				this.selectedRanking = null
				localStorage.removeItem('last-loaded-ranking')
			}
			// The user selected a ranking to load.
			else if (rankingId) {
				console.log('ranking id provided, loading chosen ranking.')
				this.selectedRanking = this.rankings.find(ranking => ranking._id.toString() === rankingId)
				console.log('loaded:', this.selectedRanking)
				localStorage.setItem('last-loaded-ranking', this.selectedRankingId)
			} 
			// initial load: // if an entry for last-loaded-ranking exists in the local storage, pull it.
			else if (localStorage.getItem('last-loaded-ranking')) {
				console.log('no ranking id provided, loading from local storage.')
				this.selectedRanking = this.rankings.find(ranking => ranking._id.toString() === localStorage.getItem('last-loaded-ranking'))
			} else {
				console.log('no ranking id provided, no value in local storage, loading first from db.')
				// otherwise, grab the first ranking returned from the DB.
				this.selectedRanking = this.rankings[0]
				localStorage.setItem('last-loaded-ranking', this.selectedRankingId)
			}
		},

    beginDraft() {
      this.draftInProgress = true
      console.log('Start draftin.')
    },

    completeDraft() {
      this.draftInProgress = false
      this.draftCompleted = true
      console.log('Draft completed.')
    },

    getTableColumns(positionCategory) {
      let columns = [
        { name: 'name', label: 'NAME', align: 'left', minWidth: 200 },
        { name: 'team', label: 'TEAM' },
        { name: 'pos', label: 'POS', minWidth: 160 },
        { name: 'ADP', label: 'ADP', sortable: true, maxWidth: 100 }
      ]
      if (positionCategory === 'batting') {
        columns = columns.concat([
          { name: 'R', label: 'R', sortable: true },
          { name: 'HR', label: 'HR', sortable: true },
          { name: 'RBI', label: 'RBI', sortable: true },
          { name: 'SB', label: 'SB', sortable: true },
          { name: 'OBP', label: 'OBP', sortable: true }
        ])
      }
      if (positionCategory === 'pitching') {
        columns = columns.concat([
					{ name: 'K', label: 'K', sortable: true },
          { name: 'ERA', label: 'ERA', sortable: true },
          { name: 'FIP', label: 'FIP', sortable: true },
          { name: 'WHIP', label: 'WHIP', sortable: true },
					{ name: 'SV', label: 'SV', sortable: true },
					{ name: 'K9', label: 'K9', sortable: true },
					{ name: 'BB9', label: 'BB9', sortable: true }
        ])
      }
      if (this.selectedRanking && this.selectedRanking.algorithm) {
				columns.push({ name: 'score', label: 'Score', sortable: true })
			}
      return columns
    },

    filterPlayersByPositions(positionsArray) {
      return players.filter(player => (
				player.pos && player.pos.some(position => positionsArray.includes(position)) 
			))
    },

    getPlayerRanking(player, type = 'ovr') {
      const playerRanking = this.selectedRanking.ranking.find(playerRank => playerRank.playerId === player._id)
      return playerRanking ? playerRanking[type] : 999
    },

    calculatePlayerScore(player) {
      let score = 0
      if (this.selectedRanking.algorithm.batting) {
        this.selectedRanking.algorithm.batting.forEach(stat => {
					if (player[stat.name]) {
						score += (parseFloat(player[stat.name]) + parseFloat(stat.adjustment)) * parseFloat(stat.weight)
					}
				})
      }
      if (this.selectedRanking.algorithm.pitching) {
				this.selectedRanking.algorithm.pitching.forEach(stat => {
					if (player[stat.name]) {
						score += (parseFloat(player[stat.name]) + parseFloat(stat.adjustment)) * parseFloat(stat.weight)
					}
				})
			}
			return parseFloat(score.toFixed(1))
    },

    calculatePlayersAlgoScores(players) {
			if (this.selectedRanking.algorithm) {
				const playersWithScores = players.map(player => { 
					return {
						...player,
						score: this.calculatePlayerScore(player),
					}
				})
        return playersWithScores
			} else {
				return players
			}
    },

    sortPlayersBySelectedRanking(players, type) {
      // Double check that a ranking is available.
      if (this.selectedRanking.ranking && this.selectedRanking.ranking.length) {
        // Sort the players by the loaded ranking
        players.sort((playerA, playerB) => {
          return this.getPlayerRanking(playerA, type) - this.getPlayerRanking(playerB, type)
        })
      }
      // return the sorted players
      return players
    },

    rankPlayers(players, type = 'ovr') {
      if (this.selectedRanking) {
        const playersWithScores = (this.selectedRanking && this.selectedRanking.algorithm) 
          ? this.calculatePlayersAlgoScores(players)
          : players
        return this.sortPlayersBySelectedRanking(playersWithScores, type)
      }
      return players
    }
  }
}
</script>

<template>
<section class="draft">
  <h1>Draft:</h1>
  <div 
    v-if="!draftInProgress"
    class="intro"
  >
    <p>Ready to draft? Load a ranking and click start to begin</p>
    <RankingSelector 
      :rankings="rankings" 
      :current-ranking="selectedRankingId"
      :can-add-ranking="false"
      @selected="loadRanking" 
    />
    <Button 
      :disabled="!isLoggedIn || !selectedRankingId"
      @click="beginDraft"
    >
      Start
    </Button>
  </div>
  <!-- 
    <MyRoster 
    v-else 
    drafted={this.draftedPlayers} 
  /> 
  -->

  <div 
    v-if="draftInProgress"
    class="draft-window"
  >
    <div class="toolbar">
      <!-- Searchbar -->
      <!-- Layout Toggle -->
    </div>
    <div class="panel">
      <DraftTable 
        header="Batters"
        :players="rankedBatters" 
        :positions="['C', '1B', '2B', 'SS', '3B', 'OF', 'DH']"
        :columns="getTableColumns('batting')"
      />
    </div>
    <div class="panel">
      <DraftTable 
        header="Pitchers"
        :players="rankedPitchers" 
        :positions="['SP', 'RP']"
        :columns="getTableColumns('pitching')"
      />
    </div>
  </div>
</section>
</template>

<style>
.draft h1 {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
}

.intro {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-end;
}

.intro p {
  width: 100%;
  margin-bottom: var(--space-xs);
}

.intro button {
  margin-left: var(--space);
}

.draft-window {
  display: grid;
  grid-template: auto / 1fr 1fr;
}

.draft-window .toolbar {
  grid-row: 1;
  grid-column: 1 / span 2;
}
</style>