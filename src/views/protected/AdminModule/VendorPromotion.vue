<!-- VendorPromotion.vue -->
<template>
  <div class="flex-col flex bg-[#f0f8ff] h-full px-4 sm:px-10 pb-10">
    <VendorNav class="mx-6" headingText="Promotions" />

    <!-- Stats Cards -->
    <PromotionStatsCards
      :activeCount="promotionsStore.activeCount"
      :scheduledCount="promotionsStore.scheduledCount"
      :draftCount="promotionsStore.draftCount"
      :expiredCount="promotionsStore.expiredCount"
    />

    <!-- Main Content Card -->
    <Card
      class="container px-4 pt-6 pb-10 mx-auto sm:px-6 lg:px-8 bg-[#FFFFFF] rounded-2xl mt-14 mb-4"
    >
      <div class="flex flex-col sm:flex-row items-center justify-between py-4">
        <div class="text-xl sm:text-xl font-bold tracking-tight text-[#020721] mb-2 sm:mb-0">
          History
          <p class="text-xs sm:text-sm font-normal text-[#02072199]">
            Details of all promotions ({{ promotionsStore.promotions.length }} found)
          </p>
        </div>
        <div class="flex items-center flex-col md:flex-row gap-4">
          <Search class="mt-3 lg:mt-0" @search="handleSearch" :value="searchQuery" />

          <!-- Create Promotion Button -->
          <button @click="openCreateSheet" class="bg-[#020721] px-4 py-2 rounded-xl w-50 h-12">
            <div class="text-base text-[#F8F9FF] text-center flex items-center">
              Create New
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

          <!-- Create/Edit Promotion Sheet -->
          <PromotionFormSheet
            :isOpen="sheetOpen"
            :isEditMode="isEditMode"
            :formData="formData"
            :eligibleProducts="eligibleProducts"
            :currentStep="currentStep"
            :loading="promotionsStore.loading"
            @update:isOpen="sheetOpen = $event"
            @update:formData="handleFormDataUpdate"
            @stepChange="currentStep = $event"
            @next="handleNext"
            @close="resetForm"
          />

          <!-- View Promotion Sheet -->
          <PromotionViewSheet
            :isOpen="viewSheetOpen"
            :promotion="selectedPromotion"
            :formatPromotionType="promotionsStore.formatPromotionType"
            :formatDiscountValue="promotionsStore.formatDiscountValue"
            :formatAppliesTo="promotionsStore.formatAppliesTo"
            :formatUsageCount="promotionsStore.formatUsageCount"
            @update:isOpen="viewSheetOpen = $event"
            @edit="editPromotion"
            @delete="openDeleteModal(selectedPromotion!)"
            @publish="publishSelectedPromotion"
          />
        </div>
      </div>

      <!-- Loading State -->
      <div
        v-if="promotionsStore.loading && promotionsStore.promotions.length === 0"
        class="flex items-center justify-center py-10"
      >
        <Icon icon="eos-icons:loading" class="w-8 h-8 text-[#020721]" />
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!promotionsStore.loading && promotionsStore.promotions.length === 0"
        class="flex flex-col items-center justify-center py-10"
      >
        <Icon icon="mdi:tag-off-outline" class="w-16 h-16 text-gray-300 mb-4" />
        <p class="text-gray-500 text-sm">No promotions found</p>
        <button
          @click="openCreateSheet"
          class="mt-4 px-4 py-2 bg-[#020721] text-white rounded-lg text-sm hover:bg-[#020721]/90"
        >
          Create Your First Promotion
        </button>
      </div>

      <!-- Table -->
      <PromotionsTable
        v-else
        :promotions="promotionsStore.promotions"
        :formatPromotionType="promotionsStore.formatPromotionType"
        :formatDiscountValue="promotionsStore.formatDiscountValue"
        :formatAppliesTo="promotionsStore.formatAppliesTo"
        :formatUsageCount="promotionsStore.formatUsageCount"
        @sort="sortBy"
        @view="viewPromotionDetails"
        @edit="editPromotionFromList"
        @delete="openDeleteModal"
        @publish="publishPromotionFromList"
      />
    </Card>
    <DashboardFooter />

    <!-- Delete Confirmation Dialog -->
    <DeletePromotionDialog
      :isOpen="deleteModalOpen"
      :promotion="promotionToDelete"
      :loading="promotionsStore.loading"
      @update:isOpen="deleteModalOpen = $event"
      @confirm="confirmDeletePromotion"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import VendorNav from '@/components/VendorNav.vue'
