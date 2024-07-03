import { defineStore } from "pinia";
import axios from "@/services/ApiService";
import { toast } from '@/components/ui/toast'
import router from '@/router'

export const useRoleStore = defineStore({
  id: 'admin-list',
  state: (): ConfigStore => ({
    permissions: [],
    roles: []
  }),
  actions: {
    async createRole(data: any) {

      toast({
        title: 'Loading Data',
        description: 'Fetching data...',
        duration: 0 // Set duration to 0 to make it indefinite until manually closed
      })
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `/api/v1/admin/role`,
        data: data
      };

      axios.request(config)
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            this.getRoles('New Role Created')
          }
        })
        .catch((error) => {
          this.catchErr(error)
        });
    },
    async getRoles(msg: string) {

      toast({
        title: 'Loading Data',
        description: 'Fetching data...',
        duration: 0 // Set duration to 0 to make it indefinite until manually closed
      })
      try {
        const response = await axios.get(
          `/api/v1/admin/roles`,
         
        )

        if (response.status === 200 || response.status === 201) {
          toast({
            title: 'Success',
            description: msg,
            variant: 'success'
          })
        }
        this.roles = response.data.data.data.reverse()
        console.log(this.roles)
        // set Loading to false

      } catch (error: any) {
        this.catchErr(error)
      }
    },
    updateRole(data: any, id: string) {

      toast({
        title: 'Loading Data',
        description: 'Fetching data...',
        duration: 0 // Set duration to 0 to make it indefinite until manually closed
      })

      const config = {
        method: 'patch',
        maxBodyLength: Infinity,
        url: `/api/v1/admin/role/${id}`,
        data: data
      };

      axios.request(config)
        .then((response) => {
          // console.log(JSON.stringify(response.data));
          this.getRoles('Role Updated Successfully')
        })
        .catch((error) => {
          console.log(error)
          this.catchErr(error)
        });
    },
    async deleteRole(id: string) {

      toast({
        title: 'Deleting Data',
        description: 'Deleting data...',
        duration: 0 // Set duration to 0 to make it indefinite until manually closed
      })


      const config = {
        method: 'delete',
        url: `/api/v1/admin/role/${id}`,
      };

      axios.request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          this.getRoles('Role Deleted Successfully')
        })
        .catch((error) => {
          this.catchErr(error)
        });
    },
    async getPermissions() {

      toast({
        title: 'Loading Data',
        description: 'Fetching data...',
        duration: 0 // Set duration to 0 to make it indefinite until manually closed
      })
      try {
        const response = await axios.get(
          `/api/v1/admin/role/permissions?group_by=model`,
         
        )

        if (response.status === 200 || response.status === 201) {
          toast({
            title: 'Success',
            description: `Successful: data retrieved`,
            variant: 'success'
          })
          // console.log(response.data.data)
          const data = response.data.data
          this.permissions = response.data.data
          return data

        }
      } catch (error: any) {
        this.catchErr(error)
      }
    },
    async allPermissions() {

      toast({
        title: 'Loading Data',
        description: 'Fetching data...',
        duration: 0 // Set duration to 0 to make it indefinite until manually closed
      })
      try {
        const response = await axios.get(
          `/api/v1/admin/role/permissions?group_by=basic`,
         
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
        this.catchErr(error)
      }
    },
    async getWeesheCategories() {

      toast({
        title: 'Loading Data',
        description: 'Fetching data...',
        duration: 0 // Set duration to 0 to make it indefinite until manually closed
      })
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: '/api/v1/admin/weesh/categories?per_page=5&page=1&search=cash',
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
          this.catchErr(error)
        });
    },
    catchErr(error: any) {
      console.log(error)
      if (error.response.status === 400) {
        toast({
          title: error.response.data.message || 'Bad Request',
          description: 'Pls reach out to the management reguarding this request',
          variant: 'destructive'
        })
      } else if (error.response.status === 401) {
        toast({
          title: error.response.data.message || 'Unauthenticated',
          description: 'Pls Signin again',
          variant: 'destructive'
        })
        sessionStorage.removeItem('token')
        setTimeout(() => {
          router.push({ name: 'superAdmin-login' })
        }, 1000)
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

interface ConfigStore {
  permissions: any[],
  roles: any[]
}
