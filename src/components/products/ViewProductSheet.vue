<script setup lang="ts">
import { Sheet, SheetContent, SheetDescription, SheetHeader } from '@/components/ui/sheet'
import { Icon } from '@iconify/vue'
import type { Product } from '@/stores/vendor/product'

interface Props {
  open: boolean
  product: Product | null
  formatPrice: (price: number | undefined) => string
  formatStatus: (status: string) => string
  formatTat: (tat: string) => string
  getCategoryName: (categoryId: string) => string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'edit'): void
  (e: 'updateStatus', status: 'published' | 'draft' | 'archived' | 'out-of-stock'): void
}>()

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
</script>

<template>
  <Sheet :open="props.open" @update:open="emit('update:open', $event)">
    <SheetContent length="mid_low" class="flex flex-col space-y-0 overflow-y-scroll">
      <SheetHeader class="flex flex-col items-start px-4">
        <SheetDescription class="text-xs text-muted-foreground">
          {{ props.product?.status || 'Draft' }}
        </SheetDescription>
        <h3 class="text-2xl font-medium text-[#020721]">
          {{ props.product?.name }}
        </h3>
        <p class="text-sm text-muted-foreground">
          {{
            props.product?.createdAt
              ? new Date(props.product.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })
              : ''
          }}
        </p>
      </SheetHeader>

      <div v-if="props.product" class="px-4 space-y-6">
        <!-- Details Section -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-sm font-semibold text-[#020721]">Details</h4>
            <button
              @click="emit('edit')"
              class="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
            >
              <Icon icon="mdi:pencil" class="w-4 h-4" />
              Edit
            </button>
          </div>

          <!-- Product Image -->
          <div
            class="w-full h-48 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden mb-4"
          >
            <img
              v-if="props.product.images && props.product.images.length > 0"
              :src="props.product.images[0]"
              :alt="props.product.name"
              class="w-full h-full object-cover"
            />
            <Icon v-else icon="mdi:package-variant" class="w-16 h-16 text-gray-400" />
          </div>

          <!-- Product Info Grid -->
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p class="text-xs text-[#8B8D97] mb-1">Price</p>
              <p class="text-sm font-medium text-[#020721]">
                {{ props.formatPrice(props.product.amount) }}
              </p>
            </div>
            <div>
              <p class="text-xs text-[#8B8D97] mb-1">Quantity</p>
              <p class="text-sm font-medium text-[#020721]">
                {{ props.product.qty || 0 }}
              </p>
            </div>
            <div>
              <p class="text-xs text-[#8B8D97] mb-1">Size</p>
              <p class="text-sm font-medium text-[#020721]">
                {{ props.product.size || 'N/A' }}
              </p>
            </div>
            <div>
              <p class="text-xs text-[#8B8D97] mb-1">Status</p>
              <div
                :class="statusBg(props.product.status)"
                class="rounded-full w-fit px-3 py-1 text-white text-xs font-medium capitalize"
              >
                {{ props.formatStatus(props.product.status) }}
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="mb-4">
            <p class="text-xs text-[#8B8D97] mb-1">Description</p>
            <p class="text-sm text-[#020721]">
              {{ props.product.description || 'No description' }}
            </p>
          </div>

          <!-- Tags -->
          <div class="mb-4">
            <p class="text-xs text-[#8B8D97] mb-2">Tags</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tagId in props.product.tag"
                :key="tagId"
                class="px-3 py-1 bg-[#F8F9FF] text-[#5B68DF] text-xs rounded-full"
              >
                {{ props.getCategoryName(tagId) }}
              </span>
              <span
                v-if="!props.product.tag || props.product.tag.length === 0"
                class="text-sm text-[#8B8D97]"
              >
                No tags
              </span>
            </div>
          </div>

          <!-- Delivery Time display -->
          <div>
            <p class="text-xs text-[#8B8D97] mb-1">Delivery Time</p>
            <p class="text-sm font-medium text-[#020721]">
              {{ props.formatTat(props.product.tat ?? '') || 'N/A' }}
            </p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-2 pb-4">
          <button
            @click="emit('updateStatus', 'archived')"
            class="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
          >
            Archive
          </button>
          <button
            @click="emit('updateStatus', 'draft')"
            class="flex-1 px-4 py-2 bg-[#020721] text-white rounded-lg text-sm hover:bg-[#020721]/90"
          >
            Draft
          </button>
          <button
            @click="emit('updateStatus', 'published')"
            class="flex-1 px-4 py-2 bg-[#020721] text-white rounded-lg text-sm hover:bg-[#020721]/90"
          >
            Publish
          </button>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>
