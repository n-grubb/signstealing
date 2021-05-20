<script>
/**
 * This component allows a user to define an algorithm to sort players by.
 * I call it.. the AlgoDefiner. 
 * The component will list available stats and the user can define a weight for each stat. 
 * An alorithm is then created to match the inputs and passed back so that we can sort players accordingly.
 * TODO: Rework this component to be more user friendly and robust.
 * Think ClickUp filter criteria, so pick a stat, pick an operation, AND?
 */
export default {
  name: 'AlgoDefiner',
  props: {
    algorithm: {
      type: Object,
      default: null
    },
    loading: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      editing: false,
      algoDefinition: {
        batting: [
          { name: 'R', adjustment: 0, weight: 0 },
          { name: 'RBI',adjustment: 0,  weight: 0 },
          { name: 'HR', adjustment: 0, weight: 0 },
          { name: 'SB', adjustment: 0, weight: 0 },
          { name: 'OBP', adjustment: 0, weight: 0 },
          { name: 'AVG', adjustment: 0, weight: 0 },
          { name: 'wOBA', adjustment: 0, weight: 0 },
          { name: 'wRC', adjustment: 0, weight: 0 }
        ],
        pitching: [
          { name: 'IP', adjustment: 0, weight: 0 },
          { name: 'K', adjustment: 0, weight: 0 },
          { name: 'SV', adjustment: 0, weight: 0 },
          { name: 'ERA', adjustment: 0, weight: 0 },
          { name: 'WHIP', adjustment: 0, weight: 0 },
          { name: 'FIP', adjustment: 0, weight: 0 },
          { name: 'K9', adjustment: 0, weight: 0 },
          { name: 'BB9', adjustment: 0, weight: 0 }
        ]
      }
    }
  },
  created() {
    this.updateLocalState()
  },
  updated() {
    this.updateLocalState()
  },
  computed: {
    /**
     * Display the Algorithm as a string.
     */
    battingAlgorithm() {
      const stats = this.algoDefinition.batting.filter(stat => stat.weight !== 0 || stat.adjustment !== 0)
      return this.stringifyAlgorithm(stats)
    },

    pitchingAlgorithm() {
      const stats = this.algoDefinition.pitching.filter(stat => stat.weight !== 0 || stat.adjustment !== 0)
      return this.stringifyAlgorithm(stats)
    },

    hasAlgorithmDefined() {
      return !!this.battingAlgorithm || !!this.pitchingAlgorithm
    }
  },
  methods: {
    /** 
     * We accept an initial state for the algorithm definition, but we only want to pass state back up on a save event.
     * This function updates the local state based on the passed algorithm (or a change to it.)
     */
    updateLocalState() {
      /* We check for the existence of a batting array to ensure the received algorithm is in the right format. */
      if (this.algorithm && (this.algorithm.batting && this.algorithm.batting.length || this.algorithm.pitching && this.algorithm.pitching.length)) {
        this.algoDefinition = this.algorithm
      }
    },

    toggleEditMode() {
      this.editing = !this.editing
    },

    saveAlgorithm(event) {
      event.preventDefault()
      this.$emit('saveAlgorithm', this.algoDefinition)
      this.toggleEditMode()
    },

    stringifyAlgorithm(stats) {
      let algoString = ''
      stats.forEach((stat, index) => {
        if (index > 0) {
          algoString = algoString + ' + '
        }
        if (stat.adjustment !== 0) {
          const operation = stat.adjustment > 0 ? '+' : '-'
          algoString = algoString + `[(${stat.name} ${operation} ${Math.abs(stat.adjustment)}) * ${stat.weight}]`
        } else {
          algoString = algoString + `[${stat.name} * ${stat.weight}]`
        }
      })
      return algoString
    }
  }
}
</script>

