<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isVisible"
        class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[99] p-4"
      >
        <div
          class="bg-[#1A0D13] border border-[#3b1c23] rounded-lg w-full max-w-md overflow-hidden"
          :class="isVisible ? 'animate-popupIn' : ''"
        >
          <div class="p-4 border-b border-[#3b1c23]">
            <h3 class="font-semibold text-[#f0eaea] text-base max-sm:text-sm">
              {{ $t("complete_profile") }}
            </h3>
            <p class="text-xs text-[#b37a7a] mt-1">
              {{ $t("complete_profile_desc") }}
            </p>
          </div>

          <div class="p-4 space-y-4">
            <div>
              <label class="block text-xs font-semibold text-[#f0eaea] mb-1.5">
                {{ $t("fullname") }} <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.fullname"
                type="text"
                :placeholder="$t('fullname')"
                class="w-full px-3 py-2.5 bg-[#15090e] text-[#f0eaea] rounded-lg placeholder-[#b37a7a] border border-[#3b1c23] focus:border-[#ff3344] focus:outline-none transition-all text-sm font-medium uppercase"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-[#f0eaea] mb-1.5">
                {{ $t("mobile_number") }} <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.phonenumber"
                @input="onlyNumbers"
                type="text"
                :placeholder="$t('mobile_number')"
                class="w-full px-3 py-2.5 bg-[#15090e] text-[#f0eaea] rounded-lg placeholder-[#b37a7a] border border-[#3b1c23] focus:border-[#ff3344] focus:outline-none transition-all text-sm font-medium"
                required
              />
            </div>

            <!-- Email -->
            <div v-if="!userData?.email">
              <label class="block text-xs font-semibold text-[#f0eaea] mb-1.5">
                {{ $t("email") }} <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.email"
                type="email"
                :placeholder="$t('email')"
                class="w-full px-3 py-2.5 bg-[#15090e] text-[#f0eaea] rounded-lg placeholder-[#b37a7a] border border-[#3b1c23] focus:border-[#ff3344] focus:outline-none transition-all text-sm font-medium"
              />
            </div>

            <!-- Date of Birth -->
            <div>
              <label class="block text-xs font-semibold text-[#f0eaea] mb-1.5">
                {{ $t("date_of_birth") }} <span class="text-red-500">*</span>
              </label>
              <VueDatePicker
                v-model="formData.dob"
                :placeholder="$t('date_of_birth')"
                :enable-time-picker="false"
                :max-date="maxDate"
                :min-date="minDate"
                :format="format"
                :year-range="[1900, new Date().getFullYear() - 18]"
                :flow="['year', 'calendar']"
                :teleport="true"
              />
            </div>

            <!-- Referral Code -->
            <div v-if="!userData?.referralBy">
              <label class="block text-xs font-semibold text-[#f0eaea] mb-1.5">
                {{ $t("referrer_optional") }}
              </label>
              <input
                v-model="formData.referralCode"
                type="text"
                :placeholder="$t('referrer_optional')"
                class="w-full px-3 py-2.5 bg-[#15090e] text-[#f0eaea] rounded-lg placeholder-[#b37a7a] border border-[#3b1c23] focus:border-[#ff3344] focus:outline-none transition-all text-sm font-medium"
              />
            </div>
          </div>

          <div class="p-4 border-t border-[#3b1c23] space-y-2">
            <button
              @click="confirmUpdate"
              :disabled="
                updateButtonLoading ||
                !formData.phonenumber ||
                !formData.fullname ||
                !formData.dob ||
                (!userData?.email && !formData.email)
              "
              class="w-full py-2.5 bg-[#ff3344] text-white rounded-lg font-semibold hover:bg-[#cc2a3a] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              <Icon
                v-if="updateButtonLoading"
                icon="mdi:loading"
                class="w-5 h-5 animate-spin"
              />
              <span v-else>{{ $t("confirm") }}</span>
            </button>

            <button
              @click="handleLogout"
              class="w-full py-2.5 bg-[#241017] border border-[#3b1c23] text-[#f0eaea] rounded-lg font-medium hover:text-[#ff3344] transition-all text-sm flex items-center justify-center gap-2"
            >
              <Icon icon="mdi:logout" class="w-4 h-4" />
              <span>{{ $t("logout") }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const props = defineProps({
  isVisible: Boolean,
  userData: Object,
});

const {
  isConfirmAlertVisible,
  confirmAlertTitle,
  confirmAlertMessage,
  confirmAlertType,
  showConfirmAlert,
  closeConfirmAlert,
} = useConfirmAlert();
const localePath = useLocalePath();
const isUserLoggedIn = useState("isUserLoggedIn");
const isLogoutSuccess = ref(false);

const emit = defineEmits(["close", "updated"]);

const { post } = useApiEndpoint();
const { showAlert } = useAlert();
const updateButtonLoading = ref(false);

const formData = ref({
  fullname: "",
  phonenumber: "",
  email: "",
  dob: "",
  referralCode: "",
});

const maxDate = computed(() => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 18);
  return date;
});

const minDate = computed(() => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 120);
  return date;
});

const format = (date) => {
  if (!date) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const onlyNumbers = () => {
  formData.value.phonenumber = formData.value.phonenumber.replace(/\D/g, "");
};

const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return "";
  let formattedNumber = phoneNumber.replace(/\s+/g, "");
  if (formattedNumber.startsWith("+60")) {
    return formattedNumber.substring(1);
  } else if (formattedNumber.startsWith("60")) {
    return formattedNumber;
  } else if (formattedNumber.startsWith("0")) {
    return "6" + formattedNumber;
  } else {
    return "60" + formattedNumber;
  }
};

