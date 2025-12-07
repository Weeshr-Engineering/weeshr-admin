// stores/vendor-store/vendor-promotion.ts
import { defineStore } from 'pinia'
import axios from 'axios'
import { useToast } from '@/components/ui/toast'
import { useSuperAdminStore } from '@/stores/super-admin/super-admin'
// Create a clean axios instance for promotions (without /admin baseURL)
// const axios = axios.create({
//   baseURL: '', // No baseURL - we'll use full paths
// })

// Get auth token from localStorage
// const getAuthToken = () => {
//   return localStorage.getItem('token') || 
//          localStorage.getItem('authToken') || 
//          localStorage.getItem('access_token') ||
//          localStorage.getItem('accessToken') ||
//          localStorage.getItem('user_token')
// }

// // Get auth headers for API requests
// const getAuthHeaders = () => {
//   const token = getAuthToken()
//   return token ? {
//     'Authorization': `Bearer ${token}`,
//     'Content-Type': 'application/json'
//   } : {
//     'Content-Type': 'application/json'
//   }
// }


export interface Promotion {
  _id: string
  vendorId: string
  name: string
  description?: string
  promotionType: 'percentage_off' | 'fixed_amount_off' | 'bogo'
  promoCode: string
  discountValue: number
  appliesTo: 'all_products' | 'selected_products' 
  productIds?: string[]
  categoryIds?: string[]
  minimumPurchaseAmount?: number
  maximumDiscountCap?: number
  totalUsageLimit?: number
  usageCount: number
  limitPerCustomer?: number
  startDate: string
  endDate: string
  status: 'active' | 'scheduled' | 'draft' | 'expired'
  createdAt: string
  updatedAt: string
  __v?: number
}

interface Pagination {
  currentPage: number
  perPage: number
  totalPages: number
  totalItems: number
  from: number
  to: number
}

interface StatusCountResponse {
  no_of_active: number
  no_of_scheduled: number
  no_of_draft: number
  no_of_expired: number
}

