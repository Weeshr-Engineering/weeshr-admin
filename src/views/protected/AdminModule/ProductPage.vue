<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import VendorNav from '@/components/VendorNav.vue'
import DashboardFooter from '@/components/DashboardFooter.vue'
import Search from '@/components/UseSearch.vue'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'
import * as XLSX from 'xlsx'
import { ListFilter } from 'lucide-vue-next'
import { useProductsStore } from '@/stores/vendor/product'
import { useSuperAdminStore } from '@/stores/super-admin/super-admin'
import { useToast } from '@/components/ui/toast'
import type { Product } from '@/stores/vendor/product'
import axios from 'axios'
import { useRoute } from 'vue-router'

// Import product components
import {
  ProductStatusCards,
  ProductsTable,
  ProductFormSheet,
  BulkUploadSheet,
  ViewProductSheet,
  DeleteProductDialog
} from '@/components/products'

const productsStore = useProductsStore()
const superAdminStore = useSuperAdminStore()
const { toast } = useToast()
const route = useRoute()

// Get vendorId from superadmin store
const vendorId = computed(() => superAdminStore.vendorId)

// Categories state
const categories = ref<{ _id: string; name: string }[]>([])
const loadingCategories = ref(false)

// Status filter state
const statusFilter = ref('all')
const showStatusFilter = ref(false)

// Delete modal state
const deleteModalOpen = ref(false)
const productToDelete = ref<Product | null>(null)

const searchQuery = ref('')

// Sheet states
const addProductSheetOpen = ref(false)
const viewProductSheetOpen = ref(false)
const showAddProductMenu = ref(false)
const bulkUploadMode = ref(false)
const selectedProduct = ref<Product | null>(null)
const bulkUploadFile = ref<File | null>(null)
const bulkProductsList = ref<any[]>([])

// Actions dropdown state
const showActionsMenu = ref<string | null>(null)

// Form data
const formData = ref({
  name: '',
  description: '',
  amount: '',
  qty: '1',
  tat: '',
  size: '',
  tag: [] as string[],
  images: [] as File[],
  status: 'draft' as 'published' | 'draft' | 'archived' | 'out-of-stock'
})

// Edit mode
const isEditMode = ref(false)
const editingProductId = ref<string | null>(null)

// Bulk upload states
const bulkProductTags = ref<Record<number, string>>({})
const applyTagToAll = ref(false)
const globalBulkTag = ref<string>('')

// Function to convert delivery time to YYYY-MM-DD format
const convertDeliveryTimeToDate = (deliveryTime: string | number): string => {
  if (!deliveryTime && deliveryTime !== 0) return ''

  const today = new Date()

  if (typeof deliveryTime === 'number') {
    const days = Math.floor(deliveryTime)
    if (days >= 0) {
      today.setDate(today.getDate() + days)
      return today.toISOString().split('T')[0]
    }
    return ''
  }

  const normalized = deliveryTime.toString().trim().toLowerCase()
  if (!normalized) return ''

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (dateRegex.test(normalized)) {
    return normalized
  }

  const pureNumber = parseInt(normalized, 10)
  if (!isNaN(pureNumber) && normalized === pureNumber.toString()) {
    today.setDate(today.getDate() + pureNumber)
    return today.toISOString().split('T')[0]
  }

  const cleanedInput = normalized.replace(/\s+/g, ' ').trim()

  if (
    cleanedInput === 'same day' ||
    cleanedInput === 'sameday' ||
    cleanedInput === 'today' ||
    cleanedInput === '0 days' ||
    cleanedInput === '0 day'
  ) {
    return today.toISOString().split('T')[0]
  }

  const match = cleanedInput.match(/^(\d+)\s*(day|days|week|weeks|month|months)?$/i)

  if (match) {
    const num = parseInt(match[1], 10)
    const unit = (match[2] || 'day').toLowerCase()

    if (unit === 'day' || unit === 'days' || unit === '') {
      today.setDate(today.getDate() + num)
      return today.toISOString().split('T')[0]
    } else if (unit === 'week' || unit === 'weeks') {
      today.setDate(today.getDate() + num * 7)
      return today.toISOString().split('T')[0]
    } else if (unit === 'month' || unit === 'months') {
      today.setMonth(today.getMonth() + num)
      return today.toISOString().split('T')[0]
    }
  }

  const parsedDate = new Date(deliveryTime)
  if (!isNaN(parsedDate.getTime())) {
    return parsedDate.toISOString().split('T')[0]
  }

  console.warn(`Could not parse TAT value: "${deliveryTime}"`)
  return ''
}

