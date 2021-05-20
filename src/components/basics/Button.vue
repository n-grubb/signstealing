<template>
  <button class="button">
    <slot />
  </button>
</template>

<style scoped>
.button {
  min-width: 2.625rem;
  min-height: 2.625rem;
  padding: var(--space-xs);
  border: 1px solid var(--neutral-light);
  border-radius: 4px;
  background: var(--white);
  box-shadow: 2px 2px 2px rgba(0,0,0,.15);
  font-weight: var(--font-medium);
  display: flex;
  justify-content: center;
  align-items: center;
}

.button:hover {
  color: var(--accent);
  box-shadow: 4px 4px 4px rgba(0,0,0,.15);
}
</style>