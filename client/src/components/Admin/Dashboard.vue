<template>
  <div class="space-y-5">

    <!-- Top stats row -->
    <div v-if="loading" class="grid grid-cols-4 gap-4">
      <div v-for="i in 4" :key="i" class="bg-white rounded-2xl h-24 animate-pulse border border-slate-100"></div>
    </div>

    <div v-else class="grid grid-cols-4 gap-4">

      <div class="bg-white rounded-2xl p-4 border border-slate-100 card-shadow">
        <div class="flex items-start justify-between mb-3">
          <div class="size-9 rounded-xl bg-blue-50 flex items-center justify-center">
            <span class="material-symbols-outlined text-primary text-[18px]">event_note</span>
          </div>
          <span class="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">+12%</span>
        </div>
        <p class="text-xs text-slate-400 font-semibold">Total Bookings</p>
        <p class="text-2xl font-black text-slate-900">{{ stats.totalReservations.toLocaleString() }}</p>
      </div>

      <div class="bg-white rounded-2xl p-4 border border-slate-100 card-shadow">
        <div class="flex items-start justify-between mb-3">
          <div class="size-9 rounded-xl bg-orange-50 flex items-center justify-center">
            <span class="material-symbols-outlined text-orange-400 text-[18px]">pending_actions</span>
          </div>
          <span v-if="stats.pendingReservations > 0"
            class="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Needs Action</span>
        </div>
        <p class="text-xs text-slate-400 font-semibold">Pending Approvals</p>
        <p class="text-2xl font-black text-slate-900">{{ stats.pendingReservations }}</p>
      </div>

      <div class="bg-white rounded-2xl p-4 border border-slate-100 card-shadow">
        <div class="flex items-start justify-between mb-3">
          <div class="size-9 rounded-xl bg-sky-50 flex items-center justify-center">
            <span class="material-symbols-outlined text-sky-400 text-[18px]">meeting_room</span>
          </div>
          <span class="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">Stable</span>
        </div>
        <p class="text-xs text-slate-400 font-semibold">Available Suites</p>
        <p class="text-2xl font-black text-slate-900">{{ stats.totalRooms.toString().padStart(2,'0') }}</p>
      </div>

      <div class="bg-white rounded-2xl p-4 border border-slate-100 card-shadow">
        <div class="flex items-start justify-between mb-3">
          <div class="size-9 rounded-xl bg-pink-50 flex items-center justify-center">
            <span class="material-symbols-outlined text-pink-400 text-[18px]">pets</span>
          </div>
          <span class="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">+5%</span>
        </div>
        <p class="text-xs text-slate-400 font-semibold">Checked-in Cats</p>
        <p class="text-2xl font-black text-slate-900">{{ stats.totalCats }}</p>
      </div>

    </div>

    <!-- Middle row: Active Reservations + Pending Approvals -->
    <div class="grid grid-cols-3 gap-4">

      <!-- Active Reservations table -->
      <div class="col-span-2 bg-white rounded-2xl border border-slate-100 card-shadow overflow-hidden">
        <div class="px-5 py-4 flex items-center justify-between border-b border-slate-50">
          <h2 class="font-extrabold text-slate-900 text-sm">Active Reservations</h2>
          <RouterLink to="/admin/reservations" class="text-xs text-primary font-bold hover:underline">View All</RouterLink>
        </div>

        <div v-if="loadingRes" class="p-5 space-y-3">
          <div v-for="i in 3" :key="i" class="flex gap-3 items-center">
            <div class="size-10 rounded-full bg-slate-100 animate-pulse flex-shrink-0"></div>
            <div class="flex-1 h-4 bg-slate-100 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div v-else-if="activeReservations.length === 0" class="p-10 text-center">
          <span class="material-symbols-outlined text-4xl text-slate-200">event_busy</span>
          <p class="text-xs text-slate-400 font-semibold mt-2">No active reservations</p>
        </div>

        <table v-else class="w-full">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-100">
              <th class="text-left px-5 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cat Guest</th>
              <th class="text-left px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Owner</th>
              <th class="text-left px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Room Type</th>
              <th class="text-left px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
              <th class="px-4 py-2.5"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="r in activeReservations" :key="r.id" class="hover:bg-slate-50/50 transition">
              <td class="px-5 py-3">
                <div class="flex items-center gap-2.5">
                  <div class="size-9 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                    <img v-if="r.cat?.imageUrl" :src="r.cat.imageUrl" class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full flex items-center justify-center">
                      <span class="material-symbols-outlined text-slate-300 text-sm">pets</span>
                    </div>
                  </div>
                  <div>
                    <p class="text-xs font-extrabold text-slate-900">{{ r.cat?.name }}</p>
                    <p class="text-[10px] text-slate-400">{{ r.status === 'checked_in' ? 'Checked in' : 'Due' }} · {{ fmtShort(r.checkIn) }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3">
                <p class="text-xs font-semibold text-slate-700">{{ r.customer?.name?.split(' ')[0] }}</p>
                <p class="text-[10px] text-slate-400">{{ r.customer?.name?.split(' ').slice(1).join(' ') }}</p>
              </td>
              <td class="px-4 py-3">
                <span class="text-[10px] font-bold px-2.5 py-1 rounded-full" :class="roomTypeBadge(r.room?.type)">
                  {{ r.room?.type || r.room?.name }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-1.5">
                  <span class="size-1.5 rounded-full" :class="r.status === 'checked_in' ? 'bg-green-400' : 'bg-yellow-400'"></span>
                  <span class="text-[10px] font-bold text-slate-600">{{ r.status === 'checked_in' ? 'In Suite' : 'Arriving' }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-right">
                <button class="size-6 rounded-full hover:bg-slate-100 flex items-center justify-center transition">
                  <span class="material-symbols-outlined text-slate-400 text-sm">more_vert</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Right column -->
      <div class="flex flex-col gap-4">

        <!-- Pending Approvals -->
        <div class="bg-white rounded-2xl border border-slate-100 card-shadow overflow-hidden flex-1">
          <div class="px-4 py-3.5 border-b border-slate-50">
            <h2 class="font-extrabold text-slate-900 text-sm">Pending Approvals</h2>
          </div>

          <div v-if="pendingReservations.length === 0" class="p-6 text-center">
            <span class="material-symbols-outlined text-3xl text-slate-200">check_circle</span>
            <p class="text-xs text-slate-400 font-semibold mt-1">All caught up!</p>
          </div>

          <div v-else class="divide-y divide-slate-50">
            <div v-for="r in pendingReservations.slice(0,3)" :key="r.id"
              class="px-4 py-3 flex items-center gap-3">
              <div class="size-9 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                <img v-if="r.cat?.imageUrl" :src="r.cat.imageUrl" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <span class="material-symbols-outlined text-slate-300 text-sm">pets</span>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-extrabold text-slate-900 truncate">{{ r.cat?.name }}</p>
                <p class="text-[10px] text-slate-400 truncate">{{ r.room?.type }} · {{ r.checkIn ? Math.max(1, Math.ceil((new Date(r.checkOut)-new Date(r.checkIn))/86400000)) : '?' }} nights</p>
              </div>
              <div class="flex gap-1 flex-shrink-0">
                <button @click="approve(r)"
                  class="size-7 rounded-full bg-green-50 hover:bg-green-500 text-green-500 hover:text-white flex items-center justify-center transition">
                  <span class="material-symbols-outlined text-sm">check</span>
                </button>
                <button @click="reject(r)"
                  class="size-7 rounded-full bg-red-50 hover:bg-red-500 text-red-400 hover:text-white flex items-center justify-center transition">
                  <span class="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            </div>
          </div>

          <div v-if="pendingReservations.length > 3" class="px-4 py-3 border-t border-slate-50">
            <RouterLink to="/admin/reservations" class="text-xs text-primary font-bold hover:underline">
              View {{ pendingReservations.length - 3 }} More Requests
            </RouterLink>
          </div>
        </div>

        <!-- Occupancy card -->
        <div class="bg-primary rounded-2xl p-4 relative overflow-hidden">
          <div class="absolute right-2 bottom-2 text-white/10 text-7xl leading-none select-none">🏨</div>
          <div class="relative">
            <p class="text-white/60 text-[10px] font-bold uppercase tracking-wider mb-1">Hotel Occupancy</p>
            <p class="text-4xl font-black text-white">{{ occupancyPct }}%</p>
            <p class="text-white/60 text-[10px] mt-1 font-semibold">Full capacity</p>
            <!-- Progress bar -->
            <div class="mt-3 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div class="h-full bg-white rounded-full transition-all" :style="`width:${occupancyPct}%`"></div>
            </div>
            <p class="text-white/50 text-[9px] mt-2 leading-relaxed">
              {{ stats.todayCheckIns }} check-outs expected today. {{ stats.pendingReservations }} suites require deep cleaning before new guests arrive.
            </p>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import StatsService from '../../services/StatsService'
import ReservationService from '../../services/ReservationsService'

const loading = ref(true)
const loadingRes = ref(true)
const stats = ref({ totalCustomers:0, totalCats:0, totalRooms:0, totalReservations:0, pendingReservations:0, todayCheckIns:0, totalRevenue:0 })
const reservations = ref([])

const activeReservations = computed(() =>
  reservations.value.filter(r => ['approved','checked_in'].includes(r.status)).slice(0,5)
)
const pendingReservations = computed(() =>
  reservations.value.filter(r => r.status === 'pending')
)
const occupancyPct = computed(() => {
  if (!stats.value.totalRooms) return 0
  return Math.round((stats.value.todayCheckIns / Math.max(1, stats.value.totalRooms)) * 100)
})

function fmtShort(d) {
  return new Date(d).toLocaleDateString('en-US', { month:'short', day:'numeric' })
}

function roomTypeBadge(t) {
  return { Standard:'bg-sky-50 text-sky-600', Deluxe:'bg-violet-50 text-violet-600', VIP:'bg-rose-50 text-rose-600', Suite:'bg-amber-50 text-amber-600' }[t] || 'bg-slate-100 text-slate-600'
}

async function approve(r) {
  try { await ReservationService.approve(r.id); r.status = 'approved' }
  catch(e) { alert(e?.response?.data?.error || 'Error') }
}
async function reject(r) {
  try { await ReservationService.reject(r.id); r.status = 'rejected' }
  catch(e) { alert(e?.response?.data?.error || 'Error') }
}

onMounted(async () => {
  try {
    const [s, res] = await Promise.all([StatsService.dashboard(), ReservationService.all()])
    stats.value = s.data
    reservations.value = res.data
  } catch(e) { console.error(e) } finally {
    loading.value = false
    loadingRes.value = false
  }
})
</script>
