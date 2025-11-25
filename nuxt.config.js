const isDev = process.env.NODE_ENV === "development";
const isAPKBuild = process.env.BUILD_TARGET === "apk";
const APIURL = isDev
  ? "http://localhost:3001/api/"
  : "https://api.egm8my.vip/api/";
const SSR_ENABLED = isAPKBuild ? false : true;

export default defineNuxtConfig({
  ssr: SSR_ENABLED,
  alias: {
    "@": "/assets",
  },

  app: {
    head: {
      charset: "utf-8",
      viewport:
        "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no,viewport-fit=cover",
      title: "BM8",
      script: [
        {
          src: "https://cdn.jsdelivr.net/npm/sweetalert2@10",
          type: "text/javascript",
          defer: true,
        },
      ],
      link: [
        {
          rel: "stylesheet",
          href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css",
        },
        {
          rel: "stylesheet",
          href: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css",
          crossorigin: "anonymous",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap",
        },
        {
          rel: "icon",
          type: "image/png",
          href: "/images/favicon.png",
        },
      ],
    },
  },

  css: ["~/assets/css/styles.scss"],

  googleFonts: {
    families: {
      Montserrat: [300, 400, 500, 600, 700],
    },
    display: "swap",
    prefetch: true,
    preconnect: true,
    preload: true,
    download: false,
  },

  runtimeConfig: {
    public: {
      apiUrl: APIURL,
      googleClientId:
        "1083167078252-ahld76fsgas145iv3790f2e6493ud3rk.apps.googleusercontent.com",
      telegramBotUsername: "bm8login_bot",
      telegramBotId: "8553763158",
    },
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  modules: [
    "@nuxtjs/google-fonts",
    "@nuxtjs/i18n",
    "@nuxt/image",
    "nuxt-marquee",
  ],

  i18n: {
    locales: [
      { code: "en", name: "English", iso: "en-MY", file: "en.json" },
      {
        code: "zh",
        name: "Chinese",
        iso: "zh-MY",
        file: "zh.json",
      },
      {
        code: "ms",
        name: "Bahasa Melayu",
        iso: "ms-MY",
        file: "ms.json",
      },
    ],
    defaultLocale: "en",
    langDir: "../locales/",
    lazy: false,
    detectBrowserLanguage: false,
    strategy: "prefix_except_default",
  },

  compatibilityDate: "2025-03-14",
});
