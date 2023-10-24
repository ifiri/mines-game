<script setup lang="ts">
import { Icon } from '@components/Icon'
import { computed, watch } from 'vue'
import { useState } from '@composable/useState'

interface Props {
  stepCount: number
  level: number
  coeffs: number[]
  gameId: string
}

const props = defineProps<Props>()
const PER_PAGE = 7
const [page, setPage] = useState<number>(parseInt(String(props.level % PER_PAGE)))

const onNext = () => setPage(page.value + 1)
const onPrev = () => setPage(page.value - 1)

const count = computed<number>(() => {
  return Math.min(props.stepCount - (page.value * PER_PAGE), 7)
})

watch(() => props.level, (newLevel: number) => {
  if (newLevel <= 0)
    return

  const currentPage = Math.floor((newLevel - 1) / PER_PAGE)

  setPage(currentPage)
})
watch(() => props.gameId, () => setPage(0))
</script>

<template>
  <div :class="$style.root">
    <button :disabled="page === 0" :class="$style.arrowButton" @click="onPrev">
      <Icon name="arrow" />
    </button>

    <div class="w-full flex items-center gap-1">
      <button
        v-for="index in count"
        :key="index + (page * PER_PAGE)"
        :disabled="index + (page * PER_PAGE) < level"
        :class="[$style.button, index + (page * PER_PAGE) <= level && $style.buttonActive]"
      >
        <span :class="$style.buttonStep">
          {{ `Step ${index + (page * PER_PAGE)}` }}
        </span>

        <span :class="$style.buttonCoeff">
          {{ `x${coeffs.at(index + (page * PER_PAGE) - 1)}` }}
        </span>
      </button>
    </div>

    <button :disabled="parseInt(String(stepCount / PER_PAGE)) <= page" :class="$style.arrowButton" @click="onNext">
      <Icon name="arrow" />
    </button>
  </div>
</template>

<style module lang="scss">
.root {
  display: flex;
  gap: 4px;
  height: 50px;
  min-height: 50px;
}

.shape {
  border-radius: $radius;
  background: var(--gray-5);
  height: 100%;
}

.arrowButton {
  @extend .shape;
  padding: 8px;
  width: 32px;
  min-width: 32px;

  &:hover {
    color: var(--white);
  }

  &:last-child > svg {
    transform: rotate(180deg);
  }
}

.button {
  @extend .shape;
  padding: 2px 12px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 2px;
  transition: .3s;
  width: 100%;
  max-width: 120px;

  &Step {
    color: var(--gray-2);
    font-size: 12px;
    font-weight: 500;
    transition: .3s;
  }

  &Coeff {
    color: var(--gray-2);
    font-size: 14px;
    font-weight: 600;
    transition: .3s;
  }

  &Active {
    background: var(--gray-3);

    & .buttonStep {
      color: var(--white);
    }

    & .buttonCoeff {
      color: var(--yellow)
    }
  }
}
</style>
