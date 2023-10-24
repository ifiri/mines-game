<script setup lang="ts">
import type { MapItem } from '@modules/games/mines/mines.types'
import AnimatedNumber from '@components/Interface/AnimatedNumber.vue'
import { Icon } from '@components/Icon'
import Shape from './Shape.vue'

interface Props {
  map: MapItem[]
  progress: number
  lost: boolean
  disabled: boolean
  winCoeff?: number
  winAmount?: number
}

defineProps<Props>()
const emit = defineEmits(['open'])

function onFieldClick(index: number) {
  emit('open', index)
}
</script>

<template>
  <div :class="$style.root">
    <!--  Progress  -->
    <div :class="$style.progress">
      <div :class="$style.thumb" :style="`width: ${progress}%;`" />
    </div>

    <!--  Rest field  -->
    <div :class="$style.field">
      <Shape v-for="(mapItem, index) in map" :key="`mines-shape-${index}`" :index="index" :lost="lost" :disabled="disabled" :mine="mapItem.mine" @open="() => onFieldClick(index)" />
    </div>

    <transition name="fade">
      <div v-if="winAmount && winCoeff" :class="$style.modal">
        <span class="text-24 font-600 text-white">
          x<AnimatedNumber :to="winCoeff" />
        </span>

        <div class="flex items-center justify-center gap-1.5 px-3 py-[18px] rounded-[8px] bg-[#017537] w-full">
          <Icon name="logo-btc-sm" class="w-6 h-6" />

          <span class="text-20 font-700 text-white">
            <AnimatedNumber :to="winAmount" />

            {{ 'BNB' }}
          </span>
        </div>
      </div>
    </transition>
  </div>
</template>

<style module lang="scss">
.modal {
  @apply absolute top-[50%] left-[50%];
  @apply rounded-big p-3 flex flex-col gap-2 items-center;
  border: 2.5px solid #06D458;
  background: linear-gradient(180deg, #009F40 0%, #00B047 100%);
  box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.25);
  transform: translateX(-50%) translateY(-50%);
  width: calc(60% - 16px);
}

.root {
  @apply rounded-big bg-[#101315] p-3;
  @apply flex flex-col gap-3 relative;
}

.field {
  @apply grid grid-cols-5 gap-2;
}

.progress {
  @apply h-2 bg-[#1D2226] rounded-[20px] w-full;
}

.thumb {
  @apply h-2 rounded-[20px] transition-all max-w-full;
  background: var(--yellow-gradient);
}
</style>
