<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isVisible"
        class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[99] p-4"
        @click.self="emitClose"
      >
        <div
          class="bg-[#1A0D13] border border-[#3b1c23] rounded-lg w-full max-w-md overflow-hidden"
          :class="isVisible ? 'animate-popupIn' : ''"
        >
          <div
            class="p-4 border-b border-[#3b1c23] flex items-center justify-between"
          >
            <h3 class="font-semibold text-[#f0eaea] text-base max-sm:text-sm">
              {{ $t("transfer_funds") }}
            </h3>
            <button
              @click="emitClose"
              class="w-8 h-8 max-sm:w-7 max-sm:h-7 rounded-lg bg-[#241017] border border-[#3b1c23] flex items-center justify-center text-[#b37a7a] lg:hover:text-[#ff3344] lg:hover:border-[#ff3344] transition-all"
            >
              <Icon icon="mdi:close" class="w-5 h-5 max-sm:w-4 max-sm:h-4" />
            </button>
          </div>

          <div class="p-4 space-y-4">
            <div class="bg-[#241017]/60 border border-[#3b1c23] rounded-lg p-4">
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 bg-[#ff3344]/10 rounded-lg flex items-center justify-center"
                  >
                    <i class="bi bi-wallet2 text-lg text-[#ff3344]"></i>
                  </div>
                  <div>
                    <p class="text-xs text-[#b37a7a] mb-0.5">
                      {{ $t("game_balance") }}
                    </p>
                    <div class="flex items-center">
                      <p
                        v-if="!isBalanceLoading"
                        class="text-base font-bold text-[#f0eaea]"
                      >
                        {{ gameBalance || "0.00" }}
                      </p>
                      <div v-else class="flex items-center gap-2">
                        <div
                          class="w-4 h-4 border-2 border-[#ff3344] border-t-transparent rounded-full animate-spin"
                        ></div>
                        <span class="text-sm text-[#8a6b73]">Loading...</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  @click="refreshBalance"
                  :disabled="isBalanceLoading"
                  class="w-9 h-9 bg-[#15090e] rounded-lg border border-[#2a1419] text-[#ff3344] lg:hover:bg-[#1f0e13] transition-all disabled:opacity-50"
                >
                  <i
                    class="bi"
                    :class="[
                      isBalanceLoading
                        ? 'bi-arrow-repeat animate-spin'
                        : 'bi-arrow-clockwise',
                    ]"
                  ></i>
                </button>
              </div>
            </div>

            <div>
              <label
                class="block text-sm max-sm:text-xs font-semibold text-[#f0eaea] mb-1.5"
              >
                {{ $t("transfer_in") }}
              </label>
              <div class="flex max-[400px]:flex-col gap-2">
                <input
                  type="number"
                  v-model="transferInAmount"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  class="flex-1 px-3 py-2.5 bg-[#15090e] text-[#f0eaea] rounded-lg placeholder-[#b37a7a] border border-[#3b1c23] focus:border-[#ff3344] focus:outline-none transition-all text-sm font-medium"
                />
                <button
                  @click="transferIn"
                  :disabled="
                    isTransferInLoading ||
                    !transferInAmount ||
                    parseFloat(transferInAmount) <= 0
                  "
                  class="px-5 py-2.5 bg-gradient-to-r from-[#a1122d] to-[#c21b3a] text-white rounded-lg font-medium lg:hover:from-[#8e0f25] lg:hover:to-[#a1122d] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[90px] text-sm"
                >
                  <span v-if="!isTransferInLoading">{{ $t("transfer") }}</span>
                  <div
                    v-else
                    class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                  ></div>
                </button>
              </div>
              <p class="text-xs text-[#8a6b73] mt-1.5">
                {{ $t("transfer_in_description") }}
              </p>
            </div>

            <div>
              <label
                class="block text-sm max-sm:text-xs font-semibold text-[#f0eaea] mb-1.5"
              >
                {{ $t("transfer_out") }}
              </label>
              <div class="flex max-[400px]:flex-col gap-2">
                <input
                  type="number"
                  v-model="transferOutAmount"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  class="flex-1 px-3 py-2.5 bg-[#15090e] text-[#f0eaea] rounded-lg placeholder-[#b37a7a] border border-[#3b1c23] focus:border-[#ff3344] focus:outline-none transition-all text-sm font-medium"
                />
                <button
                  @click="transferOut"
                  :disabled="
                    isTransferOutLoading ||
                    !transferOutAmount ||
                    parseFloat(transferOutAmount) <= 0
                  "
                  class="px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium lg:hover:from-green-700 lg:hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[90px] text-sm"
                >
                  <span v-if="!isTransferOutLoading">{{ $t("transfer") }}</span>
                  <div
                    v-else
                    class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                  ></div>
                </button>
              </div>
              <p class="text-xs text-[#8a6b73] mt-1.5">
                {{ $t("transfer_out_description") }}
              </p>
            </div>
          </div>

          <div class="p-4 border-t border-[#3b1c23]">
            <button
              @click="emitClose"
              class="w-full py-2.5 bg-[#241017] border border-[#3b1c23] text-[#f0eaea] rounded-lg font-medium lg:hover:border-[#ff3344]/50 transition-all text-sm max-sm:text-xs"
            >
              {{ $t("close") }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { Icon } from "@iconify/vue";

const props = defineProps({
  gameInfo: {
    type: Object,
    required: true,
  },
  currentBalance: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["close", "balanceUpdated"]);

const isVisible = ref(true);
const gameBalance = ref(props.currentBalance);
const transferInAmount = ref("");
const transferOutAmount = ref("");
const isBalanceLoading = ref(false);
const isTransferInLoading = ref(false);
const isTransferOutLoading = ref(false);

const { post } = useApiEndpoint();
const { showAlert } = useAlert();

function emitClose() {
  isVisible.value = false;
  setTimeout(() => {
    emit("close");
  }, 300);
}

async function refreshBalance() {
  if (!props.gameInfo || !props.gameInfo.balanceAPI) {
    showAlert($t("alert_error"), $t("balance_api_unavailable"), "error");
    return;
  }
  isBalanceLoading.value = true;
  try {
    const { data } = await post(props.gameInfo.balanceAPI);
    if (data.success) {
      gameBalance.value = data.balance || "0.00";
      emit("balanceUpdated");
    } else {
      showAlert(
        $t("alert_info"),
        data.message[$locale.value] || data.message.en,
        "info"
      );
    }
  } catch (error) {
    console.error("Error fetching balance:", error);
    showAlert($t("alert_error"), $t("failed_fetch_balance"), "error");
  } finally {
    isBalanceLoading.value = false;
  }
}

async function transferIn() {
  if (!props.gameInfo || !props.gameInfo.transferInAPI) {
    showAlert($t("alert_info"), $t("transfer_in_api_unavailable"), "info");
    return;
  }
  if (!transferInAmount.value || parseFloat(transferInAmount.value) <= 0) {
    showAlert($t("alert_info"), $t("valid_amount"), "info");
    return;
  }
  isTransferInLoading.value = true;
  try {
    const { data } = await post(props.gameInfo.transferInAPI, {
      transferAmount: parseFloat(transferInAmount.value),
    });
    if (data.success) {
      showAlert($t("alert_success"), $t("transfer_in_successful"), "success");
      transferInAmount.value = "";
      await refreshBalance();
    } else {
      showAlert(
        $t("alert_info"),
        data.message[$locale.value] || data.message.en,
        "info"
      );
    }
  } catch (error) {
    console.error("Error transferring in:", error);
    showAlert(
      $t("alert_error"),
      error.message || $t("failed_transfer_in"),
      "error"
    );
  } finally {
    isTransferInLoading.value = false;
  }
}

async function transferOut() {
  if (!props.gameInfo || !props.gameInfo.transferOutAPI) {
    showAlert($t("alert_info"), $t("transfer_out_api_unavailable"), "info");
    return;
  }
  if (!transferOutAmount.value || parseFloat(transferOutAmount.value) <= 0) {
    showAlert($t("alert_info"), $t("valid_amount"), "info");
    return;
  }
  isTransferOutLoading.value = true;
  try {
    const { data } = await post(props.gameInfo.transferOutAPI, {
      transferAmount: parseFloat(transferOutAmount.value),
    });
    if (data.success) {
      showAlert($t("alert_success"), $t("transfer_out_successful"), "success");
      transferOutAmount.value = "";
      await refreshBalance();
    } else {
      showAlert(
        $t("alert_info"),
        data.message[$locale.value] || data.message.en,
        "info"
      );
    }
  } catch (error) {
    console.error("Error transferring out:", error);
    showAlert(
      $t("alert_error"),
      error.message || $t("failed_transfer_out"),
      "error"
    );
  } finally {
    isTransferOutLoading.value = false;
  }
}

onMounted(() => {
  refreshBalance();
});
</script>

<style scoped>
/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Popup animation */
@keyframes popupIn {
  0% {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-popupIn {
  animation: popupIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

/* Spin animation */
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