export const usePromotionsStore = defineStore('promotions', {
  state: () => ({
    promotions: [] as Promotion[],
    currentPromotion: null as Promotion | null,
    loading: false,
    pagination: {
      currentPage: 1,
      perPage: 25,
      totalPages: 0,
      totalItems: 0,
      from: 1,
      to: 25
    } as Pagination,
    activeCount: 0,
    scheduledCount: 0,
    draftCount: 0,
    expiredCount: 0
  }),



  actions: {
    getVendorId(): string {
      const superAdminStore = useSuperAdminStore()
      return superAdminStore.vendorId
    },

    // Fetch all promotions with optional filters
    async fetchPromotions(params?: {
      page?: number
      perPage?: number
      search?: string
      sortBy?: string
      status?: string
      vendorId?: string
    }) {
      this.loading = true
      try {
        const vendorId = params?.vendorId || this.getVendorId()
        
        // console.log('Fetching promotions with vendorId:', vendorId) // Debug log
        
        // Build query params object
        const queryParams: any = {
          page: params?.page || 1,
          perPage: params?.perPage || 25,
          sortBy: params?.sortBy || 'startDate'
        }
        
        // Add vendorId if it exists
        if (vendorId) {
          queryParams.vendorId = vendorId
        }
        
        // Add search if provided
        if (params?.search) {
          queryParams.search = params.search
        }
        
        // Add status if not 'all'
        if (params?.status && params.status !== 'all') {
          queryParams.status = params.status
        }
        
        // console.log('Request params:', queryParams) // Debug log
        
        const response = await axios.get('/api/v1/admin/market/promotions', {
          // ,
          params: queryParams
        })

        // console.log('Promotions API Response:', response.data) // Debug log
        // console.log('Response status:', response.status) // Debug log
        // console.log('Full response:', response) // Debug log

        // Handle different response structures
        let data = response.data
        let promotions = []
        
        // Check if response has data property
        if (data.data) {
          // Structure: { data: { data: [...] } } or { data: { promotions: [...] } }
          if (data.data.data) {
            promotions = data.data.data
            data = data.data
          } else if (data.data.promotions) {
            promotions = data.data.promotions
            data = data.data
          } else if (Array.isArray(data.data)) {
            promotions = data.data
          } else {
            promotions = [data.data]
          }
        } else if (data.promotions) {
          // Structure: { promotions: [...] }
          promotions = data.promotions
        } else if (Array.isArray(data)) {
          // Structure: [...]
          promotions = data
        } else {
          console.warn('Unexpected response structure:', data)
          promotions = []
        }
        
        // console.log('Parsed promotions:', promotions) // Debug log
        // console.log('Number of promotions:', promotions.length) // Debug log
        
        this.promotions = promotions
        
        // Handle pagination - check multiple possible locations
        this.pagination = {
          currentPage: data.currentPage || response.data.currentPage || 1,
          perPage: data.perPage || response.data.perPage || 25,
          totalPages: data.totalPages || response.data.totalPages || 1,
          totalItems: data.totalItems || data.total || response.data.totalItems || response.data.total || promotions.length || 0,
          from: data.from || response.data.from || 1,
          to: data.to || response.data.to || promotions.length || 0
        }
        
        // console.log('Pagination:', this.pagination) // Debug log

        return this.promotions
      } catch (error: any) {
        console.error('Error fetching promotions:', error)
        console.error('Error response:', error.response?.data) // Debug log
        console.error('Request config:', error.config) // Debug log
        this.promotions = []
        throw error
      } finally {
        this.loading = false
      }
    },

    // Fetch promotion status counts
    async fetchPromotionStatusCounts(vendorId?: string) {
      try {
        const finalVendorId = vendorId || this.getVendorId()
        
        const response = await axios.get('/api/v1/admin/market/promotions/status/counts', {
          // ,
          params: finalVendorId ? { vendorId: finalVendorId } : undefined
        })
        
        if (response.status === 200) {
          const data: StatusCountResponse = response.data.data
          
          this.activeCount = data.no_of_active 
          this.scheduledCount = data.no_of_scheduled 
          this.draftCount = data.no_of_draft 
          this.expiredCount = data.no_of_expired 

          return {
            active: this.activeCount,
            scheduled: this.scheduledCount,
            draft: this.draftCount,
            expired: this.expiredCount
          }
        }
      } catch (error) {
        console.error('Error fetching promotion status counts:', error)
        // Set default values on error
        this.activeCount = 0
        this.scheduledCount = 0
        this.draftCount = 0
        this.expiredCount = 0
        throw error
      }
    },

    // Fetch a single promotion by ID
    async fetchPromotionById(id: string) {
      try {
        const response = await axios.get(`/api/v1/admin/market/promotions/${id}`, {
        })
        
        if (response.status === 200) {
          this.currentPromotion = response.data.data
          return response.data.data
        }
        return null
      } catch (error: any) {
        console.error('Error fetching promotion by ID:', error)
        throw error
      }
    },

    // Create a new promotion
    async createPromotion(promotionData: any) {
      this.loading = true
      const { toast } = useToast()
      
      try {
        const vendorId = this.getVendorId()
        
        // Add vendorId to the request body
        const dataWithVendorId = {
          ...promotionData,
          vendorId: vendorId
        }
        
        const response = await axios.post('/api/v1/admin/market/promotions', dataWithVendorId, {
          
        })
        
        if (response.status === 200 || response.status === 201) {
          const newPromotion = response.data.data
          
          toast({
            title: "Success!",
            description: response.data.message || 'Promotion created successfully!',
            variant: "default"
          })
          
          // Update counts based on status
          this.updateCountsAfterCreate(newPromotion.status)
          
          return newPromotion
        }
      } catch (error: any) {
        console.error('Create promotion error:', error)
        const errorMessage = error.response?.data?.message || 'Error creating promotion. Please try again.'
        toast({
          title: "Error",
          description: errorMessage,
          variant: 'destructive'
        })
        throw error
      } finally {
        this.loading = false
      }
    },

    // Update an existing promotion
    async updatePromotion(id: string, promotionData: any) {
      this.loading = true
      const { toast } = useToast()
      
      try {
        const vendorId = this.getVendorId()
        
        // Add vendorId to the request body if not present
        const dataWithVendorId = {
          ...promotionData,
          vendorId: vendorId
        }
        
        const response = await axios.patch(`/api/v1/admin/market/promotions/${id}`, dataWithVendorId, {
          
        })
        
        if (response.status === 200 || response.status === 201) {
          const updatedPromotion = response.data.data
          
          toast({
            title: "Success!",
            description: response.data.message || 'Promotion updated successfully!',
            variant: "default"
          })
          
          // Find and update the promotion in the list
          const index = this.promotions.findIndex(p => p._id === id)
          if (index !== -1) {
            const oldStatus = this.promotions[index].status
            this.promotions[index] = updatedPromotion
            
            // Update counts if status changed
            if (updatedPromotion.status && oldStatus !== updatedPromotion.status) {
              this.updateCountsAfterStatusChange(oldStatus, updatedPromotion.status)
            }
          }
          
          // Update current promotion if it's the one being viewed
          if (this.currentPromotion?._id === id) {
            this.currentPromotion = updatedPromotion
          }
          
          return updatedPromotion
        }
      } catch (error: any) {
        console.error('Update promotion error:', error)
        const errorMessage = error.response?.data?.message || 'Error updating promotion. Please try again.'
        toast({
          title: "Error",
          description: errorMessage,
          variant: 'destructive'
        })
        throw error
      } finally {
        this.loading = false
      }
    },

    // Update promotion products
    async updatePromotionProducts(id: string, productIds: string[]) {
      this.loading = true
      const { toast } = useToast()
      
      try {
        const response = await axios.patch(`/api/v1/admin/market/promotions/${id}/products`, { productIds }, {
          
        })
        
        if (response.status === 200 || response.status === 201) {
          toast({
            title: "Success!",
            description: response.data.message || 'Products updated successfully!',
            variant: "default"
          })
          
          return response.data.data
        }
      } catch (error: any) {
        console.error('Update promotion products error:', error)
        const errorMessage = error.response?.data?.message || 'Error updating products. Please try again.'
        toast({
          title: "Error",
          description: errorMessage,
          variant: 'destructive'
        })
        throw error
      } finally {
        this.loading = false
      }
    },

    // Publish a draft promotion
    async publishPromotion(id: string) {
      this.loading = true
      const { toast } = useToast()
      
      try {
        const response = await axios.post(`/api/v1/admin/market/promotions/${id}/publish`, {}, {
          
        })
        
        if (response.status === 200 || response.status === 201) {
          const publishedPromotion = response.data.data
          
          toast({
            title: "Success!",
            description: response.data.message || 'Promotion published successfully!',
            variant: "default"
          })
          
          // Find and update the promotion in the list
          const index = this.promotions.findIndex(p => p._id === id)
          if (index !== -1) {
            const oldStatus = this.promotions[index].status
            this.promotions[index] = publishedPromotion
            
            // Update counts
            this.updateCountsAfterStatusChange(oldStatus, publishedPromotion.status)
          }
          
          return publishedPromotion
        }
      } catch (error: any) {
        console.error('Publish promotion error:', error)
        const errorMessage = error.response?.data?.message || 'Error publishing promotion. Please try again.'
        toast({
          title: "Error",
          description: errorMessage,
          variant: 'destructive'
        })
        throw error
      } finally {
        this.loading = false
      }
    },

    // Delete a promotion
    async deletePromotion(id: string) {
      this.loading = true
      const { toast } = useToast()
      
      try {
        const vendorId = this.getVendorId()
        const promotionToDelete = this.promotions.find(p => p._id === id)
        
        await axios.delete(`/api/v1/admin/market/promotions/${id}`, {
          
          data: {
            vendorId: vendorId
          }
        })
        
        // Update counts BEFORE removing from list
        if (promotionToDelete) {
          this.updateCountsAfterDelete(promotionToDelete.status)
        }
        
        // Remove promotion from the list IMMEDIATELY (optimistic update)
        this.promotions = this.promotions.filter(p => p._id !== id)
        
        // Update pagination count
        if (this.pagination.totalItems > 0) {
          this.pagination.totalItems--
        }
        
        // Clear current promotion if it's the one being deleted
        if (this.currentPromotion?._id === id) {
          this.currentPromotion = null
        }
        
        toast({
          title: "Success!",
          description: 'Promotion deleted successfully!',
          variant: "default"
        })
        
        // Return success without re-fetching
        return { success: true }
      } catch (error: any) {
        console.error('Delete promotion error:', error)
        const errorMessage = error.response?.data?.message || 'Error deleting promotion. Please try again.'
        toast({
          title: "Error",
          description: errorMessage,
          variant: 'destructive'
        })
        throw error
      } finally {
        this.loading = false
      }
    },

    // Update promotion status only
    async updatePromotionStatus(
      id: string, 
      status: 'active' | 'scheduled' | 'draft' | 'expired'
    ) {
      return this.updatePromotion(id, { status })
    },

    // Helper: Update counts after creating a promotion
    updateCountsAfterCreate(status: string) {
      switch (status) {
        case 'active':
          this.activeCount++
          break
        case 'scheduled':
          this.scheduledCount++
          break
        case 'draft':
          this.draftCount++
          break
        case 'expired':
          this.expiredCount++
          break
      }
    },

    // Helper: Update counts after status change
    updateCountsAfterStatusChange(oldStatus: string, newStatus: string) {
      // Decrement old status count
      switch (oldStatus) {
        case 'active':
          this.activeCount = Math.max(0, this.activeCount - 1)
          break
        case 'scheduled':
          this.scheduledCount = Math.max(0, this.scheduledCount - 1)
          break
        case 'draft':
          this.draftCount = Math.max(0, this.draftCount - 1)
          break
        case 'expired':
          this.expiredCount = Math.max(0, this.expiredCount - 1)
          break
      }

      // Increment new status count
      switch (newStatus) {
        case 'active':
          this.activeCount++
          break
        case 'scheduled':
          this.scheduledCount++
          break
        case 'draft':
          this.draftCount++
          break
        case 'expired':
          this.expiredCount++
          break
      }
    },

    // Helper: Update counts after deleting a promotion
    updateCountsAfterDelete(status: string) {
      switch (status) {
        case 'active':
          this.activeCount = Math.max(0, this.activeCount - 1)
          break
        case 'scheduled':
          this.scheduledCount = Math.max(0, this.scheduledCount - 1)
          break
        case 'draft':
          this.draftCount = Math.max(0, this.draftCount - 1)
          break
        case 'expired':
          this.expiredCount = Math.max(0, this.expiredCount - 1)
          break
      }
    },

    // Format price for display (Nigerian Naira)
    formatPrice(price: number | undefined): string {
      const amount = price || 0
      return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN'
      }).format(amount)
    },

    // Format discount value for display
    formatDiscountValue(promotion: Promotion): string {
      if (promotion.promotionType === 'percentage_off') {
        return `${promotion.discountValue}%`
      } else if (promotion.promotionType === 'fixed_amount_off') {
        return `₦${promotion.discountValue.toLocaleString()}`
      } else if (promotion.promotionType === 'bogo') {
        return 'Buy 1 Get 1'
      }
      return promotion.discountValue.toString()
    },

    // Format promotion type for display
    formatPromotionType(type: string): string {
      const typeMap: Record<string, string> = {
        'percentage_off': '% Off',
        'fixed_amount_off': '₦ Off',
        'bogo': 'BOGO'
      }
      return typeMap[type] || type
    },

    // Format applies to for display
    formatAppliesTo(promotion: Promotion): string {
      if (promotion.appliesTo === 'all_products') {
        return 'All Products'
      } else if (promotion.appliesTo === 'selected_products') {
        return `${promotion.productIds?.length || 0} Selected Products`
      } else if (promotion.appliesTo === 'selected_categories') {
        return `${promotion.categoryIds?.length || 0} Selected Categories`
      }
      return promotion.appliesTo
    },

    // Format usage count
    formatUsageCount(promotion: Promotion): string {
      if (promotion.totalUsageLimit) {
        return `${promotion.usageCount}/${promotion.totalUsageLimit}`
      }
      return `${promotion.usageCount}/Unlimited`
    },

    // Format status for display (replace hyphens with spaces)
    formatStatus(status: string): string {
      return status.replace(/-/g, ' ')
    },

    // Clear all promotions
    clearPromotions() {
      this.promotions = []
      this.currentPromotion = null
      this.pagination = {
        currentPage: 1,
        perPage: 25,
        totalPages: 0,
        totalItems: 0,
        from: 1,
        to: 25
      }
    },

    // Reset all counts to zero
    resetCounts() {
      this.activeCount = 0
      this.scheduledCount = 0
      this.draftCount = 0
      this.expiredCount = 0
    },

    // Clear selected promotion
    clearCurrentPromotion() {
      this.currentPromotion = null
    },

    // Reset store state
    resetStore() {
      this.$patch({
        promotions: [],
        currentPromotion: null,
        loading: false,
        pagination: {
          currentPage: 1,
          perPage: 25,
          totalPages: 0,
          totalItems: 0,
          from: 1,
          to: 25
        },
        activeCount: 0,
        scheduledCount: 0,
        draftCount: 0,
        expiredCount: 0
      })
    }
  },

  getters: {
    // Get total promotion count
    totalPromotions: (state) => state.promotions.length,

    // Get promotions by status
    getPromotionsByStatus: (state) => (status: string) => {
      return state.promotions.filter(p => p.status === status)
    },

    // Get active promotions
    activePromotions: (state) => 
      state.promotions.filter(promo => promo.status === 'active'),
    
    // Get scheduled promotions
    scheduledPromotions: (state) => 
      state.promotions.filter(promo => promo.status === 'scheduled'),
    
    // Get draft promotions
    draftPromotions: (state) => 
      state.promotions.filter(promo => promo.status === 'draft'),
    
    // Get expired promotions
    expiredPromotions: (state) => 
      state.promotions.filter(promo => promo.status === 'expired'),

    // Check if there are any promotions
    hasPromotions: (state) => state.promotions.length > 0,

    // Get loading state
    isLoading: (state) => state.loading,

    // Get current page promotions (for client-side pagination if needed)
    currentPagePromotions: (state) => (page: number, perPage: number = 25) => {
      const start = (page - 1) * perPage
      const end = start + perPage
      return state.promotions.slice(start, end)
    }
  }
})