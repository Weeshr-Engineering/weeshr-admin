import { defineStore } from "pinia";
import axios from "axios";
import { toast } from '@/components/ui/toast'


const token = sessionStorage.getItem('token') || ''

export const useConfigStore = defineStore({
    id: 'admin-list',
    state: ():ConfigStore=>({
      permissions: []
    }),
    actions: {
        async createRole (data: any){
            toast({
                title: 'Loading Data',
                description: 'Fetching data...',
                duration: 0 // Set duration to 0 to make it indefinite until manually closed
              })
            
              
              const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `https://api.staging.weeshr.com/api/v1/admin/role`,
                headers: { 
                  'Content-Type': 'application/json', 
                  'Authorization': `Bearer ${token}`
                },
                data : data
              };
              
              axios.request(config)
              .then((response) => {
                console.log(JSON.stringify(response.data));
                this.getRoles()
              })
              .catch((error) => {
                console.log(error);
              });
              
        },
        async getRoles (){
            toast({
                title: 'Loading Data',
                description: 'Fetching data...',
                duration: 0 // Set duration to 0 to make it indefinite until manually closed
              })  
              try {
                const response = await axios.get(
                  `https://api.staging.weeshr.com/api/v1/admin/roles`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                  }
                )
            
                if (response.status === 200 || response.status === 201) {
                //  console.log(response)
                  toast({
                    title: 'Success',
                    description: `Gotten data`,
                    variant: 'success'
                  })
                }
                return response.data.data.data.reverse()
                // set Loading to false
    
              } catch (error: any) {
                if (error.response.status === 401) {
                  sessionStorage.removeItem('token')

                //   setTimeout(() => {
                //     router.push({ name: 'super-admin-login' })
                //   }, 3000)
            
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
              }
        },
        updateRole (data: any, id='656ffd8156c96f7cf43b0441'){
            toast({
                title: 'Loading Data',
                description: 'Fetching data...',
                duration: 0 // Set duration to 0 to make it indefinite until manually closed
              })
            
              
              const config = {
                method: 'patch',
                maxBodyLength: Infinity,
                url: `https://api.staging.weeshr.com/api/v1/admin/role/${id}`,
                headers: { 
                  'Content-Type': 'application/json', 
                  'Authorization': `Bearer ${token}`
                },
                data : data
              };
              
              axios.request(config)
              .then((response) => {
                console.log(JSON.stringify(response.data));
                // fetchUsersData('data updated')
              })
              .catch((error) => {
                console.log(error);
              });            
        },
        deleteRole(id: string){
            toast({
                title: 'Loading Data',
                description: 'Fetching data...',
                duration: 0 // Set duration to 0 to make it indefinite until manually closed
              })
            
              
              const config = {
                method: 'delete',
                url: `https://api.staging.weeshr.com/api/v1/admin/role/${id}`,
                headers: { 
                  'Content-Type': 'application/json', 
                  'Authorization': `Bearer ${token}`
                }
              };
              
              axios.request(config)
              .then((response) => {
                console.log(JSON.stringify(response.data));
                // fetchUsersData('data updated')
              })
              .catch((error) => {
                console.log(error);
              });
            
        },
        async getPermissions (){
          toast({
              title: 'Loading Data',
              description: 'Fetching data...',
              duration: 0 // Set duration to 0 to make it indefinite until manually closed
            })
          
            
            try {
              const response = await axios.get(
                `https://api.staging.weeshr.com/api/v1/admin/role/permissions`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                }
              )
          
              if (response.status === 200 || response.status === 201) {
                toast({
                  title: 'Success',
                  description: `Gotten data`,
                  variant: 'success'
                })
                // console.log(response.data.data)
                return response.data.data
                
              }
            } catch (error: any) {
              if (error.response.status === 401) {
                sessionStorage.removeItem('token')

              //   setTimeout(() => {
              //     router.push({ name: 'super-admin-login' })
              //   }, 3000)
          
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
            }
      },
        async getWeesheCategories (){
          toast({
            title: 'Loading Data',
            description: 'Fetching data...',
            duration: 0 // Set duration to 0 to make it indefinite until manually closed
          })
          const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://api.staging.weeshr.com/api/v1/admin/weesh/categories?per_page=5&page=1&search=cash',
            headers: { 
              'Authorization': `Bearer ${token}`
            }
          };
          
          axios.request(config)
          .then((response) => {
            console.log(JSON.stringify(response.data));
            return response.data.data
          })
          .catch((error) => {
            console.log(error);
          });          
      }
    }
})

interface ConfigStore {
  permissions: any[],
  // adminStatus: boolean, //single admin id gotten from admin details page
  // sheetOpen: boolean,
  // loading: boolean,
  // currentpage: number,
  // totalpage: any[],
  // detailLoading: boolean
}