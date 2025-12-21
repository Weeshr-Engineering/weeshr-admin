<template>
  <Dialog :open="isOpen" @update:open="$emit('update:isOpen', $event)">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <Icon icon="mdi:alert-circle-outline" class="w-6 h-6 text-red-500" />
          Confirm Deletion
        </DialogTitle>
        <DialogDescription>
          Are you sure you want to delete the promotion "
          <span class="font-semibold text-[#020721]">{{ promotion?.name }}</span
          >"? This action cannot be undone and will permanently remove the promotion.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter class="flex flex-col sm:flex-row gap-2 sm:gap-0">
        <Button variant="outline" @click="$emit('update:isOpen', false)" class="w-full sm:w-auto">
          Cancel
        </Button>
        <Button
          variant="destructive"
          @click="$emit('confirm')"
          :disabled="loading"
          class="w-full sm:w-auto"
        >
          <Icon icon="mdi:delete" class="w-4 h-4 mr-2" />
          {{ loading ? 'Deleting...' : 'Delete Promotion' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import type { Promotion } from '@/stores/vendor-store/vendor-promotion'

defineProps<{
  isOpen: boolean
  promotion: Promotion | null
  loading: boolean
}>()

defineEmits<{
  (e: 'update:isOpen', value: boolean): void
  (e: 'confirm'): void
}>()
</script>
