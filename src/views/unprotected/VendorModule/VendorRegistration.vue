<script setup lang="ts">
import { ref, onMounted, onBeforeMount } from 'vue'

import { Button } from '@/components/ui/button'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { Loader2, Building2,  Ticket } from 'lucide-vue-next'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'
import axios from 'axios'
import { catchErr } from '@/composables/catchError'
import { useRoute, useRouter } from 'vue-router'

const currentYear = ref(new Date().getFullYear())
const router = useRouter()
const route = useRoute()
const id = route.query.id
const vendor = route.query.vendor

const updateYear = () => {
  currentYear.value = new Date().getFullYear()
}


onMounted(() => {
  updateYear()
  setInterval(updateYear, 1000 * 60 * 60 * 24 * 30) // Update the year once a month
})

const loading = ref(false)

// Create refs to track input values
const emailValue = ref('')
const passwordValue = ref('')
const confirmPasswordValue = ref('')

const formSchema = toTypedSchema(
  z.object({
    password: z
      .string({
        required_error: 'Please enter your password '
      })
      .min(9),
    
    confirmPassword: z
      .string({
        required_error: 'Please confirm your password'
      })
      .min(9)
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
)

const form = useForm({
  validationSchema: formSchema
})

const onPasswordInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  passwordValue.value = target.value
}

const onConfirmPasswordInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  confirmPasswordValue.value = target.value
}

const saveDetails = async (password: string) => {
    toast({
      title: 'Loading Data',
      description: 'Processing...',
      variant: 'loading',
      duration: 0 // Set duration to 0 to make it indefinite until manually closed
    })
    // VendorListStore.loadingControl(true)
    try {
      const response = await axios.post(
        `/api/v1/market/invites/${id}/accept`,
        {
          "password": password
        }
      )

      // Check if response status is 200 or 201
      if (response.status === 200 || response.status === 201) {
        // Show success toast
        // console.log(response)
        
        toast({
          title: 'Success',
          description: `Registration successfully!`,
          variant: 'success'
        })
      }
      // Handle success
    } catch (err: any) {
      //   VendorListStore.loadingControl(false)
      // console.log(err)
      catchErr(err)
      // Handle other errors
    }
  }

const onSubmit = form.handleSubmit(async () => {
  loading.value = true

  // Ensure userEmail and password have values
  if (form.values.password && form.values.confirmPassword) {
    const { password } = form.values

    // Set the username and password in the store
    // setPassword(password)


    try {
      await saveDetails(password)
      
      // toast({
      //   description: 'Form submitted successfully!',
      //   variant: 'default'
      // })

      // Reset form after successful submission
      form.resetForm()
      passwordValue.value = ''
      confirmPasswordValue.value = ''
      router.push('/')

    } catch (error: any) {
      loading.value = false
      
      return toast({
        description: error?.message || 'An error occurred',
        variant: 'destructive'
      })
    }
  } else {
    // Handle the case when form fields are empty
    toast({
      description: 'Please fill in all fields.',
      variant: 'destructive'
    })

    loading.value = false
  }
  
  loading.value = false
})

const fetchVendorsData = async (msg: string) => {
  toast({
    title: 'Loading Data',
    description: 'Validating....',
    variant: 'loading',
    duration: 0 // Set duration to 0 to make it indefinite until manually closed
  })

  try {
    // Set loading to true
    // useGeneralStore().setLoading(true)
    const response = await axios.get(`/api/v1/market/invites/${id}`)

    if (response.status === 200 || response.status === 201) {
      if(response.data.data.acceptedAt !== null){
        toast({
          title: 'Success',
          description: `Invite already accepted please login!`,
          variant: 'success'
        })  
        router.push('/')
        return;
      }
      toast({
        title: 'Success',
        description: `Success- ${msg}`,
        variant: 'success'
      })
    }
    // set Loading to false
    // useGeneralStore().setLoading(false)
  } catch (error: any) {
    catchErr(error)
    // console.log(error)
    if (error.response.status === 401) {
      // sessionStorage.removeItem('token')
      // Clear token from superAdminStore
      // superAdminStore.setToken('')

      setTimeout(() => {
        // router.push({ name: 'super-admin-login' })
      }, 3000)

      toast({
        title: 'Unauthorized',
        description: 'You are not authorized to perform this action. Redirecting to home page...',
        variant: 'destructive'
      })
      // Redirect after 3 seconds
    } else {
      toast({
        description: error.response.data.message || 'An error occurred',
        variant: 'destructive'
      })
    }
  }
}

onBeforeMount(()=>{
  fetchVendorsData('Success')
})
</script>

