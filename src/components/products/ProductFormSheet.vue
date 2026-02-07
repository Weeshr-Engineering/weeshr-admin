<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Sheet, SheetContent, SheetHeader, SheetDescription } from '@/components/ui/sheet'
import { Icon } from '@iconify/vue'
import { useToast } from '@/components/ui/toast'

interface Category {
  _id: string
  name: string
}

// Config-based variant structure
interface ProductConfigItem {
  color: string
  size: string
  amount: string
  qty: string
}

interface FormData {
  name: string
  description: string
  tat: string
  tag: string[]
  images: File[]
  existingImages: string[] // URLs of existing images when editing
  status: 'published' | 'draft' | 'archived' | 'out-of-stock'
  config: ProductConfigItem[]
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

// Predefined options for colors and sizes
const colorOptions = [
  'n/a',
  'white',
  'black',
  'red',
  'blue',
  'green',
  'yellow',
  'pink',
  'purple',
  'orange',
  'brown',
  'grey'
]
const sizeOptions = ['n/a', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl', 'litre', 'kg', 'g']

// Local state for image previews
const imagePreviews = ref<string[]>([])
const MAX_IMAGES = 3
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

// Toggle state for config section visibility
const showConfigSection = ref(false)

// Computed: Check if config has valid entries with qty
const hasValidConfig = computed(() => {
  return props.formData.config.some((c) => c.qty && Number(c.qty) > 0)
})

// Computed: Total qty from all config items
const totalConfigQty = computed(() => {
  return props.formData.config.reduce((sum, c) => sum + (Number(c.qty) || 0), 0)
})

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

// Watch for config changes to auto-expand section when editing product with variants
watch(
  () => props.formData.config,
  (newConfig) => {
    // Auto-open config section if any config item has amount and qty filled
    const hasValidEntries = newConfig.some((c) => c.amount && c.qty)
    if (hasValidEntries) {
      showConfigSection.value = true
    }
  },
  { immediate: true, deep: true }
)

const updateField = (field: keyof FormData, value: any) => {
  emit('update:formData', { ...props.formData, [field]: value })
}

// Config management functions
const addConfigRow = () => {
  const newConfig = [...props.formData.config, { color: '', size: '', amount: '', qty: '' }]
  updateField('config', newConfig)
}

const removeConfigRow = (index: number) => {
  if (props.formData.config.length <= 1) {
    toast({
      description: 'At least one variant configuration is required',
      variant: 'destructive'
    })
    return
  }
  const newConfig = props.formData.config.filter((_, i) => i !== index)
  updateField('config', newConfig)
}

const updateConfigItem = (index: number, field: keyof ProductConfigItem, value: string) => {
  const newConfig = [...props.formData.config]
  newConfig[index] = { ...newConfig[index], [field]: value }
  updateField('config', newConfig)
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

// Remove existing URL image
const removeExistingImage = (index: number) => {
  const existingImages = [...(props.formData.existingImages || [])]
  existingImages.splice(index, 1)
  updateField('existingImages', existingImages)
}

const handleSubmit = (status: 'published' | 'draft' | 'archived' | 'out-of-stock') => {
  emit('submit', status)
}

const canAddMore = computed(() => {
  const totalImages =
    (props.formData.images?.length || 0) + (props.formData.existingImages?.length || 0)
  return totalImages < MAX_IMAGES
})

const remainingSlots = computed(() => {
  const totalImages =
    (props.formData.images?.length || 0) + (props.formData.existingImages?.length || 0)
  return MAX_IMAGES - totalImages
})

// Toggle config section visibility
const toggleConfigSection = () => {
  showConfigSection.value = !showConfigSection.value
}

// Computed: Get label for save button based on selected status
const saveButtonLabel = computed(() => {
  switch (props.formData.status) {
    case 'published':
      return 'Publish'
    case 'draft':
      return 'Save as Draft'
    case 'archived':
      return 'Save as Archive'
    case 'out-of-stock':
      return 'Save as Out of Stock'
    default:
      return 'Save'
  }
})

// Toggle config section visibility
const toggleConfigSection = () => {
  showConfigSection.value = !showConfigSection.value
}

// Computed: Get label for save button based on selected status
const saveButtonLabel = computed(() => {
  switch (props.formData.status) {
    case 'published':
      return 'Publish'
    case 'draft':
      return 'Save as Draft'
    case 'archived':
      return 'Save as Archive'
    case 'out-of-stock':
      return 'Save as Out of Stock'
    default:
      return 'Save'
  }
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
            class="flex items-center gap-2 px-4 py-2 bg-[#4145A7] text-white text-sm font-medium rounded-full hover:bg-[#020721]/90 disabled:opacity-50 transition-colors"
          >
            Save
            <img src="@/assets/directindox.svg" alt="save" class="w-4 h-4" />
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
            <!-- Existing Images (URLs from server) -->
            <div
              v-for="(imageUrl, index) in props.formData.existingImages"
              :key="'existing-' + index"
              class="relative w-20 h-20 rounded-lg overflow-hidden bg-[#E8EAFC] border-2 border-green-500 flex-shrink-0"
            >
              <img :src="imageUrl" class="w-full h-full object-cover" alt="Existing" />
              <button
                @click="removeExistingImage(index)"
                class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <Icon icon="mdi:close" class="w-3 h-3" />
              </button>
            </div>

            <!-- New File Previews -->
            <div
              v-for="(preview, index) in imagePreviews"
              :key="'new-' + index"
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
                >{{ props.formData.description.length }}/150</span
              >
            </label>
            <textarea
              :value="props.formData.description"
              @input="updateField('description', ($event.target as HTMLTextAreaElement).value)"
              placeholder="Describe product in 150 characters"
              maxlength="150"
              rows="3"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5B68DF] resize-none bg-white"
            ></textarea>
          </div>

          <!-- Price Field (for simple products without variants) -->
          <div v-if="!showConfigSection" class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-sm text-[#8B8D97] mb-2 block">Price</label>
              <input
                :value="props.formData.amount"
                @input="updateField('amount', ($event.target as HTMLInputElement).value)"
                type="number"
                placeholder="₦0"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5B68DF] bg-white"
              />
            </div>
            <div>
              <label class="text-sm text-[#8B8D97] mb-2 block">Quantity</label>
              <input
                :value="props.formData.qty"
                @input="updateField('qty', ($event.target as HTMLInputElement).value)"
                type="number"
                placeholder="0"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5B68DF] bg-white"
              />
            </div>
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

          <!-- Total Quantity (only shown when using variants) -->
          <div v-if="showConfigSection && hasValidConfig">
            <label class="text-sm text-[#8B8D97] mb-2 block">
              Total Quantity
              <span class="text-xs text-[#5B68DF] ml-1">(Sum of variants)</span>
            </label>
            <input
              :value="totalConfigQty"
              type="number"
              placeholder="Enter total quantity"
              readonly
              class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5B68DF] bg-gray-100 cursor-not-allowed"
            />
          </div>

          <!-- Variants Configuration Section -->
          <div class="border-t border-gray-200 pt-4 mt-4">
            <div class="flex items-center justify-between mb-3">
              <label class="text-sm font-medium text-[#020721]">Product Variants</label>
              <button
                type="button"
                @click="toggleConfigSection"
                class="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#5B68DF] hover:bg-[#F8F9FF] rounded-full transition-colors"
              >
                <Icon
                  :icon="showConfigSection ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                  class="w-4 h-4"
                />
                {{ showConfigSection ? 'Hide' : 'Show' }} Variants
              </button>
            </div>

            <!-- Collapsible Config Content -->
            <div v-show="showConfigSection">
              <!-- Config Rows -->
              <div class="space-y-3">
                <div
                  v-for="(configItem, index) in props.formData.config"
                  :key="index"
                  class="bg-[#F8F9FF] rounded-xl p-4"
                >
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-xs font-medium text-[#5B68DF]">Variant {{ index + 1 }}</span>
                    <button
                      v-if="props.formData.config.length > 1"
                      @click="removeConfigRow(index)"
                      class="text-red-500 hover:text-red-600 transition-colors"
                    >
                      <Icon icon="mdi:close-circle" class="w-5 h-5" />
                    </button>
                  </div>

                  <div class="grid grid-cols-2 gap-3">
                    <!-- Color Dropdown -->
                    <div>
                      <label class="text-xs text-[#8B8D97] mb-1 block">Color</label>
                      <select
                        :value="configItem.color"
                        @change="
                          updateConfigItem(
                            index,
                            'color',
                            ($event.target as HTMLSelectElement).value
                          )
                        "
                        class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5B68DF] bg-white"
                      >
                        <option value="">Select color</option>
                        <option v-for="color in colorOptions" :key="color" :value="color">
                          {{ color }}
                        </option>
                      </select>
                    </div>

                    <!-- Size Dropdown -->
                    <div>
                      <label class="text-xs text-[#8B8D97] mb-1 block">Size</label>
                      <select
                        :value="configItem.size"
                        @change="
                          updateConfigItem(
                            index,
                            'size',
                            ($event.target as HTMLSelectElement).value
                          )
                        "
                        class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5B68DF] bg-white"
                      >
                        <option value="">Select size</option>
                        <option v-for="size in sizeOptions" :key="size" :value="size">
                          {{ size }}
                        </option>
                      </select>
                    </div>

