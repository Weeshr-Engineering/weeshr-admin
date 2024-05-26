import { defineStore } from "pinia";
import axios from "axios";
import { toast } from '@/components/ui/toast'

export const useAdminListStore = defineStore({
    id: 'admin-list',
    state: (): AdminListStore =>({
        users: [],
        adminStatus: true,
        sheetOpen: false,
        loading: false,
        currentpage: 1,
        totalpage: [],
        detailLoading: false
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
        },
        setUsers(value: any[]){
            if(value){
                this.users = value
            }
        },
        setAdminStatus(value: boolean){
            this.adminStatus = value
        },
        setDetailLoading(value: boolean){
            if(value){
                this.detailLoading = value
            }else{
                this.detailLoading = !this.detailLoading
            }            
        },
        async toggleStatus(value: string, status: boolean, user: string){
            toast({
                title: `${!status ? `Disabling ${user}...` : `Activating ${user}...`}`,
                description: `${status ? `Disabling ${user} in progress...` : `Activating ${user} in progress...`}`,
                duration: 0 // Set duration to 0 to make it indefinite until manually closed
              })
            const data = JSON.stringify({
              "status": !status
            });
            const token = sessionStorage.getItem('token') || ''
            const config = {
              method: 'patch',
              maxBodyLength: Infinity,
              url: `https://api.staging.weeshr.com/api/v1/admin/administrator/${value}/disabled_status`,
              headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${token}`
              },
              data : data
            };
          
            axios.request(config)
            .then((response) => {
              // Check if response status is 200 or 201
              if (response.status === 200 || response.status === 201) {
                // Show success toast
                this.adminStatus = !this.adminStatus
                toast({
                    title: 'Success',
                    description: `${!status ? `${user} Disabled` : `${user} Activated`}`,
                    variant: 'success'
                  })
              }
            })
            .catch((error) => {
              console.log(error);
            });
          }
    }
})

interface AdminListStore {
    users: any[],
    adminStatus: boolean, //single admin id gotten from admin details page
    sheetOpen: boolean,
    loading: boolean,
    currentpage: number,
    totalpage: any[],
    detailLoading: boolean
}