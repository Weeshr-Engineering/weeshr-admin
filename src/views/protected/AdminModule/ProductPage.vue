<!-- ProductPage.vue -->
<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import MainNav from '@/components/MainNav.vue'
import DashboardFooter from '@/components/DashboardFooter.vue'
import Search from '@/components/UseSearch.vue'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'
import * as XLSX from 'xlsx'
import { Check, ScrollText, Battery, ListFilter, Archive, X } from 'lucide-vue-next'
import {
  Table,
  TableRow,
  TableBody,
  TableHeader,
  TableCell,
  TableHead
} from '@/components/ui/table'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
} from "@/components/ui/sheet"
import { useProductsStore } from '@/stores/vendor/product'
import { useSuperAdminStore } from '@/stores/super-admin/super-admin'
import { useToast } from '@/components/ui/toast'
import type { Product } from '@/stores/vendor/product'
import axios from 'axios'

const productsStore = useProductsStore()
const superAdminStore = useSuperAdminStore()
const { toast } = useToast()

// Get vendorId from superadmin store
const vendorId = computed(() => superAdminStore.vendorId)

// Categories state
const categories = ref<{_id: string, name: string}[]>([])
const loadingCategories = ref(false)

// NEW: Status filter state
const statusFilter = ref('all')
const showStatusFilter = ref(false)

const statusBg = (status: string) => {
  switch (status) {
    case 'published':
      return 'bg-[#00C37F]'
    case 'draft':
      return 'bg-[#6A70FF]'
    case 'archived':
      return 'bg-[#3A8EE5]'
    case 'out-of-stock':
      return 'bg-[#DF6C50]'
    default:
      return 'bg-gray-400'
  }
}

// Sheet states
const addProductSheetOpen = ref(false)
const viewProductSheetOpen = ref(false)
const showAddProductMenu = ref(false)
const currentStep = ref(1)
const bulkUploadMode = ref(false)
const selectedProducts = ref<number[]>([])
const selectedProduct = ref<Product | null>(null)
const bulkUploadFile = ref<File | null>(null)
const bulkProductsList = ref<any[]>([])

// Actions dropdown state
const showActionsMenu = ref<string | null>(null)

// Form data - tag is array of category IDs
const formData = ref({
  name: '',
  description: '',
  amount: '',
  qty: '1',
  tat: '',
  size: '',
  tag: [] as string[], // Array of category IDs
  image: null as File | null,
  status: 'draft' as 'published' | 'draft' | 'archived' | 'out-of-stock'
})

// Edit mode
const isEditMode = ref(false)
const editingProductId = ref<string | null>(null)

// Bulk upload states
const bulkProductTags = ref<Record<number, string>>({}) // Tag per product index
const applyTagToAll = ref(false) // Toggle for same tag
const globalBulkTag = ref<string>('') // Tag to apply to all

// Fetch categories from API
const fetchCategories = async () => {
  loadingCategories.value = true
  try {
    const response = await axios.get('/api/v1/admin/market/categories')
    
    // Handle different response structures
    if (response.data.data) {
      categories.value = response.data.data
    } else if (response.data.categories) {
      categories.value = response.data.categories
    } else {
      categories.value = response.data
    }
    
  } catch (error) {
    console.error('Error fetching categories:', error)
    toast({
      description: 'Error loading categories',
      variant: 'destructive'
    })
    // Fallback categories if API fails
    categories.value = [
      { _id: '68d2bd8683bae446451f7745', name: 'Electronics' },
      { _id: '68d2bd8683bae446451f7746', name: 'Home & Kitchen' },
      { _id: '68d2bd8683bae446451f7747', name: 'Fashion' },
      { _id: '68d2bd8683bae446451f7748', name: 'Sports' },
      { _id: '68d2bd8683bae446451f7749', name: 'Beauty' }
    ]
  } finally {
    loadingCategories.value = false
  }
}

// NEW: Apply status filter
const applyStatusFilter = (status: string) => {
  statusFilter.value = status
  showStatusFilter.value = false
  
  if (status === 'all') {
    productsStore.fetchProducts({ vendorId: vendorId.value })
  } else {
    productsStore.fetchProducts({ vendorId: vendorId.value, status })
  }
}

// NEW: Get display name for status filter
const getStatusFilterDisplay = () => {
  switch (statusFilter.value) {
    case 'all': return 'All'
    case 'published': return 'Published'
    case 'draft': return 'Draft'
    case 'archived': return 'Archived'
    case 'out-of-stock': return 'Out of Stock'
    default: return 'All'
  }
}

// Open single product mode
const openSingleProductMode = () => {
  bulkUploadMode.value = false
  currentStep.value = 1
  showAddProductMenu.value = false
  addProductSheetOpen.value = true
}

// Open bulk product mode
const openBulkProductMode = () => {
  bulkUploadMode.value = true
  currentStep.value = 1
  showAddProductMenu.value = false
  addProductSheetOpen.value = true
}

// Close dropdown when clicking outside
const closeDropdownOnClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  const dropdown = target.closest('.relative')
  if (!dropdown || !dropdown.querySelector('[data-add-product-menu]')) {
    showAddProductMenu.value = false
  }
  
  // NEW: Close status filter dropdown
  const statusFilterDropdown = target.closest('.relative')
  if (!statusFilterDropdown || !statusFilterDropdown.querySelector('[data-status-filter]')) {
    showStatusFilter.value = false
  }
}

// Close actions menu when clicking outside
const closeActionsMenuOnClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showActionsMenu.value = null
  }
}

// Handle bulk file upload
const handleBulkFileUpload = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  try {
    bulkUploadFile.value = file

    // Read the file
    const data = await file.arrayBuffer()
    const workbook = XLSX.read(data, { type: 'array' })
    
    // Get first sheet
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet)
    
    // Process and normalize the data
    bulkProductsList.value = jsonData.map((row: any) => {
      // Handle date conversion for 'tat' field
      let tatValue = row.tat || row.TAT || ''
      
      // If tat is a number (Excel date serial)
      if (typeof tatValue === 'number') {
        const date = XLSX.SSF.parse_date_code(tatValue)
        tatValue = `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`
      }
      // If tat is a string in DD/MM/YYYY format
      else if (typeof tatValue === 'string' && tatValue.includes('/')) {
        const parts = tatValue.split('/')
        if (parts.length === 3) {
          const day = parts[0].padStart(2, '0')
          const month = parts[1].padStart(2, '0')
          const year = parts[2]
          tatValue = `${year}-${month}-${day}`
        }
      }

      return {
        name: row.name || row.Name || '',
        amount: Number(row.amount || row.Amount || row.price || row.Price || 0),
        qty: Number(row.qty || row.Qty || row.quantity || row.Quantity || 1),
        tat: tatValue,
        size: row.size || row.Size || '',
        description: row.description || row.Description || '',
        img: row.img || row.Img || row.image || row.Image || ''
      }
    })

    toast({
      description: `${bulkProductsList.value.length} products loaded successfully!`,
    })
  } catch (error) {
    console.error('Error reading XLSX file:', error)
    toast({
      description: 'Error reading file. Please check the format.',
      variant: 'destructive'
    })
  }
}

// Helper to download image from URL
const downloadImageAsFile = async (url: string, filename: string): Promise<File | null> => {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    return new File([blob], filename, { type: blob.type })
  } catch (error) {
    console.error('Error downloading image:', error)
    return null
  }
}

