import { defineStore } from 'pinia';
import axios from 'axios';
import { useSuperAdminStore } from '@/stores/super-admin/super-admin';
import { useToast } from '@/components/ui/toast';

// Get auth headers for API requests
const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || 
                localStorage.getItem('authToken') || 
                localStorage.getItem('access_token') ||
                localStorage.getItem('accessToken');
  
  return token ? {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  } : {
    'Content-Type': 'application/json'
  };
};

interface Product {
  _id: string;
  name: string;
  price: number;
  image?: string;
}

interface Promotion {
  _id: string;
  vendorId: string;
  name: string;
  description?: string;
  promotionType: 'percentage_off' | 'fixed_amount_off' | 'bogo';
  promoCode: string;
  discountValue: number;
  appliesTo: 'all_products' | 'selected_products' | 'selected_categories';
  productIds?: string[];
  categoryIds?: string[];
  minimumPurchaseAmount?: number;
  maximumDiscountCap?: number;
  totalUsageLimit?: number;
  usageCount: number;
  limitPerCustomer?: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'scheduled' | 'draft' | 'expired';
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

interface PaginationData {
  currentPage: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
  from: number;
  to: number;
}

interface PromotionsResponse {
  data: Promotion[];
  currentPage: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
  from: number;
  to: number;
}

interface StatusCounts {
  no_of_active: number;
  no_of_scheduled: number;
  no_of_draft: number;
  no_of_expired: number;
}

export const usePromotionsStore = defineStore('promotions', {
  state: () => ({
    promotions: [] as Promotion[],
    pagination: {
      currentPage: 1,
      perPage: 25,
      totalPages: 1,
      totalItems: 0,
      from: 1,
      to: 25
    } as PaginationData,
    statusCounts: {
      no_of_active: 0,
      no_of_scheduled: 0,
      no_of_draft: 0,
      no_of_expired: 0
    } as StatusCounts,
    loading: false,
    error: null as string | null,
    selectedPromotion: null as Promotion | null,
  }),

  getters: {
    // Get promotions by status
    activePromotions: (state) => 
      state.promotions.filter(promo => promo.status === 'active'),
    
    scheduledPromotions: (state) => 
      state.promotions.filter(promo => promo.status === 'scheduled'),
    
    draftPromotions: (state) => 
      state.promotions.filter(promo => promo.status === 'draft'),
    
    expiredPromotions: (state) => 
      state.promotions.filter(promo => promo.status === 'expired'),

    // Count by status (from API)
    activeCount: (state) => state.statusCounts.no_of_active,
    scheduledCount: (state) => state.statusCounts.no_of_scheduled,
    draftCount: (state) => state.statusCounts.no_of_draft,
    expiredCount: (state) => state.statusCounts.no_of_expired,

    // Format discount value for display
    formatDiscountValue: () => (promotion: Promotion) => {
      if (promotion.promotionType === 'percentage_off') {
        return `${promotion.discountValue}%`;
      } else if (promotion.promotionType === 'fixed_amount_off') {
        return `₦${promotion.discountValue.toLocaleString()}`;
      } else if (promotion.promotionType === 'bogo') {
        return 'Buy 1 Get 1';
      }
      return promotion.discountValue.toString();
    },

    // Format promotion type for display
    formatPromotionType: () => (type: string) => {
      const typeMap: Record<string, string> = {
        'percentage_off': '% Off',
        'fixed_amount_off': '₦ Off',
        'bogo': 'BOGO'
      };
      return typeMap[type] || type;
    },

    // Format applies to for display
    formatAppliesTo: () => (promotion: Promotion) => {
      if (promotion.appliesTo === 'all_products') {
        return 'All Products';
      } else if (promotion.appliesTo === 'selected_products') {
        return `${promotion.productIds?.length || 0} Selected Products`;
      } else if (promotion.appliesTo === 'selected_categories') {
        return `${promotion.categoryIds?.length || 0} Selected Categories`;
      }
      return promotion.appliesTo;
    },

    // Format usage count
    formatUsageCount: () => (promotion: Promotion) => {
      if (promotion.totalUsageLimit) {
        return `${promotion.usageCount}/${promotion.totalUsageLimit}`;
      }
      return `${promotion.usageCount}/Unlimited`;
    }
  },

  actions: {
    // Get vendor ID from SuperAdminStore (same as product store)
    getVendorId(): string {
      const superAdminStore = useSuperAdminStore()
      return superAdminStore.vendorId
    },

    // Fetch status counts
    async fetchStatusCounts() {
      const { toast } = useToast();
      try {
        const vendorId = this.getVendorId();
        
        const response = await axios.get('/api/v1/admin/market/promotions/status/counts', {
          params: { vendorId },
          headers: getAuthHeaders()
        });
        
        if (response.status === 200 || response.status === 201) {
          this.statusCounts = response.data.data;
        }
      } catch (error: any) {
        console.error('Failed to fetch status counts:', error);
        if (error.response?.status === 401) {
          toast({
            description: 'Session expired. Please log in again.',
            variant: 'destructive'
          });
        }
      }
    },

    // Fetch all promotions with optional filters
    async fetchPromotions(params?: {
      page?: number;
      perPage?: number;
      sortBy?: string;
      status?: 'active' | 'scheduled' | 'draft' | 'expired';
      search?: string;
    }) {
      const { toast } = useToast();
      try {
        this.loading = true;
        
        const vendorId = this.getVendorId();
        const queryParams = new URLSearchParams();
        
        // Add vendorId to query params
        queryParams.append('vendorId', vendorId);
        
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.perPage) queryParams.append('perPage', params.perPage.toString());
        if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
        if (params?.status) queryParams.append('status', params.status);
        if (params?.search) queryParams.append('search', params.search);

        const queryString = queryParams.toString();
        const url = `/api/v1/admin/market/promotions${queryString ? `?${queryString}` : ''}`;

        const response = await axios.get(url, {
          headers: getAuthHeaders()
        });
        
        if (response.status === 200 || response.status === 201) {
          const data: PromotionsResponse = response.data.data;
          
          this.$patch({
            promotions: data.data,
            pagination: {
              currentPage: data.currentPage,
              perPage: data.perPage,
              totalPages: data.totalPages,
              totalItems: data.totalItems,
              from: data.from,
              to: data.to
            },
            error: null,
          });

          await this.fetchStatusCounts();
        } else {
          toast({
            description: response.data.message || 'Failed to fetch promotions',
            variant: 'destructive'
          });
        }
      } catch (error: any) {
        this.error = error.message || 'An unexpected error occurred';
        
        if (error.response?.status === 401) {
          toast({
            description: 'Session expired. Please log in again.',
            variant: 'destructive'
          });
        } else {
          toast({
            description: error.response?.data?.message || 'Failed to fetch promotions',
            variant: 'destructive'
          });
        }
      } finally {
        this.loading = false;
      }
    },

    // Fetch a single promotion by ID
    async fetchPromotionById(id: string) {
      const { toast } = useToast();
      try {
        this.loading = true;
        const vendorId = this.getVendorId();
        
        const response = await axios.get(`/api/v1/admin/market/promotions/${id}`, {
          params: { vendorId },
          headers: getAuthHeaders()
        });
        
        if (response.status === 200 || response.status === 201) {
          this.selectedPromotion = response.data.data;
          this.error = null;
          return response.data.data;
        } else {
          toast({
            description: response.data.message || 'Failed to fetch promotion',
            variant: 'destructive'
          });
          return null;
        }
      } catch (error: any) {
        this.error = error.message || 'An unexpected error occurred';
        toast({
          description: error.response?.data?.message || 'Failed to fetch promotion',
          variant: 'destructive'
        });
        return null;
      } finally {
        this.loading = false;
      }
    },

    // Create a new promotion
    async createPromotion(promotionData: Partial<Promotion>) {
      const { toast } = useToast();
      try {
        this.loading = true;
        
        const vendorId = this.getVendorId();
        
        if (!vendorId) {
          toast({
            description: 'Vendor ID is required. Please log in again.',
            variant: 'destructive'
          });
          return null;
        }
        
        const dataWithVendorId = {
          ...promotionData,
          vendorId
        };
        
        const response = await axios.post('/api/v1/admin/market/promotions', dataWithVendorId, {
          headers: getAuthHeaders()
        });
        
        if (response.status === 200 || response.status === 201) {
          toast({
            description: response.data.message || 'Promotion created successfully',
          });
          
          await this.fetchPromotions();
          await this.fetchStatusCounts();
          
          return response.data.data;
        } else {
          toast({
            description: response.data.message || 'Failed to create promotion',
            variant: 'destructive'
          });
          return null;
        }
      } catch (error: any) {
        this.error = error.message || 'An unexpected error occurred';
        toast({
          description: error.response?.data?.message || 'Failed to create promotion',
          variant: 'destructive'
        });
        return null;
      } finally {
        this.loading = false;
      }
    },

    // Update an existing promotion
    async updatePromotion(id: string, promotionData: Partial<Promotion>) {
      const { toast } = useToast();
      try {
        this.loading = true;
        const vendorId = this.getVendorId();
        
        const response = await axios.put(`/api/v1/admin/market/promotions/${id}`, {
          ...promotionData,
          vendorId
        }, {
          headers: getAuthHeaders()
        });
        
        if (response.status === 200 || response.status === 201) {
          toast({
            description: response.data.message || 'Promotion updated successfully',
          });
          
          // Refresh promotions list and status counts
          await this.fetchPromotions();
          await this.fetchStatusCounts();
          
          return response.data.data;
        } else {
          toast({
            description: response.data.message || 'Failed to update promotion',
            variant: 'destructive'
          });
          return null;
        }
      } catch (error: any) {
        this.error = error.message || 'An unexpected error occurred';
        toast({
          description: error.response?.data?.message || 'Failed to update promotion',
          variant: 'destructive'
        });
        return null;
      } finally {
        this.loading = false;
      }
    },

    // Update promotion products
    async updatePromotionProducts(id: string, productIds: string[]) {
      const { toast } = useToast();
      try {
        this.loading = true;
        const vendorId = this.getVendorId();
        
        const response = await axios.put(`/api/v1/admin/market/promotions/${id}/products`, { 
          productIds,
          vendorId 
        }, {
          headers: getAuthHeaders()
        });
        
        if (response.status === 200 || response.status === 201) {
          toast({
            description: response.data.message || 'Products added to promotion successfully',
          });
          
          // Refresh promotions list
          await this.fetchPromotions();
          
          return response.data.data;
        } else {
          toast({
            description: response.data.message || 'Failed to update promotion products',
            variant: 'destructive'
          });
          return null;
        }
      } catch (error: any) {
        this.error = error.message || 'An unexpected error occurred';
        toast({
          description: error.response?.data?.message || 'Failed to update promotion products',
          variant: 'destructive'
        });
        return null;
      } finally {
        this.loading = false;
      }
    },

    // Publish draft promotion
    async publishPromotion(id: string) {
      const { toast } = useToast();
      try {
        this.loading = true;
        const vendorId = this.getVendorId();
        
        const response = await axios.post(`/api/v1/admin/market/promotions/${id}/publish`, {
          vendorId
        }, {
          headers: getAuthHeaders()
        });
        
        if (response.status === 200 || response.status === 201) {
          toast({
            description: response.data.message || 'Promotion published successfully',
          });
          
          // Refresh promotions list and status counts
          await this.fetchPromotions();
          await this.fetchStatusCounts();
          
          return response.data.data;
        } else {
          toast({
            description: response.data.message || 'Failed to publish promotion',
            variant: 'destructive'
          });
          return null;
        }
      } catch (error: any) {
        this.error = error.message || 'An unexpected error occurred';
        toast({
          description: error.response?.data?.message || 'Failed to publish promotion',
          variant: 'destructive'
        });
        return null;
      } finally {
        this.loading = false;
      }
    },

    // Delete a promotion
    async deletePromotion(id: string) {
      const { toast } = useToast();
      try {
        this.loading = true;
        const vendorId = this.getVendorId();
        
        const response = await axios.delete(`/api/v1/admin/market/promotions/${id}`, {
          data: { vendorId },
          headers: getAuthHeaders()
        });
        
        if (response.status === 200 || response.status === 204) {
          toast({
            description: response.data?.message || 'Promotion deleted successfully',
          });
          
          // Refresh promotions list and status counts
          await this.fetchPromotions();
          await this.fetchStatusCounts();
          
          return true;
        } else {
          toast({
            description: response.data.message || 'Failed to delete promotion',
            variant: 'destructive'
          });
          return false;
        }
      } catch (error: any) {
        this.error = error.message || 'An unexpected error occurred';
        toast({
          description: error.response?.data?.message || 'Failed to delete promotion',
          variant: 'destructive'
        });
        return false;
      } finally {
        this.loading = false;
      }
    },

    // Clear selected promotion
    clearSelectedPromotion() {
      this.selectedPromotion = null;
    },

    // Reset store state
    resetStore() {
      this.$patch({
        promotions: [],
        pagination: {
          currentPage: 1,
          perPage: 25,
          totalPages: 1,
          totalItems: 0,
          from: 1,
          to: 25
        },
        statusCounts: {
          no_of_active: 0,
          no_of_scheduled: 0,
          no_of_draft: 0,
          no_of_expired: 0
        },
        loading: false,
        error: null,
        selectedPromotion: null,
      });
    }
  }
});