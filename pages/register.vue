<template>
  <ClientOnly>
    <div
      class="bg-gradient-to-r from-[#a1122d] via-[#c21b3a] to-[#a1122d] text-white text-center py-2 shadow-lg hidden"
    >
      <div class="flex items-center justify-center gap-2 animate-pulse">
        <span>🎁</span>
        <span class="text-sm font-bold max-[640px]:text-xs">{{
          $t("luckyspin_register_title")
        }}</span>
      </div>
    </div>
    <div
      class="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#1A0D13] to-[#241017] p-4 relative overflow-hidden"
    >
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute inset-0">
          <div
            v-for="i in 8"
            :key="i"
            class="particle absolute rounded-full"
            :class="`particle-${i}`"
          ></div>
        </div>

        <div
          class="absolute left-[5%] top-[15%] w-8 h-10 card-float-slow opacity-10"
        >
          <div
            class="absolute inset-0 bg-white rounded-md before:content-['♠'] before:absolute before:inset-0 before:flex before:items-center before:justify-center before:text-black before:text-xl"
          ></div>
        </div>
        <div
          class="absolute right-[10%] bottom-[25%] w-8 h-10 card-float-medium opacity-10"
        >
          <div
            class="absolute inset-0 bg-white rounded-md before:content-['♦'] before:absolute before:inset-0 before:flex before:items-center before:justify-center before:text-red-500 before:text-xl"
          ></div>
        </div>
      </div>

      <div class="w-full max-w-sm relative">
        <div class="text-center mb-3">
          <div class="inline-block p-0.5">
            <img :src="generalSetting.logoimage" alt="BM8" class="w-36" />
          </div>
        </div>

        <div
          class="bg-[#241017]/60 rounded-xl overflow-hidden border border-[#3b1c23] shadow-lg lg:hover:shadow-[#ff3344]/20 transition-all duration-300 card-reveal"
        >
          <div
            class="p-0.5 bg-gradient-to-b from-[#ff3344]/50 via-transparent to-transparent z-10"
          >
            <div class="pt-4 px-6 flex justify-between items-center">
              <h1 class="text-white font-bold relative">
                <span class="bg-clip-text text_1">{{ $t("register") }}</span>
                <span
                  class="absolute -bottom-1 left-0 w-full h-0.5 bg-[#ff3344] title-line-reveal"
                ></span>
              </h1>
              <NuxtLinkLocale
                to="/"
                class="text_2 flex items-center text-[#ff3344] lg:hover:text-white transition-colors text-sm"
              >
                <i class="bi bi-arrow-left mr-2"></i>
                <span>{{ $t("back") }}</span>
              </NuxtLinkLocale>
            </div>

            <div class="p-6">
              <form @submit.prevent="registerUser" class="space-y-4">
                <div>
                  <div class="relative text_3">
                    <input
                      type="text"
                      v-model="form.username"
                      :placeholder="$t('username')"
                      class="w-full h-11 px-8 pl-10 bg-[#15090e]/50 border-0 rounded-lg text-white focus:outline-none placeholder:text-[#b37a7a]"
                      required
                    />
                    <div
                      class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#b37a7a]"
                    >
                      <i class="bi bi-person-fill"></i>
                    </div>
                  </div>
                </div>
                <div>
                  <div class="relative text_3">
                    <input
                      :type="passwordVisible ? 'text' : 'password'"
                      v-model="form.password"
                      :placeholder="$t('password')"
                      class="w-full h-11 px-8 pl-10 bg-[#15090e]/50 border-0 rounded-lg text-white focus:outline-none placeholder:text-[#b37a7a]"
                      required
                    />
                    <div
                      class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#b37a7a]"
                    >
                      <i class="bi bi-lock-fill"></i>
                    </div>
                    <button
                      type="button"
                      @click="togglePasswordVisibility('password')"
                      class="absolute inset-y-0 right-0 pr-3 flex items-center text-[#b37a7a]"
                    >
                      <Icon
                        :icon="passwordVisible ? 'mdi:eye-off' : 'mdi:eye'"
                      />
                    </button>
                  </div>
                </div>
                <div>
                  <div class="relative text_3">
                    <input
                      type="text"
                      v-model="form.fullname"
                      :placeholder="$t('fullname')"
                      class="w-full h-11 px-8 pl-10 bg-[#15090e]/50 border-0 rounded-lg text-white focus:outline-none placeholder:text-[#b37a7a]"
                      required
                    />
                    <div
                      class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#b37a7a]"
                    >
                      <i class="bi bi-person-fill"></i>
                    </div>
                  </div>
                </div>
                <div class="hidden">
                  <div class="relative text_3">
                    <VueDatePicker
                      v-model="form.dob"
                      :placeholder="$t('date_of_birth')"
                      :enable-time-picker="false"
                      :max-date="maxDate"
                      :min-date="minDate"
                      :format="format"
                      :year-range="[1900, new Date().getFullYear() - 18]"
                      :flow="['year', 'calendar']"
                      :teleport="true"
                      :ui="{
                        input:
                          ' !w-full !h-11 !px-8 !pl-10 !border-none !rounded-lg !text-white!focus:outline-none',
                      }"
                    ></VueDatePicker>
                  </div>
                </div>
                <div>
                  <div class="relative text_3">
                    <input
                      type="text"
                      v-model="form.mobileNumber"
                      :placeholder="$t('mobile_number')"
                      class="w-full h-11 px-8 pl-10 bg-[#15090e]/50 border-0 rounded-lg text-white focus:outline-none placeholder:text-[#b37a7a]"
                      :disabled="form.isPhoneVerified"
                      required
                    />
                    <div
                      class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#b37a7a]"
                    >
                      <i class="bi bi-phone-fill"></i>
                    </div>
                  </div>
                  <div
                    v-if="form.isPhoneVerified"
                    class="text-green-500 text-sm mt-1"
                  >
                    {{ $t("phone_number_verified") }}
                  </div>
                </div>

                <div v-if="smsStatus" class="rounded-md">
                  <div>
                    <div
                      v-if="!form.isPhoneVerified"
                      class="grid grid-cols-3 gap-2"
                    >
                      <div class="col-span-2">
                        <input
                          :disabled="form.isPhoneVerified"
                          v-model="otpCode"
                          type="text"
                          :placeholder="$t('verification_code')"
                          class="w-full h-11 pl-4 text-sm bg-[#15090e]/50 border-0 rounded text-white focus:outline-none placeholder:text-[#b37a7a]"
                          maxlength="6"
                        />
                      </div>
                      <div class="col-span-1">
                        <LoadingButton
                          type="button"
                          :loading="sendOtpButtonLoading"
                          :disabled="!canSendOtp"
                          @click="handleSendOtp"
                          class="w-full h-full px-2 py-2 bg-[#a1122d] rounded text-white text-sm whitespace-nowrap"
                        >
                          {{
                            !canSendOtp
                              ? countdown
                              : isOtpSent
                              ? $t("resend_code")
                              : $t("get_code")
                          }}
                        </LoadingButton>
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="showOtpInput && !form.isPhoneVerified"
                    class="flex items-center gap-2 mt-2"
                  >
                    <LoadingButton
                      type="button"
                      :loading="verifyOtpButtonLoading"
                      @click="handleVerifyOtp"
                      class="px-4 py-1 bg-green-600 text-white rounded"
                    >
                      {{ $t("verify") }}
                    </LoadingButton>
                  </div>
                </div>
                <div>
                  <div class="relative text_3">
                    <input
                      type="text"
                      v-model="form.referralCode"
                      :placeholder="$t(`referrer_optional`)"
                      class="w-full h-11 px-8 pl-10 bg-[#15090e]/50 border-0 rounded-lg text-white focus:outline-none placeholder:text-[#b37a7a]"
                      :readonly="props.referralId !== null"
                      :disabled="isReferralCodeFromProps"
                    />
                    <div
                      class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#b37a7a]"
                    >
                      <i class="bi bi-link-45deg"></i>
                    </div>
                  </div>
                </div>

                <!-- Terms and Conditions -->
                <div>
                  <label
                    class="flex items-center text-[#f0eaea] text_2 cursor-pointer"
                  >
                    <div class="relative flex items-center mr-2">
                      <input
                        type="checkbox"
                        v-model="acceptTerms"
                        class="sr-only"
                        required
                      />
                      <div
                        class="w-5 h-5 bg-[#15090e]/70 rounded flex items-center justify-center transition-colors duration-200"
                        :class="{
                          'bg-[#a1122d]/50 border-[#ff3344]': acceptTerms,
                        }"
                      >
                        <i
                          class="bi bi-check-lg text-white transform transition-transform duration-200"
                          :class="acceptTerms ? 'scale-100' : 'scale-0'"
                        ></i>
                      </div>
                    </div>
                    <span>
                      {{ $t("accept_terms") }}
                      <NuxtLinkLocale
                        to="/termscondition"
                        class="text-[#ff3344] underline"
                        >{{ $t("terms_of_service") }}</NuxtLinkLocale
                      >
                    </span>
                  </label>
                </div>
                <LoadingButton
                  :loading="registerButtonLoading"
                  type="submit"
                  :disabled="registerButtonLoading"
                  class="w-full h-11 text_4 bg-gradient-to-r from-[#a1122d] to-[#c21b3a] text-white font-medium rounded-lg relative overflow-hidden"
                >
                  <span class="flex items-center justify-center">
                    <span>{{ $t("register") }}</span>
                  </span>
                </LoadingButton>
              </form>
              <div class="relative my-4">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-[#3b1c23]"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                  <span class="px-2 bg-[#241017]/60 text-[#b37a7a]">
                    {{ $t("or") }}
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-x-2 justify-items-center">
                <GoogleSignIn
                  :referral-code="form.referralCode || referralFromUrl || ''"
                />
                <TelegramSignIn
                  :referral-code="form.referralCode || referralFromUrl || ''"
                />
              </div>

              <div
                class="pt-2 text_3 text-[#f0eaea] mt-4 max-[314px]:!mt-0 text-center border-t border-[#3b1c23]"
              >
                {{ $t("already_have_account") }}?
                <NuxtLinkLocale to="/login" class="text-[#ff3344] text-sm">
                  <span class="underline">{{ $t("login_here") }}</span>
                </NuxtLinkLocale>
              </div>

              <div id="captcha-element"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Alert Component -->
      <Alerts
        :title="alertTitle"
        :message="alertMessage"
        :isVisible="alertVisible"
        :type="alertType"
        @close="alertVisible = false"
      />
    </div>
  </ClientOnly>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const props = defineProps({
  referralId: {
    type: String,
    default: null,
  },
});

const date = ref();
const { loadCaptchaScript, initCaptcha, validateCaptcha, getCaptcha } =
  useCaptcha($locale);
const {
  isConfirmAlertVisible,
  confirmAlertTitle,
  confirmAlertMessage,
  confirmAlertType,
  showConfirmAlert,
  closeConfirmAlert,
} = useConfirmAlert();
let captcha;
const datePickerInput = ref(null);
const route = useRoute();
const referralFromUrl = ref(route.query.referral || "");
const localePath = useLocalePath();
const isUserLoggedIn = useState("isUserLoggedIn");
const generalSetting = useState("generalSetting");
const { post } = useApiEndpoint();
const router = useRouter();
const pageLoading = useState("pageLoading");
const alertVisible = ref(false);
const alertTitle = ref("");
const alertMessage = ref("");
const alertType = ref("");
const showOtpInput = ref(false);
const countdown = ref(0);
const canSendOtp = ref(true);
const otpVerificationId = ref("");
const config = useRuntimeConfig();

const verifyOtpButtonLoading = ref(false);
const sendOtpButtonLoading = ref(false);
const otpCode = ref("");
const isOtpSent = ref(false);
const smsStatus = useState("smsStatus");

const registerButtonLoading = ref(false);
const passwordVisible = ref(false);
const acceptTerms = ref(false);

const form = ref({
  username: "",
  fullname: "",
  password: "",
  dob: "",
  mobileNumber: "",
  isPhoneVerified: false,
  referralCode: referralFromUrl.value || props.referralId || "",
});

const uiOptions = ref({
  navBtnNext: "text-blue-500 lg:hover:bg-blue-100 rounded-full",
  navBtnPrev: "text-blue-500 lg:hover:bg-blue-100 rounded-full",
  calendar: "bg-slate-800 border border-slate-700 rounded-lg shadow-lg",
  calendarCell: "lg:hover:bg-blue-600 rounded-full",
  menu: "bg-slate-800 border border-slate-700 rounded-lg shadow-lg",
  input:
    "w-full h-11 px-8 pl-10 bg-slate-800/50 border-0 rounded-lg text-white focus:outline-none placeholder:text-slate-400",
});

const formatPhoneNumber = (phoneNumber) => {
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

const togglePasswordVisibility = (field) => {
  if (field === "password") {
    passwordVisible.value = !passwordVisible.value;
  }
};

const handleVerifyOtp = async () => {
  if (!otpCode.value) return;
  verifyOtpButtonLoading.value = true;
  try {
    const fullPhoneNumber = formatPhoneNumber(form.value.mobileNumber);
    const { data } = await post("verify-otp", {
      phoneNumber: fullPhoneNumber,
      code: otpCode.value,
      verificationId: otpVerificationId.value,
    });

    if (data.success && data.valid) {
      form.value.isPhoneVerified = true;
      alertTitle.value = $t("success");
      alertMessage.value = data.message[$locale.value] || data.message.en;
      alertType.value = "success";
      alertVisible.value = true;
    } else {
      alertTitle.value = $t("info");
      alertMessage.value = data.message[$locale.value] || data.message.en;
      alertType.value = "info";
      alertVisible.value = true;
      otpCode.value = "";
    }
  } catch (error) {
    console.error("Verify OTP error:", error);
    alertTitle.value = $t("error");
    alertMessage.value =
      error.response?.data?.message?.[$locale.value] ||
      error.response?.data?.message?.en ||
      $t("network_error");
    alertType.value = "error";
    alertVisible.value = true;
    otpCode.value = "";
  } finally {
    verifyOtpButtonLoading.value = false;
  }
};

const handleLogin = async (
  username = username.value,
  pass = password.value
) => {
  try {
    const { post } = useApiEndpoint();
    const { data } = await post("login", {
      username: username,
      password: pass,
      rememberMe: false,
    });
    if (data.success) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("gametoken", data.newGameToken);
      setTimeout(() => {
        router.push(localePath("/"));
      }, 1000);
    }
  } catch (error) {
    console.error("Login error:", error);
    alertTitle.value = $t("error");
    alertMessage.value =
      error.response?.data?.message?.en || $t("network_error");
    alertType.value = "error";
    alertVisible.value = true;
  }
};

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

const isAdult = computed(() => {
  if (!form.value.dob) return true;
  const birthDate = new Date(form.value.dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age >= 18;
});

const registerUser = async () => {
  if (
    !form.value.fullname ||
    !form.value.mobileNumber ||
    !form.value.password
  ) {
    alertTitle.value = $t("error");
    alertMessage.value = $t("fill_required_fields");
    alertType.value = "error";
    alertVisible.value = true;
    return;
  }

  if (!/^\d+$/.test(form.value.mobileNumber)) {
    alertTitle.value = $t("error");
    alertMessage.value = $t("phone_number_digits_only");
    alertType.value = "error";
    alertVisible.value = true;
    return;
  }

  if (smsStatus.value && !form.value.isPhoneVerified) {
    alertTitle.value = $t("error");
    alertMessage.value = $t("verify_phone_number");
    alertType.value = "error";
    alertVisible.value = true;
    return;
  }

  if (form.value.dob) {
    const birthDate = new Date(form.value.dob);
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
      await Swal.fire({
        icon: "info",
        title: $t("info"),
        text: $t("must_be_18_years_or_older"),
      });
      registerButtonLoading.value = false;
      return;
    }
  }

  registerButtonLoading.value = true;
  try {
    const formattedDob = form.value.dob
      ? new Date(form.value.dob).toLocaleDateString("en-GB")
      : "";
    // const fullPhoneNumber = formatPhoneNumber(form.value.mobileNumber);
    const completeUserInfo = {
      username: form.value.username,
      fullname: form.value.fullname.toUpperCase(),
      password: form.value.password,
      dob: formattedDob,
      phonenumber: formatPhoneNumber(form.value.mobileNumber),
      referralCode: form.value.referralCode,
      isPhoneVerified: form.value.isPhoneVerified,
    };

    const { data } = await post("register", completeUserInfo);
    if (data.success) {
      if (
        (referralFromUrl.value === "51f645b1" ||
          referralFromUrl.value === "ad440661" ||
          referralFromUrl.value === "156ef7b3") &&
        typeof window !== "undefined" &&
        typeof fbq !== "undefined"
      ) {
        fbq("track", "CompleteRegistration");
      }
      alertTitle.value = $t("success");
      alertMessage.value = data.message[$locale.value] || data.message.en;
      alertType.value = "success";
      alertVisible.value = true;
      await handleLogin(form.value.username, form.value.password);
    } else {
      alertTitle.value = $t("info");
      alertMessage.value = data.message[$locale.value] || data.message.en;
      alertType.value = "info";
      alertVisible.value = true;
    }
  } catch (error) {
    console.error("Registration error:", error);
    alertTitle.value = $t("error");
    alertMessage.value =
      error.response?.data?.message?.[$locale.value] ||
      error.response?.data?.message?.en ||
      $t("network_error");
    alertType.value = "error";
    alertVisible.value = true;
  } finally {
    registerButtonLoading.value = false;
  }
};

const startCountdown = () => {
  const timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      canSendOtp.value = true;
      isOtpSent.value = false;
      clearInterval(timer);
    }
  }, 1000);
};