// Fetch categories from API
const fetchCategories = async () => {
  loadingCategories.value = true
  try {
    const response = await axios.get('/api/v1/admin/market/categories')
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
  } finally {
    loadingCategories.value = false
  }
}

// Apply status filter
const applyStatusFilter = (status: string) => {
  statusFilter.value = status
  showStatusFilter.value = false

  if (status === 'all') {
    productsStore.fetchProducts({ vendorId: vendorId.value })
  } else {
    productsStore.fetchProducts({ vendorId: vendorId.value, status })
  }
}

// Get display name for status filter
const getStatusFilterDisplay = () => {
  switch (statusFilter.value) {
    case 'all':
      return 'All'
    case 'published':
      return 'Published'
    case 'draft':
      return 'Draft'
    case 'archived':
      return 'Archived'
    case 'out-of-stock':
      return 'Out of Stock'
    default:
      return 'All'
  }
}

// Handle search
const handleSearch = (query: string) => {
  searchQuery.value = query
  productsStore.fetchProducts({
    vendorId: vendorId.value,
    search: query,
    ...(statusFilter.value !== 'all' && { status: statusFilter.value })
  })
}

// Open delete confirmation modal
const openDeleteModal = (product: Product) => {
  productToDelete.value = product
  deleteModalOpen.value = true
  showActionsMenu.value = null
}

// Confirm delete product
const confirmDeleteProduct = async () => {
  if (!productToDelete.value) return

  try {
    await productsStore.deleteProduct(productToDelete.value._id)
    toast({
      title: 'Success!',
      description: 'Product deleted successfully!',
      variant: 'default'
    })

    if (selectedProduct.value?._id === productToDelete.value._id) {
      viewProductSheetOpen.value = false
      selectedProduct.value = null
    }

    deleteModalOpen.value = false
    productToDelete.value = null
  } catch (error: any) {
    console.error('Delete product error:', error)
    const errorMessage =
      error.response?.data?.message || 'Error deleting product. Please try again.'
    toast({
      title: 'Error',
      description: errorMessage,
      variant: 'destructive'
    })
  }
}

// Open single product mode
const openSingleProductMode = () => {
  bulkUploadMode.value = false
  showAddProductMenu.value = false
  addProductSheetOpen.value = true
}

