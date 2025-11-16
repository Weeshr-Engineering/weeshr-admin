<script setup lang="ts">
import { defineProps, onMounted } from 'vue'
import VendorsIcon from './VendorsIcon.vue'
// Function to format the date in the desired format (e.g., "Tue, 5 Feb 2023")
import { useDateFormat, useNow } from '@vueuse/core'
import { useSuperAdminStore } from '@/stores/super-admin/super-admin'
import axios from 'axios'
import { toast } from './ui/toast'
import { catchErr } from '@/composables/catchError'

const superAdminStore = useSuperAdminStore()
const user = superAdminStore.getLocalstorageData()

const formattedDate = useDateFormat(useNow(), 'ddd, D MMM YYYY')

const props = defineProps<{
  headingText: string
}>()

const fetchUsersData = async (msg: string) => {
  toast({
    title: 'Loading Data',
    description: 'Fetching data...',
    variant: 'loading',
    duration: 0 // Set duration to 0 to make it indefinite until manually closed
  })

  try {
    // Set loading to true
    // useGeneralStore().setLoading(true)
    console.log(user.id)
    const response = await axios.get(`/api/v1/admin/market/vendor/${user.id}`)

    if (response.status === 200 || response.status === 201) {
      // Update the users data with the response
      console.log(response)
      // vendor.value = response.data.data;
      // const responseData = response.data.data[0]
      // const phoneData = response.data.data[0].phoneNumber.normalizedNumber
      // const data = { ...responseData, phone: phoneData }
      // Show success toast
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
        title: error.response.data.message || 'An error occurred',
        variant: 'destructive'
      })
    }
  }
} // Call the fetchUsersData function when the component is mounted

onMounted(()=>{
  fetchUsersData('Data collected')
})

const headingText = props.headingText
</script>

<template>
  <nav class="flex items-center justify-between p-4 py-6 space-x-4 lg:space-x-6">
    <div>
      <h4 class="text-[#02072199] text-sm">
        {{ formattedDate }}
      </h4>

      <h2 class="text-3xl">
        {{ headingText }}
      </h2>
    </div>

    <div class="items-center hidden ml-auto space-x-2 sm:flex">
      <div>
        <h6 class="font-semibold">Dang!</h6>
        <!-- <h6 class="text-xs text-end text-[#373B4D]">Administrator</h6> -->
      </div>
      <VendorsIcon/>
    </div>
  </nav>
</template>
