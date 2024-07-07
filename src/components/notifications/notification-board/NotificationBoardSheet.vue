<script setup lang="ts">
import { ref } from 'vue';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetDescription,
    SheetTrigger
} from '@/components/ui/sheet';
import NotificationList from '@/components/notifications/notification-board/NotificationList.vue'

const trigger = ref();

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
            <SheetHeader>
                <h3 class="text-2xl font-medium">General Notifications</h3>
                <SheetDescription>
                    Notifications for all administrators
                </SheetDescription>
            </SheetHeader>
            <NotificationList />
        </SheetContent>
    </Sheet>
</template>