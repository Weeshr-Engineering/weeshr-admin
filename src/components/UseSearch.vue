<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

interface Props {
  modelValue?: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);

const { modelValue } = props;

const onKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', target.value);
  }
};
</script>

<template>
  <div class="relative lg:w-[400px]">
    <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11 1.99023C6.02999 1.99023 1.98999 6.03023 1.98999 11.0002C1.98999 15.9702 6.02999 20.0102 11 20.0102C15.97 20.0102 20.01 15.9702 20.01 11.0002C20.01 6.03023 15.97 1.99023 11 1.99023ZM11 13.2502H7.99999C7.58999 13.2502 7.24999 12.9102 7.24999 12.5002C7.24999 12.0902 7.58999 11.7502 7.99999 11.7502H11C11.41 11.7502 11.75 12.0902 11.75 12.5002C11.75 12.9102 11.41 13.2502 11 13.2502ZM14 10.2502H7.99999C7.58999 10.2502 7.24999 9.91023 7.24999 9.50023C7.24999 9.09023 7.58999 8.75023 7.99999 8.75023H14C14.41 8.75023 14.75 9.09023 14.75 9.50023C14.75 9.91023 14.41 10.2502 14 10.2502Z"
          fill="#020721"
        />
        <path
          d="M21.9901 18.95C21.6601 18.34 20.9601 18 20.0201 18C19.3101 18 18.7001 18.29 18.3401 18.79C17.9801 19.29 17.9001 19.96 18.1201 20.63C18.5501 21.93 19.3001 22.22 19.7101 22.27C19.7701 22.28 19.8301 22.28 19.9001 22.28C20.3401 22.28 21.0201 22.09 21.6801 21.1C22.2101 20.33 22.3101 19.56 21.9901 18.95Z"
          fill="#020721"
        />
      </svg>
    </div>
    <input
      type="text"
      class="bg-[#EEEFF5] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      placeholder="Search             weeshrname, email, name, type, status"
      :value="modelValue"
      @keypress="onKeyPress"
      required
    />
  </div>
</template>
