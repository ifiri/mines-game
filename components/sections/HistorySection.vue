<script setup lang="ts">
import { InGameHistorySection } from '@components/Games'
import { useState } from '@composable/useState'
import { getFormatBalance } from '@helpers/utils'
import { useModalLayer } from '@composable/useModal'
import { computed } from 'vue'

interface Props {
  sound: boolean
  fullscreen: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['update:sound', 'update:fullscreen'])

const buttons = computed(() => [
  { icon: 'history', id: 'history' },
  { icon: 'faq', id: 'faq', hideMobile: true },
  { icon: `sound-${props.sound ? 'on' : 'off'}`, id: 'sound', hideMobile: true },
  { icon: `fullscreen-${props.fullscreen ? 'off' : 'on'}`, id: 'fullscreen', hideMobile: true },
  { icon: 'gear', iconClass: 'w-[22px] h-[22px]', id: 'gear' },
])

const modalLayer = useModalLayer()
const [open, setOpen] = useState<boolean>(false)

function onButtonHandler(id: string) {
  if (id === 'history')
    setOpen(true)
  if (id === 'faq')
    modalLayer.show('crash_faq_fair')
  if (id === 'sound')
    emit('update:sound', !props.sound)
  if (id === 'fullscreen')
    emit('update:fullscreen')
}
</script>

<template>
  <InGameHistorySection :buttons="buttons" :open="open" @button="onButtonHandler" @update:open="setOpen">
    <div v-for="index in 42" :key="index">
      <span :class="[$style.shape, index % 2 && $style.yellow]" class="c-rub">
        {{ getFormatBalance(0) }}
      </span>
    </div>
  </InGameHistorySection>
</template>

<style module lang="scss">
.shape {
  border-radius: $radius;
  background: #15191C;

  min-width: 60px;
  width: 100%;
  height: 28px;

  padding: 4px 6px;
  display: flex;
  justify-content: center;
  align-items: center;

  color: #7F909D;
  font-size: 13px;
  font-weight: 600;
  line-height: 120%;
}

.yellow {
  color: var(--yellow);
}
</style>