// Updated uploadBulkProduct - removed individual fetches
const uploadBulkProduct = async (product: any, productIndex: number, status: string = 'published') => {
  try {
    // Get the tag for this product
    let productTag: string
    if (applyTagToAll.value) {
      productTag = globalBulkTag.value
    } else {
      productTag = bulkProductTags.value[productIndex]
    }

    // Validate tag is selected
    if (!productTag) {
      toast({
        description: 'Please select a category (tag) for this product',
        variant: 'destructive'
      })
      throw new Error('No category selected')
    }

    // Build FormData
    let data = new FormData()
    data.append('name', product.name)
    data.append('description', product.description || '')
    data.append('amount', product.amount.toString())
    data.append('tat', product.tat || '')
    data.append('qty', product.qty.toString())
    data.append('status', status)
    data.append('vendorId', vendorId.value)
    
    if (product.size) {
      data.append('size', product.size)
    }
    
    // Append single tag
    data.append('tag', productTag)

    // Download and attach image if URL provided
    if (product.img) {
      const imageFile = await downloadImageAsFile(
        product.img, 
        `${product.name.replace(/[^a-z0-9]/gi, '_')}.jpg`
      )
      
      if (imageFile) {
        data.append('image', imageFile)
      }
    }
    
    await productsStore.createProduct(data)
    
  } catch (error: any) {
    console.error('Bulk upload error:', error)
    const errorMessage = error.response?.data?.message || `Error uploading ${product.name}`
    throw error // Re-throw to handle in calling function
  }
}

// Remove bulk product from list
const removeBulkProduct = (index: number) => {
  bulkProductsList.value.splice(index, 1)
  // Remove the tag mapping for this index and adjust remaining indices
  const newTags: Record<number, string> = {}
  Object.keys(bulkProductTags.value).forEach(key => {
    const idx = Number(key)
    if (idx < index) {
      newTags[idx] = bulkProductTags.value[idx]
    } else if (idx > index) {
      newTags[idx - 1] = bulkProductTags.value[idx]
    }
  })
  bulkProductTags.value = newTags
}

// Download template
const downloadTemplate = () => {
  toast({
    description: 'Template download started',
  })
}

// Handle image upload
const handleImageUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    formData.value.image = file
  }
}

// Handle tag selection - UPDATED to allow only ONE tag
const handleTagSelection = (categoryId: string) => {
  // If clicking the same tag, deselect it
  if (formData.value.tag.includes(categoryId)) {
    formData.value.tag = []
  } else {
    // Replace with new selection (only one tag allowed)
    formData.value.tag = [categoryId]
  }
}

// Handle next button click
const handleNext = async () => {
  // Validate required fields
  if (!formData.value.name || !formData.value.amount) {
    toast({
      description: 'Please fill Name and Price fields',
      variant: 'destructive'
    })
    return
  }

  // Validate tags/categories - UPDATED MESSAGE
  if (formData.value.tag.length === 0) {
    toast({
      description: 'Please select a category', // Changed from "at least one"
      variant: 'destructive'
    })
    return
  }

  // Validate numeric fields
  const amount = Number(formData.value.amount)
  const qty = Number(formData.value.qty) || 1

  if (isNaN(amount) || amount <= 0) {
    toast({
      description: 'Price must be a positive number',
      variant: 'destructive'
    })
    return
  }

  if (isNaN(qty) || qty < 0) {
    toast({
      description: 'Quantity must be a positive integer',
      variant: 'destructive'
    })
    return
  }

  if (isEditMode.value && editingProductId.value) {
    await updateProduct()
  } else {
    await createProduct()
  }
}

// Create product
const createProduct = async () => {
  if (!formData.value.name || !formData.value.amount) {
    toast({
      description: 'Please fill all required fields',
      variant: 'destructive'
    })
    return
  }

  try {
    let data = new FormData()
    data.append('name', formData.value.name)
    data.append('description', formData.value.description || '')
    data.append('amount', formData.value.amount.toString())
    data.append('tat', formData.value.tat || '')
    data.append('qty', formData.value.qty.toString())
    data.append('status', formData.value.status)
    data.append('vendorId', vendorId.value) 
    
    if (formData.value.size) {
      data.append('size', formData.value.size)
    }
    
    // Append tags as comma-separated string
    if (formData.value.tag && formData.value.tag.length > 0) {
      data.append('tag', formData.value.tag.join(','))
    } else {
      data.append('tag', '68fdfc7f9f6421e9a1d46e08')
    }

    // Add image if selected
    if (formData.value.image) {
      data.append('image', formData.value.image)
    }

    const result = await productsStore.createProduct(data)
    
    if (result) {
      toast({
        title: "Success!",
        description: 'Product created successfully!',
        variant: "default"
      })
      
      resetForm()
      addProductSheetOpen.value = false
      
      await productsStore.fetchProducts({ vendorId: vendorId.value })
      await productsStore.fetchProductStatusCounts(vendorId.value)
    }
  } catch (error: any) {
    console.error('Create product error:', error)
    const errorMessage = error.response?.data?.message || 'Error creating product. Please try again.'
    toast({
      title: "Error",
      description: errorMessage,
      variant: 'destructive'
    })
  }
}

// Update product
const updateProduct = async () => {
  if (!editingProductId.value) return

  // Validate required fields
  if (!formData.value.name || !formData.value.amount) {
    toast({
      description: 'Please fill Name and Price fields',
      variant: 'destructive'
    })
    return
  }

  // Validate tags/categories - UPDATED MESSAGE
  if (formData.value.tag.length === 0) {
    toast({
      description: 'Please select a category', // Changed from "at least one"
      variant: 'destructive'
    })
    return
  }

  // Validate numeric fields
  const amount = Number(formData.value.amount)
  const qty = Number(formData.value.qty) || 1

  if (isNaN(amount) || amount <= 0) {
    toast({
      description: 'Price must be a positive number',
      variant: 'destructive'
    })
    return
  }

  if (isNaN(qty) || qty < 0) {
    toast({
      description: 'Quantity must be a positive integer',
      variant: 'destructive'
    })
    return
  }

  try {
    let data = new FormData()
    data.append('name', formData.value.name)
    data.append('description', formData.value.description || '')
    data.append('amount', formData.value.amount.toString())
    data.append('tat', formData.value.tat || '')
    data.append('qty', formData.value.qty.toString())
    data.append('status', formData.value.status)
    data.append('vendorId', vendorId.value) 
    
    if (formData.value.size) {
      data.append('size', formData.value.size)
    }
    
    // Append tags as comma-separated string
    if (formData.value.tag && formData.value.tag.length > 0) {
      data.append('tag', formData.value.tag.join(','))
    } else {
      data.append('tag', '')
    }

    // Add image if selected
    if (formData.value.image) {
      data.append('image', formData.value.image)
    }

    const result = await productsStore.updateProduct(editingProductId.value, data)
    
    if (result) {
      toast({
        title: "Success!",
        description: 'Product updated successfully!',
        variant: "default"
      })
      
      resetForm()
      addProductSheetOpen.value = false
      
      await productsStore.fetchProducts({ vendorId: vendorId.value })
      await productsStore.fetchProductStatusCounts(vendorId.value)
    }
  } catch (error: any) {
    console.error('Update product error:', error)
    const errorMessage = error.response?.data?.message || 'Error updating product. Please try again.'
    toast({
      title: "Error",
      description: errorMessage,
      variant: 'destructive'
    })
  }
}

// Delete product
const deleteProduct = async (id: string) => {
  if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return

  try {
    await productsStore.deleteProduct(id)
    toast({
      title: "Success!",
      description: 'Product deleted successfully!',
      variant: "default"
    })
    
    // Close view sheet if it's open for the deleted product
    if (selectedProduct.value?._id === id) {
      viewProductSheetOpen.value = false
      selectedProduct.value = null
    }
  } catch (error: any) {
    console.error('Delete product error:', error)
    const errorMessage = error.response?.data?.message || 'Error deleting product. Please try again.'
    toast({
      title: "Error",
      description: errorMessage,
      variant: 'destructive'
    })
  }
}

