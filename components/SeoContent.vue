<template>
  <section
    v-if="
      seoData &&
      seoData.isVisible &&
      seoData.contentBlocks &&
      seoData.contentBlocks.length > 0
    "
    class="py-6 containerWid max-lg:pt-2 max-lg:pb-4"
  >
    <div class="mx-auto px-4 max-lg:px-2">
      <div
        class="bg-[#241017] border border-[#3b1c23] rounded-xl overflow-hidden shadow-lg"
      >
        <div
          :class="{
            'max-h-[400px] overflow-hidden relative': !isExpanded,
          }"
          class="transition-all duration-500"
        >
          <div
            class="p-8 space-y-6 max-lg:p-6 max-lg:space-y-4 max-md:p-4 max-md:space-y-3"
          >
            <div
              v-for="block in seoData.contentBlocks"
              :key="block._id"
              class="space-y-4 max-lg:space-y-3 pb-6 max-lg:pb-4 border-b border-[#3b1c23] last:border-b-0 last:pb-0"
            >
              <div
                v-html="$i18n.locale === 'zh' ? block.contentCN : block.content"
                class="seo-content"
              ></div>
            </div>
          </div>

          <!-- Fade Overlay when collapsed -->
          <div
            v-if="!isExpanded"
            class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#241017] to-transparent pointer-events-none"
          ></div>
        </div>

        <!-- Toggle Button -->
        <div
          class="border-t border-[#3b1c23] p-4 text-center bg-gradient-to-r from-[#1A0D13] to-[#15090e]"
        >
          <button
            @click="toggleExpand"
            class="group inline-flex items-center text-sm gap-2 px-6 py-2.5 bg-gradient-to-r from-[#ff3344] to-[#cc2a3a] text-white rounded-lg font-semibold transition-all duration-300 lg:hover:shadow-lg lg:hover:shadow-[#ff3344]/30 max-md:px-4 max-md:py-2"
          >
            <span>{{ isExpanded ? $t("show_less") : $t("read_more") }}</span>
            <i
              :class="isExpanded ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"
              class="transition-transform duration-300"
            ></i>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRoute } from "vue-router";
const route = useRoute();
const { get, post } = useApiEndpoint();
const seoData = ref(null);
const loading = ref(true);
const error = ref(null);
const isExpanded = ref(false);

const pathToSeoType = {
  "/": "index",
  "/games/fishing": "fishing",
  "/games/livecasino": "livecasino",
  "/games/slots": "slot",
  "/games/e-sports": "esport",
  "/games/sports": "sport",
  "/games/lottery": "lottery",
};

const getSeoPageType = (path) => {
  const cleanPath = path.replace(/^\/(en|zh|zh_hk|ms|id)/, "") || "/";
  return pathToSeoType[cleanPath] || "index";
};

async function fetchSeoContent() {
  try {
    loading.value = true;
    error.value = null;
    const pageType = getSeoPageType(route.path);
    const { data } = await get(`seo-pages`);
    if (data.success && data.data) {
      const pageData = data.data.find((page) => page.pageType === pageType);
      if (pageData && pageData.isVisible) {
        seoData.value = pageData;
      } else {
        seoData.value = null;
      }
    }
  } catch (err) {
    seoData.value = null;
    console.log("SEO content fetch error:", err);
  } finally {
    loading.value = false;
  }
}

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

await useAsyncData(`seo-content-${getSeoPageType(route.path)}`, async () => {
  await fetchSeoContent();
  return { loaded: true };
});

watch(
  () => route.path,
  () => {
    fetchSeoContent();
  }
);
</script>

<style>
.seo-content {
  color: #b37a7a;
  line-height: 1.6;
  font-size: 14px;
}

.seo-content h1 {
  color: #f0eaea;
  font-weight: bold;
  font-size: 1.5rem;
  margin-top: 1em;
  margin-bottom: 0.5em;
}

.seo-content h2 {
  color: #f0eaea;
  font-weight: bold;
  font-size: 1.25rem;
  margin-top: 1em;
  margin-bottom: 0.5em;
}

.seo-content h3 {
  color: #f0eaea;
  font-weight: bold;
  font-size: 1.1rem;
  margin-top: 0.75em;
  margin-bottom: 0.4em;
}

.seo-content h4,
.seo-content h5,
.seo-content h6 {
  color: #f0eaea;
  font-weight: 600;
  font-size: 1rem;
  margin-top: 0.75em;
  margin-bottom: 0.4em;
}

.seo-content p {
  margin-bottom: 0.75em;
  color: #b37a7a;
  line-height: 1.6;
}

