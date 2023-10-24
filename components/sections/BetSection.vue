<script setup lang="ts">
import { Icon } from '@components/Icon'
import { vMaska } from 'maska'
import { useState } from '@composable/useState'
import { useError } from '@composable/useToast'
import AnimatedNumber from '@components/Interface/AnimatedNumber.vue'

interface Props {
  mines: number
  amount: string
  loading: boolean
  gameplay: boolean
  autoSelect: boolean
  winAmount?: number
}

const props = defineProps<Props>()
const emit = defineEmits(['update:mines', 'update:autoSelect', 'update:amount', 'bet', 'cashout'])
const MIN_BET = 0.01
const MAX_BET = 20000
const MIN_MINES = 2
const MAX_MINES = 24
const MINES_PRESET = [3, 5, 10, 24]

const [customFocus, setCustomFocus] = useState<boolean>(false)
const [isCustomMines, setIsCustomMines] = useState<boolean>(false)

const setAmount = (value: string) => emit('update:amount', value)

const setMines = (value: number) => emit('update:mines', value)

function onSetMines(event: Event & { target: HTMLInputElement & any }) {
  const value = Number(event.target.value)

  if (value > MAX_MINES) {
    event.stopPropagation()
    event.preventDefault()
    event.target.value = String(MAX_MINES)
  }

  const withMax = Math.min(value, MAX_MINES)
  const withBoth = Math.max(withMax, MIN_MINES)

  setMines(withBoth)
}

function onChangeMines(count: number) {
  if (isCustomMines.value)
    setIsCustomMines(false)

  setMines(count)
}
function onHalfAmount() {
  setAmount(String(Math.max(Number(props.amount) / 2, MIN_BET)))
}
function onDoubleAmount() {
  setAmount(String(Math.min(Number(props.amount) * 2, MAX_BET)))
}
function onMinAmount() {
  setAmount(String(MIN_BET))
}
function onMaxAmount() {
  setAmount(String(MAX_BET))
}
function onInput(event: Event & { target: HTMLInputElement & any }) {
  const value = event.target?.value

  if (Number(value) >= MAX_BET) {
    event.stopPropagation()
    event.preventDefault()
    event.target.value = String(MAX_BET)
  }

  const max = String(Math.min(Number(value), MAX_BET))

  setAmount(max)
}

function onBet() {
  // validation
  if (!props.amount) {
    useError('Make bet')
    return
  }

  const numberAmount = Number(props.amount)

  if (numberAmount > MAX_BET) {
    useError('to big bet')
    return
  }

  if (numberAmount < MIN_BET) {
    useError('to small bet')
    return
  }

  emit('bet')
}

function onCashout() {
  emit('cashout')
}

function onAutoSelect() {
  emit('update:autoSelect')
}
</script>

<template>
  <div :class="$style.root">
    <div :class="$style.amountSection">
      <label for="mines-amount-input" :class="$style.amount">
        <div class="flex gap-1 flex-wrap">
          <span class="w-full">
            {{ 'Сумма ставки:' }}
          </span>

          <div class="flex gap-1 items-center">
            <Icon name="logo-bnb-sm" :class="$style.amountIcon" />

            <input
              id="mines-amount-input"
              v-maska
              :disabled="gameplay"
              :value="amount"
              placeholder="100₽"
              :class="$style.amountInput"
              type="text"
              data-maska="#0000000000.##"
              data-maska-tokens="0:[0-9]:optional"
              @input="onInput"
            >
          </div>

        </div>
      </label>

      <div :class="$style.amountButtons">
        <button :disabled="Number(amount) === MIN_BET || gameplay || loading" :class="$style.amountButton" @click="onMinAmount">
          {{ 'Min' }}
        </button>

        <button :disabled="Number(amount) === MIN_BET || gameplay || loading" :class="$style.amountButton" @click="onHalfAmount">
          {{ '/2' }}
        </button>

        <button :disabled="Number(amount) === MAX_BET || gameplay || loading" :class="$style.amountButton" @click="onDoubleAmount">
          {{ 'X2' }}
        </button>

        <button :disabled="Number(amount) === MAX_BET || gameplay || loading" :class="$style.amountButton" @click="onMaxAmount">
          {{ 'Max' }}
        </button>
      </div>
    </div>

    <div :class="$style.mines">
      <div :class="$style.minesRow">
        <span>
          {{ 'Количество мин:' }}
        </span>

        <span>
          {{ 'От 2 до 24 мин' }}
        </span>
      </div>

      <div :class="$style.minesButtons">
        <button
          v-for="preset in MINES_PRESET"
          :key="`mines-bet-preset-${preset}`"
          :disabled="gameplay || loading"
          :class="[$style.minesButton, mines === preset && !isCustomMines && $style.minesButtonActive]"
          @click="() => onChangeMines(preset)"
        >
          {{ preset }}
        </button>

        <label
          for="mines-bet-mines-count"
          :class="[$style.minesButton, (gameplay || loading) && $style.minesButtonDisabled, !customFocus && isCustomMines && $style.minesButtonActive]"
          @click="() => setIsCustomMines(true)"
        >
          <Icon v-if="!isCustomMines" name="edit" />

          <input
            v-else
            id="mines-bet-mines-count"
            v-maska
            :disabled="gameplay || loading"
            :value="mines"
            autofocus
            :class="$style.minesInput"
            type="text"
            data-maska="##"
            data-maska-tokens="0:[0-9]:optional"
            @input="onSetMines"
            @focus="() => setCustomFocus(true)"
            @blur="() => setCustomFocus(false)"
          >
        </label>
      </div>
    </div>

    <div :class="$style.buttons">
      <button v-if="!gameplay" class="btn btn-primary btn-size-biggest" :disabled="loading" @click="onBet">
        <span class="uppercase">
          {{ 'Играть' }}
        </span>
      </button>

      <template v-else>
        <button class="btn btn-primary btn-size-biggest" :disabled="loading" @click="onAutoSelect">
          <span class="text-14 font-600 text-[#141B19] uppercase">
            {{ 'Автовыбор' }}
          </span>

          <Icon name="play-2" class="ml-1" />
        </button>

        <button v-if="winAmount" :class="$style.buttonGreen" class="btn btn-green btn-size-biggest btn-pre-line flex flex-wrap" @click="onCashout">
          <p class="w-full">
            <span class="uppercase">
              <AnimatedNumber :to="winAmount || 0" />

              {{ `BNА` }}
            </span>
          </p>

          <span>
            {{ ' Забрать' }}
          </span>
        </button>
      </template>
    </div>
  </div>
