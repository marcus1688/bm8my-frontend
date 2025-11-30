<template>
  <ClientOnly>
    <ConfirmAlert
      :title="confirmAlertTitle"
      :message="confirmAlertMessage"
      :isVisible="isConfirmAlertVisible"
      :type="confirmAlertType"
      @close="handleConfirmClose"
    />
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
      <header
        class="relative w-full h-[80px] max-lg:h-[60px] py-2 border-b-2 border-red-600 z-50"
        style="background-image: url('/images/header.png')"
      >
        <div
          class="mx-auto px-24 py-4 h-full max-2xl:px-12 max-[1350px]:px-2 max-[1070px]:px-0 max-lg:p-2 max-[1350px]:flex max-lg:block max-[1350px]:justify-between"
        >
          <div class="flex justify-between items-center h-full w-full">
            <div class="flex items-center gap-4 max-[373px]:!gap-2">
              <button
                @click="mobileMenuOpen = !mobileMenuOpen"
                class="lg:hidden text-gray-300 lg:hover:text-white"
              >
                <i class="bi bi-list text-2xl max-[480px]:text-xl"></i>
              </button>
              <NuxtLinkLocale class="max-lg:hidden" to="/">
                <img
                  :src="generalSetting.logoimage"
                  alt="Logo"
                  class="w-24 h-auto max-[1350px]:hidden"
                />
              </NuxtLinkLocale>
              <div v-if="!userData">
                <NuxtLinkLocale class="lg:hidden" to="/">
                  <img
                    :src="generalSetting.logoimage"
                    alt="Logo"
                    class="w-16 h-auto max-lg:w-20"
                  />
                </NuxtLinkLocale>
              </div>
            </div>

            <div v-if="userData">
              <NuxtLinkLocale class="lg:hidden" to="/">
                <img
                  :src="generalSetting.logoimage"
                  alt="Logo"
                  class="w-16 h-auto max-lg:w-20"
                />
              </NuxtLinkLocale>
            </div>

            <nav class="hidden lg:flex items-center flex-1 justify-center">
              <NuxtLinkLocale
                to="/"
                class="hidden max-[1350px]:flex items-center gap-1 menuText font-medium text-gray-300 lg:hover:text-red-400 transition-colors px-3"
              >
                <span class="max-[1060px]:text-[0.8rem] max-lg:text-[1rem]">{{
                  $t("home")
                }}</span></NuxtLinkLocale
              >
              <div
                v-for="item in HeaderNav"
                :key="item.name"
                class="relative px-3"
              >
                <div
                  class="py-2 inline-block"
                  @mouseenter="activeDropdown = item.name"
                >
                  <NuxtLinkLocale
                    :to="`${item.link}`"
                    class="flex items-center gap-1 menuText font-medium text-gray-300 lg:hover:text-red-400 transition-colors"
                  >
                    <span
                      class="max-[1060px]:text-[0.8rem] max-lg:text-[1rem]"
                      >{{ item.label }}</span
                    >
                    <i class="bi bi-chevron-down text-xs"></i>
                  </NuxtLinkLocale>
                </div>

                <div
                  v-if="activeDropdown === item.name"
                  class="absolute left-0 w-full h-2 bottom-0 translate-y-full z-50"
                  @mouseenter="activeDropdown = item.name"
                ></div>
              </div>
              <div class="px-3 max-xl:hidden">
                <NuxtLinkLocale
                  to="/promotions"
                  class="menuText font-medium text-gray-300 lg:hover:text-red-400 transition-colors"
                >
                  {{ $t("promotions") }}</NuxtLinkLocale
                >
              </div>
              <div class="px-3 max-xl:hidden">
                <NuxtLinkLocale
                  to="/vip"
                  class="menuText font-medium text-gray-300 lg:hover:text-red-400 transition-colors"
                >
                  {{ $t("vip") }}</NuxtLinkLocale
                >
              </div>
            </nav>

            <div class="flex items-center gap-2">
              <div>
                <div v-if="!userData" class="flex gap-2 items-center">
                  <NuxtLinkLocale
                    to="/login"
                    class="px-4 py-1.5 max-[360px]:!px-4 menuText font-medium bg-gradient-to-r from-yellow-700 to-yellow-600 text-white rounded lg:hover:from-yellow-600 lg:hover:to-yellow-500 transition-all shadow-md shadow-yellow-600/20"
                  >
                    {{ $t("log_in") }}
                  </NuxtLinkLocale>
                  <NuxtLinkLocale
                    to="/register"
                    class="px-4 py-1.5 max-[360px]:!px-4 menuText font-medium bg-red-600 lg:hover:bg-red-700 text-white rounded transition-colors"
                  >
                    {{ $t("register") }}
                  </NuxtLinkLocale>
                </div>
                <div v-else class="flex items-center gap-3">
                  <!-- Deposit Icon -->
                  <NuxtLinkLocale
                    to="/myaccount/deposit"
                    class="relative max-lg:hidden"
                  >
                    <div
                      class="w-9 h-9 bg-red-600 rounded-full flex items-center justify-center"
                    >
                      <img
                        src="/images/deposit/deposit.png"
                        alt="Deposit"
                        class="w-[1.2rem] h-auto object-cover"
                      />
                    </div>
                  </NuxtLinkLocale>
                  <!-- Check-in Icon -->
                  <NuxtLinkLocale to="/checkin" class="relative max-lg:hidden">
                    <div
                      class="w-9 h-9 bg-red-600 rounded-full flex items-center justify-center"
                    >
                      <i
                        class="bi bi-calendar-check-fill text-white text-lg"
                      ></i>
                    </div>
                    <span
                      v-if="checkinreminder"
                      class="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse shadow-lg shadow-yellow-500/50"
                    >
                      <span
                        class="absolute inset-0 w-3 h-3 bg-yellow-400 rounded-full animate-ping"
                      ></span>
                    </span>
                  </NuxtLinkLocale>

                  <!-- Message Icon -->
                  <NuxtLinkLocale to="/myaccount/messaging" class="relative">
                    <div
                      class="w-9 h-9 bg-red-600 rounded-full flex items-center justify-center"
                    >
                      <i class="bi bi-envelope-fill text-white text-lg"></i>
                    </div>
                    <span
                      v-if="unreadCount > 0"
                      class="absolute -top-1 -right-0 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold rounded-full px-1.5 min-w-[16px] h-[16px] flex items-center justify-center shadow-lg animate-pulse"
                    >
                      {{ unreadCount }}
                    </span>
                  </NuxtLinkLocale>
                  <!-- Profile icon with dropdown -->
                  <div
                    class="relative cursor-pointer max-lg:hidden"
                    @mouseenter="showProfileMenu = true"
                    @mouseleave="showProfileMenu = false"
                  >
                    <NuxtLinkLocale to="/myaccount/profile" class="block">
                      <div
                        class="w-9 h-9 rounded-full flex items-center justify-center"
                      >
                        <img
                          src="/images/user/icon.png"
                          alt="icon"
                          class="w-full h-auto"
                        />
                      </div>
                    </NuxtLinkLocale>

                    <div
                      class="absolute right-0 top-full w-full h-2 bg-transparent"
                    ></div>

                    <!-- Profile Dropdown Menu -->
                    <div
                      v-if="showProfileMenu"
                      class="absolute left-1/2 mt-2 transform -translate-x-1/2 w-80 bg-[#1A0D13] rounded-xl border border-[#3b1c23] z-50 overflow-hidden"
                    >
                      <div
                        class="relative bg-gradient-to-br from-[#241017] to-[#1A0D13] p-4 border-b border-[#3b1c23]"
                      >
                        <div
                          class="absolute top-0 right-0 w-32 h-32 bg-[#ff3344]/5 rounded-full blur-3xl"
                        ></div>

                        <div class="relative z-10">
                          <div class="flex items-center gap-3 mb-3">
                            <!-- Avatar -->
                            <div
                              class="w-14 h-14 rounded-full bg-gradient-to-br from-[#ff3344] to-[#cc2a3a] p-0.5 flex-shrink-0"
                            >
                              <div
                                class="w-full h-full rounded-full bg-[#1A0D13] flex items-center justify-center"
                              >
                                <img
                                  src="/images/user/icon.png"
                                  alt="icon"
                                  class="w-10 h-10"
                                />
                              </div>
                            </div>

                            <!-- User Info -->
                            <div class="flex-1 min-w-0">
                              <p
                                class="text-[#f0eaea] font-bold text-base truncate"
                              >
                                {{ userData.username }}
                              </p>
                              <div class="flex items-center gap-2 mt-0.5">
                                <span class="text-[#b37a7a] text-xs">VIP:</span>
                                <span
                                  class="px-2 py-0.5 bg-gradient-to-r from-[#ff3344]/20 to-[#cc2a3a]/10 text-[#ff3344] text-xs font-bold rounded-full border border-[#ff3344]/30"
                                >
                                  {{ getLocalizedLevelName(userData.viplevel) }}
                                </span>
                              </div>
                            </div>
                          </div>

                          <!-- VIP Progress Bar -->
                          <VipProgressBar />
                        </div>
                      </div>

                      <!-- Menu Items -->
                      <div class="max-h-[400px] overflow-y-auto scrollbar-thin">
                        <!-- Cashier Section -->
                        <div>
                          <div
                            class="flex items-center justify-between p-3 lg:hover:bg-[#2a0f14] cursor-pointer transition-all duration-200 group"
                            @click="
                              activeMenuItem =
                                activeMenuItem === 'cashier' ? null : 'cashier'
                            "
                          >
                            <div class="flex items-center gap-3">
                              <div
                                class="w-9 h-9 rounded-lg bg-[#241017] flex items-center justify-center border border-[#3b1c23] lg:group-hover:border-[#ff3344]/30 transition-colors"
                              >
                                <img
                                  src="/images/user/cashier2.png"
                                  alt="Cashier"
                                  class="w-6 h-6"
                                />
                              </div>
                              <span
                                class="text-[#f0eaea] font-semibold text-sm"
                                >{{ $t("cashier") }}</span
                              >
                            </div>
                            <i
                              class="bi text-[#b37a7a] lg:group-hover:text-[#ff3344] transition-all duration-200"
                              :class="
                                activeMenuItem === 'cashier'
                                  ? 'bi-chevron-up'
                                  : 'bi-chevron-down'
                              "
                            ></i>
                          </div>

                          <!-- Cashier Sub Items with animation -->
                          <transition
                            enter-active-class="transition-all duration-200 ease-out"
                            enter-from-class="opacity-0 max-h-0"
                            enter-to-class="opacity-100 max-h-96"
                            leave-active-class="transition-all duration-200 ease-in"
                            leave-from-class="opacity-100 max-h-96"
                            leave-to-class="opacity-0 max-h-0"
                          >
                            <div
                              v-if="activeMenuItem === 'cashier'"
                              class="bg-[#15090e]/50 overflow-hidden"
                            >
                              <NuxtLinkLocale
                                to="/myaccount/deposit"
                                class="group flex items-center gap-3 pl-12 pr-3 py-2.5 text-[#f0eaea] lg:hover:bg-[#2a0f14] transition-all duration-200"
                              >
                                <i
                                  class="bi bi-arrow-down-circle text-[#ff3344] text-sm"
                                ></i>
                                <span
                                  class="text-sm lg:group-hover:text-[#ff3344] transition-colors"
                                  >{{ $t("deposit") }}</span
                                >
                              </NuxtLinkLocale>
                              <NuxtLinkLocale
                                to="/myaccount/withdraw"
                                class="group flex items-center gap-3 pl-12 pr-3 py-2.5 text-[#f0eaea] lg:hover:bg-[#2a0f14] transition-all duration-200"
                              >
                                <i
                                  class="bi bi-arrow-up-circle text-[#ff3344] text-sm"
                                ></i>
                                <span
                                  class="text-sm lg:group-hover:text-[#ff3344] transition-colors"
                                  >{{ $t("withdraw") }}</span
                                >
                              </NuxtLinkLocale>
                              <NuxtLinkLocale
                                to="/myaccount/bankaccount"
                                class="group flex items-center gap-3 pl-12 pr-3 py-2.5 text-[#f0eaea] lg:hover:bg-[#2a0f14] transition-all duration-200"
                              >
                                <i
                                  class="bi bi-bank text-[#ff3344] text-sm"
                                ></i>
                                <span
                                  class="text-sm lg:group-hover:text-[#ff3344] transition-colors"
                                  >{{ $t("bank_account") }}</span
                                >
                              </NuxtLinkLocale>
                              <NuxtLinkLocale
                                to="/myaccount/rebate"
                                class="group flex items-center gap-3 pl-12 pr-3 py-2.5 text-[#f0eaea] lg:hover:bg-[#2a0f14] transition-all duration-200"
                              >
                                <i
                                  class="bi bi-cash-coin text-[#ff3344] text-sm"
                                ></i>
                                <span
                                  class="text-sm lg:group-hover:text-[#ff3344] transition-colors"
                                  >{{ $t("rebate") }}</span
                                >
                              </NuxtLinkLocale>
                              <NuxtLinkLocale
                                to="/myaccount/promocode"
                                class="group flex items-center gap-3 pl-12 pr-3 py-2.5 text-[#f0eaea] lg:hover:bg-[#2a0f14] transition-all duration-200"
                              >
                                <i
                                  class="bi bi-ticket-perforated text-[#ff3344] text-sm"
                                ></i>
                                <span
                                  class="text-sm lg:group-hover:text-[#ff3344] transition-colors"
                                  >{{ $t("promo_code") }}</span
                                >
                              </NuxtLinkLocale>
                            </div>
                          </transition>
                        </div>

                        <div class="h-px bg-[#3b1c23]"></div>

                        <!-- Agent Section -->
                        <div>
                          <div
                            class="flex items-center justify-between p-3 lg:hover:bg-[#2a0f14] cursor-pointer transition-all duration-200 group"
                            @click="
                              activeMenuItem =
                                activeMenuItem === 'agent' ? null : 'agent'
                            "
                          >
                            <div class="flex items-center gap-3">
                              <div
                                class="w-9 h-9 rounded-lg bg-[#241017] flex items-center justify-center border border-[#3b1c23] lg:group-hover:border-[#ff3344]/30 transition-colors"
                              >
                                <img
                                  src="/images/user/agent2.png"
                                  alt="agent"
                                  class="w-6 h-6"
                                />
                              </div>
                              <span
                                class="text-[#f0eaea] font-semibold text-sm"
                                >{{ $t("agent") }}</span
                              >
                            </div>
                            <i
                              class="bi text-[#b37a7a] lg:group-hover:text-[#ff3344] transition-all duration-200"
                              :class="
                                activeMenuItem === 'agent'
                                  ? 'bi-chevron-up'
                                  : 'bi-chevron-down'
                              "
                            ></i>
                          </div>

                          <!-- Agent Sub Items -->
                          <transition
                            enter-active-class="transition-all duration-200 ease-out"
                            enter-from-class="opacity-0 max-h-0"
                            enter-to-class="opacity-100 max-h-96"
                            leave-active-class="transition-all duration-200 ease-in"
                            leave-from-class="opacity-100 max-h-96"
                            leave-to-class="opacity-0 max-h-0"
                          >
                            <div
                              v-if="activeMenuItem === 'agent'"
                              class="bg-[#15090e]/50 overflow-hidden"
                            >
                              <NuxtLinkLocale
                                to="/myaccount/referral"
                                class="group flex items-center gap-3 pl-12 pr-3 py-2.5 text-[#f0eaea] lg:hover:bg-[#2a0f14] transition-all duration-200"
                              >
                                <i
                                  class="bi bi-share-fill text-[#ff3344] text-sm"
                                ></i>
                                <span
                                  class="text-sm lg:group-hover:text-[#ff3344] transition-colors"
                                  >{{ $t("referral") }}</span
                                >
                              </NuxtLinkLocale>
                              <NuxtLinkLocale
                                to="/myaccount/downline"
                                class="group flex items-center gap-3 pl-12 pr-3 py-2.5 text-[#f0eaea] lg:hover:bg-[#2a0f14] transition-all duration-200"
                              >
                                <i
                                  class="bi bi-diagram-3 text-[#ff3344] text-sm"
                                ></i>
                                <span
                                  class="text-sm lg:group-hover:text-[#ff3344] transition-colors"
                                  >{{ $t("downline") }}</span
                                >
                              </NuxtLinkLocale>
                              <NuxtLinkLocale
                                to="/myaccount/commission"
                                class="group flex items-center gap-3 pl-12 pr-3 py-2.5 text-[#f0eaea] lg:hover:bg-[#2a0f14] transition-all duration-200"
                              >
                                <i
                                  class="bi bi-currency-dollar text-[#ff3344] text-sm"
                                ></i>
                                <span
                                  class="text-sm lg:group-hover:text-[#ff3344] transition-colors"
                                  >{{ $t("commission") }}</span
                                >
                              </NuxtLinkLocale>
                              <NuxtLinkLocale
                                v-if="userData.positionTaking > 0"
                                to="/myaccount/agentpt"
                                class="group flex items-center gap-3 pl-12 pr-3 py-2.5 text-[#f0eaea] lg:hover:bg-[#2a0f14] transition-all duration-200"
                              >
                                <i
                                  class="bi bi-graph-up text-[#ff3344] text-sm"
                                ></i>
                                <span
                                  class="text-sm lg:group-hover:text-[#ff3344] transition-colors"
                                  >{{ $t("agent_pt") }}</span
                                >
                              </NuxtLinkLocale>
                            </div>
                          </transition>
                        </div>

                        <div class="h-px bg-[#3b1c23]"></div>

                        <!-- Profile Section -->
                        <div>
                          <div
                            class="flex items-center justify-between p-3 lg:hover:bg-[#2a0f14] cursor-pointer transition-all duration-200 group"
                            @click="
                              activeMenuItem =
                                activeMenuItem === 'profile' ? null : 'profile'
                            "
                          >
                            <div class="flex items-center gap-3">
                              <div
                                class="w-9 h-9 rounded-lg bg-[#241017] flex items-center justify-center border border-[#3b1c23] lg:group-hover:border-[#ff3344]/30 transition-colors"
                              >
                                <img
                                  src="/images/user/profile2.png"
                                  alt="profile"
                                  class="w-6 h-6"
                                />
                              </div>
                              <span
                                class="text-[#f0eaea] font-semibold text-sm"
                                >{{ $t("profile") }}</span
                              >
                            </div>
                            <i
                              class="bi text-[#b37a7a] lg:group-hover:text-[#ff3344] transition-all duration-200"
                              :class="
                                activeMenuItem === 'profile'
                                  ? 'bi-chevron-up'
                                  : 'bi-chevron-down'
                              "
                            ></i>
                          </div>

                          <!-- Profile Sub Items -->
                          <transition
                            enter-active-class="transition-all duration-200 ease-out"
                            enter-from-class="opacity-0 max-h-0"
                            enter-to-class="opacity-100 max-h-96"
                            leave-active-class="transition-all duration-200 ease-in"
                            leave-from-class="opacity-100 max-h-96"
                            leave-to-class="opacity-0 max-h-0"
                          >
                            <div
                              v-if="activeMenuItem === 'profile'"
                              class="bg-[#15090e]/50 overflow-hidden"
                            >
                              <NuxtLinkLocale
                                to="/myaccount/profile"
                                class="group flex items-center gap-3 pl-12 pr-3 py-2.5 text-[#f0eaea] lg:hover:bg-[#2a0f14] transition-all duration-200"
                              >
                                <i
                                  class="bi bi-person-circle text-[#ff3344] text-sm"
                                ></i>
                                <span
                                  class="text-sm lg:group-hover:text-[#ff3344] transition-colors"
                                  >{{ $t("my_profile") }}</span
                                >
                              </NuxtLinkLocale>
                              <NuxtLinkLocale
                                to="/myaccount/mission"
                                class="group flex items-center gap-3 pl-12 pr-3 py-2.5 text-[#f0eaea] lg:hover:bg-[#2a0f14] transition-all duration-200"
                              >
                                <i
                                  class="bi bi-clipboard-check text-[#ff3344] text-sm"
                                ></i>
                                <span
                                  class="text-sm lg:group-hover:text-[#ff3344] transition-colors"
                                >
                                  {{ $t("daily_missions") }}
                                </span>
                              </NuxtLinkLocale>
                              <NuxtLinkLocale
                                to="/myaccount/messaging"
                                class="group flex items-center gap-3 pl-12 pr-3 py-2.5 text-[#f0eaea] lg:hover:bg-[#2a0f14] transition-all duration-200"
                              >
                                <i
                                  class="bi bi-envelope text-[#ff3344] text-sm"
                                ></i>
                                <span
                                  class="text-sm lg:group-hover:text-[#ff3344] transition-colors"
                                  >{{ $t("messaging") }}</span
                                >
                              </NuxtLinkLocale>
                              <NuxtLinkLocale
                                to="/myaccount/change-password"
                                class="group flex items-center gap-3 pl-12 pr-3 py-2.5 text-[#f0eaea] lg:hover:bg-[#2a0f14] transition-all duration-200"
                              >
                                <i class="bi bi-key text-[#ff3344] text-sm"></i>
                                <span
                                  class="text-sm lg:group-hover:text-[#ff3344] transition-colors"
                                  >{{ $t("change_password") }}</span
                                >
                              </NuxtLinkLocale>
                            </div>
                          </transition>
                        </div>

                        <div class="h-px bg-[#3b1c23]"></div>

                        <!-- History Section -->
                        <div>
                          <div
                            class="flex items-center justify-between p-3 lg:hover:bg-[#2a0f14] cursor-pointer transition-all duration-200 group"
                            @click="
                              activeMenuItem =
                                activeMenuItem === 'history' ? null : 'history'
                            "
                          >
                            <div class="flex items-center gap-3">
                              <div
                                class="w-9 h-9 rounded-lg bg-[#241017] flex items-center justify-center border border-[#3b1c23] lg:group-hover:border-[#ff3344]/30 transition-colors"
                              >
                                <img
                                  src="/images/user/history2.png"
                                  alt="history"
                                  class="w-6 h-6"
                                />
                              </div>
                              <span
                                class="text-[#f0eaea] font-semibold text-sm"
                                >{{ $t("history") }}</span
                              >
                            </div>
                            <i
                              class="bi text-[#b37a7a] lg:group-hover:text-[#ff3344] transition-all duration-200"
                              :class="
                                activeMenuItem === 'history'
                                  ? 'bi-chevron-up'
                                  : 'bi-chevron-down'
                              "
                            ></i>
                          </div>

                          <!-- History Sub Items -->
                          <transition
                            enter-active-class="transition-all duration-200 ease-out"
                            enter-from-class="opacity-0 max-h-0"
                            enter-to-class="opacity-100 max-h-96"
                            leave-active-class="transition-all duration-200 ease-in"
                            leave-from-class="opacity-100 max-h-96"
                            leave-to-class="opacity-0 max-h-0"
                          >
                            <div
                              v-if="activeMenuItem === 'history'"
                              class="bg-[#15090e]/50 overflow-hidden"
                            >
                              <NuxtLinkLocale
                                to="/myaccount/transaction-history"
                                class="group flex items-center gap-3 pl-12 pr-3 py-2.5 text-[#f0eaea] lg:hover:bg-[#2a0f14] transition-all duration-200"
                              >
                                <i
                                  class="bi bi-clock-history text-[#ff3344] text-sm"
                                ></i>
                                <span
                                  class="text-sm lg:group-hover:text-[#ff3344] transition-colors"
                                  >{{ $t("transaction_history") }}</span
                                >
                              </NuxtLinkLocale>
                            </div>
                          </transition>
                        </div>
                      </div>

                      <!-- Logout Button -->
                      <div
                        class="p-3 bg-gradient-to-r from-[#15090e] to-[#1a0a0f] border-t border-[#3b1c23]"
                      >
                        <button
                          @click="handleLogout"
                          class="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#241017] text-[#ff3344] lg:hover:bg-[#2a0f14] border border-[#3b1c23] lg:hover:border-[#ff3344]/50 transition-all font-semibold text-sm group"
                        >
                          <i
                            class="bi bi-box-arrow-right lg:group-hover:translate-x-1 transition-transform"
                          ></i>
                          <span>{{ $t("logout") }}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Balance -->
                  <div
                    @mouseenter="showBalanceDropdown = true"
                    @mouseleave="showBalanceDropdown = false"
                    class="relative max-lg:hidden"
                  >
                    <div class="cursor-pointer">
                      <span class="text-xs text-gray-400">{{
                        $t("main_wallet")
                      }}</span>
                      <div class="flex gap-2">
                        <span class="text-red-400"
                          >MYR {{ userData.wallet.toFixed(2) }}</span
                        >
                        <i
                          class="bi bi-caret-down-fill text-xs ml-0.5 text-red-300"
                        ></i>
                      </div>
                    </div>

                    <GameBalanceDropdown v-if="showBalanceDropdown" />
                  </div>
                </div>
              </div>

              <!-- Language Selector -->
              <div
                class="relative hidden"
                @mouseenter="showLanguageMenu = true"
                @mouseleave="showLanguageMenu = false"
              >
                <button
                  class="flex items-center gap-1 text-[#f0eaea] p-1.5 lg:hover:bg-[#2a0f14] rounded-full transition-colors"
                >
                  <img
                    :src="
                      languageOptions.find((lang) => lang.code === locale).flag
                    "
                    :alt="
                      languageOptions.find((lang) => lang.code === locale).name
                    "
                    class="w-5 h-5 rounded-full object-cover"
                  />
                </button>

                <div
                  class="absolute right-0 top-full w-full h-2 bg-transparent"
                ></div>

                <div
                  v-if="showLanguageMenu"
                  class="absolute right-0 top-full mt-2 bg-[#1A0D13] rounded-xl border border-[#3b1c23] overflow-hidden z-50 w-44 transition-all duration-200"
                >
                  <div
                    class="absolute -top-1 right-0 w-full h-1 bg-transparent"
                  ></div>

                  <div>
                    <button
                      v-for="lang in languageOptions"
                      :key="lang.code"
                      @click="changeLocale(lang.code)"
                      class="w-full text-left px-4 py-3 text-sm lg:hover:bg-[#2a0f14] flex items-center gap-3 transition-all duration-200 group"
                      :class="
                        locale === lang.code
                          ? 'text-[#ff3344] font-semibold bg-[#241017]'
                          : 'text-[#f0eaea] lg:hover:text-[#ff3344]'
                      "
                    >
                      <div class="relative">
                        <img
                          :src="lang.flag"
                          :alt="lang.name"
                          class="w-6 h-6 rounded-full object-cover shadow-sm border-2 border-[#3b1c23]"
                        />
                      </div>

                      <span class="flex-1">{{ lang.name }}</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Main Menu Button -->
              <div
                class="relative hidden lg:flex"
                @mouseenter="showMainMenu = true"
                @mouseleave="showMainMenu = false"
              >
                <button
                  class="p-1.5 text-[#f0eaea] lg:hover:bg-[#2a0f14] rounded-full transition-colors"
                >
                  <i class="bi bi-grid text-lg"></i>
                </button>

                <div
                  class="absolute right-0 top-full w-full h-2 bg-transparent"
                ></div>

                <!-- Dropdown Menu -->
                <div
                  v-if="showMainMenu"
                  class="absolute right-0 mt-2 top-full bg-[#1A0D13] rounded-xl border border-[#3b1c23] overflow-hidden z-50 w-72"
                >
                  <!-- Invisible bridge to prevent gap issues -->
                  <div
                    class="absolute -top-2 right-0 w-full h-2 bg-transparent"
                  ></div>

                  <!-- Menu Items -->
                  <div class="">
                    <div>
                      <!-- Promotions -->
                      <NuxtLinkLocale
                        to="/promotions"
                        class="xl:hidden group flex items-center gap-2 p-3 rounded-xl lg:hover:bg-[#2a0f14] transition-all duration-200 border border-transparent lg:hover:border-[#ff3344]/20 lg:hover:shadow-sm lg:hover:shadow-[#ff3344]/10"
                        @click="showMainMenu = false"
                      >
                        <div
                          class="w-12 h-12 flex items-center justify-center mb-2"
                        >
                          <img
                            src="/images/burger-menu/promotions.png"
                            class="w-[80%] h-auto object-contain"
                            alt="promotions"
                          />
                        </div>
                        <div class="flex-1">
                          <span
                            class="text-sm font-semibold text-[#f0eaea] lg:group-hover:text-[#ff3344] transition-colors block"
                          >
                            {{ $t("promotions") }}
                          </span>
                          <p class="text-xs text-[#b37a7a] mt-0.5">
                            {{ $t("promotions_desc") }}
                          </p>
                        </div>
                        <i
                          class="bi bi-chevron-right text-[#b37a7a] lg:group-hover:text-[#ff3344] transition-colors"
                        ></i>
                      </NuxtLinkLocale>

                      <!-- VIP -->
                      <NuxtLinkLocale
                        to="/vip"
                        class="xl:hidden group flex items-center gap-2 p-3 rounded-xl lg:hover:bg-[#2a0f14] transition-all duration-200 border border-transparent lg:hover:border-[#ff3344]/20 lg:hover:shadow-sm lg:hover:shadow-[#ff3344]/10"
                        @click="showMainMenu = false"
                      >
                        <div
                          class="w-12 h-12 flex items-center justify-center mb-2"
                        >
                          <img
                            src="/images/burger-menu/vip.png"
                            class="w-[80%] h-auto object-contain"
                            alt="vip"
                          />
                        </div>
                        <div class="flex-1">
                          <span
                            class="text-sm font-semibold text-[#f0eaea] lg:group-hover:text-[#ff3344] transition-colors block"
                          >
                            {{ $t("vip") }}
                          </span>
                          <p class="text-xs text-[#b37a7a] mt-0.5">
                            {{ $t("vip_desc") }}
                          </p>
                        </div>
                        <i
                          class="bi bi-chevron-right text-[#b37a7a] lg:group-hover:text-[#ff3344] transition-colors"
                        ></i>
                      </NuxtLinkLocale>

                      <!-- Refer Friends -->
                      <NuxtLinkLocale
                        to="/myaccount/referral"
                        class="group flex items-center gap-2 p-3 rounded-xl lg:hover:bg-[#2a0f14] transition-all duration-200 border border-transparent lg:hover:border-[#ff3344]/20 lg:hover:shadow-sm lg:hover:shadow-[#ff3344]/10"
                        @click="showMainMenu = false"
                      >
                        <div class="w-12 h-12 flex items-center justify-center">
                          <img
                            src="/images/burger-menu/refer.png"
                            class="w-[80%] h-auto object-contain"
                            alt="refer"
                          />
                        </div>
                        <div class="flex-1">
                          <span
                            class="text-sm font-semibold text-[#f0eaea] lg:group-hover:text-[#ff3344] transition-colors block"
                          >
                            {{ $t("refer_a_friend") }}
                          </span>
                          <p class="text-xs text-[#b37a7a] mt-0.5">
                            {{ $t("refer_a_friend_desc") }}
                          </p>
                        </div>
                        <i
                          class="bi bi-chevron-right text-[#b37a7a] lg:group-hover:text-[#ff3344] transition-colors"
                        ></i>
                      </NuxtLinkLocale>

                      <!-- Lucky Draw -->
                      <NuxtLinkLocale
                        v-if="luckyDrawStatus"
                        to="/luckydraw"
                        class="group flex items-center gap-2 p-3 rounded-xl lg:hover:bg-[#2a0f14] transition-all duration-200 border border-transparent lg:hover:border-[#ff3344]/20 lg:hover:shadow-sm lg:hover:shadow-[#ff3344]/10"
                        @click="showMainMenu = false"
                      >
                        <div
                          class="w-12 h-12 bg-[#241017] rounded-xl flex items-center justify-center border border-[#3b1c23] flex-shrink-0"
                        >
                          <img
                            src="/images/newicon/dice.png"
                            class="w-[80%] h-auto object-contain"
                            alt="Lucky Draw"
                          />
                        </div>
                        <div class="flex-1">
                          <span
                            class="text-sm font-semibold text-[#f0eaea] lg:group-hover:text-[#ff3344] transition-colors block"
                          >
                            {{ $t("lucky_draw") }}
                          </span>
                          <p class="text-xs text-[#b37a7a] mt-1">
                            {{ $t("lucky_draw_desc") }}
                          </p>
                        </div>
                        <i
                          class="bi bi-chevron-right text-[#b37a7a] lg:group-hover:text-[#ff3344] transition-colors"
                        ></i>
                      </NuxtLinkLocale>

                      <!-- Blog -->
                      <NuxtLinkLocale
                        to="/blog"
                        class="group flex items-center gap-2 p-3 rounded-xl lg:hover:bg-[#2a0f14] transition-all duration-200 border border-transparent lg:hover:border-[#ff3344]/20 lg:hover:shadow-sm lg:hover:shadow-[#ff3344]/10"
                        @click="mobileMenuOpen = false"
                      >
                        <div
                          class="w-12 h-12 flex items-center justify-center mb-2"
                        >
                          <img
                            src="/images/burger-menu/blog.png"
                            class="w-[80%] h-auto object-contain"
                            alt="blog"
                          />
                        </div>
                        <div class="flex-1">
                          <span
                            class="text-sm font-semibold text-[#f0eaea] lg:group-hover:text-[#ff3344] transition-colors block"
                          >
                            {{ $t("blog") }}
                          </span>
                          <p class="text-xs text-[#b37a7a] mt-0.5">
                            {{ $t("blog_description_short") }}
                          </p>
                        </div>
                        <i
                          class="bi bi-chevron-right text-[#b37a7a] lg:group-hover:text-[#ff3344] transition-colors"
                        ></i>
                      </NuxtLinkLocale>

                      <!-- Leaderboard -->
                      <NuxtLinkLocale
                        to="/leaderboard"
                        class="group flex items-center gap-2 p-3 rounded-xl lg:hover:bg-[#2a0f14] transition-all duration-200 border border-transparent lg:hover:border-[#ff3344]/20 lg:hover:shadow-sm lg:hover:shadow-[#ff3344]/10"
                        @click="mobileMenuOpen = false"
                      >
                        <div
                          class="w-12 h-12 flex items-center justify-center mb-2"
                        >
                          <img
                            src="/images/burger-menu/leaderboard.png"
                            class="w-[80%] h-auto object-contain"
                            alt="leaderboard"
                          />
                        </div>
                        <div class="flex-1">
                          <span
                            class="text-sm font-semibold text-[#f0eaea] lg:group-hover:text-[#ff3344] transition-colors block"
                          >
                            {{ $t("leaderboard") }}
                          </span>
                          <p class="text-xs text-[#b37a7a] mt-0.5">
                            {{ $t("leaderboard_description_short") }}
                          </p>
                        </div>
                        <i
                          class="bi bi-chevron-right text-[#b37a7a] lg:group-hover:text-[#ff3344] transition-colors"
                        ></i>
                      </NuxtLinkLocale>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Country/Region Selection Button -->
              <div
                class="relative hidden lg:flex"
                @mouseenter="showCountryMenu = true"
                @mouseleave="showCountryMenu = false"
              >
                <button
                  class="p-1.5 lg:hover:bg-[#2a0f14] rounded-full transition-colors flex items-center justify-center"
                >
                  <img
                    v-if="isMalaysiaDomain"
                    src="/images/flags/malaysia.png"
                    alt="Malaysia"
                    class="w-8 h-auto"
                  />
                  <img
                    v-else-if="isSingaporeDomain"
                    src="/images/flags/singapore.png"
                    alt="Singapore"
                    class="w-8 h-auto"
                  />
                  <img
                    v-else
                    :src="generalSetting.logoimage"
                    alt="Region"
                    class="w-8 h-auto"
                  />
                </button>
                <div
                  class="absolute right-0 top-full w-full h-2 bg-transparent"
                ></div>
                <div
                  v-if="showCountryMenu"
                  class="absolute mt-2 right-0 top-full bg-[#1A0D13] rounded-xl border border-[#3b1c23] overflow-hidden z-50 w-64"
                >
                  <div
                    class="absolute -top-2 right-0 w-full h-2 bg-transparent"
                  ></div>
                  <div class="p-2">
                    <div class="px-3 pb-2">
                      <span
                        class="text-xs font-semibold text-[#b37a7a] uppercase tracking-wider"
                      >
                        {{ $t("select_region") }}
                      </span>
                    </div>

                    <!-- Malaysia -->
                    <div class="mb-2">
                      <div class="flex items-center gap-2 px-3 py-2">
                        <img
                          src="/images/flags/malaysia.png"
                          alt="Malaysia"
                          class="w-7 h-auto"
                        />
                        <span class="text-sm font-semibold text-[#f0eaea]">
                          {{ $t("malaysia") }}
                        </span>
                      </div>
                      <div class="px-3">
                        <div class="flex rounded-lg overflow-hidden">
                          <button
                            @click="switchToMalaysia('en')"
                            :class="[
                              'flex-1 text-center px-3 py-2 text-sm transition-colors border-r border-[#3b1c23]',
                              locale === 'en' && isMalaysiaDomain
                                ? ' text-[#ff3344] font-semibold'
                                : 'text-[#f0eaea]  lg:hover:text-[#ff3344]',
                            ]"
                          >
                            English
                          </button>
                          <button
                            @click="switchToMalaysia('ms')"
                            :class="[
                              'flex-1 text-center px-3 py-2 text-sm transition-colors border-r border-[#3b1c23]',
                              locale === 'ms' && isMalaysiaDomain
                                ? ' text-[#ff3344] font-semibold'
                                : 'text-[#f0eaea]  lg:hover:text-[#ff3344]',
                            ]"
                          >
                            Malay
                          </button>
                          <button
                            @click="switchToMalaysia('zh')"
                            :class="[
                              'flex-1 text-center px-3 py-2 text-sm transition-colors',
                              locale === 'zh' && isMalaysiaDomain
                                ? ' text-[#ff3344] font-semibold'
                                : 'text-[#f0eaea]  lg:hover:text-[#ff3344]',
                            ]"
                          >
                            中文
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Singapore -->
                    <div>
                      <div class="flex items-center gap-2 px-3 py-2">
                        <img
                          src="/images/flags/singapore.png"
                          alt="Singapore"
                          class="w-7 h-auto"
                        />
                        <span class="text-sm font-semibold text-[#f0eaea]">
                          {{ $t("singapore") }}
                        </span>
                      </div>
                      <div class="px-3">
                        <div class="flex rounded-lg overflow-hidden">
                          <button
                            @click="switchToSingapore('en')"
                            :class="[
                              'flex-1 text-center px-3 py-2 text-sm transition-colors border-r border-[#3b1c23]',
                              locale === 'en' && isSingaporeDomain
                                ? ' text-[#ff3344] font-semibold'
                                : 'text-[#f0eaea]  lg:hover:text-[#ff3344]',
                            ]"
                          >
                            English
                          </button>
                          <button
                            @click="switchToSingapore('zh')"
                            :class="[
                              'flex-1 text-center px-3 py-2 text-sm transition-colors',
                              locale === 'zh' && isSingaporeDomain
                                ? ' text-[#ff3344] font-semibold'
                                : 'text-[#f0eaea]  lg:hover:text-[#ff3344]',
                            ]"
                          >
                            中文
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Thailand -->
                    <div class="mb-2">
                      <div class="flex items-center justify-between px-3 py-2">
                        <div class="flex items-center gap-2">
                          <img
                            src="/images/flags/thailand.png"
                            alt="Thailand"
                            class="w-7 h-auto"
                          />
                          <span class="text-sm font-semibold text-[#f0eaea]">
                            {{ $t("thailand") }}
                          </span>
                        </div>
                        <span class="text-xs text-[#b37a7a] italic">
                          {{ $t("coming_soon") }}
                        </span>
                      </div>
                    </div>

                    <!-- Vietnam -->
                    <div class="mb-2">
                      <div class="flex items-center justify-between px-3 py-2">
                        <div class="flex items-center gap-2">
                          <img
                            src="/images/flags/vietnam.png"
                            alt="Vietnam"
                            class="w-7 h-auto"
                          />
                          <span class="text-sm font-semibold text-[#f0eaea]">
                            {{ $t("vietnam") }}
                          </span>
                        </div>
                        <span class="text-xs text-[#b37a7a] italic">
                          {{ $t("coming_soon") }}
                        </span>
                      </div>
                    </div>

                    <!-- Philippines -->
                    <div>
                      <div class="flex items-center justify-between px-3 py-2">
                        <div class="flex items-center gap-2">
                          <img
                            src="/images/flags/philippines.png"
                            alt="Philippines"
                            class="w-7 h-auto"
                          />
                          <span class="text-sm font-semibold text-[#f0eaea]">
                            {{ $t("philippines") }}
                          </span>
                        </div>
                        <span class="text-xs text-[#b37a7a] italic">
                          {{ $t("coming_soon") }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <template v-for="item in HeaderNav" :key="`dropdown-${item.name}`">
          <div
            v-show="activeDropdown === item.name"
            class="absolute left-0 w-full bg-[#0a0005] py-8 z-40 mega-dropdown border-t-2 border-red-600/30 shadow-2xl"
            style="top: 100%"
            @mouseenter="activeDropdown = item.name"
            @mouseleave="activeDropdown = null"
          >
            <div class="max-w-[1200px] mx-auto px-6">
              <!-- Header -->
              <div class="px-3 pt-2 flex justify-between items-center">
                <div class="flex items-center gap-3">
                  <h2
                    class="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                  >
                    {{ item.label }}
                  </h2>
                </div>
                <NuxtLinkLocale :to="`${item.link}`" class="group px-3 py-2">
                  <span
                    class="flex items-center gap-2 text-sm font-semibold text-gray-400 lg:group-hover:text-[#ff3344] transition-colors duration-300"
                  >
                    {{ $t("view_all") }}
                    <i
                      class="bi bi-chevron-double-right text-[#ff3344] opacity-60 lg:group-hover:opacity-100 lg:group-hover:translate-x-1 transition-all duration-300"
                    ></i>
                  </span>
                </NuxtLinkLocale>
              </div>

              <!-- Sports Games -->
              <div
                v-if="item.name === 'Sports'"
                class="grid grid-cols-8 max-2xl:grid-cols-7 max-xl:grid-cols-6 max-lg:grid-cols-5 game-grid gap-x-2"
              >
                <template v-for="game in sportsKiosks" :key="game._id">
                  <div
                    class="game-item group cursor-pointer relative"
                    @click="launchGame(game)"
                  >
                    <div
                      class="aspect-[3/4] flex items-center justify-center relative transition-all duration-300"
                    >
                      <div
                        v-if="isGameLocked(game.databaseName)"
                        class="absolute inset-0 bg-black/80 flex items-center justify-center z-20"
                      ></div>

                      <div
                        class="inactive-overlay absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 pointer-events-none z-10"
                      ></div>

                      <img
                        :src="game.icon || fallback(game.name)"
                        :alt="game.name"
                        class="w-full h-full object-contain relative z-0 transition-transform duration-300 lg:group-hover:scale-105"
                      />
                    </div>
                  </div>
                </template>
              </div>

              <!-- E-Sports Games -->
              <div
                v-if="item.name === 'E-Sports'"
                class="grid grid-cols-8 max-2xl:grid-cols-7 max-xl:grid-cols-6 max-lg:grid-cols-5 game-grid gap-x-2"
              >
                <template v-for="game in esportsKiosks" :key="game._id">
                  <div
                    class="game-item group cursor-pointer relative"
                    @click="launchGame(game)"
                  >
                    <div
                      class="aspect-[3/4] flex items-center justify-center relative transition-all duration-300"
                    >
                      <div
                        v-if="isGameLocked(game.databaseName)"
                        class="absolute inset-0 bg-black/80 flex items-center justify-center z-20"
                      ></div>
                      <div
                        class="inactive-overlay absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 pointer-events-none z-10"
                      ></div>

                      <img
                        :src="game.icon || fallback(game.name)"
                        :alt="game.name"
                        class="w-full h-full object-contain relative z-0 transition-transform duration-300 lg:group-hover:scale-105"
                      />
                    </div>
                  </div>
                </template>
              </div>

              <!-- Casino Games -->
              <div
                v-if="item.name === 'Casino'"
                class="grid grid-cols-8 max-2xl:grid-cols-7 max-xl:grid-cols-6 max-lg:grid-cols-5 game-grid gap-x-2"
              >
                <template v-for="game in liveCasinoKiosks" :key="game._id">
                  <div
                    class="game-item group cursor-pointer relative"
                    @click="launchGame(game)"
                  >
                    <div
                      class="aspect-[3/4] flex items-center justify-center relative transition-all duration-300"
                    >
                      <div
                        v-if="isGameLocked(game.databaseName)"
                        class="absolute inset-0 bg-black/80 flex items-center justify-center z-20"
                      ></div>
                      <div
                        class="inactive-overlay absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 pointer-events-none z-10"
                      ></div>

                      <img
                        :src="game.icon || fallback(game.name)"
                        :alt="game.name"
                        class="w-full h-full object-contain relative z-0 transition-transform duration-300 lg:group-hover:scale-105"
                      />
                    </div>
                  </div>
                </template>
              </div>

              <!-- Slots Games -->
              <div
                v-if="item.name === 'Slots'"
                class="grid grid-cols-8 max-2xl:grid-cols-7 max-xl:grid-cols-6 max-lg:grid-cols-5 game-grid gap-x-2"
              >
                <template v-for="(game, index) in slotKiosks" :key="game._id">
                  <div
                    v-if="index < 15"
                    class="game-item group cursor-pointer relative"
                    @click="launchGame(game)"
                  >
                    <div
                      class="aspect-[3/4] flex items-center justify-center relative transition-all duration-300"
                    >
                      <div
                        v-if="isGameLocked(game.databaseName)"
                        class="absolute inset-0 bg-black/80 flex items-center justify-center z-20"
                      ></div>
                      <div
                        class="inactive-overlay absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 pointer-events-none z-10"
                      ></div>

                      <img
                        :src="game.icon || fallback(game.name)"
                        :alt="game.name"
                        class="w-full h-full object-contain relative z-0 transition-transform duration-300 lg:group-hover:scale-105"
                      />
                    </div>
                  </div>
                </template>

                <div
                  v-if="slotKiosks.length > 15"
                  class="game-item group cursor-pointer relative"
                >
                  <NuxtLinkLocale
                    :to="HeaderNav.find((nav) => nav.name === 'Slots').link"
                    @click="activeDropdown = null"
                    class="game-item group cursor-pointer relative block h-full"
                  >
                    <div
                      class="aspect-[3/4] flex items-center justify-center relative transition-all duration-300"
                    >
                      <div
                        class="inactive-overlay absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 pointer-events-none z-10"
                      ></div>

                      <img
                        src="/images/logo/view_more.png"
                        alt="View More"
                        class="w-full h-full object-contain relative z-0 transition-transform duration-300 lg:group-hover:scale-105"
                      />
                      <div
                        class="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-5"
                      >
                        <span
                          class="text-red-400 font-bold text-sm mb-1 lg:group-hover:text-red-300 transition-colors uppercase tracking-wide"
                        >
                          {{ $t("view_more") }}
                        </span>
                        <span class="text-[#b37a7a] text-xs">
                          {{ slotKiosks.length - 15 }} {{ $t("games") }}
                        </span>
                      </div>
                    </div>
                  </NuxtLinkLocale>
                </div>
              </div>

              <!-- Fishing Games -->
              <div
                v-if="item.name === 'Fishing'"
                class="grid grid-cols-8 max-2xl:grid-cols-7 max-xl:grid-cols-6 max-lg:grid-cols-5 game-grid gap-x-2"
              >
                <template v-for="game in fishingKiosks" :key="game._id">
                  <div
                    class="game-item group cursor-pointer relative"
                    @click="launchGame(game)"
                  >
                    <div
                      class="aspect-[3/4] flex items-center justify-center relative transition-all duration-300"
                    >
                      <div
                        v-if="isGameLocked(game.databaseName)"
                        class="absolute inset-0 bg-black/80 flex items-center justify-center z-20"
                      ></div>
                      <div
                        class="inactive-overlay absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 pointer-events-none z-10"
                      ></div>

                      <img
                        :src="game.icon || fallback(game.name)"
                        :alt="game.name"
                        class="w-full h-full object-contain relative z-0 transition-transform duration-300 lg:group-hover:scale-105"
                      />
                    </div>
                  </div>
                </template>
              </div>

              <!-- Lottery Games -->
              <div
                v-if="item.name === 'Lottery'"
                class="grid grid-cols-8 max-2xl:grid-cols-7 max-xl:grid-cols-6 max-lg:grid-cols-5 game-grid gap-x-2"
              >
                <template v-for="game in lotteryKiosks" :key="game._id">
                  <div
                    class="game-item group cursor-pointer relative"
                    @click="launchGame(game)"
                  >
                    <div
                      class="aspect-[3/4] flex items-center justify-center relative transition-all duration-300"
                    >
                      <div
                        v-if="isGameLocked(game.databaseName)"
                        class="absolute inset-0 bg-black/80 flex items-center justify-center z-20"
                      ></div>
                      <div
                        class="inactive-overlay absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 pointer-events-none z-10"
                      ></div>

                      <img
                        :src="game.icon || fallback(game.name)"
                        :alt="game.name"
                        class="w-full h-full object-contain relative z-0 transition-transform duration-300 lg:group-hover:scale-105"
                      />
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </template>
      </header>

      <!-- Mobile Menu Slide-in Panel -->
      <div
        class="fixed inset-0 z-50 lg:hidden transition-opacity duration-300"
        :class="
          mobileMenuOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        "
      >
        <!-- Backdrop with fade effect -->
        <div
          class="absolute inset-0 bg-black/40 transition-opacity duration-300"
          :class="mobileMenuOpen ? 'opacity-100' : 'opacity-0'"
          @click="closeMobileMenu"
        ></div>

        <!-- Menu Content with slide animation -->
        <div
          class="fixed inset-0 z-50 lg:hidden transition-opacity duration-300"
          :class="
            mobileMenuOpen
              ? 'pointer-events-auto opacity-100'
              : 'pointer-events-none opacity-0'
          "
        >
          <!-- Backdrop -->
          <div
            class="absolute inset-0 bg-black/40 transition-opacity duration-300"
            :class="mobileMenuOpen ? 'opacity-100' : 'opacity-0'"
            @click="closeMobileMenu"
          ></div>

          <!-- Slide-in Panel (Flex Column + Sticky Footer) -->
          <div
            class="fixed inset-0 z-50 lg:hidden transition-opacity duration-300"
            :class="
              mobileMenuOpen
                ? 'pointer-events-auto opacity-100'
                : 'pointer-events-none opacity-0'
            "
          >
            <div
              class="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
              :class="mobileMenuOpen ? 'opacity-100' : 'opacity-0'"
              @click="closeMobileMenu"
            ></div>

            <div
              class="h-screen w-[280px] max-w-[85%] bg-[#1A0D13] shadow-2xl shadow-[#ff3344]/20 overflow-hidden flex flex-col transition-transform duration-300 ease-out transform border-r border-[#3b1c23]"
              :class="mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'"
              style="height: 100dvh; overflow-x: hidden"
            >
              <div class="bg-gradient-to-r from-[#1f0a0f] to-[#3d1219] p-4">
                <div class="flex justify-between items-center">
                  <img
                    :src="generalSetting.logoimage"
                    alt="Logo"
                    class="h-auto w-16"
                  />
                  <div class="flex items-center gap-2">
                    <div class="relative language-dropdown hidden">
                      <button
                        @click.stop="showLanguageMenu = !showLanguageMenu"
                        class="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white lg:hover:bg-white/30 transition-colors"
                      >
                        <img
                          :src="
                            languageOptions.find((lang) => lang.code === locale)
                              .flag
                          "
                          :alt="
                            languageOptions.find((lang) => lang.code === locale)
                              .name
                          "
                          class="w-5 h-5 rounded-full object-cover"
                        />
                      </button>
                      <div v-if="showLanguageMenu" class="relative z-[999]">
                        <div
                          class="lg:hidden fixed flex items-center justify-center inset-0 bg-black/80 backdrop-blur-sm z-40"
                          @click="showLanguageMenu = false"
                        ></div>
                        <div
                          class="absolute right-0 mt-2 bg-[#1A0D13] border border-[#3b1c23] rounded-lg shadow-2xl shadow-[#ff3344]/20 z-50 w-32"
                        >
                          <button
                            v-for="lang in languageOptions"
                            :key="lang.code"
                            @click.stop="
                              changeLocale(lang.code);
                              showLanguageMenu = false;
                            "
                            class="flex items-center gap-2 w-full px-3 py-2 lg:hover:bg-[#2a0f14] text-left transition-colors"
                            :class="
                              locale === lang.code
                                ? 'bg-[#241017] text-[#ff3344] font-medium'
                                : 'text-[#f0eaea]'
                            "
                          >
                            <img
                              :src="lang.flag"
                              :alt="lang.name"
                              class="w-5 h-5 rounded-full object-cover"
                            />
                            {{ lang.name }}
                          </button>
                        </div>
                      </div>
                    </div>

                    <NuxtLinkLocale
                      to="/checkin"
                      @click="closeMobileMenu"
                      class="relative w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white lg:hover:bg-white/30 transition-colors"
                    >
                      <img
                        src="/images/checkin/checkin.png"
                        alt="Check-in"
                        class="w-4 h-4 object-contain"
                      />
                      <span
                        v-if="checkinreminder"
                        class="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse shadow-lg shadow-yellow-500/50"
                      >
                        <span
                          class="absolute inset-0 w-3 h-3 bg-yellow-400 rounded-full animate-ping"
                        ></span>
                      </span>
                    </NuxtLinkLocale>

                    <div class="relative">
                      <button
                        @click.stop="showLanguagePanel = true"
                        class="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white lg:hover:bg-white/30 transition-colors"
                      >
                        <img
                          v-if="isMalaysiaDomain"
                          src="/images/flags/malaysia.png"
                          alt="Malaysia"
                          class="w-5 h-auto"
                        />
                        <img
                          v-else-if="isSingaporeDomain"
                          src="/images/flags/singapore.png"
                          alt="Singapore"
                          class="w-5 h-auto"
                        />
                        <img
                          v-else
                          :src="generalSetting.logoimage"
                          alt="Region"
                          class="w-5 h-auto"
                        />
                      </button>
                    </div>

                    <button
                      @click="closeMobileMenu"
                      class="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white lg:hover:bg-white/30 transition-colors"
                    >
                      <i class="bi bi-x text-lg"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div
                class="flex-1 overflow-y-auto pb-4 scrollbar-thin"
                style="overflow-x: hidden"
              >
                <!-- Language Selection Panel -->
                <div v-if="showLanguagePanel" class="h-full flex flex-col">
                  <div
                    class="px-4 py-4 border-b border-[#3b1c23] flex items-center gap-3"
                  >
                    <button
                      @click="showLanguagePanel = false"
                      class="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white lg:hover:bg-white/30 transition-colors"
                    >
                      <i class="bi bi-arrow-left"></i>
                    </button>
                    <span class="text-sm font-semibold text-[#f0eaea]">
                      {{ $t("select_region") }}
                    </span>
                  </div>

                  <div class="flex-1 px-4 pt-2">
                    <div>
                      <!-- Malaysia -->
                      <div class="mb-2">
                        <div class="flex items-center gap-2 py-2">
                          <img
                            src="/images/flags/malaysia.png"
                            alt="Malaysia"
                            class="w-7 h-auto"
                          />
                          <span class="text-sm font-semibold text-[#f0eaea]">
                            {{ $t("malaysia") }}
                          </span>
                        </div>
                        <div>
                          <div class="flex rounded-lg overflow-hidden">
                            <button
                              @click="
                                switchToMalaysia('en');
                                showLanguagePanel = false;
                              "
                              :class="[
                                'flex-1 text-center px-3 py-2 text-sm transition-colors border-r border-[#3b1c23]',
                                locale === 'en' && isMalaysiaDomain
                                  ? 'text-[#ff3344] font-semibold'
                                  : 'text-[#f0eaea]',
                              ]"
                            >
                              English
                            </button>
                            <button
                              @click="
                                switchToMalaysia('ms');
                                showLanguagePanel = false;
                              "
                              :class="[
                                'flex-1 text-center px-3 py-2 text-sm transition-colors border-r border-[#3b1c23]',
                                locale === 'ms' && isMalaysiaDomain
                                  ? 'text-[#ff3344] font-semibold'
                                  : 'text-[#f0eaea]',
                              ]"
                            >
                              Malay
                            </button>
                            <button
                              @click="
                                switchToMalaysia('zh');
                                showLanguagePanel = false;
                              "
                              :class="[
                                'flex-1 text-center px-3 py-2 text-sm transition-colors',
                                locale === 'zh' && isMalaysiaDomain
                                  ? 'text-[#ff3344] font-semibold'
                                  : 'text-[#f0eaea]',
                              ]"
                            >
                              中文
                            </button>
                          </div>
                        </div>
                      </div>

                      <!-- Singapore -->
                      <div>
                        <div class="flex items-center gap-2 py-2">
                          <img
                            src="/images/flags/singapore.png"
                            alt="Singapore"
                            class="w-7 h-auto"
                          />
                          <span class="text-sm font-semibold text-[#f0eaea]">
                            {{ $t("singapore") }}
                          </span>
                        </div>
                        <div>
                          <div class="flex rounded-lg overflow-hidden">
                            <button
                              @click="
                                switchToSingapore('en');
                                showLanguagePanel = false;
                              "
                              :class="[
                                'flex-1 text-center px-3 py-2 text-sm transition-colors border-r border-[#3b1c23]',
                                locale === 'en' && isSingaporeDomain
                                  ? 'text-[#ff3344] font-semibold'
                                  : 'text-[#f0eaea]',
                              ]"
                            >
                              English
                            </button>
                            <button
                              @click="
                                switchToSingapore('zh');
                                showLanguagePanel = false;
                              "
                              :class="[
                                'flex-1 text-center px-3 py-2 text-sm transition-colors',
                                locale === 'zh' && isSingaporeDomain
                                  ? 'text-[#ff3344] font-semibold'
                                  : 'text-[#f0eaea]',
                              ]"
                            >
                              中文
                            </button>
                          </div>
                        </div>
                      </div>

                      <!-- Thailand -->
                      <div class="mb-2">
                        <div class="flex items-center justify-between py-2">
                          <div class="flex items-center gap-2">
                            <img
                              src="/images/flags/thailand.png"
                              alt="Thailand"
                              class="w-7 h-auto"
                            />
                            <span class="text-sm font-semibold text-[#f0eaea]">
                              {{ $t("thailand") }}
                            </span>
                          </div>
                          <span class="text-xs text-[#b37a7a] italic">
                            {{ $t("coming_soon") }}
                          </span>
                        </div>
                      </div>

                      <!-- Vietnam -->
                      <div class="mb-2">
                        <div class="flex items-center justify-between py-2">
                          <div class="flex items-center gap-2">
                            <img
                              src="/images/flags/vietnam.png"
                              alt="Vietnam"
                              class="w-7 h-auto"
                            />
                            <span class="text-sm font-semibold text-[#f0eaea]">
                              {{ $t("vietnam") }}
                            </span>
                          </div>
                          <span class="text-xs text-[#b37a7a] italic">
                            {{ $t("coming_soon") }}
                          </span>
                        </div>
                      </div>

                      <!-- Philippines -->
                      <div>
                        <div class="flex items-center justify-between py-2">
                          <div class="flex items-center gap-2">
                            <img
                              src="/images/flags/philippines.png"
                              alt="Philippines"
                              class="w-7 h-auto"
                            />
                            <span class="text-sm font-semibold text-[#f0eaea]">
                              {{ $t("philippines") }}
                            </span>
                          </div>
                          <span class="text-xs text-[#b37a7a] italic">
                            {{ $t("coming_soon") }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Balance Panel -->
                <div v-if="showBalancePanel" class="h-full flex flex-col">
                  <div
                    class="px-4 py-4 border-b border-[#3b1c23] flex items-center gap-3"
                  >
                    <button
                      @click="showBalancePanel = false"
                      class="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white lg:hover:bg-white/30 transition-colors"
                    >
                      <i class="bi bi-arrow-left"></i>
                    </button>
                    <span class="text-sm font-semibold text-[#f0eaea]">
                      {{ $t("game_balances") }}
                    </span>
                  </div>

                  <div class="flex-1 overflow-y-auto scrollbar-thin">
                    <div v-if="isBalancePanelLoading" class="py-12">
                      <div class="flex flex-col items-center justify-center">
                        <div class="relative w-10 h-10 mb-3">
                          <div
                            class="absolute inset-0 border-2 border-[#3b1c23] rounded-full"
                          ></div>
                          <div
                            class="absolute inset-0 border-t-2 border-[#5a2530] rounded-full animate-spin"
                          ></div>
                        </div>
                        <p class="text-[#f0eaea] font-medium text-sm">
                          {{ $t("loading_balances") }}
                        </p>
                      </div>
                    </div>

                    <div v-if="!isBalancePanelLoading">
                      <!-- Main Wallet Section -->
                      <div class="p-4 border-b border-[#3b1c23]">
                        <div
                          class="p-3.5 bg-[#15090e] rounded-lg border border-[#3b1c23]"
                        >
                          <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                              <div
                                class="w-10 h-10 rounded-lg bg-[#241017] border border-[#3b1c23] flex items-center justify-center p-2"
                              >
                                <img
                                  :src="generalSetting.logoimage"
                                  alt=""
                                  class="w-full h-full object-contain"
                                />
                              </div>
                              <div>
                                <p class="text-xs text-[#8a6b73] font-medium">
                                  {{ $t("main_wallet") }}
                                </p>
                                <p
                                  class="text-base font-bold text-[#f0eaea] tabular-nums mt-0.5"
                                >
                                  {{ userData.wallet.toFixed(2) }}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Game Wallets Section -->
                      <div class="p-4">
                        <div class="flex items-center gap-2 mb-3 px-1">
                          <div class="h-px flex-1 bg-[#3b1c23]"></div>
                          <p
                            class="text-xs font-semibold text-[#8a6b73] uppercase tracking-wider"
                          >
                            {{ $t("game_wallets") }}
                          </p>
                          <div class="h-px flex-1 bg-[#3b1c23]"></div>
                        </div>

                        <div class="space-y-2">
                          <div
                            v-for="game in panelGameBalances"
                            :key="game.game"
                            class="p-3 bg-[#15090e]/50 backdrop-blur-sm rounded-lg border border-[#3b1c23]"
                          >
                            <div class="flex items-center justify-between">
                              <div class="flex items-center gap-3">
                                <div
                                  class="w-10 h-10 rounded-lg bg-[#241017] border border-[#3b1c23] flex items-center justify-center overflow-hidden p-1.5"
                                >
                                  <img
                                    v-if="getGameIcon(game.game)"
                                    :src="getGameIcon(game.game)"
                                    :alt="game.game"
                                    class="w-full h-full object-contain"
                                  />
                                  <span
                                    v-else
                                    class="font-bold text-xs text-[#8a6b73]"
                                  >
                                    {{
                                      game.game.substring(0, 2).toUpperCase()
                                    }}
                                  </span>
                                </div>
                                <span
                                  class="text-sm font-medium text-[#f0eaea]"
                                >
                                  {{ game.game }}
                                </span>
                              </div>
                              <span
                                class="font-semibold text-sm text-[#f0eaea] tabular-nums"
                              >
                                {{ parseFloat(game.balance || 0).toFixed(2) }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    v-if="!isBalancePanelLoading"
                    class="border-t border-[#3b1c23] bg-[#241017]"
                  >
                    <div class="px-4 py-3 border-b border-[#3b1c23]">
                      <div class="flex items-center justify-between">
                        <span class="text-sm font-semibold text-[#f0eaea]">
                          {{ $t("total_balance") }}
                        </span>
                        <span
                          class="text-base font-bold text-[#f0eaea] tabular-nums"
                        >
                          {{ panelTotalBalance.toFixed(2) }}
                        </span>
                      </div>
                    </div>

                    <div class="p-4">
                      <button
                        @click="refreshPanelBalances"
                        :disabled="isBalancePanelLoading"
                        class="w-full py-2.5 bg-[#15090e] border border-[#3b1c23] text-[#f0eaea] font-medium rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <i class="bi bi-arrow-counterclockwise"></i>
                        {{ $t("restore") }}
                      </button>
                    </div>
                  </div>
                </div>

                <div v-if="!showLanguagePanel && !showBalancePanel">
                  <div v-if="!userData" class="px-4 pt-3 flex gap-3">
                    <NuxtLinkLocale
                      to="/login"
                      @click="closeMobileMenu"
                      class="flex-1 py-2 text-center bg-gradient-to-r from-yellow-700 to-yellow-600 rounded-lg text-white font-medium mobileMenuText shadow-lg shadow-yellow-600/30 transition-all lg:hover:from-yellow-600 lg:hover:to-yellow-500"
                    >
                      {{ $t("log_in") }}
                    </NuxtLinkLocale>
                    <NuxtLinkLocale
                      to="/register"
                      @click="closeMobileMenu"
                      class="flex-1 py-2 text-center bg-gradient-to-r from-[#a1122d] to-[#c21b3a] rounded-lg text-white font-medium mobileMenuText shadow-lg shadow-[#ff3344]/30"
                    >
                      {{ $t("register") }}
                    </NuxtLinkLocale>
                  </div>

                  <div
                    v-if="isUserLoggedIn"
                    class="px-4 py-3 bg-[#241017]/60 border-b border-[#3b1c23]"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div
                          class="w-10 h-10 rounded-full bg-[#ff3344]/20 flex items-center justify-center"
                        >
                          <img
                            src="/images/user/icon.png"
                            alt="icon"
                            class="w-full h-auto"
                          />
                        </div>
                        <div>
                          <p class="text-sm font-medium text-[#f0eaea]">
                            {{ userData?.username || "User" }}
                          </p>
                          <p class="text-xs text-[#b37a7a]">
                            {{ userData?.viplevel || "Standard" }}
                          </p>
                        </div>
                      </div>
                      <div class="text-sm text-[#ff3344] font-medium">
                        <div
                          @click="showBalancePanel = true"
                          class="flex items-center gap-1 cursor-pointer"
                        >
                          <span
                            >MYR
                            {{ userData?.wallet?.toFixed(2) || "0.00" }}</span
                          >
                          <i class="bi bi-caret-down-fill text-xs ml-0.5"></i>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div v-if="isUserLoggedIn" class="px-4 pt-2 pb-1">
                    <div
                      class="bg-[#1A0D13] p-1 rounded-xl flex shadow-sm border border-[#3b1c23]"
                    >
                      <button
                        @click="mobileTab = 'games'"
                        class="relative flex-1 flex items-center justify-center py-2.5 rounded-lg text-sm font-medium transition-all duration-300"
                        :class="
                          mobileTab === 'games'
                            ? 'text-white'
                            : 'text-[#8a6d6d]'
                        "
                      >
                        <div
                          v-if="mobileTab === 'games'"
                          class="absolute inset-0 bg-[#9e1c34] rounded-lg shadow-md transition-all duration-300"
                        ></div>

                        <div
                          class="relative flex items-center justify-center gap-1.5 z-10"
                        >
                          <i class="bi bi-controller text-lg"></i>
                          <span>{{ $t("games") }}</span>
                        </div>
                      </button>

                      <button
                        @click="mobileTab = 'account'"
                        class="relative flex-1 flex items-center justify-center py-2.5 rounded-lg text-sm font-medium transition-all duration-300"
                        :class="
                          mobileTab === 'account'
                            ? 'text-white'
                            : 'text-[#8a6d6d]'
                        "
                      >
                        <div
                          v-if="mobileTab === 'account'"
                          class="absolute inset-0 bg-[#9e1c34] rounded-lg shadow-md transition-all duration-300"
                        ></div>

                        <div
                          class="relative flex items-center justify-center gap-1.5 z-10"
                        >
                          <i class="bi bi-person-circle text-lg"></i>
                          <span>{{ $t("account") }}</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div v-if="mobileTab === 'games'" class="px-4 pt-3">
                    <div class="grid grid-cols-2 gap-3">
                      <NuxtLinkLocale
                        v-for="item in HeaderNav"
                        :key="item.name"
                        :to="item.link"
                        @click="closeMobileMenu"
                        class="group flex flex-col items-center p-3 bg-[#241017]/60 rounded-xl border border-[#3b1c23] lg:hover:bg-[#2a0f14] lg:hover:border-[#ff3344]/30 transition-all"
                      >
                        <div
                          class="w-11 h-11 flex items-center justify-center mb-2 lg:group-hover:scale-105 transition-transform"
                        >
                          <img
                            :src="item.icon"
                            :alt="item.name"
                            class="w-full h-auto object-contain"
                          />
                        </div>
                        <span
                          class="text-sm font-medium text-[#f0eaea] text-center lg:group-hover:text-[#ff3344] transition-colors"
                        >
                          {{ item.label }}
                        </span>
                      </NuxtLinkLocale>
                    </div>

                    <div
                      class="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-[#3b1c23]"
                    >
                      <NuxtLinkLocale
                        to="/promotions"
                        @click="closeMobileMenu"
                        class="group flex flex-col items-center p-3 bg-[#241017]/60 rounded-xl border border-[#3b1c23] lg:hover:bg-[#2a0f14] lg:hover:border-[#ff3344]/30 transition-all"
                      >
                        <div
                          class="w-12 h-12 flex items-center justify-center mb-2 lg:group-hover:scale-105 transition-transform"
                        >
                          <img
                            src="/images/burger-menu/promotions.png"
                            class="w-full h-auto object-contain"
                            alt="Promotions"
                          />
                        </div>
                        <span
                          class="text-sm font-medium text-center text-white lg:group-hover:text-white transition-colors"
                        >
                          {{ $t("promotions") }}
                        </span>
                      </NuxtLinkLocale>

                      <NuxtLinkLocale
                        to="/myaccount/mission"
                        @click="closeMobileMenu"
                        class="group flex flex-col items-center p-3 bg-[#241017]/60 rounded-xl border border-[#3b1c23] lg:hover:bg-[#2a0f14] lg:hover:border-[#ff3344]/30 transition-all"
                      >
                        <div
                          class="w-12 h-12 flex items-center justify-center mb-2 lg:group-hover:scale-105 transition-transform"
                        >
                          <img
                            src="/images/burger-menu/mission.png"
                            class="w-full h-auto object-contain"
                            alt="Daily Missions"
                          />
                        </div>
                        <span
                          class="text-sm font-medium text-white text-center lg:group-hover:text-[#ff3344] transition-colors"
                        >
                          {{ $t("missions") }}
                        </span>
                      </NuxtLinkLocale>

                      <NuxtLinkLocale
                        to="/vip"
                        @click="closeMobileMenu"
                        class="group flex flex-col items-center p-3 bg-[#241017]/60 rounded-xl border border-[#3b1c23] lg:hover:bg-[#2a0f14] lg:hover:border-[#ff3344]/30 transition-all"
                      >
                        <div
                          class="w-12 h-12 flex items-center justify-center mb-2 lg:group-hover:scale-105 transition-transform"
                        >
                          <img
                            src="/images/burger-menu/vip.png"
                            class="w-full h-auto object-contain"
                            alt="VIP"
                          />
                        </div>
                        <span
                          class="text-sm font-medium text-white text-center lg:group-hover:text-yellow-200 transition-colors"
                        >
                          {{ $t("vip") }}
                        </span>
                      </NuxtLinkLocale>

                      <NuxtLinkLocale
                        to="/blog"
                        @click="closeMobileMenu"
                        class="group flex flex-col items-center p-3 bg-[#241017]/60 rounded-xl border border-[#3b1c23] lg:hover:bg-[#2a0f14] lg:hover:border-[#ff3344]/30 transition-all"
                      >
                        <div
                          class="w-12 h-12 flex items-center justify-center mb-2 lg:group-hover:scale-105 transition-transform"
                        >
                          <img
                            src="/images/burger-menu/blog.png"
                            class="w-full h-auto object-contain"
                            alt="BLOG"
                          />
                        </div>
                        <span
                          class="text-sm font-medium text-white text-center lg:group-hover:text-[#ff3344] transition-colors"
                        >
                          {{ $t("blog") }}
                        </span>
                      </NuxtLinkLocale>

                      <NuxtLinkLocale
                        to="/leaderboard"
                        @click="closeMobileMenu"
                        class="group flex flex-col items-center p-3 bg-[#241017]/60 rounded-xl border border-[#3b1c23] lg:hover:bg-[#2a0f14] lg:hover:border-[#ff3344]/30 transition-all"
                      >
                        <div
                          class="w-12 h-12 flex items-center justify-center mb-2 lg:group-hover:scale-105 transition-transform"
                        >
                          <img
                            src="/images/burger-menu/leaderboard.png"
                            class="w-full h-auto object-contain"
                            alt="Leaderboard"
                          />
                        </div>
                        <span
                          class="text-sm font-medium text-white text-center lg:group-hover:text-[#ff3344] transition-colors"
                        >
                          {{ $t("leaderboard") }}
                        </span>
                      </NuxtLinkLocale>
                    </div>

                    <div
                      v-if="isUserLoggedIn"
                      class="py-4 bg-[#1A0D13] flex justify-center"
                    >
                      <button
                        @click="handleLogout"
                        class="w-full py-2 rounded-lg bg-[#241017]/60 text-[#ff3344] border border-[#3b1c23] lg:hover:border-[#ff3344]/50 transition-all flex items-center justify-center gap-2"
                      >
                        <i class="bi bi-box-arrow-right"></i>
                        <span class="font-medium text-sm">{{
                          $t("logout")
                        }}</span>
                      </button>
                    </div>
                  </div>

                  <div v-if="mobileTab === 'account'" class="px-4 pt-3">
                    <div class="mb-3">
                      <div
                        @click="
                          mobileActiveSubmenu =
                            mobileActiveSubmenu === 'cashier' ? null : 'cashier'
                        "
                        class="p-3 bg-[#241017]/60 rounded-xl border border-[#3b1c23] shadow-sm cursor-pointer transition-all duration-200 lg:hover:bg-[#2a0f14]"
                        :class="{
                          'border-[#ff3344]/30 bg-[#241017]':
                            mobileActiveSubmenu === 'cashier',
                        }"
                      >
                        <div class="flex items-center justify-between">
                          <div class="flex items-center gap-3">
                            <div class="w-10 h-10 text-[#ff3344]">
                              <img
                                src="/images/user/cashier2.png"
                                alt="Cashier"
                                class="w-full h-auto"
                              />
                            </div>
                            <span class="text-sm font-semibold text-[#f0eaea]">
                              {{ $t("cashier") }}
                            </span>
                          </div>
                          <i
                            class="bi text-[#b37a7a] transition-transform duration-300"
                            :class="
                              mobileActiveSubmenu === 'cashier'
                                ? 'bi-chevron-up rotate-270'
                                : 'bi-chevron-down rotate-0'
                            "
                          ></i>
                        </div>
                      </div>

                      <Transition
                        enter-active-class="transition-all duration-300 ease-out"
                        enter-from-class="opacity-0 transform -translate-y-2 scale-95"
                        enter-to-class="opacity-100 transform translate-y-0 scale-100"
                        leave-active-class="transition-all duration-200 ease-in"
                        leave-from-class="opacity-100 transform translate-y-0 scale-100"
                        leave-to-class="opacity-0 transform -translate-y-2 scale-95"
                      >
                        <div
                          v-if="mobileActiveSubmenu === 'cashier'"
                          class="mt-2 bg-[#1A0D13] rounded-xl border border-[#3b1c23] shadow-sm p-2 origin-top"
                        >
                          <NuxtLinkLocale
                            to="/myaccount/deposit"
                            @click="closeMobileMenu"
                            class="flex items-center gap-3 px-3 py-2 rounded-lg lg:hover:bg-[#2a0f14] transition-colors"
                          >
                            <i
                              class="bi bi-arrow-down-circle text-[#ff3344]"
                            ></i>
                            <span class="text-[#f0eaea] text-sm">{{
                              $t("deposit")
                            }}</span>
                          </NuxtLinkLocale>

                          <NuxtLinkLocale
                            to="/myaccount/withdraw"
                            @click="closeMobileMenu"
                            class="flex items-center gap-3 px-3 py-2 rounded-lg lg:hover:bg-[#2a0f14] transition-colors"
                          >
                            <i class="bi bi-arrow-up-circle text-[#ff3344]"></i>
                            <span class="text-[#f0eaea] text-sm">{{
                              $t("withdraw")
                            }}</span>
                          </NuxtLinkLocale>

                          <NuxtLinkLocale
                            to="/myaccount/rescue"
                            @click="closeMobileMenu"
                            class="hidden items-center gap-3 px-3 py-2 rounded-lg lg:hover:bg-[#2a0f14] transition-colors"
                          >
                            <i class="bi bi-heart-pulse text-[#ff3344]"></i>
                            <span class="text-[#f0eaea] text-sm">{{
                              $t("rescue")
                            }}</span>
                          </NuxtLinkLocale>

                          <NuxtLinkLocale
                            to="/myaccount/bankaccount"
                            @click="closeMobileMenu"
                            class="flex items-center gap-3 px-3 py-2 rounded-lg lg:hover:bg-[#2a0f14] transition-colors"
                          >
                            <i class="bi bi-bank text-[#ff3344]"></i>
                            <span class="text-[#f0eaea] text-sm">{{
                              $t("bank_account")
                            }}</span>
                          </NuxtLinkLocale>

                          <NuxtLinkLocale
                            to="/myaccount/promocode"
                            @click="closeMobileMenu"
                            class="flex items-center gap-3 px-3 py-2 rounded-lg lg:hover:bg-[#2a0f14] transition-colors"
                          >
                            <i
                              class="bi bi-ticket-perforated text-[#ff3344]"
                            ></i>
                            <span class="text-[#f0eaea] text-sm">{{
                              $t("promo_code")
                            }}</span>
                          </NuxtLinkLocale>

                          <NuxtLinkLocale
                            v-if="luckyDrawStatus"
                            to="/luckydraw"
                            @click="closeMobileMenu"
                            class="flex items-center gap-3 px-3 py-2 rounded-lg lg:hover:bg-[#2a0f14] transition-colors"
                          >
                            <i class="bi bi-dice-5 text-[#ff3344]"></i>
                            <span class="text-[#f0eaea] text-sm">{{
                              $t("lucky_draw")
                            }}</span>
                          </NuxtLinkLocale>
                        </div>
                      </Transition>
                    </div>

                    <div class="mb-3">
                      <div
                        @click="
                          mobileActiveSubmenu =
                            mobileActiveSubmenu === 'agent' ? null : 'agent'
                        "
                        class="p-3 bg-[#241017]/60 rounded-xl border border-[#3b1c23] shadow-sm cursor-pointer transition-all duration-200 lg:hover:bg-[#2a0f14]"
                        :class="{
                          'border-[#ff3344]/30 bg-[#241017]':
                            mobileActiveSubmenu === 'agent',
                        }"
                      >
                        <div class="flex items-center justify-between">
                          <div class="flex items-center gap-3">
                            <div class="w-10 h-10 text-[#ff3344]">
                              <img
                                src="/images/user/agent2.png"
                                alt="agent"
                                class="w-full h-auto"
                              />
                            </div>
                            <span class="text-sm font-semibold text-[#f0eaea]">
                              {{ $t("agent") }}
                            </span>
                          </div>
                          <i
                            class="bi text-[#b37a7a] transition-transform duration-300"
                            :class="
                              mobileActiveSubmenu === 'agent'
                                ? 'bi-chevron-up rotate-270'
                                : 'bi-chevron-down rotate-0'
                            "
                          ></i>
                        </div>
                      </div>

                      <Transition
                        enter-active-class="transition-all duration-300 ease-out"
                        enter-from-class="opacity-0 transform -translate-y-2 scale-95"
                        enter-to-class="opacity-100 transform translate-y-0 scale-100"
                        leave-active-class="transition-all duration-200 ease-in"
                        leave-from-class="opacity-100 transform translate-y-0 scale-100"
                        leave-to-class="opacity-0 transform -translate-y-2 scale-95"
                      >
                        <div
                          v-if="mobileActiveSubmenu === 'agent'"
                          class="mt-2 bg-[#1A0D13] rounded-xl border border-[#3b1c23] shadow-sm p-2 origin-top"
                        >
                          <NuxtLinkLocale
                            to="/myaccount/referral"
                            @click="closeMobileMenu"
                            class="flex items-center gap-3 px-3 py-2 rounded-lg lg:hover:bg-[#2a0f14] transition-colors"
                          >
                            <i class="bi bi-share-fill text-[#ff3344]"></i>
                            <span class="text-[#f0eaea] text-sm">{{
                              $t("referral")
                            }}</span>
                          </NuxtLinkLocale>

                          <NuxtLinkLocale
                            to="/myaccount/downline"
                            @click="closeMobileMenu"
                            class="flex items-center gap-3 px-3 py-2 rounded-lg lg:hover:bg-[#2a0f14] transition-colors"
                          >
                            <i class="bi bi-diagram-3 text-[#ff3344]"></i>
                            <span class="text-[#f0eaea] text-sm">{{
                              $t("downline")
                            }}</span>
                          </NuxtLinkLocale>

                          <NuxtLinkLocale
                            to="/myaccount/commission"
                            @click="closeMobileMenu"
                            class="flex items-center gap-3 px-3 py-2 rounded-lg lg:hover:bg-[#2a0f14] transition-colors"
                          >
                            <i class="bi bi-currency-dollar text-[#ff3344]"></i>
                            <span class="text-[#f0eaea] text-sm">{{
                              $t("commission")
                            }}</span>
                          </NuxtLinkLocale>

                          <NuxtLinkLocale
                            v-if="userData?.positionTaking > 0"
                            to="/myaccount/agentpt"
                            @click="closeMobileMenu"
                            class="flex items-center gap-3 px-3 py-2 rounded-lg lg:hover:bg-[#2a0f14] transition-colors"
                          >
                            <i class="bi bi-graph-up text-[#ff3344]"></i>
                            <span class="text-[#f0eaea] text-sm">{{
                              $t("agent_pt")
                            }}</span>
                          </NuxtLinkLocale>
                        </div>
                      </Transition>
                    </div>

                    <div
                      v-if="isUserLoggedIn"
                      class="pb-4 pt-1 bg-[#1A0D13] flex justify-center"
                    >
                      <button
                        @click="handleLogout"
                        class="w-full py-2 rounded-lg bg-[#241017]/60 text-[#ff3344] border border-[#3b1c23] lg:hover:border-[#ff3344]/50 transition-all flex items-center justify-center gap-2"
                      >
                        <i class="bi bi-box-arrow-right"></i>
                        <span class="font-medium text-sm">{{
                          $t("logout")
                        }}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  class="px-2 py-2 flex max-lg:hidden justify-center border-t border-gray-700 bg-gray-950"
                >
                  <div class="grid grid-cols-5">
                    <NuxtLinkLocale
                      to="/license"
                      @click="closeMobileMenu"
                      class="flex flex-col items-center p-2 lg:hover:bg-gray-700 rounded-lg transition-colors group"
                    >
                      <div
                        class="w-6 h-6 bg-purple-900/30 rounded-lg flex items-center justify-center mb-1 lg:group-hover:bg-purple-800/30 transition-colors"
                      >
                        <i
                          class="bi bi-shield-check text-purple-400 text-xs"
                        ></i>
                      </div>
                      <span
                        class="text-[9px] font-medium text-gray-300 text-center"
                      >
                        {{ $t("license") }}
                      </span>
                    </NuxtLinkLocale>

                    <NuxtLinkLocale
                      to="/termscondition"
                      @click="closeMobileMenu"
                      class="flex flex-col items-center p-2 lg:hover:bg-gray-700 rounded-lg transition-colors group"
                    >
                      <div
                        class="w-6 h-6 bg-blue-900/30 rounded-lg flex items-center justify-center mb-1 lg:group-hover:bg-blue-800/30 transition-colors"
                      >
                        <i class="bi bi-file-text text-blue-400 text-xs"></i>
                      </div>
                      <span
                        class="text-[9px] font-medium text-gray-300 text-center"
                      >
                        {{ $t("terms") }}
                      </span>
                    </NuxtLinkLocale>

                    <NuxtLinkLocale
                      to="/responsible"
                      @click="closeMobileMenu"
                      class="flex flex-col items-center p-2 lg:hover:bg-gray-700 rounded-lg transition-colors group"
                    >
                      <div
                        class="w-6 h-6 bg-green-900/30 rounded-lg flex items-center justify-center mb-1 lg:group-hover:bg-green-800/30 transition-colors"
                      >
                        <i class="bi bi-heart-pulse text-green-400 text-xs"></i>
                      </div>
                      <span
                        class="text-[9px] font-medium text-gray-300 text-center"
                      >
                        {{ $t("gaming") }}
                      </span>
                    </NuxtLinkLocale>

                    <NuxtLinkLocale
                      to="/helpcenter"
                      @click="closeMobileMenu"
                      class="flex flex-col items-center p-2 lg:hover:bg-gray-700 rounded-lg transition-colors group"
                    >
                      <div
                        class="w-6 h-6 bg-red-900/30 rounded-lg flex items-center justify-center mb-1 lg:group-hover:bg-red-800/30 transition-colors"
                      >
                        <i
                          class="bi bi-question-circle text-red-400 text-xs"
                        ></i>
                      </div>
                      <span
                        class="text-[9px] font-medium text-gray-300 text-center"
                      >
                        {{ $t("help") }}
                      </span>
                    </NuxtLinkLocale>

                    <NuxtLinkLocale
                      to="/faq"
                      @click="closeMobileMenu"
                      class="flex flex-col items-center p-2 lg:hover:bg-gray-700 rounded-lg transition-colors group"
                    >
                      <div
                        class="w-6 h-6 bg-indigo-900/30 rounded-lg flex items-center justify-center mb-1 lg:group-hover:bg-indigo-800/30 transition-colors"
                      >
                        <i class="bi bi-chat-dots text-indigo-400 text-xs"></i>
                      </div>
                      <span
                        class="text-[9px] font-medium text-gray-300 text-center"
                      >
                        {{ $t("faq") }}
                      </span>
                    </NuxtLinkLocale>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup>
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
const router = useRouter();
const currentregion = ref("malaysia");
const showCountryMenu = ref(false);
const showCountryMenuMobile = ref(false);
const showBalanceDropdown = ref(false);
const { post, get } = useApiEndpoint();
const {
  launchGame,
  alertVisible,
  alertTitle,
  alertMessage,
  alertType,
  platformModalVisible,
  handlePlatformSelection,
} = useGameLauncher();
const unreadCount = useState("unreadCount");
const generalSetting = useState("generalSetting");
const liveCasinoKiosks = useState("liveCasinoKiosks");
const slotKiosks = useState("slotKiosks");
const sportsKiosks = useState("sportsKiosks");
const esportsKiosks = useState("esportsKiosks");
const fishingKiosks = useState("fishingKiosks");
const lotteryKiosks = useState("lotteryKiosks");
const isUserLoggedIn = useState("isUserLoggedIn");
const luckyDrawStatus = useState("luckyDrawStatus");
const localePath = useLocalePath();
const isLogoutSuccess = ref(false);
const isConfirmAlertVisible = ref(false);
const showBalancePanel = ref(false);
const isBalancePanelLoading = ref(false);
const panelGameBalances = ref([]);
const confirmAlertTitle = ref("");
const confirmAlertMessage = ref("");
const confirmAlertType = ref("warning");
const showLanguagePanel = ref(false);
const activeMenuItem = ref("profile");
const showProfileMenu = ref(false);
const userData = useState("userData");
const mobileMenuOpen = ref(false);
const activeDropdown = ref(null);
const mobileActiveSubmenu = ref(null);
const showMainMenu = ref(false);
const showLanguageMenu = ref(false);
const checkinreminder = useState("checkinreminder");
const userGameLocks = useState("userGameLocks");
const mobileTab = ref("games");
const { locale, setLocale, availableLocales, t } = useI18n();
const i18nCookie = useCookie("i18n_redirected", {
  maxAge: 365 * 24 * 60 * 60,
});
const languageOptions = [
  { name: "English", flag: "/images/flags/England.svg", code: "en" },
  { name: "Malay", flag: "/images/flags/Malaysia.png", code: "ms" },
  { name: "中文", flag: "/images/flags/China.svg", code: "zh" },
];

