<template>
  <div class="flex-col flex bg-[#f0f8ff] h-full px-4 sm:px-10 pb-10">
    <MainNav class="mx-6" headingText="Activity Log" />

    <Card class="container px-4 pt-6 pb-10 mx-auto sm:px-6 lg:px-8 bg-[#FFFFFF] rounded-2xl mt-14 mb-4">
      <div class="flex flex-col gap-4 lg:flex-row items-center justify-between px-2 sm:px-6 py-4 w-full">
        <div class="text-xl sm:text-xl font-bold tracking-tight text-[#020721] mb-2 sm:mb-0">
          Activity Log
          <p class="text-xs sm:text-sm font-normal text-[#02072199]">
            List of Activity logs
          </p>
        </div>
        <div class="items-center grid grid-cols-3 md:grid-cols-3 gap-4 flex-row">
          <DropdownMenu>
            <DropdownMenuTrigger as-child class="rounded-2xl bg-[#EEEFF5]">
              <Button variant="outline">
                <div class="flex items-center text-[10px] md:text-xs">
                  {{ filters.log_action || 'All Actions' }}
                  <Icon icon="ion:chevron-down-outline" class="ml-1" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="item-center justify-between max-h-80 overflow-y-auto">
              <DropdownMenuLabel class="item-center justify-center text-center">
                Select Action
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup v-model="filters.log_action">
                <DropdownMenuRadioItem value="" class="item-center text-center">
                  All Actions
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem v-for="action in actionTypes" :key="action" :value="action"
                  class="item-center text-center">
                  {{ action }}
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger as-child class="rounded-2xl bg-[#EEEFF5]">
              <Button variant="outline">
                <div class="flex items-center text-[10px] md:text-xs">
                  {{ filters.log_status || 'All Status' }}
                  <Icon icon="ion:chevron-down-outline" class="ml-1" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="item-center justify-between max-h-60 overflow-y-auto">
              <DropdownMenuLabel class="item-center justify-center text-center">
                Select Status
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup v-model="filters.log_status">
                <DropdownMenuRadioItem value="" class="item-center text-center">
                  All Status
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem v-for="status in statusTypes" :key="status" :value="status"
                  class="item-center text-center">
                  {{ status }}
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger as-child class="rounded-2xl bg-[#EEEFF5]">
              <Button variant="outline">
                <div class="flex items-center text-[10px] md:text-xs">
                  {{ filters.log_user_type || 'All Users' }}
                  <Icon icon="ion:chevron-down-outline" class="ml-1" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="item-center justify-between max-h-60 overflow-y-auto">
              <DropdownMenuLabel class="item-center justify-center text-center">
                Select User
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup v-model="filters.log_user_type">
                <DropdownMenuRadioItem value="" class="item-center text-center">
                  All Users
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem v-for="user in userTypes" :key="user" :value="user"
                  class="item-center text-center">
                  {{ user }}
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Search class="mt-3 lg:mt-0" />
      </div>

      <div class="overflow-auto bg-white rounded-lg shadow">
        <Table class="">
          <TableHeader>
            <TableRow class="text-[#02072199] font-semibold bg-gray-200">
              <TableHead class="text-sm">
                <div class="flex items-center cursor-pointer" @click="toggleSortOrder">
                  Timestamp
                  <Icon
                    :icon="filters.sort_direction === 'desc' ? 'fluent:chevron-down-20-regular' : 'fluent:chevron-up-20-regular'"
                    class="ml-1" />
                </div>
              </TableHead>
              <TableHead class="text-left">User</TableHead>
              <TableHead class="text-left">Email</TableHead>
              <TableHead class="text-left">Action</TableHead>
              <TableHead class="text-left">Status</TableHead>
              <TableHead class="text-left">Description</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow v-for="log in logs" :key="log.id">
              <TableCell class="text-xs md:text-sm lg:text-xs">{{ new Date(log.timestamp).toLocaleString() }}
              </TableCell>
              <TableCell class="text-xs md:text-sm lg:text-xs">{{ log.user.extras.lastName + ' ' +
                log.user.extras.firstName }}</TableCell>
              <TableCell class="text-xs md:text-sm lg:text-xs">{{ log.user.extras.email }}</TableCell>
              <TableCell class="text-xs md:text-sm lg:text-xs">{{ log.action }}</TableCell>
              <TableCell>
                <div :class="statusBg(log.status)"
                  class="rounded-[10px] w-fit px-1.5 py-0.5 text-white text-xs capitalize">
                  {{ log.status }}
                </div>
              </TableCell>
              <TableCell class="text-xs md:text-sm lg:text-xs min-w-full">{{ log.description }}</TableCell>
              <TableCell @click="openModal(log)">
                <Icon icon="uil:angle-right" class="ml-1" width="25" height="25" />

              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <ModalComponent v-if="selectedLog" :action="selectedLog.action" :resource="selectedLog.resource"
        :metadata="selectedLog.metadata" :show="isModalVisible" @close="isModalVisible = false" />

      <div class="flex gap-2 max-w-full flex-wrap justify-end mt-8 mr-4 items-center text-[15px]">
        <PaginationIndex :count="store.getDataCount" :per-page="store.getPagination.per_page" :from="store.getPagination.from"
          :to="store.getPagination.to" :next-from="store.getPagination.next_from" :valid-next-page="store.getPagination.valid_next_page"
          :prev-from="store.getPagination.prev_from" :valid-prev-page="store.getPagination.valid_prev_page"
          @per_page="(val: number) => filters.per_page = val" @prev="(val: number) => filters.page_item_from = val"
          @next="(val: number) => filters.page_item_from = val" />
      </div>

    </Card>
    <DashboardFooter />

  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useActivityLogStore } from '@/stores/activity-log/activity-log';