import DashboardFooter from '@/components/DashboardFooter.vue'
import Search from '@/components/UseSearch.vue'
import { Card } from '@/components/ui/card'
import { Icon } from '@iconify/vue'
import {
  PromotionStatsCards,
  PromotionFormSheet,
  PromotionViewSheet,
  PromotionsTable,
  DeletePromotionDialog
} from '@/components/promotions'
import type { PromotionFormData, EligibleProduct } from '@/components/promotions'
import { usePromotionsStore } from '@/stores/vendor-store/vendor-promotion'
import { useProductsStore } from '@/stores/vendor/product'
import { useSuperAdminStore } from '@/stores/super-admin/super-admin'
import { useToast } from '@/components/ui/toast'
import type { Promotion } from '@/stores/vendor-store/vendor-promotion'

const promotionsStore = usePromotionsStore()
const productsStore = useProductsStore()
const superAdminStore = useSuperAdminStore()
const { toast } = useToast()

// Get vendorId from superadmin store
const vendorId = computed(() => superAdminStore.vendorId)

// Sheet states
const sheetOpen = ref(false)
const viewSheetOpen = ref(false)
const currentStep = ref(1)
const searchQuery = ref('')

// Edit mode
const isEditMode = ref(false)
const editingPromotionId = ref<string | null>(null)

// Delete modal state
const deleteModalOpen = ref(false)
const promotionToDelete = ref<Promotion | null>(null)

// Selected promotion for viewing
const selectedPromotion = ref<Promotion | null>(null)

// Eligible products (fetch from products store)
const eligibleProducts = ref<EligibleProduct[]>([])

// Form data
const formData = ref<PromotionFormData>({
  name: '',
  description: '',
  promotionType: '',
  promoCode: '',
  startDate: '',
  endDate: '',
  discountValue: '',
  minPurchaseAmount: '',
  maxDiscountCap: '',
  totalUsageLimit: '',
  limitPerCustomer: '',
  appliesTo: 'all_products',
  productIds: [],
  status: 'draft'
})

// Handle form data updates from child component
const handleFormDataUpdate = (key: keyof PromotionFormData, value: any) => {
  ;(formData.value as any)[key] = value
}

// Open create sheet
const openCreateSheet = () => {
  isEditMode.value = false
  editingPromotionId.value = null
  resetForm()
  sheetOpen.value = true
}

// Handle next button click
const handleNext = async () => {
  // Validate step 1
  if (currentStep.value === 1) {
    if (!formData.value.name || !formData.value.promotionType) {
      toast({
        description: 'Please fill all required fields',
        variant: 'destructive'
      })
      return
    }
    currentStep.value++
    return
  }

  // Validate step 2
  if (currentStep.value === 2) {
    if (!formData.value.discountValue) {
      toast({
        description: 'Please enter discount value',
        variant: 'destructive'
      })
      return
    }
    currentStep.value++
    return
  }

  // Validate step 3
  if (currentStep.value === 3) {
    if (
      formData.value.appliesTo === 'selected_products' &&
      formData.value.productIds.length === 0
    ) {
      toast({
        description: 'Please select at least one product',
        variant: 'destructive'
      })
      return
    }
    currentStep.value++
    return
  }

  // Step 4 - Create or update promotion
  if (currentStep.value === 4) {
    if (isEditMode.value && editingPromotionId.value) {
      await updatePromotion()
    } else {
      await createPromotion()
    }
  }
}

