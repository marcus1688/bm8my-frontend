<template>
  <ClientOnly>
    <div class="bg-[#0a0005] min-h-screen">
      <section class="relative shadow-lg shadow-red-600/20">
        <img
          src="/images/banner/promotion_banner_desktop.png"
          alt="Promotions and Bonuses Banner"
          class="w-full h-auto lg:block hidden"
        />
        <img
          src="/images/banner/promotion_banner_mobile.png"
          alt="Promotions and Bonuses Banner"
          class="w-full h-auto lg:hidden block"
        />
      </section>

      <section class="containerWid px-6 py-8 max-lg:px-4 max-lg:py-6">
        <div class="mb-8 max-lg:mb-6">
          <div
            class="flex items-center justify-between mb-6 max-lg:mb-4 max-md:flex-col max-md:items-start max-md:gap-3"
          >
            <div>
              <h1
                class="text-3xl font-bold text-[#f0eaea] mb-2 max-lg:text-2xl max-sm:text-xl max-lg:mb-1"
              >
                {{ tabs.find((t) => t.key === selectedTab)?.label }}
                {{ $t("promotion") }}
              </h1>
              <p class="text-sm text-[#b37a7a] max-lg:text-xs">
                {{ $t("exclusive_rewards_bonuses") }}
              </p>
            </div>
            <div
              class="max-md:hidden flex items-center gap-2 px-4 py-2 bg-[#241017] rounded-lg border border-[#3b1c23]"
            >
              <i class="bi bi-gift text-[#ff3344]"></i>
              <span class="text-sm text-[#b37a7a] max-lg:text-xs">
                <span class="font-bold text-[#ff3344]">{{
                  filteredContent.length
                }}</span>
                {{ $t("offers") }}
              </span>
            </div>
          </div>

          <div class="relative">
            <div
              class="overflow-x-auto scrollbar-hide -mx-6 px-6 max-lg:-mx-4 max-lg:px-4"
            >
              <div class="flex gap-2 min-w-max pb-2">
                <button
                  v-for="tab in tabs"
                  :key="tab.key"
                  @click="selectTab(tab.key)"
                  class="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 whitespace-nowrap border max-lg:px-3 max-lg:py-2"
                  :class="
                    selectedTab === tab.key
                      ? 'bg-[#ff3344] border-[#ff3344] text-white'
                      : 'bg-transparent border-[#3b1c23] text-[#b37a7a] lg:hover:border-[#ff3344]/50 lg:hover:text-[#f0eaea]'
                  "
                >
                  <img
                    :src="getCategoryIconByKey(tab.key)"
                    :alt="tab.label"
                    class="w-7 h-7 max-sm:w-6 max-sm:h-6 object-contain transition-all"
                    :class="
                      selectedTab === tab.key ? 'brightness-0 invert' : ''
                    "
                  />

                  <span class="text-sm font-medium max-lg:text-xs">{{
                    tab.label
                  }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Promotions Grid -->
        <div v-if="filteredContent.length > 0">
          <div class="grid grid-cols-2 max-sm:grid-cols-1 gap-6 max-lg:gap-5">
            <div
              v-for="promotion in filteredContent"
              :key="promotion._id"
              class="group bg-[#15090e] rounded-xl overflow-hidden border border-[#3b1c23]/50"
            >
              <div class="relative overflow-hidden bg-[#1A0D13]">
                <img
                  :src="getPromotionImage(promotion)"
                  :alt="promotion.title"
                  class="w-full h-full object-cover"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60"
                ></div>
              </div>

              <div class="p-5 max-lg:p-4">
                <div class="h-4 flex items-start">
                  <h3
                    class="text-[#f0eaea] font-semibold text-base leading-snug max-lg:text-sm overflow-hidden text-ellipsis whitespace-nowrap"
                  >
                    {{
                      $i18n.locale === "zh"
                        ? promotion?.maintitle
                        : $i18n.locale === "ms"
                        ? promotion?.maintitleMS
                        : promotion?.maintitleEN
                    }}
                  </h3>
                </div>

                <button
                  @click="openPromotionModal(promotion)"
                  class="w-full py-2.5 mt-5 max-lg:mt-3 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 border max-lg:py-2 max-lg:text-xs bg-transparent border-[#ff3344] text-[#ff3344] lg:hover:bg-[#ff3344] lg:hover:text-white"
                >
                  <span>{{ $t("learn_more") }}</span>
                  <i class="bi bi-arrow-right text-xs"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="py-16 text-center">
          <div class="max-w-md mx-auto">
            <img
              src="/images/burger-menu/promotions.png"
              alt=""
              class="w-24 max-sm:w-18 mx-auto"
            />

            <h3
              class="text-xl max-sm:text-base font-semibold text-[#f0eaea] mb-2 max-sm:mb-1"
            >
              {{ $t("no_promotions") }}
            </h3>
            <p class="text-[#b37a7a] text-sm max-sm:text-xs">
              {{ $t("no_promotions_in_category") }}
            </p>
          </div>
        </div>
      </section>
    </div>

    <PromotionModal
      :show="isPromotionModalOpen"
      :promotion="selectedPromotion"
      @close="closePromotionModal"
    />
  </ClientOnly>
</template>

<script setup>
const pageLoading = useState("pageLoading");
const isPromotionModalOpen = ref(false);
const selectedPromotion = ref(null);

const tabs = [
  { key: "All", label: $t("all") },
  { key: "Live Casino", label: $t("live_casino") },
  { key: "Sports", label: $t("sports") },
  { key: "Slot Games", label: $t("slot_games") },
  { key: "Fishing", label: $t("fishing") },
  { key: "E-Sports", label: $t("e_sports") },
  { key: "Lottery", label: $t("lottery") },
];

const promotionData = ref(null);
const selectedTab = ref("All");

const categories = [
  {
    name: "All",
    iconActive: "/images/maingameicon/Slot_active.png",
    iconInactive: "/images/maingameicon/Slot_deactivate.png",
  },
  {
    name: "Slot Games",
    iconActive: "/images/maingameicon/Slot_active.png",
    iconInactive: "/images/maingameicon/Slot_deactivate.png",
  },
  {
    name: "Live Casino",
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

const getCategoryIconByKey = (key) => {
  const category = categories.find((cat) => cat.name === key);
  if (!category) return categories[0].iconInactive; // fallback

  return selectedTab.value === key
    ? category.iconActive
    : category.iconInactive;
};

function openPromotionModal(promotion) {
  selectedPromotion.value = {
    promotionimage: promotion.promotionimage,
    promotionimage2: promotion.promotionimage2,
    promotionimage3: promotion.promotionimage3,
    maintitle:
      $locale.value === "zh"
        ? promotion.maintitle
        : $locale.value === "ms"
        ? promotion.maintitleMS
        : promotion.maintitleEN,
    content:
      $locale.value === "zh"
        ? promotion.content
        : $locale.value === "ms"
        ? promotion.contentMS
        : promotion.contentEN,
    TnC:
      $locale.value === "zh"
        ? promotion.TnC
        : $locale.value === "ms"
        ? promotion.TnCMS
        : promotion.TnCEN,
  };
  isPromotionModalOpen.value = true;
}

function closePromotionModal() {
  isPromotionModalOpen.value = false;
}

function selectTab(tabName) {
  selectedTab.value = tabName;
}

async function fetchPromotion() {
  try {
    const { get } = useApiEndpoint();
    const { data } = await get("client/getallpromotion");
    if (data.success) {
      promotionData.value = data.promotions;
    }
  } catch (error) {
    console.error("Error fetching promotions:", error);
  }
}

function getPromotionImage(promotion) {
  if ($locale.value === "zh" && promotion.promotionimage2) {
    return promotion.promotionimage2;
  }
  if ($locale.value === "ms" && promotion.promotionimage3) {
    return promotion.promotionimage3;
  }

  return promotion.promotionimage;
}

const filteredContent = computed(() => {
  if (!promotionData.value) return [];
  let allPromotions = promotionData.value.filter((promo) => {
    return promo.maintitleEN && promo.maintitleEN.trim() !== "";
  });
  if (selectedTab.value === "All") return allPromotions;
  return allPromotions.filter((promo) => {
    return promo.categories.some((cat) => cat.name === selectedTab.value);
  });
});

onMounted(async () => {
  pageLoading.value = true;
  try {
    await fetchPromotion();
  } catch (error) {
    console.error("Error during initialization:", error);
  } finally {
    pageLoading.value = false;
  }
});

useHead({
  title: "BM8 | Latest Promotions & Bonuses - Malaysia Online Casino Offers",
  meta: [
    {
      property: "og:title",
      content: "BM8 | Exclusive Casino Promotions & Welcome Bonuses",
    },
    {
      name: "description",
      content:
        "Discover BM8's latest promotions and bonuses including welcome bonuses, free spins, cashback offers, sports betting promotions, VIP rewards, and daily specials.",
    },
    {
      name: "keywords",
      content:
        "BM8 promotions, casino bonuses Malaysia, welcome bonus, free spins, cashback offers, sports betting bonus, slot promotions, live casino bonus, VIP rewards",
    },
  ],
  htmlAttrs: { lang: "en" },
  link: [
    { rel: "canonical", href: "https://www.bm8my.vip/promotions" },
    {
      rel: "alternate",
      hreflang: "x-default",
      href: "https://www.bm8my.vip/promotions",
    },
    {
      rel: "alternate",
      hreflang: "en",
      href: "https://www.bm8my.vip/promotions",
    },
  ],
});
</script>

<style scoped>
.containerWid {
  max-width: 1400px;
  margin: 0 auto;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.line-clamp-2 {
  display: -webkit-box;

  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
