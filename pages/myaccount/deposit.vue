<template>
  <Teleport to="body">
    <Alerts
      :title="alertTitle"
      :message="alertMessage"
      :isVisible="alertVisible"
      :type="alertType"
      @close="alertVisible = false"
    />

    <CompanyBankDetails
      :show="showBankModal"
      :bank="selectedBankForModal"
      @close="closeBankModal"
      @select="confirmBankSelection"
      @copy="copyToClipboard"
    />
  </Teleport>
  <UserAccountLayout>
    <div class="text-[#f0eaea]">
      <div class="mb-6 max-lg:mb-4">
        <h1 class="text-xl font-bold mb-1 max-lg:text-lg max-sm:text-base">
          {{ $t("deposit") }}
        </h1>
        <p class="text-[#b37a7a] text-sm max-lg:text-xs">
          {{ $t("add_funds_description") }}
        </p>
      </div>

      <div
        v-if="
          userData &&
          userData.luckySpinAmount > 0 &&
          userData.luckySpinClaim === false
        "
        class="bg-green-500/5 border border-green-500/20 rounded-lg p-4 mb-4 max-lg:p-3"
      >
        <div class="flex items-start gap-3">
          <div
            class="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0"
          >
            <Icon icon="mdi:gift" class="w-5 h-5 text-green-400" />
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-green-400 mb-2 text-sm">
              {{ $t("lucky_spin_reward") }}
            </h3>
            <p class="text-sm text-[#f0eaea] mb-2 max-lg:text-xs">
              {{ $t("lucky_spin_waiting_1") }}
              <span class="font-bold text-green-400"
                >${{ userData.luckySpinAmount }}</span
              >
              {{ $t("lucky_spin_waiting_2") }}
            </p>
            <p class="text-xs text-[#b37a7a] mb-3">
              {{ $t("claim_instructions_1") }}
              <span class="font-semibold text-green-400">$30</span>
              {{ $t("claim_instructions_2") }}
            </p>
            <button
              @click="selectDepositAmount(30)"
              class="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium lg:hover:bg-green-600 transition-colors max-lg:px-3 max-lg:py-1.5 max-lg:text-xs"
            >
              {{ $t("deposit_30_now") }}
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="selectedOption === 'bank_transfer'"
        class="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4 mb-4 max-lg:p-3"
      >
        <div class="flex items-start gap-3 max-sm:gap-1.5">
          <Icon
            icon="mdi:alert"
            class="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5 max-sm:w-3 max-sm:h-3"
          />
          <div class="flex-1">
            <h3
              class="font-semibold text-amber-400 mb-2 max-sm:mb-1 text-sm max-sm:text-xs"
            >
              {{ $t("notice") }}
            </h3>
            <p class="text-sm text-[#f0eaea] mb-1 max-lg:text-xs">
              {{ $t("bank_transfer_notice_1") }}
            </p>
            <p class="text-sm text-amber-400 font-medium max-lg:text-xs">
              {{ $t("bank_transfer_notice_2") }}
            </p>
          </div>
        </div>
      </div>

      <div class="mb-4">
        <label class="block font-semibold mb-2 text-base max-lg:text-sm">{{
          $t("deposit_method")
        }}</label>
        <div class="grid grid-cols-2 gap-3 max-lg:gap-2">
          <button
            v-for="option in depositOptions"
            :key="option.name"
            @click="selectOption(option.name)"
            :class="[
              'p-4 rounded-lg flex items-center justify-center gap-2 max-[370px]:gap-1 transition-all border text-[0.9rem] max-lg:p-2.5 ',
              selectedOption === option.name
                ? 'bg-[#ff3344]/10 border-[#ff3344] text-[#ff3344]'
                : 'bg-[#241017] border-[#3b1c23] text-[#b37a7a] lg:hover:border-[#ff3344]/50',
            ]"
          >
            <Icon
              :icon="option.icon"
              class="text-lg max-lg:text-base max-sm:text-sm"
            />
            <span class="font-medium max-sm:text-sm max-[370px]:text-xs">{{
              $t(option.label)
            }}</span>
          </button>
        </div>
      </div>

      <!-- Deposit Amount -->
      <div class="mb-4">
        <label class="block font-semibold mb-2 text-base max-lg:text-sm">{{
          $t("deposit_amount")
        }}</label>

        <div class="relative mb-3">
          <div
            class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
          >
            <span class="text-[#b37a7a] text-sm font-medium">MYR</span>
          </div>
          <input
            type="text"
            v-model="selectedDepositAmount"
            :placeholder="$t('amount_placeholder')"
            @input="onlyNumbers"
            class="w-full pr-4 py-3.5 pl-16 bg-[#241017] text-[#f0eaea] rounded-lg placeholder-[#b37a7a] border border-[#3b1c23] focus:border-[#ff3344] focus:outline-none transition-colors text-[0.9rem] max-lg:pl-14 max-lg:py-2.5 max-lg:pr-2.5 max-sm:text-sm max-[370px]:text-xs"
          />
        </div>

        <div class="flex gap-2 flex-wrap">
          <button
            v-for="amount in amounts"
            :key="amount"
            @click="selectDepositAmount(amount)"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-all max-sm:text-sm max-[370px]:text-xs text-[0.9rem] border max-lg:px-3 max-lg:py-1.5 ',
              selectedDepositAmount === amount.toString()
                ? 'bg-[#ff3344] text-white border-[#ff3344]'
                : 'bg-[#241017] text-[#b37a7a] border-[#3b1c23] lg:hover:border-[#ff3344]/50',
            ]"
          >
            RM {{ amount }}
          </button>
        </div>
      </div>

      <div v-if="selectedOption === 'fast_deposit'" class="mb-4">
        <label class="block font-semibold mb-2 text-base max-lg:text-sm">{{
          $t("deposit_channel")
        }}</label>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 max-lg:gap-2">
          <button
            v-for="gateway in paymentGateways"
            :key="gateway._id"
            @click="selectPaymentGateway(gateway)"
            :class="[
              'p-4 rounded-lg flex items-center justify-center transition-all border min-h-[80px] max-lg:p-3 max-lg:min-h-[60px]',
              selectedPaymentGateway === gateway
                ? 'bg-[#ff3344]/10 border-[#ff3344]'
                : 'bg-[#241017] border-[#3b1c23] lg:hover:border-[#ff3344]/50',
            ]"
          >
            <img
              v-if="gateway.logo"
              :src="gateway.logo"
              :alt="gateway.name"
              class="h-10 w-auto object-contain max-lg:h-8"
            />
          </button>
        </div>
      </div>

      <div
        v-if="
          selectedOption === 'fast_deposit' &&
          selectedPaymentGateway &&
          selectedPaymentGatewayBanks.length > 0
        "
        class="mb-4"
      >
        <label class="block font-semibold mb-2 text-base max-lg:text-sm">
          {{ $t("select_bank_for", { provider: selectedPaymentGateway.name }) }}
        </label>
        <div
          class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-lg:gap-2"
        >
          <div
            v-for="bank in selectedPaymentGatewayBanks"
            :key="bank.code"
            @click="selectGatewayBank(bank)"
            :class="[
              'p-4 max-lg:p-3 rounded-lg cursor-pointer transition-all flex flex-col items-center border',
              selectedGatewayBank && selectedGatewayBank.code === bank.code
                ? 'bg-[#ff3344]/10 border-[#ff3344]'
                : 'bg-[#241017] border-[#3b1c23] lg:hover:border-[#ff3344]/50',
            ]"
          >
            <img
              :src="bank.logo"
              :alt="bank.name"
              class="w-16 h-16 max-lg:w-12 max-lg:h-12 object-contain mb-2"
            />
            <p
              class="text-sm max-lg:text-xs font-medium text-center text-[#f0eaea]"
            >
              {{ bank.name }}
            </p>
          </div>
        </div>

        <div
          v-if="selectedGatewayBank"
          class="mt-3 p-3 bg-[#241017] border border-[#3b1c23] rounded-lg"
        >
          <p class="text-sm max-lg:text-xs text-[#b37a7a]">
            <span class="text-[#f0eaea] font-medium">{{
              selectedGatewayBank.name
            }}</span>
            {{ $t("deposit_limit") }}:
            <span class="text-[#ff3344]"
              >MYR {{ selectedGatewayBank.minLimit.toLocaleString() }}</span
            >
            -
            <span class="text-[#ff3344]"
              >MYR {{ selectedGatewayBank.maxLimit.toLocaleString() }}</span
            >
          </p>
        </div>
      </div>

      <div v-if="selectedOption === 'bank_transfer'" class="mb-4">
        <label class="block font-semibold mb-2 text-base max-lg:text-sm">{{
          $t("select_bank")
        }}</label>
        <div class="grid grid-cols-5 max-sm:grid-cols-2 gap-2">
          <button
            v-for="bank in depositbank"
            :key="bank._id"
            @click="openBankModal(bank)"
            :class="[
              ' rounded-lg flex items-center justify-center transition-all border w-32 h-32 max-sm:w-24 max-sm:h-24',
              selectedBank && selectedBank.bankaccount === bank.bankaccount
                ? 'bg-[#ff3344]/10 border-[#ff3344]'
                : 'bg-[#241017] border-[#3b1c23] lg:hover:border-[#ff3344]/50',
            ]"
          >
            <img
              v-if="bank.qrimage"
              :src="bank.qrimage"
              :alt="bank.bankname"
              class="w-full h-full object-contain"
            />
            <img
              v-else
              src="/images/deposit/bank.png"
              :alt="bank.bankname"
              class="w-full h-full object-contain"
            />
          </button>
        </div>
      </div>
      <div class="mb-4">
        <label class="block font-semibold mb-2 text-base max-lg:text-sm">
          {{ $t("promotion_optional") }}
        </label>
        <div class="relative" ref="promotionDropdown">
          <button
            type="button"
            @click="isPromotionDropdownOpen = !isPromotionDropdownOpen"
            class="w-full p-3 bg-[#241017] text-left rounded-lg border border-[#3b1c23] focus:border-[#ff3344] focus:outline-none transition-colors text-[0.9rem] max-sm:text-sm max-[370px]:text-xs flex items-center justify-between max-lg:p-2.5"
            :class="selectedPromotion ? 'text-[#f0eaea]' : 'text-[#b37a7a]'"
          >
            <span>{{
              selectedPromotion
                ? selectedPromotion.maintitleEN
                : selectedPromotion === ""
                ? $t("without_promotion")
                : $t("select_promotion")
            }}</span>
            <Icon
              icon="mdi:chevron-down"
              class="w-5 h-5 transition-transform"
              :class="{ 'rotate-180': isPromotionDropdownOpen }"
            />
          </button>

          <Transition name="dropdown">
            <div
              v-if="isPromotionDropdownOpen"
              class="absolute z-50 w-full mt-2 bg-[#241017] border border-[#3b1c23] rounded-lg shadow-lg max-h-40 overflow-y-auto scrollbar-thin"
            >
              <button
                type="button"
                @click="selectPromotion('')"
                class="w-full p-3 text-left text-[#f0eaea] text-[0.9rem] lg:hover:bg-[#15090e] transition-colors border-b border-[#3b1c23] max-lg:p-2.5"
              >
                {{ $t("without_promotion") }}
              </button>
              <button
                type="button"
                v-for="promotion in promotionlist"
                :key="promotion._id"
                @click="selectPromotion(promotion)"
                class="w-full p-3 text-left text-[#f0eaea] text-[0.9rem] lg:hover:bg-[#15090e] transition-colors border-b border-[#3b1c23] last:border-b-0 max-lg:p-2.5"
                :class="{
                  'bg-[#ff3344]/10 text-[#ff3344]':
                    selectedPromotion &&
                    selectedPromotion._id === promotion._id,
                }"
              >
                {{
                  $i18n.locale === "zh"
                    ? promotion.maintitle
                    : promotion.maintitleEN
                }}
              </button>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Receipt Upload -->
      <div v-if="selectedOption === 'bank_transfer'" class="mb-4">
        <label class="block font-semibold mb-2 text-base max-lg:text-sm">{{
          $t("upload_receipt")
        }}</label>
        <div
          class="relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#3b1c23] rounded-lg bg-[#241017] cursor-pointer lg:hover:border-[#ff3344]/50 transition-all max-lg:p-4"
          @click="$refs.fileInput.click()"
        >
          <input
            type="file"
            ref="fileInput"
            class="hidden"
            @change="handleFileUpload"
            accept="image/*"
          />

          <div v-if="!receipt" class="text-center">
            <Icon
              icon="mdi:cloud-upload"
              class="w-10 h-10 text-[#b37a7a] mx-auto mb-2 max-lg:w-8 max-lg:h-8"
            />
            <p class="text-sm text-[#b37a7a] max-lg:text-xs">
              {{ $t("upload_receipt") }}
            </p>
          </div>

          <div v-else class="w-full">
            <img
              :src="receiptPreview"
              class="w-full h-48 object-contain rounded-lg max-lg:h-40"
            />
            <button
              @click.stop="removeReceipt"
              class="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center lg:hover:bg-red-600 transition-colors max-lg:w-7 max-lg:h-7"
            >
              <Icon
                icon="mdi:close"
                class="w-5 h-5 text-white max-lg:w-4 max-lg:h-4"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <LoadingButton
        :loading="depositButtonLoading"
        @click="submitDeposit"
        class="w-full py-3 bg-[#ff3344] lg:hover:bg-[#cc2a3a] rounded-lg text-base font-semibold text-white transition-all mb-6 max-lg:py-2.5 max-lg:text-sm max-lg:mb-4"
      >
        {{ $t("submit") }}
      </LoadingButton>

      <!-- Important Notice -->
      <div class="border border-[#3b1c23] rounded-lg p-4 max-lg:p-3">
        <div class="flex items-center gap-2 mb-3">
          <Icon
            icon="mdi:information"
            class="w-5 h-5 text-[#ff3344] flex-shrink-0 mt-0.5"
          />
          <h3 class="font-semibold text-[#ff3344] text-sm">
            {{ $t("important_notice") }}
          </h3>
        </div>
        <ul
          class="list-disc ml-7 space-y-1 text-sm text-[#b37a7a] max-lg:text-xs max-lg:ml-6"
        >
          <li>{{ $t("notice_1") }}</li>
          <li>{{ $t("notice_2") }}</li>
          <template v-if="showFullNotice">
            <li>{{ $t("notice_3") }}</li>
            <li>{{ $t("notice_4") }}</li>
            <li>{{ $t("notice_5") }}</li>
            <li>{{ $t("notice_6") }}</li>
            <li>
              {{ $t("notice_7_1") }}
              <span class="text-[#ff3344] font-medium">{{
                $t("notice_7_2")
              }}</span>
              {{ $t("notice_7_3") }}
            </li>
          </template>
        </ul>
        <button
          class="text-[#ff3344] lg:hover:underline text-sm mt-3 font-medium max-lg:text-xs"
          @click="showFullNotice = !showFullNotice"
        >
          {{ showFullNotice ? $t("show_less") : $t("show_more") }}
        </button>
      </div>
    </div>
  </UserAccountLayout>
