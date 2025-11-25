<template>
  <ClientOnly>
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
    <div>
      <section
        class="relative max-lg:max-w-[100vw] shadow-lg shadow-red-600/20"
      >
        <img
          src="/images/banner/sports_banner_desktop.png"
          alt="Promotions and Bonuses Banner"
          class="w-full h-auto lg:block hidden"
        />
        <img
          src="/images/banner/sports_banner_mobile.png"
          alt="Promotions and Bonuses Banner"
          class="w-full h-auto lg:hidden block"
        />
      </section>
      <section class="py-4 px-16 max-lg:p-4 border-t border-[#3b1c23]">
        <div>
          <div class="flex justify-between items-center mb-4">
            <div>
              <h2 class="homeMainTxt3 font-bold text-[#f0eaea]">
                {{ $t("sports") }}
              </h2>
              <p class="text-[#b37a7a] mt-1 titletext">
                {{ $t("choose_gaming_providers") }}
              </p>
            </div>
          </div>
          <div
            class="grid grid-cols-8 max-xl:grid-cols-6 max-lg:grid-cols-5 max-md:grid-cols-4 max-sm:grid-cols-3 gap-x-2"
          >
            <div
              v-for="game in regularKiosks"
              :key="game._id"
              @click="launchGame(game)"
              class="relative cursor-pointer group"
            >
              <div>
                <img
                  :src="game.icon || fallback(game.name)"
                  :alt="game.name"
                  class="w-48 h-auto object-contain rounded-xl shadow-lg shadow-red-500/20"
                />
                <div
                  v-if="isGameLocked(game.databaseName)"
                  class="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80 flex items-center justify-center z-20 rounded-xl"
                ></div>
                <div
                  v-if="!isGameLocked(game.databaseName)"
                  class="max-lg:hidden absolute inset-0 bg-black/30 opacity-0 lg:group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl"
                >
                  <button
                    class="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#a1122d] to-[#c21b3a] text-white font-semibold rounded-lg shadow-lg transform scale-90 lg:group-hover:scale-100 lg:group-hover:brightness-110 transition-all duration-300"
                  >
                    <Icon
                      icon="mdi:play-circle-outline"
                      class="text-white text-base"
                    />
                    <p class="max-2xl:text-xs">{{ $t("play_now") }}</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- Game Promo Cards -->
      <GamePromoCards />
      <SeoContent />
    </div>
  </ClientOnly>
</template>

<script setup>
import { Icon } from "@iconify/vue";
const {
  launchGame,
  alertVisible,
  alertTitle,
  alertMessage,
  alertType,
  platformModalVisible,
  handlePlatformSelection,
} = useGameLauncher();
const sportsKiosks = useState("sportsKiosks");
const userGameLocks = useState("userGameLocks");
const isUserLoggedIn = useState("isUserLoggedIn");
const searchQuery = ref("");
const sortOption = ref("popular");
const currentPage = ref(1);
const itemsPerPage = ref(24);
const gamesPerPage = ref(24);
const searchTerm = ref("");
const { post } = useApiEndpoint();
const isAnimating = ref(false);
const gameList = ref([]);
const currentKiosk = ref(0);
const sliderWrapper = ref(null);
const sliderContent = ref(null);
const currentOffset = ref(0);
const currentIndex = ref(0);
const visibleItems = ref(5);

watch([searchQuery, sortOption], () => {
  currentPage.value = 1;
});

const hasGameListKiosks = computed(() =>
  sportsKiosks.value.filter((kiosk) => kiosk.gameListLink)
);

const regularKiosks = computed(() =>
  sportsKiosks.value.filter((kiosk) => !kiosk.gameListLink)
);

const isGameLocked = (gameDatabaseName) => {
  if (!isUserLoggedIn.value || !gameDatabaseName) return false;
  return userGameLocks.value?.[gameDatabaseName]?.lock === true;
};

const filteredGameList = computed(() => {
  if (!searchTerm.value) return gameList.value;
  const searchLower = searchTerm.value.toLowerCase();
  return gameList.value.filter((game) => {
    const nameToSearch =
      $locale.value === "zh" && game.GameNameZH
        ? game.GameNameZH
        : game.GameNameEN;
    return nameToSearch.toLowerCase().includes(searchLower);
  });
});

