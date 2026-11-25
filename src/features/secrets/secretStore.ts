import { useSyncExternalStore } from 'react'
import { readJSON, writeJSON } from '../../utils/storage'

/**
 * Hidden-chapter state. A tiny external store (not context) so any component,
 * including the mascot, can read it without a provider.
 */
export interface SecretState {
  unlocked: boolean
  /** "Off-duty skin": the mascot wears his mask down everywhere. */
  offDuty: boolean
  /** The drone follows the cursor: on by default for everyone (fine pointers only, never with reduced motion). */
  droneFollow: boolean
  /** Transient: the unlock banner is showing. Not persisted. */
  banner: boolean
}

const KEY = 'secret'
const DEFAULT: SecretState = { unlocked: false, offDuty: false, droneFollow: true, banner: false }

/* Stored as `droneOff` so the old opt-in setting (droneFollow: false) from earlier visits is ignored. */
interface Saved {
  unlocked?: boolean
  offDuty?: boolean
  droneOff?: boolean
}
const saved = readJSON<Saved>(KEY, {})
let state: SecretState = {
  ...DEFAULT,
  unlocked: saved.unlocked ?? false,
  offDuty: saved.offDuty ?? false,
  droneFollow: !(saved.droneOff ?? false),
}
const listeners = new Set<() => void>()

function set(next: Partial<SecretState>) {
  state = { ...state, ...next }
  writeJSON(KEY, { unlocked: state.unlocked, offDuty: state.offDuty, droneOff: !state.droneFollow } satisfies Saved)
  listeners.forEach((l) => l())
}

export const secretStore = {
  get: () => state,
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  unlock: () => set({ unlocked: true, banner: true }),
  dismissBanner: () => set({ banner: false }),
  setOffDuty: (offDuty: boolean) => set({ offDuty }),
  setDroneFollow: (droneFollow: boolean) => set({ droneFollow }),
  /** Re-lock and clear the perks (also used by tests). */
  lock: () => set({ ...DEFAULT }),
}

export function useSecret(): SecretState {
  return useSyncExternalStore(secretStore.subscribe, secretStore.get, () => DEFAULT)
}
