<template>
  <ClientOnly>
    <div>
      <!-- Banner -->
      <section class="relative shadow-lg shadow-red-600/20">
        <img
          src="/images/banner/vip_banner_desktop.png"
          alt="VIP"
          class="w-full h-auto lg:block hidden"
        />
        <img
          src="/images/banner/vip_banner_mobile.png"
          alt="VIP"
          class="w-full h-auto lg:hidden block"
        />
      </section>

      <section class="py-6 containerWid px-4 max-lg:py-4">
        <div class="text-center">
          <h1
            class="text-3xl font-bold text-[#f0eaea] mb-2 max-lg:text-2xl max-lg:mb-1 max-sm:text-xl"
          >
            {{ localizedTableTitle }}
          </h1>
          <p class="text-sm text-[#b37a7a] max-lg:text-xs">
            {{ $t("vip_subtitle") }}
          </p>
        </div>
      </section>

      <!-- Desktop Table -->
      <section class="containerWid pb-8 px-4 hidden lg:block">
        <div
          class="bg-[#241017] rounded-xl border border-[#3b1c23] overflow-hidden shadow-lg"
        >
          <div class="overflow-x-auto">
            <table class="w-full min-w-[900px]">
              <thead>
                <tr class="bg-gradient-to-r from-[#8b0f1f] to-[#6b0a18]">
                  <th
                    class="py-4 px-4 text-left text-white font-semibold sticky left-0 bg-gradient-to-r from-[#8b0f1f] to-[#6b0a18] z-10"
                  >
                    {{ $t("benefits") }}
                  </th>
                  <th
                    v-for="level in settingsData.vipLevels"
                    :key="`header-${level.name}`"
                    class="py-4 px-3 text-center"
                  >
                    <div class="flex flex-col items-center gap-2">
                      <img
                        v-if="level.iconUrl"
                        :src="level.iconUrl"
                        alt="VIP"
                        class="w-14"
                      />
                      <span
                        class="text-white text-sm font-semibold whitespace-nowrap"
                      >
                        {{ getLocalizedLevelName(level.name) }}
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <template
                  v-for="(row, rowIndex) in settingsData.rowHeaders"
                  :key="row.id"
                >
                  <tr v-if="isFirstInGroup(rowIndex)" class="bg-[#1A0D13]">
                    <td
                      colspan="7"
                      class="py-2.5 px-4 font-semibold text-[#ff3344] text-sm border-t-2 border-[#3b1c23]"
                    >
                      <i class="bi bi-chevron-right mr-1"></i>
                      {{ getSectionTitle(row.name) }}
                    </td>
                  </tr>
                  <tr class="lg:hover:bg-[#2a0f14]/50 transition-colors">
                    <td
                      class="py-3 px-4 border-t border-[#3b1c23] font-medium text-[#f0eaea] text-sm sticky left-0 bg-[#241017] lg:hover:bg-[#2a0f14]/50 z-10"
                    >
                      {{ getLocalizedRowName(row.name) }}
                    </td>
                    <td
                      v-for="level in settingsData.vipLevels"
                      :key="`${level.name}-${row.name}`"
                      class="py-3 px-3 text-center border-t border-[#3b1c23] text-sm"
                    >
                      <span
                        v-if="
                          level.benefits &&
                          level.benefits[row.name]?.toString().toLowerCase() ===
                            'yes'
                        "
                        class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-500/20"
                      >
                        <i class="bi bi-check-lg text-green-500 text-lg"></i>
                      </span>
                      <span
                        v-else-if="
                          level.benefits &&
                          level.benefits[row.name]?.toString().toLowerCase() ===
                            'no'
                        "
                        class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-500/20"
                      >
                        <i class="bi bi-x text-gray-500 text-lg"></i>
                      </span>
                      <template v-else>
                        <span class="text-[#f0eaea] font-semibold">
                          {{
                            formatBenefitValue(
                              level.benefits ? level.benefits[row.name] : "",
                              row.name
                            )
                          }}
                        </span>
                      </template>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- Mobile Tab  -->
      <section class="lg:hidden containerWid px-4 pb-6">
        <div class="mb-4">
          <div class="relative">
            <div
              v-if="canScrollLeft"
              class="absolute left-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
            >
              <i
                class="bi bi-chevron-left text-[#ff3344] text-2xl animate-pulse drop-shadow-lg"
              ></i>
            </div>
            <div
              v-if="canScrollRight"
              class="absolute right-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
            >
              <i
                class="bi bi-chevron-right text-[#ff3344] text-2xl animate-pulse drop-shadow-lg"
              ></i>
            </div>

            <div
              ref="scrollContainer"
              @scroll="checkScroll"
              class="overflow-x-auto scrollbar-hide -mx-4 px-4"
            >
              <div class="grid grid-cols-6 gap-2 pb-2" style="min-width: 600px">
                <button
                  v-for="level in settingsData.vipLevels"
                  :key="level.name"
                  @click="selectedMobileLevel = level"
                  class="flex flex-col items-center gap-2 py-3 rounded-lg transition-all relative"
                >
                  <div
                    class="w-22 h-22 max-md:w-18 max-md:h-18 rounded-full flex items-center justify-center transition-all"
                    :class="
                      selectedMobileLevel?.name === level.name
                        ? 'ring-2 ring-[#ff3344] ring-offset-2 ring-offset-[#0a0005] scale-110'
                        : 'opacity-50'
                    "
                  >
                    <img
                      v-if="level.iconUrl"
                      :src="level.iconUrl"
                      alt="VIP"
                      class="w-20 h-20 max-md:w-16 max-md:h-16"
                    />
                  </div>

                  <span
                    class="text-sm max-md:text-xs mt-1 font-semibold text-center transition-colors leading-tight"
                    :class="
                      selectedMobileLevel?.name === level.name
                        ? 'text-[#ff3344]'
                        : 'text-[#b37a7a]'
                    "
                  >
                    {{ getLocalizedLevelName(level.name) }}
                  </span>

                  <div
                    v-if="selectedMobileLevel?.name === level.name"
                    class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-[#ff3344] rounded-full"
                  ></div>
                </button>
              </div>
            </div>
          </div>

          <div
            v-if="showSwipeHint"
            class="flex items-center justify-center gap-2 mt-2 text-[#b37a7a] text-xs animate-pulse"
          >
            <i class="bi bi-arrow-left-right"></i>
            <span>{{ $t("swipe_to_see_more_levels") }}</span>
          </div>
        </div>
        <div v-if="selectedMobileLevel" class="space-y-4">
          <div class="space-y-3">
            <template
              v-for="(row, rowIndex) in settingsData.rowHeaders"
              :key="row.id"
            >
              <div v-if="isFirstInGroup(rowIndex)" class="pt-2 first:pt-0">
                <div class="flex items-center gap-2 mb-3">
                  <div class="w-1 h-4 bg-[#ff3344] rounded-full"></div>
                  <h4
                    class="text-sm font-bold text-[#ff3344] uppercase tracking-wider"
                  >
                    {{ getSectionTitle(row.name) }}
                  </h4>
                  <div class="flex-1 h-px bg-[#3b1c23]"></div>
                </div>
              </div>

              <div
                class="flex items-center justify-between py-2.5 px-1 border-b border-[#3b1c23] last:border-b-0"
              >
                <span class="text-[0.9rem] text-[#f0eaea] flex-1 pr-4">
                  {{ getLocalizedRowName(row.name) }}
                </span>

                <div
                  v-if="
                    selectedMobileLevel.benefits &&
                    selectedMobileLevel.benefits[row.name]
                      ?.toString()
                      .toLowerCase() === 'yes'
                  "
                  class="flex-shrink-0 flex items-center gap-1.5"
                >
                  <span class="text-xs text-green-500 font-medium">{{
                    $t("yes")
                  }}</span>
                  <div class="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                </div>
                <div
                  v-else-if="
                    selectedMobileLevel.benefits &&
                    selectedMobileLevel.benefits[row.name]
                      ?.toString()
                      .toLowerCase() === 'no'
                  "
                  class="flex-shrink-0 flex items-center gap-1.5"
                >
                  <span class="text-xs text-gray-500 font-medium">{{
                    $t("no")
                  }}</span>
                  <div class="w-1.5 h-1.5 rounded-full bg-gray-500"></div>
                </div>

                <!-- Value -->
                <div v-else class="flex-shrink-0 flex items-center gap-1.5">
                  <span class="text-[0.9rem] font-bold text-[#ff3344]">
                    {{
                      formatBenefitValue(
                        selectedMobileLevel.benefits
                          ? selectedMobileLevel.benefits[row.name]
                          : "",
                        row.name
                      )
                    }}
                  </span>
                  <div class="w-1.5 h-1.5 rounded-full bg-[#ff3344]"></div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </section>

      <!-- Terms Section -->
      <section
        v-if="getLocalizedTerms"
        class="containerWid px-4 pb-8 max-lg:pb-6"
      >
        <div
          class="bg-[#241017] rounded-xl border border-[#3b1c23] p-6 max-lg:p-4"
        >
          <h3
            class="text-lg font-bold text-[#f0eaea] mb-4 flex items-center max-lg:text-base max-lg:mb-3"
          >
            <i class="bi bi-info-circle text-[#ff3344] mr-2"></i>
            {{ $t("terms_conditions") }}
          </h3>
          <div class="space-y-2 text-[#b37a7a] text-sm max-lg:text-xs">
            <div
              v-for="(item, index) in getLocalizedTermsArray"
              :key="index"
              class="flex items-start gap-2"
            >
              <span
                class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#15090e] text-[#ff3344] text-xs font-bold flex-shrink-0 border border-[#3b1c23] max-lg:w-5 max-lg:h-5"
              >
                {{ index + 1 }}
              </span>
              <span class="flex-1">{{ item }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </ClientOnly>
</template>

<script setup>
const pageLoading = useState("pageLoading");
const { get } = useApiEndpoint();
const selectedMobileLevel = ref(null);

const settingsData = ref({
  tableTitle: "VIP Exclusive Benefits",
  rowHeaders: [],
  vipLevels: [],
  terms: { en: "", zh: "", ms: "" },
});

const fetchSettings = async () => {
  try {
    const { data } = await get("vipsettings");
    if (data?.success) {
      settingsData.value = data.data[0];
      if (settingsData.value.vipLevels.length > 0) {
        selectedMobileLevel.value = settingsData.value.vipLevels[0];
      }
    }
  } catch (error) {
    console.error("Error fetching VIP settings:", error);
  }
};

const getLocalizedTermsArray = computed(() => {
  if (!getLocalizedTerms.value) return [];
  return getLocalizedTerms.value.split("\n").filter((item) => item.trim());
});

const formatNumber = (value, rowName) => {
  if (!value) return "";
  if (
    typeof value === "string" &&
    (value.toLowerCase() === "no" || value.toLowerCase() === "yes")
  ) {
    return value.toUpperCase();
  }
  const number = parseFloat(value);
  if (isNaN(number)) return value;
  return number.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });
};

