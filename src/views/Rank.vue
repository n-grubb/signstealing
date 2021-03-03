<template>
	<section class="rank">
		<PlayerTable />
	</section>
</template>

<script>
import PlayerTable from '@/components/PlayerTable/PlayerTable.vue'
export default {
	components: { PlayerTable }
}
</script>

<style scoped>
.rank {
	--table-border-thickness: 1px;
	--table-border-color: var(--neutral-light);
	--table-header-bg-color: var(--neutral-light);
	--table-header-text-color: var(--text-color);
}
</style>