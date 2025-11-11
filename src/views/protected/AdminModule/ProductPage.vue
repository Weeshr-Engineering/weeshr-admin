<!-- ProductPage.vue -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import MainNav from '@/components/MainNav.vue'
import DashboardFooter from '@/components/DashboardFooter.vue'
import Search from '@/components/UseSearch.vue'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'
import { Check, ScrollText, Battery, ListFilter, Archive } from 'lucide-vue-next'
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
  SheetTrigger,
} from "@/components/ui/sheet"
import { useProductsStore } from '@/stores/vendor/product'
import { useToast } from '@/components/ui/toast'
import { menu_food } from '@/lib/menu-food'

const productsStore = useProductsStore()
const { toast } = useToast()

// Get vendorId - you might want to get this from your auth store
// For now, using the one from your Postman example
const vendorId = '67001b0cdce3af5c124e5dd9'

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

// Sheet state
const sheetOpen = ref(false)
const currentStep = ref(1)
const bulkUploadMode = ref(false)
const selectedProducts = ref<number[]>([])

// Form data
const formData = ref({
  name: '',
  description: '',
  price: '',
  quantity: '',
  deliveryTat: '',
  size: '',
  tags: '',
  category: '',
  image: null as File | null,
  status: 'draft' as 'published' | 'draft' | 'archived' | 'out-of-stock'
})

// Handle image upload
const handleImageUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    formData.value.image = file
  }
}

// Handle next button click
const handleNext = async () => {
  if (currentStep.value < 3) {
    currentStep.value++
  } else {
    await createProduct()
  }
}

// Create product
const createProduct = async () => {
  // Validate required fields
  if (!formData.value.name || !formData.value.price) {
    toast({
      description: 'Please fill all required fields',
      variant: 'destructive'
    })
    return
  }

  const productData: any = {
    name: formData.value.name,
    price: Number(formData.value.price),
    status: formData.value.status
  }

  // Add optional fields
  if (formData.value.description) productData.description = formData.value.description
  if (formData.value.quantity) productData.quantity = Number(formData.value.quantity)
  if (formData.value.deliveryTat) productData.deliveryTat = formData.value.deliveryTat
  if (formData.value.size) productData.size = formData.value.size
  if (formData.value.category) productData.category = formData.value.category
  if (formData.value.tags) productData.tags = formData.value.tags.split(',').map(t => t.trim())

  try {
    const result = await productsStore.createProduct(productData)
    
    if (result && formData.value.image) {
      // Upload image separately
      await productsStore.uploadProductImage(result._id, formData.value.image)
    }

    if (result) {
      toast({
        description: 'Product created successfully!',
      })
      resetForm()
      sheetOpen.value = false
      
      // Refresh products and counts
      await productsStore.fetchProducts()
      await productsStore.fetchProductStatusCounts(vendorId)
    }
  } catch (error) {
    toast({
      description: 'Error creating product. Please try again.',
      variant: 'destructive'
    })
  }
}

// Reset form
const resetForm = () => {
  currentStep.value = 1
  bulkUploadMode.value = false
  selectedProducts.value = []
  formData.value = {
    name: '',
    description: '',
    price: '',
    quantity: '',
    deliveryTat: '',
    size: '',
    tags: '',
    category: '',
    image: null,
    status: 'draft'
  }
}

// Handle search
const handleSearch = (query: string) => {
  productsStore.fetchProducts({ search: query })
}

// Sort by field
const sortBy = (field: string) => {
  productsStore.fetchProducts({ sortBy: field })
}

