/**
 * Returns a wheel event handler for number inputs.
 * Scroll up = increment, scroll down = decrement, clamped to [min, max].
 */
export function useNumberInputWheel(min: number, max: number) {
  return (
    e: WheelEvent,
    getValue: () => number,
    setValue: (v: number) => void
  ) => {
    e.preventDefault()
    const delta = e.deltaY < 0 ? 1 : -1
    const current = getValue()
    const next = Math.max(min, Math.min(max, (Number.isNaN(current) ? min : current) + delta))
    setValue(next)
  }
}
