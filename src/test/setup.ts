import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => cleanup())

// jsdom does not implement <dialog> modality; emulate the bits we use.
if (typeof HTMLDialogElement !== 'undefined' && !HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.setAttribute('open', '')
  }
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    this.removeAttribute('open')
    this.dispatchEvent(new Event('close'))
  }
}

window.scrollTo = () => {}

/*
 * React Router builds `new Request(url, { signal })` for every navigation. Under jsdom the
 * signal is jsdom's AbortSignal, which Node's built-in Request rejects ("Expected signal to be
 * an instance of AbortSignal"), so no route ever renders. Tests never abort navigations, so
 * drop the foreign signal and let Node's Request create its own.
 */
const NativeRequest = globalThis.Request
class TestRequest extends NativeRequest {
  constructor(input: RequestInfo | URL, init?: RequestInit) {
    if (init?.signal) {
      const rest: RequestInit = { ...init }
      delete rest.signal
      super(input, rest)
    } else {
      super(input, init)
    }
  }
}
globalThis.Request = TestRequest as typeof Request