const getLocalizedTerms = computed(() => {
  if ($locale.value === "zh") return settingsData.value.terms?.zh;
  else if ($locale.value === "ms") return settingsData.value.terms?.ms;
  else return settingsData.value.terms?.en;
});

const formatBenefitValue = (value, rowName) => {
  if (!value) return "";
  const isNumeric = !isNaN(value) && !isNaN(parseFloat(value));
  if (!isNumeric) {
    return value;
  }
  const formattedNumber = formatNumber(value, rowName);
  if (rowName === "Withdraw Limit") {
    return formattedNumber;
  } else if (
    rowName === "Rebate Slot" ||
    rowName === "Rebate Live Casino" ||
    rowName === "Rebate Sports" ||
    rowName === "Rebate Esports" ||
    rowName === "Unlimited Deposit Bonus"
  ) {
    return formattedNumber + "%";
  } else {
    return "MYR " + formattedNumber;
  }
};

const levelNameTranslations = {
  bronze: { en: "Bronze", zh: "青銅", ms: "Gangsa" },
  silver: { en: "Silver", zh: "白銀", ms: "Perak" },
  gold: { en: "Gold", zh: "黃金", ms: "Emas" },
  platinum: { en: "Platinum", zh: "鉑金", ms: "Platinum" },
  "bm8 elite vip": {
    en: "BM8 Elite VIP",
    zh: "BM8 尊贵贵宾",
    ms: "BM8 Elite VIP",
  },
  diamond: { en: "Diamond", zh: "鑽石", ms: "Berlian" },
  royal: { en: "Royal", zh: "至尊", ms: "Raja" },
};

