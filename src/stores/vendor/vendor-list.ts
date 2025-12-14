import { defineStore } from "pinia";
import axios from "@/services/ApiService";
import { toast } from '@/components/ui/toast'
import router from '@/router'

// interface PhoneNumber {
//   countryCode: string;
//   phoneNumber: string;
//   normalizedNumber: string;
//   _id: string;
// }

// interface Role {
//   [key: string]: any; // Assuming the structure of Role is dynamic
// }

export interface vendorProfile {
  _id: string
  companyName: string
  companyEmail: string
  companyAddress: string
  companyState: string
  companyType: 'COMPANY' | string
  rcNumber: number
  status: 'published' | 'draft' | string
  logo: string | null
  cover: string | null
  categoryIds: string[]
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
  __v: number
}


interface VendorListStore {
  vendors: vendorProfile[],
  adminStatus: boolean, //single admin id gotten from admin details page
  sheetOpen: boolean,
  loading: boolean,
  currentPage: number,
  totalpage: any[],
  detailLoading: boolean,
  totalPages: number,
  page: number,
  activityLog: any[]
}

export const useVendorListStore = defineStore({
  id: 'vendor-list',
  state: (): VendorListStore => ({
    vendors: [],
    adminStatus: true,
    sheetOpen: false,
    loading: false,
    currentPage: 1,
    totalpage: [],
    detailLoading: false,
    totalPages: 1,
    page: 1,
    activityLog: []
  }),
  actions: {
    async fetchVendors(params?: {
      page?: number
      limit?: number
      search?: string
      sortBy?: string
      status?: string
      vendorId?: string
    }) {
      this.loading = true
      try {
        const response = await axios.get('/api/v1/admin/market/vendors?per_page=15', {
          params: {
            page: params?.page || 1,
            limit: params?.limit || 10,
            search: params?.search || '',
            // sortBy: params?.sortBy || 'name',
            // status: params?.status || 'all'
          }
        })

  

        // const data = response.data.data
        const vendorData = response.data.data.data
        this.currentPage = response.data.data.currentPage
        this.totalPages = response.data.data.totalPages

      
        this.vendors = vendorData
      
    
        // this.pagination = {
        //   currentPage: data.currentPage || 1,
        //   totalPages: data.totalPages || 1,
        //   totalProducts: data.total || data.data?.length || 0,
        //   hasNext: data.totalPages > data.currentPage,
        //   hasPrev: data.currentPage > 1 
        // }

        return this.vendors
      } catch (error) {
        console.error('Error fetching products:', error)
        this.vendors = []
        throw error
      } finally {
        this.loading = false
      }
    },
    handlePageChange(newPage: number) {
      if (newPage > 0 && newPage <= this.totalPages) {
        this.currentPage = newPage;
        this.page = newPage
        this.fetchVendors({ page: this.page })
        toast({
          description: `Loading page ${newPage}`,
          duration: 0, // Set duration to 0 to make it indefinite until manually closed
          variant: 'loading'
        })
      }
    },
    async fetchVendorsData() {

      toast({
        title: 'Loading Data',
        description: 'Fetching data...',
        variant: 'loading',
        duration: 0 // Set duration to 0 to make it indefinite until manually closed
      })

      // useGeneralStore().setLoading(true)
      try {
        // Set loading to true

        const response = await axios.get(
          '/api/v1/admin/market/vendors?per_page=200',
        )

        if (response.status === 200 || response.status === 201) {
          // Show success toast
          toast({
            title: 'Success',
            description: `data fetched`,
            variant: 'success'
          })          
        }

        // Update the vendors data with the response
        const data = response.data.data.data
        // console.log(data)
        this.vendors = data.reverse()
        // VendorListStore.setvendors(data.reverse())

        // set page data
        //   this.perPage= response.data.data.perPage
        this.currentPage = response.data.data.currentPage
        this.totalPages = response.data.data.totalPages

        // close loading screen
        // useGeneralStore().setLoading(false)
      } catch (error: any) {
        this.catchErr(error)
        if (error.response.status === 401) {
          sessionStorage.removeItem('token')
          // Clear token from superAdminStore
          // superAdminStore.setToken('')

          setTimeout(() => {
            router.push({ name: 'home' })
          }, 3000)

          toast({
            title: 'Unauthorized',
            description: 'You are not authorized to perform this action. Redirecting to home page...',
            variant: 'warning'
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
    // Save user data to the /administrator endpoint
    async saveUserData(user: any) {
      // VendorListStore.loadingControl(true)
      try {
        const response = await axios.post(
          '/api/v1/admin/market/vendor',
          user
        )

        // Check if response status is 200 or 201
        if (response.status === 200 || response.status === 201) {
          // Show success toast
          toast({
            title: 'Success',
            description: `${user.firstName} User profile created successfully.`,
            variant: 'success'
          })
          this.fetchVendorsData()
        }
        // Handle success
      } catch (err: any) {
        //   VendorListStore.loadingControl(false)
        this.catchErr(err)
        // Handle other errors
      }
    },
    // handlePageChange(newPage: number) {
    //   if (newPage > 0 && newPage <= this.totalPages) {
    //     this.currentPage = newPage;
    //   }
    // },
    sheetControl(value: boolean) {
      if (value) {
        this.sheetOpen = value
      } else {
        this.sheetOpen = !this.sheetOpen
      }
    },
    loadingControl(value: boolean) {
      if (value) {
        this.loading = value
      } else {
        this.loading = !this.loading
      }
    },
    setvendors(value: any[]) {
      if (value) {
        this.vendors = value
      }
    },
    setAdminStatus(value: boolean) {
      this.adminStatus = value
    },
    setDetailLoading(value: boolean) {
      if (value) {
        this.detailLoading = value
      } else {
        this.detailLoading = !this.detailLoading
      }
    },
    async toggleStatus(value: string, status: boolean, user: string) {
      toast({
        title: `${!status ? `Disabling ${user}...` : `Activating ${user}...`}`,
        description: `${status ? `Disabling ${user} in progress...` : `Activating ${user} in progress...`}`,
        duration: 0 // Set duration to 0 to make it indefinite until manually closed
      })
      const data = JSON.stringify({
        "status": !status
      });

      const config = {
        method: 'patch',
        maxBodyLength: Infinity,
        url: `/api/v1/admin/administrator/${value}/disabled_status`,
        data: data
      };

      axios.request(config)
        .then((response) => {
          // Check if response status is 200 or 201
          if (response.status === 200 || response.status === 201) {
            // Show success toast
            this.adminStatus = !this.adminStatus
            toast({
              title: 'Success',
              description: `${!status ? `${user} Disabled` : `${user} Activated`}`,
              variant: 'success'
            })
          }
        })
        .catch((error) => {
          
          this.catchErr(error)
        });
    },
    async getActivityLog(id: any) {
      
      toast({
        title: 'Loading Data',
        description: 'Fetching data...',
        variant: 'loading',
        duration: 0 // Set duration to 0 to make it indefinite until manually closed
      })

      // useGeneralStore().setLoading(true)
      try {
        // Set loading to true

        const response = await axios.get(
          `/api/v1/admin/logs/activity-logs?log_user_type=ADMIN&user_id=${id}`,
        )

        if (response.status === 200 || response.status === 201) {
          // Show success toast
          toast({
            title: 'Success',
            description: `data fetched`,
            variant: 'success'
          })

            
        }

        // Update the vendors data with the response
        const data = response.data.data.data
        // 
        this.activityLog = data
        // this.vendors = data.reverse()
        // VendorListStore.setvendors(data.reverse())

        // set page data
        //   this.perPage= response.data.data.perPage
        // this.currentPage = response.data.data.currentPage
        // this.totalPages = response.data.data.totalPages

        // close loading screen
        // useGeneralStore().setLoading(false)
      } catch (error: any) {
        this.catchErr(error)
        if (error.response.status === 401) {
          sessionStorage.removeItem('token')
          // Clear token from superAdminStore
          // superAdminStore.setToken('')

          setTimeout(() => {
            router.push({ name: 'home' })
          }, 3000)

          toast({
            title: 'Unauthorized',
            description: 'You are not authorized to perform this action. Redirecting to home page...',
            variant: 'warning'
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
    catchErr(error: any) {
      if (error.response.status === 400) {
        toast({
          title: error.response.data.message || 'Bad Request',
          description: 'Pls reach out to the management reguarding this request',
          variant: 'destructive'
        })
      } else if (error.response.status === 401) {
        sessionStorage.removeItem('token')
        setTimeout(() => {
          router.push({ name: 'superAdmin-login' })
        }, 1000)
        toast({
          title: error.response.data.message || 'Unauthenticated',
          description: 'Pls Signin again',
          variant: 'destructive'
        })
      } else if (error.response.status === 403) {
        toast({
          title: error.response.data.message || 'Unauthorized',
          description: 'You are not authorized to access this feature',
          variant: 'destructive'
        })
        setTimeout(() => {
          router.push({ name: 'home' })
        }, 3000)
      } else if (error.response.status === 422) {
        toast({
          title: error.response.data.message || 'Validation Error',
          description: 'Your request is not validated, Pls try again ',
          variant: 'destructive'
        })
      } else if (error.response.status === 500) {
        toast({
          title: error.response.data.message || 'Server Error',
          description: 'Pls try again later',
          variant: 'destructive'
        })
      } else if (error.response.status === 404) {
        toast({
          title: error.response.data.message || 'Not found',
          description: '404 Error',
          variant: 'destructive'
        })
      }
    }
  }
})
