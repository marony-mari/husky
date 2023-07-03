import { create } from 'zustand'

// EditedTask 型の宣言
type EditedTask = { id: number; title: string }

// State 型の宣言
type State = {
  editedTask: EditedTask
  updateEditedTask: (payload: EditedTask) => void
  resetEditedTask: () => void
}

// store ・・・格納する場所という意味で使われる
export const useStore = create<State>((set) => ({
  editedTask: { id: 0, title: '' },
  updateEditedTask: (payload) =>
    set({
      editedTask: payload
    }),
  resetEditedTask: () => set({ editedTask: { id: 0, title: '' } })
}))

// 優先的に export される
export default useStore