// Open bulk product mode
const openBulkProductMode = () => {
  bulkUploadMode.value = true
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

    const data = await file.arrayBuffer()
    const workbook = XLSX.read(data, { type: 'array' })

    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]

    const jsonData = XLSX.utils.sheet_to_json(worksheet)

    bulkProductsList.value = jsonData.map((row: any) => {
      const rawTat = row.tat ?? row.TAT ?? ''
      const tatValue = typeof rawTat === 'string' ? rawTat : String(rawTat)

      // Handle images - can be comma-separated string or single URL
      const rawImages =
        row.images || row.Images || row.img || row.Img || row.image || row.Image || ''
      const imagesArray =
        typeof rawImages === 'string'
          ? rawImages
              .split(',')
              .map((url: string) => url.trim())
              .filter(Boolean)
          : []

      return {
        name: row.name || row.Name || '',
        amount: Number(row.amount || row.Amount || row.price || row.Price || 0),
        qty: Number(row.qty || row.Qty || row.quantity || row.Quantity || 1),
        tat: tatValue,
        description: row.description || row.Description || '',
        // Store first image for preview, but keep full array
        img: imagesArray[0] || '',
        images: imagesArray
      }
    })

    toast({
      description: `${bulkProductsList.value.length} products loaded successfully!`
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

// Upload bulk product
const uploadBulkProduct = async (
  product: any,
  productIndex: number,
  status: string = 'published'
) => {
  try {
    let productTag: string
    if (applyTagToAll.value) {
      productTag = globalBulkTag.value
    } else {
      productTag = bulkProductTags.value[productIndex]
    }

    if (!productTag) {
      toast({
        description: 'Please select a category (tag) for this product',
        variant: 'destructive'
      })
      throw new Error('No category selected')
    }

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

    data.append('tag', productTag)

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
    throw error
  }
}

// Remove bulk product from list
const removeBulkProduct = (index: number) => {
  bulkProductsList.value.splice(index, 1)
  const newTags: Record<number, string> = {}
  Object.keys(bulkProductTags.value).forEach((key) => {
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
  try {
    const templateData = [
      ['name', 'amount', 'qty', 'tat', 'description', 'images'],
      [
        'Sample Product 1',
        5000,
        10,
        '2 days',
        'Sample description',
        'https://example.com/image1.jpg,https://example.com/image2.jpg'
      ],
      ['Sample Product 2', 8500, 5, '1 week', 'Another sample', 'https://example.com/image3.jpg']
    ]

    const worksheet = XLSX.utils.aoa_to_sheet(templateData)
    worksheet['!cols'] = [
      { wch: 25 },
      { wch: 12 },
      { wch: 8 },
      { wch: 15 },
      { wch: 40 },
      { wch: 50 }
    ]

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products')

    const today = new Date()
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    const fileName = `product_upload_template_${dateStr}.xlsx`

    XLSX.writeFile(workbook, fileName)

    toast({
      title: 'Success!',
      description: 'Template downloaded successfully!',
      variant: 'default'
    })
  } catch (error) {
    console.error('Error creating template:', error)
    toast({
      title: 'Error',
      description: 'Failed to download template. Please try again.',
      variant: 'destructive'
    })
  }
}

// Handle images upload (multiple files)
const handleImagesUpload = (files: File[]) => {
  formData.value.images = files
}

// Handle form submit
const handleFormSubmit = async (status: 'published' | 'draft' | 'archived' | 'out-of-stock') => {
  formData.value.status = status

  if (!formData.value.name || !formData.value.amount) {
    toast({
      description: 'Please fill Name and Price fields',
      variant: 'destructive'
    })
    return
  }

  if (formData.value.tag.length === 0) {
    toast({
      description: 'Please select a category',
      variant: 'destructive'
    })
    return
  }

  const tatDate = convertDeliveryTimeToDate(formData.value.tat)

  try {
    let data = new FormData()
    data.append('name', formData.value.name)
    data.append('description', formData.value.description || '')
    data.append('amount', formData.value.amount.toString())
    data.append('tat', tatDate || '')
    data.append('qty', formData.value.qty.toString())
    data.append('status', formData.value.status)
    data.append('vendorId', vendorId.value)

    if (formData.value.size) {
      data.append('size', formData.value.size)
    }

    if (formData.value.tag && formData.value.tag.length > 0) {
      data.append('tag', formData.value.tag.join(','))
    }

    // Append multiple images
    if (formData.value.images && formData.value.images.length > 0) {
      formData.value.images.forEach((file) => {
        data.append('images', file)
      })
    }

    if (isEditMode.value && editingProductId.value) {
      await productsStore.updateProduct(editingProductId.value, data)
      toast({
        title: 'Success!',
        description: 'Product updated successfully!',
        variant: 'default'
      })
    } else {
      await productsStore.createProduct(data)
      toast({
        title: 'Success!',
        description: 'Product created successfully!',
        variant: 'default'
      })
    }

    resetForm()
    addProductSheetOpen.value = false

    await productsStore.fetchProducts({ vendorId: vendorId.value })
    await productsStore.fetchProductStatusCounts(vendorId.value)
  } catch (error: any) {
    console.error('Product error:', error)
    const errorMessage = error.response?.data?.message || 'Error saving product. Please try again.'
    toast({
      title: 'Error',
      description: errorMessage,
      variant: 'destructive'
    })
  }
}

// Reset form
const resetForm = () => {
  bulkUploadMode.value = false
  bulkUploadFile.value = null
  bulkProductsList.value = []
  bulkProductTags.value = {}
  applyTagToAll.value = false
  globalBulkTag.value = ''
  isEditMode.value = false
  editingProductId.value = null
  formData.value = {
    name: '',
    description: '',
    amount: '',
    qty: '1',
    tat: '',
    size: '',
    tag: [],
    images: [],
    status: 'draft'
  }
}

// View product details
const viewProductDetails = (id: string) => {
  const product = productsStore.products.find((p) => p._id === id)
  if (product) {
    selectedProduct.value = product
    viewProductSheetOpen.value = true
  }
}

// Edit product
const editProduct = () => {
  if (!selectedProduct.value) return

  isEditMode.value = true
  editingProductId.value = selectedProduct.value._id
  bulkUploadMode.value = false

  formData.value = {
    name: selectedProduct.value.name,
    description: selectedProduct.value.description || '',
    amount: selectedProduct.value.amount?.toString() || '',
    qty: selectedProduct.value.qty?.toString() || '1',
    tat: selectedProduct.value.tat || '',
    size: selectedProduct.value.size || '',
    tag: selectedProduct.value.tag || [],
    images: [],
    status: selectedProduct.value.status
  }

  viewProductSheetOpen.value = false
  addProductSheetOpen.value = true
}

// Edit product from list
const editProductFromList = (product: Product) => {
  isEditMode.value = true
  editingProductId.value = product._id
  bulkUploadMode.value = false

  formData.value = {
    name: product.name,
    description: product.description || '',
    amount: product.amount?.toString() || '',
    qty: product.qty?.toString() || '1',
    tat: product.tat || '',
    size: product.size || '',
    tag: product.tag || [],
    images: [],
    status: product.status
  }

  addProductSheetOpen.value = true
}

// Get category name by ID
const getCategoryName = (categoryId: string) => {
  const category = categories.value.find((cat) => cat._id === categoryId)
  return category ? category.name : 'Unknown Category'
}

// Sort by field
const sortBy = (field: string) => {
  productsStore.fetchProducts({ vendorId: vendorId.value, sortBy: field })
}

// Change page
const changePage = (page: number | string) => {
  if (typeof page === 'string') return
  productsStore.fetchProducts({ vendorId: vendorId.value, page })
}

// Update product status
const updateProductStatus = async (status: 'published' | 'draft' | 'archived' | 'out-of-stock') => {
  if (!selectedProduct.value) return

  try {
    await productsStore.updateProduct(selectedProduct.value._id, {
      status,
      vendorId: vendorId.value
    })
    selectedProduct.value.status = status

    toast({
      description: `Product ${status} successfully!`
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

// Upload product with status
const uploadProductWithStatus = async (
  product: any,
  index: number,
  status: 'published' | 'draft' | 'archived'
) => {
  const canUpload = applyTagToAll.value ? !!globalBulkTag.value : !!bulkProductTags.value[index]

  if (!canUpload) {
    toast({
      description: 'Please select a category for this product',
      variant: 'destructive'
    })
    return
  }

  try {
    await uploadBulkProduct(product, index, status)

    bulkProductsList.value.splice(index, 1)

    const newTags: Record<number, string> = {}
    Object.keys(bulkProductTags.value).forEach((key) => {
      const idx = Number(key)
      if (idx < index) {
        newTags[idx] = bulkProductTags.value[idx]
      } else if (idx > index) {
        newTags[idx - 1] = bulkProductTags.value[idx]
      }
    })
    bulkProductTags.value = newTags

    if (bulkProductsList.value.length === 0) {
      addProductSheetOpen.value = false
      resetForm()
    }

    await productsStore.fetchProducts({ vendorId: vendorId.value })
    await productsStore.fetchProductStatusCounts(vendorId.value)
  } catch (error) {
    // Error already handled
  }
}

// Helper to prepare products for bulk upload
const prepareBulkProducts = () => {
  return bulkProductsList.value.map((product) => ({
    name: product.name,
    description: product.description || '',
    images: product.images || (product.img ? [product.img] : []),
    amount: Number(product.amount) || 0,
    tat: product.tat || '',
    qty: Number(product.qty) || 1
  }))
}

// Bulk publish all using new bulk endpoint
const bulkPublishAll = async () => {
  if (bulkProductsList.value.length === 0) {
    toast({
      description: 'No products to upload',
      variant: 'destructive'
    })
    return
  }

  const totalProducts = bulkProductsList.value.length

  toast({
    description: `Uploading ${totalProducts} products...`
  })

  try {
    const products = prepareBulkProducts()
    const result = await productsStore.bulkUploadProducts(products, 'published')

    await productsStore.fetchProducts({ vendorId: vendorId.value })
    await productsStore.fetchProductStatusCounts(vendorId.value)

    toast({
      title: 'Success!',
      description: result.message || `${totalProducts} products uploaded successfully!`,
      variant: 'default'
    })

    bulkProductsList.value = []
    bulkProductTags.value = {}
    globalBulkTag.value = ''
    applyTagToAll.value = false
    addProductSheetOpen.value = false
    resetForm()
  } catch (error: any) {
    console.error('Bulk upload error:', error)
    const errorMessage =
      error.response?.data?.message || 'Error uploading products. Please try again.'
    toast({
      title: 'Error',
      description: errorMessage,
      variant: 'destructive'
    })
  }
}

// Bulk draft all - uses same endpoint (status handled by backend or not needed)
const bulkDraftAll = async () => {
  if (bulkProductsList.value.length === 0) {
    toast({
      description: 'No products to upload',
      variant: 'destructive'
    })
    return
  }

  const totalProducts = bulkProductsList.value.length

  toast({
    description: `Uploading ${totalProducts} products as draft...`
  })

  try {
    const products = prepareBulkProducts()
    const result = await productsStore.bulkUploadProducts(products, 'draft')

    await productsStore.fetchProducts({ vendorId: vendorId.value })
    await productsStore.fetchProductStatusCounts(vendorId.value)

    toast({
      title: 'Success!',
      description: result.message || `${totalProducts} products drafted successfully!`,
      variant: 'default'
    })

    bulkProductsList.value = []
    bulkProductTags.value = {}
    globalBulkTag.value = ''
    applyTagToAll.value = false
    addProductSheetOpen.value = false
    resetForm()
  } catch (error: any) {
    console.error('Bulk upload error:', error)
    const errorMessage =
      error.response?.data?.message || 'Error uploading products. Please try again.'
    toast({
      title: 'Error',
      description: errorMessage,
      variant: 'destructive'
    })
  }
}

// Bulk archive all - uses same endpoint
const bulkArchiveAll = async () => {
  if (bulkProductsList.value.length === 0) {
    toast({
      description: 'No products to upload',
      variant: 'destructive'
    })
    return
  }

  const totalProducts = bulkProductsList.value.length

  toast({
    description: `Uploading ${totalProducts} products as archived...`
  })

  try {
    const products = prepareBulkProducts()
    const result = await productsStore.bulkUploadProducts(products, 'archived')

    await productsStore.fetchProducts({ vendorId: vendorId.value })
    await productsStore.fetchProductStatusCounts(vendorId.value)

    toast({
      title: 'Success!',
      description: result.message || `${totalProducts} products archived successfully!`,
      variant: 'default'
    })

    bulkProductsList.value = []
    bulkProductTags.value = {}
    globalBulkTag.value = ''
    applyTagToAll.value = false
    addProductSheetOpen.value = false
    resetForm()
  } catch (error: any) {
    console.error('Bulk upload error:', error)
    const errorMessage =
      error.response?.data?.message || 'Error uploading products. Please try again.'
    toast({
      title: 'Error',
      description: errorMessage,
      variant: 'destructive'
    })
  }
}

// Format TAT for display - show as "2 days", "1 day", etc.
const formatTatForDisplay = (tat: string) => {
  if (!tat) return 'N/A'

  // If it's already a friendly format like "2 Days", "1 Week", return as-is
  if (!tat.includes('T') && !tat.includes('-')) {
    return tat
  }

  try {
    // Parse the date
    let tatDate: Date
    if (tat.includes('T')) {
      tatDate = new Date(tat)
    } else if (tat.match(/^\d{4}-\d{2}-\d{2}$/)) {
      tatDate = new Date(tat + 'T00:00:00')
    } else {
      return tat
    }

    // Check if valid date
    if (isNaN(tatDate.getTime())) {
      return tat
    }

    // Calculate difference in days from today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    tatDate.setHours(0, 0, 0, 0)

    const diffTime = tatDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays <= 0) {
      return 'Same Day'
    } else if (diffDays === 1) {
      return '1 Day'
    } else if (diffDays < 7) {
      return `${diffDays} Days`
    } else if (diffDays === 7) {
      return '1 Week'
    } else if (diffDays < 14) {
      return `${diffDays} Days`
    } else if (diffDays === 14) {
      return '2 Weeks'
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} Weeks`
    } else if (diffDays < 60) {
      return '1 Month'
    } else {
      return `${Math.floor(diffDays / 30)} Months`
    }
  } catch {
    return tat
  }
}

// Fetch products, counts, and categories on mount
onMounted(async () => {
  const open = route.query.open
  if (open === 'true') {
    openSingleProductMode()
  }

  await productsStore.fetchProducts({ vendorId: vendorId.value })
  await productsStore.fetchProductStatusCounts(vendorId.value)
  await fetchCategories()

  document.addEventListener('click', closeDropdownOnClickOutside)
  document.addEventListener('click', closeActionsMenuOnClickOutside)
})

watch(
  () => route.query.open,
  (newVal) => {
    if (newVal === 'true') {
      openSingleProductMode()
    }
  }
)

onBeforeUnmount(() => {
  document.removeEventListener('click', closeDropdownOnClickOutside)
  document.removeEventListener('click', closeActionsMenuOnClickOutside)
})
</script>

<template>
  <div class="flex-col flex bg-[#f0f8ff] h-full px-4 sm:px-10 pb-10">
    <VendorNav class="mx-6" headingText="Products" />

    <!-- Status Cards -->
    <ProductStatusCards
      :publishedCount="productsStore.publishedCount"
      :draftCount="productsStore.draftCount"
      :archivedCount="productsStore.archivedCount"
      :outOfStockCount="productsStore.outOfStockCount"
    />

    <!-- Main Content Card -->
    <Card class="m-0 py-6 rounded-[24px] w-full mt-6">
      <!-- Header with search and filters -->
      <div class="flex flex-row flex-wrap gap-4 items-center justify-between px-6">
        <div class="flex gap-4 items-center flex-wrap">
          <Search @search="handleSearch" />

          <!-- Status Filter Dropdown -->
          <div class="relative">
            <Button
              data-status-filter
              @click="showStatusFilter = !showStatusFilter"
              variant="outline"
              class="flex items-center gap-2"
            >
              <ListFilter class="w-4 h-4" />
              {{ getStatusFilterDisplay() }}
            </Button>

            <div
              v-if="showStatusFilter"
              class="absolute top-full mt-2 left-0 bg-white border rounded-lg shadow-lg py-2 z-50 min-w-[150px]"
            >
              <button
                @click="applyStatusFilter('all')"
                :class="[
                  'w-full px-4 py-2 text-left hover:bg-gray-50 text-sm',
                  statusFilter === 'all' ? 'bg-gray-100 font-medium' : ''
                ]"
              >
                All
              </button>
              <button
                @click="applyStatusFilter('published')"
                :class="[
                  'w-full px-4 py-2 text-left hover:bg-gray-50 text-sm',
                  statusFilter === 'published' ? 'bg-gray-100 font-medium' : ''
                ]"
              >
                Published
              </button>
              <button
                @click="applyStatusFilter('draft')"
                :class="[
                  'w-full px-4 py-2 text-left hover:bg-gray-50 text-sm',
                  statusFilter === 'draft' ? 'bg-gray-100 font-medium' : ''
                ]"
              >
                Draft
              </button>
              <button
                @click="applyStatusFilter('archived')"
                :class="[
                  'w-full px-4 py-2 text-left hover:bg-gray-50 text-sm',
                  statusFilter === 'archived' ? 'bg-gray-100 font-medium' : ''
                ]"
              >
                Archived
              </button>
              <button
                @click="applyStatusFilter('out-of-stock')"
                :class="[
                  'w-full px-4 py-2 text-left hover:bg-gray-50 text-sm',
                  statusFilter === 'out-of-stock' ? 'bg-gray-100 font-medium' : ''
                ]"
              >
                Out of Stock
              </button>
            </div>
          </div>
        </div>

        <!-- Add Product Dropdown -->
        <div class="relative">
          <Button
            data-add-product-menu
            @click="showAddProductMenu = !showAddProductMenu"
            class="bg-[#020721] text-white hover:bg-[#020721]/90"
          >
            <Icon icon="mdi:plus" class="w-4 h-4 mr-2" />
            Add Product
          </Button>

          <div
            v-if="showAddProductMenu"
            class="absolute top-full mt-2 right-0 bg-white border rounded-lg shadow-lg py-2 z-50 min-w-[180px]"
          >
            <button
              @click="openSingleProductMode"
              class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm"
            >
              <Icon icon="mdi:plus-circle-outline" class="w-4 h-4" />
              Add Single Product
            </button>
            <button
              @click="openBulkProductMode"
              class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm"
            >
              <Icon icon="mdi:upload-multiple" class="w-4 h-4" />
              Bulk Upload
            </button>
          </div>
        </div>
      </div>

      <!-- Products Table -->
      <div class="px-6 mt-6">
        <ProductsTable
          :products="productsStore.products"
          :pagination="productsStore.pagination"
          :loading="productsStore.loading"
          :formatPrice="productsStore.formatPrice"
          :formatStatus="productsStore.formatStatus"
          :formatTat="formatTatForDisplay"
          :activeActionsMenu="showActionsMenu"
          @view="viewProductDetails"
          @edit="editProductFromList"
          @delete="openDeleteModal"
          @sort="sortBy"
          @changePage="changePage"
          @toggleActionsMenu="showActionsMenu = $event"
        />
      </div>

      <!-- Product Form Sheet (Single Product Add/Edit) -->
      <ProductFormSheet
        v-if="!bulkUploadMode"
        :open="addProductSheetOpen"
        :isEditMode="isEditMode"
        :formData="formData"
        :categories="categories"
        :loadingCategories="loadingCategories"
        :loading="productsStore.loading"
        @update:open="addProductSheetOpen = $event"
        @update:formData="formData = $event"
        @submit="handleFormSubmit"
        @imagesUpload="handleImagesUpload"
      />

      <!-- Bulk Upload Sheet -->
      <BulkUploadSheet
        v-if="bulkUploadMode"
        :open="addProductSheetOpen"
        :categories="categories"
        :loadingCategories="loadingCategories"
        :loading="productsStore.loading"
        :bulkProducts="bulkProductsList"
        :bulkProductTags="bulkProductTags"
        :applyTagToAll="applyTagToAll"
        :globalBulkTag="globalBulkTag"
        :bulkUploadFile="bulkUploadFile"
        :getCategoryName="getCategoryName"
        :formatTat="formatTatForDisplay"
        @update:open="addProductSheetOpen = $event"
        @update:applyTagToAll="applyTagToAll = $event"
        @update:globalBulkTag="globalBulkTag = $event"
        @update:bulkProductTags="bulkProductTags = $event"
        @fileUpload="handleBulkFileUpload"
        @downloadTemplate="downloadTemplate"
        @removeProduct="removeBulkProduct"
        @uploadProduct="uploadProductWithStatus"
        @bulkPublishAll="bulkPublishAll"
        @bulkDraftAll="bulkDraftAll"
        @bulkArchiveAll="bulkArchiveAll"
      />

      <!-- View Product Sheet -->
      <ViewProductSheet
        :open="viewProductSheetOpen"
        :product="selectedProduct"
        :formatPrice="productsStore.formatPrice"
        :formatStatus="productsStore.formatStatus"
        :formatTat="formatTatForDisplay"
        :getCategoryName="getCategoryName"
        @update:open="viewProductSheetOpen = $event"
        @edit="editProduct"
        @updateStatus="updateProductStatus"
      />
    </Card>

    <DashboardFooter />

    <!-- Delete Confirmation Dialog -->
    <DeleteProductDialog
      :open="deleteModalOpen"
      :product="productToDelete"
      :loading="productsStore.loading"
      @update:open="deleteModalOpen = $event"
      @confirm="confirmDeleteProduct"
    />
  </div>
</template>
