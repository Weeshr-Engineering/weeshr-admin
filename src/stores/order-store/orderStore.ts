import { defineStore } from 'pinia';
import axios from 'axios';
import { useToast } from '@/components/ui/toast';

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [] as any[],
    currentOrder: null as any,
    analytics: {
      overdue: 0,
      new: 0,
      processing: 0,
      outbound: 0,
      delivered: 0,
      cancelled: 0
    },
    loading: false,
    error: null as string | null,
    filters: {
      status: '',
      search: '',
      dateFrom: null as Date | null,
      dateTo: null as Date | null
    }
  }),

  getters: {
    filteredOrders: (state) => {
      let filtered = state.orders;

      if (state.filters.status) {
        filtered = filtered.filter(order => order.status === state.filters.status);
      }

      if (state.filters.search) {
        const searchLower = state.filters.search.toLowerCase();
        filtered = filtered.filter(order => 
          order._id?.toLowerCase().includes(searchLower) ||
          order.shippingAddress?.toLowerCase().includes(searchLower) ||
          order.userId?.toLowerCase().includes(searchLower)
        );
      }

      if (state.filters.dateFrom && state.filters.dateTo) {
        filtered = filtered.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= state.filters.dateFrom! && orderDate <= state.filters.dateTo!;
        });
      }

      return filtered;
    },

    ordersByStatus: (state) => {
      return state.orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    },

    totalRevenue: (state) => {
      return state.orders
        .filter(order => order.paymentStatus === 'paid')
        .reduce((sum, order) => sum + order.totalAmount, 0);
    }
  },

  actions: {
    async fetchVendorOrders(vendorId: string) {
      const { toast } = useToast();
      try {
        this.loading = true;
        const response = await axios.get(`/api/v1/market/orders/vendor/${vendorId}`);
        
        if (response.status === 200 || response.status === 201) {
          this.orders = response.data.data || response.data;
          this.error = null;
        } else {
          toast({
            description: response.data.message,
            variant: 'destructive'
          });
        }
      } catch (error: any) {
        this.error = error.message || 'An unexpected error occurred';
        toast({
          description: error.response?.data?.message || 'Failed to fetch orders',
          variant: 'destructive'
        });
      } finally {
        this.loading = false;
      }
    },

    async fetchOrderById(orderId: string) {
      const { toast } = useToast();
      try {
        this.loading = true;
        const response = await axios.get(`/api/v1/admin/market/orders/${orderId}`);
        
        if (response.status === 200 || response.status === 201) {
          this.currentOrder = response.data.data || response.data;
          this.error = null;
        } else {
          toast({
            description: response.data.message,
            variant: 'destructive'
          });
        }
      } catch (error: any) {
        this.error = error.message || 'An unexpected error occurred';
        toast({
          description: error.response?.data?.message || 'Failed to fetch order',
          variant: 'destructive'
        });
      } finally {
        this.loading = false;
      }
    },

    async updateOrderStatus(orderId: string, status: string) {
      const { toast } = useToast();
      try {
        this.loading = true;
        const response = await axios.patch(`/api/v1/market/orders/${orderId}/status`, { status });
        
        if (response.status === 200 || response.status === 201) {
          // Update local state
          const orderIndex = this.orders.findIndex(order => order._id === orderId);
          if (orderIndex !== -1) {
            this.orders[orderIndex].status = status;
            this.orders[orderIndex].updatedAt = new Date();
          }
          
          if (this.currentOrder && this.currentOrder._id === orderId) {
            this.currentOrder.status = status;
            this.currentOrder.updatedAt = new Date();
          }

          this.error = null;
          toast({
            description: 'Order status updated successfully',
            variant: 'default'
          });

          return response.data.data || response.data;
        } else {
          toast({
            description: response.data.message,
            variant: 'destructive'
          });
        }
      } catch (error: any) {
        this.error = error.message || 'An unexpected error occurred';
        toast({
          description: error.response?.data?.message || 'Failed to update order status',
          variant: 'destructive'
        });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchVendorAnalytics(vendorId: string) {
      const { toast } = useToast();
      try {
        this.loading = true;
        const response = await axios.get(`/api/v1/market/orders/vendor/${vendorId}/analytics/status`);
        
        if (response.status === 200 || response.status === 201) {
          this.analytics = response.data.data || response.data;
          this.error = null;
        } else {
          toast({
            description: response.data.message,
            variant: 'destructive'
          });
        }
      } catch (error: any) {
        this.error = error.message || 'An unexpected error occurred';
        toast({
          description: error.response?.data?.message || 'Failed to fetch analytics',
          variant: 'destructive'
        });
      } finally {
        this.loading = false;
      }
    },

    async deleteOrder(orderId: string) {
      const { toast } = useToast();
      try {
        this.loading = true;
        const response = await axios.delete(`/api/v1/admin/market/orders/${orderId}`);
        
        if (response.status === 200 || response.status === 204) {
          // Remove from local state
          this.orders = this.orders.filter(order => order._id !== orderId);
          
          if (this.currentOrder && this.currentOrder._id === orderId) {
            this.currentOrder = null;
          }

          this.error = null;
          toast({
            description: 'Order deleted successfully',
            variant: 'default'
          });
        } else {
          toast({
            description: response.data.message,
            variant: 'destructive'
          });
        }
      } catch (error: any) {
        this.error = error.message || 'An unexpected error occurred';
        toast({
          description: error.response?.data?.message || 'Failed to delete order',
          variant: 'destructive'
        });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async searchOrders(vendorId: string, searchTerm: string) {
      const { toast } = useToast();
      try {
        this.loading = true;
        const response = await axios.get(`/api/v1/market/orders/vendor/${vendorId}`, {
          params: { search: searchTerm }
        });
        
        if (response.status === 200 || response.status === 201) {
          this.orders = response.data.data || response.data;
          this.error = null;
        } else {
          toast({
            description: response.data.message,
            variant: 'destructive'
          });
        }
      } catch (error: any) {
        this.error = error.message || 'An unexpected error occurred';
        toast({
          description: error.response?.data?.message || 'Failed to search orders',
          variant: 'destructive'
        });
      } finally {
        this.loading = false;
      }
    },

    setFilters(newFilters: any) {
      this.filters = { ...this.filters, ...newFilters };
    },

    clearFilters() {
      this.filters = {
        status: '',
        search: '',
        dateFrom: null,
        dateTo: null
      };
    },

    clearError() {
      this.error = null;
    },

    clearCurrentOrder() {
      this.currentOrder = null;
    }
  }
});