</template>

<script setup>
import UserAccountLayout from "~/layouts/UserAccountLayout.vue";
import { Icon } from "@iconify/vue";

const { checkAuth } = useAuthCheck();
await checkAuth();
const userData = useState("userData");
const showFullNotice = ref(false);
const pageLoading = useState("pageLoading");
const depositbank = ref([]);
const promotionlist = ref([]);
const fileInput = ref(null);
const receipt = ref(null);
const receiptPreview = ref("");
const selectedPromotion = ref(null);
const depositButtonLoading = ref(false);
const paymentGateways = ref([]);
const selectedPaymentGateway = ref(null);
let gameTotalBalances = ref(0);

const alertVisible = ref(false);
const alertTitle = ref("");
const alertMessage = ref("");
const alertType = ref("");

const { get, post } = useApiEndpoint();

const depositOptions = [
  { name: "fast_deposit", label: "fast_deposit", icon: "mdi:flash" },
  { name: "bank_transfer", label: "bank_transfer", icon: "mdi:bank" },
];

const selectedOption = ref("fast_deposit");
const selectedDepositAmount = ref("");
const selectedBank = ref(null);
const amounts = [50, 100, 500, 1000, 3000];

const showBankModal = ref(false);
const selectedBankForModal = ref(null);

function openBankModal(bank) {
  selectedBankForModal.value = bank;
  showBankModal.value = true;
}

