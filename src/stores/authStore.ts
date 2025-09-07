import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

import type { LoginResponse, User } from "@/lib/api/types/auth.types";

interface StoredAuth {
  accessToken: string;
  user?: User;
  tokenExpiresAt?: string;
}

export const useAuthStore = defineStore("auth", () => {
  // State
  const accessToken = ref("");
  const user = ref<User | null>(null);
  const tokenExpiresAt = ref<string>("");
  const isLoading = ref(false);

  // Computed
  const isAuthenticated = computed(() => {
    return !!accessToken.value && !!user.value && !isTokenExpired.value;
  });

  const isTokenExpired = computed(() => {
    if (!tokenExpiresAt.value) return true;
    return new Date(tokenExpiresAt.value) < new Date();
  });

  // Reactive localStorage
  const storedAuth = useLocalStorage<StoredAuth>("app", {
    accessToken: "",
    user: undefined,
    tokenExpiresAt: undefined,
  });

  // Actions
  const setAccessToken = (token: string) => {
    accessToken.value = token;
    storedAuth.value.accessToken = token;
  };

  const setUser = (userData: User) => {
    user.value = userData;
    storedAuth.value.user = userData;
  };

  const setTokenExpiresAt = (expiresAt: string) => {
    tokenExpiresAt.value = expiresAt;
    storedAuth.value.tokenExpiresAt = expiresAt;
  };

  /**
   * Handle successful login response
   * @param loginResponse - Complete login response from API
   */
  const handleLoginSuccess = (loginResponse: LoginResponse) => {
    const { user: userData, token } = loginResponse.data;

    // Set tokens
    setAccessToken(token.value);

    // Set user data
    setUser(userData);

    // Set token expiration
    setTokenExpiresAt(token.expiresAt);
  };

  const initializeAuth = () => {
    // Restore dari localStorage saat aplikasi dimuat
    if (storedAuth.value.accessToken) {
      accessToken.value = storedAuth.value.accessToken;

      if (storedAuth.value.user) {
        user.value = storedAuth.value.user;
      }

      if (storedAuth.value.tokenExpiresAt) {
        tokenExpiresAt.value = storedAuth.value.tokenExpiresAt;
      }
    }
  };

  const logout = () => {
    accessToken.value = "";
    user.value = null;
    tokenExpiresAt.value = "";

    storedAuth.value = {
      accessToken: "",
      user: undefined,
      tokenExpiresAt: undefined,
    };
  };

  return {
    // State
    accessToken,
    user,
    tokenExpiresAt,
    isLoading,

    // Computed
    isAuthenticated,
    isTokenExpired,

    // Actions
    setAccessToken,
    setUser,
    setTokenExpiresAt,
    handleLoginSuccess,
    initializeAuth,
    logout,
  };
});
