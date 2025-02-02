<template>
  <div class="flex gap-2 flex-wrap justify-center lg:justify-end mt-8 items-center text-[15px]">
    <Pagination :total="pageTotal" :sibling-count="1" show-edges :default-page="1">
      <PaginationList class="flex items-center gap-2 w-8/12 md:w-full justify-center flex-wrap">
        <Button
          class="w-10 h-10 p-0"
          variant="outline"
          @click="handlePageChange(1)"
          :disabled="pageCurrent == 1"
        >
          <Icon icon="heroicons:chevron-double-left-20-solid" />
        </Button>
        <Button
          class="w-10 h-10 p-0"
          variant="outline"
          @click="() => handlePageChange(pageCurrent - 1)"
          :disabled="pageCurrent == 1"
        >
          <Icon icon="heroicons:chevron-left-20-solid" />
        </Button>

        <template v-for="(item, index) in visiblePaginationItems" :key="index">
          <PaginationListItem :value="index" as-child>
            <Button
              class="w-10 h-10 p-0"
              :variant="item === props.pageCurrent ? 'default' : 'outline'"
              @click="() => handlePageChange(item)"
            >
              {{ item }}
            </Button>
          </PaginationListItem>
        </template>
        <Button
          class="w-10 h-10 p-0"
          variant="outline"
          @click="() => handlePageChange(pageCurrent + 1)"
          :disabled="pageCurrent === pageTotal"
        >
          <Icon icon="heroicons:chevron-right-20-solid" />
        </Button>
        <Button
          class="w-10 h-10 p-0"
          variant="outline"
          @click="() => handlePageChange(pageTotal)"
          :disabled="pageCurrent === pageTotal"
        >
          <Icon icon="heroicons:chevron-double-right-20-solid" />
        </Button>
      </PaginationList>
    </Pagination>
    <p>
      Showing
      <input
        class="w-10 h-10 ps-2 border-2 rounded-lg text-black mx-1"
        ref="pageInput"
        type="number"
        @keyup="(e) => handlePageInput(e)"
        :value="props.pageCurrent"
        min="1"
        :max="props.pageTotal"
        step="1"
      />
      of {{ props.pageTotal }} page(s)
    </p>
  </div>
</template>

<script setup lang="ts">
import { Pagination, PaginationList, PaginationListItem } from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'
import { useUserTablePageStore } from '@/stores/userTableStore'
import { computed } from 'vue'

const paginationItems = computed(() => {
  const pages = []
  for (let i = 1; i <= props.pageTotal; i++) {
    pages.push(i)
  }
  return pages
})

const visiblePaginationItems = computed(() => {
  const totalItems = paginationItems.value.length
  const currentPage = props.pageCurrent
  if (totalItems <= 3) {
    return paginationItems.value
  } else {
    let start = Math.max(1, currentPage - 1)
    let end = Math.min(totalItems, currentPage + 1)

    if (currentPage === 1 && totalItems > 3) {
      end = Math.min(totalItems, 3)
    }

    return paginationItems.value.slice(start - 1, end)
  }
})

const props = defineProps({
  pageTotal: {
    type: Number,
    required: true
  },
  pageCurrent: {
    type: Number,
    required: true
  }
})

const emits = defineEmits(['pagination'])

const store = useUserTablePageStore()

const handlePageChange = (page: number) => {
  const pageNum = page > props.pageTotal ? props.pageTotal : page

  store.setCurrentPage(pageNum)
  emits('pagination', pageNum)
}

const handlePageInput = (e: KeyboardEvent) => {
  e.preventDefault()
  const target = e.target as HTMLInputElement
  if (e.key === 'Enter') {
    const page = parseInt(target.value)
    const pageNum = page > props.pageTotal ? props.pageTotal : page

    store.setCurrentPage(pageNum)
    emits('pagination', pageNum)
  }
}
</script>
