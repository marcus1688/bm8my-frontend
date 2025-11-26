<template>
  <div class="text-white p-8 max-xl:p-4 max-lg:p-2">
    <div class="container mx-auto">
      <div class="flex gap-6 max-xl:gap-4 max-lg:flex-col">
        <div class="w-[70%] max-lg:w-full">
          <button
            @click="goBack"
            class="text-[#b37a7a] lg:hover:text-[#ff3344] border !border-[#3b1c23] px-4 py-2 rounded-lg inline-block transition duration-300 ease-in-out lg:hover:bg-[#241017] !mb-4"
          >
            &laquo; {{ $t("back") }}
          </button>

          <div
            v-if="post"
            class="overflow-hidden max-h-max flex flex-col gap-4"
          >
            <div class="relative aspect-[1200/480]">
              <img
                :src="post.image"
                alt="Blog Image"
                class="w-full h-full object-cover rounded-lg border border-[#3b1c23]"
              />
            </div>

            <div
              class="p-6 bg-[#241017]/60 border !border-[#3b1c23] rounded-lg shadow-lg shadow-red-500/20"
            >
              <h1 class="text-2xl font-bold text-[#f0eaea]">
                {{ $i18n.locale === "zh" ? post.titleCN : post.title }}
              </h1>

              <div class="flex items-center mt-2 text-[#b37a7a] text-sm">
                <span class="flex items-center">
                  <i class="bi bi-calendar mr-1"></i>
                  {{ formatDate(post.createdAt) }}
                </span>
              </div>

              <p class="text-[#b37a7a] mt-4 italic">
                {{
                  $i18n.locale === "zh" ? post.descriptionCN : post.description
                }}
              </p>

              <div
                class="text-white blog-content text-lg mt-6"
                v-html="$i18n.locale === 'zh' ? post.contentCN : post.content"
              ></div>

              <div
                v-if="post.tags && post.tags.length > 0"
                class="mt-6 flex flex-wrap gap-2"
              >
                <span
                  v-for="tag in post.tags"
                  :key="tag"
                  class="px-3 py-1 bg-[#ff3344]/20 text-[#ff3344] text-sm rounded-full border border-[#3b1c23]"
                >
                  #{{ tag }}
                </span>
              </div>
            </div>
          </div>

          <div
            v-else
            class="text-center p-8 bg-[#241017]/60 rounded-lg border border-[#3b1c23]"
          >
            <div class="flex justify-center items-center">
              <div
                class="w-4 h-4 rounded-full bg-[#ff3344] animate-pulse"
              ></div>
              <div
                class="w-4 h-4 ml-2 rounded-full bg-[#ff3344] animate-pulse delay-75"
              ></div>
              <div
                class="w-4 h-4 ml-2 rounded-full bg-[#ff3344] animate-pulse delay-150"
              ></div>
            </div>
            <p class="mt-4">{{ $t("loading") }}</p>
          </div>
        </div>

        <div class="w-[30%] max-lg:w-full">
          <div class="rounded-lg mb-6">
            <h2 class="text-xl font-semibold mb-4 text-[#f0eaea]">
              {{ $t("recommended_articles") }}
            </h2>

            <div class="flex flex-col gap-6">
              <div
                v-for="article in recommendArticles"
                :key="article.id"
                class="bg-[#241017]/60 border !border-[#3b1c23] rounded-lg overflow-hidden cursor-pointer transition duration-300 ease-in-out transform lg:hover:scale-105 lg:hover:shadow-[0_0_10px_rgba(255,51,68,0.4)]"
                @click="navigateToArticle(article.slug)"
              >
                <div class="relative aspect-[1200/480]">
                  <img
                    :src="article.image"
                    alt="Article Image"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="p-4">
                  <h2 class="text-lg font-bold text-[#f0eaea]">
                    {{
                      $i18n.locale === "zh" ? article.titleCN : article.title
                    }}
                  </h2>
                  <p class="text-[#b37a7a] mt-2 text-sm line-clamp-2">
                    {{
                      $i18n.locale === "zh"
                        ? article.descriptionCN
                        : article.description
                    }}
                  </p>
                  <div class="mt-3 text-sm text-right">
                    <span class="text-[#ff3344]"
                      >{{ $t("read_more") }} &raquo;</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const { data: blogData } = await useAsyncData(
  `blog-${route.params.slug}`,
  async () => {
    try {
      const [postRes, blogsRes] = await Promise.all([
        $fetch(`${config.public.apiUrl}blogs/${route.params.slug}`),
        $fetch(`${config.public.apiUrl}blogs`),
      ]);

      const currentPost = postRes.success
        ? {
            ...postRes.data,
            title: postRes.data.title,
            description: postRes.data.description,
            content: postRes.data.content,
          }
        : null;

      const recommendations = blogsRes.success
        ? blogsRes.data
            .filter((blog) => blog.slug !== route.params.slug)
            .map((blog) => ({
              ...blog,
              title: blog.title,
              description: blog.description,
            }))
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
        : [];

      return {
        post: currentPost,
        recommendArticles: recommendations,
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      return { post: null, recommendArticles: [] };
    }
  },
  { server: true }
);

const post = computed(() => blogData.value?.post);
const recommendArticles = computed(
  () => blogData.value?.recommendArticles || []
);

useHead({
  title: () =>
    ($locale.value === "zh"
      ? post.value?.metaTitleCN
      : post.value?.metaTitle) || "Blog Post",
  meta: () => [
    {
      name: "description",
      content:
        ($locale.value === "zh"
          ? post.value?.metaDescriptionCN
          : post.value?.metaDescription) || "",
    },
    {
      name: "robots",
      content: "index, follow",
    },
    {
      property: "og:title",
      content:
        ($locale.value === "zh"
          ? post.value?.metaTitleCN
          : post.value?.metaTitle) || "Blog Post",
    },
    {
      property: "og:description",
      content:
        ($locale.value === "zh"
          ? post.value?.metaDescriptionCN
          : post.value?.metaDescription) || "",
    },
  ],
  link: [
    {
      rel: "canonical",
      href: `https://www.bm8my.vip/blog/${route.params.slug}`,
    },
  ],
});

const navigateToArticle = (slug) => {
  const localePath = useLocalePath();
  router.push(localePath(`/blog/${slug}`));
};

const goBack = () => {
  const localePath = useLocalePath();
  router.push(localePath("/blog"));
};
</script>

<style>
.blog-content {
  color: #f0eaea;
  line-height: 1.7;
}

.blog-content h1,
.blog-content h2,
.blog-content h3,
.blog-content h4,
.blog-content h5,
.blog-content h6 {
  margin-top: 1.5em;
  margin-bottom: 0.75em;
  font-weight: bold;
  font-size: 1rem;
  color: #ff3344;
}

.blog-content p {
  margin-bottom: 1em;
}

.blog-content p:empty {
  margin: 1em 0;
}

.blog-content a {
  color: #ff3344;
  text-decoration: none;
  transition: color 0.2s ease;
}

.blog-content a:hover {
  color: #c21b3a;
  text-decoration: underline;
}

.blog-content img {
  max-width: 100%;
  border-radius: 8px;
  margin: 1.5em 0;
  border: 1px solid #3b1c23;
}

.blog-content hr {
  border: 0;
  height: 2px;
  background: linear-gradient(
    to right,
    rgba(255, 51, 68, 0),
    rgba(255, 51, 68, 0.75),
    rgba(255, 51, 68, 0)
  );
  margin: 2em 0;
}

.blog-content blockquote {
  border-left: 4px solid #ff3344;
  padding-left: 1em;
  margin: 1.5em;
  font-style: italic;
  background-color: rgba(255, 51, 68, 0.1);
  padding: 1em;
  border-radius: 4px;
}

.blog-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5em 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  border: 1px solid #3b1c23;
}