function getInstance(instance) {
  captcha = instance;
}

const handleSendOtp = async () => {
  if (!form.value.mobileNumber.trim()) {
    alertTitle.value = $t("error");
    alertMessage.value = $t("enter_mobile_number");
    alertType.value = "error";
    alertVisible.value = true;
    return;
  }
  if (!canSendOtp.value) {
    alertTitle.value = $t("error");
    alertMessage.value = $t("max_sms_attempts");
    alertType.value = "error";
    alertVisible.value = true;
    return;
  }

  const confirmed = await showConfirmAlert(
    $t("confirm_otp"),
    $t("otp_confirmation_message") + ` ${form.value.mobileNumber}?`,
    "warning"
  );

  if (!confirmed) {
    return;
  }

  const captchaInstance = getCaptcha();
  if (captchaInstance) {
    captchaInstance.show();
  } else {
    initCaptcha(captchaVerifyCallback);
  }
};

async function captchaVerifyCallback(captchaVerifyParam) {
  sendOtpButtonLoading.value = true;
  try {
    const aliyunResponse = await validateCaptcha(captchaVerifyParam);
    if (!aliyunResponse.success || !aliyunResponse.verifyResult) {
      return { captchaResult: false };
    }
    const { data } = await post("send-otp", {
      phoneNumber: formatPhoneNumber(form.value.mobileNumber),
      channel: "sms",
      captchaVerifyParam: captchaVerifyParam,
    });
    setTimeout(() => {
      if (data.success) {
        otpVerificationId.value = data.verificationId;
        isOtpSent.value = true;
        canSendOtp.value = false;
        showOtpInput.value = true;
        countdown.value = 60;
        startCountdown();
        alertTitle.value = $t("success");
        alertMessage.value = data.message[$locale.value] || data.message.en;
        alertType.value = "success";
        alertVisible.value = true;
      } else {
        alertTitle.value = $t("info");
        alertMessage.value = data.message[$locale.value] || data.message.en;
        alertType.value = "info";
        alertVisible.value = true;
      }
    }, 2000);
    return { captchaResult: true };
  } catch (error) {
    console.error("Send OTP error:", error);
    setTimeout(() => {
      alertTitle.value = $t("error");
      alertMessage.value =
        error.response?.data?.message?.[$locale.value] ||
        error.response?.data?.message?.en ||
        $t("network_error");
      alertType.value = "error";
      alertVisible.value = true;
    }, 2000);
    return { captchaResult: false };
  } finally {
    setTimeout(() => {
      sendOtpButtonLoading.value = false;
    }, 2000);
  }
}