const confirmUpdate = async () => {
  if (!formData.value.phonenumber) {
    showAlert($t("error"), $t("phone_required"), "error");
    return;
  }

  if (!formData.value.fullname) {
    showAlert($t("error"), $t("fullname_required"), "error");
    return;
  }

  if (!/^[a-zA-Z\s]+$/.test(formData.value.fullname)) {
    showAlert($t("error"), $t("fullname_letters_only"), "error");
    return;
  }

  if (!props.userData?.email && !formData.value.email) {
    showAlert($t("error"), $t("email_required"), "error");
    return;
  }

  if (!formData.value.dob) {
    showAlert($t("error"), $t("dob_required"), "error");
    return;
  }

  if (!/^\d+$/.test(formData.value.phonenumber)) {
    showAlert($t("error"), $t("phone_number_digits_only"), "error");
    return;
  }

  if (formData.value.dob) {
    const birthDate = new Date(formData.value.dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    if (age < 18) {
      showAlert($t("error"), $t("must_be_18_years_or_older"), "error");
      return;
    }
  }

  updateButtonLoading.value = true;
  try {
    const formattedDob = formData.value.dob
      ? new Date(formData.value.dob).toLocaleDateString("en-GB")
      : "";

    const { data } = await post("complete-profile", {
      fullname: formData.value.fullname.toUpperCase(),
      phonenumber: formatPhoneNumber(formData.value.phonenumber),
      email: formData.value.email,
      dob: formattedDob,
      referralCode: formData.value.referralCode,
    });

    if (data.success) {
      showAlert(
        $t("success"),
        data.message[$locale.value] || $t("profile_updated"),
        "success"
      );
      emit("updated");
      emit("close");
    } else {
      showAlert(
        $t("info"),
        data.message[$locale.value] || $t("update_failed"),
        "info"
      );
    }
  } catch (error) {
    console.error("Update profile error:", error);
    showAlert(
      $t("error"),
      error.response?.data?.message?.[$locale.value] ||
        error.response?.data?.message?.en ||
        $t("network_error"),
      "error"
    );
  } finally {
    updateButtonLoading.value = false;
  }
};

const performLogout = async () => {
  try {
    const { data } = await post("logout");
    if (data.success) {
      isUserLoggedIn.value = false;
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("gametoken");
      isLogoutSuccess.value = true;

      showAlert($t("success"), $t("logout_success_message"), "success");

      setTimeout(() => {
        window.location.href = localePath("/");
      }, 1500);
    }
  } catch (error) {
    console.error("Logout error:", error);
    showAlert($t("error"), $t("logout_failed"), "error");
  }
};

const handleLogout = async () => {
  const confirmed = await showConfirmAlert(
    $t("logout_confirmation"),
    $t("logout_confirm_message"),
    "warning"
  );

  if (confirmed) {
    performLogout();
  }
};

watch(
  () => props.userData,
  (newData) => {
    if (newData) {
      formData.value.fullname = newData.fullname || "";
      formData.value.phonenumber = newData.phonenumber || "";
      formData.value.dob = newData.dob || "";
      formData.value.referralCode = "";
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

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

:deep(.dp__input) {
  background-color: #15090e !important;
  border: 1px solid #3b1c23 !important;
  color: #f0eaea !important;
  border-radius: 8px !important;
  font-size: 14px !important;
  padding-top: 0.625rem;
  padding-bottom: 0.625rem;
}

:deep(.dp__input::placeholder) {
  color: #b37a7a !important;
  opacity: 0.9;
}

:deep(.dp__input:focus) {
  border-color: #ff3344 !important;
  outline: none !important;
}

:deep(.dp__input_icon) {
  color: #b37a7a !important;
}

.dp__overlay_cell_disabled {
  color: #6b7280 !important;
  opacity: 0.5;
}

.dp__overlay_cell_disabled:hover {
  background-color: transparent !important;
  color: #6b7280 !important;
  cursor: not-allowed;
}

.dp__theme_light {
  --dp-background-color: #15090e80;
  --dp-text-color: #fff;
  --dp-hover-color: #f3f3f3;
  --dp-hover-text-color: #212121;
  --dp-hover-icon-color: #959595;
  --dp-primary-color: #ff3344;
  --dp-primary-disabled-color: #c21b3a;
  --dp-primary-text-color: #f8f5f5;
  --dp-secondary-color: #c0c4cc;
  --dp-border-color: #3b1c23;
  --dp-menu-border-color: #3b1c23;
  --dp-border-color-hover: #3b1c23;
  --dp-border-color-focus: #3b1c23;
  --dp-disabled-color: #f6f6f6;
  --dp-scroll-bar-background: #f3f3f3;
  --dp-scroll-bar-color: #959595;
  --dp-success-color: #76d275;
  --dp-success-color-disabled: #a3d9b1;
  --dp-icon-color: #959595;
  --dp-danger-color: #ff6f60;
  --dp-marker-color: #ff6f60;
  --dp-tooltip-color: #fafafa;
  --dp-disabled-color-text: #8e8e8e;
  --dp-highlight-color: rgb(255 51 68 / 10%);
  --dp-range-between-dates-background-color: var(--dp-hover-color, #f3f3f3);
  --dp-range-between-dates-text-color: var(--dp-hover-text-color, #212121);
  --dp-range-between-border-color: var(--dp-hover-color, #f3f3f3);
}

input[type="text"]:focus {
  outline: none !important;
}
</style>
