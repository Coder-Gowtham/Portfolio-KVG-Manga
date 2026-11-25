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
  /** The drone follows the cursor (fine pointers only, never with reduced motion). */
  droneFollow: boolean
  /** Transient: the unlock banner is showing. Not persisted. */
  banner: boolean
}

const KEY = 'secret'
const DEFAULT: SecretState = { unlocked: false, offDuty: false, droneFollow: false, banner: false }

let state: SecretState = { ...DEFAULT, ...readJSON<Partial<SecretState>>(KEY, {}), banner: false }
const listeners = new Set<() => void>()

function set(next: Partial<SecretState>) {
  state = { ...state, ...next }
  const { banner: _banner, ...persisted } = state
  writeJSON(KEY, persisted)
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
