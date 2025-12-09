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
        adjustContent();
      });
    } else {
      document.body.style.overflow = "";
    }
  }
);

onMounted(async () => {
  await nextTick();
  adjustContent();
  window.addEventListener("resize", adjustContent);
});

function adjustContent() {
  const content = document.querySelector(".promotion-content");
  if (!content) return;

  const screenWidth = window.innerWidth;

  if (screenWidth <= 640) {
    content.style.zoom = "0.7";
  } else if (screenWidth <= 1024) {
    content.style.zoom = "0.85";
  } else {
    content.style.zoom = "1";
  }

  content.style.transform = "none";
  content.style.width = "100%";
  content.style.webkitTextSizeAdjust = "100%";
  content.style.textSizeAdjust = "100%";

  const paragraphs = content.querySelectorAll("p");
  paragraphs.forEach((p) => {
    const text = p.textContent?.trim();
    if (
      !text ||
      text === "" ||
      text === "\u00A0" ||
      p.innerHTML.trim() === "&nbsp;" ||
      p.innerHTML.trim() === ""
    ) {
      p.style.height = "0.75rem";
      p.style.margin = "0";
      p.style.padding = "0";
    } else {
      p.style.color = "#f0eaea";
      p.style.lineHeight = "1.6";
      p.style.webkitTextSizeAdjust = "100%";
    }
  });

  const tables = content.querySelectorAll("table");
  tables.forEach((table) => {
    if (!table.parentElement.classList.contains("table-wrapper")) {
      const wrapper = document.createElement("div");
      wrapper.className = "table-wrapper";
      wrapper.style.width = "100%";
      wrapper.style.overflowX = "auto";
      wrapper.style.marginBottom = "1rem";
      wrapper.style.paddingBottom = "0.5rem";
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
    table.style.borderCollapse = "separate";
    table.style.borderSpacing = "0";
    table.style.backgroundColor = "#241017";
    table.style.border = "1px solid white";
    table.style.webkitTextSizeAdjust = "100%";

    const allRows = table.querySelectorAll("tr");

    allRows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll("td, th");
      const totalCells = cells.length;

      cells.forEach((cell, cellIndex) => {
        cell.style.padding = "0.75rem 0.5rem";
        cell.style.textAlign = "center";
        cell.style.color = "#f0eaea";
        cell.style.borderBottom = "1px solid white";
        cell.style.borderRight =
          cellIndex < totalCells - 1 ? "1px solid white" : "none";
        cell.style.webkitTextSizeAdjust = "100%";
      });
    });

    const firstRow = table.querySelector("tbody tr:first-child");
    if (firstRow) {
      const firstRowCells = firstRow.querySelectorAll("td");
      firstRowCells.forEach((cell) => {
        cell.style.whiteSpace = "nowrap";
        cell.style.backgroundColor = "#3b1c23";
        cell.style.fontWeight = "600";
        cell.style.color = "#ff3344";
      });
    }

    const rows = table.querySelectorAll("tbody tr");
    rows.forEach((row, index) => {
      if (index > 0 && index % 2 === 0) {
        const cells = row.querySelectorAll("td");
        cells.forEach((cell) => {
          cell.style.backgroundColor = "#1a0d13";
        });
      }
    });
  });

  const uls = content.querySelectorAll("ul");
  uls.forEach((ul) => {
    ul.style.marginLeft = "1.5rem";
    ul.style.marginBottom = "1rem";
    ul.style.color = "#f0eaea";
    ul.style.listStyleType = "disc";
    ul.style.paddingLeft = "1rem";
    ul.style.webkitTextSizeAdjust = "100%";
  });

  const ols = content.querySelectorAll("ol");
  ols.forEach((ol) => {
    ol.style.marginLeft = "0.5rem";
    ol.style.color = "#f0eaea";
    ol.style.listStyleType = "decimal";
    ol.style.paddingLeft = "1rem";
    ol.style.webkitTextSizeAdjust = "100%";
  });

  const lis = content.querySelectorAll("li");
  lis.forEach((li) => {
    li.style.marginBottom = "0.5rem";
    li.style.lineHeight = "1.6";
    li.style.display = "list-item";
    li.style.webkitTextSizeAdjust = "100%";
  });

  const headings = content.querySelectorAll("h1, h2, h3, h4");
  headings.forEach((heading) => {
    heading.style.marginTop = "1.5rem";
    heading.style.marginBottom = "0.75rem";
    heading.style.fontWeight = "700";
    heading.style.color = "#ff3344";
    heading.style.webkitTextSizeAdjust = "100%";
  });

  const h1s = content.querySelectorAll("h1");
  h1s.forEach((h1) => (h1.style.fontSize = "1.5rem"));

  const h2s = content.querySelectorAll("h2");
  h2s.forEach((h2) => (h2.style.fontSize = "1.25rem"));

  const h3s = content.querySelectorAll("h3");
  h3s.forEach((h3) => {
    h3.style.fontSize = "1.125rem";
    h3.style.marginTop = "0.75rem";
    h3.style.marginBottom = "0.5rem";
  });

  const hrs = content.querySelectorAll("hr");
  hrs.forEach((hr) => {
    hr.style.border = "none";
    hr.style.height = "1px";
    hr.style.background = "#3b1c23";
    hr.style.margin = "1.5rem 0";
  });

  const links = content.querySelectorAll("a");
  links.forEach((link) => {
    link.style.color = "#ff3344";
    link.style.textDecoration = "underline";
  });

  const strongs = content.querySelectorAll("strong, b");
  strongs.forEach((strong) => {
    strong.style.color = "#ff3344";
    strong.style.fontWeight = "700";
  });

  const ems = content.querySelectorAll("em, i");
  ems.forEach((em) => {
    em.style.fontStyle = "italic";
    em.style.color = "#b37a7a";
  });
}

onBeforeUnmount(() => {
  window.removeEventListener("resize", adjustContent);
  document.body.style.overflow = "";
});
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

.promotion-content {
  width: 100%;
  color: #f0eaea;
  font-size: 0.875rem;
}
</style>
