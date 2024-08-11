<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core';
import Card from '@/components/ui/card/Card.vue';
import { ref, computed, watch, onMounted } from 'vue';
import type { IFilters, IFilterValues } from '../types';
import { Button } from '@/components/ui/button';

const props = defineProps({
    filters: {
        type: Object as () => IFilters,
        required: true,
    },
    selected: {
        type: Object as () => IFilterValues,
        required: false,
        default: {
            type: "",
            priority: ""
        } as IFilterValues
    }
})

const emit = defineEmits(['selected']);

const isOpen = ref<boolean>(false);

const selectedFilters = ref<IFilterValues>({
    type: "",
    priority: ""
} as IFilterValues)

const filterCount = computed((): number => {
    let count = 0;

    const { type, priority } = selectedFilters.value;

    if (type) count += 1;

    if (priority) count += 1;

    return count;
})

const closeDropdown = useDebounceFn(() => isOpen.value = false, 1000);

const clearFilters = (): void => {
    selectedFilters.value.type = "";
    selectedFilters.value.priority = "";
}

watch(selectedFilters, () => {
    emit('selected', selectedFilters.value);
}, { deep: true });

onMounted(() => {
    const { type, priority } = props.selected;

    if (type) selectedFilters.value.type = type;

    if (priority) selectedFilters.value.priority = priority;
})

</script>

<template>
    <div class="relative">
        <!-- Toggle -->
        <!-- <button type="button" @click.prevent="isOpen = !isOpen"
            class="relative inline-flex items-center p-1.5 text-sm font-medium text-center rounded-lg bg-stone-200 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="size-3">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
            </svg>
            <span class="sr-only">Filters</span>
            <div v-show="filterCount > 0"
                class="absolute inline-flex items-center justify-center w-4 h-4 text-xs bg-black text-white rounded-full -top-2 -end-2">
                {{ filterCount }}</div>
        </button> -->
        <Button type="button" @click.prevent="isOpen = !isOpen" class='flex gap-2 items-center justify-center p-2 md:p-6 rounded-full'>
            Filter
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.6 4.09961V6.29961C20.6 7.09961 20.1 8.09961 19.6 8.59961L15.3 12.3996C14.7 12.8996 14.3 13.8996 14.3 14.6996V18.9996C14.3 19.5996 13.9 20.3996 13.4 20.6996L12 21.5996C10.7 22.3996 8.90001 21.4996 8.90001 19.8996V14.5996C8.90001 13.8996 8.50001 12.9996 8.10001 12.4996L7.63001 12.0096C7.32001 11.6796 7.26001 11.1796 7.51001 10.7896L12.63 2.56961C12.81 2.27961 13.13 2.09961 13.48 2.09961H18.6C19.7 2.09961 20.6 2.99961 20.6 4.09961Z" fill="#F8F9FF"/>
                <path d="M10.35 3.62961L6.80002 9.31961C6.46002 9.86961 5.68002 9.94961 5.23002 9.47961L4.30002 8.49961C3.80002 7.99961 3.40002 7.09961 3.40002 6.49961V4.19961C3.40002 2.99961 4.30002 2.09961 5.40002 2.09961H9.50002C10.28 2.09961 10.76 2.95961 10.35 3.62961Z" fill="#F8F9FF"/>
            </svg>
            <div v-show="filterCount > 0"
                class="absolute inline-flex items-center justify-center w-4 h-4 text-xs bg-black text-white rounded-full -top-2 -end-2">
                {{ filterCount }}</div>                       
        </Button>
        <!-- Toggle Ends -->

        <!-- Show Filters -->
        <Card @mouseleave="closeDropdown" class="absolute z-50 p-2 space-y-2" v-show="isOpen">
            <div>
                <label for="types" class="block mb-1 text-xs font-medium text-gray-900">Type</label>
                <select id="types" v-model="selectedFilters.type"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-0.5">
                    <option value="">--</option>
                    <option v-for="(type, index) in props.filters.types" :key="index">{{ type }}</option>
                </select>
            </div>
            <div class="">
                <label for="types" class="block mb-1 text-xs font-medium text-gray-900">Priority</label>
                <select id="types" v-model="selectedFilters.priority"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-0.5">
                    <option value="">--</option>
                    <option v-for="(priority, index) in props.filters.priority" :key="index">{{ priority }}</option>
                </select>
            </div>

            <div class="flex justify-between">
                <button @click="clearFilters" type="button" class="text-xs py-0.5 px-1 rounded border ">Clear</button>
                <!-- <button type="button" class="text-xs py-0.5 px-1 rounded border ">Apply</button> -->
            </div>
        </Card>
        <!-- Show Filters end -->
    </div>
</template>