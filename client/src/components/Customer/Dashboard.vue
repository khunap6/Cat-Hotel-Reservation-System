<template>
  <div class="space-y-6">

    <!-- Welcome header -->
    <div class="flex items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-slate-900">
          Welcome back, {{ auth.user?.name?.split(' ')[0] || 'there' }}! 👋
        </h1>
        <p class="text-slate-500 text-sm mt-0.5">
          <template v-if="activeCats.length > 0">
            {{ activeCats.map(c => c.cat?.name).join(' and ') }} {{ activeCats.length === 1 ? 'is' : 'are' }} looking forward to their next visit.
          </template>
          <template v-else>Manage your cats and reservations here.</template>
        </p>
      </div>
      <RouterLink to="/customer/cats"
        class="flex-shrink-0 px-4 py-2.5 bg-primary text-white rounded-full font-bold text-sm shadow-md shadow-primary/25 hover:brightness-110 transition flex items-center gap-1.5">
        <span class="material-symbols-outlined text-base">add</span> Add New Cat
      </RouterLink>
    </div>

    <!-- Stats bar -->
    <div class="grid grid-cols-3 gap-4">
      <div class="bg-white rounded-2xl p-4 border border-slate-100 card-shadow flex items-center gap-4">
        <div class="size-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
          <span class="material-symbols-outlined text-primary text-xl">hotel</span>
        </div>
        <div>
          <p class="text-xs text-slate-400 font-semibold uppercase tracking-wide">Current Stays</p>
          <p class="text-xl font-black text-slate-900">{{ counts.checkedIn }} Cat{{ counts.checkedIn !== 1 ? 's' : '' }}</p>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-4 border border-slate-100 card-shadow flex items-center gap-4">
        <div class="size-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
          <span class="material-symbols-outlined text-green-500 text-xl">event</span>
        </div>
        <div>
          <p class="text-xs text-slate-400 font-semibold uppercase tracking-wide">Next Check-In</p>
          <p class="text-xl font-black text-slate-900">{{ nextCheckIn }}</p>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-4 border border-slate-100 card-shadow flex items-center gap-4">
        <div class="size-10 rounded-xl bg-pink-50 flex items-center justify-center flex-shrink-0">
          <span class="material-symbols-outlined text-pink-500 text-xl">stars</span>
        </div>
        <div>
          <p class="text-xs text-slate-400 font-semibold uppercase tracking-wide">Total Bookings</p>
          <p class="text-xl font-black text-slate-900">{{ counts.total }}</p>
        </div>
      </div>
    </div>

    <!-- My Cats -->
    <div class="bg-white rounded-2xl border border-slate-100 card-shadow overflow-hidden">
      <div class="px-6 py-4 flex items-center justify-between border-b border-slate-50">
        <h2 class="font-extrabold text-slate-900">My Cats</h2>
        <RouterLink to="/customer/cats" class="text-xs text-primary font-bold hover:underline">
          Manage All Profiles
        </RouterLink>
      </div>

      <div class="p-5">
        <div v-if="loadingCats" class="flex gap-4">
          <div v-for="i in 2" :key="i" class="w-44 h-56 rounded-2xl bg-slate-100 animate-pulse flex-shrink-0"></div>
        </div>

        <div v-else class="flex gap-4 overflow-x-auto pb-1">
          <!-- Cat cards -->
          <div v-for="cat in cats" :key="cat.id"
            class="w-44 flex-shrink-0 rounded-2xl overflow-hidden border border-slate-100 bg-white shadow-sm group">
            <div class="relative h-36 overflow-hidden bg-slate-100">
              <img v-if="cat.imageUrl" :src="cat.imageUrl" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
              <div v-else class="w-full h-full flex items-center justify-center">
                <span class="material-symbols-outlined text-4xl text-slate-300">pets</span>
              </div>
              <!-- Status badge -->
              <div v-if="getCatStatus(cat)" class="absolute top-2 left-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  :class="getCatStatus(cat) === 'Currently Staying'
                    ? 'bg-primary text-white'
                    : 'bg-white/90 text-slate-600'">
                  {{ getCatStatus(cat) }}
                </span>
              </div>
              <button @click="$router.push('/customer/cats')"
                class="absolute top-2 right-2 size-7 bg-white/90 rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition">
                <span class="material-symbols-outlined text-xs text-slate-500">edit</span>
              </button>
            </div>
            <div class="p-3">
              <p class="font-extrabold text-slate-900 text-sm">{{ cat.name }}</p>
              <p class="text-xs text-slate-400">{{ cat.breed }}{{ cat.age ? ' · '+cat.age+'y' : '' }}</p>
              <div class="flex gap-1.5 mt-2.5">
                <RouterLink to="/customer/booking"
                  class="flex-1 py-1.5 bg-primary text-white rounded-full text-[10px] font-bold text-center hover:brightness-110 transition">
                  Book Stay
                </RouterLink>
                <RouterLink to="/customer/reservations"
                  class="size-7 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition flex-shrink-0">
                  <span class="material-symbols-outlined text-xs text-slate-500">history</span>
                </RouterLink>
              </div>
            </div>
          </div>

          <!-- Add new cat card -->
          <RouterLink to="/customer/cats"
            class="w-44 flex-shrink-0 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 p-4 hover:border-primary/40 hover:bg-primary/5 transition group cursor-pointer min-h-[220px]">
            <div class="size-10 rounded-full bg-slate-100 group-hover:bg-primary/10 flex items-center justify-center transition">
              <span class="material-symbols-outlined text-slate-400 group-hover:text-primary transition">add</span>
            </div>
            <p class="font-bold text-slate-500 group-hover:text-primary text-xs text-center transition">Add New Cat</p>
            <p class="text-slate-400 text-[10px] text-center leading-tight">Grow your fur family and get special multi-pet discounts!</p>
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Bottom row: Recent Updates + Refer a Friend -->
    <div class="grid grid-cols-5 gap-4">

      <!-- Recent Updates -->
      <div class="col-span-3 bg-white rounded-2xl border border-slate-100 card-shadow overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
          <h2 class="font-extrabold text-slate-900 text-sm">Recent Updates</h2>
          <RouterLink to="/customer/reservations" class="text-xs text-primary font-bold hover:underline">View all</RouterLink>
        </div>

        <div v-if="loadingRes" class="p-5 space-y-3">
          <div v-for="i in 2" :key="i" class="flex gap-3 items-center">
            <div class="size-8 rounded-full bg-slate-100 animate-pulse flex-shrink-0"></div>
            <div class="flex-1 h-4 bg-slate-100 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div v-else-if="reservations.length === 0" class="p-8 text-center">
          <span class="material-symbols-outlined text-4xl text-slate-200">event_busy</span>
          <p class="text-slate-400 text-xs font-semibold mt-2">No recent activity</p>
          <RouterLink to="/customer/booking"
            class="mt-3 inline-block text-xs text-primary font-bold hover:underline">Book a stay →</RouterLink>
        </div>

        <div v-else class="divide-y divide-slate-50">
          <div v-for="r in recentReservations" :key="r.id" class="px-5 py-3 flex items-center gap-3">
            <div class="size-8 rounded-full flex items-center justify-center flex-shrink-0"
              :class="statusIconBg(r.status)">
              <span class="material-symbols-outlined text-sm" :class="statusIconColor(r.status)">
                {{ statusIcon(r.status) }}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-bold text-slate-800 truncate">
                {{ statusUpdateText(r) }}
              </p>
              <p class="text-[10px] text-slate-400 mt-0.5">{{ fmtDate(r.updatedAt || r.createdAt) }}</p>
            </div>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0" :class="statusClass(r.status)">
              {{ statusLabel(r.status) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Refer a Friend -->
      <div class="col-span-2 bg-primary rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
        <div class="absolute right-0 bottom-0 text-white/10 text-[100px] leading-none select-none font-black">🐾</div>
        <div class="relative">
          <div class="size-9 bg-white/20 rounded-xl flex items-center justify-center mb-3">
            <span class="material-symbols-outlined text-white text-xl">share</span>
          </div>
          <h3 class="font-extrabold text-white text-base">Refer a Friend</h3>
          <p class="text-white/70 text-xs mt-1 leading-relaxed">
            Give $20 off their first stay and get $20 in PurrPoints for yourself!
          </p>
        </div>
        <button class="relative mt-4 w-full py-2.5 bg-white text-primary rounded-full font-bold text-xs shadow-md hover:bg-white/90 transition">
          Share Referral Code
        </button>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthenStore } from '../../stores/authen'
import ReservationService from '../../services/ReservationsService'
import CatService from '../../services/CatsService'

const auth = useAuthenStore()
const loading = ref(true)
const loadingRes = ref(true)
const loadingCats = ref(true)
const reservations = ref([])
const cats = ref([])

const recentReservations = computed(() => reservations.value.slice(0, 3))
const activeCats = computed(() => reservations.value.filter(r => r.status === 'checked_in'))

const counts = computed(() => ({
  total: reservations.value.length,
  checkedIn: reservations.value.filter(r => r.status === 'checked_in').length,
}))

const nextCheckIn = computed(() => {
  const upcoming = reservations.value
    .filter(r => ['pending','approved'].includes(r.status))
    .sort((a,b) => new Date(a.checkIn) - new Date(b.checkIn))
  if (!upcoming.length) return '—'
  const d = new Date(upcoming[0].checkIn)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
})

function getCatStatus(cat) {
  const active = reservations.value.find(r => r.catId === cat.id && r.status === 'checked_in')
  if (active) return 'Currently Staying'
  const upcoming = reservations.value.find(r => r.catId === cat.id && ['pending','approved'].includes(r.status))
  if (upcoming) return 'At Home'
  return null
}

function fmtDate(d) {
  if (!d) return ''
  const date = new Date(d)
  const now = new Date()
  const diffH = Math.floor((now - date) / 3600000)
  if (diffH < 1) return 'Just now'
  if (diffH < 24) return `Today at ${date.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' })}`
  return `Yesterday · ${date.toLocaleDateString('en-US', { month:'short', day:'numeric' })}`
}

function statusUpdateText(r) {
  const name = r.cat?.name || 'Your cat'
  if (r.status === 'checked_in') return `${name} has checked in to ${r.room?.name}`
  if (r.status === 'approved') return `Booking Approved & Confirmed for ${name}`
  if (r.status === 'pending') return `Booking Request Submitted for ${name}`
  if (r.status === 'completed') return `${name}'s stay completed`
  if (r.status === 'cancelled') return `Booking cancelled for ${name}`
  return `Booking update for ${name}`
}

function statusIcon(s) {
  return { pending:'schedule', approved:'check_circle', checked_in:'hotel', completed:'done_all', cancelled:'cancel', rejected:'cancel' }[s] || 'info'
}
function statusIconBg(s) {
  return { pending:'bg-yellow-50', approved:'bg-green-50', checked_in:'bg-blue-50', completed:'bg-slate-100', cancelled:'bg-red-50', rejected:'bg-red-50' }[s] || 'bg-slate-100'
}
function statusIconColor(s) {
  return { pending:'text-yellow-500', approved:'text-green-500', checked_in:'text-blue-500', completed:'text-slate-400', cancelled:'text-red-400', rejected:'text-red-400' }[s] || 'text-slate-400'
}
function statusLabel(s) {
  return { pending:'Pending', approved:'Approved', checked_in:'Staying', completed:'Done', cancelled:'Cancelled', rejected:'Rejected' }[s] || s
}
function statusClass(s) {
  return { pending:'bg-yellow-50 text-yellow-600', approved:'bg-green-50 text-green-600', checked_in:'bg-blue-50 text-blue-600', completed:'bg-slate-100 text-slate-500', cancelled:'bg-red-50 text-red-400', rejected:'bg-red-50 text-red-400' }[s] || 'bg-slate-100 text-slate-500'
}

onMounted(async () => {
  try {
    const [resRes, catRes] = await Promise.all([ReservationService.my(), CatService.myCats()])
    reservations.value = resRes.data
    cats.value = catRes.data
  } catch (e) { console.error(e) } finally {
    loading.value = false
    loadingRes.value = false
    loadingCats.value = false
  }
})
</script>
