<script setup lang="ts">
import { ref, onMounted, onBeforeMount } from 'vue'

import { Button } from '@/components/ui/button'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { Loader2, Ticket, Eye, EyeOff, Mail } from 'lucide-vue-next'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { toast } from '@/components/ui/toast'
import axios from '@/services/ApiService'
import { catchErr } from '@/composables/catchError'
import { useRouter } from 'vue-router'

// Step constants
const STEP = {
  EMAIL: 1,
  VERIFY_AND_RESET: 2
}

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const currentYear = ref(new Date().getFullYear())
const router = useRouter()

// Step management with sessionStorage
const currentStep = ref(STEP.EMAIL)
const userEmail = ref('')
const otpCode = ref('')

// Create refs to track input values
const passwordValue = ref('')
const confirmPasswordValue = ref('')

const loading = ref(false)

// Watch sessionStorage for step changes
const initializeStep = () => {
  const savedStep = sessionStorage.getItem('resetPasswordStep')
  const savedEmail = sessionStorage.getItem('resetPasswordEmail')
  
  if (savedStep) {
    currentStep.value = parseInt(savedStep)
  }
  if (savedEmail) {
    userEmail.value = savedEmail
  }
}

const updateSessionStorage = () => {
  sessionStorage.setItem('resetPasswordStep', currentStep.value.toString())
  if (userEmail.value) {
    sessionStorage.setItem('resetPasswordEmail', userEmail.value)
  }
}

const updateYear = () => {
  currentYear.value = new Date().getFullYear()
}

onMounted(() => {
  updateYear()
  setInterval(updateYear, 1000 * 60 * 60 * 24 * 30)
})

// Email form schema
const emailFormSchema = toTypedSchema(
  z.object({
    email: z
      .string({
        required_error: 'Please enter your email'
      })
      .email('Invalid email address')
  })
)

// Password form schema
const passwordFormSchema = toTypedSchema(
  z
    .object({
      password: z
        .string({
          required_error: 'Please enter your password',
        })
        .min(9, 'Password must be at least 9 characters long')
        .regex(/\d/, 'Password must contain at least one number')
        .regex(
          /[!@#$%^&*(),.?":{}|<>]/,
          'Password must contain at least one symbol'
        )
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter'),
      confirmPassword: z
        .string({
          required_error: 'Please confirm your password'
        })
        .min(9)
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword']
    })
)

// Create separate forms for each step
const emailForm = useForm({
  validationSchema: emailFormSchema
})

const passwordForm = useForm({
  validationSchema: passwordFormSchema
})

const onPasswordInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  passwordValue.value = target.value
}

const onConfirmPasswordInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  confirmPasswordValue.value = target.value
}

// Step 1: Send email with reset link/OTP
const sendResetEmail = async () => {
  loading.value = true

  if(!/\S+@\S+\.\S+/.test(userEmail.value)){
    toast({
      description: 'Please enter a valid email address',
      variant: 'destructive'
    })
    loading.value = false
    return
  }

  try {
    toast({
      title: 'Sending Email',
      description: 'Please wait...',
      variant: 'loading',
      duration: 0
    })

    const response = await axios.post(
      '/api/v1/market/vendor/user/forgot-password/send-email',
      {
        email: userEmail.value
      }
    )

    if (response.status === 200 || response.status === 201) {
      userEmail.value = userEmail.value.trim()
      currentStep.value = STEP.VERIFY_AND_RESET
      updateSessionStorage()

      toast({
        title: 'Success',
        description: 'OTP sent to your email address',
        variant: 'success'
      })
    }
  } catch (err: any) {
    catchErr(err)
    toast({
      description: err?.response?.data?.message || err?.message || 'Failed to send email',
      variant: 'destructive'
    })
  } finally {
    loading.value = false
  }
}

// Step 2: Verify OTP and Reset Password in one request
const verifyAndResetPassword = passwordForm.handleSubmit(async (values) => {
  if (!otpCode.value || otpCode.value.length < 5) {
    toast({
      description: 'Please enter a valid OTP (5 characters)',
      variant: 'destructive'
    })
    return
  }

  loading.value = true

  try {
    toast({
      title: 'Resetting Password',
      description: 'Please wait...',
      variant: 'loading',
      duration: 0
    })

    const response = await axios.post(
      '/api/v1/market/vendor/user/reset-password',
      {
        email: userEmail.value,
        token: otpCode.value.toString(),
        newPassword: values.password
      }
    )

    if (response.status === 200 || response.status === 201) {
      toast({
        title: 'Success',
        description: 'Password reset successfully!',
        variant: 'success'
      })

      // Clear sessionStorage
      sessionStorage.removeItem('resetPasswordStep')
      sessionStorage.removeItem('resetPasswordEmail')

      // Reset forms
      emailForm.resetForm()
      passwordForm.resetForm()
      passwordValue.value = ''
      confirmPasswordValue.value = ''
      userEmail.value = ''
      otpCode.value = ''

      // Redirect to login
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }
  } catch (err: any) {
    catchErr(err)
    toast({
      description: err?.response?.data?.message || err?.message || 'Failed to reset password',
      variant: 'destructive'
    })
  } finally {
    loading.value = false
  }
})