function closeBankModal() {
  showBankModal.value = false;
  setTimeout(() => {
    selectedBankForModal.value = null;
  }, 300);
}

function confirmBankSelection(bank) {
  selectedBank.value = bank;
  closeBankModal();
}

function selectOption(option) {
  selectedOption.value = option;
  if (option === "fast_deposit" && paymentGateways.value.length > 0) {
    selectPaymentGateway(paymentGateways.value[0]);
  }
}

function selectDepositAmount(amount) {
  selectedDepositAmount.value = amount.toString();
}

function selectBank(bank) {
  selectedBank.value = bank;
}

function onlyNumbers() {
  selectedDepositAmount.value = selectedDepositAmount.value.replace(/\D/g, "");
}

function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  receipt.value = file;
  const reader = new FileReader();
  reader.onload = (e) => (receiptPreview.value = e.target.result);
  reader.readAsDataURL(file);
}

function removeReceipt() {
  receipt.value = null;
  receiptPreview.value = "";
  if (fileInput.value) fileInput.value.value = "";
}

function resetForm() {
  selectedOption.value = "fast_deposit";
  selectedDepositAmount.value = "";
  selectedBank.value = null;
  receipt.value = null;
  receiptPreview.value = "";
  selectedPromotion.value = null;
  selectedPaymentGateway.value = null;
  selectedGatewayBank.value = null;
  if (fileInput.value) fileInput.value.value = "";
}

