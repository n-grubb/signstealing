<script>
import IconMultiply from '/@vite-icons/uil/multiply'

export default {
  components: { IconMultiply },
  props: {
    title: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    fixHeaderAndFooter: {
      type: Boolean,
      default: false
    },
    closeOnClickOutside: {
      type: Boolean,
      default: true
    },
    closeable: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },

    handleBgClick(e) {
      if (
      // Since the background element is the parent of the modal,
      // we must ensure they only clicked the background before
      // sending the close event.
        typeof e.target.className === 'string' &&
        e.target.className.includes('modal-bg') &&
        this.closeable &&
        this.closeOnClickOutside
      ) {
        this.close()
      }
    }
  }
}
</script>

<template>
  <div
    class="modal-bg"
    @click="handleBgClick"
  >
    <div
      :class="['modal', {'fixed': fixHeaderAndFooter }]"
      role="dialog"
      aria-labelledby="modal-title"
      aria-describedby="modal-content"
    >
      <div
        v-if="closeable"
        class="click-context modal__close"
        aria-label="Close modal"
        @click="close"
      >
        <IconMultiply />
      </div>
      <header
        id="modal-title"
        class="modal__title"
      >
        <slot name="title">
          {{ title }}
        </slot>
      </header>
      <section
        id="modal-content"
        class="modal__content"
      >
        <slot name="content">
          {{ content }}
        </slot>
      </section>
      <footer
        class="modal__actions"
      >
        <slot name="actions" />
      </footer>
    </div>
  </div>
</template>


<style>
.modal-bg {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0;
  background-color: rgba(0, 0, 0, .25);
  z-index: var(--elevation-lg);
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.modal {
  position: relative;
  width: 32rem;
  max-width: calc(100% - 3rem);
  max-height: calc(100% - 3rem);
  border-radius: var(--modal-border-radius, .5rem);
  margin-top: var(--space-xl);
  background-color: var(--white);
  box-shadow: var(--space-xxs) var(--space-xxs) var(--space-xxs) rgba(0,0,0,.15);
  overflow: auto;  
  text-align: left;
  z-index: var(--elevation-lg);
  display: grid;
  grid-template-rows: auto auto auto;
}
 
.modal__close {
  box-sizing: content-box;
  position: absolute;
  top: var(--space-sm);
  right: var(--space-sm);
  padding: var(--space-xxs);
  margin: 0;
  z-index: var(--elevation-md);
}

.modal__close svg {
  padding-top: 4px;
  height: 1.5rem;
  width: 1.5rem;
}

.modal__close:hover {
  fill: var(--accent);
  background-color: var(--neutral-lighter);
  border-radius: 50%;
}

.modal__title {
  grid-row: 1;
  width: 100%;
  padding: var(--space);
  padding-right: var(--space-lg);
  background-color: var(--cool-white); 
  border-bottom: 1px solid var(--neutral-light);
  z-index: var(--elevation-sm);
  border-radius: 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.modal__content {
  grid-row: 2;
  width: 100%;
  min-height: 6rem;
  padding: var(--space);
  scroll-behavior: smooth;
}

.modal__content p {
  margin: 0;
  line-height: 1.5;
}

.modal__content * + p {
  margin-top: var(--space-xs);
}

.modal__actions {
  grid-row: 3;
  width: 100%;
  padding: var(--space);
  border-top: 1px solid var(--neutral-light);
  background-color: var(--cool-white);
  z-index: var(--elevation-sm);
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.modal__actions .button {
  min-width: 6rem;
  margin-right: var(--space);
  font-size: var(--text-sm);
}

.modal.fixed {
  overflow: hidden;
}

.modal.fixed .modal__content {
    overflow: auto;
    overflow-x: hidden;
}
</style>
