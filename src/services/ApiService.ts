import axios from "axios";
import router from "@/router";
import { toast } from '@/components/ui/toast';
import { useSuperAdminStore } from "@/stores/super-admin/super-admin";

// Set base URL for Axios
axios.defaults.baseURL = import.meta.env.VITE_APP_API_BASE_URL;

// Set default headers
axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["Content-Type"] = "application/json";
// axios.defaults.withCredentials = true

// Axios request interceptor
axios.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("token");

        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Axios response interceptor
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        const { name, fullPath } = router.currentRoute.value;

        if (error.response && error.response.status === 401 && !["superAdmin-login"].includes(name as unknown as string)) {

            toast({
                title: `You are unauthenticated`,
                variant: 'destructive'
            });

            const { clearToken } = useSuperAdminStore();

            clearToken();

            router.push({ name: "superAdmin-login", ...(fullPath) && { query: { redirect_to: fullPath } } });
        }

        return Promise.reject(error);
    }
);

if (sessionStorage.getItem("token") && sessionStorage.getItem("token") !== null) {
    axios.defaults.headers["Authorization"] = `Bearer ${sessionStorage.getItem("token")}`;
}

// Export axios instance
export default axios;