</template>

<style module lang="scss">
.root {
  background: var(--dark);
  border-radius: $radius;

  display: flex;
  flex-direction: column;
  gap: 20px;

  padding: 20px;

  @include _767 {
    height: auto;
  }
}

.buttonGreen {
  font-size: 16px;
  font-weight: 600;
  line-height: 120%;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;

  @include _767 {
    flex-direction: row;
    order: 1;

    & > button {
      &:first-child {
        flex-grow: 2;
      }

      &:last-child {
        flex-grow: 6;
      }
    }
  }
}

.mines {
  border-radius: $radius;
  background: var(--black);
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  @include _767 {
    order: 3;
  }

  &Input {
    text-align: center !important;
    background: transparent !important;
    height: auto !important;
    padding: 0 !important;
    border: none !important;
    border-radius: 0 !important;
    font-size: 14px !important;
    font-weight: 400 !important;
    line-height: 14px !important;
  }

  &Button {
    border-radius: $radius;
    background: var(--gray-5);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    height: 40px;
    width: 100%;
    cursor: pointer;

    &:hover:not(:disabled):not(&Disabled) {
      color: var(--white);
      background: var(--gray-3);
    }

    &Disabled {
      cursor: default;
      opacity: 0.4;
    }

    &Active {
      background: var(--yellow-gradient) !important;
      color: var(--black-3) !important;

      & .minesInput {
        color: var(--black-3) !important;
      }
    }
  }

  &Buttons {
    display: flex;
    gap: 4px;
  }

  &Row {
    display: flex;
    justify-content: space-between;
    gap: 12px;

    color: var(--gray-2);
    font-size: 14px;
    font-weight: 500;
  }
}

.amount {
  display: flex;
  align-items: center;
  padding: 12px;
  gap: 12px;
  background: var(--black);
  border-radius: $radius;

  &Buttons {
    display: flex;
    gap: 4px;
  }

  &Button {
    width: 100%;
    padding: 8px;
    border-radius: $radius;
    background: var(--gray-5);
    height: 36px;

    color: var(--gray-2);
    font-size: 14px;
    font-weight: 500;
    line-height: 120%;

    &:hover:not(:disabled) {
      color: var(--white);
      background: var(--gray-3);
    }
  }

  &Section {
    display: flex;
    flex-direction: column;
    gap: 8px;

    @include _767 {
      order: 2;
    }
  }

  &Input {
    height: 20px !important;
    padding: 0 !important;
    border: none !important;
    border-radius: 0 !important;
    font-size: 16px !important;
    font-weight: 500 !important;
    line-height: 120% !important;
  }

  &Row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: center;

    width: 100%;

    color: var(--gray-2);
    font-size: 14px;
    font-weight: 500;
    line-height: 120%;
  }

  &Icon {
    width: 24px;
    height: 24px;
    min-width: 24px;
  }
}
</style>
