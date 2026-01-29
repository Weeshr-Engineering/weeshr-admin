<script setup lang="ts">
import { computed } from 'vue'
import { Sheet, SheetContent, SheetHeader, SheetDescription } from '@/components/ui/sheet'
import { Icon } from '@iconify/vue'

interface Category {
  _id: string
  name: string
}

interface BulkProduct {
  name: string
  amount: number
  qty: number
  tat: string
  size: string
  description: string
  img: string
}

interface Props {
  open: boolean
  categories: Category[]
  loadingCategories: boolean
  loading: boolean
  bulkProducts: BulkProduct[]
  bulkProductTags: Record<number, string>
  applyTagToAll: boolean
  globalBulkTag: string
  bulkUploadFile: File | null
  getCategoryName: (id: string) => string
  formatTat: (tat: string) => string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'update:applyTagToAll', value: boolean): void
  (e: 'update:globalBulkTag', value: string): void
  (e: 'update:bulkProductTags', value: Record<number, string>): void
  (e: 'fileUpload', event: Event): void
  (e: 'downloadTemplate'): void
  (e: 'removeProduct', index: number): void
  (
    e: 'uploadProduct',
    product: BulkProduct,
    index: number,
    status: 'published' | 'draft' | 'archived'
  ): void
  (e: 'bulkPublishAll'): void
  (e: 'bulkDraftAll'): void
  (e: 'bulkArchiveAll'): void
}>()

const canUploadProduct = (index: number) => {
  if (props.applyTagToAll) {
    return !!props.globalBulkTag
  }
  return !!props.bulkProductTags[index]
}

const canBulkUpload = computed(() => {
  if (props.bulkProducts.length === 0) return false
  if (props.applyTagToAll) {
    return !!props.globalBulkTag
  }
  return props.bulkProducts.every((_, index) => !!props.bulkProductTags[index])
})

const updateProductTag = (index: number, categoryId: string) => {
  const newTags = { ...props.bulkProductTags, [index]: categoryId }
  emit('update:bulkProductTags', newTags)
}
</script>

