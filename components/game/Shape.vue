<script setup lang="ts">
import ClosedIcon from '@modules/games/mines/components/game/ClosedIcon.vue'
import MineIcon from '@modules/games/mines/components/game/MineIcon.vue'
import DiamondIcon from '@modules/games/mines/components/game/DiamondIcon.vue'
import { useState } from '@composable/useState'
import { defineAsyncComponent, ref, watch } from 'vue'
import { useGameBus } from '@modules/games/mines/composable/useGameBus'
import White from '../../animations/white.json'
import Red from '../../animations/red.json'

const props = defineProps<Props>()
const emit = defineEmits(['open'])
const Vue3Lottie = defineAsyncComponent(async () => (await import('vue3-lottie')).Vue3Lottie)
interface Props {
  mine: boolean
  lost: boolean
  disabled: boolean
  index: number
}
type ShapeState = 'closed' | 'mine' | 'diamond'
type ShapeStep = '' | 'scaled' | 'mine' | 'diamond'

const gameBus = useGameBus()
const LottieRef = ref<any>(null)
const [animationData, setAnimationData] = useState<any>('')
const [animationVisible, setAnimationVisible] = useState<boolean>(false)
const [state, setState] = useState<ShapeState>('closed')
const [step, setStep] = useState<ShapeStep>('')
const [hover, setHover] = useState<boolean>(false)

gameBus.on('select', ({ index }) => {
  if (index === props.index)
    onClick()
})
gameBus.on('hover', ({ index }) => {
  if (index === props.index)
    setHover(true)
})
gameBus.on('unHover', ({ index }) => {
  if (index === props.index)
    setHover(false)
})

function onClick() {
  if (props.disabled) {
    // useError('make bet')
    return
  }

  if (state.value !== 'closed')
    return

  emit('open')

  const finalStep: Exclude<ShapeStep, 'scaled' | ''> = props.mine ? 'mine' : 'diamond'

  setStep('scaled')

  setAnimationVisible(true)
  setAnimationData(finalStep === 'mine' ? Red : White)

  setTimeout(() => {
    setStep(finalStep)
    setState(finalStep)
    LottieRef.value?.play()
  }, 100)
  setTimeout(() => setAnimationVisible(false), 650)
}

watch(() => props.lost, (newValue: boolean) => {
  if (newValue)
    setState(props.mine ? 'mine' : 'diamond')
})
</script>

<template>
  <div :class="[$style.root, $style[step], disabled && $style.disabled, lost && $style.lost, hover && $style.hover]" @click="onClick">
    <ClosedIcon v-if="state === 'closed'" :class="$style.icon" />

    <MineIcon v-else-if="state === 'mine'" :class="$style.icon" />

    <DiamondIcon v-else-if="state === 'diamond'" :class="$style.icon" />

    <Vue3Lottie
      v-if="animationVisible"
      ref="LottieRef"
      :loop="false"
      :class="$style.animation"
      :speed="1.5"
      :auto-play="false"
      renderer="canvas"
      :animation-data="animationData"
      :width="90"
      :height="90"
    />
  </div>
</template>

<style module lang="scss">
.root {
  @apply w-[90px] h-[90px] rounded-big cursor-pointer;
  @apply flex items-center justify-center relative;
  transition: .1s linear;
  border: 2px solid #37424A;
  background: linear-gradient(0deg, #1D2226 0%, #1D2226 100%), #333B42;

  &:hover:not(.disabled) {
    background: #313A41;
  }

  @media screen and (max-width: 1919px) {
    @apply w-[84px] h-[84px];
  }

  @include _1440 {
    @apply w-[74px] h-[74px];
  }
}

.hover:not(.disabled) {
  background: #313A41;
}

.lost {
  @apply border-0 bg-[#1D2226] opacity-70;
}

.disabled {
  cursor: default;
}

.animation {
  @apply absolute top-0 left-0;
}

.scaled {
  transform: scale(0.8);
}

.icon {
  @apply w-[48px] h-[48px];
}

.diamond {
  background: #0F391B !important;
  border: 2px solid #0F391B;
  opacity: 1;
}

.mine {
  background: #592027 !important;
  border: 2px solid #592027;
  opacity: 1;
}
</style>