const paginatedGames = computed(() => {
  const validGames = filteredGameList.value.filter(
    (game) => game.GameImage && !hasImageError(game)
  );
  const start = (currentPage.value - 1) * gamesPerPage.value;
  const end = start + gamesPerPage.value;
  return validGames.slice(start, end);
});

const totalPages = computed(() => {
  const validGames = filteredGameList.value.filter(
    (game) => game.GameImage && !hasImageError(game)
  );
  return Math.ceil(validGames.length / gamesPerPage.value);
});

const middlePages = computed(() => {
  if (totalPages.value <= 4) {
    return Array.from({ length: totalPages.value - 2 }, (_, i) => i + 2).filter(
      (page) => page > 1 && page < totalPages.value
    );
  }
  let start = Math.max(2, currentPage.value - 1);
  let end = Math.min(totalPages.value - 1, currentPage.value + 1);
  if (end - start + 1 < 3) {
    if (start === 2) {
      end = Math.min(totalPages.value - 1, end + 1);
    } else if (end === totalPages.value - 1) {
      start = Math.max(2, start - 1);
    }
  }
  return Array.from({ length: end - start + 1 }, (_, i) => i + start);
});

const handleMouseEnter = () => {
  isAnimating.value = true;
  setTimeout(() => {
    isAnimating.value = false;
  }, 300);
};

const selectGame = async (game) => {
  currentKiosk.value = game;
  if (game.gameListLink) {
    await fetchGameList(game.gameListLink);
  }
};

const getItemWidth = () => {
  if (
    !sliderContent.value ||
    !sliderContent.value.children ||
    !sliderContent.value.children.length
  ) {
    return 160;
  }
  const firstItem = sliderContent.value.children[0];
  return firstItem.offsetWidth + 12;
};

const calculateVisibleItems = () => {
  if (!sliderWrapper.value) return 5;
  const wrapperWidth = sliderWrapper.value.clientWidth;
  const itemWidth = getItemWidth();
  return Math.floor(wrapperWidth / itemWidth);
};

const slideNext = () => {
  if (
    currentIndex.value <
    hasGameListKiosks.value.length - visibleItems.value
  ) {
    currentIndex.value++;
    updateOffset();
  }
};

const slidePrevious = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
    updateOffset();
  }
};

const updateOffset = () => {
  const itemWidth = getItemWidth();
  currentOffset.value = currentIndex.value * itemWidth;
};

async function fetchGameList(link) {
  try {
    const requestBody = {
      gameLang: $locale.value === "zh" ? "zh" : "en",
    };
    const { data } = await post(link, requestBody);
    if (data.success) {
      gameList.value = data.gamelist.filter((game) => game.GameType === "Slot");
    }
  } catch (error) {
    console.error("Error fetching game list:", error);
  }
}

const failedImages = ref(new Set());

const hasImageError = (game) => {
  return failedImages.value.has(game.GameCode);
};

const handleImageError = (game) => {
  failedImages.value.add(game.GameCode);
};

const getLocalizedGameName = (game) => {
  if ($locale.value === "zh" && game.GameNameZH) {
    return game.GameNameZH;
  }
  if ($locale.value === "ms" && game.GameNameMS) {
    return game.GameNameMS;
  }
  return game.GameNameEN;
};

const fallback = (name) =>
  `https://placehold.co/264x328/2563eb/FFFFFF/png?text=${encodeURIComponent(
    name
  )}`;

onMounted(() => {
  visibleItems.value = calculateVisibleItems();
  updateOffset();
  window.addEventListener("resize", () => {
    visibleItems.value = calculateVisibleItems();
    updateOffset();
  });
});

watch(searchTerm, () => {
  currentPage.value = 1;
});

watch(gameList, () => {
  currentPage.value = 1;
});

watch([searchTerm, sortOption], () => {
  currentPage.value = 1;
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-fadeIn {
  animation: fadeIn 0.8s ease forwards;
}

.animate-slideUp {
  animation: slideUp 0.8s ease forwards;
  animation-delay: 0.2s;
  opacity: 0;
}
</style>
