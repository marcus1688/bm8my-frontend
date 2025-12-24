<template>
  <Alerts
    :title="alertTitle"
    :message="alertMessage"
    :isVisible="alertVisible"
    :type="alertType"
    @close="alertVisible = false"
  />
  <GamePlatformModal
    :isVisible="platformModalVisible"
    @close="platformModalVisible = false"
    @selectPlatform="handlePlatformSelection"
  />
  <section class="py-8 containerWid max-lg:py-2 max-lg:mt-2">
    <div class="mx-auto px-4 max-lg:px-0">
      <!-- Mobile Category Navigation -->
      <div class="block lg:hidden mb-4">
        <div class="relative">
          <!-- Left Arrow Indicator -->
          <div
            v-show="canScrollLeft"
            class="absolute left-0 top-0 bottom-1 w-8 bg-gradient-to-r from-[#0a0405] via-[#0a0405]/80 to-transparent z-20 flex items-center justify-start pl-1 pointer-events-none"
          >
            <button
              @click="scrollCategories('left')"
              class="pointer-events-auto w-6 h-6 rounded-full bg-[#1a0a0f]/90 border border-[#3b1c23] flex items-center justify-center text-[#ff3344] hover:bg-[#2a1018] transition-all"
            >
              <i class="bi bi-chevron-left text-xs"></i>
            </button>
          </div>

          <!-- Right Arrow Indicator -->
          <div
            v-show="canScrollRight"
            class="absolute right-0 top-0 bottom-1 w-8 bg-gradient-to-l from-[#0a0405] via-[#0a0405]/80 to-transparent z-20 flex items-center justify-end pr-1 pointer-events-none"
          >
            <button
              @click="scrollCategories('right')"
              class="pointer-events-auto w-6 h-6 rounded-full bg-[#1a0a0f]/90 border border-[#3b1c23] flex items-center justify-center text-[#ff3344] hover:bg-[#2a1018] transition-all"
            >
              <i class="bi bi-chevron-right text-xs"></i>
            </button>
          </div>

          <!-- Category Buttons -->
          <div
            ref="categoryScrollContainer"
            @scroll="checkScrollPosition"
            class="flex overflow-x-auto scrollbar-hide gap-1 pb-1"
          >
            <button
              v-for="(category, index) in categories"
              :key="category.name"
              @click="selectCategory(index)"
              class="relative flex flex-col items-center gap-2 py-3 px-4 min-w-[70px] transition-all duration-300"
            >
              <div
                v-if="activeCategory === index"
                class="absolute inset-0 bg-gradient-to-b from-[#ff3344]/10 to-transparent rounded-t-xl"
              ></div>

              <div class="relative z-10">
                <img
                  :src="
                    activeCategory === index
                      ? category.iconActive
                      : category.iconInactive
                  "
                  :alt="category.name"
                  class="w-7 h-7 object-contain transition-transform duration-300"
                  :class="[
                    activeCategory === index
                      ? 'brightness-0 invert scale-110'
                      : 'opacity-60',
                  ]"
                />
              </div>

              <span
                class="relative z-10 text-[10px] font-semibold whitespace-nowrap transition-colors duration-300"
                :class="
                  activeCategory === index ? 'text-white' : 'text-[#6b4a4a]'
                "
              >
                {{ getCategoryName(category) }}
              </span>

              <div
                class="absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] rounded-full transition-all duration-300"
                :class="
                  activeCategory === index
                    ? 'w-8 bg-gradient-to-r from-[#ff3344] to-[#ff6655] shadow-[0_0_10px_#ff3344]'
                    : 'w-0 bg-transparent'
                "
              ></div>
            </button>
          </div>
        </div>
      </div>

      <!-- Desktop Category Navigation -->
      <div class="hidden lg:block mb-4">
        <div class="flex items-center justify-center">
          <div
            class="inline-flex items-center gap-2 p-1.5 bg-[#241017] rounded-xl border border-[#3b1c23]"
          >
            <button
              v-for="(category, index) in categories"
              :key="category.name"
              @click="selectCategory(index)"
              class="group relative px-5 py-2.5 rounded-lg font-medium whitespace-nowrap transition-all duration-300"
              :class="
                activeCategory === index
                  ? 'bg-gradient-to-r from-[#ff3344] to-[#cc2a3a] text-white'
                  : 'text-[#f0eaea] lg:hover:bg-[#2a0f14]'
              "
            >
              <div class="flex items-center gap-2">
                <img
                  :src="
                    activeCategory === index
                      ? category.iconActive
                      : category.iconInactive
                  "
                  :alt="category.name"
                  class="w-5 h-5 object-contain"
                  :class="activeCategory === index ? 'brightness-0 invert' : ''"
                />
                <span class="text-sm font-semibold">
                  {{ getCategoryName(category) }}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Category Title with Accent -->
      <div class="flex items-center gap-3 mb-6 max-lg:mb-4">
        <div class="flex items-center gap-2">
          <h2 class="text-2xl font-bold text-[#f0eaea] max-lg:text-xl">
            {{ getCategoryName(categories[activeCategory]) }}
          </h2>
        </div>
        <div
          class="flex-1 h-px bg-gradient-to-r from-[#3b1c23] to-transparent"
        ></div>
      </div>

      <!-- Games Grid -->
      <div class="relative">
        <!-- Subtle background decoration -->
        <div
          class="absolute -top-10 -right-10 w-64 h-64 bg-[#ff3344]/5 rounded-full blur-3xl pointer-events-none max-lg:hidden"
        ></div>
        <div
          class="absolute -bottom-10 -left-10 w-64 h-64 bg-[#ff3344]/5 rounded-full blur-3xl pointer-events-none max-lg:hidden"
        ></div>

        <div
          class="relative grid grid-cols-9 max-xl:grid-cols-6 max-lg:grid-cols-5 max-md:grid-cols-4 gap-x-2 max-sm:grid-cols-3"
        >
          <!-- Slot Games -->
          <GameCardGrid
            v-if="activeCategory === 0"
            :games="slotKiosks"
            :onClick="launchGame"
            :isGameLocked="isGameLocked"
          />

          <!-- Live Casino -->
          <GameCardGrid
            v-if="activeCategory === 1"
            :games="liveCasinoKiosks"
            :onClick="launchGame"
            :isGameLocked="isGameLocked"
          />

          <!-- Sports -->
          <GameCardGrid
            v-if="activeCategory === 2"
            :games="sportsKiosks"
            :onClick="launchGame"
            :isGameLocked="isGameLocked"
          />

          <!-- E-Sports -->
          <GameCardGrid
            v-if="activeCategory === 3"
            :games="esportsKiosks"
            :onClick="launchGame"
            :isGameLocked="isGameLocked"
          />

          <!-- Fishing -->
          <GameCardGrid
            v-if="activeCategory === 4"
            :games="fishingKiosks"
            :onClick="launchGame"
            :isGameLocked="isGameLocked"
          />

          <!-- Lottery Game -->
          <GameCardGrid
            v-if="activeCategory === 5"
            :games="lotteryKiosks"
            :onClick="launchGame"
            :isGameLocked="isGameLocked"
          />

          <!-- Fast Games -->
          <GameCardGrid
            v-if="activeCategory === 6"
            :games="fastgameKiosks"
            :onClick="launchGame"
            :isGameLocked="isGameLocked"
          />
        </div>
      </div>

      <!-- Enhanced Empty State -->
      <div
        v-if="
          (activeCategory === 0 && slotKiosks.length === 0) ||
          (activeCategory === 1 && liveCasinoKiosks.length === 0) ||
          (activeCategory === 2 && sportsKiosks.length === 0) ||
          (activeCategory === 3 && esportsKiosks.length === 0) ||
          (activeCategory === 4 && fishingKiosks.length === 0) ||
          (activeCategory === 5 && lotteryKiosks.length === 0) ||
          (activeCategory === 6 && fastgameKiosks.length === 0)
        "
        class="py-8 text-center"
      >
        <div class="max-w-md mx-auto">
          <img
            src="/images/burger-menu/gaming.png"
            alt=""
            class="w-24 max-sm:w-18 mx-auto"
          />

          <h3
            class="text-xl max-sm:text-base font-semibold text-[#f0eaea] mb-2 max-sm:mb-1"
          >
            {{ $t("no_games_found") }}
          </h3>
          <p class="text-[#b37a7a] text-sm max-sm:text-xs">
            {{ $t("no_games_message") }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const {
  launchGame,
  alertVisible,
  alertTitle,
  alertMessage,
  alertType,
  platformModalVisible,
  handlePlatformSelection,
} = useGameLauncher();
const liveCasinoKiosks = useState("liveCasinoKiosks");
const slotKiosks = useState("slotKiosks");
const sportsKiosks = useState("sportsKiosks");
const esportsKiosks = useState("esportsKiosks");
const fishingKiosks = useState("fishingKiosks");
const lotteryKiosks = useState("lotteryKiosks");
const fastgameKiosks = useState("fastgameKiosks");
const activeCategory = ref(0);
const userGameLocks = useState("userGameLocks");
const isUserLoggedIn = useState("isUserLoggedIn");

// Define categories with active and inactive images
const categories = [
  {
    name: { en: "Slots", zh: "老虎机", ms: "Slot" },
    iconActive: "/images/maingameicon/Slot_active.png",
    iconInactive: "/images/maingameicon/Slot_deactivate.png",
  },
  {
    name: { en: "Casino", zh: "真人娱乐", ms: "Kasino" },
    iconActive: "/images/maingameicon/LiveCasino_active.png",
    iconInactive: "/images/maingameicon/LiveCasino_deactivate.png",
  },
  {
    name: { en: "Sports", zh: "体育博彩", ms: "Sukan" },
    iconActive: "/images/maingameicon/Sports_active.png",
    iconInactive: "/images/maingameicon/Sports_deactivate.png",
  },
  {
    name: { en: "E-Sports", zh: "电子竞技", ms: "E-Sukan" },
    iconActive: "/images/maingameicon/E-Sports_active.png",
    iconInactive: "/images/maingameicon/E-Sports_deactivate.png",
  },
  {
    name: { en: "Fishing", zh: "捕鱼游戏", ms: "Memancing" },
    iconActive: "/images/maingameicon/Fishing_active.png",
    iconInactive: "/images/maingameicon/Fishing_deactivate.png",
  },
  {
    name: { en: "Lottery", zh: "彩票", ms: "Loteri" },
    iconActive: "/images/maingameicon/Lottery_active.png",
    iconInactive: "/images/maingameicon/Lottery_deactivate.png",
  },
  {
    name: { en: "Fast Games", zh: "快速游戏", ms: "Permainan Pantas" },
    iconActive: "/images/maingameicon/fastgameicon.png",
    iconInactive: "/images/maingameicon/fastgameicon.png",
  },
];

const getCategoryName = (category) => {
  return category.name[$locale.value] || category.name.en;
};

const isGameLocked = (gameDatabaseName) => {
  if (!isUserLoggedIn.value) return false;
  return userGameLocks.value?.[gameDatabaseName]?.lock === true;
};

const selectCategory = (index) => {
  activeCategory.value = index;
};

const categoryScrollContainer = ref(null);
const canScrollLeft = ref(false);
const canScrollRight = ref(true);

const checkScrollPosition = () => {
  if (!categoryScrollContainer.value) return;

  const container = categoryScrollContainer.value;
  const scrollLeft = container.scrollLeft;
  const maxScroll = container.scrollWidth - container.clientWidth;

  canScrollLeft.value = scrollLeft > 5;
  canScrollRight.value = scrollLeft < maxScroll - 5;
};

const scrollCategories = (direction) => {
  if (!categoryScrollContainer.value) return;

  const container = categoryScrollContainer.value;
  const scrollAmount = 150; // Adjust scroll distance

  container.scrollBy({
    left: direction === "left" ? -scrollAmount : scrollAmount,
    behavior: "smooth",
  });
};

onMounted(() => {
  nextTick(() => {
    checkScrollPosition();
  });
});
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
