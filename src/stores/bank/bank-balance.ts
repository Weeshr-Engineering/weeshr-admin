import { defineStore } from 'pinia'
import axios from '@/services/ApiService'
import { toast } from '@/components/ui/toast'
import router from '@/router'

interface Transaction {
  _id: string
  status: string
  gateway_response: string
  paid_at: string | null
  amount: number
  currency: string
  channel: string
  metadata: {
    weesh: string
    user: {
      _id: string
      email: string
    }
  }
  customer: {
    email: string | null
    isAnonymous: boolean
  }
}

interface BankBalanceStore {
  bank: Transaction[]
  loading: boolean
  perPage: number
  pageCount: number
  page: number
  balance: number
  currency: string
  totalTransactionsAmount: number
  totalTransactionCurrency: string
  totalTransfersAmount: number
  totalTransfersCurrency: string
}

export type FilterSort = {
  page: number
  perPage: number
  customer?: string
  status?: string
  from?: string
  to?: string
  amount?: number | null
}

export const useBankBalanceStore = defineStore('bank-balance', {
  state: (): BankBalanceStore => ({
    bank: [],
    balance: 0,
    currency: '',
    totalTransactionsAmount: 0,
    totalTransactionCurrency: '',
    totalTransfersAmount: 0,
    totalTransfersCurrency: '',
    loading: false,
    perPage: 0,
    pageCount: 0,
    page: 1
  }),

  actions: {
    async getBalance() {
      try {
        this.loading = true

        const response = await axios.get(`/api/v1/admin/weeshr/bank/balance`)

        if (response.status === 200 || response.status === 201) {
          this.balance = response.data.data[0].balance/100
          this.currency = response.data.data[0].currency
        }

        toast({
          description: response.data.message,
          variant: 'success'
        })
      } catch (error) {
        this.catchErr(error)
      } finally {
        this.loading = false
      }
    },

    async getWeshName(id: string) {
      try {
        const response = await axios.get(`/api/v1/admin/weesh/${id}`)
        return response.data.data.name
      } catch (error) {
        console.error(error)
        this.catchErr(error)
      }
    },

    async getTransactions(filter?: FilterSort) {
      try {
        this.loading = true

        const base = `api/v1/admin/weeshr/bank/transactions?`
        let queryString = ''

        for (const key in filter) {
          if (Object.prototype.hasOwnProperty.call(filter, key)) {
            const value = filter[key as keyof FilterSort]
            if (value !== undefined && value !== '' && value !== null) {
              if (queryString !== '') {
                queryString += '&'
              }
              queryString += `${key}=${value}`
            }
          }
        }

        const url = base + queryString

        const response = await axios.get(url)

        if (response.status === 200 || response.status === 201) {
          this.bank = response.data.data.data
          this.perPage = response.data.data.meta.perPage
          this.pageCount = response.data.data.meta.pageCount
          this.page = response.data.data.meta.page
        }
      } catch (error) {
        this.catchErr(error)
      } finally {
        this.loading = false
      }
    },

    async getTotals() {
      try {
        this.loading = true

        const response = await axios.get(`/api/v1/admin/weeshr/bank/transaction_totals`)

        if (response.status === 200 || response.status === 201) {
          this.totalTransactionsAmount = response.data.data.total_volume_by_currency[0].amount/100
          this.totalTransactionCurrency = response.data.data.total_volume_by_currency[0].currency

          this.totalTransfersAmount = response.data.data.pending_transfers_by_currency[0].amount/100
          this.totalTransfersCurrency = response.data.data.pending_transfers_by_currency[0].currency
        }

        toast({
          description: response.data.message,
          variant: 'success'
        })
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    catchErr(error: any) {
      if (error.response.status === 400) {
        toast({
          description: error.response.data.message || 'Bad Request',
          variant: 'destructive'
        })
      } else if (error.response.status === 401) {
        setTimeout(() => {
          router.push({ name: 'superAdmin-login' })
        }, 1000)
        toast({
          description: error.response.data.message || 'Unauthenticated',
          variant: 'destructive'
        })
        sessionStorage.removeItem('token')
      } else if (error.response.status === 403) {
        toast({
          description: error.response.data.message || 'Unauthorized',
          variant: 'destructive'
        })
        setTimeout(() => {
          router.push({ name: 'home' })
        }, 3000)
      } else if (error.response.status === 422) {
        toast({
          description: error.response.data.message || 'Validation Error',
          variant: 'destructive'
        })
      } else if (error.response.status === 500) {
        toast({
          description: error.response.data.message || 'Server Error',
          variant: 'destructive'
        })
      } else if (error.response.status === 404) {
        toast({
          description: error.response.data.message || 'Not found',
          variant: 'destructive'
        })
      }
    }
  }
})
