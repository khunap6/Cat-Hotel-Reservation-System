<template>
  <div class="min-h-screen bg-background-light">
    <div class="flex min-h-screen">
      <aside class="w-72 bg-white border-r border-primary/5 flex flex-col p-6 gap-6 sticky top-0 h-screen">
        <div class="flex items-center gap-3 px-2">
          <div class="size-10 bg-primary rounded-xl flex items-center justify-center text-white">
            <span class="material-symbols-outlined text-2xl">pets</span>
          </div>
          <h2 class="text-xl font-extrabold tracking-tight text-primary">The Cat Hotel</h2>
        </div>

        <nav class="flex flex-col gap-2 flex-1">
          <RouterLink class="navlink" to="/customer">Dashboard</RouterLink>
          <RouterLink class="navlink" to="/customer/cats">My Cats</RouterLink>
          <RouterLink class="navlink" to="/customer/booking">Room Booking</RouterLink>
          <RouterLink class="navlink" to="/customer/reservations">My Reservations</RouterLink>
          <RouterLink class="navlink" to="/customer/announcements">Announcements</RouterLink>
        </nav>

        <button class="w-full h-12 bg-primary text-white rounded-full font-bold shadow-lg shadow-primary/30"
                @click="logout">
          Logout
        </button>
      </aside>

      <main class="flex-1">
        <header class="h-20 bg-white/80 backdrop-blur-md border-b border-primary/5 flex items-center justify-between px-10 sticky top-0 z-10">
          <div class="text-sm font-bold text-slate-700">Customer</div>
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
  @apply flex items-center gap-3 px-4 py-3.5 rounded-full text-slate-500 hover:bg-powder-blue hover:text-primary transition-all font-semibold text-sm;
}
.router-link-active.navlink {
  @apply bg-primary text-white shadow-lg shadow-primary/20;
}
</style>