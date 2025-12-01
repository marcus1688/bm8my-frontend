<template>
  <div
    v-if="visible"
    class="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/80 backdrop-blur-sm z-[100]"
    @click.self="closeWithoutConfirm"
  >
    <div
      v-show="visible"
      class="bg-[#1A0D13] border border-[#3b1c23] rounded-xl p-6 w-[90%] max-w-[380px] text-center shadow-2xl shadow-[#ff3344]/20 relative"
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
              : type === 'info'
              ? 'bg-gradient-to-br from-blue-900/30 to-blue-800/30 border-blue-500 text-blue-400'
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
                : type === 'info'
                ? 'bi bi-info-lg'
                : 'bi bi-exclamation-lg',
            ]"
          ></i>
        </div>
      </div>

      <h2 class="text-base font-bold mb-3 text-[#f0eaea]">
        {{ title }}
      </h2>
      <p class="text-[#b37a7a] mb-6 max-lg:text-sm" v-html="message"></p>

      <div class="flex justify-center gap-3">
        <button
          v-if="type === 'warning' || type === 'error'"
          @click="closeWithoutConfirm"
          class="px-7 py-2.5 max-lg:px-4 max-lg:py-2 rounded-lg font-medium shadow-sm transition-all duration-200 lg:hover:shadow-md bg-[#241017]/60 lg:hover:bg-[#3b1c23] text-[#f0eaea] border border-[#3b1c23]"
        >
          {{ $t("cancel") }}
        </button>
        <button
          @click="closeWithConfirm"
          :class="[
            'px-7 py-2.5 max-lg:px-4 max-lg:py-2 rounded-lg font-medium shadow-lg transition-all duration-200 lg:hover:shadow-xl lg:hover:brightness-110',
            type === 'success'
              ? 'bg-gradient-to-r from-green-600 to-green-500 text-white'
              : type === 'error'
              ? 'bg-gradient-to-r from-[#a1122d] to-[#c21b3a] text-white shadow-[#ff3344]/30'
              : type === 'info'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
              : 'bg-gradient-to-r from-amber-600 to-amber-500 text-white',
          ]"
        >
          {{ type === "success" ? "OK" : $t("confirmation") }}
        </button>
      </div>

      <button
        @click="closeWithoutConfirm"
        class="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full lg:hover:bg-[#3b1c23] text-[#b37a7a] lg:hover:text-[#ff3344] transition-colors"
      >
        <i class="bi bi-x text-lg"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
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
    default: "warning", // Default to "warning"
  },
});

const emit = defineEmits(["close"]);

const visible = ref(props.isVisible);

const closeWithConfirm = () => {
  visible.value = false;
  emit("close", true);
};

const closeWithoutConfirm = () => {
  visible.value = false;
  emit("close", false);
};

watch(
  () => props.isVisible,
  (newValue) => {
    visible.value = newValue;
  }
);
</script>

<style scoped>
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
    rgba(255, 255, 255, 0.8) 0%,
    rgba(255, 255, 255, 0) 70%
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

@keyframes popupIn {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
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
  animation: popupIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.animate-popupOut {
  animation: popupOut 0.2s ease-in forwards;
}

@media (max-width: 768px) {
  .p-6 {
    padding: 1.25rem;
  }
}
</style>