const getGameIcon = (gameName) => {
  const kiosk = slotKiosks.value.find(
    (k) => k.name.toLowerCase() === gameName.toLowerCase()
  );
  return kiosk?.banner || kiosk?.logo || null;
};

const changeLocale = async (lang) => {
  await setLocale(lang);
  i18nCookie.value = lang;
  showLanguageMenu.value = false;
  mobileMenuOpen.value = false;
};

const fallback = (name) =>
  `https://placehold.co/264x328/2563eb/FFFFFF/png?text=${encodeURIComponent(
    name
  )}`;

const isSpecialNav = (navName) => {
  return ["Promos", "VIP"].includes(navName);
};

const toggleMobileSubmenu = (navName) => {
  mobileActiveSubmenu.value =
    mobileActiveSubmenu.value === navName ? null : navName;
};

const isGameLocked = (gameDatabaseName) => {
  if (!isUserLoggedIn.value || !gameDatabaseName) return false;
  return userGameLocks.value?.[gameDatabaseName]?.lock === true;
};

// Function to get the appropriate icon for each navigation item
const getNavIcon = (navName) => {
  const iconMap = {
    Sports: "bi bi-dribbble",
    "E-Sports": "bi bi-controller",
    Casino: "bi bi-suit-club",
    Slots: "bi bi-grid-3x3-gap",
    Fishing: "bi bi-water",
    Lottery: "bi bi-ticket-perforated",
    Promos: "bi bi-percent",
    VIP: "bi bi-crown",
    "Lucky Wheel": "bi bi-bullseye",
  };

  return iconMap[navName] || "bi bi-circle";
};

