<template>
  <Sheet :open="isOpen" @update:open="handleOpenChange">
    <SheetContent length="mid_low" class="flex flex-col space-y-0 overflow-y-auto p-0">
      <SheetHeader
        class="flex flex-col items-start px-4 sm:px-6 py-4 sm:pb-4 border-b sticky top-0 bg-white z-10"
      >
        <SheetDescription class="text-xs text-muted-foreground">
          {{ isEditMode ? 'Editing' : 'Draft' }}
        </SheetDescription>
        <h3 class="text-2xl font-medium text-[#020721]">
          {{ isEditMode ? 'Edit Promotion' : 'New Promotion' }}
        </h3>
        <p class="text-sm text-muted-foreground">
          {{ isEditMode ? 'Last Updated' : 'Created Date' }}
        </p>
        <p class="text-sm font-medium text-[#020721]">
          {{
            new Date().toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })
          }}
        </p>
      </SheetHeader>

      <!-- Promotion Status Tabs -->
      <div class="px-4 sm:px-6 py-4">
        <div class="text-sm font-medium text-[#020721] mb-3">Promotion Status</div>
        <div class="flex flex-wrap gap-2">
          <button
            @click="updateFormData('status', 'scheduled')"
            :class="
              formData.status === 'scheduled'
                ? 'bg-[#020721] text-white'
                : 'bg-white text-[#02072199]'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200"
          >
            Schedule
          </button>
          <button
            @click="updateFormData('status', 'draft')"
            :class="
              formData.status === 'draft' ? 'bg-[#020721] text-white' : 'bg-white text-[#02072199]'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200"
          >
            Draft
          </button>
          <button
            @click="updateFormData('status', 'active')"
            :class="
              formData.status === 'active' ? 'bg-[#020721] text-white' : 'bg-white text-[#02072199]'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200"
          >
            Active
          </button>
        </div>
      </div>

      <!-- Step Indicator -->
      <div
        class="px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4"
      >
        <div
          :class="currentStep === 1 ? 'text-[#020721] font-semibold' : 'text-[#02072199]'"
          class="text-sm"
        >
          {{
            currentStep === 1
              ? 'Promotion Details'
              : currentStep === 2
                ? 'Discount Configuration'
                : currentStep === 3
                  ? 'Target Products or Categories'
                  : 'Review & Confirm'
          }}
        </div>
        <div class="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded">
          Step {{ currentStep }} of 4
        </div>
      </div>

      <!-- Step 1: Promotion Details -->
      <div v-if="currentStep === 1" class="px-4 sm:px-6 space-y-4 pb-4">
        <div>
          <label class="text-sm font-medium text-[#020721] mb-2 block">
            Name of Promotion <span class="text-red-500">*</span>
          </label>
          <input
            :value="formData.name"
            @input="updateFormData('name', ($event.target as HTMLInputElement).value)"
            type="text"
            placeholder="Enter promotion name"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#020721]"
          />
        </div>

        <div>
          <label class="text-sm font-medium text-[#020721] mb-2 block">Description</label>
          <div class="relative">
            <textarea
              :value="formData.description"
              @input="updateFormData('description', ($event.target as HTMLTextAreaElement).value)"
              maxlength="90"
              rows="3"
              placeholder="Enter promotion description (max 90 characters)"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#020721] resize-none"
            ></textarea>
            <span class="absolute bottom-2 right-2 text-xs text-muted-foreground">
              {{ formData.description.length }}/90
            </span>
          </div>
        </div>

        <div>
          <label class="text-sm font-medium text-[#020721] mb-2 block">
            Promotion Type <span class="text-red-500">*</span>
          </label>
          <select
            :value="formData.promotionType"
            @change="updateFormData('promotionType', ($event.target as HTMLSelectElement).value)"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#020721] appearance-none bg-white"
          >
            <option value="">Select type</option>
            <option value="percentage_off">Percentage Off</option>
            <option value="fixed_amount_off">Fixed Amount Off</option>
            <option value="bogo">Buy One Get One</option>
          </select>
        </div>

        <div>
          <label class="text-sm font-medium text-[#020721] mb-2 block">Promo Code</label>
          <input
            :value="formData.promoCode"
            @input="updateFormData('promoCode', ($event.target as HTMLInputElement).value)"
            type="text"
            placeholder="e.g., SUMMER20"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#020721]"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium text-[#020721] mb-2 block">Start Date</label>
            <input
              :value="formData.startDate"
              @input="updateFormData('startDate', ($event.target as HTMLInputElement).value)"
              type="date"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#020721] text-sm"
            />
          </div>
          <div>
            <label class="text-sm font-medium text-[#020721] mb-2 block">End Date</label>
            <input
              :value="formData.endDate"
              @input="updateFormData('endDate', ($event.target as HTMLInputElement).value)"
              type="date"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#020721] text-sm"
            />
          </div>
        </div>
      </div>

      <!-- Step 2: Discount Configuration -->
      <div v-if="currentStep === 2" class="px-4 sm:px-6 space-y-4 pb-4">
        <div>
          <label class="text-sm font-medium text-[#020721] mb-2 block">
            Discount Value <span class="text-red-500">*</span>
          </label>
          <input
            :value="formData.discountValue"
            @input="updateFormData('discountValue', ($event.target as HTMLInputElement).value)"
            type="number"
            min="0"
            :placeholder="formData.promotionType === 'percentage_off' ? '20' : '5000'"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#020721]"
          />
          <p class="text-xs text-[#8B8D97] mt-1">
            {{
              formData.promotionType === 'percentage_off'
                ? 'Enter percentage (e.g., 20 for 20%)'
                : 'Enter amount in Naira'
            }}
          </p>
        </div>

        <div>
          <label class="text-sm font-medium text-[#020721] mb-2 block"
            >Minimum Purchase Amount (₦)</label
          >
          <input
            :value="formData.minPurchaseAmount"
            @input="updateFormData('minPurchaseAmount', ($event.target as HTMLInputElement).value)"
            type="number"
            min="0"
            placeholder="5000"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#020721]"
          />
        </div>

        <div>
          <label class="text-sm font-medium text-[#020721] mb-2 block"
            >Maximum Discount Cap (₦)</label
          >
          <input
            :value="formData.maxDiscountCap"
            @input="updateFormData('maxDiscountCap', ($event.target as HTMLInputElement).value)"
            type="number"
            min="0"
            placeholder="2000"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#020721]"
          />
        </div>

        <div>
          <label class="text-sm font-medium text-[#020721] mb-2 block">Total Usage Limit</label>
          <input
            :value="formData.totalUsageLimit"
            @input="updateFormData('totalUsageLimit', ($event.target as HTMLInputElement).value)"
            type="number"
            min="0"
            placeholder="500"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#020721]"
          />
        </div>

        <div>
          <label class="text-sm font-medium text-[#020721] mb-2 block">Limit Per Customer</label>
          <input
            :value="formData.limitPerCustomer"
            @input="updateFormData('limitPerCustomer', ($event.target as HTMLInputElement).value)"
            type="number"
            min="0"
            placeholder="3"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#020721]"
          />
        </div>
      </div>

      <!-- Step 3: Target Products or Categories -->
      <div v-if="currentStep === 3" class="px-4 sm:px-6 space-y-4 pb-4">
        <div class="text-sm font-medium text-[#020721] mb-3">Apply To</div>
        <div class="flex flex-wrap gap-2 mb-4">
          <button
            @click="updateFormData('appliesTo', 'all_products')"
            :class="
              formData.appliesTo === 'all_products'
                ? 'bg-[#020721] text-white'
                : 'bg-white text-[#020721]'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200"
          >
            All Products
          </button>
          <button
            @click="updateFormData('appliesTo', 'selected_products')"
            :class="
              formData.appliesTo === 'selected_products'
                ? 'bg-[#020721] text-white'
                : 'bg-white text-[#020721]'
            "
            class="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200"
          >
            Selected Products
          </button>
        </div>

        <div v-if="formData.appliesTo === 'selected_products'">
          <label class="text-sm font-medium text-[#020721] mb-2 block">
            Select Eligible Products <span class="text-red-500">*</span>
          </label>

          <div class="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3">
            <div
              v-for="product in eligibleProducts"
              :key="product._id"
              class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg"
            >
              <input
                type="checkbox"
                :id="product._id"
                :checked="formData.productIds.includes(product._id)"
                @change="toggleProductId(product._id)"
                class="w-4 h-4"
              />
              <img
                v-if="product.image"
                :src="product.image"
                :alt="product.name"
                class="w-10 h-10 rounded object-cover"
              />
              <div v-else class="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">
                <Icon icon="mdi:package-variant" class="w-6 h-6 text-gray-400" />
              </div>
              <div class="flex-1">
                <div class="text-sm font-medium text-[#020721]">{{ product.name }}</div>
                <div class="text-xs text-muted-foreground">
                  ₦{{ (product.amount || 0).toLocaleString() }}
                </div>
              </div>
              <div class="text-xs text-muted-foreground">{{ product.size || 'N/A' }}</div>
            </div>
          </div>
          <p class="text-xs text-[#8B8D97] mt-2">
            {{ formData.productIds.length }} product(s) selected
          </p>
        </div>
      </div>

      <!-- Step 4: Review & Confirm -->
      <div
        v-if="currentStep === 4"
        class="px-4 sm:px-6 space-y-4 sm:space-y-6 overflow-y-auto pb-4"
      >
        <div class="bg-[#F0F8FF] border border-[#3A8EE5] rounded-lg p-4 mb-4">
          <p class="text-sm text-[#020721] font-medium">
            <Icon icon="mdi:information-outline" class="inline w-4 h-4 mr-2" />
            Review all details before {{ isEditMode ? 'updating' : 'creating' }} the promotion
          </p>
        </div>

        <!-- Promotion Status -->
        <div>
          <p class="text-xs text-[#8B8D97] mb-2 font-semibold uppercase">Promotion Status</p>
          <div class="px-3 py-2 bg-gray-50 rounded-lg">
            <p class="text-sm font-medium text-[#020721] capitalize">
              {{ formData.status }}
            </p>
          </div>
        </div>

        <!-- Details Section -->
        <div>
          <p class="text-xs text-[#8B8D97] mb-3 font-semibold uppercase">Promotion Details</p>
          <div class="space-y-3 border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-[#8B8D97] mb-1">Name</p>
                <p class="text-sm font-medium text-[#020721]">{{ formData.name }}</p>
              </div>
              <div>
                <p class="text-xs text-[#8B8D97] mb-1">Type</p>
                <p class="text-sm font-medium text-[#020721]">
                  {{ formatPromotionType(formData.promotionType) }}
                </p>
              </div>
            </div>

            <div v-if="formData.description">
              <p class="text-xs text-[#8B8D97] mb-1">Description</p>
              <p class="text-sm text-[#020721]">{{ formData.description }}</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-[#8B8D97] mb-1">Start Date</p>
                <p class="text-sm font-medium text-[#020721]">
                  {{ formatDate(formData.startDate) }}
                </p>
              </div>
              <div>
                <p class="text-xs text-[#8B8D97] mb-1">End Date</p>
                <p class="text-sm font-medium text-[#020721]">
                  {{ formatDate(formData.endDate) }}
                </p>
              </div>
            </div>

            <div v-if="formData.promoCode">
              <p class="text-xs text-[#8B8D97] mb-1">Promo Code</p>
              <p class="text-sm font-medium text-[#020721]">{{ formData.promoCode }}</p>
            </div>
          </div>
        </div>

        <!-- Discount Configuration -->
        <div>
          <p class="text-xs text-[#8B8D97] mb-3 font-semibold uppercase">Discount Configuration</p>
          <div class="space-y-3 border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-[#8B8D97] mb-1">Discount Value</p>
                <p class="text-sm font-medium text-[#020721]">
                  {{
                    formData.promotionType === 'percentage_off'
                      ? formData.discountValue + '%'
                      : '₦' + Number(formData.discountValue).toLocaleString()
                  }}
                </p>
              </div>
              <div v-if="formData.minPurchaseAmount">
                <p class="text-xs text-[#8B8D97] mb-1">Minimum Purchase</p>
                <p class="text-sm font-medium text-[#020721]">
                  ₦{{ Number(formData.minPurchaseAmount).toLocaleString() }}
                </p>
              </div>
            </div>

            <div v-if="formData.maxDiscountCap">
              <p class="text-xs text-[#8B8D97] mb-1">Maximum Discount Cap</p>
              <p class="text-sm font-medium text-[#020721]">
                ₦{{ Number(formData.maxDiscountCap).toLocaleString() }}
              </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div v-if="formData.totalUsageLimit">
                <p class="text-xs text-[#8B8D97] mb-1">Total Usage Limit</p>
                <p class="text-sm font-medium text-[#020721]">
                  {{ formData.totalUsageLimit }}
                </p>
              </div>
              <div v-if="formData.limitPerCustomer">
                <p class="text-xs text-[#8B8D97] mb-1">Limit Per Customer</p>
                <p class="text-sm font-medium text-[#020721]">
                  {{ formData.limitPerCustomer }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Products/Categories -->
        <div>
          <p class="text-xs text-[#8B8D97] mb-3 font-semibold uppercase">Applies To</p>
          <div class="space-y-3 border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div>
              <p class="text-xs text-[#8B8D97] mb-1">Application Scope</p>
              <p class="text-sm font-medium text-[#020721] capitalize">
                {{ formData.appliesTo === 'all_products' ? 'All Products' : 'Selected Products' }}
              </p>
            </div>

            <div
              v-if="formData.appliesTo === 'selected_products' && formData.productIds.length > 0"
            >
              <p class="text-xs text-[#8B8D97] mb-2">
                Selected Products ({{ formData.productIds.length }})
              </p>
              <div class="space-y-2 max-h-40 overflow-y-auto">
                <div
                  v-for="productId in formData.productIds"
                  :key="productId"
                  class="flex items-center gap-2 p-2 bg-white rounded border border-gray-200"
                >
                  <div class="flex-1">
                    <p class="text-sm text-[#020721] font-medium">
                      {{ eligibleProducts.find((p) => p._id === productId)?.name || productId }}
                    </p>
                  </div>
                  <span class="text-xs text-[#8B8D97]">
                    ₦{{
                      (
                        eligibleProducts.find((p) => p._id === productId)?.amount || 0
                      ).toLocaleString()
                    }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div
        class="px-4 sm:px-6 py-4 mt-auto flex items-center justify-between border-t sticky bottom-0 bg-white"
      >
        <button
          v-if="currentStep > 1"
          @click="$emit('stepChange', currentStep - 1)"
          class="flex items-center gap-2 px-4 py-2 text-sm text-[#020721] hover:bg-gray-100 rounded-lg"
        >
          <Icon icon="radix-icons:chevron-left" />
          Back
        </button>
        <div v-else></div>

        <button
          @click="$emit('next')"
          :disabled="loading"
          class="flex items-center gap-2 px-6 py-2 bg-[#5B68DF] text-white rounded-lg text-sm font-medium hover:bg-[#4a56cc] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading && currentStep === 4">
            {{ isEditMode ? 'Updating...' : 'Creating...' }}
          </span>
          <span v-else>{{
            currentStep === 4 ? (isEditMode ? 'Update Promotion' : 'Create Promotion') : 'Next'
          }}</span>
          <Icon v-if="!loading" icon="radix-icons:chevron-right" />
        </button>
      </div>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Sheet, SheetContent, SheetDescription, SheetHeader } from '@/components/ui/sheet'

export interface PromotionFormData {
  name: string
  description: string
  promotionType: '' | 'percentage_off' | 'fixed_amount_off' | 'bogo'
  promoCode: string
  startDate: string
  endDate: string
  discountValue: string
  minPurchaseAmount: string
  maxDiscountCap: string
  totalUsageLimit: string
  limitPerCustomer: string
  appliesTo: 'all_products' | 'selected_products'
  productIds: string[]
  status: 'active' | 'scheduled' | 'draft' | 'expired'
}

export interface EligibleProduct {
  _id: string
  name: string
  image?: string
  amount?: number
  size?: string
}

const props = defineProps<{
  isOpen: boolean
  isEditMode: boolean
  formData: PromotionFormData
  eligibleProducts: EligibleProduct[]
  currentStep: number
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
  (e: 'update:formData', key: keyof PromotionFormData, value: any): void
  (e: 'stepChange', step: number): void
  (e: 'next'): void
  (e: 'close'): void
}>()

const handleOpenChange = (open: boolean) => {
  emit('update:isOpen', open)
  if (!open) {
    emit('close')
  }
}

const updateFormData = (key: keyof PromotionFormData, value: any) => {
  emit('update:formData', key, value)
}

const toggleProductId = (productId: string) => {
  const newProductIds = props.formData.productIds.includes(productId)
    ? props.formData.productIds.filter((id) => id !== productId)
    : [...props.formData.productIds, productId]
  emit('update:formData', 'productIds', newProductIds)
}

// Format date helper
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

// Format promotion type
const formatPromotionType = (type: string) => {
  switch (type) {
    case 'percentage_off':
      return 'Percentage Off'
    case 'fixed_amount_off':
      return 'Fixed Amount Off'
    case 'bogo':
      return 'Buy One Get One'
    default:
      return type
  }
}
</script>
