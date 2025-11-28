<template>
  <ClientOnly>
    <Alerts
      :title="alertTitle"
      :message="alertMessage"
      :isVisible="alertVisible"
      :type="alertType"
      @close="alertVisible = false"
    />
    <PageLoading v-if="pageLoading" />
    <div>
      <section
        class="relative max-lg:max-w-[100vw] shadow-lg shadow-red-600/20"
      >
        <img
          src="/images/banner/slot_banner_desktop.png"
          alt="Promotions and Bonuses Banner"
          class="w-full h-auto lg:block hidden"
        />
        <img
          src="/images/banner/slot_banner_mobile.png"
          alt="Promotions and Bonuses Banner"
          class="w-full h-auto lg:hidden block"
        />
      </section>

      <section
        class="py-4 px-16 max-lg:pt-4 max-lg:pb-2 max-lg:px-4 border-t border-[#3b1c23]"
      >
        <div>
          <div class="flex justify-between items-center">
            <div>
              <h2 class="homeMainTxt3 font-bold text-[#f0eaea]">
                {{ $t("slot_games") }}
              </h2>
              <p class="text-[#b37a7a] mt-1 titletext">
                {{ $t("choose_gaming_providers") }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Slot Kiosks-->
      <section class="py-4 px-8 max-lg:py-2 max-lg:px-3">
        <div
          class="flex flex-wrap gap-4 justify-center max-lg:flex-nowrap max-lg:overflow-x-auto max-lg:justify-start max-lg:scrollbar-hide max-lg:-mx-2 max-lg:px-2 max-lg:pb-2"
        >
          <div
            v-for="provider in slotKiosks"
            :key="provider._id"
            @click="selectGame(provider)"
            class="relative cursor-pointer group max-lg:flex-none"
          >
            <div
              v-if="isGameLocked(provider.databaseName)"
              class="absolute inset-0 bg-black/60 flex items-center justify-center z-20 rounded-lg"
            ></div>

            <div
              class="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 max-lg:px-3 max-lg:py-1.5"
              :class="
                currentKiosk?._id === provider._id
                  ? 'bg-[#a1122d] border-2 border-[#ff3344]'
                  : 'bg-[#15090e] lg:hover:bg-[#2a0f14] border-2 border-[#3b1c23]'
              "
            >
              <div
                class="w-12 h-12 flex items-center justify-center mb-1 max-lg:w-10 max-lg:h-10"
              >
                <img
                  :src="provider.banner"
                  :alt="provider.name"
                  class="max-w-full max-h-full object-contain"
                />
              </div>
              <span
                class="text-sm font-medium max-lg:text-xs max-lg:whitespace-nowrap"
                :class="
                  currentKiosk?._id === provider._id
                    ? 'text-white'
                    : 'text-[#b37a7a]'
                "
              >
                {{ provider.name }}
              </span>
              <div
                v-if="
                  provider.isHotGame && !isGameLocked(provider.databaseName)
                "
                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded shadow-sm max-lg:text-[10px] max-lg:px-1 max-lg:py-0 max-lg:top-0 max-lg:right-0"
              >
                {{ $t("hot") }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Game List -->
      <section
        v-if="
          currentKiosk && !currentKiosk.isManualGame && !currentKiosk.isHTMLGame
        "
        class="py-10 px-16 max-xl:px-8 max-lg:px-4 max-lg:py-4 bg-[#160a0f]"
      >
        <div>
          <div
            class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6 max-lg:mb-4 max-lg:gap-3"
          >
            <div>
              <h2 class="text-2xl font-bold text-[#f0eaea] max-lg:text-base">
                {{ currentKiosk.name }} {{ $t("games") }}
              </h2>
              <p class="text-[#b37a7a] mt-1 max-lg:text-xs">
                {{
                  $t("showing_games", {
                    shown: paginatedGames.length,
                    total: filteredGameList.length,
                  })
                }}
              </p>
            </div>
            <div class="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div class="relative flex-grow">
                <input
                  type="text"
                  v-model="searchTerm"
                  :placeholder="$t('search_games')"
                  class="w-full px-5 py-3 max-lg:py-2 rounded-lg bg-[#241017] border border-[#3b1c23] text-[#f0eaea] focus:outline-none focus:ring-2 focus:ring-[#ff3344] focus:border-transparent pl-12 shadow-sm placeholder:text-[#b37a7a]"
                />
                <i
                  class="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-[#b37a7a]"
                ></i>
              </div>
            </div>
          </div>

          <div
            v-if="paginatedGames.length > 0"
            class="grid grid-cols-8 max-2xl:grid-cols-6 max-lg:grid-cols-5 max-md:grid-cols-4 max-sm:grid-cols-3 gap-5 max-lg:gap-3"
          >
            <div
              v-for="game in paginatedGames"
              :key="game.GameCode"
              @click="
                launchGame({
                  ...currentKiosk,
                  gameCode: game.GameCode,
                  gameType: game.GameType,
                })
              "
              class="bg-[#241017] rounded-xl overflow-hidden cursor-pointer shadow-sm transition-all duration-300 group border border-[#3b1c23] lg:hover:shadow-md lg:hover:shadow-red-500/20 lg:hover:border-[#ff3344]/50"
            >
              <div class="relative overflow-hidden">
                <div
                  class="w-full aspect-square flex items-center justify-center bg-[#15090e]"
                >
                  <img
                    :src="
                      ($i18n.locale === 'zh' && game.GameImageZH) ||
                      ($i18n.locale === 'ms' && game.GameImageMS) ||
                      game.GameImage ||
                      `https://placehold.co/300x300/241017/f0eaea?text=${encodeURIComponent(
                        getLocalizedGameName(game)
                      )}`
                    "
                    :alt="getLocalizedGameName(game)"
                    class="max-w-full max-h-full object-contain transition-transform duration-200"
                    @error="handleImageError(game)"
                  />

                  <div
                    class="max-lg:hidden absolute inset-0 bg-black/30 opacity-0 lg:group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl"
                  >
                    <button
                      class="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#a1122d] to-[#c21b3a] text-white font-semibold rounded-lg shadow-lg transform scale-90 lg:group-hover:scale-100 lg:group-hover:brightness-110 transition-all duration-300"
                    >
                      <Icon
                        icon="mdi:lightning-bolt"
                        class="text-white text-base"
                      />
                      <p class="max-2xl:text-xs">{{ $t("play_now") }}</p>
                    </button>
                  </div>
                  <div
                    v-if="game.Hot"
                    class="absolute top-0 right-0 bg-gradient-to-r from-[#a1122d] to-[#c21b3a] text-white text-xs font-semibold px-2 py-0.5 rounded-bl-lg rounded-tr-lg shadow-lg flex items-center gap-1 z-10"
                  >
                    <Icon icon="mdi:star" class="text-yellow-300" />
                    {{ $t("top") }}
                  </div>
                </div>
              </div>

              <div class="border-t border-[#3b1c23]">
                <div
                  class="p-2 pt-3 text-center max-lg:h-12 h-16 flex items-center justify-center"
                >
                  <h4
                    class="text-sm max-md:text-xs font-medium text-[#f0eaea] break-words hyphens-auto line-clamp-2"
                  >
                    {{ getLocalizedGameName(game) }}
                  </h4>
                </div>

                <div class="px-2 pb-2.5 flex justify-center h-8">
                  <div
                    v-if="game.RTP"
                    class="flex items-center justify-center gap-2"
                  >
                    <div class="h-0.5 w-4 bg-[#3b1c23] rounded-full"></div>
                    <div
                      class="flex items-center bg-[#15090e] rounded-full px-2 py-0.5 border border-[#3b1c23]"
                    >
                      <span
                        class="text-xs font-medium text-amber-500 flex items-center gap-1"
                      >
                        <Icon
                          icon="mdi:trophy"
                          class="text-amber-500 text-xs"
                        />
                        {{ game.RTP }}
                      </span>
                    </div>
                    <div class="h-0.5 w-4 bg-[#3b1c23] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- No Games Found  -->
          <div
            v-else
            class="text-center py-20 bg-[#241017] rounded-xl shadow-sm border border-[#3b1c23]"
          >
            <div
              class="w-24 h-24 mx-auto bg-[#15090e] rounded-full flex items-center justify-center text-[#b37a7a] mb-6 border border-[#3b1c23]"
            >
              <i class="bi bi-search text-4xl"></i>
            </div>
            <h3 class="text-xl font-medium text-[#f0eaea] mb-3">
              {{ $t("no_games_found") }}
            </h3>
            <p class="text-[#b37a7a] max-w-lg mx-auto">
              {{ $t("no_games_message") }}
            </p>
            <button
              @click="searchTerm = ''"
              class="mt-6 px-6 py-2.5 bg-[#a1122d] text-white rounded-lg font-medium lg:hover:bg-[#c21b3a] transition-colors"
            >
              {{ $t("clear_search") }}
            </button>
          </div>

          <!-- Pagination -->
          <div
            v-if="filteredGameList.length > gamesPerPage"
            class="flex justify-center mt-6"
          >
            <div class="inline-flex rounded-lg shadow-sm">
              <button
                @click="currentPage > 1 && currentPage--"
                :disabled="currentPage === 1"
                class="px-4 py-2.5 max-lg:px-3 max-lg:py-2 border border-[#3b1c23] rounded-l-lg text-[#f0eaea] lg:hover:bg-[#3b1c23]/50 disabled:opacity-50 disabled:cursor-not-allowed bg-[#241017] transition-colors"
              >
                <i class="bi bi-chevron-left max-lg:text-sm"></i>
              </button>

              <div
                class="px-6 py-2.5 max-lg:px-4 max-lg:py-2 border-t border-b border-[#3b1c23] text-[#f0eaea] flex items-center bg-[#241017]"
              >
                <span class="font-medium max-lg:text-sm">{{
                  currentPage
                }}</span>
                <span class="mx-1 max-lg:mx-0.5 max-lg:text-sm">/</span>
                <span class="max-lg:text-sm">{{ totalPages }}</span>
              </div>

              <button
                @click="currentPage < totalPages && currentPage++"
                :disabled="currentPage === totalPages"
                class="px-4 py-2.5 max-lg:px-3 max-lg:py-2 border border-[#3b1c23] rounded-r-lg text-[#f0eaea] lg:hover:bg-[#3b1c23]/50 disabled:opacity-50 disabled:cursor-not-allowed bg-[#241017] transition-colors"
              >
                <i class="bi bi-chevron-right max-lg:text-sm"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section
        v-if="currentKiosk && currentKiosk.isHTMLGame"
        class="py-12 px-16 max-xl:px-8 max-lg:px-4 max-md:px-3 max-md:py-6 bg-[#0a0506]"
      >
        <div class="max-w-6xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 max-md:gap-4">
            <!-- Wallet Card -->
            <div
              class="bg-[#15090e]/50 backdrop-blur-sm rounded-2xl border border-[#2a1419] overflow-hidden"
            >
              <div class="p-6 max-md:p-4 border-b border-[#2a1419]">
                <div class="flex items-center gap-3">
                  <div
                    class="w-16 max-sm:w-14 max-sm:h-14 h-16 bg-gradient-to-br from-[#ff3344]/20 to-[#a1122d]/20 rounded-xl flex items-center justify-center border border-[#ff3344]/30"
                  >
                    <img
                      :src="currentKiosk.logo"
                      :alt="currentKiosk.name"
                      class="w-14 h-14 max-sm:w-12 max-sm:h-12 object-contain"
                    />
                  </div>
                  <div>
                    <h3
                      class="text-lg max-md:text-base max-sm:text-sm font-semibold text-[#f0eaea]"
                    >
                      {{ currentKiosk.name }}
                    </h3>
                    <p class="text-xs text-[#8a6b73]">{{ $t("wallet") }}</p>
                  </div>
                </div>
              </div>

              <div class="p-6 max-md:p-4">
                <div v-if="hasGameAccount" class="space-y-4 max-md:space-y-3">
                  <!-- Balance -->
                  <div
                    class="bg-[#0a0506] rounded-xl p-4 max-md:p-3 border border-[#2a1419]"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <div
                          class="w-10 h-10 max-md:w-8 max-md:h-8 bg-[#ff3344]/10 rounded-lg flex items-center justify-center"
                        >
                          <i
                            class="bi bi-wallet2 text-lg max-md:text-base text-[#ff3344]"
                          ></i>
                        </div>
                        <div>
                          <p class="text-xs text-[#8a6b73] mb-0.5">
                            {{ $t("game_balance") }}
                          </p>
                          <p
                            v-if="!isBalanceLoading"
                            class="text-base max-sm:text-sm font-bold text-[#f0eaea]"
                          >
                            {{ gameBalance || "0.00" }}
                          </p>
                          <div v-else class="flex items-center gap-2">
                            <div
                              class="w-4 h-4 border-2 border-[#ff3344] border-t-transparent rounded-full animate-spin"
                            ></div>
                            <span class="text-sm text-[#8a6b73]"
                              >Loading...</span
                            >
                          </div>
                        </div>
                      </div>
                      <button
                        @click="fetchGameBalance"
                        :disabled="isBalanceLoading"
                        class="w-9 h-9 max-md:w-8 max-md:h-8 bg-[#15090e] rounded-lg border border-[#2a1419] text-[#ff3344] lg:hover:bg-[#1f0e13] transition-all disabled:opacity-50"
                      >
                        <i
                          class="bi"
                          :class="[
                            isBalanceLoading
                              ? 'bi-arrow-repeat animate-spin'
                              : 'bi-arrow-clockwise',
                          ]"
                        ></i>
                      </button>
                    </div>
                  </div>

                  <!-- Username -->
                  <div
                    class="bg-[#0a0506] rounded-xl p-4 max-md:p-3 border border-[#2a1419]"
                  >
                    <div class="flex items-center gap-3">
                      <div
                        class="w-10 h-10 max-md:w-8 max-md:h-8 bg-[#ff3344]/10 rounded-lg flex items-center justify-center"
                      >
                        <i
                          class="bi bi-person text-lg max-md:text-base text-[#ff3344]"
                        ></i>
                      </div>
                      <div class="flex-1">
                        <p class="text-xs text-[#8a6b73] mb-0.5">
                          {{ $t("username") }}
                        </p>
                        <p
                          class="text-base max-sm:text-sm font-medium text-[#f0eaea]"
                        >
                          {{ userData[currentKiosk.databaseGameID] }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Transfer Button -->
                  <button
                    @click="openTransferModal"
                    class="w-full bg-gradient-to-r from-[#a1122d] to-[#c21b3a] text-white py-3 max-md:py-2.5 rounded-lg font-semibold lg:hover:from-[#8e0f25] lg:hover:to-[#a1122d] transition-all flex items-center justify-center gap-2 text-sm max-md:text-xs"
                  >
                    <i class="bi bi-arrow-left-right"></i>
                    <span>{{ $t("transfer_funds") }}</span>
                  </button>
                </div>

                <!-- No Account -->
                <div
                  v-else
                  class="text-center py-8 max-md:py-6 space-y-4 max-md:space-y-3"
                >
                  <div
                    class="w-16 h-16 max-md:w-14 max-md:h-14 mx-auto bg-[#0a0506] rounded-full flex items-center justify-center border border-[#2a1419]"
                  >
                    <i
                      class="bi bi-person-plus text-2xl max-md:text-xl text-[#ff3344]"
                    ></i>
                  </div>
                  <div>
                    <h4
                      class="text-lg max-lg:text-base font-semibold text-[#f0eaea] mb-1"
                    >
                      {{ $t("account_required") }}
                    </h4>
                    <p class="text-base max-lg:text-sm text-[#8a6b73]">
                      {{
                        $t("account_required_description", {
                          provider: currentKiosk.name,
                        })
                      }}
                    </p>
                  </div>
                  <div v-if="isUserLoggedIn">
                    <LoadingButton
                      :loading="isLoading"
                      @click="registerGameAccount"
                      class="inline-flex items-center gap-2 bg-gradient-to-r from-[#a1122d] to-[#c21b3a] text-white py-2.5 max-md:py-2 px-6 max-md:px-5 rounded-lg font-semibold lg:hover:from-[#8e0f25] lg:hover:to-[#a1122d] transition-all text-sm"
                    >
                      {{ $t("create_account") }}
                    </LoadingButton>
                  </div>
                  <div v-else>
                    <NuxtLinkLocale
                      to="/login"
                      class="inline-flex items-center gap-2 bg-gradient-to-r from-[#a1122d] to-[#c21b3a] text-white py-2.5 max-md:py-2 px-6 max-md:px-5 rounded-lg font-semibold lg:hover:from-[#8e0f25] lg:hover:to-[#a1122d] transition-all text-sm"
                    >
                      <i class="bi bi-box-arrow-in-right"></i>
                      {{ $t("login_now") }}
                    </NuxtLinkLocale>
                  </div>
                </div>
              </div>

              <!-- Instructions -->
              <div
                class="px-6 max-md:px-4 pb-6 max-md:pb-4 pt-4 border-t border-[#2a1419]"
              >
                <h5
                  class="text-sm max-sm:text-xs font-semibold text-[#f0eaea] mb-3 max-md:mb-2 flex items-center gap-2"
                >
                  <i class="bi bi-info-circle text-[#ff3344]"></i>
                  {{ $t("transfer_instructions") }}
                </h5>
                <ul class="space-y-2">
                  <li
                    class="flex items-start gap-2 text-sm max-sm:text-xs text-[#8a6b73]"
                  >
                    <i
                      class="bi bi-check2 text-green-500 mt-0.5 flex-shrink-0"
                    ></i>
                    <span>{{ $t("transfer_instruction_1") }}</span>
                  </li>
                  <li
                    class="flex items-start gap-2 text-sm max-sm:text-xs text-[#8a6b73]"
                  >
                    <i
                      class="bi bi-check2 text-green-500 mt-0.5 flex-shrink-0"
                    ></i>
                    <span>{{ $t("transfer_instruction_2") }}</span>
                  </li>
                  <li
                    class="flex items-start gap-2 text-sm max-sm:text-xs text-[#8a6b73]"
                  >
                    <i
                      class="bi bi-check2 text-green-500 mt-0.5 flex-shrink-0"
                    ></i>
                    <span>{{ $t("transfer_instruction_3") }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Play Card -->
            <div
              class="bg-[#15090e]/50 backdrop-blur-sm rounded-2xl border border-[#2a1419] overflow-hidden"
            >
              <div class="p-6 max-md:p-4 border-b border-[#2a1419]">
                <div class="flex items-center gap-3">
                  <div
                    class="w-14 h-14 max-sm:w-12 max-sm:h-12 bg-gradient-to-br from-[#ff3344]/20 to-[#a1122d]/20 rounded-xl flex items-center justify-center border border-[#ff3344]/30"
                  >
                    <i
                      class="bi bi-controller text-xl max-md:text-lg text-[#ff3344]"
                    ></i>
                  </div>
                  <div>
                    <h3
                      class="text-lg max-sm:text-sm max-md:text-base font-semibold text-[#f0eaea]"
                    >
                      {{ $t("play_online", { provider: currentKiosk.name }) }}
                    </h3>
                    <p class="text-xs text-[#8a6b73]">
                      {{ $t("launch_in_app") }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="p-6 max-md:p-4">
                <div class="text-center mb-6 max-md:mb-4">
                  <div
                    class="w-20 h-20 max-md:w-16 max-md:h-16 mx-auto mb-4 max-md:mb-3 bg-gradient-to-br from-[#0a0506] to-[#15090e] rounded-2xl flex items-center justify-center border border-[#2a1419]"
                  >
                    <i
                      class="bi bi-play-circle text-4xl max-md:text-3xl text-[#ff3344]"
                    ></i>
                  </div>
                  <h4
                    class="text-base max-md:text-sm font-semibold text-[#f0eaea] mb-2 max-md:mb-1"
                  >
                    {{ $t("instant_app_play") }}
                  </h4>
                  <p class="text-xs text-[#8a6b73]">
                    {{
                      $t("download_required", { provider: currentKiosk.name })
                    }}
                  </p>
                </div>

                <button
                  @click="launchHTMLGame"
                  class="w-full bg-gradient-to-r from-[#c21b3a] to-[#ff3344] text-white py-3.5 max-md:py-3 rounded-xl font-bold lg:hover:from-[#a1122d] lg:hover:to-[#c21b3a] transition-all flex items-center justify-center gap-2 mb-3 max-md:mb-2"
                >
                  <i class="bi bi-play-fill text-xl"></i>
                  <span>{{ $t("play_now") }}</span>
                </button>

                <p class="text-xs text-center text-[#8a6b73]">
                  {{ $t("new_window_notice2") }}
                </p>
              </div>

              <!-- Requirements -->
              <div
                class="px-6 max-md:px-4 pb-6 max-md:pb-4 pt-4 border-t border-[#2a1419] space-y-3 max-md:space-y-2"
              >
                <!-- Mobile Only -->
                <div
                  class="bg-[#2d0a0f] border-l-2 border-red-500 p-3 max-md:p-2 rounded-r-lg"
                >
                  <div class="flex items-start gap-2">
                    <i
                      class="bi bi-phone text-red-500 flex-shrink-0 mt-0.5"
                    ></i>
                    <div>
                      <p class="text-xs font-semibold text-red-400 mb-0.5">
                        {{ $t("important") }}
                      </p>
                      <p class="text-xs text-[#f0eaea]">
                        {{ $t("alert_game_only_available_on_mobile") }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- App Required -->
                <div
                  class="bg-[#2a0f14] border-l-2 border-[#ff3344] p-3 max-md:p-2 rounded-r-lg"
                >
                  <div class="flex items-start gap-2">
                    <i
                      class="bi bi-download text-[#ff3344] flex-shrink-0 mt-0.5"
                    ></i>
                    <div>
                      <p class="text-xs font-semibold text-[#ff3344] mb-0.5">
                        {{ $t("required") }}
                      </p>
                      <p class="text-xs text-[#f0eaea] mb-1">
                        {{ $t("install_lion_king_app_first") }}
                      </p>
                      <a
                        href="https://dl.lk4u.xyz"
                        target="_blank"
                        class="inline-flex items-center gap-1 text-xs text-[#ff3344] lg:hover:text-[#c21b3a] font-medium underline"
                      >
                        <i class="bi bi-box-arrow-up-right"></i>
                        {{ $t("download_from_google") }}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- Manual Game -->
      <section
        v-if="currentKiosk && currentKiosk.isManualGame"
        class="py-12 px-16 max-xl:px-8 max-lg:px-4 max-md:px-3 max-md:py-6 bg-[#0a0506]"
      >
        <div class="max-w-6xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 max-md:gap-4">
            <div
              class="bg-[#15090e]/50 backdrop-blur-sm rounded-2xl border border-[#2a1419] overflow-hidden"
            >
              <div class="p-6 max-md:p-4 border-b border-[#2a1419]">
                <div class="flex items-center gap-3">
                  <div
                    class="w-16 max-sm:w-14 max-sm:h-14 h-16 bg-gradient-to-br from-[#ff3344]/20 to-[#a1122d]/20 rounded-xl flex items-center justify-center border border-[#ff3344]/30"
                  >
                    <img
                      :src="currentKiosk.logo"
                      :alt="currentKiosk.name"
                      class="w-14 h-14 max-sm:w-12 max-sm:h-12 object-contain"
                    />
                  </div>
                  <div>
                    <h3
                      class="text-lg max-md:text-base max-sm:text-sm font-semibold text-[#f0eaea]"
                    >
                      {{ currentKiosk.name }}
                    </h3>
                    <p class="text-xs text-[#8a6b73]">
                      {{ $t("manual_login_required") }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="p-6 max-md:p-4">
                <div v-if="hasGameAccount" class="space-y-4 max-md:space-y-3">
                  <div
                    class="bg-[#0a0506] rounded-xl p-4 max-md:p-3 border border-[#2a1419]"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <div
                          class="w-10 h-10 max-md:w-8 max-md:h-8 bg-[#ff3344]/10 rounded-lg flex items-center justify-center"
                        >
                          <i
                            class="bi bi-wallet2 text-lg max-md:text-base text-[#ff3344]"
                          ></i>
                        </div>
                        <div>
                          <p class="text-xs text-[#8a6b73] mb-0.5">
                            {{ $t("balance") }}
                          </p>
                          <p
                            v-if="!isBalanceLoading"
                            class="text-base max-sm:text-sm font-bold text-[#f0eaea]"
                          >
                            {{ gameBalance || "0.00" }}
                          </p>
                          <div v-else class="flex items-center gap-2">
                            <div
                              class="w-4 h-4 border-2 border-[#ff3344] border-t-transparent rounded-full animate-spin"
                            ></div>
                            <span class="text-sm text-[#8a6b73]"
                              >Loading...</span
                            >
                          </div>
                        </div>
                      </div>
                      <button
                        @click="fetchGameBalance"
                        :disabled="isBalanceLoading"
                        class="w-9 h-9 max-md:w-8 max-md:h-8 bg-[#15090e] rounded-lg border border-[#2a1419] text-[#ff3344] lg:hover:bg-[#1f0e13] transition-all disabled:opacity-50"
                      >
                        <i
                          class="bi"
                          :class="[
                            isBalanceLoading
                              ? 'bi-arrow-repeat animate-spin'
                              : 'bi-arrow-clockwise',
                          ]"
                        ></i>
                      </button>
                    </div>
                  </div>

                  <div
                    class="bg-[#0a0506] rounded-xl p-4 max-md:p-3 border border-[#2a1419]"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3 flex-1">
                        <div
                          class="w-10 h-10 max-md:w-8 max-md:h-8 bg-[#ff3344]/10 rounded-lg flex items-center justify-center"
                        >
                          <i
                            class="bi bi-person text-lg max-md:text-base text-[#ff3344]"
                          ></i>
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="text-xs text-[#8a6b73] mb-0.5">
                            {{ $t("username") }}
                          </p>
                          <p
                            class="text-base max-sm:text-sm font-medium text-[#f0eaea] truncate"
                          >
                            {{ userData[currentKiosk.databaseGameID] }}
                          </p>
                        </div>
                      </div>
                      <button
                        @click="
                          copyToClipboard(userData[currentKiosk.databaseGameID])
                        "
                        class="w-9 h-9 max-md:w-8 max-md:h-8 bg-[#15090e] rounded-lg border border-[#2a1419] text-[#ff3344] lg:hover:bg-[#1f0e13] transition-all flex-shrink-0 ml-2"
                      >
                        <i class="bi bi-clipboard"></i>
                      </button>
                    </div>
                  </div>

                  <div
                    class="bg-[#0a0506] rounded-xl p-4 max-md:p-3 border border-[#2a1419]"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3 flex-1">
                        <div
                          class="w-10 h-10 max-md:w-8 max-md:h-8 bg-[#ff3344]/10 rounded-lg flex items-center justify-center"
                        >
                          <i
                            class="bi bi-key text-lg max-md:text-base text-[#ff3344]"
                          ></i>
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="text-xs text-[#8a6b73] mb-0.5">
                            {{ $t("password") }}
                          </p>
                          <p
                            class="text-base max-sm:text-sm font-medium text-[#f0eaea] font-mono truncate"
                          >
                            {{ userData[currentKiosk.databaseGamePassword] }}
                          </p>
                        </div>
                      </div>
                      <button
                        @click="
                          copyToClipboard(
                            userData[currentKiosk.databaseGamePassword]
                          )
                        "
                        class="w-9 h-9 max-md:w-8 max-md:h-8 bg-[#15090e] rounded-lg border border-[#2a1419] text-[#ff3344] lg:hover:bg-[#1f0e13] transition-all flex-shrink-0 ml-2"
                      >
                        <i class="bi bi-clipboard"></i>
                      </button>
                    </div>
                  </div>

                  <div class="flex gap-3 max-md:gap-2 pt-2">
                    <button
                      @click="openTransferModal"
                      class="flex-1 bg-gradient-to-r from-[#a1122d] to-[#c21b3a] text-white py-3 max-md:py-2.5 rounded-lg font-semibold lg:hover:from-[#8e0f25] lg:hover:to-[#a1122d] transition-all flex items-center justify-center gap-2 text-sm max-md:text-xs"
                    >
                      <i class="bi bi-arrow-left-right"></i>
                      <span>{{ $t("transfer_funds") }}</span>
                    </button>
                    <button
                      @click="refreshGameAccount"
                      class="w-12 h-12 max-md:w-11 max-md:h-11 bg-[#0a0506] rounded-lg border border-[#2a1419] text-[#8a6b73] lg:hover:text-[#ff3344] lg:hover:bg-[#15090e] transition-all flex items-center justify-center"
                    >
                      <i class="bi bi-arrow-clockwise text-lg"></i>
                    </button>
                  </div>
                </div>

                <div
                  v-else
                  class="text-center py-8 max-md:py-6 space-y-4 max-md:space-y-3"
                >
                  <div
                    class="w-16 h-16 max-md:w-14 max-md:h-14 mx-auto bg-[#0a0506] rounded-full flex items-center justify-center border border-[#2a1419]"
                  >
                    <i
                      class="bi bi-person-plus text-2xl max-md:text-xl text-[#ff3344]"
                    ></i>
                  </div>
                  <div>
                    <h4
                      class="text-lg max-lg:text-base font-semibold text-[#f0eaea] mb-1"
                    >
                      {{ $t("account_required") }}
                    </h4>
                    <p class="text-base max-lg:text-sm text-[#8a6b73]">
                      {{
                        $t("account_required_description", {
                          provider: currentKiosk.name,
                        })
                      }}
                    </p>
                  </div>
                  <div v-if="isUserLoggedIn">
                    <LoadingButton
                      :loading="isLoading"
                      @click="registerGameAccount"
                      class="inline-flex items-center gap-2 bg-gradient-to-r from-[#a1122d] to-[#c21b3a] text-white py-2.5 max-md:py-2 px-6 max-md:px-5 rounded-lg font-semibold lg:hover:from-[#8e0f25] lg:hover:to-[#a1122d] transition-all text-sm"
                    >
                      {{ $t("create_account") }}
                    </LoadingButton>
                  </div>
                  <div v-else>
                    <NuxtLinkLocale
                      to="/login"
                      class="inline-flex items-center gap-2 bg-gradient-to-r from-[#a1122d] to-[#c21b3a] text-white py-2.5 max-md:py-2 px-6 max-md:px-5 rounded-lg font-semibold lg:hover:from-[#8e0f25] lg:hover:to-[#a1122d] transition-all text-sm"
                    >
                      <i class="bi bi-box-arrow-in-right"></i>
                      {{ $t("login_now") }}
                    </NuxtLinkLocale>
                  </div>
                </div>
              </div>

              <div
                class="px-6 max-md:px-4 pb-6 max-md:pb-4 pt-4 border-t border-[#2a1419]"
              >
                <h5
                  class="text-sm max-sm:text-xs font-semibold text-[#f0eaea] mb-3 max-md:mb-2 flex items-center gap-2"
                >
                  <i class="bi bi-info-circle text-[#ff3344]"></i>
                  {{ $t("instructions") }}
                </h5>
                <ul class="space-y-2">
                  <li
                    class="flex items-start gap-2 text-sm max-sm:text-xs text-[#8a6b73]"
                  >
                    <i
                      class="bi bi-check2 text-green-500 mt-0.5 flex-shrink-0"
                    ></i>
                    <span>{{ $t("instruction_1") }}</span>
                  </li>
                  <li
                    class="flex items-start gap-2 text-sm max-sm:text-xs text-[#8a6b73]"
                  >
                    <i
                      class="bi bi-check2 text-green-500 mt-0.5 flex-shrink-0"
                    ></i>
                    <span>{{ $t("instruction_2") }}</span>
                  </li>
                  <li
                    class="flex items-start gap-2 text-sm max-sm:text-xs text-[#8a6b73]"
                  >
                    <i
                      class="bi bi-check2 text-green-500 mt-0.5 flex-shrink-0"
                    ></i>
                    <span>{{ $t("instruction_3") }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div
              class="bg-[#15090e]/50 backdrop-blur-sm rounded-2xl border border-[#2a1419] overflow-hidden"
            >
              <div class="p-6 max-md:p-4 border-b border-[#2a1419]">
                <div class="flex items-center gap-3">
                  <div
                    class="w-14 h-14 max-sm:w-12 max-sm:h-12 bg-gradient-to-br from-[#ff3344]/20 to-[#a1122d]/20 rounded-xl flex items-center justify-center border border-[#ff3344]/30"
                  >
                    <i
                      class="bi bi-download text-xl max-md:text-lg text-[#ff3344]"
                    ></i>
                  </div>
                  <div>
                    <h3
                      class="text-lg max-sm:text-sm max-md:text-base font-semibold text-[#f0eaea]"
                    >
                      {{
                        $t("download_provider", { provider: currentKiosk.name })
                      }}
                    </h3>
                    <p class="text-xs text-[#8a6b73]">
                      {{ $t("get_app_for_better_experience") }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="p-6 max-md:p-4">
                <p
                  class="text-sm max-md:text-xs text-center text-[#8a6b73] mb-5 max-md:mb-4"
                >
                  {{ $t("choose_your_platform") }}
                </p>

                <div
                  class="grid grid-cols-2 max-[500px]:grid-cols-1 gap-4 max-md:gap-3"
                >
                  <div
                    @click="downloadApp('android')"
                    class="bg-[#0a0506] rounded-xl p-4 border border-[#2a1419] lg:hover:border-green-500/50 cursor-pointer transition-all group"
                  >
                    <div class="text-center space-y-3 max-sm:space-y-2">
                      <div class="w-14 h-14 max-sm:w-12 max-sm:h-12 mx-auto">
                        <img
                          src="/images/download/android.png"
                          alt="Android"
                          class="w-full h-full object-contain lg:group-hover:scale-110 transition-transform"
                          onerror="this.src='https://placehold.co/200/33d399/FFF?text=Android'"
                        />
                      </div>
                      <div>
                        <h4 class="text-sm font-semibold text-[#f0eaea] mb-0.5">
                          {{ $t("android_app") }}
                        </h4>
                        <p class="text-xs text-[#8a6b73]">
                          {{ $t("apk_direct_download") }}
                        </p>
                      </div>
                      <button
                        class="w-full py-2 max-md:py-1.5 bg-green-600 lg:hover:bg-green-700 text-white rounded-lg font-medium transition-all text-sm flex items-center justify-center gap-1.5"
                      >
                        <i class="bi bi-android2"></i>
                        <span>{{ $t("download_apk") }}</span>
                      </button>
                    </div>
                  </div>

                  <div
                    @click="downloadApp('ios')"
                    class="bg-[#0a0506] rounded-xl p-4 border border-[#2a1419] lg:hover:border-[#ff3344]/50 cursor-pointer transition-all group"
                  >
                    <div class="text-center space-y-3 max-sm:space-y-2">
                      <div class="w-14 h-14 max-sm:w-12 max-sm:h-12 mx-auto">
                        <img
                          src="/images/download/ios.png"
                          alt="iOS"
                          class="w-full h-full object-contain lg:group-hover:scale-110 transition-transform"
                          onerror="this.src='https://placehold.co/200/3b82f6/FFF?text=iOS'"
                        />
                      </div>
                      <div>
                        <h4 class="text-sm font-semibold text-[#f0eaea] mb-0.5">
                          {{ $t("ios_app") }}
                        </h4>
                        <p class="text-xs text-[#8a6b73]">
                          {{ $t("app_store_installation") }}
                        </p>
                      </div>
                      <button
                        class="w-full py-2 max-md:py-1.5 bg-[#a1122d] lg:hover:bg-[#c21b3a] text-white rounded-lg font-medium transition-all text-sm flex items-center justify-center gap-1.5"
                      >
                        <i class="bi bi-apple"></i>
                        <span>{{ $t("download_ios") }}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="px-6 max-md:px-4 pb-6 max-md:pb-4 pt-4 border-t border-[#2a1419]"
              >
                <h5
                  class="text-sm max-sm:text-xs font-semibold text-[#f0eaea] mb-3 max-md:mb-2 flex items-center gap-2"
                >
                  <i class="bi bi-question-circle text-blue-500"></i>
                  {{ $t("download_help") }}
                </h5>
                <ul class="space-y-2">
                  <li
                    class="flex items-start gap-2 text-sm max-sm:text-xs text-[#8a6b73]"
                  >
                    <i
                      class="bi bi-check2 text-blue-500 mt-0.5 flex-shrink-0"
                    ></i>
                    <span>{{ $t("download_help_1") }}</span>
                  </li>
                  <li
                    class="flex items-start gap-2 text-sm max-sm:text-xs text-[#8a6b73]"
                  >
                    <i
                      class="bi bi-check2 text-blue-500 mt-0.5 flex-shrink-0"
                    ></i>
                    <span>{{ $t("download_help_2") }}</span>
                  </li>
                  <li
                    class="flex items-start gap-2 text-sm max-sm:text-xs text-[#8a6b73]"
                  >
                    <i
                      class="bi bi-check2 text-blue-500 mt-0.5 flex-shrink-0"
                    ></i>
                    <span>{{ $t("download_help_3") }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- Game Promo Cards -->
      <GamePromoCards />
      <SeoContent />
      <TransferModal
        v-if="showTransferModal"
        :gameInfo="currentKiosk"
        :currentBalance="parseFloat(gameBalance)"
        @close="showTransferModal = false"
        @balanceUpdated="fetchGameBalance"
      />
    </div>
  </ClientOnly>
</template>

<script setup>
import { Icon } from "@iconify/vue";
const { launchGame, alertVisible, alertTitle, alertMessage, alertType } =
  useGameLauncher();
const isUserLoggedIn = useState("isUserLoggedIn");
const slotKiosks = useState("slotKiosks");
const userGameLocks = useState("userGameLocks");
const searchQuery = ref("");
const sortOption = ref("popular");
const currentPage = ref(1);
const itemsPerPage = ref(24);
const gamesPerPage = ref(24);
const searchTerm = ref("");
const { post, get } = useApiEndpoint();
const isAnimating = ref(false);
const pageLoading = ref(false);
const gameList = ref([]);
const currentKiosk = ref(0);
const sliderWrapper = ref(null);
const sliderContent = ref(null);
const currentOffset = ref(0);
const currentIndex = ref(0);
const visibleItems = ref(5);
const userData = useState("userData");
const isLoading = ref(false);
const loadingMessage = ref("");
const scrollToElement = inject("scrollToElement");

const hasGameAccount = computed(() => {
  if (!userData.value || !currentKiosk.value) return false;

  const gameIDField = currentKiosk.value.databaseGameID;
  const gamePWField = currentKiosk.value.databaseGamePassword;

  if (currentKiosk.value.isManualGame) {
    return !!(userData.value[gameIDField] && userData.value[gamePWField]);
  }

  if (currentKiosk.value.isHTMLGame) {
    return !!userData.value[gameIDField];
  }

  return !!(userData.value[gameIDField] && userData.value[gamePWField]);
});

const { showAlert } = useAlert();
const gameBalance = ref("0.00");
const isBalanceLoading = ref(false);
const showTransferModal = ref(false);

const openTransferModal = () => {
  showTransferModal.value = true;
};

const isGameLocked = (gameDatabaseName) => {
  if (!isUserLoggedIn.value || !gameDatabaseName) return false;
  return userGameLocks.value?.[gameDatabaseName]?.lock === true;
};

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
  showAlert($t("copied"), $t("copied_to_clipboard"), "success");
  setTimeout(() => {
    alertVisible.value = false;
  }, 3000);
};

const registerGameAccount = async () => {
  if (!currentKiosk.value || !currentKiosk.value.apiLink) {
    showAlert($t("alert_info"), $t("cannot_register_game_account"), "info");
    return;
  }
  isLoading.value = true;
  loadingMessage.value = $t("creating_game_account");
  try {
    let response;

    if (currentKiosk.value.isHTMLGame) {
      response = await post(currentKiosk.value.registerGameAPI, {});
    } else {
      response = await post(currentKiosk.value.apiLink, {});
    }

    const { data } = response;

    if (data.success) {
      await fetchUserData();
      await fetchGameBalance();
      showAlert("Success", "Game account created successfully!", "success");
    } else {
      showAlert(
        $t("alert_info"),
        data.message[$locale.value] || data.message.en,
        "info"
      );
    }
  } catch (error) {
    showAlert(
      "Error",
      error.message || "Failed to create game account. Please try again.",
      "error"
    );
  } finally {
    isLoading.value = false;
    loadingMessage.value = "";
  }
};

const refreshGameAccount = async () => {
  isLoading.value = true;
  loadingMessage.value = $t("refreshing_account");
  try {
    await fetchUserData();
    await fetchGameBalance();
    showAlert($t("alert_success"), $t("account_refreshed"), "success");
  } catch (error) {
    showAlert($t("alert_error"), $t("failed_refresh_account"), "error");
  } finally {
    isLoading.value = false;
    loadingMessage.value = "";
  }
};

const fetchUserData = async () => {
  try {
    const { data } = await get("userdata");
    if (data.success) {
      userData.value = data.user;
    }
  } catch (error) {
    console.error("Error fetching helps:", error);
  }
};

const downloadApp = (platform) => {
  if (!currentKiosk.value) {
    showAlert($t("alert_info"), $t("provider_missing"), "info");
    return;
  }
  let downloadUrl = "";
  if (platform === "android") {
    downloadUrl = currentKiosk.value.androidDownloadUrl;
    if (!downloadUrl) {
      showAlert($t("alert_info"), $t("android_unavailable"), "info");
      return;
    }
  } else if (platform === "ios") {
    downloadUrl = currentKiosk.value.iosDownloadUrl;
    if (!downloadUrl) {
      showAlert($t("alert_info"), $t("ios_unavailable"), "info");
      return;
    }
  }
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.target = "_blank";
  link.download = `${currentKiosk.value.name}-${platform}.apk`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const fetchGameBalance = async () => {
  if (!currentKiosk.value || !currentKiosk.value.balanceAPI) {
    showAlert($t("alert_info"), $t("balance_api_unavailable"), "info");
    return;
  }
  isBalanceLoading.value = true;
  try {
    const { data } = await post(currentKiosk.value.balanceAPI);
    if (data.success) {
      gameBalance.value = data.balance || "0.00";
      await fetchUserData();
    } else {
      showAlert(
        $t("alert_info"),
        data.message[$locale.value] || data.message.en,
        "info"
      );
    }
  } catch (error) {
    console.error("Error fetching balance:", error);
    showAlert($t("alert_error"), $t("failed_fetch_balance"), "error");
  } finally {
    isBalanceLoading.value = false;
  }
};

watch([searchQuery, sortOption], () => {
  currentPage.value = 1;
});

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

const selectGame = async (game) => {
  if (currentKiosk.value?._id === game._id) return;
  pageLoading.value = true;
  gameBalance.value = "0.00";
  currentKiosk.value = game;
  try {
    if (game.gameListLink) {
      await fetchGameList(game.gameListLink);
    }
    if (game.isManualGame || game.isHTMLGame) {
      await fetchUserData();
      if (hasGameAccount.value) {
        await fetchGameBalance();
      }
    }
  } catch (error) {
    console.error("Error selecting game:", error);
  } finally {
    pageLoading.value = false;
    scrollToSelectedProvider();
  }
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

const isDesktopFeature = () => {
  // Check for pointer precision (fine = mouse, coarse = touch)
  const hasFinePonter = window.matchMedia("(pointer: fine)").matches;

  // Check for hover capability
  const canHover = window.matchMedia("(lg:hover: hover)").matches;

  // Check screen size
  const hasLargeScreen = window.innerWidth >= 1024;

  return hasFinePonter && canHover && hasLargeScreen;
};

const launchHTMLGame = async () => {
  if (!currentKiosk.value || !currentKiosk.value.apiLink) {
    showAlert($t("alert_error"), $t("game_link_unavailable"), "error");
    return;
  }

  if (isDesktopFeature()) {
    showAlert(
      $t("alert_error"),
      $t("alert_game_only_available_on_mobile"),
      "error"
    );
    return;
  }

  try {
    const { data } = await post(currentKiosk.value.apiLink);

    if (data.success && data.gameLobby) {
      const newWindow = window.open(data.gameLobby, "_blank");
      if (
        !newWindow ||
        newWindow.closed ||
        typeof newWindow.closed === "undefined"
      ) {
        window.location.href = data.gameLobby;
      }
    } else {
      showAlert(
        $t("alert_info"),
        data.message[$locale.value] || data.message.en,
        "info"
      );
    }
  } catch (error) {
    console.error("Error launching HTML game:", error);
    showAlert("Error", "Failed to launch game. Please try again.", "error");
  }
};

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

const scrollToSelectedProvider = () => {
  if (!currentKiosk.value) return;
  nextTick(() => {
    const providersContainer = document.querySelector(
      ".flex.flex-wrap.gap-4.justify-center.max-lg\\:flex-nowrap.max-lg\\:overflow-x-auto"
    );
    if (!providersContainer) return;
    const selectedProvider = Array.from(providersContainer.children).find(
      (el) => {
        const innerDiv = el.querySelector('div[class*="bg-[#a1122d]"]');
        return innerDiv !== null;
      }
    );
    if (selectedProvider) {
      const containerWidth = providersContainer.offsetWidth;
      const selectedPosition = selectedProvider.offsetLeft;
      const selectedWidth = selectedProvider.offsetWidth;
      const scrollTo =
        selectedPosition - (containerWidth / 2 - selectedWidth / 2);
      providersContainer.scrollTo({
        left: Math.max(0, scrollTo),
        behavior: "smooth",
      });
    }
  });
};

onMounted(async () => {
  pageLoading.value = true;
  try {
    const selectedSlotProvider = useState("selectedSlotProvider").value;
    if (selectedSlotProvider) {
      currentKiosk.value = selectedSlotProvider;
      if (selectedSlotProvider.gameListLink) {
        await fetchGameList(selectedSlotProvider.gameListLink);
      }
    } else if (slotKiosks.value?.length > 0 && !currentKiosk.value) {
      currentKiosk.value = slotKiosks.value[0];
      if (slotKiosks.value[0].gameListLink) {
        await fetchGameList(slotKiosks.value[0].gameListLink);
      }
    }
    if (
      currentKiosk.value &&
      (currentKiosk.value.isManualGame || currentKiosk.value.isHTMLGame) &&
      hasGameAccount.value
    ) {
      await fetchGameBalance();
    }
  } catch (error) {
    console.error("Error during initial page load:", error);
  } finally {
    pageLoading.value = false;
    scrollToSelectedProvider();
  }
});

watchEffect(() => {
  const selectedSlotProvider = useState("selectedSlotProvider").value;
  if (selectedSlotProvider && !currentKiosk.value) {
    selectGame(selectedSlotProvider);
  } else if (slotKiosks.value?.length > 0 && !currentKiosk.value) {
    selectGame(slotKiosks.value[0]);
  }
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

watch(
  currentKiosk,
  async (newKiosk, oldKiosk) => {
    if (!newKiosk || newKiosk._id === oldKiosk?._id) return;

    gameBalance.value = "0.00";

    if (newKiosk.isManualGame || newKiosk.isHTMLGame) {
      await fetchUserData();
      if (hasGameAccount.value) {
        await fetchGameBalance();
      }
    }
  },
  { immediate: true }
);
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

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
