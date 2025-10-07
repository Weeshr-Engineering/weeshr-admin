import { defineStore } from 'pinia'
import axios from '@/services/ApiService'
import router from '@/router'
import { toast } from '@/components/ui/toast'
import { useGeneralStore } from '@/stores/general-use'

interface VendorState {
  email: string
  password: string
  id: string
  token: string
}

export const useVendorStore = defineStore({
  id: 'vendor',
  state: (): VendorState => ({
    email: '',
    password: '',
    id: '',
    token: sessionStorage.getItem('vendorToken') || ''
  }),

  actions: {
    get loading() {
      return useGeneralStore().loading
    },
    setToken(token: string) {
      this.token = token
      sessionStorage.setItem('vendorToken', token)
    },
    setLocalStorage(firstname: string, lastname: string, email: string, id: string) {
      const vendor = { firstname, lastname, email, id }
      localStorage.setItem('vendor', JSON.stringify(vendor))
    },
    getLocalstorageData() {
      const data = localStorage.getItem('vendor')!
      return JSON.parse(data)
    },
    clearToken() {
      this.token = ''
      localStorage.removeItem('vendor')
      sessionStorage.removeItem('vendorToken')
    },
    setEmail(value: string) {
      this.email = value
    },
    setPassword(value: string) {
      this.password = value
    },
    async logout() {
      try {
        useGeneralStore().setLoading(true)
        await axios.get('/api/v1/vendor/logout') 
        this.clearToken()
        useGeneralStore().setLoading(false)
        router.push({ name: 'vendor-login' })
      } catch (error: any) {
        useGeneralStore().setLoading(false)
        this.clearToken()
        router.push({ name: 'vendor-login' })
        toast({
          title: error.response?.data?.message || 'An error occurred',
          variant: 'destructive'
        })
      }
    }
  }
})
