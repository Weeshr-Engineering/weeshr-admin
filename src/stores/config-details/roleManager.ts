import { defineStore } from "pinia";
import axios from "@/services/ApiService";
import { toast } from '@/components/ui/toast'
import router from '@/router'

export const useRoleStore = defineStore({
  id: 'admin-list',
  state: (): ConfigStore => ({
    permissions: [],
    roles: [],
    config: {
      "roles": 0,
      "featured": 0,
      "currencies": 0,
      "weesh_gist": 0,
      "weesh_categories": 0,
      'countries': 0,
      'weesh_events': 0
    }
  }),
  actions: {
    async createRole(data: any) {

      toast({
        title: 'Loading Data',
        description: 'Fetching data...',
        variant: 'loading',
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
        variant: 'loading',
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
        // set Loading to false

      } catch (error: any) {
        this.catchErr(error)
      }
    },
    updateRole(data: any, id: string) {

      toast({
        title: 'Loading Data',
        description: 'Fetching data...',
        variant: 'loading',
        duration: 0 // Set duration to 0 to make it indefinite until manually closed
      })

      const config = {
        method: 'patch',
        maxBodyLength: Infinity,
        url: `/api/v1/admin/role/${id}`,
        data: data
      };

      axios.request(config)
        .then(() => {
          this.getRoles('Role Updated Successfully')
        })
        .catch((error) => {
          this.catchErr(error)
        });
    },
    async deleteRole(id: string) {

      toast({
        title: 'Deleting Data',
        description: 'Deleting data...',
        variant: 'loading',
        duration: 0 // Set duration to 0 to make it indefinite until manually closed
      })


      const config = {
        method: 'delete',
        url: `/api/v1/admin/role/${id}`,
      };

      axios.request(config)
        .then(() => {

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
        variant: 'loading',
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
        variant: 'loading',
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
        variant: 'loading',
        duration: 0 // Set duration to 0 to make it indefinite until manually closed
      })
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: '/api/v1/admin/weesh/categories?per_page=5&page=1&search=cash',
      };

      axios.request(config)
        .then((response) => {
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
    async getAnalytics() {

      toast({
        title: 'Loading Data',
        description: 'Fetching data...',
        variant: 'loading',
        duration: 0 // Set duration to 0 to make it indefinite until manually closed
      })
      try {
        const response = await axios.get(
          `/api/v1/admin/configuration/analytics`,
         
        )

        if (response.status === 200 || response.status === 201) {
          toast({
            title: 'Success',
            description: 'Success : Configuration data collected',
            variant: 'success'
          })
        }
        this.config = (response.data.data.count);
        // console.log(response.data.data.count)
        // this.roles = response.data.data.data.reverse()
        // set Loading to false

      } catch (error: any) {
        this.catchErr(error)
      }
    },
    catchErr(error: any) {
      if (error.response.status === 400) {
        toast({
          description: error.response.data.message || 'Bad Request',
          variant: 'destructive'
        })
      } else if (error.response.status === 401) {
        setTimeout(() => {
          router.push({ name: 'superAdmin-login' })
        }, 1000)
        toast({
          description: error.response.data.message || 'Unauthenticated',
          variant: 'destructive'
        })
        sessionStorage.removeItem('token')
      } else if (error.response.status === 403) {
        toast({
          description: error.response.data.message || 'Unauthorized',
          variant: 'destructive'
        })
        setTimeout(() => {
          router.push({ name: 'home' })
        }, 3000)
      } else if (error.response.status === 422) {
        toast({
          description: error.response.data.message || 'Validation Error',
          variant: 'destructive'
        })
      } else if (error.response.status === 500) {
        toast({
          description: error.response.data.message || 'Server Error',
          variant: 'destructive'
        })
      } else if (error.response.status === 404) {
        toast({
          description: error.response.data.message || 'Not found',
          variant: 'destructive'
        })
      }
    }
  }
})

interface Count {
  "roles": number,
  "featured": number,
  "currencies": number,
  "weesh_gist": number,
  "weesh_categories": number,
  'countries': number,
  'weesh_events': number
}
interface ConfigStore {
  permissions: any[],
  roles: any[],
  config: Count
}
