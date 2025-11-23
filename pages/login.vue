<template>
  <ClientOnly>
    <Alerts
      :title="alertTitle"
      :message="alertMessage"
      :isVisible="alertVisible"
      :type="alertType"
      @close="alertVisible = false"
    />
    <div
      class="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#1A0D13] to-[#241017] p-4 relative overflow-hidden"
    >
      <!-- Optimized Background Effects -->
      <div class="absolute inset-0 overflow-hidden">
        <!-- Efficient particles with CSS variables for performance -->
        <div class="absolute inset-0">
          <div
            v-for="i in 8"
            :key="i"
            class="particle absolute rounded-full"
            :class="`particle-${i}`"
          ></div>
        </div>

        <!-- Floating cards in background (using pseudo-elements for better performance) -->
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

      <!-- Login Container with back button -->
      <div class="w-full max-w-sm relative z-10">
        <!-- Logo with animation -->
        <div class="text-center mb-3">
          <div class="inline-block p-0.5">
            <img :src="generalSetting.logoimage" alt="BM8" class="w-36" />
          </div>
        </div>

        <div
          class="bg-[#241017]/60 rounded-xl overflow-hidden border border-[#3b1c23] shadow-lg transition-all duration-300 card-reveal"
        >
          <div
            class="p-0.5 bg-gradient-to-b from-[#ff3344]/50 via-transparent to-transparent"
          >
            <!-- Header -->
            <div class="pt-4 px-6 flex justify-between items-center">
              <h1 class="text-white font-bold relative">
                <span class="text_1 bg-clip-text">{{ $t("login") }}</span>
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

            <!-- Form Content -->
            <div class="p-6">
              <form @submit.prevent="handleLogin" class="space-y-5">
                <!-- Username Field -->
                <div class="space-y-1">
                  <div class="relative text_3">
                    <input
                      type="text"
                      v-model="username"
                      :placeholder="$t('username')"
                      class="w-full h-11 px-8 pl-10 bg-[#15090e]/50 border-0 rounded-lg text-white focus:outline-none placeholder:text-[#b37a7a]"
                    />
                    <div
                      class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#b37a7a]"
                    >
                      <i class="bi bi-person-fill"></i>
                    </div>
                  </div>
                </div>

                <!-- Password Field -->
                <div class="space-y-1">
                  <div class="relative text_3">
                    <input
                      :type="passwordVisible ? 'text' : 'password'"
                      v-model="password"
                      :placeholder="$t('password')"
                      class="w-full h-11 px-8 pl-10 bg-[#15090e]/50 border-0 rounded-lg text-white focus:outline-none placeholder:text-[#b37a7a]"
                    />
                    <div
                      class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#b37a7a]"
                    >
                      <i class="bi bi-lock-fill"></i>
                    </div>
                    <button
                      type="button"
                      @click="togglePasswordVisibility()"
                      class="absolute inset-y-0 right-0 pr-3 flex items-center text-[#b37a7a]"
                    >
                      <i
                        :class="
                          passwordVisible ? 'bi bi-eye-slash' : 'bi bi-eye'
                        "
                      ></i>
                    </button>
                  </div>
                </div>

                <!-- Remember Me Option -->
                <div
                  class="flex justify-between items-center max-[314px]:flex-col max-[314px]:items-start max-[314px]:gap-4"
                >
                  <div class="flex items-center">
                    <label
                      class="relative inline-flex items-center cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        v-model="rememberMe"
                        class="sr-only peer"
                      />
                      <div
                        class="w-10 h-5 bg-[#15090e]/70 rounded-full peer peer-checked:bg-[#a1122d] relative after:content-[''] after:absolute after:top-[2px] after:left-[1px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all after:duration-300 after:shadow-md peer-checked:after:transform peer-checked:after:translate-x-[22px] peer-focus:ring-2 peer-focus:ring-[#ff3344]/50"
                      ></div>
                      <span
                        class="ml-3 text-[#f0eaea] text-sm font-medium select-none transition-colors lg:group-hover:text-white"
                        >{{ $t("remember_me") }}</span
                      >
                    </label>
                  </div>
                  <button
                    @click="handleForgotPassword"
                    type="button"
                    class="text-sm text-[#ff3344] transition-colors font-medium"
                  >
                    {{ $t("forgot_password") }}
                  </button>
                </div>

                <LoadingButton
                  :loading="loginButtonLoading"
                  type="submit"
                  class="w-full h-11 text_4 bg-gradient-to-r from-[#a1122d] to-[#c21b3a] text-white font-medium rounded-lg relative overflow-hidden"
                >
                  <span class="flex items-center justify-center uppercase">
                    <span>{{ $t("login") }}</span>
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
                <GoogleSignIn />
                <TelegramSignIn />
              </div>

              <div
                class="mt-4 max-[314px]:!mt-0 border-t text_3 border-[#3b1c23]"
              >
                <div class="mt-4 text-center">
                  <NuxtLinkLocale
                    to="/register"
                    class="inline-block py-2.5 px-5 bg-[#241017]/30 lg:hover:bg-[#241017]/50 text-[#f0eaea] font-medium rounded-lg transition-colors border border-[#3b1c23] pulse-on-hover"
                  >
                    {{ $t("sign_up_bonus") }}
                  </NuxtLinkLocale>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup>
