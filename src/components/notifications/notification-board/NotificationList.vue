<script setup lang="ts">
import PriorityBadge from './partials/PriorityBadge.vue';
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


</script>
<template>
    <div class="space-y-2 h-full">

        <!-- Filters -->
        <div class="w-full inline-flex">
            <!-- LHS -->
            <div class="w-1/2">
                Filters
            </div>
            <!-- LHS Ends -->

            <!-- RHS -->
            <div class="w-1/2 inline-flex justify-end gap-3">
                <!-- Toggle Read/Unread -->
                <div class="rounded-lg p-1 inline-flex font-bold text-xs capitalize bg-stone-50">
                    <button type="button"
                        class="rounded-lg py-0.5 px-3 inline-flex justify-center align-middle bg-black text-white">
                        All
                    </button>
                    <button type="button" class="rounded-lg py-0.5 px-3 inline-flex justify-center align-middle">
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
            <div v-for="i in 5" :key="i"
                class="relative p-3 border rounded-lg cursor-pointer hover:shadow-sm hover:bg-gray-50">
                <!-- Type, Priority, Date -->
                <div class="grid grid-cols-2">
                    <div>
                        <div class="inline-flex gap-3">
                            <span>
                                <PriorityBadge />
                            </span>
                            <span class="font-semibold">WEESH_ADDED</span>
                        </div>

                        <!-- Title -->
                        <div class="mt-1 text-sm font-semibold">
                            <span>Weesh created</span>
                        </div>
                        <!-- Title Ends -->
                    </div>
                    <div class="inline-flex justify-end">
                        <span class="font-semibold text-xs">2024-07-5</span>
                    </div>
                </div>
                <!-- Type, Priority, Date Ends -->

                <!-- Data -->
                <div class="my-2 text-sm text-ellipsis truncate">
                    Hi, let's have a meeting tomorrow to discuss the project. I've been reviewing the project
                    details and have some ideas I'd like to share. It's crucial that we align on our next steps
                    to
                    ensure the project's success.
                </div>
                <!-- Data -->

                <!-- Read By -->
                <div class="flex -space-x-1 justify-end overflow-hidden">
                    <img class="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                        src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt="">
                    <img class="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                        src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt="">
                    <img class="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
                        alt="">
                    <img class="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt="">
                    <span
                        class="inline-flex items-center justify-center h-6 w-6 rounded-full ring-2 ring-white bg-gray-200 font-semibold text-sm">
                        <span>+4</span>
                    </span>
                </div>
                <!-- Read By Ends  -->

                <!-- Read Badge -->
                <span class="absolute left-2 bottom-3 flex -space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="size-3">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="size-3">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                </span>
                <!-- Read Badge Ends -->
            </div>
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