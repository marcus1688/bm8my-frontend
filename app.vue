<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { useNotification } from "~/composables/useNotification";
import { useI18n } from "vue-i18n";
const i18n = useI18n();
const { get, post } = useApiEndpoint();
const generalSetting = useState("generalSetting", () => ({}));
const allKiosks = useState("allKiosks", () => []);
const liveCasinoKiosks = useState("liveCasinoKiosks", () => []);
const slotKiosks = useState("slotKiosks", () => []);
const sportsKiosks = useState("sportsKiosks", () => []);
const esportsKiosks = useState("esportsKiosks", () => []);
const fishingKiosks = useState("fishingKiosks", () => []);
const lotteryKiosks = useState("lotteryKiosks", () => []);
const fastgameKiosks = useState("fastgameKiosks", () => []);
const partners = useState("partners", () => []);
const userData = useState("userData");
const unreadCount = useState("unreadCount", () => null);
const luckySpinPointRate = useState("luckySpinPointRate", () => 0);
const { socket, connectSocketIO, cleanup } = useSocketIO();
const { showNotification } = useNotification();
const smsStatus = useState("smsStatus", () => null);
const luckyDrawStatus = useState("luckyDrawStatus", () => false);
const userGameLocks = useState("userGameLocks", () => ({}));
const carousel = useState("carousel", () => []);
const pageLoading = useState("pageLoading");
const activePopup = useState("activePopup", () => null);
const shouldShowPopup = useState("shouldShowPopup", () => false);
const checkinreminder = useState("checkinreminder", () => false);
const missionreminder = useState("missionreminder", () => false);
const vipSettings = useState("vipSettings");

if (process.client) {
  window.$t = i18n.t;
  window.$locale = i18n.locale;
}

async function fetchGeneralSetting() {
  try {
    const { data } = await get("generalsetting");
    if (data.success) {
      generalSetting.value = data.data[0];
    }
  } catch (error) {
    console.error("Error fetching information:", error);
  }
}

async function fetchLuckyDrawStatus() {
  try {
    const { data } = await get("luckydraw9grid/status");
    if (data.success) {
      luckyDrawStatus.value = data.data.isActive;
    }
  } catch (error) {
    console.error("Error fetching information:", error);
  }
}

async function fetchUnreadCount() {
  try {
    const { data } = await get("mails/unreadcount");
    if (data.success) {
      unreadCount.value = data.data.count;
    }
  } catch (error) {
    console.error("Error fetching unread count:", error);
  }
}

async function fetchLuckySpinRate() {
  try {
    const { data } = await get("getLuckySpinPointRate");
    if (data.success) {
      luckySpinPointRate.value = data.pointsPerSpin;
    }
  } catch (error) {
    console.error("Error fetching lucky spin rate:", error);
  }
}

async function fetchKiosks() {
  try {
    const { data } = await get("kiosks");
    if (data?.success) {
      const uniqueKiosksMap = new Map();
      data.data.forEach((kiosk) => {
        if (!uniqueKiosksMap.has(kiosk.name)) {
          uniqueKiosksMap.set(kiosk.name, kiosk);
        }
      });
      allKiosks.value = Array.from(uniqueKiosksMap.values());
    }
    liveCasinoKiosks.value = data.data.filter(
      (kiosk) => kiosk.categoryId?.name === "Live Casino"
    );
    slotKiosks.value = data.data.filter(
      (kiosk) => kiosk.categoryId?.name === "Slot Games"
    );
    sportsKiosks.value = data.data.filter(
      (kiosk) => kiosk.categoryId?.name === "Sports"
    );
    esportsKiosks.value = data.data.filter(
      (kiosk) => kiosk.categoryId?.name === "E-Sports"
    );
    fishingKiosks.value = data.data.filter(
      (kiosk) => kiosk.categoryId?.name === "Fishing"
    );
    lotteryKiosks.value = data.data.filter(
      (kiosk) => kiosk.categoryId?.name === "Lottery"
    );
    fastgameKiosks.value = data.data.filter(
      (kiosk) => kiosk.categoryId?.name === "Fast Games"
    );
    if (userData.value?._id) {
      await fetchUserGameLocks();
    }
  } catch (error) {
    console.error("Failed to fetch kiosks:", error);
  }
}

async function fetchSmsStatus() {
  try {
    const { data } = await get("sms-status");
    if (data.success) {
      smsStatus.value = data.status;
    }
  } catch (error) {
    console.error("Error fetching helps:", error);
  }
}

async function fetchUserGameLocks() {
  try {
    const { data } = await get("user/game-locks");
    if (data.success) {
      userGameLocks.value = data.data.gameLock || {};
    } else {
      userGameLocks.value = {};
    }
  } catch (error) {
    console.error("Error fetching game locks:", error);
    userGameLocks.value = {};
  }
}

async function fetchCarousel() {
  try {
    const { data } = await get("client/getallcarousels");
    if (data.success) {
      carousel.value = data.carousels;
    }
  } catch (error) {
    console.error("Error fetching carousels:", error);
  }
}

