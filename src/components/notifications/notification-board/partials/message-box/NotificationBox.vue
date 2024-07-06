<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core';
import Card from '@/components/ui/card/Card.vue';
import { ref, computed, watch, onMounted } from 'vue';
import type { IFilters, IFilterValues } from '../../types';
import PriorityBadge from '@/components/notifications/notification-board/partials/PriorityBadge.vue'

const props = defineProps({
    data: {
        type: Object,
        required: true,
    }
})

</script>

<template>
    <div class="relative p-3 border rounded-lg cursor-pointer hover:shadow-sm hover:bg-gray-50">
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
</template>