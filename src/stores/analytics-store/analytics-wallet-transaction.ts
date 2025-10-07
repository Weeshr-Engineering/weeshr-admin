import { defineStore } from 'pinia'
import axios from 'axios'

export interface WalletTransactionMetric {
  total_inflow: number
  total_outflow: number
  net_flow: number
  transaction_count: number
  currency: string
}

export interface WalletTransactionPeriod {
  period: string
  metrics: WalletTransactionMetric[]
  summary: {
    total_inflow: number
    total_outflow: number
    net_flow: number
    total_transactions: number
  }
}

export interface WalletTransactionData {
  daily: WalletTransactionPeriod[]
  weekly: WalletTransactionPeriod[]
  monthly: WalletTransactionPeriod[]
  yearly: WalletTransactionPeriod[]
}

export interface DateRange {
  start: string
  end: string
}

// Helper function outside the store
const formatPeriodLabel = (period: string, type: string): string => {
  switch (type) {
    case 'daily':
      return new Date(period).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    case 'weekly':
      return `Week of ${new Date(period).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    case 'monthly':
      return new Date(period + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    case 'yearly':
      return period
    default:
      return period
  }
}

export const useWalletTransactionStore = defineStore('walletTransaction', {
  state: () => ({
    data: null as WalletTransactionData | null,
    loading: false,
    error: null as string | null,
    currentPeriod: 'monthly' as 'daily' | 'weekly' | 'monthly' | 'yearly'
  }),

  getters: {
    chartData: (state) => {
      if (!state.data || !state.data[state.currentPeriod]) return []
      
      const periodData = state.data[state.currentPeriod]
      
      return periodData.map(item => ({
        period: formatPeriodLabel(item.period, state.currentPeriod),
        inflow: item.summary.total_inflow / 100, // Convert from kobo to naira
        outflow: item.summary.total_outflow / 100,
        netFlow: item.summary.net_flow / 100,
        transactions: item.summary.total_transactions
      }))
    },

    totalInflow: (state) => {
      if (!state.data || !state.data[state.currentPeriod]) return 0
      return state.data[state.currentPeriod].reduce((sum, item) => sum + item.summary.total_inflow, 0) / 100
    },

    totalOutflow: (state) => {
      if (!state.data || !state.data[state.currentPeriod]) return 0
      return state.data[state.currentPeriod].reduce((sum, item) => sum + item.summary.total_outflow, 0) / 100
    },

    totalNetFlow: (state) => {
      if (!state.data || !state.data[state.currentPeriod]) return 0
      return state.data[state.currentPeriod].reduce((sum, item) => sum + item.summary.net_flow, 0) / 100
    },

    totalTransactions: (state) => {
      if (!state.data || !state.data[state.currentPeriod]) return 0
      return state.data[state.currentPeriod].reduce((sum, item) => sum + item.summary.total_transactions, 0)
    }
  },

  actions: {
    async fetchWalletTransactionMetrics(dateRange?: DateRange) {
      this.loading = true
      this.error = null
      
      try {
        const params: any = {}
        if (dateRange) {
          params.start_date = dateRange.start
          params.end_date = dateRange.end
        }

        const response = await axios.get('/api/v1/admin/analytics/users/wallet-transaction-metric', { params })
        
        // Validate response structure
        if (response.data?.data) {
          this.data = response.data.data
        } else {
          throw new Error('Invalid response structure')
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || error.message || 'Failed to fetch wallet transaction metrics'
        console.error('Error fetching wallet transaction metrics:', error)
        throw error // Re-throw to be caught by the component
      } finally {
        this.loading = false
      }
    },

    setPeriod(period: 'daily' | 'weekly' | 'monthly' | 'yearly') {
      this.currentPeriod = period
    },

    formatCurrency(amount: number): string {
      return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount)
    }
  }
})