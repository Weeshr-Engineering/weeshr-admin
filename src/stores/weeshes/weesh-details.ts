import { defineStore } from "pinia"
import axios from "@/services/ApiService";
// import { useToast } from '@/components/ui/toast';

export const useWeeshDetailStore = defineStore('weeshDetail', {
    state: () => ({
        stage: '2'
    }),
    actions: {
    async getWeeshDetails(id: any){
        const response = await axios.get(`/api/v1/admin/accounts/users/${id}/weeshes`)
        console.log(response)
    }, setStage (val: string){
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