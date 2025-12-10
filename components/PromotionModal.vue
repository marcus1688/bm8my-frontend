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
          class="bg-[#15090e] border border-[#3b1c23] rounded-xl shadow-2xl max-w-[1200px] w-full overflow-hidden max-h-[90vh] flex flex-col"
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
                :src="localizedImage"
                :alt="promotion.maintitle"
                class="w-[50vh] mx-auto rounded-lg border border-[#3b1c23]"
              />
            </div>

            <div v-if="promotion.content" class="p-6 max-lg:p-4">
              <div v-html="promotion.content" class="promotion-content"></div>
            </div>
          </div>

          <div
            class="p-4 border-t border-[#3b1c23] bg-[#1A0D13] max-lg:p-3 flex-shrink-0 lg:hidden"
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
      promotionimage2: "",
      promotionimage3: "",
      content: "",
      TnC: "",
    }),
  },
});

const localizedImage = computed(() => {
  if ($locale.value === "zh" && props.promotion.promotionimage2) {
    return props.promotion.promotionimage2;
  }
  if ($locale.value === "ms" && props.promotion.promotionimage3) {
    return props.promotion.promotionimage3;
  }
  return props.promotion.promotionimage;
});

defineEmits(["close"]);

watch(
  () => props.show,
  (newValue) => {
    if (newValue) {
      document.body.style.overflow = "hidden";
      nextTick(() => {
        wrapTables();
      });
    } else {
      document.body.style.overflow = "";
    }
  }
);

function wrapTables() {
  const tables = document.querySelectorAll(".promotion-content table");
  tables.forEach((table) => {
    if (!table.parentElement.classList.contains("table-wrapper")) {
      const wrapper = document.createElement("div");
      wrapper.className = "table-wrapper";
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    }
  });

  const paragraphs = document.querySelectorAll(".promotion-content p");
  paragraphs.forEach((p) => {
    const text = p.textContent?.trim();
    if (!text || text === "" || text === "\u00A0") {
      p.style.height = "0.5rem";
      p.style.margin = "0";
      p.style.padding = "0";
      p.style.lineHeight = "0";
    }
  });
}

onBeforeUnmount(() => {
  document.body.style.overflow = "";
});
</script>

<style>
.promotion-content {
  width: 100%;
  color: #f0eaea;
  font-size: 0.875rem;
  -webkit-text-size-adjust: 100%;
}

.promotion-content .table-wrapper {
  width: 100%;
  overflow-x: auto;
  margin: 0.2rem 0;
  padding-bottom: 0.5rem;
}

.promotion-content table {
  width: 100%;
  min-width: max-content;
  table-layout: auto !important;
  border-collapse: collapse;
  margin: 0;
  border: 1px solid white;
  background-color: #241017;
}

.promotion-content table th,
.promotion-content table td {
  border: 1px solid white;
  padding: 0.75rem 0.5rem;
  text-align: center;
  color: #f0eaea;
  word-break: break-word;
}

.promotion-content table tbody tr:first-child td {
  background-color: #3b1c23;
  font-weight: 600;
  color: #ff3344;
  white-space: nowrap;
}

.promotion-content table tr:nth-child(even) {
  background-color: #1a0d13;
}

.promotion-content table p {
  margin: 0;
}

.promotion-content p {
  color: #f0eaea;
  line-height: 1.6;
}

.promotion-content p:empty {
  height: 0.75rem;
  margin: 0;
  padding: 0;
}

.promotion-content ul {
  margin-left: 1.5rem;
  margin-bottom: 1rem;
  color: #f0eaea;
  list-style-type: disc;
  padding-left: 1rem;
}

.promotion-content ol {
  margin-left: 0.5rem;
  color: #f0eaea;
  list-style-type: decimal;
  padding-left: 1rem;
}

.promotion-content li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
  display: list-item;
}

.promotion-content h1,
.promotion-content h2,
.promotion-content h3,
.promotion-content h4,
.promotion-content h5 {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
  color: #ff3344;
}

.promotion-content h1 {
  font-size: 1.5rem;
}

.promotion-content h2 {
  font-size: 1.25rem;
}

.promotion-content h3 {
  font-size: 1.125rem;
}

.promotion-content h4 {
  font-size: 1rem;
}

.promotion-content h5 {
  font-size: 0.875rem;
}

.promotion-content hr {
  border: none;
  height: 1px;
  background: #3b1c23;
  margin: 1.5rem 0;
}

.promotion-content a {
  color: #ff3344;
  text-decoration: underline;
}

.promotion-content strong,
.promotion-content b {
  color: #ff3344;
  font-weight: 700;
}

.promotion-content em,
.promotion-content i {
  font-style: italic;
  color: #b37a7a;
}

@media (max-width: 1024px) {
  .promotion-content {
    font-size: 0.8125rem;
  }

  .promotion-content table {
    font-size: 0.8125rem;
  }
}

@media (max-width: 640px) {
  .promotion-content {
    font-size: 0.75rem;
  }

  .promotion-content table {
    font-size: 0.75rem;
  }

  .promotion-content table th,
  .promotion-content table td {
    padding: 0.5rem 0.375rem;
  }

  .promotion-content h1 {
    font-size: 1.25rem;
  }

  .promotion-content h2 {
    font-size: 1.125rem;
  }

  .promotion-content h3 {
    font-size: 1rem;
  }

  .promotion-content .leading-relaxed {
    font-size: 0.75rem;
  }

  .promotion-content span[style*="font-size"] {
    font-size: inherit !important;
  }
}
</style>
