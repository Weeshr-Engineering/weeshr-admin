<script setup lang="ts">
import { computed } from 'vue';
import { type INotificationReadByUser } from '../types';

const props = defineProps({
    data: {
        type: Array as () => Array<INotificationReadByUser>,
        required: true
    }
})

const getDisplayedList = computed((): Array<INotificationReadByUser> => {
    return [...props.data].splice(0, 4);
})

const getOtherUsersCount = computed((): number => {
    if (props.data.length < 6) return 0;
    return props.data.length - 5;
});

const generateAvatar = (user: INotificationReadByUser): string => {
    const { avatar, firstName, lastName } = user;

    return (avatar !== null)
        ? avatar
        : `https://ui-avatars.com/api/?name=${firstName}+${lastName}`;
}

</script>

<template>
    <div class="flex -space-x-1 justify-end overflow-hidden">
        <img v-for="(user, index) in getDisplayedList" :key="index"
            class="inline-block h-6 w-6 rounded-full ring-2 ring-white" :src="generateAvatar(user)"
            :alt="`${user.firstName}'s avatar'`"
            :title="`${user.firstName} ${user.lastName}`">
        <span v-show="getOtherUsersCount > 0"
            class="inline-flex items-center justify-center h-6 w-6 rounded-full ring-2 ring-white bg-gray-200 font-semibold text-sm">
            <span>+{{ getOtherUsersCount }}</span>
        </span>
    </div>
</template>