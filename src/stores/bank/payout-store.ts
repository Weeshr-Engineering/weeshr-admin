import { defineStore } from "pinia"
import axios from "@/services/ApiService";
import { toast } from "@/components/ui/toast";
import router from '@/router'

interface User {
    firstName: string,
    lastName: string,
    userName: string,
    _id: string
}
interface Wallet {
    account_name: string,
    account_number: string,
    balance: number,
    currency: string,
    id: string
}
interface Item {
    amount: number,
    status: string,
    user: User,
    wallet: Wallet,
    wallet_id: string,
    _id: string
}

interface PayoutStore {
    payout: Item[],
    loading: boolean,
    perPage: number,
    currentPage: number,
    totalPages: number,
    page: number,
}

export const usePayoutStore = defineStore('payout', {
    state: () : PayoutStore => ({
        payout: [],
        loading: false,
        perPage : 0,
        currentPage : 0,
        totalPages : 0,
        page: 1,
    }),
    actions: {
    async getPayout(){
        try{
            this.loading = true
            // useGeneralStore().setLoadingToTrue()
            const response = await axios.get(`/api/v1/admin/payouts/users/list`)
            if (response.status === 200 || response.status === 201) {
                const data = response.data.data
                this.payout = data.data;
                this.perPage = response.data.data.perPage
                this.currentPage = response.data.data.currentPage
                this.totalPages = response.data.data.totalPages
                console.log(data)
                console.log(this.payout)
            }
        }catch(error){
            console.log(error)
            this.catchErr(error)
            this.loading = false;
        }
    },
    handlePageChange (newPage: number){
        if (newPage > 0 && newPage <= this.totalPages) {
          this.currentPage = newPage;
          this.page = newPage
        //   this.getWeesheCategories(this.page, `Page ${this.page}`)
        }
      },
    catchErr (error: any){
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