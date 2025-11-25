<template>
  <div
    ref="spinButton"
    :class="[
      'fixed cursor-pointer z-[90] w-[90px] max-lg:w-[70px]',
      isDragging ? '' : 'bounce-infinite',
    ]"
    :style="position"
    @mousedown="startDrag"
    @touchstart="startDrag"
    @click="handleClick"
  >
    <img :src="buttonImage" :alt="buttonAlt" class="w-full" />
  </div>
</template>

<script setup>
const props = defineProps({
  buttonImage: {
    type: String,
    default: "/images/luckyspin/floating.png",
  },
  buttonAlt: {
    type: String,
    default: "Lucky Spin",
  },
});

const spinButton = ref(null);
const isDragging = ref(false);
const hasDragged = ref(false);
const position = ref({});
const dragThreshold = 5;
const startPosition = ref({ x: 0, y: 0 });

const startDrag = (e) => {
  if (e.type !== "touchstart") {
    e.preventDefault();
  }
  isDragging.value = true;
  hasDragged.value = false;
  const clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
  const clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
  startPosition.value = { x: clientX, y: clientY };
  const rect = spinButton.value.getBoundingClientRect();
  const offsetX = clientX - rect.left;
  const offsetY = clientY - rect.top;

  const drag = (e) => {
    if (!isDragging.value) return;
    const currentClientX =
      e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    const currentClientY =
      e.type === "touchmove" ? e.touches[0].clientY : e.clientY;
    const deltaX = Math.abs(currentClientX - startPosition.value.x);
    const deltaY = Math.abs(currentClientY - startPosition.value.y);

    if (deltaX > dragThreshold || deltaY > dragThreshold) {
      hasDragged.value = true;
      e.preventDefault();
      const newLeft = Math.max(
        0,
        Math.min(window.innerWidth - 80, currentClientX - offsetX)
      );
      const newTop = Math.max(
        0,
        Math.min(window.innerHeight - 80, currentClientY - offsetY)
      );
      position.value = {
        left: newLeft + "px",
        top: newTop + "px",
        right: "auto",
        bottom: "auto",
      };
    }
  };

  const stopDrag = () => {
    isDragging.value = false;
    document.removeEventListener("mousemove", drag);
    document.removeEventListener("mouseup", stopDrag);
    document.removeEventListener("touchmove", drag);
    document.removeEventListener("touchend", stopDrag);
  };

  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", stopDrag);
  document.addEventListener("touchmove", drag, { passive: false });
  document.addEventListener("touchend", stopDrag);
};

const localePath = useLocalePath();

const handleClick = (e) => {
  if (!hasDragged.value) {
    navigateTo(localePath("/luckyspin"));
  }
  hasDragged.value = false;
};

onMounted(() => {
  const isMobile = window.innerWidth <= 1024;
  position.value = {
    right: isMobile ? "10px" : "10px",
    bottom: isMobile ? "150px" : "170px",
  };
});
</script>

<style scoped>
.bounce-infinite {
  animation: spin-rotate 4s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
}

@keyframes spin-rotate {
  0% {
    transform: rotate(0deg);
  }
  40% {
    transform: rotate(720deg);
  }
  100% {
    transform: rotate(720deg);
  }
}
</style>
