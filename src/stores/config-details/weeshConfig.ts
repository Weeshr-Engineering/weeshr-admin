import { defineStore } from 'pinia'
import axios from "axios";
import { toast } from '@/components/ui/toast'
import router from '@/router'
const token = sessionStorage.getItem('token') || ''

interface Image {
    asset_id: string;
    public_id: string;
    format: string;
    version: number;
    resource_type: string;
    [key: string]: any; // Optional property for any additional fields
  }
  
  interface Item {
    createdAt: string;
    disabled: boolean;
    image: Image;
    isCash: boolean;
    name: string;
    _id: string;
  }

  interface WeeshConfig {
    categories: Item[],
    perPage: number,
    currentPage: number,
    totalPages: number,
    page: number,
    active: boolean,
  }
export const useWeeshConfigStore = defineStore('weeshConfig', {
    state: () : WeeshConfig => ({
        perPage : 0,
        currentPage : 0,
        totalPages : 0,
        categories: [],
        page: 1,
        active: false
    }),
    // getters: {
    //   doubleCount: (state) => state.count * 2,
    // },
    actions: {
        async getWeesheCategories(page: number, msg: string){
            toast({
              title: 'Loading Data',
              description: 'Fetching data...',
              duration: 0 // Set duration to 0 to make it indefinite until manually closed
            })
            const config = {
              method: 'get',
              maxBodyLength: Infinity,
              url: `https://api.staging.weeshr.com/api/v1/admin/weesh/categories?per_page=5&page=${page}`,
              headers: { 
                'Authorization': `Bearer ${token}`
              }
            };
            
            axios.request(config)
            .then((response) => {
              console.log(response.data.data);
              this.perPage = response.data.data.perPage
              this.currentPage = response.data.data.currentPage
              this.totalPages = response.data.data.totalPages
              this.categories = response.data.data.data
              console.log(this.categories)
              toast({
                title: 'Success',
                description: `Successful: ${msg}`,
                variant: 'success'
              })
              return response.data.data
            })
            .catch((error) => {
              console.log(error)
              if (error.response.status === 401) {
                // sessionStorage.removeItem('token')
          
                setTimeout(() => {
                  router.push({ name: 'home' })
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
            });          
          },
          async handleSwitch(value: string, category: string, status: boolean){
            toast({
                title: `${!status ? `Disabling ${category}...` : `Activating ${category}...`}`,
                description: `${status ? `Disabling ${category} in progress...` : `Activating ${category} in progress...`}`,
                duration: 0 // Set duration to 0 to make it indefinite until manually closed
              })
            const data = JSON.stringify({
              "disabled": !status
            });
            const token = sessionStorage.getItem('token') || ''
            const config = {
              method: 'patch',
              maxBodyLength: Infinity,
              url: `https://api.staging.weeshr.com/api/v1/admin/weesh/category/${value}/status`,
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
                // this.adminStatus = !this.adminStatus
                this.getWeesheCategories(this.page, '')
                console.log(response)
                toast({
                    title: 'Success',
                    description: `${!status ? `${category} Disabled` : `${category} Activated`}`,
                    variant: 'success'
                  })
              }
            })
            .catch((error) => {
              console.log(error);
            });
          },
          handleActive (){
            this.active= !this.active
          },
          async deleteWeeshCategory (id: string){
            toast({
                title: 'Deleting Data',
                description: 'Deleting data...',
                duration: 0 // Set duration to 0 to make it indefinite until manually closed
              })
            
              
              const config = {
                method: 'delete',
                url: `https://api.staging.weeshr.com/api/v1/admin/weesh/category/${id}`,
                headers: { 
                  'Content-Type': 'application/json', 
                  'Authorization': `Bearer ${token}`
                }
              };
              
              axios.request(config)
              .then((response) => {
                console.log(JSON.stringify(response.data));
                toast({
                  title: 'Success',
                  description: `Successful: data deleted`,
                  variant: 'success'
                })
                this.getWeesheCategories(this.page, '')
              })
              .catch((error) => {
                if (error.response.status === 401) {
                  // sessionStorage.removeItem('token')
            
                  setTimeout(() => {
                    router.push({ name: 'home' })
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
              });
            },
            handlePageChange (newPage: number){
                if (newPage > 0 && newPage <= this.totalPages) {
                  this.currentPage = newPage;
                  this.page = newPage
                  this.getWeesheCategories(this.page, `Page ${this.page}`)
                }
              }
        // handleFileChange(event: any){
            // const file = event.target.files[0];
            // img.value = file
        //   }
    },
  })

//   const categories = ref<any[]>([])
// const page = ref(1)
// const perPage = ref(0);
// const currentPage = ref(0);
// const totalPages = ref(0)
// const img = ref<any[]>([])
// const MAX_FILE_SIZE = 1024 * 1024 * 2;
// const active = ref(false)
// const currentCategory = ref('')
// const updateImg = ref<any[]>([])
// const updateName = ref('')