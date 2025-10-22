import { computed, ref, onMounted, onUnmounted } from "vue";

// Constants
const COOLDOWN_DURATION = 15 * 60 * 1000; // 15 menit dalam milliseconds
const COOLDOWN_STORAGE_KEY = "pengaduan_cooldown_until";

export interface CooldownStatus {
  isOnCooldown: boolean;
  remainingTime: number;
  cooldownUntil?: string;
}

export function usePengaduanSession() {
  // State
  const cooldownStatus = ref<CooldownStatus>({
    isOnCooldown: false,
    remainingTime: 0,
  });

  // Timer
  let cooldownInterval: ReturnType<typeof setInterval> | null = null;

  // Computed
  const cooldownTimeFormatted = computed(() => {
    const minutes = Math.floor(cooldownStatus.value.remainingTime / 60);
    const seconds = cooldownStatus.value.remainingTime % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  });

  // Methods
  const checkCooldownStatus = () => {
    const cooldownUntil = localStorage.getItem(COOLDOWN_STORAGE_KEY);

    if (!cooldownUntil) {
      cooldownStatus.value = {
        isOnCooldown: false,
        remainingTime: 0,
      };
      return;
    }

    const cooldownTime = new Date(cooldownUntil).getTime();
    const currentTime = Date.now();
    const remainingTime = Math.max(0, Math.floor((cooldownTime - currentTime) / 1000));

    if (remainingTime <= 0) {
      // Cooldown expired
      localStorage.removeItem(COOLDOWN_STORAGE_KEY);
      cooldownStatus.value = {
        isOnCooldown: false,
        remainingTime: 0,
      };
    } else {
      // Still on cooldown
      cooldownStatus.value = {
        isOnCooldown: true,
        remainingTime,
        cooldownUntil,
      };
    }
  };

  const setCooldown = () => {
    const cooldownUntil = new Date(Date.now() + COOLDOWN_DURATION).toISOString();
    localStorage.setItem(COOLDOWN_STORAGE_KEY, cooldownUntil);

    cooldownStatus.value = {
      isOnCooldown: true,
      remainingTime: COOLDOWN_DURATION / 1000,
      cooldownUntil,
    };

    // Start countdown timer
    startCountdownTimer();
  };

  const startCountdownTimer = () => {
    if (cooldownInterval) {
      clearInterval(cooldownInterval);
    }

    cooldownInterval = setInterval(() => {
      checkCooldownStatus();

      if (!cooldownStatus.value.isOnCooldown) {
        clearInterval(cooldownInterval!);
        cooldownInterval = null;
      }
    }, 1000);
  };

  const clearCooldown = () => {
    localStorage.removeItem(COOLDOWN_STORAGE_KEY);
    cooldownStatus.value = {
      isOnCooldown: false,
      remainingTime: 0,
    };

    if (cooldownInterval) {
      clearInterval(cooldownInterval);
      cooldownInterval = null;
    }
  };

  // Lifecycle
  onMounted(() => {
    checkCooldownStatus();
    if (cooldownStatus.value.isOnCooldown) {
      startCountdownTimer();
    }
  });

  onUnmounted(() => {
    if (cooldownInterval) {
      clearInterval(cooldownInterval);
    }
  });

  return {
    cooldownStatus,
    cooldownTimeFormatted,
    setCooldown,
    checkCooldownStatus,
    clearCooldown,
  };
}