// Reset form
const resetForm = () => {
  currentStep.value = 1
  bulkUploadMode.value = false
  selectedProducts.value = []
  isEditMode.value = false
  editingProductId.value = null
  bulkUploadFile.value = null
  bulkProductsList.value = []
  bulkProductTags.value = {} // Clear individual tags
  applyTagToAll.value = false // Reset toggle
  globalBulkTag.value = '' // Clear global tag
  formData.value = {
    name: '',
    description: '',
    amount: '',
    qty: '1',
    tat: '',
    size: '',
    tag: [],
    image: null,
    status: 'draft'
  }
}

// View product details
const viewProductDetails = async (id: string) => {
  const product = await productsStore.fetchProductById(id)
  if (product) {
    selectedProduct.value = product
    viewProductSheetOpen.value = true
  }
}

// Edit product from view sheet
const editProduct = () => {
  if (!selectedProduct.value) return
  
  isEditMode.value = true
  editingProductId.value = selectedProduct.value._id
  bulkUploadMode.value = false
  
  // Set form data from selected product
  formData.value = {
    name: selectedProduct.value.name,
    description: selectedProduct.value.description || '',
    amount: (selectedProduct.value.amount || 0).toString(),
    qty: (selectedProduct.value.qty || 0).toString(),
    tat: selectedProduct.value.tat || '',
    size: selectedProduct.value.size || '',
    tag: selectedProduct.value.tag || [],
    image: null,
    status: selectedProduct.value.status
  }
  
  viewProductSheetOpen.value = false
  addProductSheetOpen.value = true
  currentStep.value = 1
}

// Edit product from dropdown menu
const editProductFromList = async (product: Product) => {
  isEditMode.value = true
  editingProductId.value = product._id
  bulkUploadMode.value = false
  
  const normalizedProduct = await productsStore.fetchProductById(product._id)
  
  formData.value = {
    name: normalizedProduct.name,
    description: normalizedProduct.description || '',
    amount: (normalizedProduct.amount || 0).toString(),
    qty: (normalizedProduct.qty || 0).toString(),
    tat: normalizedProduct.tat || '',
    size: normalizedProduct.size || '',
    tag: normalizedProduct.tag || [],
    image: null,
    status: normalizedProduct.status
  }
  
  addProductSheetOpen.value = true
  currentStep.value = 1
  showActionsMenu.value = null
}

// Get category name by ID
const getCategoryName = (categoryId: string) => {
  const category = categories.value.find(cat => cat._id === categoryId)
  return category ? category.name : 'Unknown Category'
}

// Sort by field
const sortBy = (field: string) => {
  productsStore.fetchProducts({ sortBy: field, vendorId: vendorId.value })
}

// Change page
const changePage = (page: number | string) => {
  if (typeof page === 'number' && page >= 1 && page <= productsStore.pagination.totalPages) {
    productsStore.fetchProducts({ page, vendorId: vendorId.value })
  }
}

// Computed visible pages for pagination
const visiblePages = computed(() => {
  const current = productsStore.pagination.currentPage
  const total = productsStore.pagination.totalPages
  const pages: (number | string)[] = []

  if (total <= 5) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    
    if (current > 3) {
      pages.push('...')
    }
    
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i)
    }
    
    if (current < total - 2) {
      pages.push('...')
    }
    
    pages.push(total)
  }

  return pages
})

// Update product status
const updateProductStatus = async (status: 'published' | 'draft' | 'archived' | 'out-of-stock') => {
  if (!selectedProduct.value) return

  try {
    await productsStore.updateProduct(selectedProduct.value._id, { status, vendorId: vendorId.value })
    selectedProduct.value.status = status
    
    toast({
      description: `Product ${status} successfully!`,
    })
    
    await productsStore.fetchProducts({ vendorId: vendorId.value })
    await productsStore.fetchProductStatusCounts(vendorId.value)
  } catch (error) {
    toast({
      description: 'Error updating product status',
      variant: 'destructive'
    })
  }
}

// NEW: Check if a product can be uploaded (has category selected)
const canUploadProduct = (index: number) => {
  if (applyTagToAll.value) {
    return !!globalBulkTag.value
  }
  return !!bulkProductTags.value[index]
}

// NEW: Check if all products can be bulk uploaded
const canBulkUpload = computed(() => {
  if (bulkProductsList.value.length === 0) return false
  
  if (applyTagToAll.value) {
    return !!globalBulkTag.value
  }
  
  // Check if all products have tags selected
  return bulkProductsList.value.every((_, index) => !!bulkProductTags.value[index])
})

// NEW: Upload individual product with specific status
const uploadProductWithStatus = async (product: any, index: number, status: 'published' | 'draft' | 'archived') => {
  // Validate tag is selected
  if (!canUploadProduct(index)) {
    toast({
      description: 'Please select a category for this product',
      variant: 'destructive'
    })
    return
  }

  try {
    await uploadBulkProduct(product, index, status)
    
    // Remove from list after successful upload
    bulkProductsList.value.splice(index, 1)
    
    // Remove tag mapping for this index and adjust remaining indices
    const newTags: Record<number, string> = {}
    Object.keys(bulkProductTags.value).forEach(key => {
      const idx = Number(key)
      if (idx < index) {
        newTags[idx] = bulkProductTags.value[idx]
      } else if (idx > index) {
        newTags[idx - 1] = bulkProductTags.value[idx]
      }
    })
    bulkProductTags.value = newTags
    
    // Close sheet if all products uploaded
    if (bulkProductsList.value.length === 0) {
      addProductSheetOpen.value = false
      resetForm()
    }
  } catch (error) {
    // Error already handled in uploadBulkProduct
  }
}

// NEW: Bulk publish all products - FIXED to upload sequentially
const bulkPublishAll = async () => {
  if (!canBulkUpload.value) {
    toast({
      description: applyTagToAll.value 
        ? 'Please select a category for all products'
        : 'Please select a category for each product',
      variant: 'destructive'
    })
    return
  }

  const totalProducts = bulkProductsList.value.length
  let successCount = 0
  let failCount = 0

  // Show initial toast
  toast({
    description: `Uploading ${totalProducts} products...`,
  })

  // Upload products one by one
  for (let i = 0; i < totalProducts; i++) {
    try {
      await uploadBulkProduct(bulkProductsList.value[i], i, 'published')
      successCount++
    } catch (error) {
      failCount++
      console.error(`Failed to upload product ${i}:`, error)
    }
  }
  
  // Refresh products and counts ONCE after all uploads complete
  await productsStore.fetchProducts({ vendorId: vendorId.value })
  await productsStore.fetchProductStatusCounts(vendorId.value)
  
  toast({
    description: `Upload complete! ${successCount} published${failCount > 0 ? `, ${failCount} failed` : ''}`,
    variant: failCount > 0 ? 'destructive' : 'default'
  })
  
  // Clear the list after upload
  bulkProductsList.value = []
  bulkProductTags.value = {}
  globalBulkTag.value = ''
  applyTagToAll.value = false
  addProductSheetOpen.value = false
  resetForm()
}

// NEW: Bulk draft all products - FIXED to upload sequentially
const bulkDraftAll = async () => {
  if (!canBulkUpload.value) {
    toast({
      description: applyTagToAll.value 
        ? 'Please select a category for all products'
        : 'Please select a category for each product',
      variant: 'destructive'
    })
    return
  }

  const totalProducts = bulkProductsList.value.length
  let successCount = 0
  let failCount = 0

  toast({
    description: `Uploading ${totalProducts} products as drafts...`,
  })

  for (let i = 0; i < totalProducts; i++) {
    try {
      await uploadBulkProduct(bulkProductsList.value[i], i, 'draft')
      successCount++
    } catch (error) {
      failCount++
      console.error(`Failed to upload product ${i}:`, error)
    }
  }
  
  // Refresh products and counts ONCE after all uploads complete
  await productsStore.fetchProducts({ vendorId: vendorId.value })
  await productsStore.fetchProductStatusCounts(vendorId.value)
  
  toast({
    description: `Upload complete! ${successCount} drafted${failCount > 0 ? `, ${failCount} failed` : ''}`,
    variant: failCount > 0 ? 'destructive' : 'default'
  })
  
  bulkProductsList.value = []
  bulkProductTags.value = {}
  globalBulkTag.value = ''
  applyTagToAll.value = false
  addProductSheetOpen.value = false
  resetForm()
}

