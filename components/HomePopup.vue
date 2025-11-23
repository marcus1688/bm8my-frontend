<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[10000] max-lg:px-4"
    @click.self="closePopup"
  >
    <div
      class="rounded-xl max-h-[90vh] w-[550px] max-sm:w-full relative overflow-hidden shadow-2xl shadow-[#ff3344]/20 border border-[#3b1c23]"
      style="background: linear-gradient(to bottom, #1a0d13, #241017)"
    >
      <div
        v-if="hasTitleContent"
        class="relative py-3 px-6 max-sm:py-2 max-sm:px-4 border-b border-[#3b1c23]"
        style="background: linear-gradient(to right, #a1122d, #c21b3a)"
      >
        <div class="flex items-center justify-center">
          <h2
            class="text-lg max-sm:text-base font-bold text-white pr-8"
            v-html="getLocalizedContent(popupData, 'title')"
          ></h2>
          <button
            @click="closePopup"
            class="absolute right-4 max-sm:right-3 top-1/2 -translate-y-1/2 text-white/80 lg:hover:text-white transition-colors duration-200"
          >
            <Icon
              icon="heroicons:x-mark-20-solid"
              class="w-6 h-6 max-sm:w-5 max-sm:h-5"
            />
          </button>
        </div>
      </div>
      <div class="overflow-y-auto max-h-[70vh] bg-[#1A0D13] scrollbar-thin">
        <div>
          <div v-if="popupData.image" class="relative">
            <div
              v-if="imageLoading"
              class="w-full h-48 max-sm:h-32 bg-[#241017] flex items-center justify-center"
            >
              <div class="flex flex-col items-center gap-3">
                <div class="relative">
                  <div
                    class="w-8 h-8 max-sm:w-6 max-sm:h-6 border-2 border-[#3b1c23] border-t-[#ff3344] rounded-full animate-spin"
                  ></div>
                  <div
                    class="absolute inset-0 w-8 h-8 max-sm:w-6 max-sm:h-6 border border-[#3b1c23] rounded-full animate-pulse"
                  ></div>
                </div>
                <span
                  class="text-[#ff3344] text-sm max-sm:text-xs font-medium animate-pulse"
                >
                  {{ $t("loading") }}...</span
                >
              </div>
            </div>
            <img
              :src="popupData.image"
              :alt="getLocalizedContent(popupData, 'title')"
              class="w-full h-auto shadow-lg"
              :class="{ hidden: imageLoading }"
              @load="imageLoading = false"
              @error="imageLoading = false"
            />
          </div>
          <div
            v-if="hasContentText"
            class="text-[#f0eaea] text-sm max-sm:text-xs leading-relaxed whitespace-pre-wrap break-words max-w-full px-6 py-4 max-sm:px-4 max-sm:py-3"
            v-html="getLocalizedContent(popupData, 'content')"
          ></div>
        </div>
      </div>
      <div class="p-4 max-sm:p-3 border-t border-[#3b1c23] bg-[#241017]">
        <button
          @click="closePopup"
          class="w-full py-3 max-sm:py-2.5 px-4 bg-gradient-to-r from-[#a1122d] to-[#c21b3a] lg:hover:brightness-110 text-white text-sm max-sm:text-xs font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#ff3344]/30"
        >
          {{ $t("close") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";

const props = defineProps({
  popupData: {
    type: Object,
    required: true,
  },
});

const show = ref(true);
const imageLoading = ref(true);
const shouldShowPopup = useState("shouldShowPopup");
const activePopup = useState("activePopup");

const getLocalizedContent = (data, type) => {
  if (!data) return "";
  const langSuffix = $locale.value.toUpperCase();
  const propertyName = `${type}${langSuffix}`;
  return data[propertyName] || "";
};

const hasTitleContent = computed(() => {
  const titleContent = getLocalizedContent(props.popupData, "title");
  const textContent = titleContent.replace(/<\/?[^>]+(>|$)/g, "").trim();
  return textContent.length > 0;
});

const hasContentText = computed(() => {
  const contentText = getLocalizedContent(props.popupData, "content");
  const textContent = contentText.replace(/<\/?[^>]+(>|$)/g, "").trim();
  return textContent.length > 0;
});

const closePopup = () => {
  show.value = false;
  if (props.popupData._id) {
    localStorage.setItem("lastPopupId", props.popupData._id);
    localStorage.setItem("lastPopupTime", new Date().toISOString());
    shouldShowPopup.value = false;
    activePopup.value = null;
  }
};

watch(
  () => props.popupData.image,
  () => {
    if (props.popupData.image) {
      imageLoading.value = true;
    }
  }
);
</script>
