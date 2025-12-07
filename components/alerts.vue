<template>
  <div
    v-if="visible"
    class="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#000000]/60 backdrop-blur-sm z-[999]"
    @click.self="closeAlert"
  >
    <div
      v-show="visible"
      class="bg-gradient-to-b from-[#241017] to-[#15090e] border border-[#3b1c23] rounded-xl p-6 w-[90%] max-w-[380px] text-center relative"
      :class="visible ? 'animate-popupIn' : 'animate-popupOut'"
    >
      <div class="flex justify-center mb-4">
        <div
          :class="[
            'w-14 h-14 flex items-center justify-center rounded-full border-[3px] shadow-lg icon-container',
            type === 'success'
              ? 'bg-gradient-to-br from-green-900/30 to-green-800/30 border-green-500 text-green-400'
              : type === 'error'
              ? 'bg-gradient-to-br from-[#a1122d]/30 to-[#c21b3a]/30 border-[#ff3344] text-[#ff3344]'
              : 'bg-gradient-to-br from-amber-900/30 to-amber-800/30 border-amber-500 text-amber-400',
          ]"
        >
          <i
            :class="[
              'text-2xl icon-animation',
              type === 'success'
                ? 'bi bi-check-lg'
                : type === 'error'
                ? 'bi bi-x-lg'
                : 'bi bi-exclamation-lg',
            ]"
          ></i>
        </div>
      </div>

      <h2 class="text-base font-bold mb-1 text-[#f0eaea]">{{ title }}</h2>
      <p class="text-[#b37a7a] mb-4 max-lg:text-sm" v-html="message"></p>

      <div class="flex justify-center">
        <button
          @click="closeAlert"
          :class="[
            'px-7 py-2.5 max-lg:px-4 text-sm max-lg:py-2 rounded-lg font-medium shadow-lg transition-all duration-200 lg:hover:shadow-xl',
            type === 'success'
              ? 'bg-gradient-to-r from-green-600 to-green-500 lg:hover:from-green-700 lg:hover:to-green-600 text-white lg:hover:brightness-110'
              : type === 'error'
              ? 'bg-gradient-to-r from-[#a1122d] to-[#c21b3a] lg:hover:brightness-110 text-white shadow-[#ff3344]/30'
              : 'bg-gradient-to-r from-amber-600 to-amber-500 lg:hover:from-amber-700 lg:hover:to-amber-600 text-white lg:hover:brightness-110',
          ]"
        >
          {{ $t("ok") }}
        </button>
      </div>

      <button
        @click="closeAlert"
        class="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full lg:hover:bg-[#3b1c23] text-[#b37a7a] lg:hover:text-[#ff3344] transition-colors"
      >
        <i class="bi bi-x text-lg"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  isVisible: {
    type: Boolean,
    required: true,
  },
  type: {
    type: String,
    required: false,
    default: "error", // Default to "error"
  },
});

const emit = defineEmits(["close"]);

const visible = ref(props.isVisible);

const closeAlert = () => {
  visible.value = false;
  emit("close");
};

watch(
  () => props.isVisible,
  (newValue) => {
    visible.value = newValue;
  }
);
</script>

<style scoped>
/* Icon animations based on alert type */
.icon-container {
  position: relative;
  overflow: hidden;
}

.icon-container::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  background: radial-gradient(
    circle at center,
    rgba(255, 51, 68, 0.3) 0%,
    rgba(255, 51, 68, 0) 70%
  );
  opacity: 0;
  animation: iconGlowPulse 2s infinite;
}

@keyframes iconGlowPulse {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.3);
  }
  100% {
    opacity: 0;
    transform: scale(0.8);
  }
}

.icon-animation {
  animation: iconEnter 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes iconEnter {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  60% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Popup transition animations */
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

@keyframes popupOut {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.9);
  }
}

.animate-popupIn {
  animation: popupIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.animate-popupOut {
  animation: popupOut 0.2s ease-in forwards;
}
</style>
