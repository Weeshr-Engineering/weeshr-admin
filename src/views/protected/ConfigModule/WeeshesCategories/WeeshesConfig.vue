<script setup lang="ts">
import { Switch } from '@/components/ui/switch'
import { Card, CardContent } from '@/components/ui/card'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetDescription,
  SheetTrigger
} from '@/components/ui/sheet'
// import { toast } from '@/components/ui/toast'
import MainNav from '@/components/MainNav.vue'
import DashboardFooter from '@/components/DashboardFooter.vue'
import { ref, onMounted } from 'vue'
import { useConfigStore } from '@/stores/config-details/config-detail'

const sheetCLose = ref(true)

const handleSheet = ()=>{
    sheetCLose.value = !sheetCLose.value
}
const onSubmit=()=>{
    console.log('submitted')
}
const categories = ref<any[]>([])

onMounted(async()=>{
    useConfigStore().getWeesheCategories()
})
</script>

<template>
    <div class="w-full">
        <MainNav class="mx-6" headingText="Weesh Categories" />
        <div class="px-10 py-10 ml-auto w-full flex justify-end">
            <Sheet :close='false'>
              <SheetTrigger as-child>
                <button @click="handleSheet" class="bg-[#020721] px-4 py-2 rounded-xl w-50 h-12">
                  <div class="text-base text-[#F8F9FF] text-center flex items-center">
                    Add New
                    <svg
                      width="20"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      class="ml-6"
                    >
                      <path
                        d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16 12.75H12.75V16C12.75 16.41 12.41 16.75 12 16.75C11.59 16.75 11.25 16.41 11.25 16V12.75H8C7.59 12.75 7.25 12.41 7.25 12C7.25 11.59 7.59 11.25 8 11.25H11.25V8C11.25 7.59 11.59 7.25 12 7.25C12.41 7.25 12.75 7.59 12.75 8V11.25H16C16.41 11.25 16.75 11.59 16.75 12C16.75 12.41 16.41 12.75 16 12.75Z"
                        fill="#F8F9FF"
                      />
                    </svg>
                  </div>
                </button>
              </SheetTrigger>
              <SheetContent class="overflow-y-auto py-8">
               <div class="flex py-4 justify-between items-center">
                    <SheetHeader>
                    <h3 class="text-2xl font-medium">Add New Weeshes Categories</h3>
                    
                    </SheetHeader>
                    <SheetDescription class="flex items-center gap-4">
                        Active <Switch />
                    </SheetDescription>
                </div>
                
              </SheetContent>
            </Sheet>
        </div>
        <div class="w-full flex justify-center">
            <div class="w-3/4">
                <div class="flex justify-end w-full text-sm text-[#6A70FF]">
                    <p>Only show active</p>
                </div>
                <Card Content class="mt-4">
                  <CardContent
                    class="flex items-center justify-between px-2 sm:px-6 py-4"
                  >
                    <span class="flex gap-2 items-center"><div
                      class="inline-block text-[#F8F9FF] w-14 h-14 rounded-full"
                    >
                      <img src='https://res.cloudinary.com/dotojp6xu/image/upload/v1717282275/Rectangle_14_e6xvfs.svg'
                      />
                    </div>
                    <p class="text-sm text-muted-foreground text-center text-[#000000]">
                      Gadget
                    </p>
                  </span>
                    <Switch :checked="true"/>
                  </CardContent>
                </Card>

                <Card Content class="mt-4">
                  <CardContent
                    class="flex items-center justify-between px-2 sm:px-6 py-4"
                  >
                    <span class="flex gap-2 items-center"><div
                      class="inline-block text-[#F8F9FF] w-14 h-14 rounded-full"
                    >
                      <img src='https://res.cloudinary.com/dotojp6xu/image/upload/v1717282301/Rectangle_12_uqg9ln.svg'
                      />
                    </div>
                    <p class="text-sm text-muted-foreground text-center text-[#000000]">
                      Body & Beauty
                    </p>
                  </span>
                    <Switch :checked="true"/>
                  </CardContent>
                </Card>

                <Card Content class="mt-4">
                  <CardContent
                    class="flex items-center justify-between px-2 sm:px-6 py-4"
                  >
                    <span class="flex gap-2 items-center"><div
                      class="inline-block text-[#F8F9FF] w-14 h-14 rounded-full"
                    >
                      <img src='https://res.cloudinary.com/dotojp6xu/image/upload/v1717282327/Rectangle_12_1_hji8oa.svg'
                      />
                    </div>
                    <p class="text-sm text-muted-foreground text-center text-[#000000]">
                      Automobile
                    </p>
                  </span>
                    <Switch :checked="true"/>
                  </CardContent>
                </Card>
              </div>
        </div>
        <DashboardFooter/>
    </div>
</template>