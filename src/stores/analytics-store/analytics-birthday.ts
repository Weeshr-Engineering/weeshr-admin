import { defineStore } from 'pinia'
import axios from 'axios'

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
] as const

export interface BirthdayMetric {
  month: string
  count: number
}

interface MonthlyTrend {
  month: string
  trend: number
}

export const useBirthdayStore = defineStore('birthday', {
  state: () => ({
    data: [] as BirthdayMetric[],
    monthlyTrends: [] as MonthlyTrend[]
  }),
  actions: {
    async fetchBirthdayMetrics() {
      try {
        const response = await axios.get('/api/v1/admin/analytics/users/birthday-metric')
        const apiData = response.data.data.data

        const apiDataMap = new Map(Object.entries(apiData))

        this.data = MONTHS.map((month) => ({
          month,
          count: apiDataMap.has(month) ? Number(apiDataMap.get(month)) : 0
        }))
        
       
        this.calculateMonthlyTrends()
      } catch (error) {
        console.error('Error fetching birthday metrics:', error)
      }
    },
    
    calculateMonthlyTrends() {
      this.monthlyTrends = this.data.map((current, index) => {
        if (index === 0) return { month: current.month, trend: 0 }
        
        const prev = this.data[index - 1].count
      
        if (prev === 0) return { month: current.month, trend: 0 }
        
       
        const trend = Math.round(((current.count - prev) / prev) * 100)
        return { month: current.month, trend }
      })
    }
  }
})