const isReferralCodeFromProps = computed(() => {
  return props.referralId !== null || !!referralFromUrl.value;
});

const headConfig = computed(() => {
  if (referralFromUrl.value === "51f645b1") {
    return {
      script: [
        {
          innerHTML: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '698797049691443');
            fbq('track', 'PageView');
          `,
          type: "text/javascript",
        },
      ],
      noscript: [
        {
          innerHTML: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=698797049691443&ev=PageView&noscript=1" />`,
        },
      ],
    };
  } else if (referralFromUrl.value === "ad440661") {
    return {
      script: [
        {
          innerHTML: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '773819668498967');
            fbq('track', 'PageView');
          `,
          type: "text/javascript",
        },
      ],
      noscript: [
        {
          innerHTML: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=773819668498967&ev=PageView&noscript=1" />`,
        },
      ],
    };
  } else if (referralFromUrl.value === "156ef7b3") {
    return {
      script: [
        {
          innerHTML: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '4057062577890915');
            fbq('track', 'PageView');
          `,
          type: "text/javascript",
        },
      ],
      noscript: [
        {
          innerHTML: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=4057062577890915&ev=PageView&noscript=1" />`,
        },
      ],
    };
  }
  return {};
});

useHead(headConfig);

useHead({
  title: "BM8 | Register Free Account & Get Welcome Bonus - Malaysia Casino",
  meta: [
    {
      property: "og:title",
      content: "BM8 | Join Malaysia's Premier Gaming Platform Today",
    },
    {
      name: "description",
      content:
        "Register your free BM8 account now and unlock exclusive welcome bonuses, premium slot games, live casino, sports betting, and instant withdrawals. Join Malaysia's most trusted online gaming platform today.",
    },
    {
      name: "keywords",
      content:
        "BM8 register, free casino account, welcome bonus Malaysia, sign up BM8, new member bonus, casino registration, Malaysia gaming signup, online casino join, free account bonus, BM8 membership",
    },
  ],
  htmlAttrs: {
    lang: "en",
  },
  link: [
    {
      rel: "canonical",
      href: "https://www.bm8my.vip/register",
    },
    {
      rel: "alternate",
      hreflang: "x-default",
      href: "https://www.bm8my.vip/register",
    },
    {
      rel: "alternate",
      hreflang: "en",
      href: "https://www.bm8my.vip/register",
    },
  ],
});

