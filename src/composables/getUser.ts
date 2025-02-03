import { ref, type Ref } from 'vue'
import axios from '@/services/ApiService'
import { useToast } from '@/components/ui/toast'
import { catchErr } from './catchError'

interface User {
  firstName: string
  middleName: string | null
  lastName: string
  userName: string
  phoneNumber: {
    normalizedNumber: string
  }
  dob: string
  gender: string
  email: string
  address: string | null
  verificationBadge: string
  emailVerified: boolean
  isDisabled: boolean
  images: [
    {
      resource: {
        asset_id: string
        secure_url: string
      }
    }
  ]
  settings: {
    isProfilePublic: boolean
    allowBiometricAccess: boolean
  }
  statusBadge: {
    featured: boolean
    influencer: boolean
    public_figure: boolean
    verified: boolean
  }
}

interface Log {
  id: string
  timestamp: string
  user: {
    type: string
    extras: {
      email: string
      userName: string
    }
  }
  action: string
  status: string
  description: string
}

export interface Weeshes {
  _id: string
  name: string
  wishYear: string
  isLocked: boolean
  isPriority: boolean
  status: string
  images: [
    {
      _id: string
      url: string
    }
  ]
  category: {
    name: string
  }
  price: {
    price: number
    genieGratuity: number
    total: number
  }
  currency: {
    code: string
  }
  contributions: [
    {
      _id: string
      isContributorAnonymous: boolean
      amount: number
      contributor: {
        avatar: string
        firstName: string
        lastName: string
      }
    }
  ]
  donationProgress: number
}

interface Wallet {
  id: string
  account_number: string
  account_name: string
  balance: number
  ledger_balance: number
  currency: string
  total_inflow: number
  total_outflow: number
}

interface WalletList {
  id: string
  currency: string
  type: string
  amount: string
  time: string
  status: string
}

interface Pagination {
  from: number
  per_page: number
  to?: number
  next_from?: number
  valid_next_page?: boolean
  prev_from?: number
  valid_prev_page?: boolean
}

export type Filter = {
  page_item_from: number
  per_page: number
  log_action?: string
  log_status?: string
  sort_direction: 'asc' | 'desc'
}

const { toast } = useToast()

export const getUser = () => {
  const appUser = ref<User | null>(null)
  const error: Ref<string> = ref('')

  const load = async (_id: string | string[]) => {
    try {
      toast({
        description: 'Loading....',
        variant: 'loading'
      })
      const response = await axios.get('/api/v1/admin/accounts/users/' + _id)

      if (response.data.code === 200) {
        appUser.value = response.data.data
        // console.log(response.data.data)
        toast({
          description: response.data.message,
          variant: 'success'
        })
      }
    } catch (err: any) {
      error.value = `${err.response.data.message}, ${err.response.data.error}.`
      toast({
        description: err.response.data.message,
        variant: 'destructive'
      })
    }
  }
  const toggleUserStatus = async (val: string, _id: string | string[]) => {
    let data = {}
    if (val === 'featured') {
      data = {
        featured: !appUser.value?.statusBadge.featured
      }
    } else if (val === 'influencer') {
      data = {
        influencer: !appUser.value?.statusBadge.influencer
      }
    } else if (val === 'public_figure') {
      data = {
        public_figure: !appUser.value?.statusBadge.public_figure
      }
    } else if (val === 'verified') {
      data = {
        verified: !appUser.value?.statusBadge.verified
      }
    } else {
      toast({
        description: 'Status badge does not exist',
        variant: 'destructive'
      })
    }
    try {
      const response = await axios.patch(`/api/v1/admin/accounts/users/${_id}/status-badge`, data)
      if (response.data.code === 200) {
        toast({
          description: response.data.message,
          variant: 'success',
          duration: 3000
        })
        load(_id)
      }
    } catch (error) {
      catchErr(error)
    }
  }
  return { appUser, error, load, toggleUserStatus }
}

export const getUserLog = () => {
  const userLog = ref<Log[]>([])
  const logPagination = ref<Pagination | null>(null)
  const logError: Ref<string> = ref('')
  const count = ref<number>(0)
  const logActions: Ref<string[]> = ref([])
  const logStatus: Ref<string[]> = ref([])

  const getFilter = async () => {
    const response = await axios.get('/api/v1/admin/accounts/user/logs/filters-and-meta')

    if (response.data.code === 200) {
      logActions.value = response.data.data.filters.log_action
      logStatus.value = response.data.data.filters.log_status
    }
  }

  const log = async (_id: string | string[], filter?: Filter) => {
    const base = `/api/v1/admin/accounts/user/${_id}/logs?`

    let queryString = ''

    for (const key in filter) {
      if (Object.prototype.hasOwnProperty.call(filter, key)) {
        const value = filter[key as keyof Filter]
        if (value !== undefined && value !== '') {
          if (key === 'sort_direction') {
            if (queryString !== '') {
              queryString += '&'
            }
            queryString += `sort_column=timestamp&${key}=${value}`
          } else {
            if (queryString !== '') {
              queryString += '&'
            }
            queryString += `${key}=${value}`
          }
        }
      }
    }

    const url = base + queryString

    try {
      toast({
        description: 'Loading....',
        variant: 'loading'
      })
      const response = await axios.get(url)

      if (response.data.code === 200) {
        userLog.value = response.data.data.data
        count.value = response.data.data.count
        logPagination.value = response.data.data.pagination

        toast({
          description: response.data.message,
          variant: 'success'
        })
      }
    } catch (err: any) {
      logError.value = `${err.response.data.message}, ${err.response.data.error}.`
      toast({
        description: err.response.data.message,
        variant: 'destructive'
      })
    }
  }

  return { userLog, logPagination, count, logError, log, logActions, logStatus, getFilter }
}