.seo-content p:empty {
  margin: 0.4em 0;
}

.seo-content a {
  color: #ff3344;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  border-bottom: 1px solid transparent;
}

.seo-content a:hover {
  color: #ff5566;
  border-bottom-color: #ff3344;
}

.seo-content ul,
.seo-content ol {
  margin: 0.75em 0;
  padding-left: 1.5em;
  color: #b37a7a;
}

.seo-content li {
  margin-bottom: 0.4em;
  line-height: 1.5;
}

.seo-content ul li::marker {
  color: #ff3344;
}

.seo-content ol li::marker {
  color: #ff3344;
  font-weight: bold;
}

.seo-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 1em 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #3b1c23;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  font-size: 13px;
}

.seo-content th,
.seo-content td {
  border: 1px solid #3b1c23;
  padding: 8px 12px;
  text-align: left;
}

.seo-content th {
  background: linear-gradient(135deg, #ff3344, #cc2a3a);
  color: #ffffff;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

.seo-content tr:nth-child(even) {
  background-color: rgba(36, 16, 23, 0.4);
}

.seo-content tr:nth-child(odd) {
  background-color: rgba(26, 13, 19, 0.4);
}

.seo-content tr:hover {
  background-color: rgba(255, 51, 68, 0.1);
  transition: background-color 0.2s ease;
}

.seo-content strong,
.seo-content b {
  color: #f0eaea;
  font-weight: 700;
}

.seo-content em,
.seo-content i {
  color: #d4a5a5;
  font-style: italic;
}

.seo-content blockquote {
  border-left: 3px solid #ff3344;
  padding: 0.75em 1em;
  margin: 1em 0;
  background: linear-gradient(
    135deg,
    rgba(255, 51, 68, 0.05),
    rgba(204, 42, 58, 0.05)
  );
  border-radius: 6px;
  color: #d4a5a5;
  font-style: italic;
}

.seo-content code {
  background-color: rgba(36, 16, 23, 0.9);
  padding: 0.2em 0.4em;
  border-radius: 4px;
  font-family: "Courier New", monospace;
  color: #ff5566;
  border: 1px solid #3b1c23;
  font-size: 0.85em;
}

.seo-content pre {
  background: rgba(21, 9, 14, 0.9);
  padding: 1em;
  border-radius: 8px;
  overflow-x: auto;
  border: 1px solid #3b1c23;
  margin: 1em 0;
  font-size: 13px;
}

.seo-content pre code {
  background-color: transparent;
  padding: 0;
  color: #f0eaea;
  border: none;
}

.seo-content hr {
  border: 0;
  height: 1px;
  background: linear-gradient(
    to right,
    rgba(255, 51, 68, 0),
    rgba(255, 51, 68, 0.4),
    rgba(255, 51, 68, 0)
  );
  margin: 1.5em 0;
}

@media (max-width: 768px) {
  .seo-content {
    font-size: 13px;
    line-height: 1.5;
  }

  .seo-content h1 {
    font-size: 1.2rem;
    margin-top: 0.75em;
    margin-bottom: 0.4em;
  }

  .seo-content h2 {
    font-size: 1.1rem;
    margin-top: 0.75em;
    margin-bottom: 0.4em;
  }

  .seo-content h3 {
    font-size: 1rem;
    margin-top: 0.5em;
    margin-bottom: 0.3em;
  }

  .seo-content p {
    margin-bottom: 0.5em;
  }

  .seo-content p:empty {
    margin: 0.25em 0;
  }

  .seo-content ul,
  .seo-content ol {
    margin: 0.5em 0;
    padding-left: 1.25em;
  }

  .seo-content li {
    margin-bottom: 0.3em;
  }

  .seo-content table {
    font-size: 11px;
  }

  .seo-content th,
  .seo-content td {
    padding: 6px 8px;
  }

  .seo-content blockquote {
    padding: 0.5em 0.75em;
    margin: 0.75em 0;
  }

  .seo-content pre {
    padding: 0.75em;
    margin: 0.75em 0;
    font-size: 12px;
  }

  .seo-content hr {
    margin: 1em 0;
  }
}

@media (max-width: 480px) {
  .seo-content {
    font-size: 12px;
  }

  .seo-content h1 {
    font-size: 1.1rem;
  }

  .seo-content h2 {
    font-size: 1rem;
  }

  .seo-content h3 {
    font-size: 0.95rem;
  }

  .seo-content p:empty {
    margin: 0.2em 0;
  }

  .seo-content table {
    font-size: 10px;
  }

  .seo-content th,
  .seo-content td {
    padding: 4px 6px;
  }
}
</style>
