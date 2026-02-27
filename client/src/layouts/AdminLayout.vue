<template>
  <div class="min-h-screen bg-background-light">
    <div class="flex min-h-screen">
      <aside class="w-72 bg-white border-r border-primary/10 flex flex-col justify-between p-6 sticky top-0 h-screen">
        <div class="flex flex-col gap-6">
          <div class="flex items-center gap-3 px-2">
            <div class="size-10 bg-secondary rounded-full flex items-center justify-center text-primary">
              <span class="material-symbols-outlined text-3xl">pets</span>
            </div>
            <div>
              <h1 class="text-lg font-bold leading-none text-primary">The Cat Hotel</h1>
              <p class="text-xs text-[#646f87] mt-1 uppercase tracking-widest font-semibold">Admin Portal</p>
            </div>
          </div>

          <nav class="flex flex-col gap-2">
            <RouterLink class="navlink" to="/admin">Dashboard</RouterLink>
            <RouterLink class="navlink" to="/admin/reservations">Reservations</RouterLink>
            <RouterLink class="navlink" to="/admin/customers">Customers</RouterLink>
            <RouterLink class="navlink" to="/admin/cats">Cats</RouterLink>
            <RouterLink class="navlink" to="/admin/rooms">Rooms</RouterLink>
            <RouterLink class="navlink" to="/admin/announcements">Announcements</RouterLink>
          </nav>
        </div>

        <button class="w-full h-12 bg-primary text-white rounded-full font-bold shadow-lg shadow-primary/30"
                @click="logout">
          Logout
        </button>
      </aside>

      <main class="flex-1 overflow-y-auto">
        <header class="h-20 bg-white/80 backdrop-blur-md border-b border-primary/10 px-10 flex items-center justify-between sticky top-0 z-10">
          <div class="text-sm font-bold text-slate-700">Admin</div>
          <div class="text-sm text-slate-500">{{ userLabel }}</div>
        </header>

        <div class="p-10">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthenStore } from '../stores/authen'

const router = useRouter()
const auth = useAuthenStore()

const userLabel = computed(() => auth.user?.email || auth.user?.name || '—')

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.navlink {
  @apply flex items-center gap-3 px-4 py-3 rounded-full text-[#646f87] hover:bg-neutral-soft transition-all text-sm font-semibold;
}
.router-link-active.navlink {
  @apply bg-primary text-white;
}
</style>