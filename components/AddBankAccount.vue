<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isVisible"
        class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[99] p-4"
        @click.self="close"
      >
        <div
          class="bg-[#1A0D13] border border-[#3b1c23] rounded-lg w-full max-w-md overflow-hidden"
          :class="isVisible ? 'animate-popupIn' : ''"
        >
          <div
            class="p-4 border-b border-[#3b1c23] flex items-center justify-between"
          >
            <h3 class="font-semibold text-[#f0eaea] text-base max-sm:text-sm">
              {{ $t("add_bank_account") }}
            </h3>

            <button
              @click="close"
              class="w-8 h-8 max-sm:w-7 max-sm:h-7 rounded-lg bg-[#241017] border border-[#3b1c23] flex items-center justify-center text-[#b37a7a] lg:hover:text-[#ff3344] lg:hover:border-[#ff3344] transition-all"
            >
              <Icon icon="mdi:close" class="w-5 h-5 max-sm:w-4 max-sm:h-4" />
            </button>
          </div>

          <div class="p-4 space-y-4">
            <div>
              <label class="block text-xs font-semibold text-[#f0eaea] mb-1.5">
                {{ $t("name") }}
              </label>
              <input
                type="text"
                :value="userData.fullname"
                disabled
                readonly
                class="w-full px-3 py-2.5 bg-[#15090e] text-[#b37a7a] rounded-lg border border-[#3b1c23] cursor-not-allowed uppercase font-medium text-sm"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-[#f0eaea] mb-1.5">
                {{ $t("bank_name") }}
              </label>
              <div class="relative" ref="bankDropdown">
                <button
                  type="button"
                  @click="isBankDropdownOpen = !isBankDropdownOpen"
                  class="w-full px-3 py-2.5 rounded-lg border border-[#3b1c23] transition-all text-sm flex items-center justify-between"
                  :class="[
                    isBankDropdownOpen
                      ? 'bg-[#241017] border-[#ff3344]'
                      : 'bg-[#241017] hover:border-[#ff3344]/50',
                    accountData.bankName ? 'text-[#f0eaea]' : 'text-[#b37a7a]',
                  ]"
                >
                  <span class="font-medium">{{
                    accountData.bankName || $t("select_bank")
                  }}</span>
                  <Icon
                    icon="mdi:chevron-down"
                    class="w-5 h-5 text-[#ff3344] transition-transform"
                    :class="{ 'rotate-180': isBankDropdownOpen }"
                  />
                </button>

                <Transition name="dropdown">
                  <div
                    v-if="isBankDropdownOpen"
                    class="absolute z-50 w-full mt-1.5 bg-[#241017] border border-[#3b1c23] rounded-lg shadow-xl max-h-48 overflow-y-auto scrollbar-thin"
                  >
                    <button
                      type="button"
                      v-for="bank in banklist"
                      :key="bank._id"
                      @click="selectBank(bank.bankname)"
                      class="w-full px-3 py-2.5 text-left text-sm font-medium transition-colors border-b border-[#3b1c23] last:border-b-0"
                      :class="
                        accountData.bankName === bank.bankname
                          ? 'bg-[#ff3344]/10 text-[#ff3344]'
                          : 'text-[#f0eaea] hover:bg-[#15090e]'
                      "
                    >
                      {{ bank.bankname }}
                    </button>
                  </div>
                </Transition>
              </div>
            </div>

            <!-- Account Number -->
            <div>
              <label class="block text-xs font-semibold text-[#f0eaea] mb-1.5">
                {{ $t("account_number") }}
              </label>
              <input
                v-model="accountData.accountNumber"
                @input="onlyNumbers"
                type="text"
                :placeholder="$t('enter_account_number')"
                class="w-full px-3 py-2.5 bg-[#15090e] text-[#f0eaea] rounded-lg placeholder-[#b37a7a] border border-[#3b1c23] focus:border-[#ff3344] focus:outline-none transition-all text-sm font-medium"
              />
            </div>

            <!-- Warning -->
            <div class="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <div class="flex gap-2">
                <Icon
                  icon="mdi:alert-circle"
                  class="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5"
                />
                <p class="text-xs text-red-200 leading-relaxed">
                  {{ $t("name_restriction_1") }}
                  <strong class="text-red-400 font-bold">{{
                    $t("name_restriction_2")
                  }}</strong>
                  {{ $t("name_restriction_3") }}
                </p>
              </div>
            </div>
          </div>

          <div class="p-4 border-t border-[#3b1c23] flex gap-2">
            <button
              @click="close"
              class="flex-1 py-2.5 bg-[#241017] border border-[#3b1c23] text-[#f0eaea] rounded-lg font-medium lg:hover:border-[#ff3344]/50 transition-all text-sm max-sm:text-xs"
            >
              {{ $t("cancel") }}
            </button>
            <button
              @click="confirmAdd"
              :disabled="addWithdrawBankButtonLoading"
              class="flex-1 py-2.5 bg-[#ff3344] text-white rounded-lg font-semibold hover:bg-[#cc2a3a] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm max-sm:text-xs"
            >
              <Icon
                v-if="addWithdrawBankButtonLoading"
                icon="mdi:loading"
                class="w-5 h-5 animate-spin"
              />
              <span v-else>{{ $t("confirm") }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { Icon } from "@iconify/vue";

const pageLoading = useState("pageLoading");
const { get, post } = useApiEndpoint();
const addWithdrawBankButtonLoading = ref(false);
const banklist = ref([]);
const userData = useState("userData");
const { alertVisible, alertTitle, alertMessage, alertType, showAlert } =
  useAlert();

const isBankDropdownOpen = ref(false);
const bankDropdown = ref(null);

const props = defineProps({
  isVisible: Boolean,
});
const emits = defineEmits(["close", "addAccount"]);

const accountData = ref({
  bankName: "",
  accountNumber: "",
});

function selectBank(bankName) {
  accountData.value.bankName = bankName;
  isBankDropdownOpen.value = false;
}

function close() {
  emits("close");
}

async function confirmAdd() {
  if (!accountData.value.bankName || !accountData.value.accountNumber) {
    showAlert($t("alert_info"), $t("fields_required"), "info");
    return;
  }

  if (isNaN(Number(accountData.value.accountNumber))) {
    showAlert($t("alert_info"), $t("numeric_account_number"), "info");
    return;
  }

  addWithdrawBankButtonLoading.value = true;
  try {
    const { data } = await post("addbank", {
      name: userData.value.fullname,
      bankname: accountData.value.bankName,
      banknumber: accountData.value.accountNumber,
    });
    if (data.success) {
      showAlert(
        $t("alert_success"),
        data.message[$locale.value] || $t("bank_added"),
        "success"
      );
      emits("addAccount");
      resetForm();
    } else {
      showAlert(
        $t("alert_info"),
        data.message[$locale.value] || $t("failed_to_add"),
        "info"
      );
    }
  } catch (error) {
    showAlert(
      $t("alert_error"),
      error.response?.data?.message?.en || $t("add_failed"),
      "error"
    );
  } finally {
    addWithdrawBankButtonLoading.value = false;
  }
}

function resetForm() {
  accountData.value.bankName = "";
  accountData.value.accountNumber = "";
}

const onlyNumbers = () => {
  accountData.value.accountNumber = accountData.value.accountNumber.replace(
    /\D/g,
    ""
  );
};

const fetchBankList = async () => {
  try {
    const { data } = await get("client/activebanknames");
    if (data.success) {
      banklist.value = data.data;
    }
  } catch (error) {
    console.error("Error fetching bank list:", error);
  }
};

// Close dropdown when clicking outside
onMounted(() => {
  const handleClickOutside = (event) => {
    if (bankDropdown.value && !bankDropdown.value.contains(event.target)) {
      isBankDropdownOpen.value = false;
    }
  };

  document.addEventListener("click", handleClickOutside);

  onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside);
  });

  fetchBankList();
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

/* Dropdown transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
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

/* Custom scrollbar */
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: #15090e;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #3b1c23;
  border-radius: 2px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #ff3344;
}
</style>