<template>
  <div
    class="bg-[url('https://res.cloudinary.com/drykej1am/image/upload/v1710591674/kimcfu0uld547xavvpkn.png')] bg-cover relative"
  >
    <div
      class="container flex flex-col items-center justify-center w-full h-screen md:grid lg:max-w-none lg:grid-cols-2 lg:px-0"
    >
      <img
        class="absolute bottom-0 h-[640px] w-fit absoluteImg"
        src="https://res.cloudinary.com/drykej1am/image/upload/v1710588213/gljbojydunbpercw3cqx.png"
        alt="gradient"
      />

      <div
        class="relative flex-col hidden h-full p-10 pb-0 text-white bg-center bg-no-repeat bg-cover lg:flex"
      >
        <img
          class="hidden lg:block absolute bottom-0 h-[280px] w-auto transform left-1/2 -translate-x-[50%]"
          src="https://res.cloudinary.com/drykej1am/image/upload/v1710592164/weeshr_admin/loginPage/cpv0br6dhygp8nyqzyeh.svg"
          alt="gradient"
        />

        <div class="inset-0 flex items-center justify-center w-full h-full text-center -left-[20%]">
          <div
            aria-current="page"
            class="flex items-center -translate-y-[145px] flex-col justify-center space-y-2"
          >
            <h4 class="text-[#F8F9FFB2] tracking-widest">THE</h4>
            <img
              class="w-auto h-24"
              src="https://res.cloudinary.com/drykej1am/image/upload/v1697377875/weehser%20pay/Weeshr_Light_lrreyo.svg"
              alt=""
            />
            <h4 class="text-[#F8F9FFB2] tracking-widest font-outfit">SUPER ADMIN FACTORY</h4>
          </div>
        </div>
      </div>
      <div class="flex justify-center w-full lg:p-8">
        <div class="w-full max-w-sm lg:p-8">
          <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div class="flex flex-col space-y-2 text-center">
              <div
                aria-current="page"
                class="flex lg:hidden justify-center -translate-y-[60px] flex-col space-y-2"
              >
                <h4 class="text-[#F8F9FFB2] tracking-widest">THE</h4>

                <img
                  class="w-auto h-20"
                  src="https://res.cloudinary.com/drykej1am/image/upload/v1697377875/weehser%20pay/Weeshr_Light_lrreyo.svg"
                  alt=""
                />
                <h4 class="text-[#F8F9FFB2] tracking-widest">SUPER ADMIN FACTORY</h4>
              </div>
            </div>

            <Card class="relative py-3 border-0 rounded-2xl bg-[#D9D9D91A]">
              <img
                class="absolute w-auto h-20 -top-[40px]"
                src="https://res.cloudinary.com/drykej1am/image/upload/v1710587777/mksb1isi3h5kihgepmuv.svg"
                alt=""
              />

              <img
                class="absolute w-auto h-16 -bottom-[35px] right-[60px]"
                src="https://res.cloudinary.com/drykej1am/image/upload/v1710587780/ed8ljwdauwhuge9mjgzr.svg"
                alt=""
              />

              <CardHeader class="space-y-1 pt-9">
                <CardTitle class="text-2xl text-white font-outfit"> Complete Registration</CardTitle>
              </CardHeader>
              <CardContent class="grid gap-4">
                <form class="space-y-4" @submit.prevent="onSubmit">
                  <!-- <FormField v-slot="{ componentField }" name="userEmail">
                    <FormItem v-auto-animate>
                      <FormControl> -->
                        <div class="relative">
                          <div class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                              <Building2 class="w-4 h-6 text-[#4145A7]" />
                          </div>
                          <!-- <Input
                            id="email"
                            type="email"
                            placeholder="Your username"
                            class="focus-visible:ring-[#BAEF23] pl-10 pr-3"
                            v-bind="componentField"
                            @input="onEmailInput"
                          /> -->
                          <span 
                            v-if="!emailValue"
                            class="absolute inset-y-0 right-0 flex items-center gap-1 pr-3 text-gray-400 text-sm transition-opacity duration-200"
                          >
                            <span class="font-semibold truncate w-40">{{ vendor }}</span> X <span class="font-semibold"> WEESHR</span>
                          </span>
                        </div>
                      <!-- </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField> -->
                  
                  <FormField v-slot="{ componentField }" name="password">
                    <FormItem>
                      <FormControl>
                        <div class="relative">
                          <div class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                              <Ticket class="w-4 h-6 text-[#4145A7]" />
                          </div>
                          <Input
                            id="password"
                            type="password"
                            placeholder="Your password"
                            class="focus-visible:ring-[#BAEF23] pl-10 pr-3"
                            v-bind="componentField"
                            @input="onPasswordInput"
                          />
                        
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  
                  <FormField v-slot="{ componentField }" name="confirmPassword">
                    <FormItem>
                      <FormControl>
                        <div class="relative">
                          <div class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                              <Ticket class="w-4 h-6 text-[#4145A7]" />
                          </div>
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm password"
                            class="focus-visible:ring-[#BAEF23] pl-10 pr-3"
                            v-bind="componentField"
                            @input="onConfirmPasswordInput"
                          />
                         
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </form>
              </CardContent>
             <CardFooter>
  <div class="flex flex-col w-full">
    <div class="flex items-center justify-end w-full mb-4">
      <!-- <a href="#" class="text-sm text-white hover:underline">
        Forgot credentials?
      </a> -->
      <Button
        @click="onSubmit()"
        type="submit"
        :disabled="loading"                    
        class="bg-[#BAEF23] hover:bg-[#BAEF23] hover:scale-105 text-black font-normal px-8"
      >
        <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-black animate-spin" />
        Enter
      </Button>
    </div>
    <div class="pt-5 text-xs text-center text-gray-400">
      <span> Copyright © {{ currentYear }} </span>
    </div>
  </div>
</CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.absoluteImg {
  width: -webkit-fill-available;
  width: -moz-available;
}
.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
<!-- 
categoryIds
: 
[]
companyAddress
: 
"20 Marina, Lagos Island, Lagos"
companyEmail
: 
"WakameRestaurant@yahoo.com"
companyName
: 
"Wakame Restaurant"
companyState
: 
"Lagos"
companyType
: 
"COMPANY"
cover
: 
null
createdAt
: 
"2025-10-26T12:43:09.379Z"
deletedAt
: 
null
isDeleted
: 
false
logo
: 
null
rcNumber
: 
23935
status
: 
"published"
updatedAt
: 
"2025-10-26T12:43:09.379Z"
__v
: 
0
_id
: 
"68fe175da98f5d209988f4b7" -->