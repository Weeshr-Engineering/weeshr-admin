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

  async function fetchWeeshData(dateFrom?: string, dateTo?: string) {
    try {
      const params = new URLSearchParams()
      
      // Add dates only when both are present
      if (dateFrom && dateTo) {
        params.append('date_from', dateFrom)
        params.append('date_to', dateTo)
      }

      const response = await axios.get('/api/v1/admin/analytics/users/weesh-by-status', { params })

      if (response.data.code === 200) {
        const data = response.data.data
        // Calculate percentage with two decimal places
        const percentage = data.created > 0 
          ? Number((data.fulfilled / data.created * 100).toFixed(2))
          : 0
        
        weeshStatusData.value = {
          created: data.created,
          fulfilled: data.fulfilled,
          percentageFulfilled: percentage
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 422) {
          console.error('Validation error:', error.response.data.errors)
          // Reset to default data on validation error
          weeshStatusData.value = {
            created: 0,
            fulfilled: 0,
            percentageFulfilled: 0
          }
        } else {
          console.error('API error:', error)
        }
      }
    }
  }

  return { 
    weeshStatusData, 
    fetchWeeshData
  }
})