function showAlert(title, message, type = "info") {
  alertTitle.value = title;
  alertMessage.value = message;
  alertType.value = type;
  alertVisible.value = true;
}

function validateDepositForm() {
  if (!selectedDepositAmount.value) {
    showAlert($t("alert_info"), $t("please_enter_amount"));
    return false;
  }

  if (selectedOption.value === "bank_transfer") {
    if (!selectedBank.value) {
      showAlert($t("alert_info"), $t("please_select_bank"));
      return false;
    }

    if (!receipt.value) {
      showAlert($t("alert_info"), $t("please_upload_receipt"));
      return false;
    }
  } else if (selectedOption.value === "fast_deposit") {
    if (!selectedPaymentGateway.value) {
      showAlert($t("alert_info"), $t("please_select_payment_gateway"));
      return false;
    }
  }

  return true;
}

async function submitBonus(depositId) {
  try {
    const { data } = await post("client/submitdepositbonus", {
      promotionId: selectedPromotion.value._id,
      depositAmount: selectedDepositAmount.value,
      depositId: depositId,
    });
    if (!data.success) {
      showAlert(
        $t("alert_info"),
        data.message[$locale.value] || "Bonus submission failed"
      );
    }
  } catch (error) {
    console.error("Failed to submit bonus:", error);
  }
}