// Go back to previous step
const goBack = () => {
  if (currentStep.value === STEP.VERIFY_AND_RESET) {
    currentStep.value = STEP.EMAIL
    otpCode.value = ''
    passwordForm.resetForm()
  }
  updateSessionStorage()
}

const fetchVendorsData = async () => {
  try {
    // Initialize step from sessionStorage
    initializeStep()
  } catch (error: any) {
    catchErr(error)
  }
}

onBeforeMount(() => {
  fetchVendorsData()
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
                <CardTitle class="text-2xl text-white font-outfit">
                  {{ currentStep === STEP.EMAIL ? 'Reset Password' : 'Verify OTP & Create Password' }}
                </CardTitle>
                <p class="text-xs text-gray-400">
                  Step {{ currentStep }} of 2
                </p>
              </CardHeader>
              <CardContent class="grid gap-4">
                <!-- Step 1: Email Input -->
                <form v-if="currentStep === STEP.EMAIL" class="space-y-4" @submit.prevent="sendResetEmail">
                  <FormField name="email">
                    <FormItem>
                      <FormControl>
                        <div class="relative">
                          <div class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                            <Mail class="w-4 h-6 text-[#4145A7]" />
                          </div>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email address"
                            class="focus-visible:ring-[#BAEF23] pl-10"
                            v-model="userEmail"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </form>

                <!-- Step 2: OTP and Password Input -->
                <form v-if="currentStep === STEP.VERIFY_AND_RESET" class="space-y-4" @submit.prevent="verifyAndResetPassword">
                  <div class="space-y-4">
                    <div>
                      <p class="text-sm text-gray-300 mb-4">
                        Enter the OTP sent to <span class="text-[#BAEF23]">{{ userEmail }}</span>
                      </p>
                      <div class="flex justify-center mb-6">
                        <InputOTP
                          v-model="otpCode"
                          :maxlength="5"
                          inputtype="text"
                          inputmode="text"
                        >
                          <InputOTPGroup>
                            <InputOTPSlot class="text-white" v-for="(_, index) in 5" :key="index" :index="index" />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </div>

                    <FormField v-slot="{ componentField }" name="password">
                      <FormItem>
                        <FormControl>
                          <div class="relative">
                            <div class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                              <Ticket class="w-4 h-6 text-[#4145A7]" />
                            </div>
                            <Input
                              id="password"
                              :type="showPassword ? 'text' : 'password'"
                              placeholder="Your new password"
                              class="focus-visible:ring-[#BAEF23] pl-10 pr-10"
                              v-bind="componentField"
                              @input="onPasswordInput"
                            />
                            <button
                              type="button"
                              @click="showPassword = !showPassword"
                              class="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-white"
                            >
                              <Eye v-if="!showPassword" class="w-5 h-5 text-[#4145A7]" />
                              <EyeOff v-else class="w-5 h-5 text-[#4145A7]" />
                            </button>
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
                              :type="showConfirmPassword ? 'text' : 'password'"
                              placeholder="Confirm password"
                              class="focus-visible:ring-[#BAEF23] pl-10 pr-10"
                              v-bind="componentField"
                              @input="onConfirmPasswordInput"
                            />
                            <button
                              type="button"
                              @click="showConfirmPassword = !showConfirmPassword"
                              class="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-white"
                            >
                              <Eye v-if="!showConfirmPassword" class="w-5 h-5 text-[#4145A7]" />
                              <EyeOff v-else class="w-5 h-5 text-[#4145A7]" />
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <div class="flex flex-col w-full gap-3">
                  <div class="flex items-center justify-end w-full gap-2">
                    <!-- Back Button -->
                    <Button
                      v-if="currentStep > STEP.EMAIL"
                      @click="goBack"
                      type="button"
                      :disabled="loading"
                      variant="outline"
                      class="text-gray-300 hover:text-white border-gray-600 hover:bg-gray-900"
                    >
                      Back
                    </Button>

                    <!-- Submit Button for Step 1 -->
                    <Button
                      v-if="currentStep === STEP.EMAIL"
                      @click="sendResetEmail"
                      type="submit"
                      :disabled="loading || !userEmail || !/\S+@\S+\.\S+/.test(userEmail)"
                      class="w-full bg-[#BAEF23] hover:bg-[#BAEF23] hover:scale-105 text-black font-normal px-8 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-black animate-spin" />
                      Send OTP
                    </Button>

                    <!-- Submit Button for Step 2 -->
                    <Button
                      v-if="currentStep === STEP.VERIFY_AND_RESET"
                      @click="verifyAndResetPassword"
                      type="submit"
                      :disabled="loading || !otpCode || otpCode.length < 5 || !passwordValue || !confirmPasswordValue || passwordValue !== confirmPasswordValue"
                      class="w-full bg-[#BAEF23] hover:bg-[#BAEF23] hover:scale-105 text-black font-normal px-8 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <Loader2 v-if="loading" class="w-4 h-4 mr-2 text-black animate-spin" />
                      Reset Password
                    </Button>
                  </div>
                  <div class="w-full flex items-center justify-end pt-2">
                    <router-link :to="`/login`" class="text-right text-sm text-white hover:underline">
                      Login instead?
                    </router-link>
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