import { defineStore } from 'pinia'

export const useUserTablePageStore = defineStore('userTablePageStore', {
  state: () => ({
    currentPage: 1
  }),
  actions: {
    setCurrentPage(page: number) {
      this.currentPage = page
    }
  }
})
