<template>
  <section v-if="userData" class="pt-2">
    <div class="mx-auto lg:hidden">
      <div class="bg-[#0f0709] rounded-2xl overflow-hidden">
        <div class="px-4 pt-4 pb-3">
          <div class="flex items-start justify-between">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span class="text-[#5a4545] text-sm max-sm:text-xs">{{
                  $t("wallet_balance")
                }}</span>
                <div class="h-3 w-px bg-[#2a1418]"></div>
                <span
                  class="text-[#ff3344] text-sm max-sm:text-xs font-semibold"
                  >{{ userData.viplevel || "Bronze" }}</span
                >
              </div>
              <div class="flex items-baseline gap-1.5">
                <span class="text-[#6a5050] text-xs font-medium">MYR</span>
                <span
                  class="text-white text-2xl max-sm:text-xl font-bold leading-none"
                  >{{ userData.wallet?.toFixed(2) || "0.00" }}</span
                >
              </div>
            </div>

            <button
              @click="handleRefresh"
              :disabled="isRefreshing"
              class="mt-1 w-8 h-8 max-sm:w-7 max-sm:h-7 rounded-lg bg-[#1a0f11] flex items-center justify-center text-[#5a4545] active:bg-[#251418] transition-colors"
            >
              <i
                class="bi bi-arrow-clockwise"
                :class="{ 'animate-spin': isRefreshing }"
              ></i>
            </button>
          </div>
        </div>

        <div class="px-3 pb-3">
          <div class="flex gap-2">
            <NuxtLinkLocale
              to="/myaccount/deposit"
              class="flex-1 py-2.5 bg-[#ff3344] rounded-lg flex items-center justify-center gap-2 active:bg-[#e62e3f] transition-colors"
            >
              <i
                class="bi bi-wallet-fill text-white/90 max-[500px]:text-sm"
              ></i>
              <span
                class="text-white text-sm max-[500px]:text-xs font-semibold"
                >{{ $t("deposit") }}</span
              >
            </NuxtLinkLocale>

            <NuxtLinkLocale
              to="/myaccount/withdraw"
              class="flex-1 py-2.5 bg-[#1a0f11] border border-[#2a1418] rounded-lg flex items-center justify-center gap-2 active:bg-[#251418] transition-colors"
            >
              <i
                class="bi bi-cash-stack text-[#7a5a5a] max-[500px]:text-sm"
              ></i>
              <span
                class="text-[#7a5a5a] text-sm max-[500px]:text-xs font-medium"
                >{{ $t("withdraw") }}</span
              >
            </NuxtLinkLocale>
          </div>
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
