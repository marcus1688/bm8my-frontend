<template>
  <UserAccountLayout>
    <TurnoverRequirementModal
      v-model="showTurnoverModal"
      :details="turnoverDetails"
    />
    <div class="text-[#f0eaea]">
      <div class="mb-6 max-lg:mb-4">
        <h1 class="text-xl font-bold mb-1 max-lg:text-lg max-sm:text-base">
          {{ $t("rebate") }}
        </h1>
        <p class="text-[#b37a7a] text-sm max-lg:text-xs">
          {{ $t("claim_rebate_description") }}
        </p>
      </div>

      <PageLoading v-if="isLoading" />

      <div v-else class="space-y-4">
        <div
          class="bg-[#241017] border border-[#3b1c23] rounded-xl overflow-hidden"
        >
          <div class="px-5 pt-5 border-b border-[#3b1c23]">
            <div class="flex items-center justify-between gap-4 mb-4">
              <div class="flex items-center gap-3">
                <div
                  class="w-11 h-11 max-lg:w-10 max-md:hidden max-lg:h-10 rounded-xl bg-gradient-to-br from-[#ff3344] to-[#cc2a3a] flex items-center justify-center shadow-lg shadow-[#ff3344]/30"
                >
                  <Icon
                    icon="mdi:gift"
                    class="w-6 h-6 text-white max-lg:w-5 max-lg:h-5"
                  />
                </div>
                <div>
                  <h3
                    class="font-bold text-[#f0eaea] text-base max-lg:text-sm mb-0.5"
                  >
                    {{ $t("rebate_rewards_ready") }}
                  </h3>
                  <p class="text-sm max-sm:text-xs text-[#b37a7a]">
                    {{ $t("rebate_rewards_based") }}
                  </p>
                </div>
              </div>
            </div>

            <LoadingButton
              :loading="claimButtonLoading"
              @click="claimRebate"
              class="w-full py-3 bg-[#ff3344] lg:hover:bg-[#cc2a3a] rounded-lg text-base font-semibold text-white transition-all mb-6 max-lg:py-2.5 max-lg:text-sm max-lg:mb-4"
            >
              <div class="flex items-center justify-center gap-2">
                <span class="uppercase">{{ $t("claim_my_rebate") }}</span>
              </div>
            </LoadingButton>
          </div>

          <div
            class="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#3b1c23]"
          >
            <div class="p-4">
              <div class="flex items-start gap-3">
                <div
                  class="w-10 h-10 max-sm:w-8 max-sm:h-8 rounded-lg bg-[#ff3344]/10 flex items-center justify-center flex-shrink-0"
                >
                  <Icon
                    icon="mdi:clock-alert"
                    class="w-5 h-5 max-sm:w-4 max-sm:h-4 text-[#ff3344]"
                  />
                </div>
                <div>
                  <h4
                    class="font-semibold text-[#f0eaea] mb-1 max-sm:text-sm max-[370px]:text-xs text-[0.9rem]"
                  >
                    {{ $t("time_limit") }}
                  </h4>
                  <p
                    class="text-sm max-lg:text-xs text-[#b37a7a] leading-relaxed"
                  >
                    {{ $t("time_limit_description") }}
                  </p>
                </div>
              </div>
            </div>

            <div class="p-4">
              <div class="flex items-start gap-3">
                <div
                  class="w-10 h-10 max-sm:w-8 max-sm:h-8 rounded-lg bg-[#ff3344]/10 flex items-center justify-center flex-shrink-0"
                >
                  <Icon
                    icon="mdi:cash-refund"
                    class="w-5 h-5 max-sm:w-4 max-sm:h-4 text-[#ff3344]"
                  />
                </div>
                <div>
                  <h4
                    class="font-semibold text-[#f0eaea] mb-1 max-sm:text-sm max-[370px]:text-xs text-[0.9rem]"
                  >
                    {{ $t("no_turnover") }}
                  </h4>
                  <p
                    class="text-sm max-lg:text-xs text-[#b37a7a] leading-relaxed"
                  >
                    {{ $t("no_turnover_description") }}
                  </p>
                </div>
              </div>
            </div>

            <div class="p-4">
              <div class="flex items-start gap-3">
                <div
                  class="w-10 h-10 max-sm:w-8 max-sm:h-8 rounded-lg bg-[#ff3344]/10 flex items-center justify-center flex-shrink-0"
                >
                  <Icon
                    icon="mdi:crown"
                    class="w-5 h-5 max-sm:w-4 max-sm:h-4 text-[#ff3344]"
                  />
                </div>
                <div>
                  <h4
                    class="font-semibold text-[#f0eaea] mb-1 max-sm:text-sm max-[370px]:text-xs text-[0.9rem]"
                  >
                    {{ $t("your_current_vip") }}
                  </h4>
                  <p
                    class="text-sm max-lg:text-xs text-[#b37a7a] leading-relaxed"
                  >
                    {{ userData?.viplevel || "Bronze" }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Important Notice -->
          <div class="p-4 bg-amber-500/5 border-t border-amber-500/20">
            <div class="flex gap-3">
              <Icon
                icon="mdi:information"
                class="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5"
              />
              <div>
                <h4 class="font-semibold text-amber-400 mb-1 text-sm">
                  {{ $t("important_notice") }}
                </h4>
                <p class="text-xs text-[#f0eaea] leading-relaxed">
                  {{ $t("games_not_qualify") }}
                </p>
                <p class="text-xs text-[#b37a7a] mt-1.5">
                  <Icon
                    icon="mdi:information-outline"
                    class="inline-block mr-1"
                  />
                  {{ $t("valid_turnover_info") }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          class="bg-[#241017] border border-[#3b1c23] rounded-xl overflow-hidden"
        >
          <div class="p-4 border-b border-[#3b1c23]">
            <h3
              class="font-bold text-[#f0eaea] text-base max-lg:text-sm flex items-center gap-2"
            >
              {{ $t("rebate_rates_vip") }}
            </h3>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-[#15090e]">
                <tr>
                  <th
                    class="min-w-[120px] py-3 px-4 text-left text-sm max-lg:text-xs font-semibold text-[#f0eaea]"
                  >
                    {{ $t("game_type") }}
                  </th>
                  <!-- <th
                    v-for="level in settingsData.vipLevels"
                    :key="level.name"
                    class="py-3 px-4 text-center text-xs font-semibold text-[#f0eaea]"
                  >
                    {{ level.name }}
                  </th> -->
                  <th
                    v-for="level in settingsData.vipLevels"
                    :key="level.name"
                    class="py-3 px-4 text-center text-xs font-semibold text-[#f0eaea]"
                  >
                    <img :src="level.iconUrl" alt="" class="w-12 mx-auto" />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  class="border-t border-[#3b1c23] hover:bg-[#15090e]/50 transition-colors"
                >
                  <td
                    class="py-3 px-4 text-sm max-lg:text-xs text-[#f0eaea] font-medium"
                  >
                    {{ $t("slots") }}
                  </td>
                  <td
                    v-for="level in settingsData.vipLevels"
                    :key="`slots-${level.name}`"
                    class="py-3 px-4 text-sm max-lg:text-xs text-[#b37a7a] text-center"
                  >
                    {{
                      level.benefits && level.benefits["Rebate Slot"]
                        ? formatNumber(
                            level.benefits["Rebate Slot"],
                            "Rebate Slot"
                          ) + "%"
                        : "-"
                    }}
                  </td>
                </tr>
                <tr
                  class="border-t border-[#3b1c23] hover:bg-[#15090e]/50 transition-colors"
                >
                  <td
                    class="py-3 px-4 text-sm max-lg:text-xs text-[#f0eaea] font-medium"
                  >
                    {{ $t("live_casino") }}
                  </td>
                  <td
                    v-for="level in settingsData.vipLevels"
                    :key="`live-${level.name}`"
                    class="py-3 px-4 text-sm max-lg:text-xs text-[#b37a7a] text-center"
                  >
                    {{
                      level.benefits && level.benefits["Rebate Live Casino"]
                        ? formatNumber(
                            level.benefits["Rebate Live Casino"],
                            "Rebate Live Casino"
                          ) + "%"
                        : "-"
                    }}
                  </td>
                </tr>
                <tr
                  class="border-t border-[#3b1c23] hover:bg-[#15090e]/50 transition-colors"
                >
                  <td
                    class="py-3 px-4 text-sm max-lg:text-xs text-[#f0eaea] font-medium"
                  >
                    {{ $t("sports_esports") }}
                  </td>
                  <td
                    v-for="level in settingsData.vipLevels"
                    :key="`sports-${level.name}`"
                    class="py-3 px-4 text-sm max-lg:text-xs text-[#b37a7a] text-center"
                  >
                    {{
                      level.benefits &&
                      level.benefits["Rebate Sports & Esports"]
                        ? formatNumber(
                            level.benefits["Rebate Sports & Esports"],
                            "Rebate Sports & Esports"
                          ) + "%"
                        : "-"
                    }}
                  </td>
                </tr>
                <tr
                  class="border-t border-[#3b1c23] hover:bg-[#15090e]/50 transition-colors"
                >
                  <td
                    class="py-3 px-4 text-sm max-lg:text-xs text-[#f0eaea] font-medium"
                  >
                    {{ $t("lottery") }}
                  </td>
                  <td
                    v-for="level in settingsData.vipLevels"
                    :key="`lottery-${level.name}`"
                    class="py-3 px-4 text-sm max-lg:text-xs text-[#b37a7a] text-center italic"
                  >
                    N/A
                  </td>
                </tr>
                <tr
                  class="border-t border-[#3b1c23] hover:bg-[#15090e]/50 transition-colors"
                >
                  <td
                    class="py-3 px-4 text-sm max-lg:text-xs text-[#f0eaea] font-medium"
                  >
                    {{ $t("fishing_games") }}
                  </td>
                  <td
                    v-for="level in settingsData.vipLevels"
                    :key="`fishing-${level.name}`"
                    class="py-3 px-4 text-sm max-lg:text-xs text-[#b37a7a] text-center italic"
                  >
                    N/A
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="p-4 bg-[#15090e]/30 border-t border-[#3b1c23]">
            <p class="text-xs text-[#b37a7a] italic">
              {{ $t("rebate_rates_note") }}
            </p>
          </div>
        </div>

        <div
          class="bg-[#241017] border border-[#3b1c23] rounded-xl overflow-hidden"
        >
          <div class="p-4 border-b border-[#3b1c23]">
            <h3
              class="font-bold text-[#f0eaea] text-base max-lg:text-sm flex items-center gap-2"
            >
              {{ $t("how_rebates_work") }}
            </h3>
          </div>

          <div class="p-4 space-y-4">
            <div class="flex gap-2">
              <div
                class="w-5 h-5 rounded-full bg-gradient-to-br from-[#ff3344] to-[#cc2a3a] text-white flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-lg shadow-[#ff3344]/30"
              >
                1
              </div>
              <div class="flex-1">
                <h4
                  class="font-semibold text-[#f0eaea] max-sm:text-sm max-[370px]:text-xs text-[0.9rem] mb-0.5"
                >
                  {{ $t("play_eligible_games") }}
                </h4>
                <p
                  class="text-sm max-lg:text-xs text-[#b37a7a] leading-relaxed"
                >
                  {{ $t("play_eligible_description") }}
                </p>
              </div>
            </div>

            <div class="flex gap-2">
              <div
                class="w-5 h-5 rounded-full bg-gradient-to-br from-[#ff3344] to-[#cc2a3a] text-white flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-lg shadow-[#ff3344]/30"
              >
                2
              </div>
              <div class="flex-1">
                <h4
                  class="font-semibold text-[#f0eaea] max-sm:text-sm max-[370px]:text-xs text-[0.9rem] mb-0.5"
                >
                  {{ $t("automatic_calculation") }}
                </h4>
                <p
                  class="text-sm max-lg:text-xs text-[#b37a7a] leading-relaxed"
                >
                  {{ $t("automatic_calculation_description") }}
                </p>
              </div>
            </div>
            <div class="flex gap-2">
              <div
                class="w-5 h-5 rounded-full bg-gradient-to-br from-[#ff3344] to-[#cc2a3a] text-white flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-lg shadow-[#ff3344]/30"
              >
                3
              </div>
              <div class="flex-1">
                <h4
                  class="font-semibold text-[#f0eaea] max-sm:text-sm max-[370px]:text-xs text-[0.9rem] mb-0.5"
                >
                  {{ $t("claim_your_rewards") }}
                </h4>
                <p
                  class="text-sm max-lg:text-xs text-[#b37a7a] leading-relaxed"
                >
                  {{ $t("claim_rewards_description") }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UserAccountLayout>
</template>

<script setup>
import UserAccountLayout from "~/layouts/UserAccountLayout.vue";
import { Icon } from "@iconify/vue";

const settingsData = ref({
  tableTitle: "VIP Exclusive Benefits",
  rowHeaders: [],
  vipLevels: [],
  terms: {
    en: "",
    zh: "",
  },
});
const isLoading = ref(true);
const claimButtonLoading = ref(false);
const userData = useState("userData");
const { get, post } = useApiEndpoint();
const { showAlert } = useAlert();

const showTurnoverModal = ref(false);
const turnoverDetails = ref({
  required: 0,
  current: 0,
  remaining: 0,
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
  if (isNaN(number)) {
    return value;
  }
  if (rowName === "Withdraw Limit" || rowName === "Total Deposit") {
    return number.toLocaleString("en-US", {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    });
  } else {
    return number.toLocaleString("en-US", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  }
};

const fetchSettings = async () => {
  try {
    const { data } = await get("vipsettings");
    if (data?.success) {
      settingsData.value = data.data[0];
      console.log(settingsData.value);
    }
  } catch (error) {
    console.error("Error fetching VIP settings:", error);
  }
};

const claimRebate = async () => {
  claimButtonLoading.value = true;
  try {
    const { data } = await post("rebatemanualclaim");
    if (data.success) {
      showAlert($t("alert_success"), $t("rebate_claim_success"), "success");
    } else {
      const isTurnoverError =
        data.message?.en
          ?.toLowerCase()
          .includes("turnover requirement not met") ||
        data.message?.zh?.includes("流水要求未达到") ||
        data.message?.ms
          ?.toLowerCase()
          .includes("keperluan pusing ganti tidak dipenuhi");

      if (isTurnoverError && data.turnoverDetails) {
        turnoverDetails.value = {
          required: data.turnoverDetails.required || 0,
          current: data.turnoverDetails.current || 0,
          remaining: data.turnoverDetails.remaining || 0,
        };
        showTurnoverModal.value = true;
      } else {
        showAlert(
          $t("alert_info"),
          data.message[$locale.value] || data.message.en,
          "info"
        );
      }
    }
  } catch (error) {
    console.error("Error claiming rebate:", error);
    showAlert(
      "Error",
      error.response?.data?.message || "Network error. Please try again.",
      "error"
    );
  } finally {
    claimButtonLoading.value = false;
  }
};

onMounted(async () => {
  await fetchSettings();
  isLoading.value = false;
});
</script>
