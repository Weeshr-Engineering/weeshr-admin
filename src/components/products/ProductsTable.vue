<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'
import {
  Table,
  TableRow,
  TableBody,
  TableHeader,
  TableCell,
  TableHead
} from '@/components/ui/table'
import type { Product } from '@/stores/vendor/product'

interface Pagination {
  currentPage: number
  totalPages: number
  totalProducts: number
  hasNext: boolean
  hasPrev: boolean
}

interface Props {
  products: Product[]
  pagination: Pagination
  loading: boolean
  formatPrice: (price: number | undefined) => string
  formatStatus: (status: string) => string
  formatTat: (tat: string) => string
  activeActionsMenu: string | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'view', id: string): void
  (e: 'edit', product: Product): void
  (e: 'delete', product: Product): void
  (e: 'sort', field: string): void
  (e: 'changePage', page: number | string): void
  (e: 'toggleActionsMenu', id: string | null): void
}>()

// Lightbox state for image preview
const showLightbox = ref(false)
const lightboxImages = ref<string[]>([])
const lightboxIndex = ref(0)
const lightboxProductName = ref('')

// Open lightbox with product images
const openLightbox = (product: Product) => {
  if (!product.images || product.images.length === 0) return

  lightboxImages.value = Array.isArray(product.images)
    ? product.images.filter(Boolean)
    : [product.images]
  lightboxIndex.value = 0
  lightboxProductName.value = product.name
  showLightbox.value = true
}

// Close lightbox
const closeLightbox = () => {
  showLightbox.value = false
}

// Navigate lightbox
const prevLightboxImage = () => {
  if (lightboxImages.value.length > 0) {
    lightboxIndex.value =
      (lightboxIndex.value - 1 + lightboxImages.value.length) % lightboxImages.value.length
  }
}