<template>
  <Sheet :open="props.open" @update:open="emit('update:open', $event)">
    <SheetContent length="mid_low" class="flex flex-col space-y-0 overflow-y-scroll">
      <SheetHeader class="flex flex-col items-start px-4">
        <SheetDescription class="text-xs text-muted-foreground"> Bulk Upload </SheetDescription>
        <h3 class="text-2xl font-medium text-[#020721]">Bulk Upload Products</h3>
        <p class="text-sm text-muted-foreground">
          Upload multiple products at once using an Excel file
        </p>
      </SheetHeader>

      <div class="px-4 space-y-4 flex-1">
        <!-- Header with save button -->
        <div class="flex items-center justify-between">
          <h4 class="text-base font-semibold text-[#020721]">Bulk Upload Details</h4>
          <button
            class="flex items-center gap-2 px-4 py-2 bg-[#5B68DF] text-white rounded-lg text-sm font-medium hover:bg-[#4a56cc]"
          >
            <span>Save</span>
            <Icon icon="mdi:content-save" class="w-4 h-4" />
          </button>
        </div>

        <!-- Download Template -->
        <div class="border rounded-lg p-4 bg-[#F8F9FF]">
          <div class="flex items-start gap-3 mb-4">
            <Icon icon="mdi:download" class="text-[#020721] mt-1" width="20" height="20" />
            <div>
              <p class="text-sm font-medium text-[#020721]">Download Template</p>
              <p class="text-xs text-[#8B8D97]">Use our XLSX file for bulk product upload</p>
            </div>
          </div>
          <button
            @click="emit('downloadTemplate')"
            class="w-full px-4 py-2 bg-white border rounded-lg text-sm hover:bg-gray-50"
          >
            Download
          </button>
        </div>

        <!-- Upload File -->
        <div class="border rounded-lg p-4 bg-[#F8F9FF]">
          <div class="flex items-start gap-3 mb-4">
            <Icon icon="mdi:upload" class="text-[#020721] mt-1" width="20" height="20" />
            <div>
              <p class="text-sm font-medium text-[#020721]">Upload Product</p>
              <p class="text-xs text-[#8B8D97]">Upload filled version of our product</p>
            </div>
          </div>
          <input
            type="file"
            accept=".xlsx,.xls"
            @change="emit('fileUpload', $event)"
            class="hidden"
            id="bulk-upload"
          />
          <label
            for="bulk-upload"
            class="block w-full px-4 py-2 bg-white border rounded-lg text-sm text-center cursor-pointer hover:bg-gray-50"
          >
            Choose File
          </label>
          <p v-if="props.bulkUploadFile" class="text-sm text-green-600 mt-2">
            ✓ File uploaded: {{ props.bulkUploadFile.name }}
          </p>
        </div>

        <!-- Bulk Products List -->
        <div v-if="props.bulkProducts.length > 0" class="space-y-4">
          <!-- Option to apply same tag to all -->
          <div class="border rounded-lg p-4 bg-[#F8F9FF]">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="apply-to-all"
                  :checked="props.applyTagToAll"
                  @change="
                    emit('update:applyTagToAll', ($event.target as HTMLInputElement).checked)
                  "
                  class="w-4 h-4 text-[#5B68DF] border-gray-300 rounded focus:ring-[#5B68DF]"
                />
                <label for="apply-to-all" class="text-sm font-medium text-[#020721] cursor-pointer">
                  Apply same category to all products
                </label>
              </div>
            </div>

            <!-- Global category selector -->
            <div v-if="props.applyTagToAll" class="mt-3">
              <p class="text-xs text-[#8B8D97] mb-2">Select category for all products:</p>
              <div v-if="props.loadingCategories" class="text-sm text-[#8B8D97]">
                Loading categories...
              </div>
              <div v-else class="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
                <div
                  v-for="category in props.categories"
                  :key="category._id"
                  @click="emit('update:globalBulkTag', category._id)"
                  :class="[
                    'border rounded-lg p-3 cursor-pointer transition-colors text-sm',
                    props.globalBulkTag === category._id
                      ? 'bg-[#5B68DF] text-white border-[#5B68DF]'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  ]"
                >
                  <div class="flex items-center justify-between">
                    <span>{{ category.name }}</span>
                    <Icon
                      v-if="props.globalBulkTag === category._id"
                      icon="mdi:check-circle"
                      class="w-4 h-4"
                    />
                  </div>
                </div>
              </div>
              <p v-if="!props.globalBulkTag" class="text-xs text-red-500 mt-2">
                ⚠️ Please select a category
              </p>
            </div>

            <!-- Info message when not applying to all -->
            <div v-else class="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div class="flex items-start gap-2">
                <Icon icon="mdi:information" class="text-blue-600 mt-0.5" width="16" />
                <p class="text-xs text-blue-800">
                  You can select a different category for each product below.
                </p>
              </div>
            </div>
          </div>

          <!-- Products List Header -->
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-[#020721]">
              Products to Upload ({{ props.bulkProducts.length }})
            </p>
            <div class="flex gap-2">
              <button
                @click="emit('bulkArchiveAll')"
                :disabled="!canBulkUpload"
                class="px-3 py-1 bg-white border border-gray-200 text-xs rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Archive all
              </button>
              <button
                @click="emit('bulkDraftAll')"
                :disabled="!canBulkUpload"
                class="px-3 py-1 bg-white border border-gray-200 text-xs rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Draft all
              </button>
              <button
                @click="emit('bulkPublishAll')"
                :disabled="!canBulkUpload"
                :class="[
                  'px-3 py-1 text-white text-xs rounded-lg',
                  !canBulkUpload
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#020721] hover:bg-[#020721]/90'
                ]"
              >
                Publish all
              </button>
            </div>
          </div>

          <!-- Individual Products -->
          <div
            v-for="(product, index) in props.bulkProducts"
            :key="index"
            class="border rounded-lg p-4 bg-white"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center gap-3">
                <div
                  class="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden"
                >
                  <img
                    v-if="product.img"
                    :src="product.img"
                    :alt="product.name"
                    class="w-full h-full object-cover"
                  />
                  <Icon v-else icon="mdi:package-variant" class="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <p class="font-medium text-[#020721]">{{ product.name }}</p>
                  <p class="text-sm text-[#8B8D97]">
                    ₦{{ product.amount?.toLocaleString() || '0' }}
                  </p>
                </div>
              </div>
              <button
                @click="emit('removeProduct', index)"
                class="text-gray-400 hover:text-red-500"
              >
                <Icon icon="mdi:close" class="w-5 h-5" />
              </button>
            </div>

            <div class="grid grid-cols-2 gap-3 text-sm mb-3">
              <div>
                <p class="text-[#8B8D97] mb-1">Quantity</p>
                <p class="font-medium text-[#020721]">{{ product.qty || 1 }}</p>
              </div>
              <div>
                <p class="text-[#8B8D97] mb-1">Size</p>
                <p class="font-medium text-[#020721]">{{ product.size || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-[#8B8D97] mb-1">Delivery Time</p>
                <p class="font-medium text-[#020721]">
                  {{ props.formatTat(product.tat) || 'N/A' }}
                </p>
              </div>
            </div>

            <div class="mb-3">
              <p class="text-[#8B8D97] text-xs mb-1">Description</p>
              <p class="text-sm text-[#020721]">
                {{ product.description || 'No description' }}
              </p>
            </div>

            <!-- Individual Category Selection -->
            <div v-if="!props.applyTagToAll" class="mb-3">
              <p class="text-xs text-[#8B8D97] mb-2">
                Category (Tag)
                <span class="text-red-500">*</span>
              </p>
              <div v-if="props.loadingCategories" class="text-sm text-[#8B8D97]">
                Loading categories...
              </div>
              <div v-else class="grid grid-cols-2 gap-2">
                <div
                  v-for="category in props.categories"
                  :key="category._id"
                  @click="updateProductTag(index, category._id)"
                  :class="[
                    'border rounded-lg p-2 cursor-pointer transition-colors text-xs',
                    props.bulkProductTags[index] === category._id
                      ? 'bg-[#5B68DF] text-white border-[#5B68DF]'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  ]"
                >
                  <div class="flex items-center justify-between">
                    <span>{{ category.name }}</span>
                    <Icon
                      v-if="props.bulkProductTags[index] === category._id"
                      icon="mdi:check-circle"
                      class="w-3 h-3"
                    />
                  </div>
                </div>
              </div>
              <p v-if="!props.bulkProductTags[index]" class="text-xs text-red-500 mt-1">
                ⚠️ Category required
              </p>
            </div>

            <!-- Category display when applying to all -->
            <div v-else class="mb-3">
              <p class="text-xs text-[#8B8D97] mb-1">Category (Tag)</p>
              <div class="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                <p class="text-sm text-[#020721]">
                  {{
                    props.globalBulkTag
                      ? props.getCategoryName(props.globalBulkTag)
                      : 'Select category above'
                  }}
                </p>
              </div>
            </div>

            <div class="flex gap-2">
              <button
                @click="emit('uploadProduct', product, index, 'archived')"
                :disabled="!canUploadProduct(index)"
                class="flex-1 px-3 py-2 bg-white border border-gray-200 text-xs rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Archive
              </button>
              <button
                @click="emit('uploadProduct', product, index, 'draft')"
                :disabled="!canUploadProduct(index)"
                class="flex-1 px-3 py-2 bg-white border border-gray-200 text-xs rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Draft
              </button>
              <button
                @click="emit('uploadProduct', product, index, 'published')"
                :disabled="!canUploadProduct(index)"
                :class="[
                  'flex-1 px-3 py-2 text-white text-xs rounded-lg',
                  !canUploadProduct(index)
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#020721] hover:bg-[#020721]/90'
                ]"
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>
