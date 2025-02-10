import { defineStore } from 'pinia'
import axios from 'axios'

const MONTHS = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
] as const;

export interface BirthdayMetric {
  month: string;
  count: number;
}

export const useBirthdayStore = defineStore('birthday', {
  state: () => ({
    data: [] as BirthdayMetric[],
  }),
  actions: {
    async fetchBirthdayMetrics() {
      try {
        const response = await axios.get('/api/v1/admin/analytics/users/birthday-metric');
        const apiData = response.data.data.data;

        // Create a map for efficient lookup
        const apiDataMap = new Map(Object.entries(apiData));
        
        // Generate ordered data with all months
        this.data = MONTHS.map(month => ({
          month,
          count: apiDataMap.has(month) ? Number(apiDataMap.get(month)) : 0
        }));

      } catch (error) {
        console.error('Error fetching birthday metrics:', error);
      }
    },
  },
});