const selectedGatewayBank = ref(null);

const selectedPaymentGatewayBanks = computed(() => {
  if (!selectedPaymentGateway.value) return [];

  return (
    selectedPaymentGateway.value.banks
      ?.filter((bank) => bank.active)
      .map((bank) => ({
        name: bank.bankname,
        code: bank.bankcode,
        logo: bank.bankimage,
        minLimit: bank.minlimit || 0,
        maxLimit: bank.maxlimit || Infinity,
      })) || []
  );
});

function selectGatewayBank(bank) {
  selectedGatewayBank.value = bank;
}

function selectPaymentGateway(gateway) {
  selectedPaymentGateway.value = gateway;
  selectedGatewayBank.value = null;
}

async function submitDeposit() {
  if (!validateDepositForm()) return;

  const amount = Number(selectedDepositAmount.value);
  if (isNaN(amount) || !amount) {
    showAlert($t("alert_info"), $t("please_enter_valid_amount"));
    return;
  }

  // if (selectedOption.value === "fast_deposit") {
  //   try {
  //     const restrictionCheck = await get(`check-fast-deposit-restriction`);
  //     if (
  //       restrictionCheck.data.success &&
  //       restrictionCheck.data.hasRestriction &&
  //       userData.value.wallet + gameTotalBalances >= 10
  //     ) {
  //       showAlert(
  //         $t("alert_info"),
  //         $t("fast_deposit_balance_restriction"),
  //         "info"
  //       );
  //       return;
  //     }
  //   } catch (error) {
  //     console.error("Error checking fast deposit restriction:", error);
  //     if (userData.value && userData.value.wallet + gameTotalBalances >= 10) {
  //       showAlert(
  //         $t("alert_info"),
  //         $t("fast_deposit_balance_restriction"),
  //         "info"
  //       );
  //       return;
  //     }
  //   }
  // }

  if (selectedPromotion.value) {
    try {
      const checkResponse = await post("client/checkpromotion", {
        promotionId: selectedPromotion.value._id,
        depositAmount: Number(selectedDepositAmount.value),
      });

      if (!checkResponse.data.success) {
        showAlert(
          $t("alert_info"),
          checkResponse.data.message[$locale.value] ||
            checkResponse.data.message.en
        );
        return;
      }
    } catch (error) {
      console.error("Error checking promotion:", error);
      showAlert(
        "Error",
        error.response?.data?.message?.[$locale.value] ||
          error.response?.data?.message?.en ||
          $t("network_error"),
        "error"
      );
      return;
    }
  }

  depositButtonLoading.value = true;

  try {
    if (selectedOption.value === "fast_deposit") {
      const { minDeposit, maxDeposit } = selectedPaymentGateway.value;
      // if (amount < minDeposit || amount > maxDeposit) {
      //   showAlert(
      //     $t("alert_info"),
      //     $t("amount_between", { min: minDeposit, max: maxDeposit })
      //   );
      //   return;
      // }

      if (
        selectedPaymentGatewayBanks.value.length > 0 &&
        !selectedGatewayBank.value
      ) {
        showAlert(
          $t("alert_info"),
          $t("please_select_bank_for", {
            provider: selectedPaymentGateway.value.name,
          })
        );
        return;
      }

      if (selectedGatewayBank.value) {
        const { minLimit, maxLimit, name } = selectedGatewayBank.value;

        if (amount < minLimit) {
          showAlert(
            $t("alert_info"),
            $t("bank_min_deposit", { bank: name, min: minLimit })
          );
          return;
        }

        if (amount > maxLimit) {
          showAlert(
            $t("alert_info"),
            $t("bank_max_deposit", { bank: name, max: maxLimit })
          );
          return;
        }
      }

      const requestParams = { trfAmt: amount };

      if (selectedPromotion.value) {
        requestParams.promotionId = selectedPromotion.value._id;
      }

      if (selectedGatewayBank.value) {
        requestParams.bankCode = selectedGatewayBank.value.code;
      }

      const { data } = await post(
        selectedPaymentGateway.value.paymentAPI,
        requestParams
      );

      if (data.success && data.url) {
        window.open(data.url, "_blank");
        resetForm();
      } else {
        showAlert(
          $t("alert_info"),
          data.message[$locale.value] || data.message.en,
          "info"
        );
      }
    } else {
      const formData = new FormData();
      formData.append("bankname", selectedBank.value.bankname);
      formData.append("ownername", selectedBank.value.ownername);
      formData.append("transferNumber", selectedBank.value.bankaccount);
      formData.append("bankid", selectedBank.value._id);
      formData.append("depositAmount", selectedDepositAmount.value);
      formData.append("receipt", receipt.value);

      const { data } = await post("deposit", formData);

      if (!data.success) {
        showAlert(
          $t("alert_info"),
          data.message[$locale.value] || "Deposit failed"
        );
        return;
      }

      if (selectedPromotion.value) await submitBonus(data.depositId);

      showAlert(
        $t("alert_success"),
        data.message[$locale.value] || $t("deposit_successful"),
        "success"
      );
      resetForm();
    }
  } catch (error) {
    console.error("Deposit error:", error);
    showAlert(
      "Error",
      error.response?.data?.message?.en || "Network error occurred",
      "error"
    );
  } finally {
    depositButtonLoading.value = false;
  }
}

