// analytics-category.ts
import { defineStore } from 'pinia';
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

interface CategoryData {
  count: number;
  category: string;
}

export const useCategoryAnalyticsStore = defineStore('categoryAnalytics', () => {
  const allCategories = ref<CategoryData[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const topCategory = computed(() => {
    if (allCategories.value.length === 0) return { name: '', users: 0 };
    const top = allCategories.value[0];
    return { name: top.category, users: top.count };
  });

  const fetchCategoryAnalytics = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(
        `/api/v1/admin/analytics/users/weesh-by-category?date_from=2024-05-01&date_to=2024-10-04`
      );

      const categories: CategoryData[] = response.data?.data?.data || [];
      const sortedCategories = categories.sort((a, b) => b.count - a.count);
      allCategories.value = sortedCategories;

      if (sortedCategories.length === 0) {
        error.value = 'No category data available';
      }
    } catch (err) {
      error.value = 'Failed to load data';
      console.error('API Fetch Error:', err);
    } finally {
      loading.value = false;
    }
  };

  onMounted(fetchCategoryAnalytics);

  return { allCategories, topCategory, loading, error, fetchCategoryAnalytics };
});