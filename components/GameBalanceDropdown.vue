<template>
  <div class="relative z-[999]">
    <div
      class="lg:hidden fixed flex items-center justify-center inset-0 bg-black/80 backdrop-blur-sm z-40"
      @click="emitClose"
    ></div>

    <div class="absolute right-0 top-full w-full h-2 bg-transparent"></div>

    <div
      class="absolute right-0 top-full mt-2 w-80 max-lg:w-72 max-[325px]:w-[17.5rem] max-[315px]:w-[16.5rem] bg-[#1a0d13]/95 backdrop-blur-xl border border-white/10 rounded-lg z-50 max-lg:right-[-20%]"
    >
      <div class="px-4 py-3 border-b border-white/10">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2">
            <h4 class="font-semibold text-white">{{ $t("game_balances") }}</h4>
          </div>
          <button
            v-if="!isLoading"
            @click="refreshAllBalances"
            class="text-xs font-medium text-[#ff3344] hover:text-[#ff5555] flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all"
            :disabled="isLoading"
          >
            <i class="bi bi-arrow-counterclockwise text-sm"></i>
            {{ $t("restore") }}
          </button>
        </div>
      </div>

      <div v-if="isLoading" class="px-4 py-12">
        <div class="flex flex-col items-center justify-center">
          <div class="relative w-10 h-10 mb-3">
            <div
              class="absolute inset-0 border-2 border-white/10 rounded-full"
            ></div>
            <div
              class="absolute inset-0 border-t-2 border-[#ff3344] rounded-full animate-spin"
            ></div>
          </div>
          <p class="text-white font-medium text-sm mb-1">
            {{ $t("loading_balances") }}
          </p>
          <p class="text-xs text-gray-400">{{ $t("wait_fetch_balances") }}</p>
        </div>
      </div>

      <div
        v-if="!isLoading"
        class="max-h-[320px] overflow-y-auto scrollbar-thin"
      >
        <div class="px-4 py-3 bg-[#ff3344]/5 border-b border-white/5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <img :src="generalSetting.logoimage" alt="" class="w-[30px]" />
              <div>
                <p class="text-sm font-semibold text-white">
                  {{ $t("main_wallet") }}
                </p>
                <p class="text-xs text-gray-400">{{ $t("main_balance") }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-semibold text-white text-base">
                {{ formatNumber(userData.wallet) }}
              </span>
              <button
                @click.stop="fetchUserData()"
                class="w-7 h-7 rounded-md flex items-center justify-center transition-all text-[#ff3344] hover:text-[#ff5555]"
              >
                <i class="bi bi-arrow-clockwise text-sm"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="divide-y divide-white/5">
          <div
            v-for="game in gameBalances"
            :key="game.game"
            class="px-4 py-3 hover:bg-white/5 transition-all"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden"
                >
                  <!-- ✅ Show image if found, otherwise show text -->
                  <img
                    v-if="getGameIcon(game.game)"
                    :src="getGameIcon(game.game)"
                    :alt="game.game"
                    class="w-full h-full object-contain"
                  />
                  <span v-else class="font-bold text-xs text-gray-300">
                    {{ game.game.substring(0, 2).toUpperCase() }}
                  </span>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-200">
                    {{ game.game }}
                  </p>
                  <p class="text-xs text-gray-400">{{ $t("game_balance") }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span
                  class="font-medium text-gray-200 text-sm"
                  :class="{ 'text-gray-500': game.isRefreshing }"
                >
                  {{ formatNumber(game.balance) }}
                </span>
                <button
                  @click="fetchAllGameBalances()"
                  class="w-7 h-7 rounded-md hover:bg-white/10 flex items-center justify-center transition-all text-gray-400 hover:text-white"
                  :disabled="game.isRefreshing || isLoading"
                >
                  <i
                    class="bi text-sm"
                    :class="
                      game.isRefreshing
                        ? 'bi-arrow-repeat animate-spin'
                        : 'bi-arrow-clockwise'
                    "
                  ></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="!isLoading"
        class="px-4 py-3 border-t border-white/10 bg-white/5"
      >
        <div class="flex justify-between items-center">
          <span class="text-sm font-semibold text-gray-300">{{
            $t("total_balance")
          }}</span>
          <span class="font-bold text-[#ff3344] text-base">{{
            formatNumber(totalBalance)
          }}</span>
        </div>
      </div>

      <div
        v-if="!isLoading"
        class="lg:hidden px-4 py-3 border-t border-white/10"
      >
        <button
          @click="emitClose"
          class="w-full py-2.5 bg-white/5 text-white font-medium rounded-lg hover:bg-white/10 transition-all border border-white/10"
        >
          {{ $t("close") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["close"]);
const userData = useState("userData");
const generalSetting = useState("generalSetting");
const slotKiosks = useState("slotKiosks");
const lotteryKiosks = useState("lotteryKiosks");
const { showAlert } = useAlert();
const { get, post } = useApiEndpoint();
const gameBalances = ref([]);
let gameTotalBalances = ref(0);
const isLoading = ref(false);
const dropdownTimer = ref(null);
const mouseOverDropdown = ref(false);

const getGameIcon = (gameName) => {
  const normalize = (str) => {
    return str.toLowerCase().replace(/[^a-z0-9]/g, "");
  };

  const normalizedGameName = normalize(gameName);

  let kiosk = slotKiosks.value.find(
    (k) => normalize(k.name) === normalizedGameName
  );

  if (!kiosk) {
    kiosk = lotteryKiosks.value.find(
      (k) => normalize(k.name) === normalizedGameName
    );
  }

  return kiosk?.banner || kiosk?.logo || null;
};

const totalBalance = computed(() => {
  let total = userData.value.wallet || 0;
  gameBalances.value.forEach((game) => {
    total += parseFloat(game.balance || 0);
  });
  return total;
});

function emitClose() {
  emit("close");
}

const fetchAllGameBalances = async () => {
  isLoading.value = true;
  try {
    const { data } = await post("game/checkallgamebalance");
    if (data.success) {
      gameBalances.value = data.games.map((item) => ({
        ...item,
        isRefreshing: false,
      }));
      gameTotalBalances = data.totalBalance;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  } catch (error) {
    console.error("Error fetching game balances:", error);
  } finally {
    isLoading.value = false;
  }
};

const refreshAllBalances = async () => {
  isLoading.value = true;
  try {
    const { data } = await post("game/transferout/all");
    if (data.success) {
      await fetchAllGameBalances();
      await fetchUserData();
    }
  } catch (error) {
    console.error("Error restoring balances:", error);
    showAlert($t("alert_error"), $t("failed_restore_balances"), "error");
  } finally {
    isLoading.value = false;
  }
};

const fetchUserData = async () => {
  isLoading.value = true;
  try {
    const { data } = await get("userdata");
    if (data.success) {
      userData.value = data.user;
    }
  } catch (error) {
    console.error("Error fetching helps:", error);
  } finally {
    isLoading.value = false;
  }
};

const formatNumber = (value) => {
  if (!value && value !== 0) return "0.00";
  return parseFloat(value).toFixed(2);
};

onMounted(async () => {
  try {
    await fetchAllGameBalances();
    await fetchUserData();
  } catch (error) {
    console.error("Error during initialization:", error);
  }
});
</script>

<style scoped>
/* Custom Scrollbar */
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #ff3344;
  border-radius: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #ff5555;
}

/* Spin Animation */
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

/* Smooth transitions */
* {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>
