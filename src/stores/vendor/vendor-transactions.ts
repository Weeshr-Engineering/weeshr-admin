import { defineStore } from "pinia";
import axios from "@/services/ApiService";
import { toast } from '@/components/ui/toast'
import router from '@/router'
import { catchErr } from "@/composables/catchError";

// interface PhoneNumber {
//   countryCode: string;
//   phoneNumber: string;
//   normalizedNumber: string;
//   _id: string;
// }

// interface Role {
//   [key: string]: any; // Assuming the structure of Role is dynamic
// }
interface OrderItem {
  "productId": string,
  "quantity": number,
  "price": number
}
export interface Order {
  "_id": string,
  "userId": string,
  "vendorId": string,
  "items": OrderItem[],
  "status": string,
  "paymentStatus": string,
  "totalAmount": number,
  "payoutMethod": string,
  "shippingAddress": string,
  "createdAt": string,
  "updatedAt": string,
  "vendor": {
      "companyName": string,
      "companyEmail": string
  },
  "user": {
      "email": string
  }
}

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


interface VendorTransactionStore {
  vendors: vendorProfile[],
  adminStatus: boolean, //single admin id gotten from admin details page
  sheetOpen: boolean,
  loading: boolean,
  currentPage: number,
  totalpage: any[],
  detailLoading: boolean,
  totalPages: number,
  page: number,
  activityLog: any[],
  analytics: VendorAnalytics | null,
  orders: Order[] | null
}

export interface VendorAnalytics {
  vendorId: string;
  overdueAndUndelivered: {
    overdueCount: number;
    notDeliveredCount: number;
  };
  deliveredAnalytics: {
    totalDeliveredOrders: number;
    totalDeliveredAmount: number;
  };
  orderStatusSummary: any[]; // Replace `any` with your specific status type if available
  vendorPayoutAnalytics: {
    totalCompletedPayout: number;
    totalPendingPayout: number;
    totalPayoutCount: number;
    recentPayouts: any[]; // Same here — type it when you know the shape
  };
}

export const useVendorTransactionStore = defineStore({
  id: 'vendor-transaction',
  state: (): VendorTransactionStore => ({
    vendors: [],
    adminStatus: true,
    sheetOpen: false,
    loading: false,
    currentPage: 1,
    totalpage: [],
    detailLoading: false,
    totalPages: 1,
    activityLog: [],
    analytics: null,
    orders: null,
    page: 1
  }),
  actions: {
    async fetchAnalytics(msg: string, id: string){
      toast({
        title: 'Loading Data',
        description: 'Fetching data...',
        duration: 0 // Set duration to 0 to make it indefinite until manually closed
      })

      try {
        // Set loading to true
        // useGeneralStore().setLoading(true)
        const response = await axios.get(`/api/v1/admin/market/vendor/dashboard/${id}`)

        if (response.status === 200 || response.status === 201) {
          this.analytics = response.data.data;
          toast({
            title: 'Success',
            description: `${msg}`,
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
    async fetchAllOrders(msg: string, page = 1){
      toast({
        title: 'Loading Data',
        description: 'Fetching data...',
        duration: 0 // Set duration to 0 to make it indefinite until manually closed
      })

      try {
        // Set loading to true
        // useGeneralStore().setLoading(true)
        const response = await axios.get(`/api/v1/admin/market/orders?per_page=25`, {
        params: {
          page: page || 1,
          // limit: params?.limit || 10,
          // search: params?.search || '',
          // sortBy: params?.sortBy || 'name',
          // status: params?.status || 'all'
        }
      })
        // console.log(response)
        if (response.status === 200 || response.status === 201) {
          this.orders = response.data.data.data;
          this.currentPage = response.data.data.currentPage
          this.totalPages = response.data.data.totalPages
          toast({
            title: 'Success',
            description: `${msg}`,
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
    async fetchAllTransactions(msg: string){
      toast({
        title: 'Loading Data',
        description: 'Fetching data...',
        duration: 0 // Set duration to 0 to make it indefinite until manually closed
      })

      try {
        // Set loading to true
        // useGeneralStore().setLoading(true)
        const response = await axios.get(`/api/v1/admin/payouts`)

        if (response.status === 200 || response.status === 201) {
          this.analytics = response.data.data;
          toast({
            title: 'Success',
            description: `${msg}`,
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
        // VendorTransactionStore.setvendors(data.reverse())

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
      // VendorTransactionStore.loadingControl(true)
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
        //   VendorTransactionStore.loadingControl(false)
        this.catchErr(err)
        // Handle other errors
      }
    },
    handlePageChange (newPage: number){
    if (newPage > 0 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.page = newPage
      this.fetchAllOrders('success', this.page)
      toast({
        description: `Loading page ${newPage}`,
        duration: 0, // Set duration to 0 to make it indefinite until manually closed
        variant: 'loading'
      })
    }
  },
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
    async getActivityLog (id: any){
      
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
          // VendorTransactionStore.setvendors(data.reverse())

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
