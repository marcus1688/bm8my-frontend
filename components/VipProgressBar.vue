<template>
  <div>
    <NuxtLinkLocale to="/vip">
      <div
        class="w-full bg-gradient-to-r from-[#1A0D13] via-[#2a0f14] to-[#1A0D13] p-3 rounded-lg border border-[#3b1c23] lg:hover:border-[#ff3344]/50 transition-all duration-300"
      >
        <div class="mb-3 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div
              v-if="currentLevelInfo"
              class="w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
            >
              <img
                v-if="currentLevelInfo.iconUrl"
                :src="currentLevelInfo.iconUrl"
                class="w-8 h-8 drop-shadow-sm"
                :alt="$t('current_vip_icon')"
              />
            </div>
            <div class="flex flex-col">
              <span class="text-[#b37a7a] text-xs font-medium">{{
                $t("current_level")
              }}</span>
              <span
                class="text-[#f0eaea] font-bold truncate"
                :class="{ 'text-xs': shouldUseSmallerFont }"
              >
                {{ getLocalizedLevelName(userData.viplevel) }}
              </span>
            </div>
          </div>

          <div v-if="nextLevelInfo" class="flex items-center gap-2">
            <div class="flex flex-col items-end">
              <span class="text-[#b37a7a] text-xs font-medium">{{
                $t("next_level")
              }}</span>
              <span
                class="text-[#f0eaea] font-bold truncate"
                :class="{ 'text-xs': shouldUseSmallerFont }"
              >
                {{ getLocalizedLevelName(nextLevelInfo.name) }}
              </span>
            </div>
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center shadow-lg opacity-90"
            >
              <img
                v-if="nextLevelInfo.iconUrl"
                :src="nextLevelInfo.iconUrl"
                class="w-8 h-8 drop-shadow-sm"
                :alt="$t(`next_vip_icon`)"
              />
            </div>
          </div>
          <div v-else class="flex items-center"></div>
        </div>

        <div
          class="h-2.5 bg-[#241017] rounded-full relative mb-2 overflow-hidden shadow-inner border border-[#3b1c23]"
        >
          <div
            class="absolute inset-0 w-full h-full shimmer-effect opacity-20"
          ></div>
          <div
            class="h-full rounded-full absolute left-0 transition-all duration-700 ease-out"
            :style="{ width: `${progressAnimatedWidth}%` }"
            :class="
              currentLevelInfo
                ? getLevelBarClass(currentLevelInfo.name)
                : 'bg-gradient-to-r from-[#a1122d] to-[#c21b3a]'
            "
          >
            <div
              class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-glow"
            ></div>
          </div>
        </div>

        <div class="flex items-center justify-between text-xs mt-2">
          <div class="text-[#b37a7a]">
            <template v-if="nextLevelInfo">
              <span class="font-medium text-[#f0eaea]">{{
                formatNumber(userData.totaldeposit)
              }}</span>
              <template
                v-if="!isNaN(nextLevelRequirement) && nextLevelRequirement > 0"
              >
                <span class="mx-1">/</span>
                <span class="text-[#ff3344]">{{
                  formatNumber(nextLevelRequirement)
                }}</span>
              </template>
              <template v-else>
                <span class="mx-1">-</span>
                <span class="text-yellow-300 font-medium">{{
                  $t("invitation_only")
                }}</span>
              </template>
            </template>
            <template v-else>
              <span class="text-yellow-300 font-medium flex items-center gap-1">
                <i class="bi bi-check-circle-fill"></i>
                {{ $t("max_reached") }}
              </span>
            </template>
          </div>
          <div class="flex items-center gap-1.5 text-[#b37a7a]">
            <span
              class="text-[#ff3344] lg:hover:text-[#c21b3a] flex items-center gap-0.5 font-medium text-xs group transition-colors"
            >
              {{ $t("view_benefits") }}
              <i
                class="bi bi-chevron-right lg:group-hover:translate-x-0.5 transition-transform duration-300"
              ></i>
            </span>
          </div>
        </div>
      </div>
    </NuxtLinkLocale>
  </div>
</template>

<script setup>
const { get } = useApiEndpoint();
const userData = useState("userData");
const vipSettings = useState("vipSettings");

const progressAnimatedWidth = ref(0);

const fetchSettings = async () => {
  if (vipSettings.value) return;
  try {
    const { data } = await get("vipsettings");
    if (data?.success) {
      vipSettings.value = data.data[0];
    }
  } catch (error) {
    console.error("Error fetching VIP settings:", error);
  }
};

const settingsData = computed(
  () =>
    vipSettings.value || {
      tableTitle: "VIP Exclusive Benefits",
      rowHeaders: [],
      vipLevels: [],
      terms: {
        en: "",
        zh: "",
      },
    }
);

const vipLevels = computed(() => settingsData.value.vipLevels || []);

const currentLevelInfo = computed(() => {
  if (!vipLevels.value || vipLevels.value.length === 0) return null;
  return vipLevels.value.find(
    (level) => level.name === userData.value.viplevel
  );
});

const nextLevelInfo = computed(() => {
  if (!vipLevels.value || vipLevels.value.length === 0) return null;
  const currentIndex = getUserLevelIndex();
  if (currentIndex === -1 || currentIndex >= vipLevels.value.length - 1)
    return null;
  return vipLevels.value[currentIndex + 1];
});

const nextLevelRequirement = computed(() => {
  if (!nextLevelInfo.value || !nextLevelInfo.value.benefits) return 0;
  return parseFloat(nextLevelInfo.value.benefits["Total Deposit"] || 0);
});

const remainingAmount = computed(() => {
  if (!nextLevelRequirement.value) return 0;
  const remaining = nextLevelRequirement.value - userData.value.totaldeposit;
  return remaining > 0 ? remaining : 0;
});

