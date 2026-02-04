<script setup lang="ts">
import { ref, watch, computed } from 'vue'
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

// Image gallery state
const currentImageIndex = ref(0)

// Get product images as array
const productImages = computed(() => {
  if (!props.product?.images) return []
  if (Array.isArray(props.product.images)) {
    return props.product.images.filter(Boolean)
  }
  if (typeof props.product.images === 'string') {
    return [props.product.images]
  }
  return []
})

// Reset image index when product changes
watch(
  () => props.product,
  () => {
    currentImageIndex.value = 0
  }
)

// Navigation functions
const prevImage = () => {
  if (productImages.value.length > 0) {
    currentImageIndex.value =
      (currentImageIndex.value - 1 + productImages.value.length) % productImages.value.length
  }
}

const nextImage = () => {
  if (productImages.value.length > 0) {
    currentImageIndex.value = (currentImageIndex.value + 1) % productImages.value.length
  }
}

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

          <!-- Product Image Gallery -->
          <div class="mb-4">
            <!-- Main Image with Navigation -->
            <div
              class="w-full h-48 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden relative"
            >
              <img
                v-if="productImages.length > 0"
                :src="productImages[currentImageIndex]"
                :alt="props.product.name"
                class="w-full h-full object-cover"
              />
              <Icon v-else icon="mdi:package-variant" class="w-16 h-16 text-gray-400" />

              <!-- Navigation Arrows (only if multiple images) -->
              <template v-if="productImages.length > 1">
                <button
                  @click="prevImage"
                  class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <Icon icon="mdi:chevron-left" class="w-5 h-5" />
                </button>
                <button
                  @click="nextImage"
                  class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <Icon icon="mdi:chevron-right" class="w-5 h-5" />
                </button>

                <!-- Image Counter -->
                <span
                  class="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded"
                >
                  {{ currentImageIndex + 1 }} / {{ productImages.length }}
                </span>
              </template>
            </div>

            <!-- Thumbnail Grid (only if multiple images) -->
            <div v-if="productImages.length > 1" class="flex gap-2 mt-2 overflow-x-auto pb-1">
              <button
                v-for="(image, idx) in productImages"
                :key="idx"
                @click="currentImageIndex = idx"
                :class="[
                  'w-12 h-12 rounded-md overflow-hidden flex-shrink-0 border-2 transition-colors',
                  idx === currentImageIndex
                    ? 'border-[#020721]'
                    : 'border-transparent hover:border-gray-300'
                ]"
              >
                <img :src="image" :alt="`Image ${idx + 1}`" class="w-full h-full object-cover" />
              </button>
            </div>
          </div>

          <!-- Product Variants Section -->
          <div class="mb-6">
            <p class="text-xs text-[#8B8D97] mb-2">Product Variants</p>

            <!-- If product has config array -->
            <div v-if="props.product.config && props.product.config.length > 0" class="space-y-2">
              <div
                v-for="(variant, index) in props.product.config"
                :key="index"
                class="bg-[#F8F9FF] rounded-lg p-3"
              >
                <div class="grid grid-cols-4 gap-2 text-sm">
                  <div>
                    <p class="text-xs text-[#8B8D97]">Color</p>
                    <p class="font-medium text-[#020721]">{{ variant.color || 'N/A' }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-[#8B8D97]">Size</p>
                    <p class="font-medium text-[#020721]">{{ variant.size || 'N/A' }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-[#8B8D97]">Price</p>
                    <p class="font-medium text-[#020721]">
                      {{ props.formatPrice(variant.amount) }}
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-[#8B8D97]">Qty</p>
                    <p class="font-medium text-[#020721]">{{ variant.qty || 0 }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Fallback for legacy products without config -->
            <div v-else class="grid grid-cols-2 gap-4">
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
          </div>

          <!-- Status (always shown) -->
          <div class="mb-4" v-if="props.product.config && props.product.config.length > 0">
            <p class="text-xs text-[#8B8D97] mb-1">Status</p>
            <div
              :class="statusBg(props.product.status)"
              class="rounded-full w-fit px-3 py-1 text-white text-xs font-medium capitalize"
            >
              {{ props.formatStatus(props.product.status) }}
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
