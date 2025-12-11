<template>
  <div
    ref="chatButton"
    :class="[
      'fixed cursor-pointer z-[90] w-[100px] max-lg:w-[80px] ',
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
    default: "/images/livechat/livechat.png",
  },
  buttonAlt: {
    type: String,
    default: "Chat with us",
  },
});

const chatButton = ref(null);
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
  const rect = chatButton.value.getBoundingClientRect();
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

const handleClick = (e) => {
  if (!hasDragged.value) {
    openLiveChat();
  }
  hasDragged.value = false;
};

const openLiveChat = () => {
  if (window.LiveChatWidget) {
    window.LiveChatWidget.call("maximize");
  } else {
    console.warn("LiveChat Widget API is not available");
    window.open(
      "https://www.livechat.com/customer-service/?utm_source=chat_button&utm_medium=referral&utm_campaign=16323336",
      "_blank"
    );
  }
};

onMounted(() => {
  const isMobile = window.innerWidth <= 1024;
  position.value = {
    right: isMobile ? "10px" : "4px",
    bottom: isMobile ? "64px" : "64px",
  };
});
</script>

<style>
.bounce-infinite {
  animation: bounce 1.5s ease infinite;
}
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}
</style>
