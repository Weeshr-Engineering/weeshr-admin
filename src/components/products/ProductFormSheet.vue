<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Sheet, SheetContent, SheetHeader, SheetDescription } from '@/components/ui/sheet'
import { Icon } from '@iconify/vue'
import { useToast } from '@/components/ui/toast'

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
  images: File[]
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
  (e: 'submit', status: 'published' | 'draft' | 'archived' | 'out-of-stock'): void
  (e: 'imagesUpload', files: File[]): void
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

// Local state for image previews
const imagePreviews = ref<string[]>([])
const MAX_IMAGES = 3
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const { toast } = useToast()

// Watch for formData changes to sync previews
watch(
  () => props.formData.images,
  (newImages) => {
    if (newImages && newImages.length > 0) {
      // Generate previews for new files
      imagePreviews.value = []
      newImages.forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          imagePreviews.value.push(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      })
    } else {
      imagePreviews.value = []
    }
  },
  { immediate: true, deep: true }
)

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
  const files = target.files
  if (!files || files.length === 0) return

  const currentImages = [...(props.formData.images || [])]
  const newImages: File[] = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]

    // Check max images limit
    if (currentImages.length + newImages.length >= MAX_IMAGES) {
      break
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: 'File too large',
        description: `"${file.name}" exceeds 5MB limit. Please choose a smaller file.`,
        variant: 'destructive'
      })
      continue
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: `"${file.name}" is not an image file.`,
        variant: 'destructive'
      })
      continue
    }

    newImages.push(file)
  }

  const allImages = [...currentImages, ...newImages]
  emit('imagesUpload', allImages)

  // Reset input
  target.value = ''
}

const removeImage = (index: number) => {
  const currentImages = [...(props.formData.images || [])]
  currentImages.splice(index, 1)
  imagePreviews.value.splice(index, 1)
  emit('imagesUpload', currentImages)
}

const handleSubmit = (status: 'published' | 'draft' | 'archived' | 'out-of-stock') => {
  emit('submit', status)
}

const canAddMore = computed(() => {
  return (props.formData.images?.length || 0) < MAX_IMAGES
})

const remainingSlots = computed(() => {
  return MAX_IMAGES - (props.formData.images?.length || 0)
})
</script>

