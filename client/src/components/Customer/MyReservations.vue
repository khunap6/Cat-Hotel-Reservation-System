<template>
  <div class="space-y-8">

    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">การจองของฉัน</h1>
        <p class="text-slate-500 font-medium mt-1">ติดตามสถานะการเข้าพักของแมวคุณ</p>
      </div>
      <RouterLink to="/customer/booking"
        class="px-6 py-3 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:brightness-110 transition flex items-center gap-2 w-fit">
        <span class="material-symbols-outlined">add</span> จองใหม่
      </RouterLink>
    </div>

    <!-- Filter tabs -->
    <div class="flex gap-2 flex-wrap">
      <button v-for="tab in tabs" :key="tab.key"
        class="px-4 py-2 rounded-full text-sm font-bold transition"
        :class="activeTab === tab.key
          ? 'bg-primary text-white shadow-md shadow-primary/25'
          : 'bg-white text-slate-500 border border-slate-200 hover:border-primary/30'"
        @click="activeTab = tab.key">
        {{ tab.label }}
        <span v-if="countByStatus(tab.key) > 0"
          class="ml-1.5 text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
          {{ countByStatus(tab.key) }}
        </span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="bg-white rounded-2xl p-6 border border-primary/10 animate-pulse h-32"></div>
    </div>

    <!-- Empty -->
    <div v-else-if="filtered.length === 0"
      class="bg-white rounded-2xl border border-primary/10 card-shadow p-16 text-center">
      <span class="material-symbols-outlined text-6xl text-slate-200">event_busy</span>
      <p class="text-slate-400 font-semibold mt-4 text-lg">ไม่มีการจองในหมวดนี้</p>
      <RouterLink to="/customer/booking"
        class="mt-5 inline-block px-6 py-3 bg-primary text-white rounded-full font-bold hover:brightness-110 transition text-sm">
        จองห้องพัก
      </RouterLink>
    </div>

    <!-- List -->
    <div v-else class="space-y-4">
      <div v-for="r in filtered" :key="r.id"
        class="bg-white rounded-2xl border border-primary/10 card-shadow overflow-hidden">

        <div class="p-6 flex flex-col md:flex-row md:items-start gap-5">

          <!-- Cat image -->
          <div class="size-20 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
            <img v-if="r.cat?.imageUrl" :src="r.cat.imageUrl" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center">
              <span class="material-symbols-outlined text-slate-300 text-3xl">pets</span>
            </div>
          </div>

          <div class="flex-1">
            <!-- Top row -->
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="font-extrabold text-slate-900 text-lg">{{ r.cat?.name }}</p>
                <p class="text-sm text-slate-500">{{ r.cat?.breed }}</p>
              </div>
              <span class="text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0"
                :class="statusClass(r.status)">
                {{ statusLabel(r.status) }}
              </span>
            </div>

            <!-- Details grid -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              <div class="bg-background-light rounded-xl p-3">
                <p class="text-xs text-slate-400 font-semibold mb-0.5">ห้องพัก</p>
                <p class="font-bold text-slate-800 text-sm">{{ r.room?.name }}</p>
              </div>
              <div class="bg-background-light rounded-xl p-3">
                <p class="text-xs text-slate-400 font-semibold mb-0.5">เช็คอิน</p>
                <p class="font-bold text-slate-800 text-sm">{{ formatDate(r.checkIn) }}</p>
              </div>
              <div class="bg-background-light rounded-xl p-3">
                <p class="text-xs text-slate-400 font-semibold mb-0.5">เช็คเอาท์</p>
                <p class="font-bold text-slate-800 text-sm">{{ formatDate(r.checkOut) }}</p>
              </div>
              <div class="bg-background-light rounded-xl p-3">
                <p class="text-xs text-slate-400 font-semibold mb-0.5">ราคารวม</p>
                <p class="font-bold text-primary text-sm">฿{{ calcTotal(r) }}</p>
              </div>
            </div>

            <!-- Notes -->
            <div v-if="r.customerNote || r.adminNote" class="mt-3 space-y-1">
              <p v-if="r.customerNote" class="text-xs text-slate-500">
                <span class="font-bold">หมายเหตุ:</span> {{ r.customerNote }}
              </p>
              <p v-if="r.adminNote" class="text-xs text-blue-600">
                <span class="font-bold">Admin:</span> {{ r.adminNote }}
              </p>
            </div>
          </div>

        </div>

        <!-- Actions footer -->
        <div v-if="canCancel(r.status)"
          class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            class="px-5 py-2 bg-red-50 text-red-500 rounded-full font-bold text-sm hover:bg-red-500 hover:text-white transition"
            @click="cancelReservation(r)">
            ยกเลิกการจอง
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ReservationService from '../../services/ReservationsService'

const reservations = ref([])
const loading = ref(true)
const activeTab = ref('all')

const tabs = [
  { key: 'all', label: 'ทั้งหมด' },
  { key: 'pending', label: 'รอยืนยัน' },
  { key: 'approved', label: 'อนุมัติแล้ว' },
  { key: 'checked_in', label: 'กำลังเข้าพัก' },
  { key: 'completed', label: 'เสร็จสิ้น' },
  { key: 'cancelled', label: 'ยกเลิก' },
]

const filtered = computed(() => {
  if (activeTab.value === 'all') return reservations.value
  return reservations.value.filter(r => r.status === activeTab.value)
})

function countByStatus(key) {
  if (key === 'all') return reservations.value.length
  return reservations.value.filter(r => r.status === key).length
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })
}

function calcTotal(r) {
  if (!r.room?.pricePerNight || !r.checkIn || !r.checkOut) return '—'
  const nights = Math.max(1, Math.ceil((new Date(r.checkOut) - new Date(r.checkIn)) / 86400000))
  return (r.room.pricePerNight * nights).toLocaleString()
}

function statusLabel(s) {
  return { pending:'รอยืนยัน', approved:'อนุมัติแล้ว', rejected:'ปฏิเสธ', checked_in:'กำลังเข้าพัก', completed:'เสร็จสิ้น', cancelled:'ยกเลิกแล้ว' }[s] || s
}

function statusClass(s) {
  return {
    pending: 'bg-yellow-50 text-yellow-600',
    approved: 'bg-green-50 text-green-600',
    rejected: 'bg-red-50 text-red-600',
    checked_in: 'bg-blue-50 text-blue-600',
    completed: 'bg-slate-100 text-slate-500',
    cancelled: 'bg-red-50 text-red-400',
  }[s] || 'bg-slate-100 text-slate-500'
}

function canCancel(s) {
  return ['pending', 'approved'].includes(s)
}

async function cancelReservation(r) {
  if (!confirm(`ยืนยันยกเลิกการจองสำหรับ "${r.cat?.name}"?`)) return
  try {
    await ReservationService.cancel(r.id)
    const found = reservations.value.find(x => x.id === r.id)
    if (found) found.status = 'cancelled'
  } catch (e) {
    alert(e?.response?.data?.error || 'เกิดข้อผิดพลาด')
  }
}

onMounted(async () => {
  try {
    const res = await ReservationService.my()
    reservations.value = res.data
  } catch (e) { console.error(e) } finally { loading.value = false }
})
</script>
