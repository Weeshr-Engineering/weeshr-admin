<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import axios from '@/services/ApiService';
import {
    Pagination,
    PaginationEllipsis,
    PaginationFirst,
    PaginationLast,
    PaginationList,
    PaginationListItem,
    PaginationNext,
    PaginationPrev,
} from '@/components/ui/pagination';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetClose,
    SheetDescription,
    SheetTrigger
} from '@/components/ui/sheet';
import { Icon } from '@iconify/vue';
import PageFilters from '@/components/notifications/notification-board/partials/PageFilters.vue'
import type { IFilters, IFilterValues, INotification, INotificationReadByUser } from './types';
import { useDebounceFn } from '@vueuse/core';
import { useToast } from '@/components/ui/toast';
import NotificationBox from '@/components/notifications/notification-board/partials/message-box/NotificationBox.vue'

const { toast } = useToast()

const filters = ref<IFilters>({
    priority: [],
    types: []
} as IFilters);

const selectedFilters = ref<IFilterValues>({
    type: "",
    priority: ""
} as IFilterValues)

const clearFilters = (): void => {
    selectedFilters.value.type = "";
    selectedFilters.value.priority = "";
}

const notifications = ref<Array<INotification>>([] as Array<INotification>);

const pagination = ref({
    from: 1,
    perPage: 25,
    to: 25,
    totalItems: 1,
    totalPages: 1,
    currentPage: 1
})

const currentPage = ref<number>(1);

const readFilter = ref<string>('all');

const notificationUri = computed((): string => {
    const baseUrl = 'api/v1/admin/board/notifications';

    const output = {} as any;

    for (const key in selectedFilters.value) {
        if (Object.prototype.hasOwnProperty.call(selectedFilters.value, key)) {
            const element = selectedFilters.value[key as keyof IFilterValues];

            if (element && element !== undefined) {
                output[key] = element;
            }
        }
    }

    if (readFilter.value && readFilter.value == 'unread')
        output['read_status'] = readFilter.value;

    // TODO: Add pagination 
    const { perPage } = pagination.value;

    output['per_page'] = perPage || 25;

    if (currentPage.value) {
        output['page'] = currentPage.value || 1;
    }

    const queryString = new URLSearchParams(output as any).toString();

    return (queryString) ? `${baseUrl}?${queryString}` : baseUrl;
});

const getFilters = async () => {
    await axios.get('api/v1/admin/board/notifications/filters')
        .then(({ data: { data } }) => {
            filters.value = data;
        })
        .catch(() => {
            toast({
                description: 'Error fetching data !',
                variant: 'destructive'
            });
        });
}

const getNotifications = async () => {
    toast({
        description: "Loading....",
        variant: 'loading'
    });

    await axios.get(notificationUri.value || 'api/v1/admin/board/notifications')
        .then(({ data: { data, message } }) => {
            toast({
                description: message || 'Data fetched successfully !',
                variant: 'success'
            })

            const {
                currentPage: page,
                data: allData,
                from,
                perPage,
                to,
                totalItems,
                totalPages,
            } = data;

            notifications.value = allData as Array<INotification>;

            pagination.value = {
                currentPage: page,
                from,
                perPage,
                to,
                totalItems,
                totalPages
            };

            currentPage.value = page;

        })
        .catch(({ response: { status, message, error } }) => {
            if (status == 403) {
                return toast({
                    description: message || 'Unauthorized !',
                    variant: 'destructive'
                })
            }

            if (status == 422) {
                return toast({
                    description: error || message || 'Validation error!',
                    variant: 'destructive'
                })
            }

            return toast({
                description: message || 'Error fetching data!',
                variant: 'destructive'
            })
        });
}

const updateReadUser = (notification_id: any, value: INotificationReadByUser): void => {
    const index = notifications.value.findIndex((item) => item._id == notification_id);

    if (index == -1)
        return;

    const readIndex = notifications.value[index].readBy.findIndex((user) => user._id == value._id);

    if (readIndex == -1)
        notifications.value[index].readBy.push(value);
}

