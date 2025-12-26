<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isVisible"
        class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[99] p-4"
        @click.self="emitClose"
      >
        <div
          class="bg-[#1A0D13] border border-[#3b1c23] rounded-lg w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col"
          @click.stop
          :class="isVisible ? 'animate-popupIn' : ''"
        >
          <div
            class="p-4 border-b border-[#3b1c23] flex items-center justify-between flex-shrink-0"
          >
            <h3 class="font-semibold text-[#f0eaea] text-base max-sm:text-sm">
              {{ $t("change_email_address") }}
            </h3>

            <button
              @click="emitClose"
              class="w-8 h-8 max-sm:w-7 max-sm:h-7 rounded-lg bg-[#241017] border border-[#3b1c23] flex items-center justify-center text-[#b37a7a] lg:hover:text-[#ff3344] lg:hover:border-[#ff3344] transition-all"
            >
              <Icon icon="mdi:close" class="w-5 h-5 max-sm:w-4 max-sm:h-4" />
            </button>
          </div>

          <!-- Content -->
          <div class="p-4 overflow-y-auto flex-1 space-y-4">
            <div>
              <label class="block text-sm font-semibold text-[#f0eaea] mb-2">
                {{ $t("new_email_address") }}
              </label>
              <div class="relative">
                <input
                  type="email"
                  v-model="newEmail"
                  :placeholder="$t('enter_new_email')"
                  class="w-full px-4 py-3 pl-12 bg-[#241017] text-[#f0eaea] rounded-lg border border-[#3b1c23] focus:border-[#ff3344] focus:outline-none transition-colors placeholder-[#b37a7a] text-sm"
                />
                <div
                  class="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                >
                  <Icon
                    icon="mdi:email-outline"
                    class="w-5 h-5 text-[#ff3344]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-[#f0eaea] mb-2">
                {{ $t("confirm_email_address") }}
              </label>
              <div class="relative">
                <input
                  type="email"
                  v-model="confirmEmail"
                  :placeholder="$t('confirm_new_email')"
                  class="w-full px-4 py-3 pl-12 bg-[#241017] text-[#f0eaea] rounded-lg border focus:outline-none transition-colors placeholder-[#b37a7a] text-sm"
                  :class="
                    showEmailMismatch
                      ? 'border-[#ff3344] focus:border-[#ff3344]'
                      : 'border-[#3b1c23] focus:border-[#ff3344]'
                  "
                />
                <div
                  class="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                >
                  <Icon
                    icon="mdi:email-check-outline"
                    class="w-5 h-5"
                    :class="
                      showEmailMismatch ? 'text-[#ff3344]' : 'text-[#ff3344]'
                    "
                  />
                </div>
              </div>
              <Transition name="slide-fade">
                <div
                  v-if="showEmailMismatch"
                  class="mt-2 flex gap-2 p-2.5 bg-[#ff3344]/5 border border-[#ff3344]/20 rounded-lg"
                >
                  <Icon
                    icon="mdi:alert-circle-outline"
                    class="w-4 h-4 text-[#ff3344] flex-shrink-0 mt-0.5"
                  />
                  <span class="text-xs text-[#ff3344]">{{
                    $t("email_mismatch")
                  }}</span>
                </div>
              </Transition>
            </div>
          </div>

          <div class="p-4 border-t border-[#3b1c23] flex gap-2 flex-shrink-0">
            <button
              @click="emitClose"
              class="flex-1 py-2.5 bg-[#241017] border border-[#3b1c23] text-[#f0eaea] rounded-lg font-medium lg:hover:border-[#ff3344]/50 transition-all text-sm max-sm:text-xs"
            >
              {{ $t("cancel") }}
            </button>
            <LoadingButton
              :loading="emailButtonLoading"
              @click="saveEmail"
              class="flex-1 py-2.5 bg-[#ff3344] text-white rounded-lg font-semibold hover:bg-[#cc2a3a] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm max-sm:text-xs"
            >
              {{ $t("save") }}
            </LoadingButton>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { Icon } from "@iconify/vue";

const emailButtonLoading = ref(false);
const isVisible = ref(true);
const emit = defineEmits(["close"]);
const newEmail = ref("");
const confirmEmail = ref("");

const { showAlert } = useAlert();

const showEmailMismatch = computed(() => {
  return confirmEmail.value && newEmail.value !== confirmEmail.value;
});

function emitClose() {
  isVisible.value = false;
  setTimeout(() => emit("close"), 300);
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

async function saveEmail() {
  if (!newEmail.value || !confirmEmail.value) {
    showAlert($t("alert_info"), $t("fill_all_fields"), "info");
    return;
  }

  if (newEmail.value !== confirmEmail.value) {
    showAlert($t("alert_info"), $t("email_mismatch"), "error");
    return;
  }

  if (!validateEmail(newEmail.value)) {
    showAlert($t("alert_info"), $t("valid_email"), "error");
    return;
  }

  emailButtonLoading.value = true;
  try {
    const { post, get } = useApiEndpoint();
    const { data } = await post("updateSocialMedia", {
      email: newEmail.value,
    });

    if (data.success) {
      const { data: newData } = await get("userdata");
      if (newData.success) {
        useState("userData").value = newData.user;
      }
      showAlert($t("alert_success"), $t("email_updated"), "success");
      emitClose();
    } else {
      showAlert($t("alert_info"), data.message[$locale.value], "info");
    }
  } catch (error) {
    console.error("Save email error:", error);
    showAlert(
      $t("alert_error"),
      error.response?.data?.message?.en || $t("network_error"),
      "error"
    );
  } finally {
    emailButtonLoading.value = false;
  }
}
</script>

<style scoped>
/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide Fade Transition for Error Message */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Popup Animation */
@keyframes popupIn {
  0% {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-popupIn {
  animation: popupIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}
</style>
