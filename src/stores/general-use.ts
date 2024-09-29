import { defineStore } from 'pinia'
import { toast } from "@/components/ui/toast";
import router from '@/router'

interface GeneralUseState {
  loading: boolean
}

export const useGeneralStore = defineStore({
  id: 'general-use',
  state: (): GeneralUseState => ({
    loading: false
  }),
  actions: {
    setLoading(loading: boolean) {
      this.loading = loading
    },
    setLoadingToFalse() {
      this.loading = false
    },
    setLoadingToTrue() {
      console.log('hhj')
      this.loading = true
    },
    catchErr (error: any){
      console.log(error)
      if(error.response.status === 400){
        toast({
          description:  error.response.data.message || 'Bad Request',
          variant: 'destructive'
        })
      }else if(error.response.status === 401){
        setTimeout(() => {
          router.push({ name: 'superAdmin-login' })
        }, 1000)
        toast({
          description:  error.response.data.message || 'Unauthenticated',
          variant: 'destructive'
        })
        sessionStorage.removeItem('token')
      }else if(error.response.status === 403){
        toast({
          description:  error.response.data.message || 'Unauthorized',
          variant: 'destructive'
        })
        setTimeout(() => {
          router.push({ name: 'home' })
        }, 3000)
      }else if(error.response.status === 422 ){
        toast({
          description:  error.response.data.message || 'Validation Error',
          variant: 'destructive'
        })
      }else if(error.response.status === 500 ){
        toast({
          description:  error.response.data.message || 'Server Error',
          variant: 'destructive'
        })
      }else if(error.response.status === 404 ){
        toast({
          description:  error.response.data.message || 'Not found',
          variant: 'destructive'
        })
      }
    }
  }
})