const deleted = (notification_id: any): void => {
    const index = notifications.value.findIndex((item) => item._id == notification_id);

    if (index == -1)
        return;

    notifications.value.splice(index, 1);
}

const paginationMethods = () => {

    const setPage = (page: number) => {
        currentPage.value = page;
    };

    const nextPage = () => {
        const { totalPages, currentPage: page } = pagination.value;

        if (page < totalPages)
            currentPage.value += 1;
    };

    const prevPage = () => {
        const { currentPage: page } = pagination.value;

        if (page > 1)
            currentPage.value -= 1;
    };

    return {
        setPage,
        nextPage,
        prevPage
    }
}

watch(notificationUri, useDebounceFn(() => {
    getNotifications();
}, 1000), { deep: true })

onMounted(() => {
    getFilters();
    getNotifications();
});
</script>

<template>
    <div class="space-y-2 h-full">

        <!-- Filters -->
        <div class="w-full flex items-center justify-between">
            <!-- LHS -->
            <div class=" flex gap-2 absolute top-12 right-0 md:right-4">
                <PageFilters :filters @selected="val => selectedFilters = val as IFilterValues" />
            </div>
            <!-- LHS Ends -->

            <!-- RHS -->
            <div class="inline-flex justify-start gap-3 h-11">
                <!-- Toggle Read/Unread -->
                <div class="rounded-lg p-1 inline-flex font-bold text-xs capitalize bg-[#E9F4D1]">
                    <button type="button" @click="readFilter = 'all'"
                        class="rounded-lg py-0.5 px-3 inline-flex justify-center items-center align-middle"
                        :class="{ 'bg-black text-white': readFilter == 'all' }">
                        All
                    </button>
                    <button type="button" @click="readFilter = 'unread'"
                        :class="{ 'bg-black text-white': readFilter == 'unread' }"
                        class="rounded-lg py-0.5 px-3 inline-flex justify-center items-center align-middle">
                        Unread
                    </button>
                </div>
                <!-- Toggle Read/Unread -->
            </div>
            <!-- RHS Ends -->

            <!-- RHS -->
                <div class='text-[#020721] text-sm cursor-pointer' @click='clearFilters'>
                    Clear all
                </div>
            <!-- LHS -->
        </div>
        <!-- Filters End -->

        <!-- Notifications List -->
        <div class="flex-col space-y-3 h-96 overflow-y-scroll">
            <!-- Notification -->
            <NotificationBox v-for="(notification, index) in notifications" :key="index" :data="notification"
                @read="value => updateReadUser(notification._id, value as INotificationReadByUser)"
                @deleted="deleted" />
            <!-- Notification Ends -->
        </div>
        <!-- Notifications List Ends -->

        <!-- Pagination -->
        <div class="flex justify-end">
            <Pagination :total="pagination.totalPages" :sibling-count="1" show-edges :default-page="currentPage || 1">
                <PaginationList class="flex items-center gap-1">
                    <PaginationFirst class='bg-[#E9F4D1]' @click="paginationMethods().setPage(1)" :disabled="false" />
                    <PaginationPrev @click="paginationMethods().prevPage()" :disabled="(pagination.currentPage <= 1)" />
                    <PaginationNext @click="paginationMethods().nextPage()"
                        :disabled="(pagination.currentPage >= pagination.totalPages)" />
                    <PaginationLast class='bg-[#E9F4D1]' @click="paginationMethods().setPage(pagination.totalPages)" :disabled="false" />
                </PaginationList>
            </Pagination>
        </div>
        <!-- Pagination Ends -->
    </div>
</template>

<style scoped>
::-webkit-scrollbar {
    display: none;
}

.scrollbar_custom {
    -ms-overflow-style: none;
    /* IE and Edge */
    scrollbar-width: none;
    /* Firefox */
    overflow: auto;
}
</style>