import mitt from 'mitt'
import type { Emitter, EventType } from 'mitt'

interface Events extends Record<EventType, unknown> {
  'select': { index: number }
  'hover': { index: number }
  'unHover': { index: number }

}

const bus2: Emitter<Events> = mitt()

export function useGameBus() {
  return bus2
}
