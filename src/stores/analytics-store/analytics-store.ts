import { defineStore } from 'pinia';
import axios from 'axios';

export interface UserAnalytics {
  date: string;
  value: number;
}

export const useAnalytics = defineStore('analytics', {
  state: () => ({
    data: [] as UserAnalytics[],
  }),
  actions: {
    async fetchUserAnalytics(
      interval: 'daily' | 'monthly' | 'yearly' = 'daily',
      dateFrom: string = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dateTo: string = new Date().toISOString().split('T')[0]
    ) {
      try {
        const url = `/api/v1/admin/analytics/users/growth-over-time?date_from=2023-05-01&date_to=2024-10-04&interval=${interval}`;
        const response = await axios.get(url);
        const apiData = response.data.data.data; 

        this.data = apiData.map((item: { _id: string; count: number }) => {
          let formattedDate = item._id;

          if (interval === 'monthly') {
            const [year, month] = item._id.split('-');
            const monthNames = [
              "January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December"
            ];
            formattedDate = `${monthNames[parseInt(month, 10) - 1]} ${year}`;
          }

          return { date: formattedDate, value: item.count };
        });
      } catch (error) {
        console.error('Error fetching user analytics:', error);
      }
    },
  },
});