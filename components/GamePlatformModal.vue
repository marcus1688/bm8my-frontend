<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isVisible"
        class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[99] p-4"
        @click.self="close"
      >
        <div
          class="bg-[#1A0D13] border border-[#3b1c23] rounded-xl w-full max-w-md overflow-hidden"
          :class="isVisible ? 'animate-popupIn' : ''"
        >
          <div
            class="p-4 border-b border-[#3b1c23] flex items-center justify-between"
          >
            <h3 class="font-semibold text-[#f0eaea] text-base">
              {{ $t("select_platform") }}
            </h3>
            <button
              @click="close"
              class="w-8 h-8 rounded-lg bg-[#241017] border border-[#3b1c23] flex items-center justify-center text-[#b37a7a] lg:hover:text-[#ff3344] lg:hover:border-[#ff3344] transition-all"
            >
              <Icon icon="mdi:close" class="w-5 h-5" />
            </button>
          </div>

          <div class="p-6">
            <p
              class="text-[#b37a7a] text-sm max-sm:text-xs max-sm:mb-3 text-center mb-6"
            >
              {{ $t("choose_platform_message") }}
            </p>

            <div class="flex gap-4">
              <button
                @click="selectPlatform('web')"
                class="flex-1 p-6 bg-[#241017] border border-[#3b1c23] rounded-xl lg:hover:border-[#ff3344] lg:hover:bg-[#2a0f14] transition-all group"
              >
                <div class="flex flex-col items-center gap-3">
                  <div
                    class="w-16 h-16 max-sm:w-14 max-sm:h-14 rounded-xl bg-[#15090e] border border-[#3b1c23] flex items-center justify-center transition-all"
                  >
                    <Icon
                      icon="mdi:monitor"
                      class="w-8 h-8 max-sm:w-7 max-sm:h-7 text-[#ff3344]"
                    />
                  </div>
                  <div class="text-center">
                    <h4
                      class="font-semibold text-[#f0eaea] text-base max-sm:text-sm mb-1"
                    >
                      {{ $t("desktop") }}
                    </h4>
                  </div>
                </div>
              </button>

              <button
                @click="selectPlatform('mobile')"
                class="flex-1 p-6 bg-[#241017] border border-[#3b1c23] rounded-xl lg:hover:border-[#ff3344] lg:hover:bg-[#2a0f14] transition-all group"
              >
                <div class="flex flex-col items-center gap-3">
                  <div
                    class="w-16 h-16 max-sm:w-14 max-sm:h-14 rounded-xl bg-[#15090e] border border-[#3b1c23] flex items-center justify-center transition-all"
                  >
                    <Icon
                      icon="mdi:cellphone"
                      class="w-8 h-8 max-sm:w-7 max-sm:h-7 text-[#ff3344]"
                    />
                  </div>
                  <div class="text-center">
                    <h4
                      class="font-semibold text-[#f0eaea] text-base max-sm:text-sm mb-1"
                    >
                      {{ $t("mobile") }}
                    </h4>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { Icon } from "@iconify/vue";

const props = defineProps({
  isVisible: Boolean,
});

const emits = defineEmits(["close", "selectPlatform"]);

function close() {
  emits("close");
}

function selectPlatform(platform) {
  emits("selectPlatform", platform);
  close();
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

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