const HeaderNav = computed(() => [
  {
    name: "Sports",
    label: $t("sports"),
    link: "/games/sports",
    icon: "/images/burger-menu/sports.png",
  },
  {
    name: "E-Sports",
    label: $t("e_sports"),
    link: "/games/e-sports",
    icon: "/images/burger-menu/e-sports.png",
  },
  {
    name: "Casino",
    label: $t("live_casino"),
    link: "/games/livecasino",
    icon: "/images/burger-menu/livecasino.png",
  },
  {
    name: "Slots",
    label: $t("slots"),
    link: "/games/slots",
    icon: "/images/burger-menu/slots.png",
  },
  {
    name: "Fishing",
    label: $t("fishing"),
    link: "/games/fishing",
    icon: "/images/burger-menu/fishing.png",
  },

  {
    name: "Lottery",
    label: $t("lottery"),
    link: "/games/lottery",
    icon: "/images/burger-menu/lottery.png",
  },
]);
const getIconBgClass = (name) => {
  switch (name) {
    case "Sports":
      return "bg-blue-50 border border-blue-100";
    case "E-Sports":
      return "bg-purple-50 border border-purple-100";
    case "Casino":
      return "bg-red-50 border border-red-100";
    case "Slots":
      return "bg-amber-50 border border-amber-100";
    case "Fishing":
      return "bg-teal-50 border border-teal-100";
    case "Lottery":
      return "bg-green-50 border border-green-100";
    default:
      return "bg-gray-50 border border-gray-100";
  }
};

