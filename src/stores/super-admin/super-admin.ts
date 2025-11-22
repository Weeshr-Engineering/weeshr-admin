import { defineStore } from 'pinia'
import axios from '@/services/ApiService'
import router from '@/router'
import { toast } from '@/components/ui/toast'
import { useGeneralStore } from '@/stores/general-use'

interface SuperAdminState {
  userEmail: string
  password: string
  id: string
  newUser: NewUser[]
  token: string,
  isVendor: boolean,
  isProxy: boolean,
  vendorId: string,
  companyName: string,
}

interface NewUser {
  username: string
  userEmail: string
  category: 'Vendor' | 'Admin'
}

export const useSuperAdminStore = defineStore({
  id: 'super-admin',
  state: (): SuperAdminState => ({
    userEmail: '',
    password: '',
    id: '',
    newUser: [],
    token: sessionStorage.getItem('token') || '',
    isVendor: JSON.parse(localStorage.getItem('isVendor') || 'false'),
    isProxy: JSON.parse(sessionStorage.getItem('isProxy') || 'false'),
    vendorId: JSON.parse(localStorage.getItem('vendorId') || 'null'),
    companyName: JSON.parse(localStorage.getItem('vendor') || 'null'),
  }),

  actions: {
    get loading() {
      return useGeneralStore().loading
    },
    setToken(token: string) {
      this.token = token
      sessionStorage.setItem('token', token)
    },
    setLocalStorage(firstname: string, lastname: string, email: string, id: string) {
      const user = {
        firstname,
        lastname,
        email,
        id,
      }
      // store basic user data in local storage
      localStorage.setItem('user', JSON.stringify(user))
    },
    setVendor(value: boolean, id: string) {
      this.isVendor = value
      localStorage.setItem('isVendor', JSON.stringify(value))
      localStorage.setItem('vendorId', JSON.stringify(id))
    },
    getLocalstorageData() {
      const data = localStorage.getItem('user')!
      return JSON.parse(data)
    },
    clearToken() {
      this.token = ''
      // Remove the token from sessionStorage
      // sessionStorage.removeItem('token')
      localStorage.clear()
      sessionStorage.clear()
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
        await axios.get('/api/v1/admin/logout')

        // Clear the token
        this.clearToken()
        // clear localstorage
        useGeneralStore().setLoading(false)

        router.push({ name: 'superAdmin-login' })
      } catch (error: any) {
        useGeneralStore().setLoading(false)

        this.clearToken()
        router.push({ name: 'superAdmin-login' })
        toast({
          title: error.response.data.message || 'An error occurred',
          variant: 'destructive'
        })
      }
    }
  }
})
