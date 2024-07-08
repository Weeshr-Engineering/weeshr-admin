<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue';

const show = ref<boolean>(false);

const openModal = () => show.value = true;

const closeModal = () => show.value = false;

defineExpose({
    openModal,
    closeModal,
})

</script>

<template>
    <div v-if="show" class="fixed inset-0 flex items-center justify-center">
        <div class="bg-white rounded-lg shadow-lg p-6 max-w-[700px] mx-auto">
            <div class="flex justify-between items-center pb-3 border-b">
                <div>
                    <slot name="title"></slot>
                </div>
                <button @click="closeModal" class="text-gray-600 hover:text-gray-900" aria-label="Close">
                    <Icon icon="mdi:close" width="24" height="24" />
                </button>
            </div>
            <div>
                <slot name="content"></slot>
            </div>
        </div>
    </div>
</template>