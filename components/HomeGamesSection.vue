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
  <section class="py-8 containerWid max-lg:py-2">
    <div class="mx-auto px-4 max-lg:px-2">
      <!-- Mobile Category Navigation -->
      <div class="block lg:hidden mb-6">
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="(category, index) in categories"
            :key="category.name"
            @click="selectCategory(index)"
            class="group relative py-3 px-2 rounded-lg flex flex-col items-center justify-center gap-1"
            :class="
              activeCategory === index
                ? 'bg-gradient-to-br from-[#ff3344] to-[#cc2a3a] text-white shadow-lg'
                : 'bg-[#241017] text-[#f0eaea] border border-[#3b1c23]'
            "
          >
            <img
              :src="
                activeCategory === index
                  ? category.iconActive
                  : category.iconInactive
              "
              :class="activeCategory === index ? 'brightness-0 invert' : ''"
              :alt="category.name"
              class="w-7 h-7 max-sm:w-6 max-sm:h-6 object-contain"
            />
            <span class="text-sm max-sm:text-xs font-medium">
              {{ category.name }}
            </span>
          </button>
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
                  {{ category.name }}
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
            {{ categories[activeCategory].name }}
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

          <!-- Lottery Games -->
          <GameCardGrid
            v-if="activeCategory === 5"
            :games="lotteryKiosks"
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
          (activeCategory === 5 && lotteryKiosks.length === 0)
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
const activeCategory = ref(0);
const userGameLocks = useState("userGameLocks");
const isUserLoggedIn = useState("isUserLoggedIn");

// Define categories with active and inactive images
const categories = [
  {
    name: "Slots",
    iconActive: "/images/maingameicon/Slot_active.png",
    iconInactive: "/images/maingameicon/Slot_deactivate.png",
  },
  {
    name: "Casino",
    iconActive: "/images/maingameicon/LiveCasino_active.png",
    iconInactive: "/images/maingameicon/LiveCasino_deactivate.png",
  },
  {
    name: "Sports",
    iconActive: "/images/maingameicon/Sports_active.png",
    iconInactive: "/images/maingameicon/Sports_deactivate.png",
  },
  {
    name: "E-Sports",
    iconActive: "/images/maingameicon/E-Sports_active.png",
    iconInactive: "/images/maingameicon/E-Sports_deactivate.png",
  },
  {
    name: "Fishing",
    iconActive: "/images/maingameicon/Fishing_active.png",
    iconInactive: "/images/maingameicon/Fishing_deactivate.png",
  },
  {
    name: "Lottery",
    iconActive: "/images/maingameicon/Lottery_active.png",
    iconInactive: "/images/maingameicon/Lottery_deactivate.png",
  },
];

const isGameLocked = (gameDatabaseName) => {
  if (!isUserLoggedIn.value) return false;
  return userGameLocks.value?.[gameDatabaseName]?.lock === true;
};

const selectCategory = (index) => {
  activeCategory.value = index;
};
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