                    <!-- Price Input -->
                    <div>
                      <label class="text-xs text-[#8B8D97] mb-1 block">Price</label>
                      <input
                        :value="configItem.amount"
                        @input="
                          updateConfigItem(
                            index,
                            'amount',
                            ($event.target as HTMLInputElement).value
                          )
                        "
                        type="number"
                        placeholder="₦0"
                        class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5B68DF] bg-white"
                      />
                    </div>

                    <!-- Quantity Input -->
                    <div>
                      <label class="text-xs text-[#8B8D97] mb-1 block">Available Quantity</label>
                      <input
                        :value="configItem.qty"
                        @input="
                          updateConfigItem(index, 'qty', ($event.target as HTMLInputElement).value)
                        "
                        type="number"
                        placeholder="0"
                        class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5B68DF] bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Add Another Size Button -->
              <button
                @click="addConfigRow"
                type="button"
                class="w-full mt-3 px-4 py-3 border-2 border-dashed border-[#5B68DF] rounded-xl text-[#5B68DF] text-sm font-medium hover:bg-[#F8F9FF] transition-colors flex items-center justify-center gap-2"
              >
                <Icon icon="mdi:plus" class="w-4 h-4" />
                Add other sizes
              </button>
            </div>
          </div>
        </div>

        <!-- Bottom Action Button -->
        <div class="px-4 py-4 border-t border-gray-200">
          <button
            @click="handleSubmit(props.formData.status)"
            :disabled="props.loading"
            class="w-full px-4 py-3 bg-[#020721] text-white rounded-lg text-sm font-medium hover:bg-[#020721]/90 disabled:opacity-50 transition-colors"
          >
            {{ saveButtonLabel }}
          </button>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>
