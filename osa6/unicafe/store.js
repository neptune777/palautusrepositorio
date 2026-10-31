import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

const useStatistics = create(set => ({
    good: 0,
    neutral: 0,
    bad: 0,
    actions: {
        incrementForGood: () => set(state => ({
            good: state.good + 1
        })),
        incrementForNeutral: () => set(state => ({
            neutral: state.neutral + 1
        })),
        incrementForBad: () => set(state => ({
            bad: state.bad + 1
        }))
    }
}))

export const useStateControls = () => useStatistics(state => state.actions)
export const useValues = () =>
    useStatistics(
        useShallow(state => ({
            good: state.good,
            neutral: state.neutral,
            bad: state.bad
        }))
    )