import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed, ref } from "vue";



import type { LoginResponse, UserAuth } from "@/lib/api/types/auth.types";




// interface for stored auth
interface StoredAuth {
  accessToken: string;
  refreshToken: string;
  user?: UserAuth;
  // tokenExpiresAt?: string;
}

export const useAuthStore = defineStore("auth", () => {
  // State
  const accessToken = ref("");
  const user = ref<UserAuth | null>(null);
  // const tokenExpiresAt = ref<string>("");
  const refreshToken = ref("");
  const isLoading = ref(false);

  // Computed
  const isAuthenticated = computed(() => {
    return !!accessToken.value && !!user.value && !!refreshToken.value;
  });

  // const isTokenExpired = computed(() => {
  //   if (!tokenExpiresAt.value) return true;
  //   return new Date(tokenExpiresAt.value) < new Date();
  // });

  // Reactive localStorage
  const storedAuth = useLocalStorage<StoredAuth>("app", {
    accessToken: "",
    refreshToken: "",
    user: undefined,
    // tokenExpiresAt: undefined,
  });

  // Actions
  const setAccessToken = (token: any) => {
    accessToken.value = token;
    storedAuth.value.accessToken = token.access_token;
    storedAuth.value.refreshToken = token.refresh_token;
  };

  const setUser = (userData: UserAuth) => {
    user.value = userData;
    storedAuth.value.user = userData;
  };

  // const setTokenExpiresAt = (expiresAt: string) => {
  //   tokenExpiresAt.value = expiresAt;
  //   storedAuth.value.tokenExpiresAt = expiresAt;
  // };

  // const setRefreshToken = (refreshTokenData: any) => {
  //   refreshToken.value = refreshTokenData.refresh_token;
  //   storedAuth.value.refreshToken = refreshTokenData.refresh_token;
  // }

  /**
   * Handle successful login response
   * @param loginResponse - Complete login response from API
   */
  const handleLoginSuccess = (loginResponse: LoginResponse) => {
    const { user, access_token, refresh_token } = loginResponse.data;

    const token = {
      access_token,
      refresh_token,
    }

    // Set tokens
    setAccessToken(token);

    // Set user data
    setUser(user);

    // Set token expiration
    // setTokenExpiresAt(token.expiresAt);
  };

  const initializeAuth = () => {
    // Restore dari localStorage saat aplikasi dimuat
    if (storedAuth.value.accessToken) {
      accessToken.value = storedAuth.value.accessToken;
      refreshToken.value = storedAuth.value.refreshToken;
      if (storedAuth.value.user) {
        user.value = storedAuth.value.user;
      }

      // if (storedAuth.value.tokenExpiresAt) {
      //   tokenExpiresAt.value = storedAuth.value.tokenExpiresAt;
      // }
    }
  };

  const logout = () => {
    accessToken.value = "";
    refreshToken.value = "";
    user.value = null;
    // tokenExpiresAt.value = "";

    storedAuth.value = {
      accessToken: "",
      refreshToken: "",
      user: undefined,
      // tokenExpiresAt: undefined,
    };
  };

  return {
    // State
    accessToken,
    user,
    refreshToken,
    // tokenExpiresAt,
    isLoading,

    // Computed
    isAuthenticated,
    // isTokenExpired,

    // Actions
    setAccessToken,
    setUser,
    // setTokenExpiresAt,
    // setRefreshToken,
    handleLoginSuccess,
    initializeAuth,
    logout,
  };
});