const fetchDepositBank = async () => {
  try {
    const { data } = await get("client/banklist");
    if (data.success) {
      depositbank.value = data.data;
    }
  } catch (error) {
    console.error("Error fetching banks:", error);
  }
};

const fetchPromotionList = async () => {
  try {
    const { data } = await get("getdepositpromotion");
    if (data.success) {
      let filteredPromotions = data.data;
      const unlimitedBonusPromo = filteredPromotions.find(
        (promo) =>
          promo.maintitleEN === "Unlimited Bonus" ||
          promo.maintitle === "无限存款奖金"
      );
      if (unlimitedBonusPromo) {
        try {
          const vipResponse = await get("vipsettings");
          if (vipResponse.data?.success && userData.value?.viplevel) {
            const vipSettings = vipResponse.data.data[0];
            const userVipLevel = vipSettings.vipLevels.find(
              (level) => level.name === userData.value.viplevel
            );
            const unlimitedBonusPercent =
              userVipLevel?.benefits?.get?.("Unlimited Deposit Bonus") ||
              userVipLevel?.benefits?.["Unlimited Deposit Bonus"] ||
              0;
            if (parseFloat(unlimitedBonusPercent) <= 0) {
              filteredPromotions = filteredPromotions.filter(
                (promo) => promo._id !== unlimitedBonusPromo._id
              );
            }
          } else {
            filteredPromotions = filteredPromotions.filter(
              (promo) => promo._id !== unlimitedBonusPromo._id
            );
          }
        } catch (error) {
          console.error("Error checking VIP settings:", error);
          filteredPromotions = filteredPromotions.filter(
            (promo) => promo._id !== unlimitedBonusPromo._id
          );
        }
      }

      promotionlist.value = filteredPromotions;
    }
  } catch (error) {
    console.error("Error fetching promotions:", error);
  }
};