// NEW: Bulk archive all products - FIXED to upload sequentially
const bulkArchiveAll = async () => {
  if (!canBulkUpload.value) {
    toast({
      description: applyTagToAll.value 
        ? 'Please select a category for all products'
        : 'Please select a category for each product',
      variant: 'destructive'
    })
    return
  }

  const totalProducts = bulkProductsList.value.length
  let successCount = 0
  let failCount = 0

  toast({
    description: `Uploading ${totalProducts} products as archived...`,
  })

  for (let i = 0; i < totalProducts; i++) {
    try {
      await uploadBulkProduct(bulkProductsList.value[i], i, 'archived')
      successCount++
    } catch (error) {
      failCount++
      console.error(`Failed to upload product ${i}:`, error)
    }
  }
  
  // Refresh products and counts ONCE after all uploads complete
  await productsStore.fetchProducts({ vendorId: vendorId.value })
  await productsStore.fetchProductStatusCounts(vendorId.value)
  
  toast({
    description: `Upload complete! ${successCount} archived${failCount > 0 ? `, ${failCount} failed` : ''}`,
    variant: failCount > 0 ? 'destructive' : 'default'
  })
  
  bulkProductsList.value = []
  bulkProductTags.value = {}
  globalBulkTag.value = ''
  applyTagToAll.value = false
  addProductSheetOpen.value = false
  resetForm()
}

// Format TAT for display (convert YYYY-MM-DD to readable format)
const formatTatForDisplay = (tat: string) => {
  if (!tat) return 'N/A'
  
  // If it's already in YYYY-MM-DD format
  if (tat.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const date = new Date(tat)
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    })
  }
  
  return tat
}

// Keep the existing formatTatDate function for backward compatibility
const formatTatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  
  // Check if it's already in a readable format
  if (dateString.includes('mins') || dateString.includes('hours') || dateString.includes('days')) {
    return dateString
  }
  
  // If it's in YYYY-MM-DD format
  if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    })
  }
  
  return dateString
}

// Fetch products, counts, and categories on mount
onMounted(async () => {
  await productsStore.fetchProducts({ vendorId: vendorId.value })
  await productsStore.fetchProductStatusCounts(vendorId.value)
  await fetchCategories()
  
  // Add click outside listeners
  document.addEventListener('click', closeDropdownOnClickOutside)
  document.addEventListener('click', closeActionsMenuOnClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeDropdownOnClickOutside)
  document.removeEventListener('click', closeActionsMenuOnClickOutside)
})
</script>

