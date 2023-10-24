<script setup lang="ts">
import { BetSection, GameSection, HistorySection, LevelSection } from '@modules/games/mines/components'
import { useVolume } from '@composable/useVolume'
import { useState } from '@composable/useState'
import { useFullscreen } from '@vueuse/core'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import TableSection from '@modules/games/tower/components/Section/TableSection.vue'
import type { MapItem } from '@modules/games/mines/mines.types'
import { useGameBus } from '@modules/games/mines/composable/useGameBus'
import { useLayoutStore } from '@/store/Layout'

const SHAPES_COUNT = 25

const gameBus = useGameBus()
const volume = useVolume()
const fullscreen = useFullscreen()
const layoutStore = useLayoutStore()
const [minesCount, setMinesCount] = useState<number>(3)
const [amount, setAmount] = useState<string>('')
const [level, setLevel] = useState<number>(0)
const [lost, setLost] = useState<boolean>(false)
const [win, setWin] = useState<boolean>(false)

const [winCoeff, setWinCoeff] = useState<number>(0)
const [autoSelect, setAutoSelect] = useState<any>(null)
const [gameId, setGameId] = useState<string>('1')
const [isBetLoading, setIsBetLoading] = useState<boolean>(false)
const [bet, setBet] = useState<number>(0)
const opened = ref<number[]>([])

const coeffs = computed<number[]>(() => {
  return Array.from({ length: SHAPES_COUNT - minesCount.value }, (_, index) => Number((minesCount.value * minesCount.value / 12 * (index + 2)).toFixed(2)))
})
const currentCoeff = computed<number | undefined>(() => {
  return level.value === 0 ? undefined : coeffs.value.at(level.value - 1)
})
const potentialWinAmount = computed<number | undefined>(() => {
  return !currentCoeff.value ? undefined : (currentCoeff.value * Number(amount.value))
})
const finalWinAmount = computed<number | undefined>(() => {
  return win.value ? potentialWinAmount.value : undefined
})
const preMap = computed<MapItem[]>(() => {
  return Array.from({ length: SHAPES_COUNT }, (_, index) => ({
    mine: index < minesCount.value,
  })).sort(() => Math.random() - 0.5)
})
const map = computed<MapItem[]>(() => preMap.value.map((mapItem, index) => ({
  ...mapItem,
  clicked: opened.value.includes(index),
})))
const minesLeft = computed<number>(() => map.value.filter(mapItem => mapItem.mine && !mapItem.clicked).length)
const diamondsLeft = computed<number>(() => map.value.filter(mapItem => !mapItem.mine && !mapItem.clicked).length)

function onBet() {
  setIsBetLoading(true)

  setTimeout(() => {
    setBet(Number(amount.value))

    resetGame()

    setIsBetLoading(false)
  }, 100)
}
function onCashout() {
  setIsBetLoading(true)

  setTimeout(() => {
    setWin(true)
    setWinCoeff(currentCoeff.value || 0)
    setBet(0)
    clearInterval(autoSelect.value)

    setIsBetLoading(false)
  })
}
function resetGame() {
  setLevel(0)
  setLost(false)
  setWin(false)
  setGameId(gameId.value + 1)
  opened.value = []
}
function onOpen(index: number) {
  opened.value.push(index)

  const isMine = map.value.at(index)?.mine

  if (isMine) {
    setBet(0)
    setLost(true)
    clearInterval(autoSelect.value)
  }
  else {
    setLevel(level.value + 1)
  }
}
onMounted(() => {
  layoutStore.setGameOneSidebarMax(1600)
})
onBeforeUnmount(() => {
  layoutStore.setGameOneSidebarMax(-1)
})

function randomSelect(instantly?: boolean) {
  const freeForPick = Array.from({ length: 25 }, (_, index) => index).filter(index => !opened.value.includes(index))
  const shuffled = freeForPick.sort(() => Math.random() - 0.5)
  const newPickForOpen = shuffled.at(0) || 0

  if (instantly) {
    gameBus.emit('select', { index: newPickForOpen })
  }
  else {
    // const time = 150

    // const hoverItem = (index: number) => {
    //   gameBus.emit('hover', { index })
    //   setTimeout(() => gameBus.emit('unHover', { index }), time)
    // }

    // hoverItem(shuffled.pop() || 0)
    //
    // const interval = setInterval(() => {
    //   hoverItem(shuffled.pop() || 0)
    //   gameBus.emit('hover', { index: shuffled.pop() || 0 })
    // }, time)

    // setTimeout(() => {
    // clearInterval(interval)
    gameBus.emit('select', { index: newPickForOpen })
    // }, time * Math.min(shuffled.length, 5))
  }
}
function onTurnOnAutoSelect() {
  randomSelect(true)

  setAutoSelect(setInterval(randomSelect, 1500))
}
</script>

<template>
  <div class="container" :class="$style.root">
    <HistorySection
      :fullscreen="fullscreen.isFullscreen.value"
      :sound="volume.sound.value"
      @update:fullscreen="fullscreen.toggle"
      @update:sound="volume.setMute"
    />

    <div :class="$style.layout">
      <BetSection :win-amount="potentialWinAmount" :auto-select="!!autoSelect" :gameplay="!!bet" :loading="isBetLoading" :amount="amount" :mines="minesCount" @update:auto-select="onTurnOnAutoSelect" @cashout="onCashout" @update:amount="setAmount" @update:mines="setMinesCount" @bet="onBet" />

      <div :class="$style.layoutGame">
        <GameSection :win-amount="finalWinAmount" :win-coeff="winCoeff" :lost="lost" :gameplay="!!bet" :game-id="gameId" :diamonds="SHAPES_COUNT - minesCount" :shapes="SHAPES_COUNT" :level="level" :map="map" :diamonds-left="diamondsLeft" :mines-left="minesLeft" :mines="minesCount" @open="onOpen" />

        <LevelSection :game-id="gameId" :coeffs="coeffs" :level="level" :step-count="SHAPES_COUNT - minesCount" />
      </div>
    </div>

    <TableSection />
  </div>
</template>

<style module lang="scss">
.root {
  display: flex;
  flex-direction: column;
  gap: 16px;

  & * {
    font-family: Roboto, 'PT Sans', sans-serif;
  }
}

.layout {
  display: grid;
  grid-template-columns: 336px 1fr;
  gap: 20px;

  height: calc(100vh - 180px);
  min-height: 708px;
  max-height: 708px;

  @media screen and (max-width: 1919px) {
    min-height: 601px;
    max-height: 601px;
  }

  @include _1440 {
    grid-template-columns: 296px 1fr;
  }

  @include _767 {
    grid-template-columns: 1fr;

    & > div:last-child {
      order: -1;
    }
  }

  &Game {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
}
</style>
