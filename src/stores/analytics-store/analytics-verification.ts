import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

interface VerificationData {
  verified: number
  unverified: number
  total: number
}

export const useAnalyticsVerification = defineStore('analytics-verification', () => {
  const verificationData = ref<VerificationData>({
    verified: 0,
    unverified: 0,
    total: 0
  })

  const dateFilter = ref<{ dateFrom?: string; dateTo?: string }>({})

  async function fetchVerificationAnalytics() {
    try {
      const params = new URLSearchParams()
      
      if (dateFilter.value.dateFrom && dateFilter.value.dateTo) {
        params.append('date_from', dateFilter.value.dateFrom)
        params.append('date_to', dateFilter.value.dateTo)
      }

      const response = await axios.get('/api/v1/admin/analytics/users/verification-status', { params })

      if (response.data.code === 200) {
        // Access the count object from the response
        verificationData.value = response.data.data.count
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        console.error('Validation error:', error.response.data.errors)
        dateFilter.value = {}
      } else {
        console.error('API error:', error)
      }
    }
  }

  return { verificationData, dateFilter, fetchVerificationAnalytics }
})