import { defineStore } from 'pinia';
import axios from "@/services/ApiService";
import { useToast } from '@/components/ui/toast';

const { toast } = useToast()

interface UserExtras {
  email: string;
  firstName: string;
  lastName: string;
}

interface User {
  id: string;
  type: string;
  extras: UserExtras;
}

interface Resource {
  ip: string;
  timestamp: number;
  user_agent: string;
}

interface ActivityLogItem {
  id: string;
  timestamp: string;
  user: User;
  action: string;
  resource: Resource;
  metadata: Record<string, unknown>;
  status: string;
  description: string;
}

interface IActivityLogPagination {
  from: number;
  per_page: number;
  to?: number;
  next_from?: number;
  valid_next_page?: boolean;
  prev_from?: number;
  valid_prev_page?: boolean;
}

interface ActivityLogState {
  logs: ActivityLogItem[];
  count?: number;
  pagination: IActivityLogPagination;
  loading: boolean;
  error: string | null;
  filters: {
    log_action: [],
    log_status: [],
    log_user_types: [],
    sort_direction: ['asc', 'desc'],
  }
}

export interface IActivityLogReqParams {
  columns?: string;
  sort_direction?: 'asc' | 'desc';
  sort_column?: string;
  per_page?: number;
  page_item_from?: number;
  log_action?: string;
  log_status?: string;
  log_user_type?: string;
  user_id?: string;
}

export const useActivityLogStore = defineStore('activityLog', {
  state: (): ActivityLogState => ({
    logs: [],
    count: 0,
    pagination: {
      from: 1,
      per_page: 25,
      valid_next_page: false,
    } as IActivityLogPagination,
    loading: false,
    error: null,
    filters: {
      log_action: [],
      log_status: [],
      log_user_types: [],
      sort_direction: ['asc', 'desc'],
    }
  }),
  actions: {
    async fetchActivityLogs(
      params: IActivityLogReqParams = {}
    ) {
      this.loading = true;

      this.error = null;

      toast({
        description: "Loading....",
        variant: 'loading'
      });

      const values: Partial<IActivityLogReqParams> = params;

      const output = {} as any;

      for (const key in values) {
        if (Object.prototype.hasOwnProperty.call(values, key)) {
          const element = values[key as keyof IActivityLogReqParams];

          if (element && element !== undefined) {
            output[key] = element;
          }
        }
      }

      const queryString = new URLSearchParams(output as any).toString();

      const baseUrl = '/api/v1/admin/logs/activity-logs';

      const uri = (queryString) ? `${baseUrl}?${queryString}` : baseUrl;

      try {
        const { status, data: { message, data } } = await axios.get(
          uri
        );

        if (status !== 200)
          return this.error = message;

        const { count, data: logs, pagination } = data;

        this.logs = logs;

        this.pagination = pagination as IActivityLogPagination;

        this.count = count as number;

        toast({
          description: message || 'Data fetched successfully !',
          variant: 'success'
        })

      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error';

        toast({
          description: this.error || 'Error fetching data !',
          variant: 'destructive'
        });
        
      } finally {
        this.loading = false;
      }
    },

    async fetchFiltersAndMeta() {

      try {
        const response = await axios.get(
          '/api/v1/admin/logs/activity-logs/filters-and-meta'
        );

        if (response.status === 200) {
          const data = response.data.data.filters;
          this.filters.log_action = data.log_action;
          this.filters.log_status = data.log_status;
          this.filters.log_user_types = data.log_user_types;
        } else {
          this.error = response.data.message;
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error';
      }
    },
  },
  getters: {
    getPagination(state) {
      const { pagination: {
        from,
        per_page,
        valid_next_page,
        valid_prev_page,
        to,
        next_from,
        prev_from } } = state;

      return {
        from: from || 1,
        per_page: per_page || 25,
        valid_next_page: valid_next_page || false,
        valid_prev_page: valid_prev_page || false,
        to: to || 1,
        next_from: next_from || 1,
        prev_from: prev_from || 1
      } as IActivityLogPagination
    },
    getDataCount(state) {
      return state.count;
    }
  }
});
