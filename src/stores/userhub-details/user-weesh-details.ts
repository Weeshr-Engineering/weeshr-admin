import { defineStore } from "pinia"
import axios from "@/services/ApiService";
import { toast } from "@/components/ui/toast";
import router from '@/router'

interface Weesh {
    _id: string;
    status: string;
    category: any;
    price: any;
    currency: any;
    [key: string]: any; // Optional property for any additional fields
  }

  interface WeeshData{
    userWeesh: Weesh[],
    currentPage: number,
    totalPages: number,
    loading: boolean
  }
export const useUserWeeshDetailStore = defineStore('userweeshDetail', {
    state: ():WeeshData => ({
        userWeesh : [],
        currentPage: 0,
        totalPages: 0,
        loading: false
    }),
    actions: {
    async getWeeshDetails(id: any){
       try {
        this.loading = true
        toast({
            description: 'Loading...',
            variant: 'loading'
        })
        const response = await axios.get(`/api/v1/admin/accounts/users/${id}/weeshes`)
        // console.log(response.data.data.data)
        if(response.data.code === 200){
            this.userWeesh = response.data.data.data
            this.currentPage = response.data.data.currentPage
            this.totalPages = response.data.data.totalPages
            toast({
                description: response.data.message,
                variant: 'success'
            })
            this.loading = false
        }
       } catch (error) {
        this.catchErr(error)
       }

    },
    catchErr (error: any){
        if(error.response.status === 400){
          toast({
            title:  error.response.data.message || 'Bad Request',
            description: 'Pls reach out to the management reguarding this request',
            variant: 'destructive'
          })
        }else if(error.response.status === 401){
          setTimeout(() => {
            router.push({ name: 'superAdmin-login' })
          }, 1000)
          toast({
            title:  error.response.data.message || 'Unauthenticated',
            description: 'Pls Signin again',
            variant: 'destructive'
          })
          this.loading = false
          sessionStorage.removeItem('token')
        }else if(error.response.status === 403){
          toast({
            title:  error.response.data.message || 'Unauthorized',
            description: 'You are not authorized to access this feature',
            variant: 'destructive'
          })
          setTimeout(() => {
            router.push({ name: 'home' })
          }, 3000)
          this.loading = false
        }else if(error.response.status === 422 ){
          toast({
            title:  error.response.data.message || 'Validation Error',
            description: 'Your request is not validated, Pls try again ',
            variant: 'destructive'
          })
        }else if(error.response.status === 500 ){
          toast({
            title:  error.response.data.message || 'Server Error',
            description: 'Pls try again later',
            variant: 'destructive'
          })
        }else if(error.response.status === 404 ){
          toast({
            title:  error.response.data.message || 'Not found',
            description: '404 Error',
            variant: 'destructive'
          })
        }
      }
    }
})