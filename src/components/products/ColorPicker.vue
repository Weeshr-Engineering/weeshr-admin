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

const standardColors = [
  { name: 'N/A', value: 'n/a', hex: 'transparent' },
  { name: 'White', value: 'white', hex: '#ffffff' },
  { name: 'Black', value: 'black', hex: '#000000' },
  { name: 'Red', value: 'red', hex: '#ef4444' },
  { name: 'Blue', value: 'blue', hex: '#3b82f6' },
  { name: 'Green', value: 'green', hex: '#10b981' },
  { name: 'Yellow', value: 'yellow', hex: '#f59e0b' },
  { name: 'Pink', value: 'pink', hex: '#ec4899' },
  { name: 'Purple', value: 'purple', hex: '#8b5cf6' },
  { name: 'Orange', value: 'orange', hex: '#f97316' },
  { name: 'Brown', value: 'brown', hex: '#78350f' },
  { name: 'Grey', value: 'grey', hex: '#6b7280' }
]

// Popover open state
const isOpen = ref(false)

// Native color input ref
const colorInputRef = ref<HTMLInputElement | null>(null)

// Check if current value is one of the standard colors
const activeStandardColor = computed(() => {
  return standardColors.find((c) => c.value === props.modelValue.toLowerCase())
})

// Hex value display/input
const customHexValue = ref(
  props.modelValue && props.modelValue.startsWith('#') ? props.modelValue : '#5b68df'
)

// Trigger native color picker
const triggerNativePicker = () => {
  colorInputRef.value?.click()
}

// Handle native color picker input
const onNativeColorChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const hex = target.value
  customHexValue.value = hex
  emit('update:modelValue', hex)
}

// Handle manual hex input change
const onHexTextInputChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  let val = target.value.trim()
  if (val && !val.startsWith('#')) {
    val = '#' + val
  }
  // Validate basic hex structure
  if (/^#[0-9A-F]{6}$/i.test(val)) {
    customHexValue.value = val
    emit('update:modelValue', val)
  } else {
    // If invalid, update local ref to match what was typed so user sees it
    customHexValue.value = val
  }
}

// Select a color
const selectColor = (value: string) => {
  emit('update:modelValue', value)
  isOpen.value = false
}

// Color preview styles
const getPreviewStyle = (colorVal: string) => {
  if (colorVal === 'n/a') {
    return {
      background: 'linear-gradient(135deg, #e2e8f0 45%, #ef4444 45%, #ef4444 55%, #e2e8f0 55%)'
    }
  }
  const std = standardColors.find((c) => c.value === colorVal.toLowerCase())
  if (std) {
    return { backgroundColor: std.hex }
  }
  if (colorVal.startsWith('#')) {
    return { backgroundColor: colorVal }
  }
  return { backgroundColor: '#e2e8f0' } // Fallback
}
</script>

<template>
  <div class="w-full">
    <Popover v-model:open="isOpen">
      <PopoverTrigger as-child>
        <button
          type="button"
          class="flex items-center justify-between w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#5B68DF]"
        >
          <div class="flex items-center gap-2 overflow-hidden">
            <!-- Swatch color indicator -->
            <span
              class="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
              :style="getPreviewStyle(props.modelValue || 'n/a')"
            ></span>
            <span class="truncate capitalize font-normal text-[#020721]">
              {{ activeStandardColor ? activeStandardColor.name : props.modelValue || 'Select color' }}
            </span>
          </div>
          <Icon icon="mdi:chevron-down" class="w-4 h-4 text-gray-400 flex-shrink-0" />
        </button>
      </PopoverTrigger>

      <PopoverContent class="w-72 p-3 bg-white border border-gray-100 rounded-xl shadow-xl z-[9999]" align="start">
        <p class="text-xs font-semibold text-[#8B8D97] mb-2 uppercase tracking-wider">Select Color</p>

        <!-- Standard Colors Grid -->
        <div class="grid grid-cols-4 gap-2 mb-4">
          <button
            v-for="color in standardColors"
            :key="color.value"
            type="button"
            @click="selectColor(color.value)"
            class="flex flex-col items-center p-1 rounded-lg hover:bg-gray-50 transition-colors group relative"
            :title="color.name"
          >
            <span
              class="w-8 h-8 rounded-full border flex-shrink-0 transition-transform group-hover:scale-110"
              :class="[
                color.value === 'white' ? 'border-gray-300' : 'border-transparent',
                props.modelValue.toLowerCase() === color.value ? 'ring-2 ring-[#5B68DF] ring-offset-2' : ''
              ]"
              :style="getPreviewStyle(color.value)"
            ></span>
            <span class="text-[10px] text-gray-500 mt-1 max-w-[50px] truncate text-center leading-tight">
              {{ color.name }}
            </span>
          </button>
        </div>

        <div class="border-t border-gray-100 pt-3">
          <p class="text-xs font-semibold text-[#8B8D97] mb-2 uppercase tracking-wider">Custom Color</p>

          <div class="flex items-center gap-2">
            <!-- Selected Custom Color Swatch / Button -->
            <button
              type="button"
              @click="triggerNativePicker"
              class="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors group flex-shrink-0 relative"
              :style="getPreviewStyle(customHexValue)"
              title="Open Color Picker"
            >
              <Icon
                icon="mdi:plus"
                class="w-5 h-5 mix-blend-difference invert text-white opacity-60 group-hover:opacity-100 transition-opacity"
              />
              <input
                ref="colorInputRef"
                type="color"
                :value="customHexValue"
                @input="onNativeColorChange"
                class="absolute inset-0 w-0 h-0 opacity-0 pointer-events-none"
              />
            </button>

            <!-- Custom Hex Input -->
            <div class="relative flex-1">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">Hex</span>
              <input
                type="text"
                :value="props.modelValue && props.modelValue.startsWith('#') ? props.modelValue : ''"
                @input="onHexTextInputChange"
                placeholder="#5B68DF"
                maxlength="7"
                class="w-full pl-11 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5B68DF] text-[#020721]"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  </div>
</template>
