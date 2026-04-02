<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

interface SelectOption {
  label: string
  value: string | number
}

interface Props {
  modelValue?: string | number
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  id?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select an option',
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const isOpen = ref(false)
const showAbove = ref(false)
const selectedLabel = computed(() => {
  const selected = props.options.find(opt => opt.value === props.modelValue)
  return selected?.label || props.placeholder
})

const dropdownRef = ref<HTMLElement | null>(null)
const dropdownMenuRef = ref<HTMLElement | null>(null)

const checkDropdownPosition = async () => {
  if (!isOpen.value || !dropdownRef.value || !dropdownMenuRef.value) return

  // Wait for the DOM to render
  await nextTick()

  const triggerRect = dropdownRef.value.getBoundingClientRect()
  const menuHeight = dropdownMenuRef.value.offsetHeight
  const spaceBelow = window.innerHeight - triggerRect.bottom
  const spaceAbove = triggerRect.top

  // If there's not enough space below but enough above, show above
  if (spaceBelow < menuHeight + 20 && spaceAbove > menuHeight + 20) {
    showAbove.value = true
  } else {
    showAbove.value = false
  }
}

const toggle = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
    if (isOpen.value) {
      checkDropdownPosition()
    }
  }
}

const selectOption = (option: SelectOption) => {
  emit('update:modelValue', option.value)
  isOpen.value = false
}

const handleClickOutside = (e: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="dropdownRef" class="relative w-full">
    <!-- Trigger Button -->
    <button
      type="button"
      :id="id"
      :disabled="disabled"
      @click="toggle"
      class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
      <span class="line-clamp-1">{{ selectedLabel }}</span>
      <ChevronDown
        class="h-4 w-4 opacity-50 transition-transform"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <!-- Dropdown Menu -->
    <transition
      enter-active-class="animate-in fade-in-0 zoom-in-95 duration-200"
      leave-active-class="animate-out fade-out-0 zoom-out-95 duration-200"
      enter-from-class="opacity-0 scale-95"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-show="isOpen"
        ref="dropdownMenuRef"
        :class="[
          'absolute left-0 z-[9999] w-full rounded-md border border-input bg-popover text-popover-foreground shadow-md overflow-hidden',
          showAbove ? 'bottom-full mb-2' : 'top-full mt-2'
        ]"
      >
        <div class="max-h-72 min-w-48 overflow-y-auto p-1">
          <button
            v-for="option in options"
            :key="option.value"
            type="button"
            @click="selectOption(option)"
            :class="cn('relative flex w-fit cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50', props.modelValue === option.value ? 'bg-accent text-accent-foreground' : '')">
            <span v-if="props.modelValue === option.value" class="absolute left-2 flex h-3.5 w-3.5 items-center justify-left">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-4 w-4"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            {{ option.label }}
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>