import MainNav from '@/components/MainNav.vue';
import DashboardFooter from '@/components/DashboardFooter.vue';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ModalComponent from '@/components/ModalComponent.vue';
import { Icon } from '@iconify/vue';
import {
  Table,
  TableRow,
  TableBody,
  TableHeader,
  TableCell,
  TableHead,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { IActivityLogReqParams } from '@/stores/activity-log/activity-log';
import PaginationIndex from '@/components/ui/special-pagination/PaginationIndex.vue';

import Search from '@/components/UseSearch.vue';

interface UserExtras {
  email: string;
  firstName: string;
  lastName: string;
}

interface User {
  id: string;
  type: string;
  extras: UserExtras;
}

interface Resource {
  ip: string;
  timestamp: number;
  user_agent: string;
}

interface ActivityLogItem {
  id: string;
  timestamp: string;
  user: User;
  action: string;
  resource: Resource;
  metadata: Record<string, unknown>;
  status: string;
  description: string;
}

const route = useRoute();
const store = useActivityLogStore();

const logs = ref<ActivityLogItem[]>(store.logs);
const loading = ref(store.loading);
const error = ref(store.error);
const filters = ref<Partial<IActivityLogReqParams>>({
  // columns?: string;
  sort_direction: 'desc',
  sort_column: '',
  per_page: 10,
  page_item_from: 1,
  log_action: '',
  log_status: '',
  log_user_type: '',
  user_id: ''
} as Partial<IActivityLogReqParams>);

watch(filters, () => {
  store.fetchActivityLogs(filters.value);
}, { deep: true });

onMounted(() => {
  store.fetchActivityLogs(filters.value || { per_page: 10 });
  store.fetchFiltersAndMeta();
});

watch(
  () => store.logs,
  (newLogs) => {
    logs.value = newLogs;
  }
);

watch(
  () => store.loading,
  (newLoading) => {
    loading.value = newLoading;
  }
);

watch(
  () => store.error,
  (newError) => {
    error.value = newError;
  }
);

const statusBg = (status: string) => {
  switch (status) {
    case 'ERROR':
    case 'FAILED':
      return 'bg-[#E45044]';
    case 'SUCCESS':
      return 'bg-[#00c37f]';
    default:
      return '';
  }
};

const toggleSortOrder = () => {
  filters.value.sort_column = 'timestamp';
  filters.value.sort_direction = filters.value.sort_direction === 'desc' ? 'asc' : 'desc';
};

const selectedLog = ref<ActivityLogItem | null>(null);
const isModalVisible = ref(false);

const openModal = (log: ActivityLogItem) => {
  selectedLog.value = log;
  isModalVisible.value = true;
};
const actionTypes = computed<string[]>(() => store.filters.log_action);
const statusTypes = computed<string[]>(() => store.filters.log_status);
const userTypes = computed<string[]>(() => store.filters.log_user_types);
</script>