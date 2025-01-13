<template>
  <div class="flex gap-2 flex-wrap justify-center lg:justify-end mt-8 items-center text-[15px]">
    <Pagination :total="pageTotal" :sibling-count="1" show-edges :default-page="1">
      <PaginationList class="flex items-center gap-2 w-8/12 md:w-full justify-center flex-wrap">
        <Button
          class="w-5 h-5 p-0"
          variant="outline"
          @click="handlePageChange(1)"
          :disabled="pageCurrent == 1"
        >
          <Icon icon="heroicons:chevron-double-left-20-solid" />
        </Button>
        <Button
          class="w-5 h-5 p-0"
          variant="outline"
          @click="() => handlePageChange(pageCurrent - 1)"
          :disabled="pageCurrent == 1"
        >
          <Icon icon="heroicons:chevron-left-20-solid" />
        </Button>

        <div class="flex space-x-2 w-15 h-7 border-2 rounded-xl p-1 items-center">
          <input
            class="w-6 h-3 border-none active:border-none focus:border-none focus:outline-none text-black ms-2"
            ref="pageInput"
            type="number"
            @keyup="(e) => handlePageInput(e)"
            :value="props.pageCurrent"
            min="1"
            :max="props.pageTotal"
            step="1"
          />
          <DropdownMenu>
            <DropdownMenuTrigger
              ><Icon icon="oui:arrow-down" width="16" height="16"
            /></DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                v-for="(item, index) in dropDown"
                v-bind:key="index"
                @click="() => handlePageChange(item)"
                >{{ item.toLocaleString() }}</DropdownMenuItem
              >
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button
          class="w-5 h-5 p-0"
          variant="outline"
          @click="() => handlePageChange(pageCurrent + 1)"
          :disabled="pageCurrent === pageTotal"
        >
          <Icon icon="heroicons:chevron-right-20-solid" />
        </Button>
        <Button
          class="w-5 h-5 p-0"
          variant="outline"
          @click="() => handlePageChange(pageTotal)"
          :disabled="pageCurrent === pageTotal"
        >
          <Icon icon="heroicons:chevron-double-right-20-solid" />
        </Button>
      </PaginationList>
    </Pagination>
    <p>Showing {{ props.pageCurrent }} of {{ props.pageTotal }} page(s)</p>
  </div>
</template>

<script setup lang="ts">
import { Pagination, PaginationList } from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useUserTablePageStore } from '@/stores/userTableStore'

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

const dropDown = [10, 50, 100, 200, 500, 1000, 2000, 4000, 5000, 7000, 10000, 20000]
</script>