const getLocalizedLevelName = (name) => {
  const lowerName = name.toLowerCase();
  return levelNameTranslations[lowerName]?.[$locale.value] || name;
};

const rowNameTranslations = {
  "Total Deposit": { en: "Total Deposit", zh: "总存款", ms: "Jumlah Deposit" },
  "Upgrade Bonus": {
    en: "Upgrade Bonus",
    zh: "晋级奖励",
    ms: "Bonus Naik Taraf",
  },
  "VIP Monthly Bonus": {
    en: "VIP Monthly Bonus",
    zh: "VIP每月奖金",
    ms: "Bonus Bulanan VIP",
  },
  "Rebate Slot": { en: "Rebate Slot", zh: "老虎机返水", ms: "Rebat Slot" },
  "Rebate Live Casino": {
    en: "Rebate Live Casino",
    zh: "真人娱乐返水",
    ms: "Rebat Live Casino",
  },
  "Rebate Sports": {
    en: "Rebate Sports",
    zh: "体育返水",
    ms: "Rebat Sports",
  },
  "Rebate Esports": {
    en: "Rebate Esports",
    zh: "电竞返水",
    ms: "Rebat Esports",
  },
  "Birthday Bonus": {
    en: "Birthday Bonus",
    zh: "生日奖励",
    ms: "Bonus Hari Jadi",
  },
  "Withdraw Limit": {
    en: "Withdraw Limit",
    zh: "提款限额",
    ms: "Had Pengeluaran",
  },
  "Daily Rewards": {
    en: "Daily Rewards",
    zh: "每日奖励",
    ms: "Daily Rewards",
  },
  "Weekly Rewards": {
    en: "Weekly Rewards",
    zh: "每周奖励",
    ms: "Weekly Rewards",
  },
  "Monthly Rewards": {
    en: "Monthly Rewards",
    zh: "每月奖励",
    ms: "Monthly Rewards",
  },
  "Daily Bank Withdraw Limit": {
    en: "Daily Bank Withdraw Limit",
    zh: "每日银行提款限额",
    ms: "Had Pengeluaran Bank Harian",
  },
  "Unlimited Deposit Bonus": {
    en: "Unlimited Deposit Bonus",
    zh: "无限存款奖金",
    ms: "Bonus Deposit Tanpa Had",
  },
  "Membership Renewal": {
    en: "Membership Renewal",
    zh: "会员续期",
    ms: "Pembaharuan Keahlian",
  },
  "Monthly Tier Retention Requirement": {
    en: "Monthly Tier Retention Requirement",
    zh: "每月等级保留要求",
    ms: "Keperluan Pengekalan Tahap Bulanan",
  },
};

