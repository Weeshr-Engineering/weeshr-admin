<script setup lang="ts">
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetDescription,
  SheetTrigger
} from '@/components/ui/sheet'
import { Button } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import MainNav from '@/components/MainNav.vue'
import DashboardFooter from '@/components/DashboardFooter.vue'
import { ref, onMounted } from 'vue'
import { useConfigStore } from '@/stores/config-details/config-detail'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

const formSchema = toTypedSchema(
  z.object({
    roleName: z.string().nonempty('Please add a Name'),
    description: z.string().nonempty('Add description'),
    permissions: z.array(z.string()).nonempty('Select Permission')
  })
)

const { handleSubmit } = useForm({
  validationSchema: formSchema
})

const onSubmit = handleSubmit(async (values) => {
  const data = JSON.stringify({
    'name': values.roleName,
    'description': values.description,
    'permissions': values.permissions
  })
  useConfigStore().createRole(data)
})
const sheetCLose = ref(true)

const handleSheet = ()=>{
    sheetCLose.value = !sheetCLose.value
}

const roles = ref<any[]>([])
const permissions = ref<any[]>([])

onMounted(async()=>{
    roles.value = await useConfigStore().getRoles()
    permissions.value = await useConfigStore().getPermissions()
})
</script>

<template>
    <div class="w-full">
        <MainNav class="mx-6" headingText="Role Manager" />
        <div class="px-10 py-5 md:py-10 ml-auto w-full flex justify-end">
            <Sheet :close='sheetCLose'>
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
                    <h3 class="text-2xl font-medium">Add New Role</h3>
                    
                    </SheetHeader>
                    <SheetDescription class="pt-2 flex items-center gap-4">
                        Active <Switch :checked="true"/>
                    </SheetDescription>
                </div>
                <div>
                    <form class="space-y-4" @submit.prevent="onSubmit">
                        <FormField v-slot="{ componentField }" name="roleName">
                            <FormItem v-auto-animate>
                              <FormLabel class="text-blue-900">Name of Role</FormLabel>
                              <FormControl>
                                <Input
                                  id="text"
                                  type="text"
                                  class="focus-visible:ring-blue-600"
                                  v-bind="componentField"
                                />
                              </FormControl>
            
                              <FormMessage for="roleName" />
                            </FormItem>
                          </FormField>

                          <FormField v-slot="{ componentField }" name="description">
                            <FormItem v-auto-animate>
                              <FormLabel class="text-blue-900">Description</FormLabel>
                              <FormControl>
                                <Input
                                  id="text"
                                  type="text"
                                  class="focus-visible:ring-blue-600"
                                  v-bind="componentField"
                                />
                              </FormControl>
            
                              <FormMessage for="description" />
                            </FormItem>
                          </FormField>

                          <FormField v-slot="{ componentField }" name="permissions">
                            <FormItem v-auto-animate>
                              <FormLabel class="text-blue-900">Select Module Access</FormLabel>
                              <FormControl>
                                <ToggleGroup type="multiple" variant="outline" v-bind="componentField" class="flex flex-wrap justify-start">
                                    <ToggleGroupItem v-for="(item, key) in permissions" :key=key  :value="item.identifier">
                                      {{item.name}}
                                    </ToggleGroupItem>
                                  </ToggleGroup>
                              </FormControl>
            
                              <FormMessage for="permissions" />
                            </FormItem>
                          </FormField>
                          <div class="flex justify-end items-center gap-4"> 
                            <!-- <Button 
                            variant='outline'
                            @click="handleSheet"
                            >
                                Cancel
                              </Button> -->
                              <Button type="submit" class="bg-[#4145A7]">
                                <!-- <Loader2
                                  color="#ffffff"
                                  v-if="loading"
                                  class="w-4 h-4 mr-2 text-black animate-spin"
                                /> -->
                                Save
                
                                <!-- <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-black animate-spin" /> -->
                              </Button>
                          </div>
                    </form>
                </div>
              </SheetContent>
            </Sheet>
        </div>
        <div class="w-full flex justify-center">
            <div class="min-h-72 w-5/6">
                <div class="flex justify-end w-full text-sm text-[#6A70FF]">
                    <p>Only show active</p>
                </div>
                <Card Content class="mt-4" v-for="(item, key) in roles" :key="key">
                  <CardContent
                    class="flex items-center justify-between px-2 sm:px-6 py-4"
                  >
                    <div
                      class="inline-block bg-[#373B4D] text-[#F8F9FF] rounded-full px-3 py-2 text-sm"
                    >
                      {{item.name[0]}}{{ (item.name)[item.name.length-1].toUpperCase() }}
                    </div>
                    <p class="text-sm text-muted-foreground text-center text-[#000000]">
                      {{ item.description}}
                    </p>
                    <Switch :checked="true"/>
                  </CardContent>
                </Card>
              </div>
        </div>
        <DashboardFooter/>
    </div>
</template>