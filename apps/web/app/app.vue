<script setup lang="ts">
import { appName } from '@appstarter/shared'
</script>

<template>
  <div class="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
    <NuxtRouteAnnouncer />
    <Toaster />
    <div class="flex flex-col items-center gap-2 text-center">
      <h1 class="text-2xl font-semibold tracking-tight">
        {{ appName }}
      </h1>
      <p class="text-muted-foreground text-sm">
        Nuxt monorepo with shadcn-vue
      </p>
    </div>
    <Button>
      Get started
    </Button>
  </div>
</template>