<template>
  <form class="algo-definer" :class="{editing}">
    <div class="algo-definer__header">
      <h3>Define a sorting algorithm</h3>
    </div>
    <div v-if="editing" class="algo-definer__category">
      <h4>Batting</h4>
      <div 
        v-for="stat in algoDefinition.batting" 
        :key="stat.name" 
        class="algo-definer__stat"
      >
        <label for="stat.name">{{ stat.name }}:</label>
        <div> 
          <span>Adjustment:</span>
          <input v-model="stat.adjustment" type="number" id="stat.adjustment" name="stat.adjustment" step="1" :disabled="!editing" placeholder="0" />
        </div>
        <div> 
          <span>Weight:</span>
          <input v-model="stat.weight" type="number" id="stat.name" name="stat.name" step=".125" :disabled="!editing" placeholder="0" />
        </div>
      </div>
    </div>
    <div v-if="editing" class="algo-definer__category">
      <h4>Pitching</h4>
      <div 
        v-for="stat in algoDefinition.pitching" 
        :key="stat.name" 
        class="algo-definer__stat"
      >
        <label>{{ stat.name }}:</label>
        <div> 
          <span>Adjustment:</span>
          <input v-model="stat.adjustment" type="number" id="stat.adjustment" name="stat.adjustment" step="1" :disabled="!editing" placeholder="0" />
        </div>
        <div> 
          <span>Weight:</span>
          <input v-model="stat.weight" type="number" id="stat.name" name="stat.name" step=".125" :disabled="!editing" placeholder="0" />
        </div>
      </div>
    </div>
    <div 
      v-if="!loading"
      class="algo-definer__actions"
    >
      <div 
        v-if="hasAlgorithmDefined" 
        class="algo-definer__algo-display"
      >
        <h4>Generated Algorithm:</h4>
        <p v-if="battingAlgorithm">
          <strong>Batting:</strong>
          {{ battingAlgorithm }}
        </p>
        <p v-if="pitchingAlgorithm">
          <strong>Pitching:</strong>
          {{ pitchingAlgorithm }}
        </p>
      </div>
      <button 
        v-if="!editing" 
        class="edit-algo" 
        :disabled="loading"
        @click="toggleEditMode"
      >
        {{ hasAlgorithmDefined ? 'Edit' : 'Create' }}
      </button>
      <button v-else class="save-algo" @click="saveAlgorithm">Save &amp; Sort</button>
    </div>
  </form>
</template>

<style scoped>
.algo-definer {
  border: var(--border-thickness) solid var(--neutral-light);
  border-radius: var(--border-radius);
  margin-bottom: var(--space);
  background-color: var(--white);
  display: grid;
  grid-template: auto / 50% 50%;
}

.algo-definer__header {
  grid-row: 1;
  grid-column: 1 / span 2;
  padding: var(--space);
  border-bottom: var(--border-thickness) solid var(--neutral-light);
}

.algo-definer__header h3 {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
}

.algo-definer__category {
  padding: var(--space);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}

.algo-definer__category + .algo-definer__category {
  border-left: var(--border-thickness) solid var(--neutral-light);
}

.algo-definer__category h4 {
  width: 100%;
  margin-bottom: var(--space-sm);
  font-size: var(--text-lg);
  font-weight: var(--font-semi);
}

.algo-definer__stat {
  display: grid;
  grid-template: auto / 4.5rem;
}

.algo-definer__stat label {
  font-weight: var(--font-semi);
}

.algo-definer__stat span {
  font-size: var(--text-xs);
  font-weight: var(--font-light);
}

.algo-definer__stat input {
  display: block; 
  appearance: none;
  max-width: 100%;
  padding: var(--space-xs);
  border: var(--border-thickness) solid var(--neutral-light);
  border-radius: var(--border-radius);
  font-size: var(--text-sm);
  color: var(--neutral-dark);
}

.algo-definer__algo-display {
  font-size: var(--text-sm);
}

.algo-definer__algo-display h4 {
  font-size: var(--text-md);
  font-weight: var(--font-bold);
}




.algo-definer__actions {
  grid-row: 3;
  grid-column: 1 / span 2;
  padding: var(--space);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.algo-definer__category + .algo-definer__actions {
  border-top: var(--border-thickness) solid var(--neutral-light);
}

.algo-definer__actions button {
  justify-self: end;
  padding: var(--space-xs) var(--space-sm);
  border: 1px solid var(--neutral-dark);
  border-radius: var(--border-radius);
  margin-right: var(--space);
  background: var(--white);
  color: var(--neutral-dark);
}

.algo-definer__actions button.save-algo {
  background-color: var(--accent);
  color: var(--cool-white);
}
</style>