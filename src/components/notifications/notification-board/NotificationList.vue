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
import PageFilters from '@/components/notifications/notification-board/partials/PageFilters.vue'
import PriorityBadge from './partials/PriorityBadge.vue';
import type { IFilters, IFilterValues } from './types';
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

const notifications = Array<any>([]);

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

    const queryString = new URLSearchParams(output as any).toString();

    // TODO: Add pagination 

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
                currentPage,
                data: notifications,
                from,
                perPage,
                to,
                totalItems,
                totalPages,
            } = data;

            notifications.value = data.notifications;

            console.log({ data })
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
        <div class="w-full inline-flex">
            <!-- LHS -->
            <div class="w-1/2">
                <PageFilters :filters @selected="val => selectedFilters = val as IFilterValues" />
            </div>
            <!-- LHS Ends -->

            <!-- RHS -->
            <div class="w-1/2 inline-flex justify-end gap-3">
                <!-- Toggle Read/Unread -->
                <div class="rounded-lg p-1 inline-flex font-bold text-xs capitalize bg-stone-50">
                    <button type="button" @click="readFilter = 'all'"
                        class="rounded-lg py-0.5 px-3 inline-flex justify-center align-middle"
                        :class="{ 'bg-black text-white': readFilter == 'all' }">
                        All
                    </button>
                    <button type="button" @click="readFilter = 'unread'"
                        :class="{ 'bg-black text-white': readFilter == 'unread' }"
                        class="rounded-lg py-0.5 px-3 inline-flex justify-center align-middle">
                        Unread
                    </button>
                </div>
                <!-- Toggle Read/Unread -->
            </div>
            <!-- RHS Ends -->
        </div>
        <!-- Filters End -->

        <!-- Notifications List -->
        <div class="flex-col space-y-3 py-4 overflow-y-auto h-[80%] scrollbar_custom">
            <!-- Notification -->
            <NotificationBox v-for="(notification, index) in notifications" :key="index" :data="notification" />
            <!-- Notification Ends -->
        </div>
        <!-- Notifications List Ends -->

        <!-- Pagination -->
        <div class="flex justify-end">
            <Pagination :total="10" :sibling-count="1" show-edges :default-page="1">
                <PaginationList class="flex items-center gap-1">
                    <PaginationFirst />
                    <PaginationPrev />
                    <PaginationNext />
                    <PaginationLast />
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