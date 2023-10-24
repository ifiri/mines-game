<script setup lang="ts">
import DiamondIcon from '@modules/games/mines/components/game/DiamondIcon.vue'
import MineIcon from '@modules/games/mines/components/game/MineIcon.vue'
import { AnimatedNumber } from '@components/Interface'

interface Props {
  type: 'mine' | 'diamond'
  to: number
}

defineProps<Props>()
</script>

<template>
  <div :class="$style.root">
    <DiamondIcon v-if="type === 'diamond'" :class="$style.icon" />

    <MineIcon v-else :class="$style.icon" />

    <AnimatedNumber :full="true" :class="$style.to" :to="to" />
  </div>
</template>

<style module lang="scss">
.root {
  @apply rounded-normal flex flex-col items-center gap-3 bg-[#1D2226] py-3 px-4;
  border: 2px solid rgba(55, 66, 74, 0.50);
}

.icon {
  @apply w-[68px] h-[68px];
}

.to {
  @apply text-24 font-700 text-[#CACDCF];
}
</style>
