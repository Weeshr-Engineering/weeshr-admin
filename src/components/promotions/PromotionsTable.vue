<template>
  <div class="overflow-auto bg-white rounded-lg">
    <Table class="lg:w-full w-[800px]">
      <TableHeader>
        <TableRow class="text-xs sm:text-sm text-[#8B8D97] font-medium border-b border-gray-200">
          <TableHead
            class="font-medium cursor-pointer hover:bg-gray-50"
            @click="$emit('sort', 'name')"
          >
            <div class="flex items-center gap-1">
              Name
              <Icon icon="fluent:chevron-up-down-20-regular" class="w-4 h-4" />
            </div>
          </TableHead>
          <TableHead class="font-medium">Type</TableHead>
          <TableHead class="font-medium">Discount</TableHead>
          <TableHead class="font-medium">Applies To</TableHead>
          <TableHead
            class="font-medium cursor-pointer hover:bg-gray-50"
            @click="$emit('sort', 'startDate')"
          >
            <div class="flex items-center gap-1">
              Start Date
              <Icon icon="fluent:chevron-up-down-20-regular" class="w-4 h-4" />
            </div>
          </TableHead>
          <TableHead class="font-medium">End Date</TableHead>
          <TableHead class="font-medium">Usage</TableHead>
          <TableHead class="font-medium">Status</TableHead>
          <TableHead class="font-medium">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="promo in promotions"
          :key="promo._id"
          class="border-b border-gray-100 hover:bg-gray-50"
        >
          <TableCell class="text-sm font-medium text-[#020721]">{{
            promo.name || 'N/A'
          }}</TableCell>
          <TableCell class="text-sm text-[#8B8D97]">{{
            formatPromotionType(promo.promotionType)
          }}</TableCell>
          <TableCell class="text-sm font-medium text-[#020721]">{{
            formatDiscountValue(promo)
          }}</TableCell>
          <TableCell class="text-sm text-[#8B8D97]">{{ formatAppliesTo(promo) }}</TableCell>
          <TableCell class="text-sm text-[#8B8D97]">{{ formatDate(promo.startDate) }}</TableCell>
          <TableCell class="text-sm text-[#8B8D97]">{{ formatDate(promo.endDate) }}</TableCell>
          <TableCell class="text-sm text-[#8B8D97]">{{ formatUsageCount(promo) }}</TableCell>
          <TableCell>
            <div
              :class="statusBg(promo.status)"
              class="rounded-full w-fit px-3 py-1 text-white text-xs font-medium capitalize"
            >
              {{ promo.status }}
            </div>
          </TableCell>
          <TableCell>
            <!-- Actions Dropdown Menu -->
            <div class="relative">
              <button
                @click.stop="toggleActionsMenu(promo._id)"
                class="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors"
                title="Promotion Actions"
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
                  v-if="activeActionsMenu === promo._id"
                  @click.stop
                  class="absolute -top-16 right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50"
                >
                  <button
                    @click="handleAction('view', promo)"
                    class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700 transition-colors"
                  >
                    <Icon icon="mdi:eye-outline" class="w-4 h-4" />
                    View
                  </button>
                  <button
                    @click="handleAction('edit', promo)"
                    class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700 transition-colors"
                  >
                    <Icon icon="mdi:pencil-outline" class="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    v-if="promo.status === 'draft'"
                    @click="handleAction('publish', promo)"
                    class="w-full px-4 py-2 text-left hover:bg-green-50 flex items-center gap-2 text-sm text-green-600 transition-colors border-t border-gray-100"
                  >
                    <Icon icon="mdi:publish" class="w-4 h-4" />
                    Publish
                  </button>
                  <button
                    @click="handleAction('delete', promo)"
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
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import {
  Table,
  TableRow,
  TableBody,
  TableHeader,
  TableCell,
  TableHead
} from '@/components/ui/table'
import type { Promotion } from '@/stores/vendor-store/vendor-promotion'

const props = defineProps<{
  promotions: Promotion[]
  formatPromotionType: (type: string) => string
  formatDiscountValue: (promo: Promotion) => string
  formatAppliesTo: (promo: Promotion) => string
  formatUsageCount: (promo: Promotion) => string
}>()

const emit = defineEmits<{
  (e: 'sort', field: string): void
  (e: 'view', id: string): void
  (e: 'edit', promo: Promotion): void
  (e: 'publish', promo: Promotion): void
  (e: 'delete', promo: Promotion): void
}>()

const activeActionsMenu = ref<string | null>(null)

const toggleActionsMenu = (id: string) => {
  activeActionsMenu.value = activeActionsMenu.value === id ? null : id
}

const handleAction = (action: 'view' | 'edit' | 'publish' | 'delete', promo: Promotion) => {
  activeActionsMenu.value = null
  if (action === 'view') {
    emit('view', promo._id)
  } else if (action === 'edit') {
    emit('edit', promo)
  } else if (action === 'publish') {
    emit('publish', promo)
  } else if (action === 'delete') {
    emit('delete', promo)
  }
}

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
