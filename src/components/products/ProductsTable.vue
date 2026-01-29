<script setup lang="ts">
import { computed } from 'vue'
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
            <div
              class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden"
            >
              <img
                v-if="product.image"
                :src="product.image"
                :alt="product.name"
                class="w-full h-full object-cover"
              />
              <Icon v-else icon="mdi:package-variant" class="w-6 h-6 text-gray-400" />
            </div>
          </TableCell>
          <TableCell class="text-sm font-medium text-[#020721]">{{ product.name }}</TableCell>
          <TableCell class="text-sm text-[#8B8D97] max-w-[200px] truncate">{{
            product.description || 'No description'
          }}</TableCell>
          <TableCell class="text-sm font-medium text-[#020721]">{{
            props.formatPrice(product.amount || 0)
          }}</TableCell>
          <TableCell class="text-sm text-[#8B8D97]">{{
            props.formatTat(product.tat ?? '') || 'N/A'
          }}</TableCell>
          <TableCell class="text-sm text-[#8B8D97] text-center">{{ product.qty || 0 }}</TableCell>
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
</template>
