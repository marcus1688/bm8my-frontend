<template>
  <ClientOnly>
    <div v-if="matches.length > 0" class="py-4 containerWid max-lg:py-2">
      <!-- Header Section -->
      <div class="my-4">
        <div class="flex items-center justify-between mb-1">
          <h2
            class="text-2xl font-bold text-[#f0eaea] max-xl:text-xl max-md:text-base"
          >
            {{ $t("football_matches") }}
          </h2>
        </div>

        <div class="flex items-center gap-3">
          <p class="text-sm text-[#b37a7a] max-lg:text-xs">
            {{ $t("football_matches_subtitle") }}
          </p>
          <div
            class="flex-1 h-px bg-gradient-to-r from-[#3b1c23] to-transparent"
          ></div>
        </div>
      </div>

      <!-- Desktop Grid -->
      <div class="hidden lg:grid grid-cols-3 gap-4">
        <div
          v-for="match in matches"
          :key="match.fixtureId"
          class="bg-[#241017] rounded-xl shadow-lg overflow-hidden border border-[#3b1c23] transition-all duration-300 flex flex-col h-[260px]"
        >
          <!-- Match Header - Fixed Height -->
          <div
            class="bg-gradient-to-r from-[#15090e] to-[#1a0a0f] px-4 py-2.5 border-b border-[#3b1c23] h-14 flex items-center flex-shrink-0"
          >
            <div class="flex justify-between items-center w-full min-w-0">
              <div
                class="flex items-center text-xs text-[#b37a7a] min-w-0 flex-1 mr-2"
              >
                <Icon icon="mdi:stadium" class="mr-1.5 text-sm flex-shrink-0" />
                <span class="font-medium truncate">{{
                  match.venue?.name || $t("tbd")
                }}</span>
              </div>
              <div
                class="text-xs text-[#b37a7a] font-medium truncate flex-shrink-0 max-w-[40%]"
              >
                {{ match.venue?.city || "" }}
              </div>
            </div>
          </div>

          <div class="p-4 max-xl:p-3 flex-1 flex flex-col">
            <div class="flex items-center justify-between h-full">
              <div class="w-5/12 flex flex-col items-center text-center px-2">
                <div
                  class="w-16 h-16 2xl:w-20 2xl:h-20 flex items-center justify-center mb-2"
                >
                  <img
                    :src="match.teams.home.logo"
                    :alt="match.teams.home.name"
                    class="max-w-full max-h-full object-contain"
                    onerror="this.src='https://placehold.co/80/e2e8f0/475569?text=Team'"
                  />
                </div>
                <p
                  class="font-semibold text-[#f0eaea] text-sm line-clamp-2 max-lg:text-xs"
                >
                  {{ match.teams.home.name }}
                </p>
              </div>

              <div
                class="w-2/12 flex flex-col items-center justify-between h-full"
              >
                <div>
                  <div
                    v-if="match.status.short !== 'NS'"
                    class="bg-gradient-to-r from-[#ff3344] to-[#cc2a3a] text-white px-2 py-0.5 rounded-full text-xs font-bold mb-2 flex items-center gap-1"
                  >
                    <span class="relative flex h-2 w-2">
                      <span
                        class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"
                      ></span>
                      <span
                        class="relative inline-flex rounded-full h-2 w-2 bg-white"
                      ></span>
                    </span>
                    <span
                      v-if="['1H', '2H', 'ET'].includes(match.status.short)"
                    >
                      {{ match.status.elapsed
                      }}{{ match.status.extra ? `+${match.status.extra}` : ""
                      }}<span class="blink">'</span>
                    </span>
                    <span v-else>
                      {{ match.status.short }}
                    </span>
                  </div>
                  <div v-else></div>
                </div>

                <div>
                  <div
                    v-if="match.status.short !== 'NS'"
                    class="bg-gradient-to-br from-[#1A0D13] to-[#15090e] px-4 py-2 rounded-lg shadow-md border border-[#3b1c23]"
                  >
                    <div class="flex items-center justify-center gap-4">
                      <span class="text-xl font-bold text-[#f0eaea]">{{
                        match.goals.home ?? 0
                      }}</span>
                      <span class="text-sm text-[#ff3344]">:</span>
                      <span class="text-xl font-bold text-[#f0eaea]">{{
                        match.goals.away ?? 0
                      }}</span>
                    </div>
                  </div>

                  <div v-else class="w-14">
                    <img src="/images/vsimage/3.png" alt="VS" class="w-full" />
                  </div>
                </div>

                <div></div>
              </div>

              <div class="w-5/12 flex flex-col items-center text-center px-2">
                <div
                  class="w-16 h-16 2xl:w-20 2xl:h-20 flex items-center justify-center mb-2"
                >
                  <img
                    :src="match.teams.away.logo"
                    :alt="match.teams.away.name"
                    class="max-w-full max-h-full object-contain"
                    onerror="this.src='https://placehold.co/80/e2e8f0/475569?text=Team'"
                  />
                </div>
                <p class="font-semibold text-[#f0eaea] text-xs line-clamp-2">
                  {{ match.teams.away.name }}
                </p>
              </div>
            </div>

            <div
              class="text-xs text-center text-[#b37a7a] mt-4 pt-3 border-t border-[#3b1c23] flex items-center justify-center gap-2 max-lg:mt-2"
            >
              <Icon icon="mdi:calendar-clock" class="text-sm text-[#ff3344]" />
              <span class="font-medium">{{ formatDate(match.date) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:hidden">
        <swiper
          :modules="[]"
          :slidesPerView="1.1"
          :spaceBetween="12"
          :loop="false"
          :centeredSlides="false"
          :breakpoints="{
            640: {
              slidesPerView: 1.5,
              spaceBetween: 16,
            },
          }"
          class="matches-swiper"
        >
          <swiper-slide v-for="match in matches" :key="match.fixtureId">
            <div
              class="bg-[#241017] rounded-xl shadow-lg overflow-hidden border border-[#3b1c23] h-[220px] flex flex-col"
            >
              <div
                class="bg-gradient-to-r from-[#15090e] to-[#1a0a0f] px-3 py-2 border-b border-[#3b1c23] h-12 flex items-center flex-shrink-0"
              >
                <div class="flex justify-between items-center w-full min-w-0">
                  <div
                    class="flex items-center text-xs text-[#b37a7a] min-w-0 flex-1 mr-2"
                  >
                    <Icon
                      icon="mdi:stadium"
                      class="mr-1 text-xs flex-shrink-0"
                    />
                    <span class="font-medium truncate text-[10px]">{{
                      match.venue?.name || $t("tbd")
                    }}</span>
                  </div>
                  <div
                    class="text-[10px] text-[#b37a7a] font-medium truncate flex-shrink-0 max-w-[35%]"
                  >
                    {{ match.venue?.city || "" }}
                  </div>
                </div>
              </div>

              <div class="p-4 flex-1 flex flex-col h-full">
                <div class="flex items-center justify-between h-full">
                  <div class="w-5/12 flex flex-col items-center text-center">
                    <div
                      class="w-14 h-14 flex items-center justify-center mb-2"
                    >
                      <img
                        :src="match.teams.home.logo"
                        :alt="match.teams.home.name"
                        class="max-w-full max-h-full object-contain"
                        onerror="this.src='https://placehold.co/80/e2e8f0/475569?text=Team'"
                      />
                    </div>
                    <p
                      class="font-semibold text-[#f0eaea] text-xs line-clamp-2"
                    >
                      {{ match.teams.home.name }}
                    </p>
                  </div>

                  <div
                    class="w-2/12 flex flex-col items-center justify-between h-full"
                  >
                    <div>
                      <div
                        v-if="match.status.short !== 'NS'"
                        class="bg-gradient-to-r from-[#ff3344] to-[#cc2a3a] text-white px-2 py-0.5 rounded-full text-[10px] font-bold mb-2 flex items-center gap-1"
                      >
                        <span class="relative flex h-1.5 w-1.5">
                          <span
                            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"
                          ></span>
                          <span
                            class="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"
                          ></span>
                        </span>
                        <span
                          v-if="['1H', '2H', 'ET'].includes(match.status.short)"
                        >
                          {{ match.status.elapsed
                          }}{{
                            match.status.extra ? `+${match.status.extra}` : ""
                          }}<span class="blink">'</span>
                        </span>
                        <span v-else>{{ match.status.short }}</span>
                      </div>
                      <div v-else></div>
                    </div>

                    <div>
                      <div
                        v-if="match.status.short !== 'NS'"
                        class="bg-gradient-to-br from-[#1A0D13] to-[#15090e] px-2 py-2 rounded-lg shadow-md border border-[#3b1c23]"
                      >
                        <div class="flex items-center justify-center gap-2">
                          <span class="text-base font-bold text-[#f0eaea]">{{
                            match.goals.home ?? 0
                          }}</span>
                          <span class="text-[10px] text-[#ff3344] font-bold"
                            >:</span
                          >
                          <span class="text-base font-bold text-[#f0eaea]">{{
                            match.goals.away ?? 0
                          }}</span>
                        </div>
                      </div>
                      <div v-else class="w-10">
                        <img
                          src="/images/vsimage/3.png"
                          alt="VS"
                          class="w-full"
                        />
                      </div>
                    </div>

                    <div></div>
                  </div>

                  <div class="w-5/12 flex flex-col items-center text-center">
                    <div
                      class="w-14 h-14 flex items-center justify-center mb-2"
                    >
                      <img
                        :src="match.teams.away.logo"
                        :alt="match.teams.away.name"
                        class="max-w-full max-h-full object-contain"
                        onerror="this.src='https://placehold.co/80/e2e8f0/475569?text=Team'"
                      />
                    </div>
                    <p
                      class="font-semibold text-[#f0eaea] text-xs line-clamp-2"
                    >
                      {{ match.teams.away.name }}
                    </p>
                  </div>
                </div>

                <div
                  class="text-xs text-center text-[#b37a7a] pt-3 mt-3 border-t border-[#3b1c23] flex items-center justify-center gap-1.5"
                >
                  <Icon
                    icon="mdi:calendar-clock"
                    class="text-sm text-[#ff3344]"
                  />
                  <span class="font-medium">{{ formatDate(match.date) }}</span>
                </div>
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";

const pageLoading = useState("pageLoading");
const { get } = useApiEndpoint();
const matches = ref([]);
const isLoading = ref(true);
const error = ref(null);
const lastUpdated = ref(null);
const refreshInterval = ref(0);
let refreshTimer = null;

const fetchPremierLeagueData = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const { data } = await get("premier-league");
    if (data.success) {
      matches.value = data.data || [];
      lastUpdated.value = data.lastUpdated || new Date().toISOString();
    } else {
      throw new Error(data.message || "Failed to fetch Premier League data");
    }
  } catch (err) {
    error.value = err.message || "An error occurred while fetching match data";
    console.error("Error fetching Premier League data:", err);
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date
    .toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(",", "");
};

onMounted(async () => {
  try {
    await fetchPremierLeagueData();
    const hasLiveMatches = matches.value.some((match) => match.isInplay);
    if (hasLiveMatches) {
      refreshTimer = setInterval(() => {
        fetchPremierLeagueData();
      }, 15 * 1000);
    }
  } catch (error) {
    console.error("Error during initialization:", error);
  }
});

onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
  }
});
</script>

<style scoped>
.blink {
  animation: blink 1s linear infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>
