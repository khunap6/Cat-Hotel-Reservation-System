<template>
  <div class="min-h-screen bg-[#f5f7ff]">
    <div class="flex min-h-screen">

      <!-- Sidebar -->
      <aside class="w-56 bg-white border-r border-slate-100 flex flex-col py-5 px-3 sticky top-0 h-screen">

        <!-- Logo -->
        <div class="flex items-center gap-2.5 px-3 mb-6">
          <div class="size-8 bg-primary rounded-xl flex items-center justify-center text-white shadow-md shadow-primary/30">
            <span class="material-symbols-outlined text-lg">pets</span>
          </div>
          <div>
            <p class="font-extrabold text-sm text-slate-900 leading-none">The Cat Hotel</p>
            <p class="text-[9px] text-slate-400 font-semibold tracking-widest uppercase mt-0.5">Guest Portal</p>
          </div>
        </div>

        <!-- Nav -->
        <nav class="flex flex-col gap-0.5 flex-1">
          <RouterLink class="navlink" to="/customer/dashboard">
            <span class="material-symbols-outlined text-[18px]">dashboard</span>
            <span>Dashboard</span>
          </RouterLink>
          <RouterLink class="navlink" to="/customer/booking">
            <span class="material-symbols-outlined text-[18px]">hotel</span>
            <span>Bookings</span>
          </RouterLink>
          <RouterLink class="navlink" to="/customer/cats">
            <span class="material-symbols-outlined text-[18px]">pets</span>
            <span>My Cats</span>
          </RouterLink>
          <RouterLink class="navlink" to="/customer/reservations">
            <span class="material-symbols-outlined text-[18px]">event_note</span>
            <span>Reservations</span>
          </RouterLink>
          <RouterLink class="navlink" to="/customer/announcements">
            <span class="material-symbols-outlined text-[18px]">campaign</span>
            <span>Announcements</span>
          </RouterLink>
        </nav>

        <!-- Premium card -->
        <div class="mx-1 mb-4 bg-pink-50 rounded-2xl p-3 border border-pink-100">
          <p class="text-[10px] font-extrabold text-pink-500 uppercase tracking-wider mb-1">Premium Member</p>
          <p class="text-xs text-slate-600 font-medium mb-2">You have <span class="font-extrabold text-primary">1,240</span> PurrPoints available!</p>
          <button class="w-full py-1.5 bg-primary text-white rounded-full text-[10px] font-bold hover:brightness-110 transition">
            Redeem Rewards
          </button>
        </div>

        <!-- Logout -->
        <button
          class="mx-1 flex items-center gap-2 px-3 py-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition text-xs font-semibold"
          @click="logout">
          <span class="material-symbols-outlined text-[18px]">logout</span>
          Sign Out
        </button>
      </aside>

      <!-- Main -->
      <main class="flex-1 flex flex-col min-h-screen">

        <!-- Top header -->
        <header class="h-14 bg-white border-b border-slate-100 px-6 flex items-center justify-between sticky top-0 z-10">
          <!-- Search -->
          <div class="relative w-64">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
            <input placeholder="Search services, cats, or bookings..."
              class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400" />
          </div>

          <!-- Right -->
          <div class="flex items-center gap-3">
            <button class="relative size-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition">
              <span class="material-symbols-outlined text-slate-500 text-[18px]">notifications</span>
              <span class="absolute top-0.5 right-0.5 size-2 bg-red-400 rounded-full border border-white"></span>
            </button>

            <div class="flex items-center gap-2">
              <div class="text-right">
                <p class="text-xs font-extrabold text-slate-900 leading-none">{{ auth.user?.name }}</p>
                <p class="text-[10px] text-slate-400 font-medium mt-0.5">Premium Owner</p>
              </div>
              <div class="size-8 rounded-full bg-gradient-to-br from-pink-400 to-primary flex items-center justify-center text-white font-extrabold text-xs shadow-md">
                {{ initials }}
              </div>
            </div>
          </div>
        </header>

        <!-- Content -->
        <div class="flex-1 p-6">
          <RouterView />
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

const initials = computed(() => {
  const n = auth.user?.name || ''
  return n.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() || 'U'
})

function logout() { auth.logout(); router.push('/login') }
</script>

<style scoped>
.navlink {
  @apply flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 transition-all text-xs font-semibold;
}
.router-link-active.navlink {
  @apply bg-primary text-white shadow-md shadow-primary/20;
}
</style>
