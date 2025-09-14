<template>
    <div class="py-5 ml-auto">
      <Sheet :close="sheetOpen">
        <SheetTrigger as-child>
          <button @click="sheetOpen = true" class="bg-[#020721] px-4 py-2 rounded-xl w-50 h-12">
            <div class="text-base text-[#F8F9FF] text-center flex items-center">
              Add
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
        <SheetContent class="overflow-y-auto">
          <SheetHeader>
            <h3 class="text-2xl font-medium">Create User profile</h3>
            <SheetDescription>
              Add a new profile here. Click submit when you're done.
            </SheetDescription>
          </SheetHeader>
          <CardContent class="grid gap-4 pt-10">
            <form class="space-y-4" @submit="onSubmit">
              <FormField v-slot="{ componentField }" name="vendor">
                <FormItem v-auto-animate>
                  <FormLabel class="text-blue-900">Vendor</FormLabel>
                  <FormControl>
                    <Input
                      id="text"
                      type="text"
                      placeholder="Vendor Name"
                      class="focus-visible:ring-blue-600"
                      v-bind="componentField"
                    />
                  </FormControl>

                  <FormMessage for="vendor" />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="userEmail">
                <FormItem v-auto-animate>
                  <FormLabel class="text-blue-900">Email</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      placeholder="weeshr@admin.com"
                      class="focus-visible:ring-blue-600"
                      v-bind="componentField"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="phone">
                <FormItem v-auto-animate>
                  <FormLabel class="text-blue-900">Phone Number</FormLabel>
                  <FormControl>
                    <vue-tel-input
                      mode="international"
                      id="phone"
                      type="tel"
                      placeholder="Last Name"
                      class="focus-visible:ring-blue-600"
                      v-bind="componentField"
                    >
                    </vue-tel-input>
                  </FormControl>

                  <FormMessage for="phone" />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="category">
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <select
                    v-bind="componentField"
                    id="category"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Category"
                  >
                    <option value="" disabled selected hidden>Select Vendor Category</option>
                    <option value="cash">Cash</option>
                    <option value="gift">Gift Cards</option>
                    <option value="all">All Category</option>
                  </select>
                  <FormMessage for="category" />
                </FormItem>
              </FormField>

              <Button :disabled="loading" type="submit">
                <Loader2
                  color="#ffffff"
                  v-if="loading"
                  class="w-4 h-4 mr-2 text-black animate-spin"
                />
                Submit

                <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-black animate-spin" />
              </Button>
            </form>
          </CardContent>
        </SheetContent>
      </Sheet>
    </div>
</template>

<script setup lang="ts">
    import { Loader2 } from 'lucide-vue-next'
// import router from '@/router'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetDescription,
  SheetTrigger
} from '@/components/ui/sheet'
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useDateFormat, useNow } from '@vueuse/core'
import VueTelInput from 'vue-tel-input'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const formSchema = toTypedSchema(
  z.object({
    vendor: z
      .string()
      .min(2, { message: 'Vendor name must be at least 2 characters long' })
      .max(50, { message: 'Vendor name cannot be longer than 50 characters' })
      .nonempty('Please enter your first name'),

    userEmail: z.string().email('Please enter a valid email address'),
    category: z.string().nonempty('Please select Category'),
    status: z.boolean().optional(),
    phone: z.string().nonempty('Please enter your phone number')
  })
)
const { handleSubmit } = useForm({
  validationSchema: formSchema
})

const newUser = ref({
  vendor: '',
  userEmail: '',
  category: ''
})
const sheetOpen = ref(false)
const loading = ref(false)

const onSubmit = handleSubmit(async (values) => {
  loading.value = true

  const user = {
    vendor: values.vendor,
    email: values.userEmail,
    category: values.category,
    phone: {
      phoneNumber: values.phone
    },
    dateJoined: formattedDate.value,
    disabled: values.status || false
  }

  // await saveUserData(user)

//   users.value.push(user)

  sheetOpen.value = false

  // Show success toast

  // Reset form fields
  newUser.value = {
    vendor: '',
    userEmail: '',
    category: ''
  }
})

const formattedDate = useDateFormat(useNow(), 'ddd, D MMM YYYY')
</script>