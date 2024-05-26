<script setup lang="ts">
    const props = defineProps<{
        headingText: string
    }>()

    const headingText = props.headingText
</script>

<template>
    <div class="form-modal-backdrop w-full flex flex-row justify-end">
        <div class="modal-form bg-[#FFFFFF] ms-14 h-full lg:w-2/5 md:px-8 md:ms-0">
            <h2 class="text-3xl font-bold ml-6 mt-8">{{ headingText }}</h2>
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
.form-modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
}
.modal-form {
    overflow-y: auto;
    scrollbar-width: none;
}
.iti {
    --iti-path-flags-1x: url('../node_modules/intl-tel-input/build/img/flags.png');
    --iti-path-flags-2x: url('../node_modules/intl-tel-input/build/img/flags@2x.png');
    --iti-path-globe-1x: url('../node_modules/intl-tel-input/build/img/globe.png');
    --iti-path-globe-2x: url('../node_modules/intl-tel-input/build/img/globe@2x.png');
}
</style>