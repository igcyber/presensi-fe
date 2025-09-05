import { useLocalStorage } from "@vueuse/core";
import { jwtDecode } from "jwt-decode";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

interface StoredAuth {
  accessToken: string;
  refreshToken: string;
  payload?: any;
}

export const useAuthStore = defineStore("auth", () => {
  // State
  const accessToken = ref("");
  const refreshToken = ref("");
  const userPayload = ref<any | null>(null);
  const isLoading = ref(false);

  // Computed
  const isAuthenticated = computed(() => {
    return !!accessToken.value && !!refreshToken.value;
  });

  const user: any = computed(() => {
    if (!userPayload.value) return null;
    return {
      ...userPayload.value,
    };
  });

  const isTokenExpired = computed(() => {
    if (!userPayload.value?.exp) return true;
    return userPayload.value.exp < Date.now() / 1000;
  });

  // Reactive localStorage
  const storedAuth = useLocalStorage<StoredAuth>("app", {
    accessToken: "",
    refreshToken: "",
    payload: undefined,
  });

  // Actions
  const setAccessToken = (token: string) => {
    accessToken.value = token;
    storedAuth.value.accessToken = token;
  };

  const setRefreshToken = (token: string) => {
    refreshToken.value = token;
    storedAuth.value.refreshToken = token;
  };

  const setDataRegularLogin = (data: { accessToken: string; refreshToken: string }) => {
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
  };

  const getPlayloadDataRegularLogin = () => {
    const token = accessToken.value;
    const decoded = jwtDecode(token);
    return decoded as any;
  };

  const initializeAuth = () => {
    // Restore dari localStorage saat aplikasi dimuat
    if (storedAuth.value.accessToken) {
      accessToken.value = storedAuth.value.accessToken;
      refreshToken.value = storedAuth.value.refreshToken;

      if (storedAuth.value.payload) {
        const userPlayload = getPlayloadDataRegularLogin();
        userPayload.value = userPlayload;
      }
    }
  };

  const logout = () => {
    accessToken.value = "";
    refreshToken.value = "";
    userPayload.value = null;

    storedAuth.value = {
      accessToken: "",
      refreshToken: "",
      payload: undefined,
    };
  };

  return {
    // State
    accessToken,
    refreshToken,
    userPayload,
    isLoading,

    // Computed
    isAuthenticated,
    user,
    isTokenExpired,

    // Actions
    setAccessToken,
    setRefreshToken,
    setDataRegularLogin,
    initializeAuth,
    logout,
  };
});