import { useRouter } from "vue-router";

const generalSetting = useState("generalSetting");
const loginButtonLoading = ref(false);
const localePath = useLocalePath();
const router = useRouter();
const username = ref("");
const password = ref("");
const alertVisible = ref(false);
const alertTitle = ref("");
const alertMessage = ref("");
const alertType = ref("");
const rememberMe = ref(false);
const passwordVisible = ref(false);
const showPassword = computed(() => passwordVisible.value);

const formatPhoneNumber = (phoneNumber) => {
  let formattedNumber = phoneNumber.replace(/\s+/g, "");
  if (formattedNumber.startsWith("+6")) {
    return formattedNumber.substring(1);
  } else if (formattedNumber.startsWith("6")) {
    return formattedNumber;
  } else if (formattedNumber.startsWith("0")) {
    return "6" + formattedNumber;
  } else {
    return "6" + formattedNumber;
  }
};

const handleForgotPassword = () => {
  alertTitle.value = $t("forgot_password");
  alertMessage.value = $t("please_contact_cs_for_password_reset");
  alertType.value = "warning";
  alertVisible.value = true;
};

const handleLogin = async () => {
  if (!username.value || !password.value) {
    alertTitle.value = $t("error");
    alertMessage.value = $t("required_fields_error");
    alertType.value = "error";
    alertVisible.value = true;
    return;
  }
  loginButtonLoading.value = true;
  try {
    const { post } = useApiEndpoint();
    const { data } = await post("login", {
      username: username.value,
      password: password.value,
      rememberMe: rememberMe.value,
    });
    if (data.success) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("gametoken", data.newGameToken);

      if (rememberMe.value) {
        localStorage.setItem("rememberedUsername", username.value);
      } else {
        localStorage.removeItem("rememberedUsername");
      }
      alertTitle.value = $t("success");
      alertMessage.value =
        data.message[$locale.value] || $t("login_successful");
      alertType.value = "success";
      alertVisible.value = true;
      setTimeout(() => {
        router.push(localePath("/"));
      }, 1000);
    } else {
      alertTitle.value =
        data.status === "inactive" ? $t("warning") : $t("info");
      alertMessage.value = data.message[$locale.value] || $t("login_failed");
      alertType.value = data.status === "inactive" ? "warning" : "info";
      alertVisible.value = true;
    }
  } catch (error) {
    console.error("Login error:", error);
    alertTitle.value = $t("error");
    alertMessage.value =
      error.response?.data?.message?.en || $t("network_error");
    alertType.value = "error";
    alertVisible.value = true;
  } finally {
    loginButtonLoading.value = false;
  }
};

const forgotPassword = () => {
  alertTitle.value = $t("info");
  alertMessage.value = $t("forgot_password_message");
  alertType.value = "info";
  alertVisible.value = true;
};

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

useHead({
  title: "BM8 | Login Access Your Gaming Account - Malaysia Online Casino",
  meta: [
    {
      property: "og:title",
      content: "BM8 Member Login | Secure Access to Premium Gaming",
    },
    {
      name: "description",
      content:
        "Login to your BM8 account to access premium slot games, live casino, sports betting, exclusive promotions, and secure gaming experience in Malaysia's top online casino platform.",
    },
    {
      name: "keywords",
      content:
        "BM8 login, member access, online casino login, gaming account Malaysia, secure login, casino member portal, BM8 account, Malaysia gaming login, online betting access",
    },
  ],
  htmlAttrs: {
    lang: "en",
  },
  link: [
    {
      rel: "canonical",
      href: "https://www.bm8my.vip/login",
    },
    {
      rel: "alternate",
      hreflang: "x-default",
      href: "https://www.bm8my.vip/login",
    },
    {
      rel: "alternate",
      hreflang: "en",
      href: "https://www.bm8my.vip/login",
    },
  ],
});

onMounted(() => {
  const savedUsername = localStorage.getItem("rememberedUsername");
  if (savedUsername) {
    username.value = savedUsername;
    rememberMe.value = true;
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

.glow-text {
  position: relative;
  z-index: 1;
}

.glow-text::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle,
    rgba(255, 51, 68, 0.3) 0%,
    rgba(255, 51, 68, 0) 70%
  );
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.glow-text:lg:hover::after {
  opacity: 1;
}

.pulse-on-hover {
  transition: all 0.3s ease;
}

.pulse-on-lg:hover:lg:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 51, 68, 0.4);
}
</style>
