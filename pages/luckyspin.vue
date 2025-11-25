<template>
  <ClientOnly>
    <div class="bg-[#0a0005] min-h-screen">
      <!-- Main Lucky Spin Section -->
      <section class="containerWid px-6 py-8 max-lg:px-4 max-lg:py-6">
        <!-- Game Area -->
        <div class="relative mb-8 max-lg:mb-6">
          <div
            class="bg-[#15090e] rounded-xl border border-[#3b1c23]/50 overflow-hidden"
          >
            <div
              class="relative flex justify-center py-16 px-4 max-lg:px-3 max-lg:py-12"
              style="
                background: linear-gradient(135deg, #1a0d13 0%, #0f0509 100%);
              "
            >
              <div
                class="flex items-center justify-center gap-8 max-lg:gap-6 max-lg:flex-col relative w-full max-w-7xl"
              >
                <!-- Center Section - Wheel -->
                <div
                  class="relative w-[65%] max-lg:w-full max-lg:max-w-md flex flex-col items-center"
                >
                  <!-- Wheel Container with Frame -->
                  <div class="relative w-[60%] max-lg:w-full">
                    <!-- Rotating Wheel -->
                    <img
                      src="/images/luckyspin/wheel-prize.png"
                      alt="Wheel Prize"
                      class="w-full h-auto transition-transform duration-[4s] ease-in-out"
                      :style="{ transform: `rotate(${rotation}deg)` }"
                    />

                    <!-- Static Frame Overlay -->
                    <img
                      src="/images/luckyspin/wheel-frame.png"
                      alt="Wheel Frame"
                      class="absolute left-[46%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-auto pointer-events-none z-10"
                      style="transform: translate(-50%, -50%) scale(1.25)"
                    />
                  </div>

                  <!-- Spin Button -->
                  <img
                    src="/images/luckyspin/spin.png"
                    alt="Spin Button"
                    class="w-[5%] max-lg:w-[10%] h-auto absolute left-1/2 top-[38%] max-xl:top-[35%] -translate-x-1/2 cursor-pointer z-50 transition-transform lg:hover:scale-110"
                    @click="spinWheel"
                  />

                  <!-- Click to Spin Indicator -->
                  <!-- <div
                    class="absolute top-[59%] left-[40%] -translate-x-1/2 z-40 pointer-events-none animate-bounce rounded-lg w-[21%] max-2xl:w-[25%] max-2xl:left-[38%] max-xl:w-[30%] max-xl:left-[35%] max-lg:w-[100px] max-lg:left-[41.5%] max-lg:top-[62%] max-sm:left-[38%] max-sm:w-[25%]"
                  >
                    <div
                      class="bg-gradient-to-b from-yellow-300 to-amber-500 px-2 py-1 max-lg:px-2 max-sm:py-1 rounded-lg border-2 border-yellow-600 transform rotate-0 flex justify-center shadow-lg shadow-yellow-500/50"
                    >
                      <span class="text-blue-900 font-bold text-xs text-nowrap">
                        {{ $t("click_to_spin") || "Click to Spin!" }}
                      </span>
                      <div class="absolute left-1/2 -top-5 -translate-x-1/2">
                        <Icon
                          icon="raphael:arrowup"
                          class="w-5 h-auto text-amber-500"
                        />
                      </div>
                    </div>
                  </div> -->

                  <!-- Text Box with Available Points -->
                  <div
                    class="relative w-full mt-8 max-lg:mt-8 flex justify-center"
                  >
                    <img
                      src="/images/luckyspin/text-box.png"
                      alt="Text Box"
                      class="w-[50%] max-xl:w-[60%] max-lg:w-[90%] h-auto"
                    />
                    <div
                      class="absolute inset-0 flex items-center justify-center"
                    >
                      <p
                        class="text-white font-bold text-lg max-lg:text-base max-sm:text-sm text-center px-4"
                      >
                        {{ $t("you_have") || "You have" }}
                        <span class="text-white">{{
                          userData?.luckySpinPoints || 0
                        }}</span>
                        {{ $t("points_available") || "Points available" }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Right Section - Leaderboard with Tabs -->
                <div
                  class="w-[35%] max-lg:w-full max-lg:max-w-sm h-full max-h-[600px] max-lg:max-h-[500px] pt-16 max-lg:pt-12"
                >
                  <div
                    class="bg-[#241017]/60 rounded-xl border border-[#3b1c23] shadow-lg shadow-red-500/20 h-full flex flex-col"
                  >
                    <!-- Tabs Header with Icon -->
                    <div class="relative">
                      <!-- Leaderboard Icon -->
                      <div
                        class="absolute top-[-110%] left-1/2 -translate-x-1/2 z-10"
                      >
                        <img
                          src="/images/luckyspin/leaderboard.png"
                          alt="Leaderboard"
                          class="w-32 max-lg:w-24 h-auto object-contain"
                        />
                      </div>

                      <!-- Tabs Buttons -->
                      <div
                        class="flex border-b border-[#3b1c23] pt-4 max-lg:pt-3 px-4 max-lg:px-3 pb-4 max-lg:pb-3 gap-2 text-nowrap"
                      >
                        <button
                          @click="activeLeaderboardTab = 'winners'"
                          class="flex-1 py-3 px-4 max-lg:py-2.5 max-lg:px-3 max-sm:py-2 max-sm:px-2 font-semibold transition-all text-sm max-lg:text-xs max-sm:text-[10px] rounded-full"
                          :class="
                            activeLeaderboardTab === 'winners'
                              ? 'bg-gradient-to-r from-[#a1122d] to-[#c21b3a] text-white'
                              : 'bg-[#15090e] text-[#b37a7a] lg:hover:text-[#f0eaea]'
                          "
                        >
                          <i class="bi bi-trophy mr-1 max-sm:mr-0.5"></i>
                          {{ $t("winner_list") || "Winner List" }}
                        </button>
                        <button
                          @click="handleRecordsTabClick"
                          class="flex-1 py-3 px-4 max-lg:py-2.5 max-lg:px-3 max-sm:py-2 max-sm:px-2 font-semibold transition-all text-sm max-lg:text-xs max-sm:text-[10px] rounded-full"
                          :class="
                            activeLeaderboardTab === 'records'
                              ? 'bg-gradient-to-r from-[#a1122d] to-[#c21b3a] text-white'
                              : 'bg-[#15090e] text-[#b37a7a] lg:hover:text-[#f0eaea]'
                          "
                        >
                          <i class="bi bi-clock-history mr-1 max-sm:mr-0.5"></i>
                          {{ $t("winning_record") || "Winning Record" }}
                        </button>
                      </div>
                    </div>

                    <!-- Tab Content -->
                    <div
                      ref="scrollContainer"
                      class="flex-1 overflow-y-auto custom-scrollbar bg-[#15090e] rounded-b-xl"
                      @mouseenter="pauseScroll"
                      @mouseleave="resumeScroll"
                    >
                      <!-- Winner List Tab -->
                      <div
                        v-show="activeLeaderboardTab === 'winners'"
                        class="p-4 max-lg:p-3 max-sm:p-2"
                      >
                        <div
                          v-if="bigwinner.length === 0"
                          class="text-center py-8 text-[#b37a7a] text-sm max-sm:text-xs"
                        >
                          {{ $t("no_winners_yet") || "No winners yet" }}
                        </div>
                        <div v-else class="space-y-2 max-sm:space-y-1.5">
                          <div
                            v-for="(log, index) in bigwinner"
                            :key="index"
                            class="bg-[#241017]/60 rounded-lg p-3 max-lg:p-2 max-sm:p-1.5 border border-[#3b1c23]/50 hover:border-[#ff3344]/30 transition-all"
                          >
                            <div
                              class="flex items-center justify-between mb-1 max-sm:mb-0.5"
                            >
                              <span
                                class="text-white font-bold text-sm max-lg:text-xs max-sm:text-[10px]"
                                >{{ maskUsername(log.playerusername) }}</span
                              >
                            </div>
                            <div
                              class="text-[#b37a7a] text-xs max-sm:text-[10px]"
                            >
                              {{ formatDate(log.createdAt) }}
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Winning Record Tab -->
                      <div
                        v-show="activeLeaderboardTab === 'records'"
                        class="p-4 max-lg:p-3 max-sm:p-2"
                      >
                        <div
                          v-if="winningRecords.length === 0"
                          class="text-center py-8 text-[#b37a7a] text-sm max-sm:text-xs"
                        >
                          {{ $t("no_records_yet") || "No records yet" }}
                        </div>
                        <div v-else class="space-y-2 max-sm:space-y-1.5">
                          <div
                            v-for="(record, index) in winningRecords"
                            :key="index"
                            class="bg-[#241017]/60 rounded-lg p-3 max-lg:p-2 max-sm:p-1.5 border border-[#3b1c23]/50 hover:border-[#ff3344]/30 transition-all"
                          >
                            <div
                              class="flex items-center justify-between mb-1 max-sm:mb-0.5"
                            >
                              <span
                                class="text-white font-bold text-sm max-lg:text-xs max-sm:text-[10px]"
                              >
                                {{ userData.username }}
                              </span>
                              <span
                                class="font-semibold text-sm max-lg:text-xs max-sm:text-[10px]"
                                :class="
                                  record.amount > 0
                                    ? 'text-[#ff3344]'
                                    : 'text-[#b37a7a]'
                                "
                              >
                                {{
                                  record.amount > 0
                                    ? `MYR ${record.amount}`
                                    : $t("better_luck") || "Better Luck"
                                }}
                              </span>
                            </div>
                            <div
                              class="text-[#b37a7a] text-xs max-sm:text-[10px]"
                            >
                              {{ formatDate(record.createdAt) }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Prize Structure Section -->
        <div class="mb-8 max-lg:mb-6">
          <div class="mb-6 max-lg:mb-4">
            <h2
              class="text-2xl font-bold text-[#f0eaea] mb-2 max-lg:text-xl max-sm:text-lg"
            >
              {{ $t("prize_structure") || "Prize Structure" }}
            </h2>
            <p class="text-sm text-[#b37a7a] max-lg:text-xs">
              {{
                $t("check_out_amazing_prizes") ||
                "Check out the amazing prizes you can win"
              }}
            </p>
          </div>

          <div
            class="grid grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-6 max-lg:gap-4"
          >
            <!-- Prize 1 - Grand Prize -->
            <div
              class="bg-[#15090e] rounded-xl p-6 max-lg:p-4 border border-[#3b1c23]/50 hover:border-[#ff3344]/50 transition-all duration-200"
            >
              <div class="flex justify-center mb-4 max-lg:mb-3">
                <img
                  src="/images/luckyspin/prize-level1.png"
                  alt="Grand Prize"
                  class="w-20 h-20 max-lg:w-16 max-lg:h-16 object-contain"
                />
              </div>
              <h3
                class="text-lg font-semibold text-[#f0eaea] mb-2 text-center max-lg:text-base max-lg:mb-1"
              >
                {{ $t("grand_prize") || "Grand Prize" }}
              </h3>
              <p
                class="text-3xl font-bold text-[#ff3344] text-center mb-2 max-lg:text-2xl"
              >
                MYR 188
              </p>
              <p
                class="text-sm text-[#b37a7a] text-center leading-relaxed max-lg:text-xs"
              >
                {{ $t("grand_prize_desc") || "Lucky jackpot winner" }}
              </p>
            </div>

            <!-- Prize 2 - Major Prize -->
            <div
              class="bg-[#15090e] rounded-xl p-6 max-lg:p-4 border border-[#3b1c23]/50 hover:border-[#ff3344]/50 transition-all duration-200"
            >
              <div class="flex justify-center mb-4 max-lg:mb-3">
                <img
                  src="/images/luckyspin/prize-level2.png"
                  alt="Grand Prize"
                  class="w-20 h-20 max-lg:w-16 max-lg:h-16 object-contain"
                />
              </div>
              <h3
                class="text-lg font-semibold text-[#f0eaea] mb-2 text-center max-lg:text-base max-lg:mb-1"
              >
                {{ $t("major_prize") || "Major Prize" }}
              </h3>
              <p
                class="text-2xl font-bold text-[#ff3344] text-center mb-2 max-lg:text-xl"
              >
                MYR 68
              </p>
              <p
                class="text-sm text-[#b37a7a] text-center leading-relaxed max-lg:text-xs"
              >
                {{ $t("major_prize_desc") || "Excellent spin result" }}
              </p>
            </div>

            <!-- Prize 3 - Big Prize -->
            <div
              class="bg-[#15090e] rounded-xl p-6 max-lg:p-4 border border-[#3b1c23]/50 hover:border-[#ff3344]/50 transition-all duration-200"
            >
              <div class="flex justify-center mb-4 max-lg:mb-3">
                <img
                  src="/images/luckyspin/prize-level3.png"
                  alt="Grand Prize"
                  class="w-20 h-20 max-lg:w-16 max-lg:h-16 object-contain"
                />
              </div>
              <h3
                class="text-lg font-semibold text-[#f0eaea] mb-2 text-center max-lg:text-base max-lg:mb-1"
              >
                {{ $t("big_prize") || "Big Prize" }}
              </h3>
              <p
                class="text-2xl font-bold text-[#ff3344] text-center mb-2 max-lg:text-xl"
              >
                MYR 38
              </p>
              <p
                class="text-sm text-[#b37a7a] text-center leading-relaxed max-lg:text-xs"
              >
                {{ $t("big_prize_desc") || "Great winning" }}
              </p>
            </div>

            <!-- Prize 4 - Medium Prize -->
            <div
              class="bg-[#15090e] rounded-xl p-6 max-lg:p-4 border border-[#3b1c23]/50 hover:border-[#ff3344]/50 transition-all duration-200"
            >
              <div class="flex justify-center mb-4 max-lg:mb-3">
                <img
                  src="/images/luckyspin/prize-level4.png"
                  alt="Grand Prize"
                  class="w-20 h-20 max-lg:w-16 max-lg:h-16 object-contain"
                />
              </div>
              <h3
                class="text-lg font-semibold text-[#f0eaea] mb-2 text-center max-lg:text-base max-lg:mb-1"
              >
                {{ $t("medium_prize") || "Medium Prize" }}
              </h3>
              <p
                class="text-2xl font-bold text-[#ff3344] text-center mb-2 max-lg:text-xl"
              >
                MYR 18
              </p>
              <p
                class="text-sm text-[#b37a7a] text-center leading-relaxed max-lg:text-xs"
              >
                {{ $t("medium_prize_desc") || "Nice reward" }}
              </p>
            </div>

            <!-- Additional Prizes Row -->
            <div
              class="bg-[#15090e] rounded-xl p-6 max-lg:p-4 border border-[#3b1c23]/50 hover:border-[#ff3344]/30 transition-all duration-200"
            >
              <div class="flex justify-center mb-4 max-lg:mb-3">
                <img
                  src="/images/luckyspin/prize-level5.png"
                  alt="Grand Prize"
                  class="w-20 h-20 max-lg:w-16 max-lg:h-16 object-contain"
                />
              </div>
              <h3
                class="text-lg font-semibold text-[#f0eaea] mb-2 text-center max-lg:text-base max-lg:mb-1"
              >
                {{ $t("small_prize") || "Small Prize" }}
              </h3>
              <p
                class="text-xl font-bold text-[#ff3344] text-center mb-2 max-lg:text-lg"
              >
                MYR 8
              </p>
              <p
                class="text-sm text-[#b37a7a] text-center leading-relaxed max-lg:text-xs"
              >
                {{ $t("small_prize_desc") || "Better than nothing" }}
              </p>
            </div>

            <div
              class="bg-[#15090e] rounded-xl p-6 max-lg:p-4 border border-[#3b1c23]/50 hover:border-[#ff3344]/30 transition-all duration-200"
            >
              <div class="flex justify-center mb-4 max-lg:mb-3">
                <img
                  src="/images/luckyspin/prize-level6.png"
                  alt="Grand Prize"
                  class="w-20 h-20 max-lg:w-16 max-lg:h-16 object-contain"
                />
              </div>
              <h3
                class="text-lg font-semibold text-[#f0eaea] mb-2 text-center max-lg:text-base max-lg:mb-1"
              >
                {{ $t("mini_prize") || "Mini Prize" }}
              </h3>
              <p
                class="text-xl font-bold text-[#ff3344] text-center mb-2 max-lg:text-lg"
              >
                MYR 5
              </p>
              <p
                class="text-sm text-[#b37a7a] text-center leading-relaxed max-lg:text-xs"
              >
                {{ $t("mini_prize_desc") || "Small win" }}
              </p>
            </div>

            <div
              class="bg-[#15090e] rounded-xl p-6 max-lg:p-4 border border-[#3b1c23]/50 hover:border-[#ff3344]/30 transition-all duration-200"
            >
              <div class="flex justify-center mb-4 max-lg:mb-3">
                <img
                  src="/images/luckyspin/prize-level7.png"
                  alt="Grand Prize"
                  class="w-20 h-20 max-lg:w-16 max-lg:h-16 object-contain"
                />
              </div>
              <h3
                class="text-lg font-semibold text-[#f0eaea] mb-2 text-center max-lg:text-base max-lg:mb-1"
              >
                {{ $t("tiny_prize") || "Tiny Prize" }}
              </h3>
              <p
                class="text-xl font-bold text-[#ff3344] text-center mb-2 max-lg:text-lg"
              >
                MYR 3
              </p>
              <p
                class="text-sm text-[#b37a7a] text-center leading-relaxed max-lg:text-xs"
              >
                {{ $t("tiny_prize_desc") || "Consolation prize" }}
              </p>
            </div>

            <div
              class="bg-[#15090e] rounded-xl p-6 max-lg:p-4 border border-[#3b1c23]/50 hover:border-[#ff3344]/30 transition-all duration-200"
            >
              <div class="flex justify-center mb-4 max-lg:mb-3">
                <img
                  src="/images/luckyspin/prize-level8.png"
                  alt="Grand Prize"
                  class="w-20 h-20 max-lg:w-16 max-lg:h-16 object-contain"
                />
              </div>
              <h3
                class="text-lg font-semibold text-[#f0eaea] mb-2 text-center max-lg:text-base max-lg:mb-1"
              >
                {{ $t("better_luck_next_time") || "Better Luck" }}
              </h3>
              <p
                class="text-xl font-bold text-[#b37a7a] text-center mb-2 max-lg:text-lg"
              >
                MYR 0
              </p>
              <p
                class="text-sm text-[#b37a7a] text-center leading-relaxed max-lg:text-xs"
              >
                {{ $t("try_again") || "Try again next time" }}
              </p>
            </div>
          </div>
        </div>

        <!-- How to Play Section -->
        <div class="mb-8 max-lg:mb-6">
          <div class="mb-6 max-lg:mb-4">
            <h2
              class="text-2xl font-bold text-[#f0eaea] mb-2 max-lg:text-xl max-sm:text-lg"
            >
              {{ $t("how_to_play") }}
            </h2>
            <p class="text-sm text-[#b37a7a] max-lg:text-xs">
              {{ $t("learn_how_to_spin_win") }}
            </p>
          </div>

          <div class="grid grid-cols-3 max-lg:grid-cols-1 gap-6 max-lg:gap-4">
            <!-- Step 1 -->
            <div
              class="bg-[#15090e] rounded-xl p-6 max-lg:p-4 border border-[#3b1c23]/50 hover:border-[#ff3344]/30 transition-all duration-200"
            >
              <div
                class="w-16 h-16 max-lg:w-14 max-lg:h-14 bg-[#ff3344]/20 rounded-full flex items-center justify-center text-[#ff3344] mb-4 max-lg:mb-3"
              >
                <i class="bi bi-1-circle-fill text-3xl max-lg:text-2xl"></i>
              </div>
              <h3
                class="text-lg font-semibold text-[#f0eaea] mb-2 max-lg:text-base max-lg:mb-1"
              >
                {{ $t("step_1") }}
              </h3>
              <p class="text-sm text-[#b37a7a] leading-relaxed max-lg:text-xs">
                {{ $t("spin_rule_1", { points: luckySpinPointRate }) }}
              </p>
            </div>

            <!-- Step 2 -->
            <div
              class="bg-[#15090e] rounded-xl p-6 max-lg:p-4 border border-[#3b1c23]/50 hover:border-[#ff3344]/30 transition-all duration-200"
            >
              <div
                class="w-16 h-16 max-lg:w-14 max-lg:h-14 bg-[#ff3344]/20 rounded-full flex items-center justify-center text-[#ff3344] mb-4 max-lg:mb-3"
              >
                <i class="bi bi-2-circle-fill text-3xl max-lg:text-2xl"></i>
              </div>
              <h3
                class="text-lg font-semibold text-[#f0eaea] mb-2 max-lg:text-base max-lg:mb-1"
              >
                {{ $t("step_2") }}
              </h3>
              <p class="text-sm text-[#b37a7a] leading-relaxed max-lg:text-xs">
                {{ $t("spin_rule_2") }}
              </p>
            </div>

            <!-- Step 3 -->
            <div
              class="bg-[#15090e] rounded-xl p-6 max-lg:p-4 border border-[#3b1c23]/50 hover:border-[#ff3344]/30 transition-all duration-200"
            >
              <div
                class="w-16 h-16 max-lg:w-14 max-lg:h-14 bg-[#ff3344]/20 rounded-full flex items-center justify-center text-[#ff3344] mb-4 max-lg:mb-3"
              >
                <i class="bi bi-3-circle-fill text-3xl max-lg:text-2xl"></i>
              </div>
              <h3
                class="text-lg font-semibold text-[#f0eaea] mb-2 max-lg:text-base max-lg:mb-1"
              >
                {{ $t("win_prizes") }}
              </h3>
              <p class="text-sm text-[#b37a7a] leading-relaxed max-lg:text-xs">
                {{ $t("spin_rule_3") }}
              </p>
            </div>
          </div>
        </div>

        <!-- Terms & Conditions Section -->
        <div>
          <div
            class="bg-[#15090e] rounded-xl p-6 max-lg:p-4 border border-[#3b1c23]/50"
          >
            <h2
              class="text-2xl font-bold text-[#f0eaea] mb-4 max-lg:text-xl max-lg:mb-3 flex items-center gap-2"
            >
              <i class="bi bi-shield-check text-[#ff3344]"></i>
              {{ $t("terms_conditions") }}
            </h2>

            <div class="space-y-6 max-lg:space-y-4">
              <!-- How to Play -->
              <div
                class="bg-[#241017]/60 rounded-lg p-4 max-lg:p-3 border border-[#3b1c23]"
              >
                <h3
                  class="text-lg font-semibold text-[#ff3344] mb-3 max-lg:text-base max-lg:mb-2 flex items-center gap-2"
                >
                  <i class="bi bi-info-circle"></i>
                  {{ $t("how_to_play") }}
                </h3>
                <div class="space-y-2 text-[#f0eaea] text-sm max-lg:text-xs">
                  <p>
                    1. {{ $t("spin_rule_1", { points: luckySpinPointRate }) }}
                  </p>
                  <p>2. {{ $t("spin_rule_2") }}</p>
                  <p>3. {{ $t("spin_rule_3") }}</p>
                </div>
              </div>

              <!-- Prizes -->
              <div
                class="bg-[#241017]/60 rounded-lg p-4 max-lg:p-3 border border-[#3b1c23]"
              >
                <h3
                  class="text-lg font-semibold text-[#ff3344] mb-3 max-lg:text-base max-lg:mb-2 flex items-center gap-2"
                >
                  <i class="bi bi-gift"></i>
                  {{ $t("prizes") }}
                </h3>
                <ul
                  class="list-disc pl-5 space-y-1 text-[#f0eaea] text-sm max-lg:text-xs"
                >
                  <li>{{ $t("spin_prize_1") }}</li>
                  <li>{{ $t("spin_prize_2") }}</li>
                  <li>{{ $t("spin_prize_3") }}</li>
                  <li>{{ $t("spin_prize_4") }}</li>
                  <li>{{ $t("spin_prize_5") }}</li>
                  <li>{{ $t("spin_prize_6") }}</li>
                  <li>{{ $t("spin_prize_7") }}</li>
                  <li>{{ $t("spin_prize_8") }}</li>
                </ul>
              </div>

              <!-- Terms -->
              <div
                class="bg-[#241017]/60 rounded-lg p-4 max-lg:p-3 border border-[#3b1c23]"
              >
                <h3
                  class="text-lg font-semibold text-[#ff3344] mb-3 max-lg:text-base max-lg:mb-2 flex items-center gap-2"
                >
                  <i class="bi bi-file-text"></i>
                  {{ $t("important_terms") || "Important Terms" }}
                </h3>
                <div class="space-y-2 text-[#f0eaea] text-sm max-lg:text-xs">
                  <p>1. {{ $t("spin_terms_1") }}</p>
                  <p>2. {{ $t("spin_terms_2") }}</p>
                  <p>3. {{ $t("spin_terms_3") }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </ClientOnly>
</template>

<script setup>
import { Icon } from "@iconify/vue";

const pageLoading = useState("pageLoading");
const { get, post } = useApiEndpoint();
const rotation = ref(0);
const isSpinning = ref(false);
const userData = useState("userData");
const WinningAmount = ref(null);
const bigwinner = ref([]);
const winningRecords = ref([]);
const activeLeaderboardTab = ref("winners");
const luckySpinPointRate = useState("luckySpinPointRate");
const { showAlert } = useAlert();

const handleRecordsTabClick = () => {
  if (!userData.value) {
    showAlert($t("info"), $t("login_required_view_records"), "info");
    return;
  }
  activeLeaderboardTab.value = "records";
};

const spinWheel = async () => {
  if (!userData.value) {
    showAlert($t("info"), $t("login_required_spin"), "info");
    return;
  }
  if (userData.value.luckySpinPoints < luckySpinPointRate) {
    showAlert($t("info"), $t("no_spins_remaining"), "info");
    return;
  }
  if (isSpinning.value) return;

  isSpinning.value = true;
  try {
    const { data } = await post("luckySpinStartGame");
    if (data.success) {
      const randomPrize = data.prize;
      const targetAngle = randomPrize.angle;
      const currentRotation = rotation.value % 360;
      const extraRotation = (360 - currentRotation + targetAngle) % 360;
      const totalRotation = 360 * 5 + extraRotation;
      rotation.value += totalRotation;

      setTimeout(() => {
        if (randomPrize.value > 0) {
          showAlert(
            $t("congratulations"),
            `${$t("you_won")} MYR ${randomPrize.value}!`,
            "success"
          );
        } else {
          showAlert($t("better_luck"), $t("try_again_message"), "info");
        }
        fetchUserData();
        fetchBigWinner();
        fetchWinningRecords();
        isSpinning.value = false;
        WinningAmount.value = randomPrize.value;
      }, 4000);
    } else {
      isSpinning.value = false;
      showAlert(
        $t("info"),
        data.message[$locale.value] || data.message.en,
        "info"
      );
    }
  } catch (error) {
    isSpinning.value = false;
    showAlert(
      $t("error"),
      error.response?.data?.message?.[$locale.value] ||
        error.response?.data?.message?.en ||
        $t("network_error"),
      "error"
    );
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-MY", {
    timeZone: "Asia/Kuala_Lumpur",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

async function fetchBigWinner() {
  try {
    const { data } = await get("UserLuckySpinLog");

    if (data.success) {
      bigwinner.value = data.data;
    }
  } catch (error) {
    console.error("Error fetching BigWinner:", error);
  }
}

async function fetchWinningRecords() {
  try {
    const { data } = await get("MyLuckySpinLog");

    if (data.success) {
      winningRecords.value = data.data;
    }
  } catch (error) {
    console.error("Error fetching Winning Records:", error);
  }
}

async function fetchUserData() {
  try {
    const { data } = await get("userdata");
    if (data.success) {
      userData.value = data.user;
    }
  } catch (error) {
    console.error("Error fetching UserData:", error);
  }
}

const maskUsername = (username) => {
  if (!username) return "";
  const visiblePart = username.slice(0, 4);
  return visiblePart + "****";
};

const scrollContainer = ref(null);
let scrollInterval = null;

const startAutoScroll = () => {
  if (scrollInterval) clearInterval(scrollInterval);

  scrollInterval = setInterval(() => {
    if (!scrollContainer.value) return;

    const container = scrollContainer.value;
    const isAtBottom =
      container.scrollTop + container.clientHeight >=
      container.scrollHeight - 5;

    container.scrollTop = isAtBottom ? 0 : container.scrollTop + 1;
  }, 50);
};

const pauseScroll = () => {
  if (scrollInterval) {
    clearInterval(scrollInterval);
    scrollInterval = null;
  }
};

const resumeScroll = () => {
  if (activeLeaderboardTab.value === "winners" && bigwinner.value.length > 5) {
    startAutoScroll();
  }
};

watch(activeLeaderboardTab, (newTab) => {
  pauseScroll();
  if (scrollContainer.value) scrollContainer.value.scrollTop = 0;
  if (newTab === "winners" && bigwinner.value.length > 5) {
    setTimeout(startAutoScroll, 500);
  }
});

onMounted(async () => {
  try {
    await fetchBigWinner();
    if (userData.value) await fetchWinningRecords();
    if (
      bigwinner.value.length > 5 &&
      activeLeaderboardTab.value === "winners"
    ) {
      setTimeout(startAutoScroll, 1000);
    }
  } finally {
    pageLoading.value = false;
  }
});

onUnmounted(() => {
  pauseScroll();
});
useHead({
  title: "BM8 | Lucky Spin - Win Amazing Prizes Daily",
  meta: [
    {
      property: "og:title",
      content: "BM8 | Lucky Spin Challenge - Spin & Win",
    },
    {
      name: "description",
      content:
        "Try your luck with BM8's Lucky Spin! Spin the wheel daily for a chance to win amazing cash prizes. Multiple prize tiers, fair play guaranteed, and instant rewards.",
    },
    {
      name: "keywords",
      content:
        "BM8 lucky spin, spin to win, daily prizes, casino wheel, lucky draw, instant rewards, Malaysia casino games, spin wheel prizes",
    },
  ],
  htmlAttrs: { lang: "en" },
  link: [
    { rel: "canonical", href: "https://www.bm8my.vip/luckyspin" },
    {
      rel: "alternate",
      hreflang: "x-default",
      href: "https://www.bm8my.vip/luckyspin",
    },
    {
      rel: "alternate",
      hreflang: "en",
      href: "https://www.bm8my.vip/luckyspin",
    },
  ],
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #15090e;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #ff3344;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #c21b3a;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.5s ease forwards;
}
</style>