const localizedTableTitle = computed(() => {
  return $locale.value === "zh"
    ? "VIP 专属福利"
    : settingsData.value?.tableTitle;
});

const getLocalizedRowName = (name) => {
  return rowNameTranslations[name]?.[$locale.value] || name;
};

const isFirstInGroup = (index) => {
  if (index === 0) return true;
  const currentRowName = settingsData.value.rowHeaders[index].name;
  const prevRowName = settingsData.value.rowHeaders[index - 1].name;
  return getGroupName(currentRowName) !== getGroupName(prevRowName);
};

const getGroupName = (rowName) => {
  if (rowName.includes("Total Deposit") || rowName.includes("Total")) {
    return $t("membership_requirements");
  } else if (rowName.includes("Birthday") || rowName.includes("Upgrade")) {
    return $t("bonuses_rewards");
  } else if (rowName.includes("Rebate") || rowName.includes("Sport")) {
    return $t("special_rebates");
  } else if (rowName.includes("Rewards")) {
    return $t("check_in_bonus");
  } else if (
    rowName.includes("Withdraw") ||
    rowName.includes("Account") ||
    rowName.includes("Membership") ||
    rowName.includes("Retention") ||
    rowName.includes("Unlimited Deposit Bonus")
  ) {
    return $t("account_benefits");
  } else {
    return $t("other_benefits");
  }
};

