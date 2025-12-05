import { defineStore } from "pinia"
import axios from "@/services/ApiService";
import { toast } from "@/components/ui/toast";
import router from '@/router'

export interface Payout {
  _id: string;
  vendorId: Vendor;
  payoutAmount: number;
  payoutDate: string;
  unitCount: number;
  productCount: number;
  orderId: Order;
  status: string;
  transactionId: string | null;
  note: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Vendor {
  _id: string;
  logo: CloudinaryImage | null;
  cover: any; // or null if always null
  rcNumber: number;
  companyName: string;
  companyType: string;
  companyEmail: string;
  companyAddress: string;
  companyState: string;
  status: string;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CloudinaryImage {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
  type: string;
  url: string;
  secure_url: string;
  asset_id: string;
  version_id: string;
  tags: string[];
  etag: string;
  placeholder: boolean;
  folder: string;
  original_filename: string;
  api_key: string;
}

export interface Order {
  _id: string;
  userId: string;
  vendorId: string;
  items: OrderItem[];
  status: string;
  paymentStatus: string;
  totalAmount: number;
  payoutMethod: string;
  shippingAddress: string;
  phoneNumber: string;
  recieverName: string;
  recieverInputAddress: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

interface VendorPayoutStore {
  payout: Payout[],
  loading: boolean,
  perPage: number,
  currentPage: number,
  totalPages: number,
  page: number,
}

export const useVendorPayoutStore = defineStore('vendor-payout', {
  state: (): VendorPayoutStore => ({
    payout: [],
    loading: false,
    perPage: 0,
    currentPage: 0,
    totalPages: 0,
    page: 1,
  }),
  actions: {
    async getPayout(page: number, msg: string) {
      try {
        // console.log('fetching')
        toast({
          description: 'Fetching data...',
          variant: 'loading',
          duration: 0 // Set duration to 0 to make it indefinite until manually closed
        })
        this.loading = true
        // useGeneralStore().setLoadingToTrue()
        const response = await axios.get(`/api/v1/admin/market/payouts?per_page=${30}&page=${page}`)
        if (response.status === 200 || response.status === 201) {
          toast({
            title: 'Success',
            description: `Successful: ${msg}`,
            variant: 'success'
          })
          const data = response.data.data
          this.payout = response.data
            // console.log(response)
          this.payout = data;
          this.perPage = response.data.perPage
          this.currentPage = response.data.currentPage
          this.totalPages = response.data.totalPages    
        }
      } catch (error) {
        // console.log(error)
        this.catchErr(error)
        this.loading = false;
      }
    },
    handlePageChange(newPage: number) {
      if (newPage > 0 && newPage <= this.totalPages) {
        this.currentPage = newPage;
        this.page = newPage
        this.getPayout(this.page, `Page ${this.page}`)
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