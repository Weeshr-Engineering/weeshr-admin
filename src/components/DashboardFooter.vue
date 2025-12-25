<template>
  <footer
    class="relative bg-[#FFFFFF] flex flex-col md:flex-row items-center justify-between mx-4 rounded-xl px-7 py-5 mb-6"
  >
    <div class="flex flex-col md:flex-row items-center gap-2">
      <h3 class="text-xs text-center md:text-xs">©2024 Weeshr, LLC. All right reserved.</h3>
      <svg class="hidden md:inline-block" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 256 256"><g fill="currentColor"><path d="M176 128a48 48 0 1 1-48-48a48 48 0 0 1 48 48" opacity="0.2"/><path d="M140 128a12 12 0 1 1-12-12a12 12 0 0 1 12 12"/></g></svg>
      <div class="flex items-center gap-2">
        <div class="relative">
          <label @click="()=> showTermsDropdown = !showTermsDropdown" for="terms" class="text-xs text-[#1a1f2e] cursor-pointer">
            Terms and conditions
          </label>
          <!-- Dropdown -->
          <div
            v-if="showTermsDropdown"
            class="absolute left-0 top-6 z-10 bg-[#1a1f2e] border border-gray-600 rounded-md shadow-lg p-2 min-w-[250px]"
          >
            <a
              href="/WEESHR MARKETPLACE VENDOR PARTNERSHIP AGREEMENT (1).pdf"
              target="_blank"
              class="block text-xs text-[#BAEF23] hover:underline hover:bg-gray-700 p-2 rounded"
              >• Vendor Partnership Agreement</a
            >
            <a
              href="/Data Processing Addendum Weeshr (1) (1).docx"
              target="_blank"
              class="block text-xs text-[#BAEF23] hover:underline hover:bg-gray-700 p-2 rounded"
              >• Data Processing Addendum</a
            >
          </div>
        </div>
      </div>
    </div>
    <div class="flex space-x-2 sm:space-x-1 md:space-x-1">
      <a href="https://www.facebook.com/weeshrapp" target="_blank" rel="noopener noreferrer"
        ><img
          alt="Facebook"
          loading="lazy"
          width="43"
          height="43"
          decoding="async"
          data-nimg="1"
          class="inline-block transition-opacity duration-300 hover:opacity-70 md:w-12"
          src="https://res.cloudinary.com/drykej1am/image/upload/v1708288264/weeshr_website/FB_mufgbd.svg"
          style="color: transparent"
      /></a>
      <a href="https://www.instagram.com/weeshrapp/" target="_blank" rel="noopener noreferrer"
        ><img
          alt="Instagram"
          loading="lazy"
          width="43"
          height="43"
          decoding="async"
          data-nimg="1"
          class="inline-block transition-opacity duration-300 hover:opacity-70 md:w-12"
          src="https://res.cloudinary.com/drykej1am/image/upload/v1708288265/weeshr_website/IG_jw9rir.svg"
          style="color: transparent"
      /></a>
      
      <a href="https://x.com/Weeshr_app" target="_blank" rel="noopener noreferrer"
        ><img
          alt="Twitter"
          loading="lazy"
          width="43"
          height="43"
          decoding="async"
          data-nimg="1"
          class="inline-block transition-opacity duration-300 hover:opacity-70 md:w-12"
          src="https://res.cloudinary.com/drykej1am/image/upload/v1708288266/weeshr_website/X_vigvoj.svg"
          style="color: transparent"
      /></a>
      <a href="https://www.linkedin.com/company/weeshrapp" target="_blank" rel="noopener noreferrer"
        ><img
          alt="LinkedIn"
          loading="lazy"
          width="43"
          height="43"
          decoding="async"
          data-nimg="1"
          class="inline-block transition-opacity duration-300 hover:opacity-70 md:w-12"
          src="https://res.cloudinary.com/drykej1am/image/upload/v1708288750/weeshr_website/Group_80_dhlm3v.svg"
          style="color: transparent"
      /></a>
      <a href="https://www.tiktok.com/@weeshrapp" target="_blank" rel="noopener noreferrer"
        ><img
          alt="TikTok"
          loading="lazy"
          width="43"
          height="43"
          decoding="async"
          data-nimg="1"
          class="inline-block transition-opacity duration-300 hover:opacity-70 md:w-12"
          src="https://res.cloudinary.com/drykej1am/image/upload/v1708288501/weeshr_website/TiTokWeeshr_yvqc4r.svg"
          style="color: transparent"
      /></a>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const showTermsDropdown = ref(false)
</script>
