import { defineStore } from "pinia"
import axios from "@/services/ApiService";
import { toast } from "@/components/ui/toast";
import router from '@/router'

interface Details {
    vendor: string,
    category: any[],
    [key: string]: any; // Assuming the structure of Role is dynamic
  }

interface WeeshDetailsStore {
    detail: any,
    stage: string,
    category: any,
    image: any,
    loading: boolean
}
export const useWeeshDetailStore = defineStore('weeshDetail', {
    state: () : WeeshDetailsStore => ({
        stage: '1',
        detail: {},
        category: {},
        image: {},
        loading: false
    }),
    actions: {
    async getWeeshDetails(id: any){
        this.loading = true
        try{
            const response = await axios.get(`/api/v1/admin/weesh/${id}`)
            if (response.status === 200 || response.status === 201) {
                const data = response.data.data
                this.detail = data;
                console.log(data)
                if(data.category?.length !== 0){
                    this.category = data.category[0]
                }
                if(data.images?.length !== 0){
                    this.image = data.images[0]
                }
                this.loading = false;
            }
        }catch(error){
            this.catchErr(error)
            // this.loading = false;
        }
    }, 
    setStage (val: string){
        this.stage = val
    },
    stageTab (strNumber: string){
        let number = parseInt(strNumber, 10);

        // Check if the number is between 1 and 4
        if (number >= 1 && number <= 4) {
            // Increment the number by 1, but not more than 4
            number = Math.min(number + 1, 4);
        }
        this.stage = number.toString();
        console.log(this.stage, number)
    },
    catchErr(error: any) {
        if (error.response.status === 400) {
          toast({
            title: error.response.data.message || 'Bad Request',
            description: 'Pls reach out to the management reguarding this request',
            variant: 'destructive'
          })
        } else if (error.response.status === 401) {
          sessionStorage.removeItem('token')
          setTimeout(() => {
            router.push({ name: 'superAdmin-login' })
          }, 1000)
          toast({
            title: error.response.data.message || 'Unauthenticated',
            description: 'Pls Signin again',
            variant: 'destructive'
          })
        } else if (error.response.status === 403) {
          toast({
            title: error.response.data.message || 'Unauthorized',
            description: 'You are not authorized to access this feature',
            variant: 'destructive'
          })
          setTimeout(() => {
            router.push({ name: 'home' })
          }, 3000)
        } else if (error.response.status === 422) {
          toast({
            title: error.response.data.message || 'Validation Error',
            description: 'Your request is not validated, Pls try again ',
            variant: 'destructive'
          })
        } else if (error.response.status === 500) {
          toast({
            title: error.response.data.message || 'Server Error',
            description: 'Pls try again later',
            variant: 'destructive'
          })
        } else if (error.response.status === 404) {
          toast({
            title: error.response.data.message || 'Not found',
            description: '404 Error',
            variant: 'destructive'
          })
        }
      }
    }
})
// /accounts/users/:id/weeshes

// const stage = ref('1');
// const setStage = (val: string)=>{
//     stage.value = val
// }
// const stageTab = (strNumber: string)=> {
  // Convert the string to a number
//   let number = parseInt(strNumber, 10);

//   // Check if the number is between 1 and 4
//   if (number >= 1 && number <= 4) {
//     // Increment the number by 1, but not more than 4
//     number = Math.min(number + 1, 4);
//   }
//   stage.value = number.toString();
//   console.log(stage.value, number)
// }