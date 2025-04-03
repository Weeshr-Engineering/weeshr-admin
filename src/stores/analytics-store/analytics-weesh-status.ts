import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

interface WeeshStatusData {
  created: number
  fulfilled: number
  percentageFulfilled: number
}

export const useAnalyticsWeeshStatus = defineStore('analytics-weesh-status', () => {
  const weeshStatusData = ref<WeeshStatusData>({
    created: 0,
    fulfilled: 0,
    percentageFulfilled: 0
  })

  const dateFilter = ref<{ dateFrom?: string; dateTo?: string }>({})

  async function fetchWeeshData() {
    try {
      const params = new URLSearchParams()
      
      // Add dates only when both are present
      if (dateFilter.value.dateFrom && dateFilter.value.dateTo) {
        params.append('date_from', dateFilter.value.dateFrom)
        params.append('date_to', dateFilter.value.dateTo)
      }

      const response = await axios.get('/api/v1/admin/analytics/users/weesh-by-status', { params })

      if (response.data.code === 200) {
        weeshStatusData.value = response.data.data
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 422) {
          console.error('Validation error:', error.response.data.errors)
          // Reset to default data on validation error
          await fetchWeeshData() // Refetch without dates
        } else {
          console.error('API error:', error)
        }
      }
    }
  }

  return { 
    weeshStatusData, 
    dateFilter, 
    fetchWeeshData
  }
})