const progressPercentage = computed(() => {
  if (!nextLevelRequirement.value || nextLevelRequirement.value === 0)
    return 100;
  if (!nextLevelInfo.value) return 100;
  const currentDeposit = userData.value.totaldeposit;
  const prevLevelRequirement =
    currentLevelInfo.value?.benefits?.["Total Deposit"] || 0;
  const rangeSize = nextLevelRequirement.value - prevLevelRequirement;
  if (rangeSize <= 0) return 100;
  const progressInRange = currentDeposit - prevLevelRequirement;
  let percentage = (progressInRange / rangeSize) * 100;
  return Math.max(Math.min(Math.max(percentage, 0), 100), 5);
});

function updateProgress() {
  progressAnimatedWidth.value = 0;
  const step = 1.5;
  const animate = () => {
    if (progressAnimatedWidth.value < progressPercentage.value) {
      progressAnimatedWidth.value = Math.min(
        progressAnimatedWidth.value + step,
        progressPercentage.value
      );
      requestAnimationFrame(animate);
    }
  };
  setTimeout(() => {
    animate();
  }, 100);
}

function getUserLevelIndex() {
  if (!vipLevels.value || vipLevels.value.length === 0) return -1;
  return vipLevels.value.findIndex(
    (level) => level.name === userData.value.viplevel
  );
}

function getLevelBarClass(levelName) {
  switch (levelName) {
    case "Bronze":
      return "bg-gradient-to-r from-amber-600 to-amber-800";
    case "Silver":
      return "bg-gradient-to-r from-gray-300 to-gray-500";
    case "Gold":
      return "bg-gradient-to-r from-yellow-400 to-yellow-600";
    case "Platinum":
      return "bg-gradient-to-r from-cyan-500 to-cyan-700";
    case "Diamond":
      return "bg-gradient-to-r from-indigo-400 to-indigo-600";
    case "BM8 ELite VIP":
      return "bg-gradient-to-r from-purple-500 to-purple-700";
    default:
      return "bg-gradient-to-r from-blue-400 to-blue-600";
  }
}

function getInnerCircleClass(levelName) {
  switch (levelName) {
    case "Bronze":
    case "Brozne":
      return "bg-gradient-to-br from-[#cd7f32] to-[#a45e24] border-2 border-[#cd7f32]/80";
    case "Silver":
      return "bg-gradient-to-br from-[#c0c0c0] to-[#a0a0a0] border-2 border-[#c0c0c0]/80";
    case "Gold":
      return "bg-gradient-to-br from-[#ffd700] to-[#daa520] border-2 border-[#ffd700]/80";
    case "Platinum":
      return "bg-gradient-to-br from-[#71c4cf] to-[#3d898f] border-2 border-[#71c4cf]/80";
    case "Diamond":
      return "bg-gradient-to-br from-[#e0e0e0] to-[#b9b9b9] border-2 border-[#e0e0e0]/80";
    case "BM8 ELite VIP":
      return "bg-gradient-to-br from-[#9370DB] to-[#800080] border-2 border-[#9370DB]/80";
    default:
      return "bg-gradient-to-br from-gray-400 to-gray-500 border-2 border-gray-400/80";
  }
}

const levelNameTranslations = {
  bronze: {
    en: "Bronze",
    zh: "青銅",
    zh_hk: "青銅",
    ms: "Gangsa",
    id: "Perunggu",
  },
  silver: {
    en: "Silver",
    zh: "白銀",
    zh_hk: "白銀",
    ms: "Perak",
    id: "Perak",
  },
  gold: {
    en: "Gold",
    zh: "黃金",
    zh_hk: "黃金",
    ms: "Emas",
    id: "Emas",
  },
  platinum: {
    en: "Platinum",
    zh: "鉑金",
    zh_hk: "鉑金",
    ms: "Platinum",
    id: "Platinum",
  },
  "bm8 elite vip": {
    en: "BM8 Elite VIP",
    zh: "BM8 尊贵贵宾",
    zh_hk: "BM8 尊贵贵宾",
    ms: "BM8 Elite VIP",
    id: "BM8 Elite VIP",
  },
  diamond: {
    en: "Diamond",
    zh: "鑽石",
    zh_hk: "鑽石",
    ms: "Berlian",
    id: "Berlian",
  },
  royal: {
    en: "Royal",
    zh: "至尊",
    zh_hk: "至尊",
    ms: "Raja",
    id: "Royal",
  },
};

const getLocalizedLevelName = (name) => {
  const lowerName = name.toLowerCase();
  return levelNameTranslations[lowerName]?.[$locale.value] || name;
};

function formatNumber(value) {
  if (!value && value !== 0) return "";
  return parseFloat(value).toLocaleString("en-US");
}

const shouldUseSmallerFont = computed(() => {
  const currentLevelName = getLocalizedLevelName(userData.value.viplevel);
  const nextLevelName = nextLevelInfo.value
    ? getLocalizedLevelName(nextLevelInfo.value.name)
    : "";
  return currentLevelName.length > 10 || nextLevelName.length > 10;
});

watch(() => userData.value?.totaldeposit, updateProgress, { immediate: true });
watch(progressPercentage, updateProgress);

onMounted(async () => {
  try {
    await fetchSettings();
    updateProgress();
  } catch (error) {
    console.error("Error during initialization:", error);
  }
});
</script>

<style scoped>
.shimmer-effect {
  background: linear-gradient(
    to right,
    transparent 0%,
    rgba(255, 51, 68, 0.2) 50%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.shadow-glow {
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(255, 51, 68, 0.4);
}
</style>