<template>
  <Sheet :open="props.open" @update:open="emit('update:open', $event)">
    <SheetContent length="mid_low" class="flex flex-col space-y-0 overflow-y-scroll">
      <SheetHeader class="flex flex-col items-start px-4 pb-2">
        <SheetDescription class="text-xs text-muted-foreground">
          {{ props.isEditMode ? 'Doing!' : 'Doing!' }}
        </SheetDescription>
        <h3 class="text-2xl font-medium text-[#020721] italic">
          {{ props.isEditMode ? 'Edit Product' : 'New Product' }}
        </h3>
      </SheetHeader>

      <div class="px-4 space-y-4 flex-1">
        <!-- Drafted Date Display -->
        <div class="bg-[#F8F9FF] rounded-xl p-4">
          <p class="text-xs text-[#8B8D97]">Drafted Date</p>
          <p class="text-sm font-medium text-[#020721]">
            {{
              new Date().toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })
            }}
          </p>
        </div>

        <!-- Details Section with Save Button -->
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium text-[#020721]">Details</p>
          <button
            @click="handleSubmit(props.formData.status)"
            :disabled="props.loading"
            class="flex items-center gap-2 px-4 py-2 bg-[#020721] text-white text-sm font-medium rounded-full hover:bg-[#020721]/90 disabled:opacity-50 transition-colors"
          >
            Save
            <Icon icon="mdi:check" class="w-4 h-4" />
          </button>
        </div>

        <!-- Image Upload Section -->
        <div class="border border-dashed border-[#C4C7E3] rounded-xl p-4 bg-[#F8F9FF]">
          <!-- Upload Text Row - Always at top -->
          <div class="flex items-center gap-2 mb-4">
            <Icon icon="mdi:file-document-outline" class="w-6 h-6 text-[#8B8D97] flex-shrink-0" />
            <div>
              <p class="text-sm font-medium text-[#020721]">
                Upload {{ remainingSlots > 0 ? remainingSlots : 0 }} Product Picture{{
                  remainingSlots !== 1 ? 's' : ''
                }}
              </p>
              <p class="text-xs text-[#8B8D97]">
                Max file size: 2MB. Recommended Format: JPG or PNG.
              </p>
            </div>
          </div>

          <!-- Image Preview Slots Row -->
          <div class="flex gap-3 flex-wrap">
            <!-- Existing Images -->
            <div
              v-for="(preview, index) in imagePreviews"
              :key="index"
              class="relative w-20 h-20 rounded-lg overflow-hidden bg-[#E8EAFC] border-2 border-[#5B68DF] flex-shrink-0"
            >
              <img :src="preview" class="w-full h-full object-cover" alt="Preview" />
              <button
                @click="removeImage(index)"
                class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <Icon icon="mdi:close" class="w-3 h-3" />
              </button>
            </div>

            <!-- Empty Slots / Upload Button -->
            <label
              v-if="canAddMore"
              for="product-images"
              class="w-20 h-20 rounded-lg bg-[#E8EAFC] border-2 border-dashed border-[#C4C7E3] flex items-center justify-center cursor-pointer hover:border-[#5B68DF] hover:bg-[#E0E3F8] transition-colors flex-shrink-0"
            >
              <Icon icon="mdi:plus" class="w-6 h-6 text-[#8B8D97]" />
            </label>
          </div>

          <input
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            @change="handleImageUpload"
            class="hidden"
            id="product-images"
            multiple
          />
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 py-2">
          <button
            @click="updateField('status', 'archived')"
            :disabled="props.loading"
            :class="[
              'flex-1 px-4 py-2.5 rounded-full text-sm font-medium disabled:opacity-50 transition-colors',
              props.formData.status === 'archived'
                ? 'bg-[#020721] text-white hover:bg-[#020721]/90'
                : 'bg-white border border-gray-300 text-[#020721] hover:bg-gray-50'
            ]"
          >
            Archive
          </button>
          <button
            @click="updateField('status', 'draft')"
            :disabled="props.loading"
            :class="[
              'flex-1 px-4 py-2.5 rounded-full text-sm font-medium disabled:opacity-50 transition-colors',
              props.formData.status === 'draft'
                ? 'bg-[#020721] text-white hover:bg-[#020721]/90'
                : 'bg-white border border-gray-300 text-[#020721] hover:bg-gray-50'
            ]"
          >
            Draft
          </button>
          <button
            @click="updateField('status', 'published')"
            :disabled="props.loading"
            :class="[
              'flex-1 px-4 py-2.5 rounded-full text-sm font-medium disabled:opacity-50 transition-colors',
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
            <label class="text-sm text-[#8B8D97] mb-2 block"> Name </label>
            <input
              :value="props.formData.name"
              @input="updateField('name', ($event.target as HTMLInputElement).value)"
              type="text"
              placeholder="Enter product name"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5B68DF] bg-white"
            />
          </div>

          <div>
            <label class="text-sm text-[#8B8D97] mb-2 block"> Price </label>
            <input
              :value="props.formData.amount"
              @input="updateField('amount', ($event.target as HTMLInputElement).value)"
              type="number"
              placeholder="Enter price"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5B68DF] bg-white"
            />
          </div>

          <div>
            <label class="text-sm text-[#8B8D97] mb-2 block">Size</label>
            <input
              :value="props.formData.size"
              @input="updateField('size', ($event.target as HTMLInputElement).value)"
              type="text"
              placeholder="Enter size"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5B68DF] bg-white"
            />
          </div>

          <div>
            <label class="text-sm text-[#8B8D97] mb-2 block">Quantity</label>
            <input
              :value="props.formData.qty"
              @input="updateField('qty', ($event.target as HTMLInputElement).value)"
              type="number"
              placeholder="Enter available quantity"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5B68DF] bg-white"
            />
          </div>

          <!-- Category Selection -->
          <div>
            <label class="text-sm text-[#8B8D97] mb-2 block">
              Tag
              <span class="text-xs text-[#8B8D97] ml-1">{{ props.formData.tag.length }}/3</span>
            </label>
            <div v-if="props.loadingCategories" class="text-sm text-[#8B8D97]">
              Loading categories...
            </div>
            <div v-else>
              <input
                type="text"
                placeholder="Enter single word Tags, separate with commas"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5B68DF] bg-white mb-2"
                readonly
                :value="
                  props.categories
                    .filter((c) => props.formData.tag.includes(c._id))
                    .map((c) => c.name)
                    .join(', ')
                "
              />
              <div class="grid grid-cols-3 gap-2 max-h-[120px] overflow-y-auto">
                <div
                  v-for="category in props.categories"
                  :key="category._id"
                  @click="handleTagSelection(category._id)"
                  :class="[
                    'border rounded-lg px-3 py-2 cursor-pointer transition-colors text-xs text-center',
                    props.formData.tag.includes(category._id)
                      ? 'bg-[#5B68DF] text-white border-[#5B68DF]'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  ]"
                >
                  {{ category.name }}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label class="text-sm text-[#8B8D97] mb-2 block">
              Description
              <span class="text-xs text-[#8B8D97] ml-1"
                >{{ props.formData.description.length }}/50</span
              >
            </label>
            <textarea
              :value="props.formData.description"
              @input="updateField('description', ($event.target as HTMLTextAreaElement).value)"
              placeholder="Describe product in 50 characters"
              maxlength="50"
              rows="2"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5B68DF] resize-none bg-white"
            ></textarea>
          </div>

          <div>
            <label class="text-sm text-[#8B8D97] mb-2 block">Delivery TAT</label>
            <select
              :value="props.formData.tat"
              @change="updateField('tat', ($event.target as HTMLSelectElement).value)"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5B68DF] bg-white"
            >
              <option value="">Set estimated delivery time</option>
              <option v-for="option in deliveryTimeOptions" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>