// Change page
const changePage = (page: number | string) => {
  if (typeof page === 'number' && page >= 1 && page <= productsStore.pagination.totalPages) {
    productsStore.fetchProducts({ page })
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

// View product details
const viewProductDetails = async (id: string) => {
  await productsStore.fetchProductById(id)
  // You can add a modal or sheet to show details here
}

// Fetch products and counts on mount
onMounted(async () => {
  await productsStore.fetchProducts()
  await productsStore.fetchProductStatusCounts(vendorId)
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
          <Button variant="outline" class="flex items-center gap-2 w-full sm:w-auto bg-[#EEEFF5]">
            <ListFilter class="w-4 h-4"/>
            All
            <Icon icon="mdi:chevron-down" class="w-4 h-4" />
          </Button>
          <Search class="mt-3 lg:mt-0" @search="handleSearch" />
          <Sheet v-model:open="sheetOpen">
            <SheetTrigger asChild>
              <button class="bg-[#020721] px-4 py-2 rounded-xl w-50 h-12">
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
            </SheetTrigger>
            <SheetContent length="mid_low" class="flex flex-col space-y-0 overflow-y-scroll">
              <SheetHeader class="flex flex-col items-start px-4">
                <SheetDescription class="text-xs text-muted-foreground">
                  {{ currentStep === 1 ? 'Draft/Save' : currentStep === 2 ? 'Draft/Save' : 'Draft/Save' }}
                </SheetDescription>
                <h3 class="text-2xl font-medium text-[#020721]">New Product</h3>
                <p class="text-sm text-muted-foreground">{{ new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) }}</p>
              </SheetHeader>

              <!-- Upload Mode Selection -->
              <div class="px-4 py-4" v-if="currentStep === 1">
                <div class="text-sm font-medium text-[#020721] mb-3">Upload Mode</div>
                <div class="flex gap-2">
                  <button 
                    @click="bulkUploadMode = false"
                    :class="!bulkUploadMode ? 'bg-[#020721] text-white' : 'bg-transparent text-[#02072199]'"
                    class="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200"
                  >
                    Single Upload
                  </button>
                  <button 
                    @click="bulkUploadMode = true"
                    :class="bulkUploadMode ? 'bg-[#020721] text-white' : 'bg-transparent text-[#02072199]'"
                    class="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200"
                  >
                    Bulk Upload
                  </button>
                </div>
              </div>

              <!-- Step Indicator -->
              <div class="px-4 flex items-center justify-between mb-4">
                <div :class="currentStep === 1 ? 'text-[#020721] font-semibold' : 'text-[#02072199]'" class="text-sm">
                  {{ currentStep === 1 ? (bulkUploadMode ? 'Bulk Upload Details' : 'Upload Details') : 
                     currentStep === 2 ? 'Product Information' : 'Pricing & Inventory' }}
                </div>
                <div class="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded">
                  Step {{ currentStep }} of 3
                </div>
              </div>

              <!-- Step 1: Single Upload -->
              <div v-if="currentStep === 1 && !bulkUploadMode" class="px-4 space-y-4">
                <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-[#F8F9FF]">
                  <div class="w-16 h-16 mx-auto mb-4 bg-white rounded-lg flex items-center justify-center">
                    <Icon icon="mdi:upload" class="text-[#020721]" width="32" height="32" />
                  </div>
                  <p class="text-sm font-medium text-[#020721] mb-1">Upload Product Picture</p>
                  <p class="text-xs text-[#8B8D97] mb-4">Max 10MB, 384X384 recommended<br />Upload JPEG files</p>
                  <input
                    type="file"
                    accept="image/*"
                    @change="handleImageUpload"
                    class="hidden"
                    id="product-image"
                  />
                  <label 
                    for="product-image"
                    class="inline-block px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm cursor-pointer hover:bg-gray-50"
                  >
                    Choose File
                  </label>
                  <p v-if="formData.image" class="text-sm text-green-600 mt-2">✓ Image uploaded</p>
                </div>
              </div>

              <!-- Step 1: Bulk Upload -->
              <div v-if="currentStep === 1 && bulkUploadMode" class="px-4 space-y-4">
                <div class="border rounded-lg p-4 bg-[#F8F9FF]">
                  <div class="flex items-start gap-3 mb-4">
                    <Icon icon="mdi:download" class="text-[#020721] mt-1" width="20" height="20" />
                    <div>
                      <p class="text-sm font-medium text-[#020721]">Download Template</p>
                      <p class="text-xs text-[#8B8D97]">Use our XLSX file for bulk product upload</p>
                    </div>
                  </div>
                  <button class="w-full px-4 py-2 bg-white border rounded-lg text-sm hover:bg-gray-50">
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
                  <input type="file" accept=".xlsx,.xls" class="hidden" id="bulk-upload" />
                  <label 
                    for="bulk-upload"
                    class="block w-full px-4 py-2 bg-white border rounded-lg text-sm text-center cursor-pointer hover:bg-gray-50"
                  >
                    Choose File
                  </label>
                </div>

                <div>
                  <p class="text-sm font-medium text-[#020721] mb-3">Select Products to Upload</p>
                  <div class="space-y-2 max-h-60 overflow-y-auto">
                    <div v-for="product in menu_food" :key="product.id" 
                         class="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                      <input 
                        type="checkbox" 
                        :id="`product-${product.id}`"
                        v-model="selectedProducts"
                        :value="product.id"
                        class="w-4 h-4"
                      />
                      <img :src="product.img" :alt="product.name" class="w-12 h-12 rounded object-cover" />
                      <div class="flex-1">
                        <p class="text-sm font-medium text-[#020721]">{{ product.name }}</p>
                        <p class="text-xs text-[#8B8D97]">₦{{ product.price.toLocaleString() }}</p>
                      </div>
                      <button class="px-3 py-1 bg-[#020721] text-white text-xs rounded-lg hover:bg-[#020721]/90">
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 2: Product Information -->
              <div v-if="currentStep === 2" class="px-4 space-y-4">
                <div>
                  <label class="text-sm font-medium text-[#020721] mb-2 block">
                    Product Name <span class="text-red-500">*</span>
                  </label>
                  <input 
                    v-model="formData.name"
                    type="text"
                    placeholder="Enter product name"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#020721]"
                  />
                </div>

                <div>
                  <label class="text-sm font-medium text-[#020721] mb-2 block">Description</label>
                  <div class="relative">
                    <textarea 
                      v-model="formData.description"
                      maxlength="140"
                      rows="4"
                      placeholder="Describe product in 140 characters"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#020721] resize-none"
                    ></textarea>
                    <span class="absolute bottom-2 right-2 text-xs text-muted-foreground">
                      {{ formData.description.length }}/140
                    </span>
                  </div>
                </div>

                <div>
                  <label class="text-sm font-medium text-[#020721] mb-2 block">Size</label>
                  <input 
                    v-model="formData.size"
                    type="text"
                    placeholder="Enter size"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#020721]"
                  />
                </div>

                <div>
                  <label class="text-sm font-medium text-[#020721] mb-2 block">Tags</label>
                  <input 
                    v-model="formData.tags"
                    type="text"
                    placeholder="Enter single word tags, separate with comma"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#020721]"
                  />
                </div>
              </div>

              <!-- Step 3: Pricing & Inventory -->
              <div v-if="currentStep === 3" class="px-4 space-y-4">
                <div>
                  <label class="text-sm font-medium text-[#020721] mb-2 block">
                    Price <span class="text-red-500">*</span>
                  </label>
                  <input 
                    v-model="formData.price"
                    type="number"
                    placeholder="Enter price"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#020721]"
                  />
                </div>

                <div>
                  <label class="text-sm font-medium text-[#020721] mb-2 block">Quantity</label>
                  <input 
                    v-model="formData.quantity"
                    type="number"
                    placeholder="Enter available quantity"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#020721]"
                  />
                </div>

                <div>
                  <label class="text-sm font-medium text-[#020721] mb-2 block">Delivery TAT</label>
                  <input 
                    v-model="formData.deliveryTat"
                    type="text"
                    placeholder="e.g. 2 Days"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#020721]"
                  />
                </div>

                <div>
                  <label class="text-sm font-medium text-[#020721] mb-2 block">Category</label>
                  <input 
                    v-model="formData.category"
                    type="text"
                    placeholder="Enter category"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#020721]"
                  />
                </div>
              </div>

              <!-- Navigation Buttons -->
              <div class="px-4 py-4 mt-auto flex items-center justify-between">
                <button 
                  v-if="currentStep > 1"
                  @click="currentStep--"
                  class="flex items-center gap-2 px-4 py-2 text-sm text-[#020721] hover:bg-gray-100 rounded-lg"
                >
                  <Icon icon="radix-icons:chevron-left" />
                  Back
                </button>
                <div v-else></div>
                
                <button 
                  @click="handleNext"
                  :disabled="productsStore.loading"
                  class="flex items-center gap-2 px-6 py-2 bg-[#5B68DF] text-white rounded-lg text-sm font-medium hover:bg-[#4a56cc] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="productsStore.loading && currentStep === 3">Creating...</span>
                  <span v-else>{{ currentStep === 3 ? 'Create Product' : 'Next' }}</span>
                  <Icon v-if="!productsStore.loading" icon="radix-icons:chevron-right" />
                </button>
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
              <TableHead class="font-medium cursor-pointer hover:bg-gray-50" @click="sortBy('price')">
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
              <TableHead></TableHead>
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
              <TableCell class="text-sm font-medium text-[#020721]">{{ productsStore.formatPrice(product.price) }}</TableCell>
              <TableCell class="text-sm text-[#8B8D97]">{{ product.deliveryTat || 'N/A' }}</TableCell>
              <TableCell class="text-sm text-[#8B8D97] text-center">{{ product.quantity }}</TableCell>
              <TableCell>
                <div
                  :class="statusBg(product.status)"
                  class="rounded-full w-fit px-3 py-1 text-white text-xs font-medium capitalize"
                >
                  {{ productsStore.formatStatus(product.status) }}
                </div>
              </TableCell>
              <TableCell>
                <button @click="viewProductDetails(product._id)" class="text-gray-400 hover:text-gray-600">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 5L12.5118 9.93939C13.1627 10.5227 13.1627 11.4773 12.5118 12.0606L7 17"
                      stroke="#54586D"
                      stroke-opacity="0.8"
                      stroke-width="2"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
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