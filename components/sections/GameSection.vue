<script setup lang="ts">
import { computed } from 'vue'
import type { MapItem } from '@modules/games/mines/mines.types'
import GameField from '../game/Field.vue'
import ResourceCount from '../game/ResourceCount.vue'

interface Props {
  diamonds: number
  diamondsLeft: number
  mines: number
  minesLeft: number
  shapes: number
  level: number
  gameId: string
  gameplay: boolean
  map: MapItem[]
  lost: boolean
  winAmount?: number
  winCoeff?: number
}

const props = defineProps<Props>()
const emit = defineEmits(['open'])

const onOpen = (value: number) => emit('open', value)
const progress = computed<number>(() => Math.round(props.level / props.diamonds * 100))
</script>

<template>
  <div :class="$style.root">
    <div :class="$style.pattern" />

    <div :class="$style.content">
      <div class="flex flex-col gap-3 ">
        <ResourceCount :to="diamondsLeft" type="diamond" />

        <ResourceCount :class="$style.mobileMines" :to="minesLeft" type="mine" />
      </div>

      <GameField :key="mines + gameId" :win-amount="winAmount" :win-coeff="winCoeff" :lost="lost" :disabled="!gameplay" :progress="progress" :map="map" @open="onOpen" />

      <ResourceCount :class="$style.desktopMines" :to="minesLeft" type="mine" />
    </div>
  </div>
</template>

<style module lang="scss">
.root {
  @apply h-full rounded-normal relative;
  @apply flex items-center justify-center;
  background: linear-gradient(0deg, #16191C 0%, #16191C 100%), linear-gradient(180deg, #1D2226 0%, #1B3661 100%);
}

.pattern {
  @apply absolute top-0 left-0 right-0 bottom-0 z-0;
  background-image: url('/img/mines/pattern.svg');
}

.content {
  @apply relative z-10 flex gap-3 items-center;
}

.mobileMines {
  display: none;

  @include _1440 {
    display: flex;
  }
}

.desktopMines {
  display: flex;

  @include _1440 {
    display: none;
  }
}
</style>
