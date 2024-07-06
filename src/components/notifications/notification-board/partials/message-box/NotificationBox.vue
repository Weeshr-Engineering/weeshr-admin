<script setup lang="ts">
import { computed, ref } from 'vue';
import { formatDistance } from 'date-fns'
import axios from '@/services/ApiService';
import ReadByList from '../ReadByList.vue';
import type { INotification, INotificationReadByUser } from '../../types';
import BasicModal from '@/components/ui/modal/BasicModal.vue';
import { useSuperAdminStore } from '@/stores/super-admin/super-admin';
import PriorityBadge from '@/components/notifications/notification-board/partials/PriorityBadge.vue'
import { useToast } from '@/components/ui/toast';

const props = defineProps({
    data: {
        type: Object as () => INotification,
        required: true,
    }
})

const emit = defineEmits(['read']);

const { toast } = useToast()

const { getLocalstorageData } = useSuperAdminStore();

const modal = ref();

const isReadByUser = computed((): boolean => {

    // Note: use user firstname and lastname to compare since no id is saved on client auth
    const { firstname, lastname } = getLocalstorageData();

    const index = props.data.readBy.findIndex((val) => val.firstName == firstname && val.lastName == lastname);

    return (index !== -1);
})

const openModal = (): void => {
    if (!modal.value) return

    modal.value.openModal();

    if (!isReadByUser.value)
        markAsRead()
}

const markAsRead = async () => {
    await axios.get(`board/notification/${props.data._id}/markAsRead`)
        .then(({ data: { data } }) => {

            emit('read', data as INotificationReadByUser);
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

</script>

<template>
    <div @click="openModal" class="relative p-3 border rounded-lg cursor-pointer hover:shadow-sm hover:bg-gray-50">
        <!-- Type, Priority, Date -->
        <div class="grid grid-cols-2">
            <div>
                <div class="inline-flex gap-3">
                    <span>
                        <PriorityBadge :priority="props.data.priority" />
                    </span>
                    <span class="font-semibold">{{ props.data.type }}</span>
                </div>
            </div>
            <div class="inline-flex justify-end">
                <span class="font-semibold text-xs">{{ formatDistance(props.data.createdAt, new Date(), {
                    addSuffix:
                        true
                }) }}</span>
            </div>
        </div>
        <!-- Type, Priority, Date Ends -->

        <!-- Title -->
        <div v-if="props.data.data?.title" class="mt-1 text-sm font-bold italic">
            <span>{{ props.data.data?.title }}</span>
        </div>
        <!-- Title Ends -->

        <!-- Data -->
        <div v-if="props.data.data?.message" class="my-2 text-sm text-ellipsis truncate">
            {{ props.data.data?.message }}
        </div>
        <!-- Data -->

        <!-- Read By -->
        <ReadByList :data="props.data.readBy" />
        <!-- Read By Ends  -->

        <!-- Read Badge -->
        <span v-show="isReadByUser" class="absolute left-2 bottom-3 flex -space-x-2 text-green-500">
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

    <!-- Modal -->
    <BasicModal :ref="val => modal = val">
        <template #content>
            <div class="mb-4 w-full">
                <p class="text-lg font-semibold">Resource</p>
                <pre class="bg-gray-100 p-2 rounded overflow-x-auto">{{ props.data.data.resource }}</pre>
            </div>
            <div>
                <h3 class="text-lg font-semibold">Metadata</h3>
                <pre class="bg-gray-100 p-2 rounded overflow-x-auto">{{ props.data.data.metadata }}</pre>
            </div>
        </template>
    </BasicModal>
    <!-- Modal Ends -->
</template>