const nextLightboxImage = () => {
  if (lightboxImages.value.length > 0) {
    lightboxIndex.value = (lightboxIndex.value + 1) % lightboxImages.value.length
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

// Get total quantity - sum all config variant quantities for accurate total
const getTotalQty = (product: Product): number => {
  if (product.config && product.config.length > 0) {
    return product.config.reduce((sum, c) => sum + (c.qty || 0), 0)
  }
  return product.qty || 0
}

// Get amount from config (first entry) or fallback to legacy amount
const getAmount = (product: Product): number => {
  if (product.config && product.config.length > 0) {
    return product.config[0].amount || 0
  }
  return product.amount || 0
}

const visiblePages = computed(() => {
  const current = props.pagination.currentPage
  const total = props.pagination.totalPages
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

const handleToggleMenu = (productId: string) => {
  emit('toggleActionsMenu', props.activeActionsMenu === productId ? null : productId)
}

const handleView = (productId: string) => {
  emit('view', productId)
  emit('toggleActionsMenu', null)
}

const handleEdit = (product: Product) => {
  emit('edit', product)
  emit('toggleActionsMenu', null)
}
</script>

<template>
  <!-- Loading State -->
  <div
    v-if="props.loading && props.products.length === 0"
    class="flex items-center justify-center py-10"
  >
    <Icon icon="eos-icons:loading" class="w-8 h-8 text-[#020721]" />
  </div>

  <!-- Table -->
  <div v-else class="overflow-auto bg-white rounded-lg">
    <Table class="lg:w-full w-[800px]">
      <TableHeader>
        <TableRow class="text-xs sm:text-sm text-[#8B8D97] font-medium border-b border-gray-200">
          <TableHead class="font-medium">Picture</TableHead>
          <TableHead
            class="font-medium cursor-pointer hover:bg-gray-50"
            @click="emit('sort', 'name')"
          >
            <div class="flex items-center gap-1">
              Name
              <Icon icon="fluent:chevron-up-down-20-regular" class="w-4 h-4" />
            </div>
          </TableHead>
          <TableHead class="font-medium">Description</TableHead>
          <TableHead
            class="font-medium cursor-pointer hover:bg-gray-50"
            @click="emit('sort', 'amount')"
          >
            <div class="flex items-center gap-1">
              Amount
              <Icon icon="fluent:chevron-up-down-20-regular" class="w-4 h-4" />
            </div>
          </TableHead>
          <TableHead class="font-medium">
            <div class="flex items-center gap-1">
              Delivery Time
              <Icon icon="fluent:chevron-up-down-20-regular" class="w-4 h-4" />
            </div>
          </TableHead>
          <TableHead
            class="font-medium cursor-pointer hover:bg-gray-50"
            @click="emit('sort', 'quantity')"
          >
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
        <TableRow
          v-for="product in props.products"
          :key="product._id"
          class="border-b border-gray-100 hover:bg-gray-50"
        >
          <TableCell class="py-4">
            <button
              @click.stop="openLightbox(product)"
              class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden relative cursor-pointer hover:ring-2 hover:ring-[#020721]/30 transition-all"
              :disabled="!product.images || product.images.length === 0"
            >
              <img
                v-if="product.images && product.images.length > 0"
                :src="product.images[0]"
                :alt="product.name"
                class="w-full h-full object-cover"
              />
              <Icon v-else icon="mdi:package-variant" class="w-6 h-6 text-gray-400" />
              <!-- Image count badge -->
              <span
                v-if="product.images && product.images.length > 1"
                class="absolute bottom-0 right-0 bg-black/70 text-white text-[8px] px-1 rounded-tl"
              >
                +{{ product.images.length - 1 }}
              </span>
            </button>
          </TableCell>
          <TableCell class="text-sm font-medium text-[#020721]">{{ product.name }}</TableCell>
          <TableCell class="text-sm text-[#8B8D97] max-w-[200px] truncate">{{
            product.description || 'No description'
          }}</TableCell>
          <TableCell class="text-sm font-medium text-[#020721]">{{
            props.formatPrice(getAmount(product))
          }}</TableCell>
          <TableCell class="text-sm text-[#8B8D97]">{{
            props.formatTat(product.tat ?? '') || 'N/A'
          }}</TableCell>
          <TableCell class="text-sm text-[#8B8D97] text-center">{{
            getTotalQty(product)
          }}</TableCell>
          <TableCell>
            <div
              :class="statusBg(product.status)"
              class="rounded-full w-fit px-3 py-1 text-white text-xs font-medium capitalize"
            >
              {{ props.formatStatus(product.status) }}
            </div>
          </TableCell>
          <TableCell>
            <!-- Actions Dropdown Menu -->
            <div class="relative">
              <button
                @click.stop="handleToggleMenu(product._id)"
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
                  <circle cx="10" cy="4" r="1.5" fill="currentColor" />
                  <circle cx="10" cy="10" r="1.5" fill="currentColor" />
                  <circle cx="10" cy="16" r="1.5" fill="currentColor" />
                </svg>
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
                  v-if="props.activeActionsMenu === product._id"
                  class="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50"
                >
                  <button
                    @click="handleView(product._id)"
                    class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700 transition-colors"
                  >
                    <Icon icon="mdi:eye-outline" class="w-4 h-4" />
                    View
                  </button>
                  <button
                    @click="handleEdit(product)"
                    class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700 transition-colors"
                  >
                    <Icon icon="mdi:pencil-outline" class="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    @click="emit('delete', product)"
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
      @click="emit('changePage', props.pagination.currentPage - 1)"
      :disabled="props.pagination.currentPage === 1"
    >
      <Icon icon="radix-icons:chevron-left" />
    </Button>
    <Button
      v-for="page in visiblePages"
      :key="page"
      :variant="page === props.pagination.currentPage ? 'secondary' : 'outline'"
      :class="page === props.pagination.currentPage ? 'bg-[#020721] text-gray-400' : ''"
      @click="emit('changePage', page)"
    >
      {{ page === '...' ? '&#8230;' : page }}
    </Button>
    <Button
      variant="outline"
      @click="emit('changePage', props.pagination.currentPage + 1)"
      :disabled="props.pagination.currentPage === props.pagination.totalPages"
    >
      <Icon icon="radix-icons:chevron-right" />
    </Button>
    <a href="#"><p class="text-[blue]">See all</p></a>
  </div>

  <!-- Image Lightbox Modal -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showLightbox"
        class="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
        @click.self="closeLightbox"
        @keydown.escape="closeLightbox"
      >
        <!-- Close Button -->
        <button
          @click="closeLightbox"
          class="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
        >
          <Icon icon="mdi:close" class="w-8 h-8" />
        </button>

        <!-- Product Name -->
        <div class="absolute top-4 left-4 text-white text-lg font-medium">
          {{ lightboxProductName }}
        </div>

        <!-- Main Image -->
        <div class="relative max-w-4xl max-h-[80vh] w-full mx-4">
          <img
            :src="lightboxImages[lightboxIndex]"
            :alt="lightboxProductName"
            class="w-full h-auto max-h-[70vh] object-contain mx-auto rounded-lg"
          />

          <!-- Navigation Arrows -->
          <template v-if="lightboxImages.length > 1">
            <button
              @click="prevLightboxImage"
              class="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center transition-colors"
            >
              <Icon icon="mdi:chevron-left" class="w-8 h-8" />
            </button>
            <button
              @click="nextLightboxImage"
              class="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center transition-colors"
            >
              <Icon icon="mdi:chevron-right" class="w-8 h-8" />
            </button>
          </template>

          <!-- Image Counter -->
          <div
            class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-4 py-2 rounded-full"
          >
            {{ lightboxIndex + 1 }} / {{ lightboxImages.length }}
          </div>
        </div>

        <!-- Thumbnail Strip -->
        <div
          v-if="lightboxImages.length > 1"
          class="absolute bottom-4 left-1/2 -translate-x-1/2 mt-20 flex gap-2 bg-black/50 p-2 rounded-lg"
          style="bottom: 80px"
        >
          <button
            v-for="(image, idx) in lightboxImages"
            :key="idx"
            @click="lightboxIndex = idx"
            :class="[
              'w-16 h-16 rounded-md overflow-hidden border-2 transition-all',
              idx === lightboxIndex
                ? 'border-white scale-110'
                : 'border-transparent opacity-60 hover:opacity-100'
            ]"
          >
            <img :src="image" :alt="`Image ${idx + 1}`" class="w-full h-full object-cover" />
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
