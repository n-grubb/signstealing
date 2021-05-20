<script>
import Modal from '@/components/basics/Modal.vue'
import Input from '@/components/basics/Input.vue'
import Button from '@/components/basics/Button.vue'

export default {
  components: { 
    Modal, 
    Input,
    Button 
  },
  props: {
    ranking: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      newRankingName: ''
    }
  },
  created() {
    if (this.ranking.name) {
      this.newRankingName = this.ranking.name
    }
  },
  computed: {
    invalid() {
      return !this.newRankingName
    }
  }
}
</script>

<template>
  <Modal 
    title="Ranking Settings"
    :fix-header-and-footer="true"
    @close="$emit('close')"
  >
    <template v-slot:content>
      <Input
        v-model="newRankingName"
        type="text" 
        name="ranking-name" 
        label="Ranking Name:"
      />
    </template>
     <template v-slot:actions>
        <Button 
          :disabled="invalid"
          @click="$emit('save', newRankingName)"
        >
          Save
        </Button>
        <Button @click="$emit('delete')">
          Delete This 
        </Button>
      </template>
  </Modal>
</template>
