<template>
  <div class="text-white pb-8 fade-in max-lg:pb-4">
    <!-- Hero Section -->
    <section class="relative max-lg:max-w-[100vw] shadow-lg shadow-red-600/20">
      <img
        src="/images/banner/blog_banner_desktop.png"
        alt="Promotions and Bonuses Banner"
        class="w-full h-auto lg:block hidden"
      />
      <img
        src="/images/banner/blog_banner_mobile.png"
        alt="Promotions and Bonuses Banner"
        class="w-full h-auto lg:hidden block"
      />
    </section>

    <div class="px-6 max-lg:px-4 mt-8 max-lg:mt-6">
      <div class="flex justify-center mb-6 max-md:mb-4">
        <div class="relative w-1/2 max-md:w-full">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="$t('search_placeholder')"
            class="w-full !p-3 !pl-10 rounded-lg bg-[#241017]/60 border !border-[#3b1c23] text-white focus:outline-none focus:ring-2 focus:ring-[#ff3344] placeholder-[#b37a7a]"
          />
          <span
            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#ff3344]"
          >
            <i class="bi bi-search text-xl"></i>
          </span>
        </div>
      </div>
    </div>

    <div class="px-28 max-xl:px-8 max-lg:px-4">
      <div
        class="grid grid-cols-4 max-2xl:grid-cols-3 gap-6 max-xl:gap-4 max-xl:grid-cols-2 max-md:grid-cols-1"
      >
        <div
          v-for="post in paginatedPosts"
          :key="post.id"
          class="bg-[#241017]/60 rounded-xl shadow-lg shadow-red-500/20 overflow-hidden cursor-pointer transition duration-300 ease-in-out transform lg:hover:scale-105 lg:hover:shadow-[#ff3344]/20 border border-[#3b1c23]"
          @click="navigateToArticle(post.slug)"
        >
          <div class="relative aspect-[1200/480]">
            <img
              :src="post.image"
              alt="Blog Image"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="!p-4 flex flex-col h-[180px]">
            <h2
              class="text-xl font-bold text-[#f0eaea] line-clamp-2 min-h-[60px]"
            >
              {{ $i18n.locale === "zh" ? post.titleCN : post.title }}
            </h2>
            <p class="text-[#b37a7a] mt-2 line-clamp-2 min-h-[50px]">
              {{
                $i18n.locale === "zh" ? post.descriptionCN : post.description
              }}
            </p>
            <div class="flex justify-end mt-auto">
              <span
                class="inline-block px-4 py-2 bg-gradient-to-r from-[#a1122d] to-[#c21b3a] text-white rounded-lg transition duration-300 ease-in-out lg:hover:brightness-110 cursor-pointer font-bold text-sm shadow-lg"
              >
                {{ $t("read_more") }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="paginatedPosts.length === 0"
        class="text-center mt-8 text-[#b37a7a]"
      >
        <i class="bi bi-search text-6xl text-[#ff3344]/50"></i>
        <p class="mt-4 text-xl">{{ $t("no_results_blog") }}</p>
        <button
          @click="searchQuery = ''"
          class="mt-4 px-4 py-2 bg-[#ff3344]/20 text-[#ff3344] rounded-lg lg:hover:bg-[#ff3344]/30 border border-[#3b1c23]"
        >
          {{ $t("clear_search") }}
        </button>
      </div>

      <div v-if="totalPages > 1" class="flex justify-center mt-8 mb-8">
        <button
          class="border border-[#3b1c23] lg:hover:bg-[#241017] text-white px-4 py-2 rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          @click="prevPage"
          :disabled="currentPage === 1"
        >
          &laquo;
        </button>

        <div
          class="border-t border-b border-[#3b1c23] bg-[#241017]/60 text-[#ff3344] px-6 py-2 flex items-center"
        >
          <span class="font-medium">{{ currentPage }}/{{ totalPages }}</span>
        </div>

        <button
          class="border border-[#3b1c23] lg:hover:bg-[#241017] text-white px-4 py-2 rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          @click="nextPage"
          :disabled="currentPage === totalPages"
        >
          &raquo;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
const config = useRuntimeConfig();

const { data: blogData } = await useAsyncData("blogs", async () => {
  try {
    const response = await $fetch(`${config.public.apiUrl}blogs`);
    if (!response) {
      console.error("API returned null response");
      return [];
    }
    return response.success ? response.data : [];
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
});

const blogPosts = computed(() => blogData.value || []);
const postsPerPage = 8;
const currentPage = ref(1);
const searchQuery = ref("");

const normalizeString = (str) => {
  if (!str || typeof str !== "string") return "";
  return str.trim().toLowerCase().replace(/\s+/g, "");
};

const filteredPosts = computed(() => {
  const normalizedQuery = normalizeString(searchQuery.value);
  return blogPosts.value.filter((post) => {
    const title = $locale.value === "zh" ? post.titleCN : post.title;
    return normalizeString(title).includes(normalizedQuery);
  });
});

const totalPages = computed(() =>
  Math.ceil(filteredPosts.value.length / postsPerPage)
);

const paginatedPosts = computed(() =>
  filteredPosts.value.slice(
    (currentPage.value - 1) * postsPerPage,
    currentPage.value * postsPerPage
  )
);

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const navigateToArticle = (slug) => {
  const localePath = useLocalePath();
  router.push(localePath(`/blog/${slug}`));
};

watch(searchQuery, () => {
  currentPage.value = 1;
});

useHead({
  title: "Blog | Latest News & Updates",
  meta: [
    {
      property: "og:title",
      content: "Blog | Latest News & Updates",
    },
    {
      name: "description",
      content:
        "Explore our blog for the latest insights, gaming strategies, industry news, and exclusive tips to enhance your gaming experience.",
    },
    {
      name: "robots",
      content: "index, follow",
    },
    {
      name: "keywords",
      content:
        "blog, gaming news, betting tips, casino guides, gaming strategies, industry updates",
    },
  ],
  htmlAttrs: {
    lang: "en",
  },
  link: [
    {
      rel: "canonical",
      href: "https://www.yoursite.com/blog",
    },
  ],
});
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease forwards;
  opacity: 0;
}

.animate-delay-200 {
  animation-delay: 0.2s;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