export const getUserWeeshes = () => {
  const userWeeshesList: Ref<Weeshes[]> = ref([])
  const weeshesError: Ref<string> = ref('')
  const totalPages = ref(0)
  const currentPage = ref(0)

  const userWeeshes = async (_id: string | string[], options?: string | number) => {
    const base = `api/v1/admin/accounts/users/${_id}/weeshes?`

    const url = () => {
      if (typeof options === 'string') {
        if (options === 'asc' || options === 'desc') {
          return base + `sort_by_price=${options}`
        } else if (options !== 'asc' && options !== 'desc') {
          return base + `search=${options}`
        }
      } else if (typeof options === 'number') {
        return base + `page=${options}`
      }
      return base
    }

    try {
      toast({
        description: 'Loading....',
        variant: 'loading'
      })
      const response = await axios.get(url())

      if (response.data.code === 200) {
        userWeeshesList.value = response.data.data.data
        totalPages.value = response.data.data.totalPages
        currentPage.value = response.data.data.currentPage

        toast({
          description: response.data.message,
          variant: 'success'
        })
      }
    } catch (err: any) {
      weeshesError.value = `${err.response.data.message}, ${err.response.data.error}.`
      toast({
        description: err.response.data.message,
        variant: 'destructive'
      })
    }
  }

  return { userWeeshesList, weeshesError, totalPages, currentPage, userWeeshes }
}

export const getUserWallet = () => {
  const userWallet = ref<Wallet | null>(null)

  const getWallet = async (_id: string | string[]) => {
    try {
      toast({
        description: 'Loading....',
        variant: 'loading'
      })
      const response = await axios.get(`api/v1/admin/user/${_id}/wallet`)
      if (response.data.code === 200) {
        userWallet.value = response.data.data
        toast({
          description: response.data.message,
          variant: 'success'
        })
      }
    } catch (err: any) {
      toast({
        description: err.response.data.message,
        variant: 'destructive'
      })
    }
  }
  return { userWallet, getWallet }
}

export const getUserWalletList = () => {
  const userWalletList = ref<WalletList[]>([])
  const walletError: Ref<string> = ref('')
  const walletCount = ref(0)
  const pagination = ref<Pagination | null>(null)

  const getWalletList = async (
    _id: string | string[],
    walletPage?: {
      page_item_from: number
      per_page: number
    },
    sortType?: string
  ) => {
    const base = `api/v1/admin/user/${_id}/wallet/transactions?`

    const url = () => {
      if (walletPage) {
        return base + `per_page=${walletPage.per_page}&page_item_from=${walletPage.page_item_from}`
      }
      if (sortType) {
        if (sortType === 'INFLOW' || sortType === 'OUTFLOW') {
          return base + `type=${sortType}`
        }
      }
      return base
    }

    try {
      toast({
        description: 'Loading....',
        variant: 'loading'
      })
      const response = await axios.get(url())

      if (response.data.code === 200) {
        userWalletList.value = response.data.data.data
        pagination.value = response.data.data.pagination
        walletCount.value = response.data.data.count
        toast({
          description: response.data.message,
          variant: 'success'
        })
      }
    } catch (err: any) {
      walletError.value = `${err.response.data.message}, ${err.response.data.error}.`
      toast({
        description: err.response.data.message,
        variant: 'destructive'
      })
    }
  }

  return {
    walletError,
    userWalletList,
    pagination,
    walletCount,
    getWalletList
  }
}

export const getUserPayout = () => {
  const userPayout = ref<WalletList[]>([])
  const payoutError: Ref<string> = ref('')

  const getPayout = async (_id: string | string[]) => {
    const base = `api/v1/admin/user/${_id}/wallet/payouts`

    // const url = () => {
    //   if (walletPage) {
    //     return base + `per_page=${walletPage.per_page}&page_item_from=${walletPage.page_item_from}`
    //   }
    //   if (sortType) {
    //     if (sortType === 'INFLOW' || sortType === 'OUTFLOW') {
    //       return base + `type=${sortType}`
    //     }
    //   }
    //   return base
    // }
    // https://api.staging.weeshr.com/api/v1/admin/user/665dbf437738398059648b66/wallet/payouts

    try {
      toast({
        description: 'Loading....',
        variant: 'loading'
      })
      const response = await axios.get(base)

      if (response.data.code === 200) {
        // userWalletList.value = response.data.data.data
        toast({
          description: response.data.message,
          variant: 'success'
        })
      }
    } catch (err: any) {
      payoutError.value = `${err.response.data.message}, ${err.response.data.error}.`
      toast({
        description: err.response.data.message,
        variant: 'destructive',
        duration: 1000
      })
    }
  }

  return {
    payoutError,
    userPayout,
    getPayout
  }
}

export default {
  getUser,
  getUserLog,
  getUserWeeshes,
  getUserWallet,
  getUserWalletList,
  getUserPayout
}
