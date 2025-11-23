<template>
  <ClientOnly>
    <!-- Simple Footer that matches website design -->
    <footer
      class="bg-gray-950 text-white pt-12 pb-6 max-lg:pt-6 max-lg:pb-4 border-t border-[#3b1c23]"
    >
      <div class="container mx-auto px-4">
        <!-- Footer Top - Links -->
        <div
          class="grid grid-cols-2 md:grid-cols-4 gap-8 max-lg:gap-6 mb-12 max-lg:mb-6"
        >
          <!-- Column 1 - Products -->
          <div>
            <h4
              class="text-lg font-bold mb-4 max-lg:mb-2 max-lg:text-base text-[#f0eaea]"
            >
              {{ $t("products") }}
            </h4>
            <ul class="space-y-3 max-lg:space-y-2">
              <li>
                <NuxtLinkLocale
                  to="/games/sports"
                  class="text-[#b37a7a] lg:hover:text-[#ff3344] text-sm transition-colors duration-200"
                >
                  {{ $t("sports") }}
                </NuxtLinkLocale>
              </li>
              <li>
                <NuxtLinkLocale
                  to="/games/livecasino"
                  class="text-[#b37a7a] lg:hover:text-[#ff3344] text-sm transition-colors duration-200"
                >
                  {{ $t("live_casino") }}
                </NuxtLinkLocale>
              </li>
              <li>
                <NuxtLinkLocale
                  to="/games/slots"
                  class="text-[#b37a7a] lg:hover:text-[#ff3344] text-sm transition-colors duration-200"
                >
                  {{ $t("slot_games") }}
                </NuxtLinkLocale>
              </li>
              <li>
                <NuxtLinkLocale
                  to="/games/fishing"
                  class="text-[#b37a7a] lg:hover:text-[#ff3344] text-sm transition-colors duration-200"
                >
                  {{ $t("fishing") }}
                </NuxtLinkLocale>
              </li>
              <li>
                <NuxtLinkLocale
                  to="/games/lottery"
                  class="text-[#b37a7a] lg:hover:text-[#ff3344] text-sm transition-colors duration-200"
                >
                  {{ $t("lottery") }}
                </NuxtLinkLocale>
              </li>
            </ul>
          </div>

          <!-- Column 2 - Support -->
          <div>
            <h4
              class="text-lg font-bold mb-4 max-lg:mb-2 max-lg:text-base text-[#f0eaea]"
            >
              {{ $t("support") }}
            </h4>
            <ul class="space-y-3 max-lg:space-y-2">
              <li>
                <NuxtLinkLocale
                  to="/helpcenter"
                  class="text-[#b37a7a] lg:hover:text-[#ff3344] text-sm transition-colors duration-200"
                >
                  {{ $t("help_center") }}
                </NuxtLinkLocale>
              </li>
              <li>
                <NuxtLinkLocale
                  to="/faq"
                  class="text-[#b37a7a] lg:hover:text-[#ff3344] text-sm transition-colors duration-200"
                >
                  {{ $t("faq") }}
                </NuxtLinkLocale>
              </li>
              <li>
                <NuxtLinkLocale
                  to="/responsible"
                  class="text-[#b37a7a] lg:hover:text-[#ff3344] text-sm transition-colors duration-200"
                >
                  {{ $t("responsible_gaming") }}
                </NuxtLinkLocale>
              </li>
            </ul>
          </div>

          <!-- Column 3 - Information -->
          <div>
            <h4
              class="text-lg font-bold mb-4 max-lg:mb-2 max-lg:text-base text-[#f0eaea]"
            >
              {{ $t("information") }}
            </h4>
            <ul class="space-y-3 max-lg:space-y-2">
              <li>
                <NuxtLinkLocale
                  to="/license"
                  class="text-[#b37a7a] lg:hover:text-[#ff3344] text-sm transition-colors duration-200"
                >
                  {{ $t("license_display") }}
                </NuxtLinkLocale>
              </li>
              <li>
                <NuxtLinkLocale
                  to="/termscondition"
                  class="text-[#b37a7a] lg:hover:text-[#ff3344] text-sm transition-colors duration-200"
                >
                  {{ $t("terms_conditions") }}
                </NuxtLinkLocale>
              </li>
              <li>
                <NuxtLinkLocale
                  to="/myaccount/referral"
                  class="text-[#b37a7a] lg:hover:text-[#ff3344] text-sm transition-colors duration-200"
                >
                  {{ $t("affiliate_program") }}
                </NuxtLinkLocale>
              </li>
              <li>
                <NuxtLinkLocale
                  to="/vip"
                  class="text-[#b37a7a] lg:hover:text-[#ff3344] text-sm transition-colors duration-200"
                >
                  {{ $t("vip_program") }}
                </NuxtLinkLocale>
              </li>
            </ul>
          </div>

          <!-- Column 4 - Follow Us -->
          <div>
            <h4
              class="text-lg font-bold mb-4 max-lg:mb-2 max-lg:text-base text-[#f0eaea]"
            >
              {{ $t("follow_us") }}
            </h4>
            <div class="flex gap-3 max-lg:gap-2">
              <a
                v-if="generalSetting.facebook"
                :href="generalSetting.facebook"
                target="_blank"
                rel="noopener noreferrer"
                class="bg-[#241017]/60 lg:hover:bg-gradient-to-br lg:hover:from-[#a1122d] lg:hover:to-[#c21b3a] w-10 h-10 max-lg:w-9 max-lg:h-9 rounded-lg flex items-center justify-center transition-all duration-300 border border-[#3b1c23] lg:hover:border-[#ff3344] lg:hover:shadow-lg lg:hover:shadow-[#ff3344]/20"
                aria-label="Facebook"
              >
                <img
                  src="/images/social-media/facebook.png"
                  alt="facebook"
                  class="w-5 h-5 max-lg:w-4 max-lg:h-4"
                />
              </a>
              <a
                v-if="generalSetting.telegram"
                :href="generalSetting.telegram"
                target="_blank"
                rel="noopener noreferrer"
                class="bg-[#241017]/60 lg:hover:bg-gradient-to-br lg:hover:from-[#a1122d] lg:hover:to-[#c21b3a] w-10 h-10 max-lg:w-9 max-lg:h-9 rounded-lg flex items-center justify-center transition-all duration-300 border border-[#3b1c23] lg:hover:border-[#ff3344] lg:hover:shadow-lg lg:hover:shadow-[#ff3344]/20"
                aria-label="Telegram"
              >
                <img
                  src="/images/social-media/telegram.png"
                  alt="Telegram"
                  class="w-5 h-5 max-lg:w-4 max-lg:h-4"
                />
              </a>

              <a
                v-if="generalSetting.instagram"
                :href="generalSetting.instagram"
                target="_blank"
                rel="noopener noreferrer"
                class="bg-[#241017]/60 lg:hover:bg-gradient-to-br lg:hover:from-[#a1122d] lg:hover:to-[#c21b3a] w-10 h-10 max-lg:w-9 max-lg:h-9 rounded-lg flex items-center justify-center transition-all duration-300 border border-[#3b1c23] lg:hover:border-[#ff3344] lg:hover:shadow-lg lg:hover:shadow-[#ff3344]/20"
                aria-label="Instagram"
              >
                <img
                  src="/images/social-media/instagram.png"
                  alt="instagram"
                  class="w-5 h-5 max-lg:w-4 max-lg:h-4"
                />
              </a>
              <a
                v-if="generalSetting.youtube"
                :href="generalSetting.youtube"
                target="_blank"
                rel="noopener noreferrer"
                class="bg-[#241017]/60 lg:hover:bg-gradient-to-br lg:hover:from-[#a1122d] lg:hover:to-[#c21b3a] w-10 h-10 max-lg:w-9 max-lg:h-9 rounded-lg flex items-center justify-center transition-all duration-300 border border-[#3b1c23] lg:hover:border-[#ff3344] lg:hover:shadow-lg lg:hover:shadow-[#ff3344]/20"
                aria-label="YouTube"
              >
                <i class="bi bi-youtube text-base max-lg:text-sm"></i>
              </a>
              <a
                v-if="generalSetting.whatsapp"
                :href="generalSetting.whatsapp"
                target="_blank"
                rel="noopener noreferrer"
                class="bg-[#241017]/60 lg:hover:bg-gradient-to-br lg:hover:from-[#a1122d] lg:hover:to-[#c21b3a] w-10 h-10 max-lg:w-9 max-lg:h-9 rounded-lg flex items-center justify-center transition-all duration-300 border border-[#3b1c23] lg:hover:border-[#ff3344] lg:hover:shadow-lg lg:hover:shadow-[#ff3344]/20"
                aria-label="WhatsApp"
              >
                <img
                  src="/images/social-media/whatsapp.png"
                  alt="whatsapp"
                  class="w-5 h-5 max-lg:w-4 max-lg:h-4"
                />
              </a>
            </div>
          </div>
        </div>

        <!-- Payment Methods Section (Optional - Commented) -->
        <!-- <div class="border-t border-[#3b1c23] pt-8 pb-8 max-lg:py-4">
          <h4 class="text-lg font-bold mb-6 text-center max-lg:mb-4 text-[#f0eaea]">
            {{ $t("payment_methods") }}
          </h4>
          <div class="flex flex-wrap justify-center gap-4 max-lg:gap-3">
            <div class="bg-[#241017]/60 border border-[#3b1c23] rounded-lg p-2 lg:hover:border-[#ff3344] transition-colors">
              <img
                src="/images/payment/visa.png"
                alt="Visa"
                class="h-8 max-lg:h-6 opacity-80"
              />
            </div>
            <div class="bg-[#241017]/60 border border-[#3b1c23] rounded-lg p-2 lg:hover:border-[#ff3344] transition-colors">
              <img
                src="/images/payment/mastercard.png"
                alt="Mastercard"
                class="h-8 max-lg:h-6 opacity-80"
              />
            </div>
            <div class="bg-[#241017]/60 border border-[#3b1c23] rounded-lg p-2 lg:hover:border-[#ff3344] transition-colors">
              <img
                src="/images/payment/bitcoin.png"
                alt="Bitcoin"
                class="h-8 max-lg:h-6 opacity-80"
              />
            </div>
          </div>
        </div> -->

        <!-- Footer Bottom -->
        <div
          class="border-t border-[#3b1c23] pt-6 max-lg:pt-4 flex flex-col md:flex-row justify-between items-center gap-4 max-lg:gap-2"
        >
          <div class="flex items-center">
            <img
              :src="generalSetting.logoimage"
              alt="BM8 Logo"
              class="h-10 max-lg:h-8"
            />
          </div>

          <div
            class="text-sm text-[#b37a7a] max-lg:text-xs text-center md:text-right"
          >
            {{ $t("copyright") }}
          </div>
        </div>
      </div>
    </footer>
  </ClientOnly>
</template>

<script setup>
const generalSetting = useState("generalSetting");
</script>

<style scoped></style>
