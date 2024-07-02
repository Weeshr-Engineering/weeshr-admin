<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>

<template>
  <div class="flex flex-col items-center justify-center w-full h-screen bg-[#F8F9FF] p-4">
    <img
      class="mb-4"
      src="https://res.cloudinary.com/dufimctfc/image/upload/v1719761079/errorpage_kkjhkb.svg"
      alt="gradient"
    />
    <div class="flex flex-col items-center justify-center mb-5 text-center">
      <p class="text-2xl font-bold text-[#111827] md:text-3xl lg:text-4xl">
        Page not Found
      </p>
      <p class="mt-4 text-sm text-[#6B7280] md:text-lg lg:text-xl">
        Oops! Looks like you followed a bad link. If you think this is a problem with us, please tell us.
      </p>
    </div>
    <Button class="w-auto bg-[#BAEF23] hover:bg-lime-500 rounded-full">
      <a href="/" class="block p-4 font-bold text-[#020721]">Go Home</a>
    </Button>
  </div>
</template>
