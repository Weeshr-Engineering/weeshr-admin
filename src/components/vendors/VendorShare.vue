<template>
  <div class="relative bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
       <Popover>
        <PopoverTrigger>
             <div class="w-full bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-500 hover:to-cyan-500 text-white rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg p-[2px]">
                <div class="bg-white w-full h-full text-primary rounded-xl flex items-center justify-center gap-2 py-2 px-4">
                    <span class="hidden sm:flex">Share Store Link</span>
                    <Share2 class="w-5 h-5" />
                </div>
            </div>
        </PopoverTrigger>
        <PopoverContent class="w-fit p-0" align="center">
            <div class="bg-white rounded-xl shadow-xl overflow-hidden px-4">
                <div class="grid grid-cols-5 gap-4">
                <button
                    v-for="option in shareOptions"
                    :key="option.name"
                    @click="handleShare(option)"
                    class="flex flex-col items-center justify-center py-4 hover:bg-gray-50 transition-colors"
                >
                     <img :src='option.img' :alt="option.name" class="mb-2 w-8 h-8"/>
                    <span class="text-xs text-gray-700 font-medium">
                    {{ option.name }}
                    </span>
                </button>
                </div>
            </div>
        </PopoverContent>
    </Popover>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { ref, computed } from 'vue';
import { Share2 } from 'lucide-vue-next';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from '@/components/ui/toast'

const props = defineProps<{
  vendorName : string
}>()
const copied = ref(false);
const baseLink = 'https://weeshr.com/v';
const vendorSlug = computed(() => {
  return props.vendorName.toLowerCase().replace(/\s+/g, '-');
});
const storeLink = computed(() => {
  return `${baseLink}/${vendorSlug.value}`;
});

const shareOptions = computed(() => [
  {
    name: 'WhatsApp',
    img: 'https://res.cloudinary.com/drykej1am/image/upload/v1768753989/weershr-vendor/True_ekrvsz.png',
    url: `https://wa.me/?text=${encodeURIComponent(storeLink.value)}`
  },
  {
    name: 'Gmail',
    img: 'https://res.cloudinary.com/drykej1am/image/upload/v1768753748/weershr-vendor/image_1_vhslqy.png',
    url: `mailto:?subject=Check this out&body=${encodeURIComponent(storeLink.value)}`
  },
  {
    name: 'Facebook',
    img: 'https://res.cloudinary.com/drykej1am/image/upload/v1768753954/weershr-vendor/True_oiiykj.png',
    url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(storeLink.value)}`
  },
  {
    name: 'Instagram',
    img: 'https://res.cloudinary.com/drykej1am/image/upload/v1768753860/weershr-vendor/True_m8azmx.png',
    url: 'instagram://story-camera'
  },
  {
    name: 'Copy',
    icon: copied.value 
      ? `<div class="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center">
          <svg class="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>`
      : `<div class="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>`,
        img: "https://res.cloudinary.com/drykej1am/image/upload/v1768753359/weershr-vendor/copy_ik7ny8.png",
    action: 'copy'
  }
]);

const handleShare = (option: any) => {
  if (option.action === 'copy') {
    navigator.clipboard.writeText(storeLink.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
    toast({
      title: 'Link Copied',
      description: 'Store link has been copied to clipboard.',
      duration: 3000,
      variant: 'success',
    });
    if (navigator.share) {
      navigator.share({
        title: "Check this out",
        text: "Check this out",
        url: storeLink.value,
      });
    }
  } else if (option.url) {
    window.open(option.url, '_blank');
  }
};
</script>
<!-- copy - https://res.cloudinary.com/drykej1am/image/upload/v1768753359/weershr-vendor/copy_ik7ny8.png -->
 <!-- share - https://res.cloudinary.com/drykej1am/image/upload/v1768753714/weershr-vendor/share-line_qm3okd.png -->
  <!-- gmail - https://res.cloudinary.com/drykej1am/image/upload/v1768753748/weershr-vendor/image_1_vhslqy.png -->
<!-- IG - https://res.cloudinary.com/drykej1am/image/upload/v1768753860/weershr-vendor/True_m8azmx.png -->
 <!-- FB - https://res.cloudinary.com/drykej1am/image/upload/v1768753954/weershr-vendor/True_oiiykj.png -->
  <!-- WH - https://res.cloudinary.com/drykej1am/image/upload/v1768753989/weershr-vendor/True_ekrvsz.png -->