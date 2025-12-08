<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[99] p-4"
        @click.self="closeModal"
      >
        <div
          class="bg-[#1A0D13] border border-[#3b1c23] rounded-lg w-full max-w-md overflow-y-scroll max-h-[75vh]"
          :class="modelValue ? 'animate-popupIn' : ''"
        >
          <div
            class="p-4 border-b border-[#3b1c23] flex items-center justify-between"
          >
            <h3 class="font-semibold text-[#f0eaea] text-base max-sm:text-sm">
              {{ $t("turnover_progress") }}
            </h3>
            <button
              @click="closeModal"
              class="w-8 h-8 max-sm:w-7 max-sm:h-7 rounded-lg bg-[#241017] border border-[#3b1c23] flex items-center justify-center text-[#b37a7a] lg:hover:text-[#ff3344] lg:hover:border-[#ff3344] transition-all"
            >
              <Icon icon="mdi:close" class="w-5 h-5 max-sm:w-4 max-sm:h-4" />
            </button>
          </div>

          <div class="p-4 space-y-4">
            <div class="space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-[#b37a7a]"
                  >{{ $t("current_turnover") }}:</span
                >
                <span class="font-medium text-[#f0eaea]">
                  {{ formatCurrency(details.current) }}
                </span>
              </div>

              <div class="flex justify-between text-sm">
                <span class="text-[#b37a7a]"
                  >{{ $t("required_turnover") }}:</span
                >
                <span class="font-medium text-[#f0eaea]">
                  {{ formatCurrency(details.required) }}
                </span>
              </div>
            </div>

            <div
              class="w-full h-4 bg-[#241017] border border-[#3b1c23] rounded-full overflow-hidden"
            >
              <div
                :style="{ width: progressPercentage + '%' }"
                class="h-full bg-gradient-to-r from-[#a1122d] to-[#c21b3a] rounded-full transition-all duration-500"
              ></div>
            </div>

            <div class="text-center text-sm text-[#b37a7a]">
              {{ progressPercentage }}% {{ $t("completed") }}
            </div>

            <div
              class="bg-[#241017]/60 rounded-lg p-4 max-[500px]:py-2.5 text-center border border-[#3b1c23]"
            >
              <div class="text-sm text-[#b37a7a] mb-1">
                {{ $t("remaining_turnover_needed") }}
              </div>
              <div class="text-xl max-[500px]:text-lg font-bold text-[#ff3344]">
                {{ formatCurrency(details.remaining) }}
              </div>
            </div>

            <div class="bg-[#241017]/60 rounded-lg p-4 border border-[#3b1c23]">
              <div class="flex gap-2 text-sm text-[#b37a7a]">
                <Icon
                  icon="mdi:information-outline"
                  class="w-5 h-5 max-[500px]:w-4 max-[500px]:h-4 text-[#ff3344] flex-shrink-0"
                />
                <span>{{ $t("turnover_info_message") }}</span>
              </div>
            </div>
          </div>

          <div class="p-4 border-t border-[#3b1c23]">
            <button
              @click="closeModal"
              class="w-full bg-gradient-to-r from-[#a1122d] to-[#c21b3a] lg:hover:brightness-110 text-white font-semibold py-3 rounded-lg transition-all text-sm max-sm:text-xs"
            >
              {{ $t("understand") }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { Icon } from "@iconify/vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  details: {
    type: Object,
    default: () => ({
      required: 0,
      current: 0,
      remaining: 0,
    }),
  },
});

const emit = defineEmits(["update:modelValue"]);

const progressPercentage = computed(() => {
  if (!props.details || props.details.required <= 0) return 0;
  const percentage = (props.details.current / props.details.required) * 100;
  return Math.min(percentage, 100).toFixed(2);
});

const formatCurrency = (value) => {
  const num = parseFloat(value) || 0;
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const closeModal = () => {
  emit("update:modelValue", false);
};
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
