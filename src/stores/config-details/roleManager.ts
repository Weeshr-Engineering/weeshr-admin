import { defineStore } from "pinia";
import axios from "axios";
import { toast } from '@/components/ui/toast'
import router from '@/router'

const token = sessionStorage.getItem('token') || ''

export const useRoleStore = defineStore({
    id: 'admin-list',
    state: ():ConfigStore=>({
      permissions: [],
      roles: []
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
                if (response.status === 200 || response.status === 201) {
                  toast({
                    title: 'Success',
                    description: `A New Role Created`,
                    variant: 'success'
                  })
                }
              })
              .catch((error) => {
                if (error.response.status === 401) {
                  sessionStorage.removeItem('token')
  
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
                toast({
                  title: 'Success',
                  description: `Successful: Data Edited`,
                  variant: 'success'
                })
              })
              .catch((error) => {
                console.log(error)
                if(error.response.status == 422){
                  toast({
                    title: 'Unmodified data',
                    description: 'Modify the data before you try to update role',
                    variant: 'destructive'
                  })
                }
                else if(error.response.status == 400){
                  toast({
                    title: error.response.data.message || 'You cannot edit this role',
                    description: 'Create another role instead or delete this if not needed',
                    variant: 'destructive'
                  })
                }
                else if (error.response.status === 401) {
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
        async deleteRole(id: string){
            toast({
                title: 'Deleting Data',
                description: 'Deleting data...',
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
                toast({
                  title: 'Success',
                  description: `Successful: data deleted`,
                  variant: 'success'
                })
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
        async getPermissions (){
          toast({
              title: 'Loading Data',
              description: 'Fetching data...',
              duration: 0 // Set duration to 0 to make it indefinite until manually closed
            })
            try {
              const response = await axios.get(
                `https://api.staging.weeshr.com/api/v1/admin/role/permissions?group_by=model`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                }
              )
          
              if (response.status === 200 || response.status === 201) {
                toast({
                  title: 'Success',
                  description: `Successful: data retrieved`,
                  variant: 'success'
                })
                // console.log(response.data.data)
                const data = response.data.data
                return data
                
              }
            } catch (error: any) {
              if (error.response.status === 401) {
                // sessionStorage.removeItem('token')

                // setTimeout(() => {
                //   router.push({ name: 'home' })
                // }, 3000)
          
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
      async allPermissions (){
        toast({
            title: 'Loading Data',
            description: 'Fetching data...',
            duration: 0 // Set duration to 0 to make it indefinite until manually closed
          })
          try {
            const response = await axios.get(
              `https://api.staging.weeshr.com/api/v1/admin/role/permissions?group_by=basic`,
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            )
        
            if (response.status === 200 || response.status === 201) {
              toast({
                title: 'Success',
                description: `Successful: data retrieved`,
                variant: 'success'
              })
              console.log(response.data.data)
              const data = response.data.data
              return data
              
            }
          } catch (error: any) {
            if (error.response.status === 401) {
              // sessionStorage.removeItem('token')

              // setTimeout(() => {
              //   router.push({ name: 'home' })
              // }, 3000)
        
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
            toast({
              title: 'Success',
              description: `Successful: data retrieved`,
              variant: 'success'
            })
            return response.data.data
          })
          .catch((error) => {
            if (error.response.status === 401) {
              sessionStorage.removeItem('token')

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
      }
    }
})

interface ConfigStore {
  permissions: any[],
  roles: any[]
}