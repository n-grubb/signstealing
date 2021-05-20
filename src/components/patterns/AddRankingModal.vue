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
  data() {
    return {
      newRankingName: ''
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
    title="Create New Ranking"
    :fix-header-and-footer="true"
    @close="$emit('close')"
  >
    <template v-slot:content>
      <Input
        v-model="newRankingName"
        type="text" 
        name="ranking-name" 
        label="Name your ranking:"
      />
    </template>
     <template v-slot:actions>
        <Button 
          :disabled="invalid"
          @click="$emit('create', newRankingName)"
        >
          Create
        </Button>
        <Button @click="$emit('close')">
          Cancel
        </Button>
      </template>
  </Modal>
</template>


<style scoped>
</style>
