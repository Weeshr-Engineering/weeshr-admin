<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

interface Props {
  modelValue: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const isOpen = ref(false)
const activeTab = ref<'presets' | 'numbers'>('presets')
const numberSearch = ref('')

const clothingSizes = ['n/a', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl']
const unitSizes = ['litre', 'kg', 'g']

// Generate numbers 1 to 100
const allNumbers = Array.from({ length: 100 }, (_, i) => (i + 1).toString())

// Filtered numbers based on search
const filteredNumbers = computed(() => {
  const query = numberSearch.value.trim()
  if (!query) return allNumbers
  return allNumbers.filter((num) => num.includes(query))
})

const selectSize = (value: string) => {
  emit('update:modelValue', value)
  isOpen.value = false
}
</script>

<template>
  <div class="relative w-full">
    <!-- Input Wrapper with Chevron Button -->
    <div class="relative w-full">
      <input
        type="text"
        :value="props.modelValue"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        placeholder="Size (e.g. M, 38, 500ml)"
        class="w-full pl-3 pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5B68DF] bg-white text-[#020721]"
      />
      <Popover v-model:open="isOpen">
        <PopoverTrigger as-child>
          <button
            type="button"
            class="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
            title="Select size preset"
          >
            <Icon icon="mdi:chevron-down" class="w-4 h-4" />
          </button>
        </PopoverTrigger>

        <PopoverContent class="w-72 p-3 bg-white border border-gray-100 rounded-xl shadow-xl z-[9999]" align="end">
          <!-- Tab Navigation -->
          <div class="flex border-b border-gray-100 mb-3">
            <button
              type="button"
              @click="activeTab = 'presets'"
              :class="[
                'flex-1 pb-2 text-xs font-semibold text-center uppercase tracking-wider border-b-2 transition-colors',
                activeTab === 'presets'
                  ? 'border-[#5B68DF] text-[#5B68DF]'
                  : 'border-transparent text-[#8B8D97] hover:text-[#020721]'
              ]"
            >
              Presets
            </button>
            <button
              type="button"
              @click="activeTab = 'numbers'"
              :class="[
                'flex-1 pb-2 text-xs font-semibold text-center uppercase tracking-wider border-b-2 transition-colors',
                activeTab === 'numbers'
                  ? 'border-[#5B68DF] text-[#5B68DF]'
                  : 'border-transparent text-[#8B8D97] hover:text-[#020721]'
              ]"
            >
              Numbers
            </button>
          </div>

          <!-- Tab Content: Presets -->
          <div v-if="activeTab === 'presets'" class="space-y-4">
            <!-- Clothing sizes group -->
            <div>
              <p class="text-[10px] font-semibold text-[#8B8D97] mb-2 uppercase tracking-wider">Clothing</p>
              <div class="grid grid-cols-4 gap-2">
                <button
                  v-for="size in clothingSizes"
                  :key="size"
                  type="button"
                  @click="selectSize(size)"
                  :class="[
                    'py-1.5 px-2 text-xs font-medium border rounded-lg transition-all capitalize',
                    props.modelValue.toLowerCase() === size.toLowerCase()
                      ? 'bg-[#5B68DF] text-white border-[#5B68DF]'
                      : 'bg-white border-gray-200 text-[#020721] hover:bg-gray-50'
                  ]"
                >
                  {{ size }}
                </button>
              </div>
            </div>

            <!-- Units sizes group -->
            <div>
              <p class="text-[10px] font-semibold text-[#8B8D97] mb-2 uppercase tracking-wider">Units</p>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="size in unitSizes"
                  :key="size"
                  type="button"
                  @click="selectSize(size)"
                  :class="[
                    'py-1.5 px-2 text-xs font-medium border rounded-lg transition-all capitalize',
                    props.modelValue.toLowerCase() === size.toLowerCase()
                      ? 'bg-[#5B68DF] text-white border-[#5B68DF]'
                      : 'bg-white border-gray-200 text-[#020721] hover:bg-gray-50'
                  ]"
                >
                  {{ size }}
                </button>
              </div>
            </div>
          </div>

          <!-- Tab Content: Numbers -->
          <div v-else class="space-y-3">
            <!-- Search field inside popover -->
            <div class="relative">
              <Icon icon="mdi:magnify" class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                v-model="numberSearch"
                placeholder="Search number..."
                class="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#5B68DF] text-[#020721]"
              />
            </div>

            <!-- Number list -->
            <div class="max-h-48 overflow-y-auto grid grid-cols-5 gap-1.5 pr-1">
              <button
                v-for="num in filteredNumbers"
                :key="num"
                type="button"
                @click="selectSize(num)"
                :class="[
                  'py-1.5 text-xs font-medium border rounded-lg transition-all',
                  props.modelValue === num
                    ? 'bg-[#5B68DF] text-white border-[#5B68DF]'
                    : 'bg-white border-gray-200 text-[#020721] hover:bg-gray-50'
                ]"
              >
                {{ num }}
              </button>

              <div
                v-if="filteredNumbers.length === 0"
                class="col-span-5 text-center py-4 text-xs text-[#8B8D97]"
              >
                No matching numbers
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  </div>
</template>