const getIconTextClass = (name) => {
  switch (name) {
    case "Sports":
      return "text-blue-500";
    case "E-Sports":
      return "text-purple-500";
    case "Casino":
      return "text-red-500";
    case "Slots":
      return "text-amber-500";
    case "Fishing":
      return "text-teal-500";
    case "Lottery":
      return "text-green-500";
    default:
      return "text-gray-500";
  }
};
const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
  mobileActiveSubmenu.value = null;
  showLanguageMenu.value = false;
  showBalanceDropdown.value = false;
  showLanguagePanel.value = false;
  showBalancePanel.value = false;
};

const handleLogout = () => {
  confirmAlertTitle.value = $t("logout_confirmation");
  confirmAlertMessage.value = $t("logout_confirm_message");
  confirmAlertType.value = "warning";
  isConfirmAlertVisible.value = true;
};

function handleConfirmClose(confirmed) {
  isConfirmAlertVisible.value = false;
  if (isLogoutSuccess.value) {
    window.location.href = localePath("/");
    return;
  }
  if (confirmed) {
    performLogout();
  }
}

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

const handleRefresh = async () => {
  try {
    await fetchUserData();
    alertTitle.value = $t("success");
    alertMessage.value = $t("balance_refreshed");
    alertType.value = "success";
    alertVisible.value = true;
  } catch (error) {
    console.error("Error refreshing balance:", error);
    alertTitle.value = $t("error");
    alertMessage.value = $t("refresh_failed");
    alertType.value = "error";
    alertVisible.value = true;
  }
};

