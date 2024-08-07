<script setup lang="ts">
import { ref } from 'vue';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetDescription,
    SheetTrigger
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import PageFilters from './partials/PageFilters.vue';
import type { IFilters, IFilterValues, INotification, INotificationReadByUser } from './types';
import NotificationList from '@/components/notifications/notification-board/NotificationList.vue'

const trigger = ref();


const filters = ref<IFilters>({
    priority: [],
    types: []
} as IFilters);

const selectedFilters = ref<IFilterValues>({
    type: "",
    priority: ""
} as IFilterValues)

const notifications = ref<Array<INotification>>([] as Array<INotification>);


const openSheet = (): void => {
    if (!trigger.value)
        return;

    trigger.value.click();
};

defineExpose({
    openSheet
})
</script>
<template>
    <Sheet>
        <SheetTrigger as-child>
            <button :ref="val => trigger = val" class="invisible">
            </button>
        </SheetTrigger>
        <SheetContent class="space-y-2">
            <SheetHeader class='mb-8'>
                <div class='grid grid-cols-3'>
                    <div class='col-span-2'>
                        <h3 class="text-2xl font-medium">General Notifications</h3>
                        <SheetDescription class="text-xs">
                            Notifications for all administrators
                        </SheetDescription>
                    </div>
                    <div class='col-span-1 flex items-center'>
                        <!-- <PageFilters :filters @selected="val => selectedFilters = val as IFilterValues" /> -->

                        <!-- <Button class='flex gap-2 items-center justify-center p-6 rounded-full'>
                            Filter
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20.6 4.09961V6.29961C20.6 7.09961 20.1 8.09961 19.6 8.59961L15.3 12.3996C14.7 12.8996 14.3 13.8996 14.3 14.6996V18.9996C14.3 19.5996 13.9 20.3996 13.4 20.6996L12 21.5996C10.7 22.3996 8.90001 21.4996 8.90001 19.8996V14.5996C8.90001 13.8996 8.50001 12.9996 8.10001 12.4996L7.63001 12.0096C7.32001 11.6796 7.26001 11.1796 7.51001 10.7896L12.63 2.56961C12.81 2.27961 13.13 2.09961 13.48 2.09961H18.6C19.7 2.09961 20.6 2.99961 20.6 4.09961Z" fill="#F8F9FF"/>
                                <path d="M10.35 3.62961L6.80002 9.31961C6.46002 9.86961 5.68002 9.94961 5.23002 9.47961L4.30002 8.49961C3.80002 7.99961 3.40002 7.09961 3.40002 6.49961V4.19961C3.40002 2.99961 4.30002 2.09961 5.40002 2.09961H9.50002C10.28 2.09961 10.76 2.95961 10.35 3.62961Z" fill="#F8F9FF"/>
                            </svg>                                
                        </Button> -->
                    </div>
                </div>
            </SheetHeader>
            <NotificationList />
        </SheetContent>
    </Sheet>
</template>