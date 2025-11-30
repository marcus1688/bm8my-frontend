<template>
  <section v-if="userData" class="py-3 max-lg:py-2">
    <div class="mx-auto containerWid lg:hidden">
      <div
        class="flex justify-between items-center bg-[#241017] border border-[#3b1c23] rounded-xl px-4 py-3 max-lg:px-2 max-lg:py-2 gap-3"
      >
        <!-- Left: User Info -->
        <div class="flex items-center gap-3 max-lg:gap-2 flex-1 min-w-0">
          <!-- Wallet & VIP Cards -->
          <div class="flex flex-col gap-1.5 max-lg:gap-1 flex-1">
            <!-- Wallet Card -->
            <div class="flex items-stretch w-full gap-2">
              <div class="flex flex-col gap-1 items-center">
                <img
                  src="/images/user/icon.png"
                  alt="User"
                  class="w-8 h-8 max-lg:w-10 max-lg:h-auto"
                />
                <span class="text-[#ff3344] font-bold text-sm max-lg:text-xs">
                  {{ userData.viplevel || "Bronze" }}
                </span>
              </div>
              <div class="flex flex-col gap-1 w-full">
                <div class="px-3 max-lg:px-2">
                  <span
                    class="text-[#b37a7a] text-[10px] max-lg:text-xs flex items-center gap-1"
                  >
                    {{ $t("wallet_balance") }}
                  </span>
                </div>

                <div
                  class="flex items-center w-full max-w-[200px] gap-3 max-lg:gap-2 px-3 py-2 max-lg:px-2 max-lg:py-1.5 bg-[#1A0D13] border border-[#3b1c23] rounded-lg min-w-0 h-full"
                >
                  <div class="flex flex-col flex-1 min-w-0">
                    <span
                      class="text-[#f0eaea] font-bold text-sm max-lg:text-sm"
                    >
                      MYR {{ userData.wallet?.toFixed(2) || "0.00" }}
                    </span>
                  </div>
                  <button
                    @click="handleRefresh"
                    :disabled="isRefreshing"
                    class="w-6 h-6 max-lg:w-5 max-lg:h-5 rounded-full bg-[#241017] border border-[#3b1c23] flex items-center justify-center text-[#b37a7a] lg:hover:text-[#ff3344] lg:hover:border-[#ff3344] transition-all disabled:opacity-50"
                  >
                    <i
                      class="bi bi-arrow-clockwise text-xs max-lg:text-[10px]"
                      :class="{ 'animate-spin': isRefreshing }"
                    ></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Action Buttons with Icons -->
        <div class="flex items-center gap-3 max-lg:gap-2 flex-shrink-0">
          <!-- Deposit -->
          <NuxtLinkLocale
            to="/myaccount/deposit"
            class="flex flex-col items-center gap-1 group"
          >
            <div
              class="w-11 h-11 max-lg:w-9 max-lg:h-9 rounded-full bg-gradient-to-br from-[#ff3344] to-[#cc2a3a] flex items-center justify-center shadow-lg shadow-[#ff3344]/30 lg:group-hover:scale-110 transition-transform"
            >
              <i
                class="bi bi-wallet-fill text-white text-lg max-lg:text-base"
              ></i>
            </div>
            <span
              class="text-[#f0eaea] text-[10px] max-lg:text-[9px] font-medium"
            >
              {{ $t("deposit") }}
            </span>
          </NuxtLinkLocale>
          <!-- Withdraw -->
          <NuxtLinkLocale
            to="/myaccount/withdraw"
            class="flex flex-col items-center gap-1 group"
          >
            <div
              class="w-11 h-11 max-lg:w-9 max-lg:h-9 rounded-full bg-gradient-to-br from-[#ff3344] to-[#cc2a3a] flex items-center justify-center shadow-lg shadow-[#ff3344]/30 lg:group-hover:scale-110 transition-transform"
            >
              <i
                class="bi bi-cash-coin text-white text-lg max-lg:text-base"
              ></i>
            </div>
            <span
              class="text-[#f0eaea] text-[10px] max-lg:text-[9px] font-medium"
            >
              {{ $t("withdraw") }}
            </span>
          </NuxtLinkLocale>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const userData = useState("userData");
const { get } = useApiEndpoint();
const isRefreshing = ref(false);

const handleRefresh = async () => {
  if (isRefreshing.value) return;

  isRefreshing.value = true;
  try {
    const { data } = await get("userdata");
    if (data.success) {
      userData.value = data.user;
    }
  } catch (error) {
    console.error("Error refreshing balance:", error);
  } finally {
    isRefreshing.value = false;
  }
};

const vipSettings = useState("vipSettings");

const vipLevels = computed(() => vipSettings.value?.vipLevels || []);

const currentLevelInfo = computed(() => {
  if (!vipLevels.value || vipLevels.value.length === 0) return null;
  return vipLevels.value.find(
    (level) => level.name === userData.value?.viplevel
  );
});
</script>

<style scoped>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
