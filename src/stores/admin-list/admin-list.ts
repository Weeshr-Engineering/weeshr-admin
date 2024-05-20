import { defineStore } from "pinia";

export const useAdminListStore = defineStore({
    id: 'admin-list',
    state: (): AdminListStore =>({
        users: [],
        sheetOpen: false,
        loading: false,
        currentpage: 1,
        totalpage: []
    }),
    actions: {
        sheetControl(value : boolean){
            if(value){
                this.sheetOpen = value
            }else{
                this.sheetOpen = !this.sheetOpen
            }
        },
        loadingControl(value: boolean){
            if(value){
                this.loading = value
            }else{
                this.loading = !this.loading
            }
        }
    }
})

interface AdminListStore {
    users: any[],
    sheetOpen: boolean,
    loading: boolean,
    currentpage: number,
    totalpage: any[]
}