<script setup lang="ts">
import { computed, ref } from 'vue';
// import {
//     AlertDialog,
//     AlertDialogAction,
//     AlertDialogCancel,
//     AlertDialogContent,
//     AlertDialogDescription,
//     AlertDialogFooter,
//     AlertDialogHeader,
//     AlertDialogTitle,
//     AlertDialogTrigger,
// } from '@/components/ui/alert-dialog';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetClose,
    SheetTrigger
} from '@/components/ui/sheet';
import { Icon } from '@iconify/vue'
import { formatDistance } from 'date-fns'
import axios from '@/services/ApiService';
// import ReadByList from '../ReadByList.vue';
import { useToast } from '@/components/ui/toast';
// import BasicModal from '@/components/ui/modal/BasicModal.vue';
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
const readChecker = ()=>{
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
    <div class='p-4 w-full flex flex-col gap-6 bg-[#F8F9FF] rounded-md'>
        <div class='grid grid-cols-6 items-center justify-between w-full'>
            <div class='col-span-4 flex items-center gap-2'>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" v-if="props.data.readBy.length === 0">
                    <path d="M19.48 2.81973L19.76 3.38973C19.9 3.66973 20.25 3.92973 20.56 3.98973L20.94 4.04973C22.08 4.23973 22.35 5.07973 21.53 5.90973L21.18 6.25973C20.95 6.49973 20.82 6.95973 20.89 7.27973L20.94 7.48973C21.25 8.86973 20.52 9.39973 19.32 8.67973L19.06 8.52973C18.75 8.34973 18.25 8.34973 17.94 8.52973L17.68 8.67973C16.47 9.40973 15.74 8.86973 16.06 7.48973L16.11 7.27973C16.18 6.95973 16.05 6.49973 15.82 6.25973L15.47 5.89973C14.65 5.06973 14.92 4.22973 16.06 4.03973L16.44 3.97973C16.74 3.92973 17.1 3.65973 17.24 3.37973L17.52 2.80973C18.06 1.72973 18.94 1.72973 19.48 2.81973Z" fill="#1F2328" fill-opacity="0.2"/>
                    <path d="M21.57 10.09C21.21 10.35 20.2 10.83 18.76 10.09C18.6 10.01 18.4 10 18.24 10.09C17.67 10.38 17.15 10.5 16.74 10.5C16.1 10.5 15.65 10.25 15.43 10.09C15.06 9.82 14.28 9.05 14.55 7.42C14.58 7.25 14.53 7.08 14.42 6.95C13.73 6.16 13.35 5.1 13.62 4.27C13.72 3.94 13.51 3.5 13.17 3.5H7C4 3.5 2 5 2 8.5V15.5C2 19 4 20.5 7 20.5H17C20 20.5 22 19 22 15.5V10.27C22 10.08 21.73 9.98 21.57 10.09ZM14.34 12.09C13.68 12.62 12.84 12.88 12 12.88C11.16 12.88 10.31 12.62 9.66 12.09L6.53 9.59C6.21 9.33 6.16 8.85 6.41 8.53C6.67 8.21 7.14 8.15 7.46 8.41L10.59 10.91C11.35 11.52 12.64 11.52 13.4 10.91C13.72 10.65 14.19 10.7 14.45 11.03C14.72 11.35 14.67 11.83 14.34 12.09Z" fill="#1F2328"/>
                </svg>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" v-else>
                    <path d="M19.48 2.81973L19.76 3.38973C19.9 3.66973 20.25 3.92973 20.56 3.98973L20.94 4.04973C22.08 4.23973 22.35 5.07973 21.53 5.90973L21.18 6.25973C20.95 6.49973 20.82 6.95973 20.89 7.27973L20.94 7.48973C21.25 8.86973 20.52 9.39973 19.32 8.67973L19.06 8.52973C18.75 8.34973 18.25 8.34973 17.94 8.52973L17.68 8.67973C16.47 9.40973 15.74 8.86973 16.06 7.48973L16.11 7.27973C16.18 6.95973 16.05 6.49973 15.82 6.25973L15.47 5.89973C14.65 5.06973 14.92 4.22973 16.06 4.03973L16.44 3.97973C16.74 3.92973 17.1 3.65973 17.24 3.37973L17.52 2.80973C18.06 1.72973 18.94 1.72973 19.48 2.81973Z" fill="#1F2328" fill-opacity="0.2"/>
                    <path d="M21.57 10.09C21.21 10.35 20.2 10.83 18.76 10.09C18.6 10.01 18.4 10 18.24 10.09C17.67 10.38 17.15 10.5 16.74 10.5C16.1 10.5 15.65 10.25 15.43 10.09C15.06 9.82 14.28 9.05 14.55 7.42C14.58 7.25 14.53 7.08 14.42 6.95C13.73 6.16 13.35 5.1 13.62 4.27C13.72 3.94 13.51 3.5 13.17 3.5H7C4 3.5 2 5 2 8.5V15.5C2 19 4 20.5 7 20.5H17C20 20.5 22 19 22 15.5V10.27C22 10.08 21.73 9.98 21.57 10.09ZM14.34 12.09C13.68 12.62 12.84 12.88 12 12.88C11.16 12.88 10.31 12.62 9.66 12.09L6.53 9.59C6.21 9.33 6.16 8.85 6.41 8.53C6.67 8.21 7.14 8.15 7.46 8.41L10.59 10.91C11.35 11.52 12.64 11.52 13.4 10.91C13.72 10.65 14.19 10.7 14.45 11.03C14.72 11.35 14.67 11.83 14.34 12.09Z" fill="#1F2328" fill-opacity="0.2"/>
                </svg>
    
                <div class='text-base font-semibold text-[#020721]'>{{ props.data?.type }}</div>
            </div>
            <div class='text-xs text-gray-400 col-span-2 flex items-center justify-end'>
                {{ formatDistance(props.data.createdAt, new Date(), {
                    addSuffix:
                        true
                }) }}
            </div>           
        </div>
        <div class='grid grid-cols-5 items-center justify-between w-full cursor-pointer'>
            <Sheet>
                <SheetTrigger as-child @click="readChecker">
                    <div class='text-sm col-span-4'>
                        {{ props.data.data?.title }}
                    </div>
                    <div class='col-span-1 flex items-center justify-end'>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.90998 20.6695C8.71998 20.6695 8.52998 20.5995 8.37998 20.4495C8.08998 20.1595 8.08998 19.6795 8.37998 19.3895L14.9 12.8695C15.38 12.3895 15.38 11.6095 14.9 11.1295L8.37998 4.60953C8.08998 4.31953 8.08998 3.83953 8.37998 3.54953C8.66998 3.25953 9.14998 3.25953 9.43998 3.54953L15.96 10.0695C16.47 10.5795 16.76 11.2695 16.76 11.9995C16.76 12.7295 16.48 13.4195 15.96 13.9295L9.43998 20.4495C9.28998 20.5895 9.09998 20.6695 8.90998 20.6695Z" fill="#020721"/>
                        </svg>
                    </div>
                </SheetTrigger>
                <SheetContent class="space-y-2 text-2xl">
                    <SheetHeader class='my-4'>
                        <div class='w-full flex items-start'>
                            <SheetClose>
                                <Icon icon="carbon:arrow-left" width="24" height="24"/>
                            </SheetClose>
                        </div>
                    </SheetHeader>
                        <div class="inline-flex gap-3">
                            <span>
                                <PriorityBadge :priority="props.data.priority" />
                            </span>
                            <span class="font-semibold">{{ props.data.type }}</span>
                        </div>
                        <div class="my-4 w-full">
                            <p class="text-lg font-semibold">Details</p>
                            <ul class="list-none text-base bg-gray-100 p-2 rounded overflow-x-auto grid">
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
                            <pre class="bg-gray-100 p-2 rounded overflow-x-auto text-base">{{ props.data.data }}</pre>
                        </div>
                        <div class="mb-4 w-full">
                            <p class="text-lg font-semibold">Read By</p>
                            <ul class="list-none p-2 grid space-y-2 text-base" v-if="props.data.readBy.length > 0">
                                <li v-for="(user, index) in props.data.readBy" :key="index"
                                    class="inline-flex gap-4 bg-gray-100 p-2 rounded-lg overflow-x-auto">
                                    <img class="inline-block h-6 w-6 rounded-full ring-2 ring-white" :src="generateAvatar(user)"
                                        :alt="`${user.firstName}'s avatar'`" :title="`${user.firstName} ${user.lastName}`">
                                    <span class="font-md">{{ `${user.firstName} ${user.lastName}` }}</span>
                                </li>
                            </ul>
                            <div v-else class='bg-gray-100 p-2 rounded overflow-x-auto text-base'>
                                None
                            </div>
                        </div>
                </SheetContent>
            </Sheet> 
        </div>
    </div>
    <!-- Modal Ends -->
</template>


