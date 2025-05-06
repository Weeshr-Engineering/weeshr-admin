import { defineStore } from 'pinia';
import { ref, onMounted } from 'vue';
import axios from 'axios';

export const useDeviceAnalyticsStore = defineStore('deviceAnalytics', () => {
  const iosUsers = ref(0);
  const androidUsers = ref(0);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchDeviceMetrics = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`/api/v1/admin/analytics/users/device-metric`);

      if (response.data && response.data.data && response.data.data.data) {
        iosUsers.value = response.data.data.data.iOS ?? 0;
        androidUsers.value = response.data.data.data.Android ?? 0;
      } else {
        error.value = 'Unexpected response structure';
        console.error('Unexpected API structure:', response.data);
      }
    } catch (err) {
      error.value = 'Failed to load data';
      console.error('API Fetch Error:', err);
    } finally {
      loading.value = false;
    }
  };

  onMounted(fetchDeviceMetrics);

  return { iosUsers, androidUsers, loading, error, fetchDeviceMetrics };
});
