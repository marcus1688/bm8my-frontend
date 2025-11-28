<template>
  <div class="w-full">
    <button
      @click="triggerTelegramLogin"
      class="relative w-full h-11 bg-[#0088cc] border-0 rounded-lg flex items-center justify-center gap-2 text-sm font-medium text-white lg:hover:bg-[#0077b3] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="white">
        <path
          d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.68c.223-.198-.054-.308-.346-.11l-6.4 4.03-2.76-.918c-.6-.187-.612-.6.125-.89l10.782-4.156c.5-.18.943.11.78.89z"
        />
      </svg>
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  referralCode: {
    type: String,
    default: "",
  },
  referralFromUrl: {
    type: String,
    default: "",
  },
});

const { post } = useApiEndpoint();
const router = useRouter();
const localePath = useLocalePath();
const pageLoading = useState("pageLoading");
const { showAlert, alertVisible } = useAlert();

const getBotId = () => {
  if (!process.client) return "8563523697";
  const hostname = window.location.hostname;
  if (hostname.includes("bm8my.com")) {
    return "8444676449";
  }
  return "8563523697";
};

const botId = getBotId();

const handleTelegramAuth = async (user) => {
  pageLoading.value = true;
  try {
    const { data } = await post("telegram-login", {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      photo_url: user.photo_url,
      auth_date: user.auth_date,
      hash: user.hash,
      referralCode: props.referralCode,
      bot_id: botId,
    });
    if (data.success) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("gametoken", data.newGameToken);
      showAlert(
        $t("success"),
        data.message[$locale.value] || $t("login_successful"),
        "success"
      );
      setTimeout(() => {
        alertVisible.value = false;
        router.push(localePath("/"));
      }, 800);
    } else {
      showAlert(
        data.status === "inactive" ? $t("warning") : $t("info"),
        data.message[$locale.value] || $t("login_failed"),
        data.status === "inactive" ? "warning" : "info"
      );
    }
  } catch (error) {
    console.error("Telegram 登录错误:", error);
    showAlert(
      $t("error"),
      error?.response?.data?.message?.en || $t("network_error"),
      "error"
    );
  } finally {
    pageLoading.value = false;
  }
};

const triggerTelegramLogin = () => {
  if (!window.Telegram?.Login) {
    console.error("Telegram Widget not loaded");
    showAlert($t("error"), "Telegram widget not loaded", "error");
    return;
  }
  window.Telegram.Login.auth(
    {
      bot_id: botId,
      request_access: true,
    },
    (data) => {
      if (!data) {
        console.log("Telegram authorization failed or cancelled");
        return;
      }
      handleTelegramAuth(data);
    }
  );
};

onMounted(() => {
  const script = document.createElement("script");
  script.src = "https://telegram.org/js/telegram-widget.js?22";
  script.async = true;
  script.onload = () => {
    console.log("✅ Telegram Widget loaded");
  };
  script.onerror = () => {
    console.error("❌ Failed to load Telegram Widget");
  };
  document.head.appendChild(script);
});
</script>
