import { defineStore } from 'pinia'
import axios from 'axios'

export interface Product {
  _id: string
  name: string
  description?: string
  price: number
  quantity: number
  deliveryTat?: string
  image?: string
  status: 'published' | 'draft' | 'archived' | 'out-of-stock'
  size?: string
  tags?: string[]
  category?: string
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

interface ProductsResponse {
  products: Product[]
  pagination: Pagination
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
    loading: false,
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
    async fetchProducts(params?: {
      page?: number
      limit?: number
      search?: string
      sortBy?: string
      status?: string
    }) 
    {
      this.loading = true
      try {
        const response = await axios.get('/api/v1/market/products/?vendorId=68f925108843722b53579e95', {
          params: {
            page: params?.page || 1,
            limit: params?.limit || 10,
            search: params?.search || '',
            sortBy: params?.sortBy || 'name',
            status: params?.status || 'all'
          }
          
        }
        
    )
    console.log('Fetch products response:', response)

        const data = response.data.data
        
        this.products = data.data
        this.pagination =  {
      currentPage: data.currentPage,
      totalPages: data.totalPages,
      totalProducts: data.data.length,
      hasNext: data.totalPages > data.currentPage,
      hasPrev: data.currentPage > 1 
    } 

      } catch (error) {
        console.error('Error fetching products:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchProductStatusCounts() {
      try {
        const response = await axios.get('/api/v1/admin/market/products/status/counts')
        
        if (response.status === 200) {
          console.log('Status counts response:', response)
          
          const data: StatusCountResponse = response.data.data
          
          this.publishedCount = data.no_of_published
          this.draftCount = data.no_of_drafted
          this.archivedCount = data.no_of_archived
          this.outOfStockCount = data.no_of_out_of_stock

          console.log('Published Count:', this.publishedCount)
          console.log('Draft Count:', this.draftCount)
          console.log('Archived Count:', this.archivedCount)
          console.log('Out of Stock Count:', this.outOfStockCount)  
        }
      } catch (error) {
        console.error('Error fetching product status counts:', error)
        throw error
      }
    },

    async fetchProductById(id: string) {
      try {
        const response = await axios.get(`/api/v1/market/products/${id}`)
        return response.data.data
      } catch (error) {
        console.error('Error fetching product:', error)
        throw error
      }
    },

    async createProduct(productData: Partial<Product>) {
      try {
        const response = await axios.post('/api/v1/market/products/create', productData)
        const newProduct = response.data.data
        
        // Add the new product to the list
        this.products.unshift(newProduct)
        
        return newProduct
      } catch (error) {
        console.error('Error creating product:', error)
        throw error
      }
    },

    async uploadProductImage(productId: string, imageFile: File) {
      try {
        const formData = new FormData()
        formData.append('image', imageFile)

        const response = await axios.post(
          `/api/v1/market/products/${productId}/image`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        
        return response.data.data
      } catch (error) {
        console.error('Error uploading product image:', error)
        throw error
      }
    },

    async updateProduct(id: string, productData: Partial<Product>) {
      try {
        const response = await axios.put(`/api/v1/market/products/${id}`, productData)
        const updatedProduct = response.data.data
        
        // Update the product in the list
        const index = this.products.findIndex(p => p._id === id)
        if (index !== -1) {
          this.products[index] = updatedProduct
        }
        
        return updatedProduct
      } catch (error) {
        console.error('Error updating product:', error)
        throw error
      }
    },

    async deleteProduct(id: string) {
      try {
        await axios.delete(`/api/v1/market/products/${id}`)
        
        // Remove product from the list
        this.products = this.products.filter(p => p._id !== id)
        
      } catch (error) {
        console.error('Error deleting product:', error)
        throw error
      }
    },

    // Format price for display
    formatPrice(price: number): string {
      return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN'
      }).format(price)
    },

    // Format status for display
    formatStatus(status: string): string {
      return status.replace(/-/g, ' ')
    }
  }
})