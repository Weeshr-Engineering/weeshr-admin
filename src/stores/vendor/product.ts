import { defineStore } from 'pinia'
import axios from 'axios'

export interface Product {
  _id: string
  name: string
  description?: string
  amount?: number  
  qty?: number  
  tat?: string  
  image?: string | any
  status: 'published' | 'draft' | 'archived' | 'out-of-stock'
  size?: string
  tag?: string[]  
  vendorId?: string
  createdAt?: string
  updatedAt?: string
}

export interface Category {
  _id: string
  name: string
  description?: string
  status?: string
  createdAt?: string
  updatedAt?: string
}

interface Pagination {
  currentPage: number
  totalPages: number
  totalProducts: number
  hasNext: boolean
  hasPrev: boolean
}

interface StatusCountResponse {
  no_of_published: number
  no_of_drafted: number
  no_of_archived: number
  no_of_out_of_stock: number
}




export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [] as Product[],
    categories: [] as Category[],
    currentProduct: null as Product | null,
    loading: false,
    loadingCategories: false,
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalProducts: 0,
      hasNext: false,
      hasPrev: false
    } as Pagination,
    publishedCount: 0,
    draftCount: 0,
    archivedCount: 0,
    outOfStockCount: 0
  }),

  actions: {
    //  Fetch all categories to use as tags
    async fetchCategories() {
      this.loadingCategories = true
      try {
        const response = await axios.get('/api/v1/admin/market/categories')
        
        if (response.data.data && Array.isArray(response.data.data)) {
          this.categories = response.data.data
        } else if (response.data.categories) {
          this.categories = response.data.categories
        } else {
          this.categories = response.data || []
        }
        
        return this.categories
      } catch (error) {
        console.error('Error fetching categories:', error)
        
        throw error
      } finally {
        this.loadingCategories = false
      }
    },

    //  Get category name by ID for display

    getCategoryName(categoryId: string): string {
      const category = this.categories.find(cat => cat._id === categoryId)
      return category ? category.name : 'Unknown Category'
    },

    //  Fetch all products with optional filters
    async fetchProducts(params?: {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  status?: string
  vendorId?: string
}) {
  this.loading = true
  try {
    const response = await axios.get('/api/v1/admin/market/products/', {
      params: {
        vendorId:  '67001b0cdce3af5c124e5dd9',
        page: params?.page || 1,
        limit: params?.limit || 10,
        search: params?.search || '',
        sortBy: params?.sortBy || 'name',
        status: params?.status || 'all'
      }
    })

 

    const data = response.data.data
   const products = (data.data || data.products || []).map((product: any) => this.normalizeProduct(product))
    
    this.products = products
    
   
    this.pagination = {
      currentPage: data.currentPage || 1,
      totalPages: data.totalPages || 1,
      totalProducts: data.total || data.data?.length || 0,
      hasNext: data.totalPages > data.currentPage,
      hasPrev: data.currentPage > 1 
    }

    return this.products
  } catch (error) {
    console.error('Error fetching products:', error)
    this.products = []
    throw error
  } finally {
    this.loading = false
  }
},

    //  Fetch product status counts
    async fetchProductStatusCounts(vendorId?: string) {
      try {
        const response = await axios.get('/api/v1/admin/market/products/status/counts', {
          params: vendorId ? { vendorId } : undefined
        })
        
        if (response.status === 200) {
          
          const data: StatusCountResponse = response.data.data
          
          this.publishedCount = data.no_of_published 
          this.draftCount = data.no_of_drafted 
          this.archivedCount = data.no_of_archived 
          this.outOfStockCount = data.no_of_out_of_stock 

      
          return {
            published: this.publishedCount,
            draft: this.draftCount,
            archived: this.archivedCount,
            outOfStock: this.outOfStockCount
          }
        }
      } catch (error) {
        console.error('Error fetching product status counts:', error)
        // Set default values on error
        this.publishedCount = 0
        this.draftCount = 0
        this.archivedCount = 0
        this.outOfStockCount = 0
        throw error
      }
    },

   
  //  Fetch a single product by ID
    async fetchProductById(id: string, vendorId: string = '67001b0cdce3af5c124e5dd9') {
   try{
const product = this.products.find(p => p._id === id)




        // const response = await axios.get(`/api/v1/admin/market/products/${id}`, {data})
        



        // console.log('✅ Fetch product by ID response:', response.data)
        
        // const product = response.data.data
        
        // // Normalize the product data
        const normalizedProduct = this.normalizeProduct(product)
        
        return normalizedProduct
        
      } catch (error: any) {
        console.error('❌ Error fetching product by ID:', error)
        console.error('Product ID attempted:', id)
        console.error('Vendor ID used:', vendorId)
        throw error
      }
    },

    normalizeProduct(product: any): Product {
      if (!product) return product
   
  let imageUrl = null
  if (product.image) {
    if (typeof product.image === 'string') {
      imageUrl = product.image
    } else if (product.image.secure_url) {
      imageUrl = product.image.secure_url
    } else if (product.image.url) {
      imageUrl = product.image.url
    }
  }

      // Handle tag field - can be array of IDs or array of Category objects
     let tags: string[] = []
  if (product.tag && Array.isArray(product.tag)) {
    tags = product.tag.map((t: any) => {
      if (typeof t === 'string') return t
      if (t && typeof t === 'object' && t._id) return t._id
      return String(t)
    }).filter(Boolean) 
  }


  return {
    ...product,
    image: imageUrl,
    tag: tags, 
    vendorId: product.vendor?._id || product.vendorId
  }
},
    /**
     * Normalize product data to handle different API response formats
     */
    

      // Create a new product
async createProduct(productData: any) {
  this.loading = true
  try {
    // Add vendorId to the request body
    if (productData instanceof FormData) {
      productData.append('vendorId', '67001b0cdce3af5c124e5dd9')
    } else {
      productData = {
        ...productData,
        vendorId: '67001b0cdce3af5c124e5dd9'
      }
    }
    
    let config = {}
    
    if (productData instanceof FormData) {
      config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    }

    const response = await axios.post('/api/v1/admin/market/products', productData, config)
    const newProduct = response.data.data
    
    return newProduct
  } catch (error) {
    console.error('Error creating product:', error)
    throw error
  } finally {
    this.loading = false
  }
},
   
  
    // Update an existing product
async updateProduct(id: string, productData: any) {
  this.loading = true
  try {
    // Add vendorId to the request body
    if (productData instanceof FormData) {
      productData.append('vendorId', '67001b0cdce3af5c124e5dd9')
    } else {
      productData = {
        ...productData,
        vendorId: '67001b0cdce3af5c124e5dd9'
      }
    }
    
    let config = {}
    
    // Handle FormData with multipart/form-data headers (for image uploads)
    if (productData instanceof FormData) {
      config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    }

    const response = await axios.patch(`/api/v1/admin/market/products/${id}`, productData, config)
    const updatedProduct = response.data.data
    
    // Find and update the product in the list
    const index = this.products.findIndex(p => p._id === id)
    if (index !== -1) {
      const oldStatus = this.products[index].status
      this.products[index] = updatedProduct
      
      // Update counts if status changed
      if (updatedProduct.status && oldStatus !== updatedProduct.status) {
        this.updateCountsAfterStatusChange(oldStatus, updatedProduct.status)
      }
    }
    
    // Update current product if it's the one being viewed
    if (this.currentProduct?._id === id) {
      this.currentProduct = updatedProduct
    }
    
    return updatedProduct
  } catch (error) {
    console.error('Error updating product:', error)
    throw error
  } finally {
    this.loading = false
  }
}
,


  
async deleteProduct(id: string) {
  this.loading = true
  try {

    const productToDelete = this.products.find(p => p._id === id)
    
  
    await axios.delete(`/api/v1/admin/market/products/${id}`, {
      data: {
        vendorId: '67001b0cdce3af5c124e5dd9'
      }
    })
    
    // Update counts BEFORE removing from list
    if (productToDelete) {
      this.updateCountsAfterDelete(productToDelete.status)
    }
    
    // Remove product from the list IMMEDIATELY (optimistic update)
    this.products = this.products.filter(p => p._id !== id)
    
    // Update pagination count
    if (this.pagination.totalProducts > 0) {
      this.pagination.totalProducts--
    }
    
    // Clear current product if it's the one being deleted
    if (this.currentProduct?._id === id) {
      this.currentProduct = null
    }
    
    
    // Return success without re-fetching
    return { success: true }
  } catch (error) {
    console.error('❌ Error deleting product:', error)
    throw error
  } finally {
    this.loading = false
  }
},

    /**
     * Bulk upload products
     */
    async bulkUploadProducts(products: Partial<Product>[]) {
      this.loading = true
      const results = {
        success: [] as Product[],
        failed: [] as { product: Partial<Product>, error: any }[]
      }

      try {
        for (const productData of products) {
          try {
            const created = await this.createProduct(productData)
            results.success.push(created)
          } catch (error) {
            results.failed.push({ product: productData, error })
          }
        }

        return results
      } finally {
        this.loading = false
      }
    },

    /**
     * Update product status only
     */
    async updateProductStatus(
      id: string, 
      status: 'published' | 'draft' | 'archived' | 'out-of-stock'
    ) {
      return this.updateProduct(id, { status })
    },

    /**
     * Helper: Update counts after creating a product
     */
    updateCountsAfterCreate(status: string) {
      switch (status) {
        case 'published':
          this.publishedCount++
          break
        case 'draft':
          this.draftCount++
          break
        case 'archived':
          this.archivedCount++
          break
        case 'out-of-stock':
          this.outOfStockCount++
          break
      }
    },

    /**
     * Helper: Update counts after status change
     */
    updateCountsAfterStatusChange(oldStatus: string, newStatus: string) {
      // Decrement old status count
      switch (oldStatus) {
        case 'published':
          this.publishedCount = Math.max(0, this.publishedCount - 1)
          break
        case 'draft':
          this.draftCount = Math.max(0, this.draftCount - 1)
          break
        case 'archived':
          this.archivedCount = Math.max(0, this.archivedCount - 1)
          break
        case 'out-of-stock':
          this.outOfStockCount = Math.max(0, this.outOfStockCount - 1)
          break
      }

      // Increment new status count
      switch (newStatus) {
        case 'published':
          this.publishedCount++
          break
        case 'draft':
          this.draftCount++
          break
        case 'archived':
          this.archivedCount++
          break
        case 'out-of-stock':
          this.outOfStockCount++
          break
      }
    },

    /**
     * Helper: Update counts after deleting a product
     */
    updateCountsAfterDelete(status: string) {
      switch (status) {
        case 'published':
          this.publishedCount = Math.max(0, this.publishedCount - 1)
          break
        case 'draft':
          this.draftCount = Math.max(0, this.draftCount - 1)
          break
        case 'archived':
          this.archivedCount = Math.max(0, this.archivedCount - 1)
          break
        case 'out-of-stock':
          this.outOfStockCount = Math.max(0, this.outOfStockCount - 1)
          break
      }
    },

    /**
     * Format price for display (Nigerian Naira)
     * Handles both 'price' and 'amount' fields
     */
    formatPrice(price: number | undefined): string {
      const amount = price || 0
      return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN'
      }).format(amount)
    },

    /**
     * Format status for display (replace hyphens with spaces)
     */
    formatStatus(status: string): string {
      return status.replace(/-/g, ' ')
    },

    /**
     * Clear all products
     */
    clearProducts() {
      this.products = []
      this.currentProduct = null
      this.pagination = {
        currentPage: 1,
        totalPages: 0,
        totalProducts: 0,
        hasNext: false,
        hasPrev: false
      }
    },

    /**
     * Reset all counts to zero
     */
    resetCounts() {
      this.publishedCount = 0
      this.draftCount = 0
      this.archivedCount = 0
      this.outOfStockCount = 0
    }
  },

  getters: {
    /**
     * Get total product count
     */
    totalProducts: (state) => state.products.length,

    /**
     * Get products by status
     */
    getProductsByStatus: (state) => (status: string) => {
      return state.products.filter(p => p.status === status)
    },

    /**
     * Check if there are any products
     */
    hasProducts: (state) => state.products.length > 0,

    /**
     * Get loading state
     */
    isLoading: (state) => state.loading,

    /**
     * Get categories loading state
     */
    isLoadingCategories: (state) => state.loadingCategories,

    /**
     * Get available categories
     */
    availableCategories: (state) => state.categories,

    /**
     * Get current page products (for client-side pagination if needed)
     */
    currentPageProducts: (state) => (page: number, limit: number = 10) => {
      const start = (page - 1) * limit
      const end = start + limit
      return state.products.slice(start, end)
    }
  }
})