<template>
  <div class="flex-col flex bg-[#f0f8ff] h-full px-4 sm:px-10 pb-10">
    <MainNav class="mx-6" headingText="Products" />

    <!-- Stats Cards -->
    <div class="w-full grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4 pt-6">
      <Card class="h-[150px] rounded-[24px] bg-[#00C37F] cardShadow1 border-transparent transition-transform transform hover:scale-105">
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#FFFFFF]">Published</p>
            <div class="weeshr-icon2 rounded-[7px]">
              <Check width="24px" height="24px" color="#00C37F" />
            </div>
            <p class="text-2xl lg:text-3xl font-medium text-[#FFFFFF] absolute bottom-2 left-5">
              {{ productsStore.publishedCount }}
            </p>
          </CardContent>
        </div>
      </Card>

      <Card class="h-[150px] rounded-[24px] bg-[#6A70FF] border-transparent transition-transform transform hover:scale-105">
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#ffffff]">Draft</p>
            <ScrollText width="24px" height="24px" color="#ffffff" />
            <p class="text-2xl lg:text-3xl font-medium text-[#FFFFFF] absolute bottom-2 left-5">
              {{ productsStore.draftCount }}
            </p>
          </CardContent>
        </div>
      </Card>

      <Card class="h-[150px] rounded-[24px] bg-[#3A8EE5] border-transparent transition-transform transform hover:scale-105">
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#ffffff]">Archived</p>
            <Archive width="24px" height="24px" color="#ffffff" />
            <p class="text-2xl lg:text-3xl font-medium text-[#FFFFFF] absolute bottom-2 left-5">
              {{ productsStore.archivedCount }}
            </p>
          </CardContent>
        </div>
      </Card>

      <Card class="h-[150px] rounded-[24px] bg-[#DF6C50] border-transparent transition-transform transform hover:scale-105">
        <div class="h-[130px] pt-4 relative rounded-tr-[24px] rounded-tl-[24px]">
          <CardContent class="flex items-center justify-between space-y-0">
            <p class="text-l font-medium text-[#ffffff]">Out of Stock</p>
            <Battery width="24px" height="24px" color="#ffffff" />
            <p class="text-2xl lg:text-3xl font-medium text-[#FFFFFF] absolute bottom-2 left-5">
              {{ productsStore.outOfStockCount }}
            </p>
          </CardContent>
        </div>
      </Card>
    </div>

    <!-- Main Content Card -->
    <Card class="container px-4 pt-6 pb-10 mx-auto sm:px-6 lg:px-8 bg-[#FFFFFF] rounded-2xl mt-14 mb-4">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-4">
        <div class="text-xl sm:text-xl font-bold tracking-tight text-[#020721]">
          Product List
          <p class="text-xs sm:text-sm font-normal text-[#02072199]">
            Details of all products
          </p>
        </div>
        <div class="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <!-- UPDATED: Status Filter Dropdown -->
          <div class="relative" data-status-filter>
            <Button 
              variant="outline" 
              class="flex items-center gap-2 w-full sm:w-auto bg-[#EEEFF5]"
              @click.stop="showStatusFilter = !showStatusFilter"
            >
              <ListFilter class="w-4 h-4"/>
              {{ getStatusFilterDisplay() }}
              <Icon icon="mdi:chevron-down" class="w-4 h-4" />
            </Button>

            <!-- Status Filter Dropdown Menu -->
            <Transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div 
                v-if="showStatusFilter"
                @click.stop
                class="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50"
              >
                <button
                  @click="applyStatusFilter('all')"
                  :class="[
                    'w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 transition-colors',
                    statusFilter === 'all' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  ]"
                >
                  <div class="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                    <Icon v-if="statusFilter === 'all'" icon="mdi:check" class="w-4 h-4 text-blue-600" />
                  </div>
                  <span class="text-sm font-medium">All Status</span>
                </button>
                
                <button
                  @click="applyStatusFilter('published')"
                  :class="[
                    'w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 transition-colors',
                    statusFilter === 'published' ? 'bg-green-50 text-green-600' : 'text-gray-700'
                  ]"
                >
                  <div class="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                    <Icon v-if="statusFilter === 'published'" icon="mdi:check" class="w-4 h-4 text-green-600" />
                  </div>
                  <span class="text-sm font-medium">Published</span>
                </button>

                <button
                  @click="applyStatusFilter('draft')"
                  :class="[
                    'w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 transition-colors',
                    statusFilter === 'draft' ? 'bg-purple-50 text-purple-600' : 'text-gray-700'
                  ]"
                >
                  <div class="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                    <Icon v-if="statusFilter === 'draft'" icon="mdi:check" class="w-4 h-4 text-purple-600" />
                  </div>
                  <span class="text-sm font-medium">Draft</span>
                </button>

                <button
                  @click="applyStatusFilter('archived')"
                  :class="[
                    'w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 transition-colors',
                    statusFilter === 'archived' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  ]"
                >
                  <div class="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                    <Icon v-if="statusFilter === 'archived'" icon="mdi:check" class="w-4 h-4 text-blue-600" />
                  </div>
                  <span class="text-sm font-medium">Archived</span>
                </button>

                <button
                  @click="applyStatusFilter('out-of-stock')"
                  :class="[
                    'w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors',
                    statusFilter === 'out-of-stock' ? 'bg-orange-50 text-orange-600' : 'text-gray-700'
                  ]"
                >
                  <div class="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                    <Icon v-if="statusFilter === 'out-of-stock'" icon="mdi:check" class="w-4 h-4 text-orange-600" />
                  </div>
                  <span class="text-sm font-medium">Out of Stock</span>
                </button>
              </div>
            </Transition>
          </div>

          <Search class="mt-3 lg:mt-0" 
          @search="(query: string) => productsStore.fetchProducts({ search: query })" />
          
          <!-- Add Product Dropdown -->
          <div class="relative" data-add-product-menu>
            <button 
              @click.stop="showAddProductMenu = !showAddProductMenu"
              class="bg-[#020721] px-4 py-2 rounded-xl w-50 h-12 relative"
            >
              <div class="text-base text-[#F8F9FF] text-center flex items-center">
                Add product
                <svg
                  width="20"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="ml-6"
                >
                  <path
                    d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16 12.75H12.75V16C12.75 16.41 12.41 16.75 12 16.75C11.59 16.75 11.25 16.41 11.25 16V12.75H8C7.59 12.75 7.25 12.41 7.25 12C7.25 11.59 7.59 11.25 8 11.25H11.25V8C11.25 7.59 11.59 7.25 12 7.25C12.41 7.25 12.75 7.59 12.75 8V11.25H16C16.41 11.25 16.75 11.59 16.75 12C16.75 12.41 16.41 12.75 16 12.75Z"
                    fill="#F8F9FF"
                  />
                </svg>
              </div>
            </button>

            <!-- Dropdown Menu -->
            <Transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div 
                v-if="showAddProductMenu"
                @click.stop
                class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50"
              >
                <button
                  @click="openSingleProductMode"
                  class="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 transition-colors"
                >
                  <div class="w-8 h-8 rounded-lg bg-[#020721] flex items-center justify-center">
                    <Icon icon="mdi:file-document-outline" class="text-white" width="18" />
                  </div>
                  <span class="text-sm font-medium text-[#020721]">One product</span>
                </button>
                
                <button
                  @click="openBulkProductMode"
                  class="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                >
                  <div class="w-8 h-8 rounded-lg bg-[#020721] flex items-center justify-center">
                    <Icon icon="mdi:folder-multiple-outline" class="text-white" width="18" />
                  </div>
                  <span class="text-sm font-medium text-[#020721]">Bulk Upload</span>
                </button>
              </div>
            </Transition>
          </div>

          <!-- Add Product Sheet -->
          <Sheet v-model:open="addProductSheetOpen" @update:open="(open) => !open && resetForm()">
            <SheetContent length="mid_low" class="flex flex-col space-y-0 overflow-y-scroll">
              <SheetHeader class="flex flex-col items-start px-4 pb-4 border-b">
                <SheetDescription class="text-xs text-muted-foreground">
                  {{ isEditMode ? 'Editing' : 'Draft' }}
                </SheetDescription>
                <h3 class="text-2xl font-medium text-[#020721]">
                  {{ isEditMode ? 'Edit Product' : 'New Product' }}
                </h3>
                <p class="text-sm text-muted-foreground">
                  {{ isEditMode ? 'Last Updated' : 'Drafted Date' }}
                </p>
                <p class="text-sm font-medium text-[#020721]">
                  {{ new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) }}
                </p>
              </SheetHeader>

              <!-- Single Product Form -->
              <div v-if="!bulkUploadMode" class="px-4 py-6 space-y-6">
                <!-- Details Header with Save Button -->
                <div class="flex items-center justify-between mb-4">
                  <h4 class="text-base font-semibold text-[#020721]">Details</h4>
                  <button 
                    @click="handleNext"
                    :disabled="productsStore.loading"
                    class="flex items-center gap-2 px-4 py-2 bg-[#5B68DF] text-white rounded-lg text-sm font-medium hover:bg-[#4a56cc] disabled:opacity-50"
                  >
                    <span v-if="productsStore.loading">{{ isEditMode ? 'Updating...' : 'Creating...' }}</span>
                    <span v-else>Save</span>
                    <Icon icon="mdi:content-save" class="w-4 h-4" />
                  </button>
                </div>

                <!-- Image Upload Section -->
                <div class="grid grid-cols-2 gap-4">
                  <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-[#F0F0FF] flex flex-col items-center justify-center">
                    <div class="w-12 h-12 mb-3 text-[#5B68DF]">
                      <Icon icon="mdi:clock-outline" width="48" height="48" />
                    </div>
                  </div>
                  
                  <div class="flex flex-col justify-center">
                    <p class="text-sm font-medium text-[#020721] mb-1">Upload 1 Product Picture</p>
                    <p class="text-xs text-[#8B8D97] mb-3">Max 10 each, 3MB, Recommended<br/>Format: JPG or PNG</p>
                    <input
                      type="file"
                      accept="image/*"
                      @change="handleImageUpload"
                      class="hidden"
                      id="product-image"
                    />
                    <label 
                      for="product-image"
                      class="text-xs text-[#5B68DF] cursor-pointer hover:underline"
                    >
                      {{ formData.image ? '✓ Image uploaded' : 'Choose file' }}
                    </label>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-3 py-4">
                  <button 
                    @click="formData.status = 'archived'; handleNext()"
                    :disabled="productsStore.loading"
                    class="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-[#020721] hover:bg-gray-50 disabled:opacity-50"
                  >
                    Archive
                  </button>
                  <button 
                    @click="formData.status = 'draft'; handleNext()"
                    :disabled="productsStore.loading"
                    class="flex-1 px-4 py-2.5 bg-[#020721] text-white rounded-lg text-sm font-medium hover:bg-[#020721]/90 disabled:opacity-50"
                  >
                    Draft
                  </button>
                  <button 
                    @click="formData.status = 'published'; handleNext()"
                    :disabled="productsStore.loading"
                    class="flex-1 px-4 py-2.5 bg-[#020721] text-white rounded-lg text-sm font-medium hover:bg-[#020721]/90 disabled:opacity-50"
                  >
                    Publish
                  </button>
                </div>

                <!-- Form Fields -->
                <div class="space-y-4">
                  <div>
                    <label class="text-sm text-[#8B8D97] mb-2 block">Name <span class="text-red-500">*</span></label>
                    <input 
                      v-model="formData.name"
                      type="text"
                      placeholder="Enter product name"
                      class="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#5B68DF] text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label class="text-sm text-[#8B8D97] mb-2 block">Price <span class="text-red-500">*</span></label>
                    <input 
                      v-model="formData.amount"
                      type="number"
                      min="1"
                      placeholder="Enter price"
                      class="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#5B68DF] text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label class="text-sm text-[#8B8D97] mb-2 block">Size</label>
                    <input 
                      v-model="formData.size"
                      type="text"
                      placeholder="Enter size"
                      class="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#5B68DF] text-sm"
                    />
                  </div>

                  <div>
                    <label class="text-sm text-[#8B8D97] mb-2 block">Quantity</label>
                    <input 
                      v-model="formData.qty"
                      type="number"
                      min="1"
                      placeholder="Enter available quantity"
                      class="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#5B68DF] text-sm"
                    />
                  </div>

                  <!-- UPDATED: Tag field as category selector -->
                  <div>
                    <label class="text-sm text-[#8B8D97] mb-2 block">Tag (Category) <span class="text-red-500">*</span></label>
                    <div class="space-y-2">
                      <div v-if="loadingCategories" class="text-sm text-[#8B8D97]">
                        Loading categories...
                      </div>
                      <div v-else class="grid grid-cols-2 gap-2">
                        <div
                          v-for="category in categories"
                          :key="category._id"
                          @click="handleTagSelection(category._id)"
                          :class="[
                            'border rounded-lg p-3 cursor-pointer transition-colors text-sm',
                            formData.tag.includes(category._id)
                              ? 'bg-[#5B68DF] text-white border-[#5B68DF]'
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                          ]"
                        >
                          <div class="flex items-center justify-between">
                            <span>{{ category.name }}</span>
                            <Icon 
                              v-if="formData.tag.includes(category._id)"
                              icon="mdi:check-circle" 
                              class="w-4 h-4" 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <p class="text-xs text-[#8B8D97] mt-2">
                      Select 1 category (required)
                    </p>
                  </div>

                  <div>
                    <label class="text-sm text-[#8B8D97] mb-2 block">Description</label>
                    <div class="relative">
                      <textarea 
                        v-model="formData.description"
                        maxlength="140"
                        rows="3"
                        placeholder="Describe product in 140 characters"
                        class="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#5B68DF] resize-none text-sm"
                      ></textarea>
                      <span class="absolute bottom-2 right-2 text-xs text-[#8B8D97]">
                        {{ formData.description.length }}/140
                      </span>
                    </div>
                  </div>

                  <!-- UPDATED: Delivery TAT as Date Picker -->
                  <div>
                    <label class="text-sm text-[#8B8D97] mb-2 block">Delivery TAT</label>
                    <input 
                      v-model="formData.tat"
                      type="date"
                      placeholder="Select delivery date"
                      class="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#5B68DF] text-sm"
                    />
                    <p class="text-xs text-[#8B8D97] mt-1">
                      Format: YYYY-MM-DD
                    </p>
                  </div>
                </div>

                <!-- Required Fields Notice -->
                <p class="text-xs text-[#8B8D97] pt-2">Fields marked with <span class="text-red-500">*</span> are required</p>
              </div>

              <!-- Bulk Upload Form -->
              <div v-if="bulkUploadMode" class="px-4 py-6 space-y-4">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="text-base font-semibold text-[#020721]">Bulk Upload Details</h4>
                  <button 
                    class="flex items-center gap-2 px-4 py-2 bg-[#5B68DF] text-white rounded-lg text-sm font-medium hover:bg-[#4a56cc]"
                  >
                    <span>Save</span>
                    <Icon icon="mdi:content-save" class="w-4 h-4" />
                  </button>
                </div>
                
                <div class="border rounded-lg p-4 bg-[#F8F9FF]">
                  <div class="flex items-start gap-3 mb-4">
                    <Icon icon="mdi:download" class="text-[#020721] mt-1" width="20" height="20" />
                    <div>
                      <p class="text-sm font-medium text-[#020721]">Download Template</p>
                      <p class="text-xs text-[#8B8D97]">Use our XLSX file for bulk product upload</p>
                    </div>
                  </div>
                  <button @click="downloadTemplate" class="w-full px-4 py-2 bg-white border rounded-lg text-sm hover:bg-gray-50">
                    Download
                  </button>
                </div>

                <div class="border rounded-lg p-4 bg-[#F8F9FF]">
                  <div class="flex items-start gap-3 mb-4">
                    <Icon icon="mdi:upload" class="text-[#020721] mt-1" width="20" height="20" />
                    <div>
                      <p class="text-sm font-medium text-[#020721]">Upload Product</p>
                      <p class="text-xs text-[#8B8D97]">Upload filled version of our product</p>
                    </div>
                  </div>
                  <input type="file" accept=".xlsx,.xls" @change="handleBulkFileUpload" class="hidden" id="bulk-upload" />
                  <label 
                    for="bulk-upload"
                    class="block w-full px-4 py-2 bg-white border rounded-lg text-sm text-center cursor-pointer hover:bg-gray-50"
                  >
                    Choose File
                  </label>
                  <p v-if="bulkUploadFile" class="text-sm text-green-600 mt-2">✓ File uploaded: {{ bulkUploadFile.name }}</p>
                </div>

                <!-- UPDATED: Bulk Products List with Individual Category Selection -->
                <div v-if="bulkProductsList.length > 0" class="space-y-4">
                  <!-- Option to apply same tag to all -->
                  <div class="border rounded-lg p-4 bg-[#F8F9FF]">
                    <div class="flex items-center justify-between mb-3">
                      <div class="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          id="apply-to-all" 
                          v-model="applyTagToAll"
                          class="w-4 h-4 text-[#5B68DF] border-gray-300 rounded focus:ring-[#5B68DF]"
                        />
                        <label for="apply-to-all" class="text-sm font-medium text-[#020721] cursor-pointer">
                          Apply same category to all products
                        </label>
                      </div>
                    </div>

                    <!-- Global category selector (shown when "apply to all" is checked) -->
                    <div v-if="applyTagToAll" class="mt-3">
                      <p class="text-xs text-[#8B8D97] mb-2">Select category for all products:</p>
                      <div v-if="loadingCategories" class="text-sm text-[#8B8D97]">
                        Loading categories...
                      </div>
                      <div v-else class="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
                        <div
                          v-for="category in categories"
                          :key="category._id"
                          @click="globalBulkTag = category._id"
                          :class="[
                            'border rounded-lg p-3 cursor-pointer transition-colors text-sm',
                            globalBulkTag === category._id
                              ? 'bg-[#5B68DF] text-white border-[#5B68DF]'
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                          ]"
                        >
                          <div class="flex items-center justify-between">
                            <span>{{ category.name }}</span>
                            <Icon 
                              v-if="globalBulkTag === category._id"
                              icon="mdi:check-circle" 
                              class="w-4 h-4" 
                            />
                          </div>
                        </div>
                      </div>
                      <p v-if="!globalBulkTag" class="text-xs text-red-500 mt-2">
                        ⚠️ Please select a category
                      </p>
                    </div>

                    <!-- Info message when not applying to all -->
                    <div v-else class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div class="flex items-start gap-2">
                        <Icon icon="mdi:information" class="text-blue-600 mt-0.5" width="16" />
                        <p class="text-xs text-blue-800">
                          You can select a different category for each product below.
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Products List Header -->
                  <div class="flex items-center justify-between">
                    <p class="text-sm font-medium text-[#020721]">Products to Upload ({{ bulkProductsList.length }})</p>
                    <div class="flex gap-2">
                      <button 
                        @click="bulkArchiveAll"
                        :disabled="!canBulkUpload"
                        class="px-3 py-1 bg-white border border-gray-200 text-xs rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Archive all
                      </button>
                      <button 
                        @click="bulkDraftAll"
                        :disabled="!canBulkUpload"
                        class="px-3 py-1 bg-white border border-gray-200 text-xs rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Draft all
                      </button>
                      <button 
                        @click="bulkPublishAll"
                        :disabled="!canBulkUpload"
                        :class="[
                          'px-3 py-1 text-white text-xs rounded-lg',
                          !canBulkUpload
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-[#020721] hover:bg-[#020721]/90'
                        ]"
                      >
                        Publish all
                      </button>
                    </div>
                  </div>

                  <!-- Individual Products List with Category Selection -->
                  <div class="space-y-3 max-h-[500px] overflow-y-auto">
                    <div v-for="(product, index) in bulkProductsList" :key="index" 
                         class="border rounded-lg p-4 bg-white relative">
                      <button 
                        @click="removeBulkProduct(index)"
                        class="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200"
                      >
                        <X class="w-4 h-4 text-red-600" />
                      </button>
                      
                      <div class="flex gap-3 mb-3">
                        <div class="w-16 h-16 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                          <img v-if="product.img" :src="product.img" :alt="product.name" class="w-full h-full object-cover" />
                          <Icon v-else icon="mdi:package-variant" class="w-8 h-8 text-gray-400" />
                        </div>
                        <div class="flex-1">
                          <p class="text-xs text-[#8B8D97] mb-1">Name</p>
                          <p class="text-sm font-medium text-[#020721]">{{ product.name }}</p>
                        </div>
                      </div>

                      <div class="grid grid-cols-2 gap-3 text-xs mb-3">
                        <div>
                          <p class="text-[#8B8D97] mb-1">Price</p>
                          <p class="font-medium text-[#020721]">₦{{ (product.amount || product.price || 0).toLocaleString() }}</p>
                        </div>
                        <div>
                          <p class="text-[#8B8D97] mb-1">Quantity</p>
                          <p class="font-medium text-[#020721]">{{ product.qty || 1 }}</p>
                        </div>
                        <div>
                          <p class="text-[#8B8D97] mb-1">Size</p>
                          <p class="font-medium text-[#020721]">{{ product.size || 'N/A' }}</p>
                        </div>
                        <div>
                          <p class="text-[#8B8D97] mb-1">Delivery TAT</p>
                          <p class="font-medium text-[#020721]">{{ formatTatForDisplay(product.tat) || 'N/A' }}</p>
                        </div>
                      </div>

                      <div class="mb-3">
                        <p class="text-[#8B8D97] text-xs mb-1">Description</p>
                        <p class="text-sm text-[#020721]">{{ product.description || 'No description' }}</p>
                      </div>

                      <!-- Individual Category Selection (only show if NOT applying to all) -->
                      <div v-if="!applyTagToAll" class="mb-3">
                        <p class="text-xs text-[#8B8D97] mb-2">
                          Category (Tag) 
                          <span class="text-red-500">*</span>
                        </p>
                        <div v-if="loadingCategories" class="text-sm text-[#8B8D97]">
                          Loading categories...
                        </div>
                        <div v-else class="grid grid-cols-2 gap-2">
                          <div
                            v-for="category in categories"
                            :key="category._id"
                            @click="bulkProductTags[index] = category._id"
                            :class="[
                              'border rounded-lg p-2 cursor-pointer transition-colors text-xs',
                              bulkProductTags[index] === category._id
                                ? 'bg-[#5B68DF] text-white border-[#5B68DF]'
                                : 'bg-white border-gray-200 hover:bg-gray-50'
                            ]"
                          >
                            <div class="flex items-center justify-between">
                              <span>{{ category.name }}</span>
                              <Icon 
                                v-if="bulkProductTags[index] === category._id"
                                icon="mdi:check-circle" 
                                class="w-3 h-3" 
                              />
                            </div>
                          </div>
                        </div>
                        <p v-if="!bulkProductTags[index]" class="text-xs text-red-500 mt-1">
                          ⚠️ Category required
                        </p>
                      </div>

                      <!-- Category display when applying to all -->
                      <div v-else class="mb-3">
                        <p class="text-xs text-[#8B8D97] mb-1">Category (Tag)</p>
                        <div class="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                          <p class="text-sm text-[#020721]">
                            {{ globalBulkTag ? getCategoryName(globalBulkTag) : 'Select category above' }}
                          </p>
                        </div>
                      </div>

                      <div class="flex gap-2">
                        <button 
                          @click="uploadProductWithStatus(product, index, 'archived')"
                          :disabled="!canUploadProduct(index)"
                          class="flex-1 px-3 py-2 bg-white border border-gray-200 text-xs rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Archive
                        </button>
                        <button 
                          @click="uploadProductWithStatus(product, index, 'draft')"
                          :disabled="!canUploadProduct(index)"
                          class="flex-1 px-3 py-2 bg-white border border-gray-200 text-xs rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Draft
                        </button>
                        <button 
                          @click="uploadProductWithStatus(product, index, 'published')"
                          :disabled="!canUploadProduct(index)"
                          :class="[
                            'flex-1 px-3 py-2 text-white text-xs rounded-lg',
                            !canUploadProduct(index)
                              ? 'bg-gray-400 cursor-not-allowed' 
                              : 'bg-[#020721] hover:bg-[#020721]/90'
                          ]"
                        >
                          Publish
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </SheetContent>
          </Sheet>

          <!-- View Product Sheet -->
          <Sheet v-model:open="viewProductSheetOpen">
            <SheetContent length="mid_low" class="flex flex-col space-y-0 overflow-y-scroll">
              <SheetHeader class="flex flex-col items-start px-4">
                <SheetDescription class="text-xs text-muted-foreground">
                  {{ selectedProduct?.status || 'Draft' }}
                </SheetDescription>
                <h3 class="text-2xl font-medium text-[#020721]">
                  {{ selectedProduct?.name }}
                </h3>
                <p class="text-sm text-muted-foreground">
                  {{ selectedProduct?.createdAt ? new Date(selectedProduct.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '' }}
                </p>
              </SheetHeader>

              <div v-if="selectedProduct" class="px-4 space-y-6">
                <!-- Details Section -->
                <div>
                  <div class="flex items-center justify-between mb-4">
                    <h4 class="text-sm font-semibold text-[#020721]">Details</h4>
                    <button 
                      @click="editProduct"
                      class="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
                    >
                      <Icon icon="mdi:pencil" class="w-4 h-4" />
                      Edit
                    </button>
                  </div>

                  <!-- Product Image -->
                  <div class="w-full h-48 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden mb-4">
                    <img v-if="selectedProduct.image" :src="selectedProduct.image" :alt="selectedProduct.name" class="w-full h-full object-cover" />
                    <Icon v-else icon="mdi:package-variant" class="w-16 h-16 text-gray-400" />
                  </div>

                  <!-- Product Info Grid -->
                  <div class="space-y-3">
                    <div>
                      <p class="text-xs text-[#8B8D97] mb-1">Name</p>
                      <p class="text-sm font-medium text-[#020721]">{{ selectedProduct.name }}</p>
                    </div>

                    <div>
                      <p class="text-xs text-[#8B8D97] mb-1">Price</p>
                      <p class="text-sm font-medium text-[#020721]">{{ productsStore.formatPrice(selectedProduct.amount || 0) }}</p>
                    </div>

                    <div>
                      <p class="text-xs text-[#8B8D97] mb-1">Size</p>
                      <p class="text-sm font-medium text-[#020721]">{{ selectedProduct.size || 'N/A' }}</p>
                    </div>

                    <div>
                      <p class="text-xs text-[#8B8D97] mb-1">Quantity</p>
                      <p class="text-sm font-medium text-[#020721]">{{ selectedProduct.qty  || 0 }}</p>
                    </div>

                    <!-- UPDATED: Show category names instead of IDs -->
                    <div>
                      <p class="text-xs text-[#8B8D97] mb-1">Tags (Categories)</p>
                      <div class="flex flex-wrap gap-2">
                        <span 
                          v-for="tagId in (selectedProduct.tag || [])" 
                          :key="tagId" 
                          class="px-2 py-1 bg-gray-100 rounded text-xs text-[#020721]"
                        >
                          {{ getCategoryName(tagId) }}
                        </span>
                        <span v-if="!selectedProduct.tag?.length" class="text-sm text-[#020721]">
                          No tags
                        </span>
                      </div>
                    </div>

                    <div>
                      <p class="text-xs text-[#8B8D97] mb-1">Description</p>
                      <p class="text-sm text-[#020721]">{{ selectedProduct.description || 'No description' }}</p>
                    </div>

                    <div>
                      <p class="text-xs text-[#8B8D97] mb-1">Delivery TAT</p>
                      <p class="text-sm font-medium text-[#020721]">{{ selectedProduct.tat  || 'N/A' }}</p>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-2 pb-4">
                  <button 
                    @click="updateProductStatus('archived')"
                    class="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
                  >
                    Archive
                  </button>
                  <button 
                    @click="updateProductStatus('draft')"
                    class="flex-1 px-4 py-2 bg-[#020721] text-white rounded-lg text-sm hover:bg-[#020721]/90"
                  >
                    Draft
                  </button>
                  <button 
                    @click="updateProductStatus('published')"
                    class="flex-1 px-4 py-2 bg-[#020721] text-white rounded-lg text-sm hover:bg-[#020721]/90"
                  >
                    Publish
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="productsStore.loading && productsStore.products.length === 0" class="flex items-center justify-center py-10">
        <Icon icon="eos-icons:loading" class="w-8 h-8 text-[#020721]" />
      </div>

      <!-- Table -->
      <div v-else class="overflow-auto bg-white rounded-lg">
        <Table class="lg:w-full w-[800px]">
          <TableHeader>
            <TableRow class="text-xs sm:text-sm text-[#8B8D97] font-medium border-b border-gray-200">
              <TableHead class="font-medium">Picture</TableHead>
              <TableHead class="font-medium cursor-pointer hover:bg-gray-50" @click="sortBy('name')">
                <div class="flex items-center gap-1">
                  Name
                  <Icon icon="fluent:chevron-up-down-20-regular" class="w-4 h-4" />
                </div>
              </TableHead>
              <TableHead class="font-medium">Description</TableHead>
              <TableHead class="font-medium cursor-pointer hover:bg-gray-50" @click="sortBy('amount')">
                <div class="flex items-center gap-1">
                  Amount
                  <Icon icon="fluent:chevron-up-down-20-regular" class="w-4 h-4" />
                </div>
              </TableHead>
              <TableHead class="font-medium">
                <div class="flex items-center gap-1">
                  Delivery TAT
                  <Icon icon="fluent:chevron-up-down-20-regular" class="w-4 h-4" />
                </div>
              </TableHead>
              <TableHead class="font-medium cursor-pointer hover:bg-gray-50" @click="sortBy('quantity')">
                <div class="flex items-center gap-1">
                  Avail. Qty
                  <Icon icon="fluent:chevron-up-down-20-regular" class="w-4 h-4" />
                </div>
              </TableHead>
              <TableHead class="font-medium">Status</TableHead>
              <TableHead class="font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="product in productsStore.products" :key="product._id" class="border-b border-gray-100 hover:bg-gray-50">
              <TableCell class="py-4">
                <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img v-if="product.image" :src="product.image" :alt="product.name" class="w-full h-full object-cover" />
                  <Icon v-else icon="mdi:package-variant" class="w-6 h-6 text-gray-400" />
                </div>
              </TableCell>
              <TableCell class="text-sm font-medium text-[#020721]">{{ product.name }}</TableCell>
              <TableCell class="text-sm text-[#8B8D97] max-w-[200px] truncate">{{ product.description || 'No description' }}</TableCell>
              <TableCell class="text-sm font-medium text-[#020721]">{{ productsStore.formatPrice(product.amount || 0) }}</TableCell>
              <TableCell class="text-sm text-[#8B8D97]">{{ product.tat ||'N/A' }}</TableCell>
              <TableCell class="text-sm text-[#8B8D97] text-center">{{ product.qty  || 0 }}</TableCell>
              <TableCell>
                <div
                  :class="statusBg(product.status)"
                  class="rounded-full w-fit px-3 py-1 text-white text-xs font-medium capitalize"
                >
                  {{ productsStore.formatStatus(product.status) }}
                </div>
              </TableCell>
              <TableCell>
                <!-- Actions Dropdown Menu -->
                <div class="relative">
                  <button 
                    @click.stop="showActionsMenu = showActionsMenu === product._id ? null : product._id"
                    class="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors"
                    title="Product Actions"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 10.8333C10.4602 10.8333 10.8333 10.4602 10.8333 10C10.8333 9.53976 10.4602 9.16667 10 9.16667C9.53976 9.16667 9.16667 9.53976 9.16667 10C9.16667 10.4602 9.53976 10.8333 10 10.8333Z"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M10 5C10.4602 5 10.8333 4.6269 10.8333 4.16667C10.8333 3.70643 10.4602 3.33333 10 3.33333C9.53976 3.33333 9.16667 3.70643 9.16667 4.16667C9.16667 4.6269 9.53976 5 10 5Z"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M10 16.6667C10.4602 16.6667 10.8333 16.2936 10.8333 15.8333C10.8333 15.3731 10.4602 15 10 15C9.53976 15 9.16667 15.3731 9.16667 15.8333C9.16667 16.2936 9.53976 16.6667 10 16.6667Z"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>

                  <!-- Actions Dropdown Menu -->
                  <Transition
                    enter-active-class="transition ease-out duration-100"
                    enter-from-class="transform opacity-0 scale-95"
                    enter-to-class="transform opacity-100 scale-100"
                    leave-active-class="transition ease-in duration-75"
                    leave-from-class="transform opacity-100 scale-100"
                    leave-to-class="transform opacity-0 scale-95"
                  >
                    <div 
                      v-if="showActionsMenu === product._id"
                      @click.stop
                      class="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50"
                    >
                      <button
                        @click="viewProductDetails(product._id); showActionsMenu = null"
                        class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700 transition-colors"
                      >
                        <Icon icon="mdi:eye-outline" class="w-4 h-4" />
                        View
                      </button>
                      <button
                        @click="editProductFromList(product); showActionsMenu = null"
                        class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700 transition-colors"
                      >
                        <Icon icon="mdi:pencil-outline" class="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        @click="deleteProduct(product._id); showActionsMenu = null"
                        class="w-full px-4 py-2 text-left hover:bg-red-50 flex items-center gap-2 text-sm text-red-600 transition-colors border-t border-gray-100"
                      >
                        <Icon icon="mdi:delete-outline" class="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </Transition>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <!-- Pagination -->
      <div class="flex gap-2 max-w-full flex-wrap justify-end mt-8 mr-4 items-center text-[15px]">
        <Button 
          variant="secondary" 
          @click="changePage(productsStore.pagination.currentPage - 1)"
          :disabled="productsStore.pagination.currentPage === 1"
        > 
          <Icon icon="radix-icons:chevron-left" /> 
        </Button>
        <Button 
          v-for="page in visiblePages" 
          :key="page"
          :variant="page === productsStore.pagination.currentPage ? 'secondary' : 'outline'"
          :class="page === productsStore.pagination.currentPage ? 'bg-[#020721] text-gray-400' : ''"
          @click="changePage(page)"
        > 
          {{ page === '...' ? '&#8230;' : page }}
        </Button>
        <Button 
          variant="outline" 
          @click="changePage(productsStore.pagination.currentPage + 1)"
          :disabled="productsStore.pagination.currentPage === productsStore.pagination.totalPages"
        > 
          <Icon icon="radix-icons:chevron-right" /> 
        </Button>
        <a href="#"><p class="text-[blue]">See all</p></a>
      </div>
    </Card>
    <DashboardFooter />
  </div>
</template>

<style scoped>
.cardShadow1 {
  box-shadow:
    0px 31px 30px -23px #dddcdc,
    inset 0px -23px 20px -23px rgba(0, 0, 0, 0.25);
}

.cardShadow2 {
  box-shadow:
    0px 31px 30px -23px #00c37f,
    inset 0px -23px 20px -23px rgba(0, 0, 0, 0.25);
}

.cardShadow3 {
  box-shadow:
    0px 31px 30px -23px #ee9f39,
    inset 0px -23px 30px -23px rgba(0, 0, 0, 0.25);
}

.cardShadow4 {
  box-shadow:
    0px 31px 30px -23px #e45044,
    inset 0px -23px 20px -23px rgba(0, 0, 0, 0.25);
}

.weeshr-icon1 {
  background-color: black;
}

.weeshr-icon2 {
  background-color: white;
}
</style>