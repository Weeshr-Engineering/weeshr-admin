<template>
  <Sheet :open="isOpen" @update:open="$emit('update:isOpen', $event)">
    <SheetContent length="mid_low" class="flex flex-col space-y-0 overflow-y-auto bg-[#FAFBFC] p-0">
      <!-- Enhanced Header with Status Badge -->
      <SheetHeader
        class="flex flex-col items-start px-4 sm:px-6 py-4 sm:py-5 bg-white border-b border-gray-100 sticky top-0 z-10"
      >
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-3 mb-3">
          <div
            :class="statusBg(promotion?.status ?? '')"
            class="px-3 py-1.5 rounded-full text-white text-xs font-semibold capitalize flex items-center gap-1.5"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-white/70"></span>
            {{ promotion?.status || 'Draft' }}
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              v-if="promotion?.status === 'draft'"
              @click="$emit('publish')"
              class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00C37F] to-[#00A86B] text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-green-200 transition-all duration-200"
            >
              <Icon icon="mdi:rocket-launch-outline" class="w-4 h-4" />
              Publish
            </button>
            <button
              @click="$emit('edit')"
              class="flex items-center gap-2 px-4 py-2 bg-[#020721] text-white rounded-xl text-sm font-medium hover:bg-[#1a1f3d] transition-all duration-200"
            >
              <Icon icon="mdi:pencil-outline" class="w-4 h-4" />
              Edit
            </button>
          </div>
        </div>
        <h3 class="text-2xl font-bold text-[#020721] tracking-tight">
          {{ promotion?.name }}
        </h3>
        <p class="text-sm text-[#8B8D97] flex items-center gap-2 mt-1">
          <Icon icon="mdi:calendar-outline" class="w-4 h-4" />
          Created
          {{ promotion?.createdAt ? formatDate(promotion.createdAt) : '' }}
        </p>
      </SheetHeader>

      <div v-if="promotion" class="px-4 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5">
        <!-- Promotion Details Card -->
        <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div class="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-[#F8F9FF] to-white">
            <h4 class="text-sm font-bold text-[#020721] flex items-center gap-2">
              <Icon icon="mdi:tag-multiple-outline" class="w-5 h-5 text-[#5B68DF]" />
              Promotion Details
            </h4>
          </div>
          <div class="p-4 sm:p-5 space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div class="p-3 bg-[#FAFBFC] rounded-xl">
                <p class="text-xs text-[#8B8D97] font-medium uppercase tracking-wide mb-1">Name</p>
                <p class="text-sm font-semibold text-[#020721]">
                  {{ promotion.name }}
                </p>
              </div>
              <div class="p-3 bg-[#FAFBFC] rounded-xl">
                <p class="text-xs text-[#8B8D97] font-medium uppercase tracking-wide mb-1">Type</p>
                <p class="text-sm font-semibold text-[#020721]">
                  {{ formatPromotionType(promotion.promotionType) }}
                </p>
              </div>
            </div>

            <div v-if="promotion.description" class="p-3 bg-[#FAFBFC] rounded-xl">
              <p class="text-xs text-[#8B8D97] font-medium uppercase tracking-wide mb-1">
                Description
              </p>
              <p class="text-sm text-[#020721]">{{ promotion.description }}</p>
            </div>

            <div
              v-if="promotion.promoCode"
              class="p-3 bg-gradient-to-r from-[#5B68DF]/10 to-[#5B68DF]/5 rounded-xl border border-[#5B68DF]/20"
            >
              <p class="text-xs text-[#8B8D97] font-medium uppercase tracking-wide mb-1">
                Promo Code
              </p>
              <p class="text-lg font-bold text-[#5B68DF] tracking-widest">
                {{ promotion.promoCode }}
              </p>
            </div>

            <div class="p-3 bg-[#FAFBFC] rounded-xl">
              <p class="text-xs text-[#8B8D97] font-medium uppercase tracking-wide mb-1">
                Applies To
              </p>
              <p class="text-sm font-semibold text-[#020721]">
                {{ formatAppliesTo(promotion) }}
              </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div class="p-3 bg-[#FAFBFC] rounded-xl">
                <p
                  class="text-xs text-[#8B8D97] font-medium uppercase tracking-wide mb-1 flex items-center gap-1"
                >
                  <Icon icon="mdi:calendar-start" class="w-3.5 h-3.5" />
                  Start Date
                </p>
                <p class="text-sm font-semibold text-[#020721]">
                  {{ formatDate(promotion.startDate) }}
                </p>
              </div>
              <div class="p-3 bg-[#FAFBFC] rounded-xl">
                <p
                  class="text-xs text-[#8B8D97] font-medium uppercase tracking-wide mb-1 flex items-center gap-1"
                >
                  <Icon icon="mdi:calendar-end" class="w-3.5 h-3.5" />
                  End Date
                </p>
                <p class="text-sm font-semibold text-[#020721]">
                  {{ formatDate(promotion.endDate) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Discount Configuration Card -->
        <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div class="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-[#FFF8F0] to-white">
            <h4 class="text-sm font-bold text-[#020721] flex items-center gap-2">
              <Icon icon="mdi:percent-circle-outline" class="w-5 h-5 text-[#DF6C50]" />
              Discount Configuration
            </h4>
          </div>
          <div class="p-4 sm:p-5 space-y-4">
            <div
              class="p-4 bg-gradient-to-r from-[#00C37F]/10 to-[#00C37F]/5 rounded-xl border border-[#00C37F]/20 text-center"
            >
              <p class="text-xs text-[#8B8D97] font-medium uppercase tracking-wide mb-2">
                Discount Value
              </p>
              <p class="text-3xl font-bold text-[#00C37F]">
                {{ formatDiscountValue(promotion) }}
              </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div v-if="promotion.minimumPurchaseAmount" class="p-3 bg-[#FAFBFC] rounded-xl">
                <p class="text-xs text-[#8B8D97] font-medium uppercase tracking-wide mb-1">
                  Min. Purchase
                </p>
                <p class="text-sm font-semibold text-[#020721]">
                  ₦{{ promotion.minimumPurchaseAmount.toLocaleString() }}
                </p>
              </div>
              <div v-if="promotion.maximumDiscountCap" class="p-3 bg-[#FAFBFC] rounded-xl">
                <p class="text-xs text-[#8B8D97] font-medium uppercase tracking-wide mb-1">
                  Max. Discount
                </p>
                <p class="text-sm font-semibold text-[#020721]">
                  ₦{{ promotion.maximumDiscountCap.toLocaleString() }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Usage Statistics Card -->
        <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div class="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-[#F0F8FF] to-white">
            <h4 class="text-sm font-bold text-[#020721] flex items-center gap-2">
              <Icon icon="mdi:chart-line" class="w-5 h-5 text-[#3A8EE5]" />
              Usage Statistics
            </h4>
          </div>
          <div class="p-4 sm:p-5">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div class="p-4 bg-[#FAFBFC] rounded-xl text-center">
                <p class="text-xs text-[#8B8D97] font-medium uppercase tracking-wide mb-2">
                  Usage Count
                </p>
                <p class="text-2xl font-bold text-[#020721]">
                  {{ formatUsageCount(promotion) }}
                </p>
              </div>
              <div
                v-if="promotion.limitPerCustomer"
                class="p-4 bg-[#FAFBFC] rounded-xl text-center"
              >
                <p class="text-xs text-[#8B8D97] font-medium uppercase tracking-wide mb-2">
                  Per Customer
                </p>
                <p class="text-2xl font-bold text-[#020721]">
                  {{ promotion.limitPerCustomer }}
                </p>
              </div>
              <div v-else class="p-4 bg-[#FAFBFC] rounded-xl text-center">
                <p class="text-xs text-[#8B8D97] font-medium uppercase tracking-wide mb-2">
                  Per Customer
                </p>
                <p class="text-lg font-semibold text-[#8B8D97]">Unlimited</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="pt-2 pb-6">
          <button
            @click="$emit('delete')"
            class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-red-200 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-50 hover:border-red-300 transition-all duration-200"
          >
            <Icon icon="mdi:delete-outline" class="w-5 h-5" />
            Delete Promotion
          </button>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet'
import type { Promotion } from '@/stores/vendor-store/vendor-promotion'

defineProps<{
  isOpen: boolean
  promotion: Promotion | null
  formatPromotionType: (type: string) => string
  formatDiscountValue: (promo: Promotion) => string
  formatAppliesTo: (promo: Promotion) => string
  formatUsageCount: (promo: Promotion) => string
}>()

defineEmits<{
  (e: 'update:isOpen', value: boolean): void
  (e: 'edit'): void
  (e: 'delete'): void
  (e: 'publish'): void
}>()

// Status background color
const statusBg = (status: string) => {
  switch (status) {
    case 'expired':
      return 'bg-[#DF6C50]'
    case 'scheduled':
      return 'bg-[#6A70FF]'
    case 'active':
      return 'bg-[#00C37F]'
    case 'draft':
      return 'bg-[#3A8EE5]'
    default:
      return 'bg-gray-400'
  }
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
</script>