const fetchPaymentGateways = async () => {
  try {
    const { data } = await get("payment-gateways");
    if (data.success) paymentGateways.value = data.data;
  } catch (error) {
    console.error("Error fetching payment gateways:", error);
  }
};

function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      showAlert($t("alert_success"), $t("account_number_copied"), "success");
    })
    .catch(() => {
      showAlert($t("alert_error"), $t("failed_to_copy"), "error");
    });
}

const isPromotionDropdownOpen = ref(false);
const promotionDropdown = ref(null);

function selectPromotion(promotion) {
  selectedPromotion.value = promotion;
  isPromotionDropdownOpen.value = false;
}

const fetchAllGameBalances = async () => {
  try {
    const { data } = await post("game/checkallgamebalance");
    if (data.success) {
      gameTotalBalances = data.totalBalance;
    }
  } catch (error) {
    console.error("Error fetching game balances:", error);
  }
};

onMounted(() => {
  const handleClickOutside = (event) => {
    if (
      promotionDropdown.value &&
      !promotionDropdown.value.contains(event.target)
    ) {
      isPromotionDropdownOpen.value = false;
    }
  };

  document.addEventListener("click", handleClickOutside);

  onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside);
  });
});

onMounted(async () => {
  pageLoading.value = true;
  try {
    await Promise.all([
      fetchDepositBank(),
      fetchPromotionList(),
      fetchPaymentGateways(),
      fetchAllGameBalances(),
    ]);
    if (
      selectedOption.value === "fast_deposit" &&
      paymentGateways.value.length > 0
    ) {
      selectPaymentGateway(paymentGateways.value[0]);
    }
  } catch (error) {
    console.error("Error loading initial data:", error);
  } finally {
    pageLoading.value = false;
  }
});
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Popup animation for modal */
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
</style>
