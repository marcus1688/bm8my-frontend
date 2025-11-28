<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="show"
        class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[999] p-4"
        @click.self="$emit('close')"
      >
        <div
          v-show="show"
          class="bg-[#15090e] border border-[#3b1c23] rounded-xl shadow-2xl max-w-[800px] w-full overflow-hidden max-h-[70vh] flex flex-col"
          :class="show ? 'animate-popupIn' : 'animate-popupOut'"
          role="dialog"
          aria-modal="true"
        >
          <div
            class="relative bg-gradient-to-b from-[#241017] to-[#1A0D13] p-5 max-lg:p-4 flex-shrink-0 border-b border-[#3b1c23]"
          >
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-bold text-[#f0eaea] max-sm:text-sm">
                {{ promotion.maintitle }}
              </h2>
              <button
                @click="$emit('close')"
                class="w-8 h-8 rounded-full border border-[#3b1c23] lg:hover:border-[#ff3344] flex items-center justify-center text-[#b37a7a] lg:hover:text-[#ff3344] transition-all max-lg:w-7 max-lg:h-7"
              >
                <i class="bi bi-x text-xl max-lg:text-lg"></i>
              </button>
            </div>
          </div>

          <div class="flex-1 overflow-y-auto scrollbar-thin">
            <div class="bg-[#1A0D13] p-3">
              <img
                :src="promotion.promotionimage"
                :alt="promotion.maintitle"
                class="w-[50vh] mx-auto rounded-lg border border-[#3b1c23]"
              />
            </div>

            <div v-if="promotion.content" class="p-6 max-lg:p-4">
              <div v-html="promotion.content" class="promotion-content"></div>
            </div>
          </div>

          <div
            class="p-4 border-t border-[#3b1c23] bg-[#1A0D13] max-lg:p-3 flex-shrink-0"
          >
            <button
              @click="$emit('close')"
              class="w-full py-2.5 px-4 bg-transparent border border-[#ff3344] text-[#ff3344] rounded-lg font-semibold lg:hover:bg-[#ff3344] lg:hover:text-white transition-all max-lg:py-2 max-lg:text-sm"
            >
              {{ $t("close") }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  promotion: {
    type: Object,
    default: () => ({
      maintitle: "",
      promotionimage: "",
      content: "",
      TnC: "",
    }),
  },
});

defineEmits(["close"]);

// Lock body scroll when modal is open
watch(
  () => props.show,
  (newValue) => {
    if (newValue) {
      document.body.style.overflow = "hidden";
      nextTick(() => {
        adjustTables();
      });
    } else {
      document.body.style.overflow = "";
    }
  }
);

onMounted(async () => {
  await nextTick();
  adjustTables();
  window.addEventListener("resize", adjustTables);
});

function adjustTables() {
  const tables = document.querySelectorAll(".promotion-content table");
  tables.forEach((table) => {
    if (!table.parentElement.classList.contains("table-wrapper")) {
      const wrapper = document.createElement("div");
      wrapper.className = "table-wrapper";
      wrapper.style.width = "100%";
      wrapper.style.overflowX = "auto";
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    }

    const colgroups = table.querySelectorAll("colgroup");
    colgroups.forEach((colgroup) => {
      colgroup.style.display = "none";
    });

    table.style.width = "100%";
    table.style.maxWidth = "100%";
    table.style.display = "table";
  });
}

onBeforeUnmount(() => {
  window.removeEventListener("resize", adjustTables);
  document.body.style.overflow = "";
});
</script>

<style scoped>
/* Fade transition for overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Popup transition animations - Same as alert */
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

/* Custom scrollbar */
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

/* Table wrapper */
.table-wrapper {
  width: 100%;
  overflow-x: auto;
  margin-bottom: 1rem;
}

/* Content styles */
.promotion-content {
  width: 100%;
  color: #f0eaea;
}

:deep(.promotion-content table) {
  width: 100% !important;
  border-collapse: collapse;
  margin-bottom: 1rem;
  background-color: #241017;
  border-radius: 8px;
  overflow: hidden;
}

:deep(.promotion-content table th),
:deep(.promotion-content table td) {
  border: 1px solid #3b1c23;
  padding: 0.75rem 0.5rem;
  text-align: left;
  color: #f0eaea;
}

:deep(.promotion-content table th) {
  background-color: #3b1c23;
  font-weight: 600;
  color: #ff3344;
  font-size: 0.875rem;
}

:deep(.promotion-content table tr:nth-child(even)) {
  background-color: #1a0d13;
}

:deep(.promotion-content table tr:hover) {
  background-color: #2a0f14;
}

:deep(.promotion-content p) {
  color: #f0eaea;
  line-height: 1.6;
}

:deep(.promotion-content ul),
:deep(.promotion-content ol) {
  margin-left: 1.5rem;
  margin-bottom: 1rem;
  color: #f0eaea;
}

:deep(.promotion-content li) {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

:deep(.promotion-content h1),
:deep(.promotion-content h2),
:deep(.promotion-content h3),
:deep(.promotion-content h4) {
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  font-weight: 700;
  color: #ff3344;
}

:deep(.promotion-content h1) {
  font-size: 1.5rem;
}

:deep(.promotion-content h2) {
  font-size: 1.25rem;
}

:deep(.promotion-content h3) {
  font-size: 1.125rem;
  margin-top: 0.75rem;
  margin-bottom: 0.5rem;
}

:deep(.promotion-content hr) {
  border: none;
  height: 1px;
  background: #3b1c23;
  margin: 1.5rem 0;
}

:deep(.promotion-content a) {
  color: #ff3344;
  text-decoration: underline;
  transition: color 0.2s;
}

:deep(.promotion-content a:hover) {
  color: #cc2a3a;
}

:deep(.promotion-content strong),
:deep(.promotion-content b) {
  color: #ff3344;
  font-weight: 700;
}

:deep(.promotion-content em),
:deep(.promotion-content i) {
  font-style: italic;
  color: #b37a7a;
}
</style>
