<script setup lang="ts">
import { ref, computed } from 'vue'
import { Sheet, SheetContent, SheetHeader, SheetDescription } from '@/components/ui/sheet'
import { Icon } from '@iconify/vue'

interface Category {
  _id: string
  name: string
}

interface FormData {
  name: string
  description: string
  amount: string
  qty: string
  tat: string
  size: string
  tag: string[]
  image: File | null
  status: 'published' | 'draft' | 'archived' | 'out-of-stock'
}

interface Props {
  open: boolean
  isEditMode: boolean
  formData: FormData
  categories: Category[]
  loadingCategories: boolean
  loading: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'update:formData', value: FormData): void
  (e: 'submit', status: 'published' | 'draft' | 'archived'): void
  (e: 'imageUpload', file: File): void
}>()

const deliveryTimeOptions = [
  'Same Day',
  '1 Day',
  '2 Days',
  '3 Days',
  '4 Days',
  '5 Days',
  '1 Week',
  '2 Weeks',
  '3 Weeks',
  '1 Month'
]

const updateField = (field: keyof FormData, value: any) => {
  emit('update:formData', { ...props.formData, [field]: value })
}

const handleTagSelection = (categoryId: string) => {
  const currentTags = [...props.formData.tag]
  if (currentTags.includes(categoryId)) {
    emit('update:formData', { ...props.formData, tag: [] })
  } else {
    emit('update:formData', { ...props.formData, tag: [categoryId] })
  }
}

const handleImageUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    emit('imageUpload', file)
  }
}

const handleSubmit = (status: 'published' | 'draft' | 'archived') => {
  emit('submit', status)
}
</script>

<template>
  <Sheet :open="props.open" @update:open="emit('update:open', $event)">
    <SheetContent length="mid_low" class="flex flex-col space-y-0 overflow-y-scroll">
      <SheetHeader class="flex flex-col items-start px-4">
        <SheetDescription class="text-xs text-muted-foreground">
          {{ props.isEditMode ? 'Edit Product' : 'Add New Product' }}
        </SheetDescription>
        <h3 class="text-2xl font-medium text-[#020721]">
          {{ props.isEditMode ? 'Edit Product' : 'Add Product' }}
        </h3>
        <p class="text-sm text-muted-foreground">
          {{ props.isEditMode ? 'Update product details' : 'Add a new product to your store' }}
        </p>
      </SheetHeader>

      <div class="px-4 space-y-4 flex-1">
        <!-- Image Upload -->
        <div class="border rounded-lg p-4 bg-[#F8F9FF]">
          <div class="flex items-start gap-3 mb-4">
            <Icon icon="mdi:image" class="text-[#020721] mt-1" width="20" height="20" />
            <div>
              <p class="text-sm font-medium text-[#020721]">Product Image</p>
              <p class="text-xs text-[#8B8D97]">Upload a product image</p>
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            @change="handleImageUpload"
            class="hidden"
            id="product-image"
          />
          <label for="product-image" class="text-xs text-[#5B68DF] cursor-pointer hover:underline">
            {{ props.formData.image ? '✓ Image uploaded' : 'Choose file' }}
          </label>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 py-4">
          <button
            @click="handleSubmit('archived')"
            :disabled="props.loading"
            :class="[
              'flex-1 px-4 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50',
              props.formData.status === 'archived'
                ? 'bg-[#020721] text-white hover:bg-[#020721]/90'
                : 'bg-white border border-gray-300 text-[#020721] hover:bg-gray-50'
            ]"
          >
            Archive
          </button>
          <button
            @click="handleSubmit('draft')"
            :disabled="props.loading"
            :class="[
              'flex-1 px-4 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50',
              props.formData.status === 'draft'
                ? 'bg-[#020721] text-white hover:bg-[#020721]/90'
                : 'bg-white border border-gray-300 text-[#020721] hover:bg-gray-50'
            ]"
          >
            Draft
          </button>
          <button
            @click="handleSubmit('published')"
            :disabled="props.loading"
            :class="[
              'flex-1 px-4 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50',
              props.formData.status === 'published'
                ? 'bg-[#020721] text-white hover:bg-[#020721]/90'
                : 'bg-white border border-gray-300 text-[#020721] hover:bg-gray-50'
            ]"
          >
            Publish
          </button>
        </div>

        <!-- Form Fields -->
        <div class="space-y-4">
          <div>
            <label class="text-sm text-[#8B8D97] mb-2 block">
              Name <span class="text-red-500">*</span>
            </label>
            <input
              :value="props.formData.name"
              @input="updateField('name', ($event.target as HTMLInputElement).value)"
              type="text"
              placeholder="Enter product name"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5B68DF]"
            />
          </div>

          <div>
            <label class="text-sm text-[#8B8D97] mb-2 block">
              Price <span class="text-red-500">*</span>
            </label>
            <input
              :value="props.formData.amount"
              @input="updateField('amount', ($event.target as HTMLInputElement).value)"
              type="number"
              placeholder="Enter price"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5B68DF]"
            />
          </div>

          <div>
            <label class="text-sm text-[#8B8D97] mb-2 block">Quantity</label>
            <input
              :value="props.formData.qty"
              @input="updateField('qty', ($event.target as HTMLInputElement).value)"
              type="number"
              placeholder="Enter quantity"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5B68DF]"
            />
          </div>

          <div>
            <label class="text-sm text-[#8B8D97] mb-2 block">Delivery Time</label>
            <select
              :value="props.formData.tat"
              @change="updateField('tat', ($event.target as HTMLSelectElement).value)"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5B68DF]"
            >
              <option value="">Select delivery time</option>
              <option v-for="option in deliveryTimeOptions" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </div>

          <div>
            <label class="text-sm text-[#8B8D97] mb-2 block">Size</label>
            <input
              :value="props.formData.size"
              @input="updateField('size', ($event.target as HTMLInputElement).value)"
              type="text"
              placeholder="Enter size"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5B68DF]"
            />
          </div>

          <div>
            <label class="text-sm text-[#8B8D97] mb-2 block">Description</label>
            <textarea
              :value="props.formData.description"
              @input="updateField('description', ($event.target as HTMLTextAreaElement).value)"
              placeholder="Enter description (max 140 characters)"
              maxlength="140"
              rows="3"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5B68DF] resize-none"
            ></textarea>
          </div>

          <!-- Category Selection -->
          <div>
            <label class="text-sm text-[#8B8D97] mb-2 block">
              Category <span class="text-red-500">*</span>
            </label>
            <div v-if="props.loadingCategories" class="text-sm text-[#8B8D97]">
              Loading categories...
            </div>
            <div v-else class="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
              <div
                v-for="category in props.categories"
                :key="category._id"
                @click="handleTagSelection(category._id)"
                :class="[
                  'border rounded-lg p-3 cursor-pointer transition-colors text-sm',
                  props.formData.tag.includes(category._id)
                    ? 'bg-[#5B68DF] text-white border-[#5B68DF]'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                ]"
              >
                <div class="flex items-center justify-between">
                  <span>{{ category.name }}</span>
                  <Icon
                    v-if="props.formData.tag.includes(category._id)"
                    icon="mdi:check-circle"
                    class="w-4 h-4"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>
