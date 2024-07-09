import { defineStore } from 'pinia';
import axios from 'axios';

export const useDashboardAnalyticsStore = defineStore('dashboardAnalytics', {
  state: () => ({
    weeshes: {
      all: 0,
      fulfilled: 0
    },
    wallet: {
      total_current_balance: {
        balance: 0,
        currency: ''
      },
      invested: {
        balance: 0,
        currency: ''
      },
      total_transactions: {
        total_transactions: 0,
        total_volume: 0,
        total_volume_by_currency: [],
        pending_transfers: 0,
        pending_transfers_by_currency: []
      }
    },
    users: {
      all: 0,
      active: 0
    },
    tickets: {
      all: 0,
      pending: 0
    },
    error: null,
  }),
  actions: {
    async fetchDashboardAnalytics() {
      try {
        const response = await axios.get('/api/v1/admin/dashboard/analytics');
        this.$patch({
          weeshes: response.data.data.weeshes,
          wallet: response.data.data.wallet,
          users: response.data.data.users,
          tickets: response.data.data.tickets,
          error: response.data.error,
        });
      } catch (error) {
        this.error = error;
      }
    }
  }
});
