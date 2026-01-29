<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'
import type { Product } from '@/stores/vendor/product'

interface Props {
  open: boolean
  product: Product | null
  loading?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'confirm'): void
}>()

const closeDialog = () => {
  emit('update:open', false)
}

const handleConfirm = () => {
  emit('confirm')
}
</script>

<template>
  <Dialog :open="props.open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <Icon icon="mdi:alert-circle-outline" class="w-6 h-6 text-red-500" />
          Confirm Deletion
        </DialogTitle>
        <DialogDescription>
          Are you sure you want to delete the product "
          <span class="font-semibold text-[#020721]">{{ props.product?.name }}</span
          >"? This action cannot be undone and will permanently remove the product from your store.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter class="flex flex-col sm:flex-row gap-2 sm:gap-0">
        <Button variant="outline" @click="closeDialog" class="w-full sm:w-auto"> Cancel </Button>
        <Button
          variant="destructive"
          @click="handleConfirm"
          :disabled="props.loading"
          class="w-full sm:w-auto"
        >
          <Icon icon="mdi:delete" class="w-4 h-4 mr-2" />
          {{ props.loading ? 'Deleting...' : 'Delete Product' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