useAsyncData(async () => {
  if (isUserLoggedIn.value) {
    router.push(localePath("/"));
  }
});

onMounted(() => {
  loadCaptchaScript();
  const scriptLoadCheck = setInterval(() => {
    if (window.initAliyunCaptcha) {
      clearInterval(scriptLoadCheck);
      initCaptcha(captchaVerifyCallback);
    }
  }, 100);

  if (props.referralId || referralFromUrl.value) {
    const referralCode = props.referralId || referralFromUrl.value;
    form.value.referralCode = referralCode;
    localStorage.setItem("referralCode", referralCode);
  } else {
    const savedReferralCode = localStorage.getItem("referralCode");
    if (savedReferralCode) {
      form.value.referralCode = savedReferralCode;
    }
  }
});
</script>
<style scoped>
.particle {
  width: 4px;
  height: 4px;
  opacity: 0.6;
}

.particle-1 {
  left: 10%;
  top: 10%;
  background-color: rgba(255, 51, 68, 0.6);
  animation: particle-float 15s ease-in-out infinite;
}

.particle-2 {
  left: 20%;
  top: 80%;
  background-color: rgba(255, 255, 255, 0.6);
  animation: particle-float 18s ease-in-out infinite;
  animation-delay: 1s;
}

.particle-3 {
  left: 35%;
  top: 30%;
  background-color: rgba(255, 51, 68, 0.6);
  animation: particle-float 20s ease-in-out infinite;
  animation-delay: 2s;
}

