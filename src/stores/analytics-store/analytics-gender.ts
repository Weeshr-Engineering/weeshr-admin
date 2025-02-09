import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

interface GenderEntry {
  male?: number
  female?: number
  others?: number
  total: number
}

interface AgeDataEntry {
  age: number
  genders: GenderEntry
}

export const useAnalyticsGender = defineStore('analytics-gender', () => {
  const genderData = ref<{ male: number; female: number; other: number }>({
    male: 0,
    female: 0,
    other: 0
  })

  const ageData = ref<AgeDataEntry[]>([])

  async function fetchAnalytics() {
    try {
      const response = await axios.get('/api/v1/admin/analytics/users/age-and-gender')

      if (response.data.code === 200) {
        const apiData = response.data.data.data // Array of age entries
        const aggregatedGenderData = { male: 0, female: 0, other: 0 }

        // Aggregate gender data and store raw age entries
        apiData.forEach((entry: AgeDataEntry) => {
          aggregatedGenderData.male += entry.genders.male || 0
          aggregatedGenderData.female += entry.genders.female || 0
          aggregatedGenderData.other += entry.genders.others || 0 // Note 'others' key from API
        })

        genderData.value = aggregatedGenderData
        ageData.value = apiData // Store raw age data for chart
      }
    } catch (error) {
      console.error('API error:', error)
    }
  }

  return { genderData, ageData, fetchAnalytics }
})