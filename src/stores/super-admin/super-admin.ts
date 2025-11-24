import { defineStore } from 'pinia'
import axios from '@/services/ApiService'
import router from '@/router'
import { toast } from '@/components/ui/toast'
import { useGeneralStore } from '@/stores/general-use'
import { catchErr } from '@/composables/catchError'

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
  vendor: Vendor | null
}

interface NewUser {
  username: string
  userEmail: string
  category: 'Vendor' | 'Admin'
}

export interface UploadResponse {
  public_id: string
  version: number
  signature: string
  api_key: string
  asset_id: string
  bytes: number
  created_at: string
  etag: string
  folder: string
  format: string
  height: number
  original_filename: string
  placeholder: boolean
  resource_type: string
  secure_url: string
  tags: string[]
  type: string
  url: string
  version_id: string
  width: number
}

export interface Vendor {
   logo: UploadResponse | null;
  cover: UploadResponse | null;
  rcNumber: number;
  companyName: string;
  companyType: string;
  companyEmail: string;
  companyAddress: string;
  companyState: string;
  status: 'draft' | 'published' | 'archived' | string;
  isDeleted: boolean;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export const useSuperAdminStore = defineStore({
  id: 'super-admin',
  state: (): SuperAdminState => ({
    userEmail: '',
    password: '',
    id: '',
    newUser: [],
    vendor: null,
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
    async fetchUsersData(msg: string, id?: string){
      toast({
        title: 'Loading Data',
        description: 'Fetching data...',
        variant: 'loading',
        duration: 0 // Set duration to 0 to make it indefinite until manually closed
      })

      try {
        // Set loading to true
        // useGeneralStore().setLoading(true)
        const response = await axios.get(`/api/v1/market/vendor/${id || this.vendorId}`)

        if (response.status === 200 || response.status === 201) {
          // Update the users data with the response
          this.vendor = response.data.data;
          // console.log(response.data.data)
          // const responseData = response.data.data[0]
          // const phoneData = response.data.data[0].phoneNumber.normalizedNumber
          // const data = { ...responseData, phone: phoneData }
          // Show success toast
          toast({
            title: 'Success',
            description: `Success- ${msg}`,
            variant: 'success'
          })
        }
        // set Loading to false
        // useGeneralStore().setLoading(false)
      } catch (error: any) {
        catchErr(error)
        if (error.response.status === 401) {
          // sessionStorage.removeItem('token')
          // Clear token from superAdminStore
          // superAdminStore.setToken('')

          setTimeout(() => {
            // router.push({ name: 'super-admin-login' })
          }, 3000)

          toast({
            title: 'Unauthorized',
            description: 'You are not authorized to perform this action. Redirecting to home page...',
            variant: 'destructive'
          })
          // Redirect after 3 seconds
        } else {
          toast({
            title: error.response.data.message || 'An error occurred',
            variant: 'destructive'
          })
        }
      }
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
