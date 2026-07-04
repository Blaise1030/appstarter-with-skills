import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  nitro: {
    preset: 'cloudflare_module',
    cloudflare: {
      // Emulate staging bindings during local dev (`wrangler deploy --env staging` in CI)
      dev: { environment: 'staging' },
    },
  },

  css: ['~/assets/css/tailwind.css', 'vue-sonner/style.css'],

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        '@vueuse/core',
        'class-variance-authority',
        'clsx',
        'reka-ui',
        'tailwind-merge',
      ],
    },
  },

  build: {
    transpile: ['@appstarter/shared'],
  },

  modules: ['shadcn-nuxt', '@nuxt/eslint'],

  shadcn: {
    prefix: '',
    componentDir: '@/components/ui',
  },
})