const performLogout = async () => {
  try {
    const { post } = useApiEndpoint();
    const { data } = await post("logout");
    if (data.success) {
      isUserLoggedIn.value = false;
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("gametoken");
      isLogoutSuccess.value = true;
      confirmAlertTitle.value = $t("success");
      confirmAlertMessage.value = $t("logout_success_message");
      confirmAlertType.value = "success";
      isConfirmAlertVisible.value = true;
      setTimeout(() => {
        window.location.href = localePath("/");
      }, 1500);
    }
  } catch (error) {
    console.error("Logout error:", error);
    confirmAlertTitle.value = $t("error");
    confirmAlertMessage.value = $t("logout_failed");
    confirmAlertType.value = "error";
    isConfirmAlertVisible.value = true;
  }
};

const currentDomain = computed(() => {
  if (process.client) {
    return window.location.hostname;
  }
  return "";
});

const isMalaysiaDomain = computed(() => currentDomain.value.includes("bm8my"));
const isSingaporeDomain = computed(() => currentDomain.value.includes("bm8sg"));

const switchToMalaysia = (lang) => {
  const hostname = window.location.hostname;
  const langPath = lang === "en" ? "" : `/${lang}`;
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    changeLocale(lang);
    return;
  }
  if (!hostname.includes("bm8my")) {
    window.location.href = `https://www.bm8my.vip${langPath}`;
  } else {
    changeLocale(lang);
  }
};

