import { defineStore } from "pinia";
import axios from "@/services/ApiService";
import { toast } from '@/components/ui/toast'
import { catchErr } from "@/composables/catchError";

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

export interface ImageInfo {
  public_id: string
  version: number
  signature: string
  width: number
  height: number
  format: string
  resource_type: string
  created_at: string
  bytes: number
  type: string
  url: string
  secure_url: string
  asset_id: string
  version_id: string
  tags: string[]
  etag: string
  placeholder: boolean
  folder: string
  original_filename: string
  api_key: string
}

export interface VendorSummary {
  _id: string
  companyName: string
}

export interface ProductSummary {
  _id: string
  name: string
  image: ImageInfo
  amount: number
  vendorId: VendorSummary
}

export interface OrderItems {
  productId: ProductSummary
  quantity: number
  price: number
}

export interface OrderData {
  _id: string
  userId: string
  vendorId: string
  items: OrderItems[]
  status: string
  paymentStatus: string
  totalAmount: number
  payoutMethod: string
  shippingAddress: string
  isDeleted: boolean
  deletedAt: string | null
  createdAt: string
  updatedAt: string
  __v: number
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


interface GeeftrStore {
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
  geeftrAnalytics: NormalizedOrderStats | null,
  orders: Order[] | null,
  order: OrderData | null,
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

export type OrderStatus =
  | 'new'
  | 'delivered'
  | 'processing'
  | 'outbound'
  | 'overdue';


interface RawOrderStats {
  status: OrderStatus;
  orderCount: number;
  totalAmount: number;
}

export interface OrderStatusStats {
  orderCount: number;
  totalAmount: number;
}


export type NormalizedOrderStats = Record<OrderStatus, OrderStatusStats>;

export function normalizeOrderStats(
  data: RawOrderStats[]
): NormalizedOrderStats {
  return data.reduce((acc, item) => {
    acc[item.status] = {
      orderCount: item.orderCount,
      totalAmount: item.totalAmount,
    };
    return acc;
  }, {} as NormalizedOrderStats);
}

export const useGeeftrStore = defineStore({
  id: 'vendor-transaction',
  state: (): GeeftrStore => ({
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
    geeftrAnalytics: null,
    orders: null,
    page: 1,
    order: null
  }),
  actions: {
    async fetchAnalytics(msg: string){
      toast({
        title: 'Loading Data',
        description: 'Fetching data...',
        duration: 0 // Set duration to 0 to make it indefinite until manually closed
      })

      try {
        // Set loading to true
        // useGeneralStore().setLoading(true)
        const response = await axios.get(`/api/v1/admin/market/orders/analytics/status/all`)

        if (response.status === 200 || response.status === 201) {
          this.geeftrAnalytics = normalizeOrderStats(response.data.data) || null;
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
    async fetchOrderById(msg: string, id: string){
      toast({
        title: 'Loading Data',
        description: 'Fetching data...',
        duration: 0 // Set duration to 0 to make it indefinite until manually closed
      })

      try {
        // Set loading to true
        // useGeneralStore().setLoading(true)
        const response = await axios.get(`/api/v1/admin/market/orders/${id}`)

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
    setDetailLoading(value: boolean) {
      if (value) {
        this.detailLoading = value
      } else {
        this.detailLoading = !this.detailLoading
      }
    },
  }
})