async function fetchCheckInReminder() {
  try {
    const { data } = await get("checkin/reminder");
    if (data.success) {
      checkinreminder.value = data.reminder;
    }
  } catch (error) {
    console.error("Error fetching carousels:", error);
  }
}

async function fetchMissionReminder() {
  try {
    const { data } = await get("missions/reminder");
    if (data.success) {
      missionreminder.value = data.reminder;
      console.log(missionreminder.value);
    }
  } catch (error) {
    console.error("Error fetching carousels:", error);
  }
}

const fetchVipSettings = async () => {
  try {
    const { data } = await get("vipsettings");
    if (data?.success) {
      vipSettings.value = data.data[0];
    }
  } catch (error) {
    console.error("Error fetching VIP settings:", error);
  }
};

const checkPopupVisibility = async () => {
  try {
    const { data } = await get("active-popup");
    if (data.success && data.data) {
      const popup = data.data;
      if (process.client && popup.image) {
        const img = new Image();
        img.src = popup.image;
      }
      const lastPopupId = localStorage.getItem("lastPopupId");
      const lastPopupTime = localStorage.getItem("lastPopupTime");
      const shouldShow = checkShouldShowPopup(
        popup._id,
        lastPopupId,
        lastPopupTime
      );
      if (shouldShow) {
        activePopup.value = popup;
        shouldShowPopup.value = true;
      }
    }
  } catch (error) {
    console.error("Error fetching popup:", error);
  }
};

const checkShouldShowPopup = (currentPopupId, lastPopupId, lastPopupTime) => {
  if (!lastPopupId || !lastPopupTime) return true;
  if (currentPopupId !== lastPopupId) return true;
  const lastTime = new Date(lastPopupTime);
  const currentTime = new Date();
  const hoursDiff = (currentTime - lastTime) / (1000 * 60 * 60);
  return hoursDiff >= 1;
};

watchEffect(() => {
  if (allKiosks.value?.length > 0) {
    partners.value = allKiosks.value.map((kiosk) => ({
      image: kiosk.logo || kiosk.icon,
    }));
  }
});

watch(
  () => userData.value?._id,
  async (newId, oldId) => {
    if (process.client && newId && newId !== oldId) {
      if (oldId && oldId !== newId) {
        cleanup();
      }
      await Promise.all([
        fetchCheckInReminder(),
        fetchMissionReminder(),
        fetchVipSettings(),
        fetchUnreadCount(),
        fetchKiosks(),
      ]);
      if (!localStorage.getItem("adminAccess")) {
        try {
          await connectSocketIO(userData.value);
          socket.value?.off("notification");
          socket.value?.on("notification", (data) => {
            const notificationTitle =
              data.title[$locale.value] || data.title.en;
            const notificationMessage =
              data.message[$locale.value] || data.message.en;
            showNotification(notificationMessage, notificationTitle);
            fetchUnreadCount();
          });

          console.log("Socket.IO connected and listener registered");
        } catch (error) {
          console.error("Error setting up Socket.IO:", error);
        }
      } else {
        console.log("Admin access - skipping Socket.IO");
      }
    }
  },
  { immediate: true }
);

const preloadAllImages = async () => {
  if (!process.client) return;
  try {
    const imagePromises = [];
    const preloadImage = (src) => {
      if (!src) return Promise.resolve();
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = src;
      });
    };
    const bannerImages = import.meta.glob(
      "/public/images/banner/*.{png,jpg,jpeg,gif,webp}",
      {
        eager: true,
        query: "?url",
        import: "default",
      }
    );
    Object.keys(bannerImages).forEach((path) => {
      const url = path.replace("/public", "");
      imagePromises.push(preloadImage(url));
    });
    if (carousel.value?.length > 0) {
      carousel.value.forEach((item) => {
        if (item.link) imagePromises.push(preloadImage(item.link));
        if (item.link2) imagePromises.push(preloadImage(item.link2));
      });
    }
    if (activePopup.value?.image) {
      imagePromises.push(preloadImage(activePopup.value.image));
    }
    await Promise.all(imagePromises);
  } catch (error) {
    console.error("❌ 预加载图片时发生错误:", error);
  }
};

onMounted(async () => {
  pageLoading.value = true;
  try {
    await Promise.all([
      fetchGeneralSetting(),
      checkPopupVisibility(),
      fetchCarousel(),
    ]);
  } catch (error) {
    console.error("Error during critical initialization:", error);
  } finally {
    pageLoading.value = false;
  }
  Promise.all([
    fetchKiosks(),
    fetchSmsStatus(),
    fetchLuckyDrawStatus(),
    fetchLuckySpinRate(),
  ]).catch((err) => console.error("Background fetch error:", err));
  preloadAllImages().catch((err) => console.error("Image preload error:", err));
});

onUnmounted(() => {
  cleanup();
});
</script>
