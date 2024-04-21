import { defineStore } from 'pinia'
import axios from 'axios'
import router from '@/router'
import { toast } from '@/components/ui/toast'
import { useGeneralStore } from '@/stores/general-use'

interface VendorUserState {
  userEmail: string
  password: string
  newUser: NewUser[]
  token: string
}

interface NewUser {
  username: string
  userEmail: string
  category: 'Cash' | 'Giftcard' | 'All'
}

export const useVendorUserStore = defineStore({
  id: 'create-vendor',
  state: (): VendorUserState => ({
    userEmail: '',
    password: '',
    newUser: [],
    token: sessionStorage.getItem('token') || ''
  }),

  actions: {
    get loading() {
      return useGeneralStore().loading
    },
    setToken(token: string) {
      this.token = token
      sessionStorage.setItem('token', token)
    },
    clearToken() {
      this.token = ''
      // Remove the token from sessionStorage
      sessionStorage.removeItem('token')
    },
    setuserEmail(value: string) {
      this.userEmail = value
    },
    setPassword(value: string) {
      this.password = value
    },
    addNewUser(newUser: NewUser) {
      this.newUser.push(newUser) // Add a new user to the newUser array
    },
    async logout() {
      try {
        useGeneralStore().setLoading(true) // Set loading to true
        // Make a request to the logout endpoint
        await axios.get('https://api.staging.weeshr.com/api/v1/admin/logout', {
          headers: {
            Authorization: `Bearer ${this.token}` // Include token in the Authorization header
          }
        })

        // Clear the token
        this.clearToken()
        useGeneralStore().setLoading(false)

        router.push({ name: 'super-admin-login' })
      } catch (error: any) {
        useGeneralStore().setLoading(false)

        this.clearToken()
        router.push({ name: 'super-admin-login' })
        toast({
          title: error.response.data.message || 'An error occurred',
          variant: 'destructive'
        })
      }
    }
  }
})
