import { defineStore } from 'pinia'

interface GeneralUseState {
  loading: boolean
}

export const useGeneralStore = defineStore({
  id: 'general-use',
  state: (): GeneralUseState => ({
    loading: false
  }),
  actions: {
    setLoading(loading: boolean) {
      this.loading = loading
    }
  }
})