// Create promotion
const createPromotion = async () => {
  const promotionData: any = {
    name: formData.value.name,
    promotionType: formData.value.promotionType,
    discountValue: Number(formData.value.discountValue),
    appliesTo: formData.value.appliesTo,
    startDate: formData.value.startDate,
    endDate: formData.value.endDate,
    status: formData.value.status
  }

  // Add optional fields only if they have values
  if (formData.value.description) {
    promotionData.description = formData.value.description
  }
  if (formData.value.promoCode) {
    promotionData.promoCode = formData.value.promoCode
  }
  if (formData.value.minPurchaseAmount) {
    promotionData.minimumPurchaseAmount = Number(formData.value.minPurchaseAmount)
  }
  if (formData.value.maxDiscountCap) {
    promotionData.maximumDiscountCap = Number(formData.value.maxDiscountCap)
  }
  if (formData.value.totalUsageLimit) {
    promotionData.totalUsageLimit = Number(formData.value.totalUsageLimit)
  }
  if (formData.value.limitPerCustomer) {
    promotionData.limitPerCustomer = Number(formData.value.limitPerCustomer)
  }
  if (formData.value.appliesTo === 'selected_products' && formData.value.productIds.length > 0) {
    promotionData.productIds = formData.value.productIds
  }

  try {
    const result = await promotionsStore.createPromotion(promotionData)

    if (result) {
      await promotionsStore.fetchPromotions({ vendorId: vendorId.value })
      await promotionsStore.fetchPromotionStatusCounts(vendorId.value)
      resetForm()
      sheetOpen.value = false
    }
  } catch (error) {
    console.error('Failed to create promotion:', error)
  }
}

// Update promotion
const updatePromotion = async () => {
  if (!editingPromotionId.value) return

  const promotionData: any = {
    name: formData.value.name,
    promotionType: formData.value.promotionType,
    discountValue: Number(formData.value.discountValue),
    appliesTo: formData.value.appliesTo,
    startDate: formData.value.startDate,
    endDate: formData.value.endDate,
    status: formData.value.status
  }

  // Add optional fields
  if (formData.value.description) {
    promotionData.description = formData.value.description
  }
  if (formData.value.promoCode) {
    promotionData.promoCode = formData.value.promoCode
  }
  if (formData.value.minPurchaseAmount) {
    promotionData.minimumPurchaseAmount = Number(formData.value.minPurchaseAmount)
  }
  if (formData.value.maxDiscountCap) {
    promotionData.maximumDiscountCap = Number(formData.value.maxDiscountCap)
  }
  if (formData.value.totalUsageLimit) {
    promotionData.totalUsageLimit = Number(formData.value.totalUsageLimit)
  }
  if (formData.value.limitPerCustomer) {
    promotionData.limitPerCustomer = Number(formData.value.limitPerCustomer)
  }
  if (formData.value.appliesTo === 'selected_products' && formData.value.productIds.length > 0) {
    promotionData.productIds = formData.value.productIds
  }

  const result = await promotionsStore.updatePromotion(editingPromotionId.value, promotionData)

  if (result) {
    await promotionsStore.fetchPromotions({ vendorId: vendorId.value })
    await promotionsStore.fetchPromotionStatusCounts(vendorId.value)
    resetForm()
    sheetOpen.value = false
  }
}

// Reset form
const resetForm = () => {
  currentStep.value = 1
  isEditMode.value = false
  editingPromotionId.value = null
  formData.value = {
    name: '',
    description: '',
    promotionType: '',
    promoCode: '',
    startDate: '',
    endDate: '',
    discountValue: '',
    minPurchaseAmount: '',
    maxDiscountCap: '',
    totalUsageLimit: '',
    limitPerCustomer: '',
    appliesTo: 'all_products',
    productIds: [],
    status: 'draft'
  }
}

// Handle search
const handleSearch = (query: string) => {
  searchQuery.value = query
  promotionsStore.fetchPromotions({
    vendorId: vendorId.value,
    search: query
  })
}

// Sort by field
const sortBy = (field: string) => {
  promotionsStore.fetchPromotions({
    vendorId: vendorId.value,
    sortBy: field
  })
}

// View promotion details
const viewPromotionDetails = async (id: string) => {
  const promotion = await promotionsStore.fetchPromotionById(id)
  if (promotion) {
    selectedPromotion.value = promotion
    viewSheetOpen.value = true
  }
}

