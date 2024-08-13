import { defineStore } from "pinia"
import axios from "@/services/ApiService";
import { toast } from "@/components/ui/toast";
import router from '@/router'

export const useUserhubStore = defineStore({
    id: 'userhubStore',
    state: (): UserhubFigures => ({ 
        usersCount: '0',
        adminsCount: '',
        vendorsCount: '',
        partnersCount: '',
        loading: false
     }),
    actions: {
        async getUsersNumber(){
            
            try {
                const response = await axios.get(
                  '/api/v1/admin/accounts/user-types/counts',
                )
                if (response.status === 200 || response.status === 201) {
                    const { no_of_users, no_of_admins, number_of_vendors, no_of_partners} = response.data.data
                    this.usersCount = no_of_users
                    this.adminsCount = no_of_admins
                    this.vendorsCount = number_of_vendors
                    this.partnersCount = no_of_partners
                    this.loading = true
                }
                return true
            }
            catch (err: any) {
                // console.log(err)
                if(err.response){
                    this.catchErr(err)
                }else{
                    toast({
                        description:  err.message || 'Poor network',
                        variant: 'destructive'
                      })      
                }
                
            }
            
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

interface UserhubFigures {
    usersCount: string,
    adminsCount: string,
    vendorsCount: string,
    partnersCount: string,
    loading: boolean
}