const getSectionTitle = (rowName) => {
  return getGroupName(rowName);
};

const scrollContainer = ref(null);
const canScrollLeft = ref(false);
const canScrollRight = ref(false);
const showSwipeHint = ref(true);

const checkScroll = () => {
  if (!scrollContainer.value) return;
  const element = scrollContainer.value;
  canScrollLeft.value = element.scrollLeft > 0;
  canScrollRight.value =
    element.scrollLeft < element.scrollWidth - element.clientWidth - 10;
  if (element.scrollLeft > 0) {
    showSwipeHint.value = false;
    localStorage.setItem("vip_swipe_hint_seen", "true");
  }
};

useHead({
  title: "BM8 | VIP Membership Program & Exclusive Benefits - Malaysia Casino",
  meta: [
    {
      property: "og:title",
      content: "BM8 VIP | Elite Gaming Benefits & Premium Rewards",
    },
    {
      name: "description",
      content:
        "Experience BM8's exclusive VIP membership program with premium benefits including higher withdrawal limits, special rebates, monthly bonuses, birthday rewards, and personalized customer service in Malaysia's top gaming platform.",
    },
    {
      name: "keywords",
      content:
        "BM8 VIP, VIP membership Malaysia, casino VIP program, exclusive gaming benefits, premium rewards, VIP rebates, monthly VIP bonus, high roller benefits, elite gaming Malaysia, BM8 premium membership",
    },
  ],
  htmlAttrs: { lang: "en" },
  link: [
    { rel: "canonical", href: "https://www.bm8my.vip/vip" },
    {
      rel: "alternate",
      hreflang: "x-default",
      href: "https://www.bm8my.vip/vip",
    },
    { rel: "alternate", hreflang: "en", href: "https://www.bm8my.vip/vip" },
  ],
});

onMounted(async () => {
  pageLoading.value = true;
  try {
    await fetchSettings();
    const hintSeen = localStorage.getItem("vip_swipe_hint_seen");
    showSwipeHint.value = !hintSeen;
    nextTick(() => {
      checkScroll();
    });
    setTimeout(() => {
      showSwipeHint.value = false;
    }, 3000);
  } catch (error) {
    console.error("Error during initialization:", error);
  } finally {
    pageLoading.value = false;
  }
});
</script>

<style scoped>
.containerWid {
  max-width: 1920px;
  margin: 0 auto;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

table tbody tr td:first-child::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 1px;
  background: linear-gradient(to right, transparent, rgba(255, 51, 68, 0.1));
}
</style>