// Edit promotion from view sheet
const editPromotion = () => {
  if (!selectedPromotion.value) return

  isEditMode.value = true
  editingPromotionId.value = selectedPromotion.value._id

  formData.value = {
    name: selectedPromotion.value.name,
    description: selectedPromotion.value.description || '',
    promotionType: selectedPromotion.value.promotionType,
    promoCode: selectedPromotion.value.promoCode || '',
    startDate: selectedPromotion.value.startDate?.split('T')[0] || '',
    endDate: selectedPromotion.value.endDate?.split('T')[0] || '',
    discountValue: selectedPromotion.value.discountValue?.toString() || '',
    minPurchaseAmount: selectedPromotion.value.minimumPurchaseAmount?.toString() || '',
    maxDiscountCap: selectedPromotion.value.maximumDiscountCap?.toString() || '',
    totalUsageLimit: selectedPromotion.value.totalUsageLimit?.toString() || '',
    limitPerCustomer: selectedPromotion.value.limitPerCustomer?.toString() || '',
    appliesTo: selectedPromotion.value.appliesTo,
    productIds: selectedPromotion.value.productIds || [],
    status: selectedPromotion.value.status
  }

  viewSheetOpen.value = false
  sheetOpen.value = true
  currentStep.value = 1
}

// Edit promotion from dropdown menu
const editPromotionFromList = async (promotion: Promotion) => {
  isEditMode.value = true
  editingPromotionId.value = promotion._id

  const fullPromotion = await promotionsStore.fetchPromotionById(promotion._id)

  formData.value = {
    name: fullPromotion.name,
    description: fullPromotion.description || '',
    promotionType: fullPromotion.promotionType,
    promoCode: fullPromotion.promoCode || '',
    startDate: fullPromotion.startDate?.split('T')[0] || '',
    endDate: fullPromotion.endDate?.split('T')[0] || '',
    discountValue: fullPromotion.discountValue?.toString() || '',
    minPurchaseAmount: fullPromotion.minimumPurchaseAmount?.toString() || '',
    maxDiscountCap: fullPromotion.maximumDiscountCap?.toString() || '',
    totalUsageLimit: fullPromotion.totalUsageLimit?.toString() || '',
    limitPerCustomer: fullPromotion.limitPerCustomer?.toString() || '',
    appliesTo: fullPromotion.appliesTo,
    productIds: fullPromotion.productIds || [],
    status: fullPromotion.status
  }

  sheetOpen.value = true
  currentStep.value = 1
}

// Publish promotion from list
const publishPromotionFromList = async (promotion: Promotion) => {
  await promotionsStore.publishPromotion(promotion._id)
  await promotionsStore.fetchPromotions({ vendorId: vendorId.value })
  await promotionsStore.fetchPromotionStatusCounts(vendorId.value)
}

// Publish selected promotion
const publishSelectedPromotion = async () => {
  if (!selectedPromotion.value) return

  await promotionsStore.publishPromotion(selectedPromotion.value._id)
  await promotionsStore.fetchPromotions({ vendorId: vendorId.value })
  await promotionsStore.fetchPromotionStatusCounts(vendorId.value)

  viewSheetOpen.value = false
}

// Open delete confirmation modal
const openDeleteModal = (promotion: Promotion) => {
  promotionToDelete.value = promotion
  deleteModalOpen.value = true
}

// Confirm delete promotion
const confirmDeletePromotion = async () => {
  if (!promotionToDelete.value) return

  try {
    await promotionsStore.deletePromotion(promotionToDelete.value._id)

    // Close view sheet if it's open for the deleted promotion
    if (selectedPromotion.value?._id === promotionToDelete.value._id) {
      viewSheetOpen.value = false
      selectedPromotion.value = null
    }

    // Close the modal
    deleteModalOpen.value = false
    promotionToDelete.value = null
  } catch (error: any) {
    console.error('Delete promotion error:', error)
  }
}

// Fetch products and promotions on mount
onMounted(async () => {
  // Fetch products for selection - get all products without limit
  await productsStore.fetchProducts({ vendorId: vendorId.value, limit: 1000, status: 'all' })
  // Map products to use _id as the identifier
  eligibleProducts.value = productsStore.products.map((product) => ({
    _id: product._id,
    name: product.name,
    amount: product.amount || 0,
    size: product.size || '',
    image: product.image || ''
  }))
  promotionsStore.fetchPromotions({ vendorId: vendorId.value })
  promotionsStore.fetchPromotionStatusCounts(vendorId.value)
})
</script>

<style scoped>
.cardShadow1 {
  box-shadow:
    0px 31px 30px -23px #dddcdc,
    inset 0px -23px 20px -23px rgba(0, 0, 0, 0.25);
}

.weeshr-icon2 {
  background-color: white;
}
</style>