const switchToSingapore = (lang) => {
  const hostname = window.location.hostname;
  const langPath = lang === "en" ? "" : `/${lang}`;
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    changeLocale(lang);
    return;
  }
  if (!hostname.includes("bm8sg")) {
    window.location.href = `https://www.bm8sg.vip${langPath}`;
  } else {
    changeLocale(lang);
  }
};

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

const panelTotalBalance = computed(() => {
  let total = userData.value?.wallet || 0;
  panelGameBalances.value.forEach((game) => {
    total += parseFloat(game.balance || 0);
  });
  return total;
});

const fetchPanelGameBalances = async () => {
  isBalancePanelLoading.value = true;
  try {
    const { data } = await post("game/checkallgamebalance");
    if (data.success) {
      panelGameBalances.value = data.games;
    }
  } catch (error) {
    console.error("Error fetching game balances:", error);
  } finally {
    isBalancePanelLoading.value = false;
  }
};

const refreshPanelBalances = async () => {
  isBalancePanelLoading.value = true;
  try {
    const { data } = await post("game/transferout/all");
    if (data.success) {
      await fetchPanelGameBalances();
      await fetchUserData();
      alertTitle.value = $t("success");
      alertMessage.value = $t("balances_restored");
      alertType.value = "success";
      alertVisible.value = true;
    }
  } catch (error) {
    console.error("Error restoring balances:", error);
    alertTitle.value = $t("error");
    alertMessage.value = $t("failed_restore_balances");
    alertType.value = "error";
    alertVisible.value = true;
  } finally {
    isBalancePanelLoading.value = false;
  }
};

watch(showBalancePanel, (newValue) => {
  if (newValue) {
    fetchPanelGameBalances();
  }
});

watch(
  () => router.currentRoute.value,
  () => {
    mobileMenuOpen.value = false;
  }
);
</script>

<style scoped>
.mega-dropdown {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out forwards;
}

.animate-slideIn {
  animation: slideIn 0.3s ease-out forwards;
}

.mega-dropdown {
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
}

.game-item:hover ~ .game-item .inactive-overlay,
.game-grid:has(.game-item:hover) .game-item:not(:hover) .inactive-overlay {
  opacity: 1;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: #15090e;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #3b1c23;
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #ff3344;
}
</style>
