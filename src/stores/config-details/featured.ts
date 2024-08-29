import { defineStore } from 'pinia'
import axios from "@/services/ApiService";
import { toast } from '@/components/ui/toast'
import router from '@/router'

  interface Admin {
    _id: string,
    firstName: string,
    lastName: string,
    email: string
  }
  
  interface Item {
    color: string;
    disabled: boolean;
    adminDetails: Admin
    link: string,
    isCash: boolean;
    title: string;
    _id: string;
  }

  interface Color {
    name: string,
    hexacode: string
  }

  interface Featured {
    featured: Item[],
    perPage: number,
    currentPage: number,
    totalPages: number,
    page: number,
    active: boolean,
    colors: Color[],
  }
export const useFeaturedStore = defineStore('featured', {
    state: () : Featured => ({
        perPage : 0,
        currentPage : 0,
        totalPages : 0,
        featured: [],
        page: 1,
        active: false,
        colors: [],
    }),
    actions: {
        async getFeatures(page: number, msg: string){
            
            toast({
              title: 'Loading Data',
              description: 'Fetching data...',
              variant: 'loading',
              duration: 0 // Set duration to 0 to make it indefinite until manually closed
            })
            const config = {
              method: 'get',
              maxBodyLength: Infinity,
              url: `/api/v1/admin//featured-moments`,
            };
            
            axios.request(config)
            .then((response) => {
              console.log(response.data.data);
              this.perPage = response.data.data.perPage
              this.currentPage = response.data.data.currentPage
              this.totalPages = response.data.data.totalPages
              this.featured = response.data.data.data
            //   console.log(this.featured)
              toast({
                title: 'Success',
                description: `Successful: ${msg}`,
                variant: 'success'
              })
              return response.data.data
            })
            .catch((error) => {
              console.log(error)
              this.catchErr(error)
            });          
          },
          async getColors (){
            try{
              const color = await axios.get('/api/v1/colors')
              if(color.status === 200){
                this.colors = color.data.data
                console.log(color)
                toast({
                  description: `Successful: ${color.data.message}`,
                  variant: 'success'
                })
              }
            }catch(error){
              this.catchErr(error)
            }
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
          
          const config = {
            method: 'patch',
            maxBodyLength: Infinity,
            url: `/api/v1/admin/weesh/category/${value}/status`,
            data : data
          };
        
          axios.request(config)
          .then((response) => {
            // Check if response status is 200 or 201
            if (response.status === 200 || response.status === 201) {
              // Show success toast
              // this.adminStatus = !this.adminStatus
              this.getFeatures(this.page, `${!status ? `${category} Disabled` : `${category} Activated`}`)
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
            this.catchErr(error)
          });
        },
        handleActive (){
          this.active= !this.active
        },
        async deleteFeature (id: string){
          
          toast({
              title: 'Deleting Data',
              description: 'Deleting data...',
              duration: 0 // Set duration to 0 to make it indefinite until manually closed
            })
          
            
            const config = {
              method: 'delete',
              url: `/api/v1/admin/featured-moment?ids=${id}`,
            };
            
            axios.request(config)
            .then((response) => {
              console.log(JSON.stringify(response.data));
              toast({
                title: 'Success',
                description: `Successful: data deleted`,
                variant: 'success'
              })
              if(this.featured.length === 1 && this.page !== 1){
                this.getFeatures(this.page - 1, '')
              }else{
                this.getFeatures(this.page, '')
              }
              
              
            })
            .catch((error) => {
              this.catchErr(error)
            });
          },
          handlePageChange (newPage: number){
              if (newPage > 0 && newPage <= this.totalPages) {
                this.currentPage = newPage;
                this.page = newPage
                this.getFeatures(this.page, `Page ${this.page}`)
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
    },
  })