.particle-4 {
  left: 50%;
  top: 70%;
  background-color: rgba(255, 255, 255, 0.6);
  animation: particle-float 17s ease-in-out infinite;
  animation-delay: 0.5s;
}

.particle-5 {
  left: 65%;
  top: 20%;
  background-color: rgba(255, 51, 68, 0.6);
  animation: particle-float 19s ease-in-out infinite;
  animation-delay: 1.5s;
}

.particle-6 {
  left: 80%;
  top: 60%;
  background-color: rgba(255, 255, 255, 0.6);
  animation: particle-float 16s ease-in-out infinite;
  animation-delay: 0.8s;
}

.particle-7 {
  left: 90%;
  top: 40%;
  background-color: rgba(255, 51, 68, 0.6);
  animation: particle-float 21s ease-in-out infinite;
  animation-delay: 2.5s;
}

.particle-8 {
  left: 15%;
  top: 50%;
  background-color: rgba(255, 255, 255, 0.6);
  animation: particle-float 14s ease-in-out infinite;
  animation-delay: 1.2s;
}

@keyframes particle-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-50px) translateX(10px);
  }
}

@keyframes card-float-slow {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-30px) rotate(10deg);
  }
}

@keyframes card-float-medium {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(-5deg);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes title-line-reveal {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

@keyframes card-reveal {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-float-slow {
  animation: card-float-slow 20s ease-in-out infinite;
}

.card-float-medium {
  animation: card-float-medium 15s ease-in-out infinite;
  animation-delay: 1s;
}

.fade-in {
  animation: fade-in 0.8s ease forwards;
}

.card-reveal {
  animation: card-reveal 0.8s ease-out forwards;
}

.title-line-reveal {
  transform-origin: left;
  animation: title-line-reveal 0.8s ease forwards;
  animation-delay: 0.3s;
}

input[type="date"] {
  color-scheme: dark;
}

@media (max-width: 640px) {
  .pt-5 {
    padding-top: 1rem;
  }

  .p-6 {
    padding: 1.25rem;
  }

  .space-y-4 > * + * {
    margin-top: 0.75rem;
  }
}

@media (max-width: 370px) {
  .particle {
    display: none;
  }

  .p-6 {
    padding: 1rem;
  }

  .space-y-4 > * + * {
    margin-top: 0.5rem;
  }

  .h-11 {
    height: 2.5rem;
  }

  .mt-5 {
    margin-top: 1rem;
  }

  .pt-4 {
    padding-top: 0.75rem;
  }
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
  --dp-border-color-lg:hover: #3b1c23;
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

.dp__overlay_cell_disabled {
  color: #6b7280 !important;
  opacity: 0.5;
}

.dp__overlay_cell_disabled:hover {
  background-color: transparent !important;
  color: #6b7280 !important;
  cursor: not-allowed;
}

:deep(.dp__input_icon) {
  color: #b37a7a !important;
}

::v-deep(.dp__input::placeholder) {
  color: #b37a7a !important;
  opacity: 0.9;
}
</style>
