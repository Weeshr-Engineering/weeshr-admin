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

  async function fetchVerificationAnalytics(dateFrom?: string, dateTo?: string) {
    try {
      const params = new URLSearchParams()
      
      if (dateFrom && dateTo) {
        params.append('date_from', dateFrom)
        params.append('date_to', dateTo)
      }

      const response = await axios.get('/api/v1/admin/analytics/users/verification-status', { params })

      if (response.data.code === 200) {
        // Access the count object from the response
        verificationData.value = response.data.data.count
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        console.error('Validation error:', error.response.data.errors)
      } else {
        console.error('API error:', error)
      }
    }
  }

  return { verificationData, fetchVerificationAnalytics }
})