.blog-content th,
.blog-content td {
  border: 1px solid #3b1c23;
  padding: 10px 15px;
  text-align: left;
}

.blog-content th {
  background: linear-gradient(135deg, #a1122d, #c21b3a);
  color: #f0eaea;
  font-weight: bold;
}

.blog-content tr:nth-child(even) {
  background: rgba(36, 16, 23, 0.3);
}

.blog-content tr:nth-child(odd) {
  background: rgba(36, 16, 23, 0.2);
}

.blog-content tr:hover {
  background: rgba(255, 51, 68, 0.1);
  transition: background 0.2s ease;
}

.blog-content code {
  background-color: rgba(36, 16, 23, 0.8);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: monospace;
  color: #ff3344;
  border: 1px solid #3b1c23;
}

.blog-content pre {
  background: rgba(36, 16, 23, 0.8);
  padding: 1em;
  border-radius: 8px;
  overflow-x: auto;
  border: 1px solid #3b1c23;
  margin: 1.5em 0;
}

.blog-content pre code {
  background-color: transparent;
  padding: 0;
  color: #f0eaea;
  border: none;
}

.blog-content ul {
  list-style-type: disc !important;
  list-style-position: outside !important;
  padding-left: 1em !important;
  margin: 1em 0;
}

.blog-content ol {
  list-style-type: decimal !important;
  list-style-position: outside !important;
  padding-left: 2em !important;
  margin: 1em 0;
}

.blog-content li {
  display: list-item !important;
  margin-bottom: 0.5em;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
