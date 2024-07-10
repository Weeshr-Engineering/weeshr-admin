<script setup lang="ts">
import { computed, ref } from 'vue';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Icon } from '@iconify/vue'
import { formatDistance } from 'date-fns'
import axios from '@/services/ApiService';
import ReadByList from '../ReadByList.vue';
import { useToast } from '@/components/ui/toast';
import BasicModal from '@/components/ui/modal/BasicModal.vue';
import { useSuperAdminStore } from '@/stores/super-admin/super-admin';
import { ability, defineAbilities, verifyAbilities } from '@/lib/ability';
import type { INotification, INotificationReadByUser } from '../../types';
import PriorityBadge from '@/components/notifications/notification-board/partials/PriorityBadge.vue'

const props = defineProps({
    data: {
        type: Object as () => INotification,
        required: true,
    }
})

const emit = defineEmits(['read', 'deleted']);

defineAbilities();

const deletePermission = ability.can('delete', 'admin-board-notifications')

const { toast } = useToast()

const { getLocalstorageData } = useSuperAdminStore();

const modal = ref();

const isDeleting = ref<boolean>(false);

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
    await axios.get(`api/v1/admin/board/notification/${props.data._id}/markAsRead`)
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

const deleteNotification = async () => {
    try {
        isDeleting.value = true;

        await axios.delete(`api/v1/admin/board/notification/${props.data._id}`)
            .then(({ data: { data } }) => {

                emit('deleted', props.data._id);

                isDeleting.value = false;
            })
            .catch(({ response: { status, message, error } }) => {
                isDeleting.value = false;

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
                    description: message || 'Error deleting data!',
                    variant: 'destructive'
                })
            }).finally(() => isDeleting.value = false);
    } catch (error: any) {
        return toast({
            description: error?.message || 'Error deleting data!',
            variant: 'destructive'
        })
    }
}

const generateAvatar = (user: INotificationReadByUser): string => {
    const { avatar, firstName, lastName } = user;

    return (avatar !== null)
        ? avatar
        : `https://ui-avatars.com/api/?name=${firstName}+${lastName}`;
}

</script>

<template>
    <div @dblclick="openModal" class="relative p-3 border rounded-lg cursor-pointer hover:shadow-sm hover:bg-gray-50">
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
        <div v-if="props.data.data.title" class="mt-1 text-sm font-bold italic mb-3">
            <span>{{ props.data.data?.title }}</span>
        </div>
        <!-- Title Ends -->

        <!-- Data -->
        <div v-if="props.data.data?.message" class="my-2 text-sm text-ellipsis truncate">
            {{ props.data.data?.message }}
        </div>
        <!-- Data -->

        <section class="grid grid-cols-2">
            <!-- Action Buttons -->
            <div class="flex gap-1">
                <button type="button" title="View/Read Notification" @click="openModal"
                    class="rounded-lg py-0.5 px-1.5 flex justify-center align-middle bg-green-400 hover:bg-green-600 text-xs font-semibold text-white">
                    <span class="m-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="size-3">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                    </span>
                </button>
                <!-- Delete Notification alert -->
                <AlertDialog>
                    <AlertDialogTrigger title="Delete Notification" v-if="deletePermission"
                        class="rounded-lg py-0.5 px-1.5 flex justify-center align-middle bg-red-500 hover:bg-red-600 text-xs font-semibold text-white">
                        <Icon icon="mdi:delete" width="17" height="17" class="size-4 m-auto"
                            @click="verifyAbilities('delete', 'admin-board-notifications')" />
                    </AlertDialogTrigger>
                    <div>
                        <AlertDialogContent v-if="deletePermission">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure you want to delete this notification?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete this notification
                                    and remove it from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction @click="deleteNotification" class="bg-red-500 hover:bg-red-600">
                                    <div v-if="isDeleting" role="status">
                                        <svg aria-hidden="true"
                                            class="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-green-500"
                                            viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                fill="currentColor" />
                                            <path
                                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                fill="currentFill" />
                                        </svg>
                                        <span class="sr-only">Loading...</span>
                                    </div>
                                    <span v-else>Delete</span>
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </div>
                </AlertDialog>
                <!-- Delete Notification Alert Ends -->
            </div>
            <!-- Action Buttons Ends -->


            <!-- Read By -->
            <ReadByList :data="props.data.readBy" />
            <!-- Read By Ends  -->
        </section>

        <!-- Read Badge -->
        <span v-show="isReadByUser" class="absolute right-2 top-11 flex -space-x-2 text-green-500">
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
        <template #title>
            <div class="inline-flex gap-3">
                <span>
                    <PriorityBadge :priority="props.data.priority" />
                </span>
                <span class="font-semibold">{{ props.data.type }}</span>
            </div>
        </template>
        <template #content>
            <div class="my-4 w-full">
                <p class="text-lg font-semibold">Details</p>
                <ul class="list-none bg-gray-100 p-2 rounded overflow-x-auto grid">
                    <li class="inline-flex gap-4">
                        <span class="font-semibold">
                            <span>Type</span>
                        </span>
                        <span class="font-md">{{ props.data.type }}</span>
                    </li>
                    <li class="inline-flex gap-4">
                        <span class="font-semibold">
                            <span>Priority</span>
                        </span>
                        <span class="font-md">
                            <PriorityBadge :priority="props.data.priority" class="me-1" /> {{ props.data.priority }}
                        </span>
                    </li>
                    <li class="inline-flex gap-4">
                        <span class="font-semibold">
                            <span>Date</span>
                        </span>
                        <span class="font-md">
                            {{ formatDistance(props.data.createdAt, new Date(), {
                                addSuffix:
                                    true
                            }) }}
                        </span>
                    </li>
                </ul>
            </div>
            <div class="mb-4 w-full">
                <p class="text-lg font-semibold">Raw Data</p>
                <pre class="bg-gray-100 p-2 rounded overflow-x-auto">{{ props.data.data }}</pre>
            </div>
            <div class="mb-4 w-full">
                <p class="text-lg font-semibold">Read By</p>
                <ul class="list-none p-2 grid space-y-2">
                    <li v-for="(user, index) in props.data.readBy" :key="index"
                        class="inline-flex gap-4 bg-gray-100 p-2 rounded-lg overflow-x-auto">
                        <img class="inline-block h-6 w-6 rounded-full ring-2 ring-white" :src="generateAvatar(user)"
                            :alt="`${user.firstName}'s avatar'`" :title="`${user.firstName} ${user.lastName}`">
                        <span class="font-md">{{ `${user.firstName} ${user.lastName}` }}</span>
                    </li>
                </ul>
            </div>
        </template>
    </BasicModal>
    <!-- Modal Ends -->
</template>