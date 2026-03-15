<template>
  <div class="space-y-8">

    <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">การจองทั้งหมด</h1>
        <p class="text-slate-500 font-medium mt-1">จัดการและติดตามสถานะการจองทุกรายการ</p>
      </div>
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
        <span v-if="countByStatus(tab.key) > 0" class="ml-1.5 text-xs opacity-70">({{ countByStatus(tab.key) }})</span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 4" :key="i" class="bg-white rounded-2xl h-24 animate-pulse border border-primary/10"></div>
    </div>

    <!-- Empty -->
    <div v-else-if="filtered.length === 0"
      class="bg-white rounded-2xl border border-primary/10 card-shadow p-16 text-center">
      <span class="material-symbols-outlined text-6xl text-slate-200">event_busy</span>
      <p class="text-slate-400 font-semibold mt-4">ไม่มีรายการในหมวดนี้</p>
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-2xl border border-primary/10 card-shadow overflow-hidden">
      <table class="w-full">
        <thead class="bg-slate-50 border-b border-slate-100">
          <tr>
            <th class="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">#</th>
            <th class="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ลูกค้า / แมว</th>
            <th class="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ห้อง</th>
            <th class="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">วันที่</th>
            <th class="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ราคา</th>
            <th class="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">สถานะ</th>
            <th class="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr v-for="r in filtered" :key="r.id" class="hover:bg-slate-50/50 transition">
            <td class="px-6 py-4 text-sm font-bold text-slate-400">#{{ r.id }}</td>
            <td class="px-6 py-4">
              <p class="font-bold text-slate-900 text-sm">{{ r.customer?.name }}</p>
              <p class="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <span class="material-symbols-outlined text-xs">pets</span>
                {{ r.cat?.name }} ({{ r.cat?.breed }})
              </p>
            </td>
            <td class="px-6 py-4">
              <p class="font-semibold text-slate-800 text-sm">{{ r.room?.name }}</p>
              <p class="text-xs text-slate-400">{{ r.room?.type }}</p>
            </td>
            <td class="px-6 py-4">
              <p class="text-sm font-semibold text-slate-700">{{ fmt(r.checkIn) }}</p>
              <p class="text-xs text-slate-400">→ {{ fmt(r.checkOut) }}</p>
            </td>
            <td class="px-6 py-4">
              <p class="font-bold text-primary text-sm">฿{{ calcTotal(r) }}</p>
            </td>
            <td class="px-6 py-4">
              <span class="text-xs font-bold px-3 py-1.5 rounded-full" :class="statusClass(r.status)">
                {{ statusLabel(r.status) }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex gap-2">
                <!-- Pending: approve / reject -->
                <template v-if="r.status === 'pending'">
                  <button @click="approve(r)"
                    class="px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-xs font-bold hover:bg-green-500 hover:text-white transition">
                    อนุมัติ
                  </button>
                  <button @click="openReject(r)"
                    class="px-3 py-1.5 bg-red-50 text-red-500 rounded-full text-xs font-bold hover:bg-red-500 hover:text-white transition">
                    ปฏิเสธ
                  </button>
                </template>
                <!-- Approved: check-in -->
                <template v-else-if="r.status === 'approved'">
                  <button @click="setStatus(r, 'checked_in')"
                    class="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold hover:bg-blue-500 hover:text-white transition">
                    เช็คอิน
                  </button>
                </template>
                <!-- Checked in: complete -->
                <template v-else-if="r.status === 'checked_in'">
                  <button @click="setStatus(r, 'completed')"
                    class="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-bold hover:bg-slate-500 hover:text-white transition">
                    เสร็จสิ้น
                  </button>
                </template>
                <span v-else class="text-xs text-slate-300 font-semibold">—</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Reject modal -->
    <div v-if="rejectModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40" @click="rejectModal = false"></div>
      <div class="relative bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl space-y-5">
        <h3 class="font-extrabold text-xl text-slate-900">ปฏิเสธการจอง</h3>
        <p class="text-slate-500 text-sm">กรุณาระบุเหตุผล (ไม่บังคับ)</p>
        <textarea v-model="rejectNote" rows="3" placeholder="ระบุเหตุผล..."
          class="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm border-none focus:ring-2 focus:ring-red-300 resize-none"></textarea>
        <div class="flex gap-3">
          <button @click="confirmReject"
            class="flex-1 py-3 bg-red-500 text-white rounded-full font-bold hover:bg-red-600 transition">
            ยืนยันปฏิเสธ
          </button>
          <button @click="rejectModal = false"
            class="flex-1 py-3 bg-slate-100 text-slate-700 rounded-full font-bold hover:bg-slate-200 transition">
            ยกเลิก
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
const rejectModal = ref(false)
const rejectNote = ref('')
const rejectTarget = ref(null)

const tabs = [
  { key:'all', label:'ทั้งหมด' },
  { key:'pending', label:'รอยืนยัน' },
  { key:'approved', label:'อนุมัติแล้ว' },
  { key:'checked_in', label:'กำลังเข้าพัก' },
  { key:'completed', label:'เสร็จสิ้น' },
  { key:'rejected', label:'ปฏิเสธ' },
  { key:'cancelled', label:'ยกเลิก' },
]

const filtered = computed(() =>
  activeTab.value === 'all' ? reservations.value
    : reservations.value.filter(r => r.status === activeTab.value)
)

function countByStatus(key) {
  if (key === 'all') return reservations.value.length
  return reservations.value.filter(r => r.status === key).length
}

function fmt(d) { return new Date(d).toLocaleDateString('th-TH', { day:'numeric', month:'short', year:'2-digit' }) }

function calcTotal(r) {
  if (!r.room?.pricePerNight || !r.checkIn || !r.checkOut) return '—'
  const n = Math.max(1, Math.ceil((new Date(r.checkOut) - new Date(r.checkIn)) / 86400000))
  return (r.room.pricePerNight * n).toLocaleString()
}

function statusLabel(s) {
  return { pending:'รอยืนยัน', approved:'อนุมัติแล้ว', rejected:'ปฏิเสธ', checked_in:'กำลังเข้าพัก', completed:'เสร็จสิ้น', cancelled:'ยกเลิก' }[s] || s
}
function statusClass(s) {
  return { pending:'bg-yellow-50 text-yellow-600', approved:'bg-green-50 text-green-600', rejected:'bg-red-50 text-red-500', checked_in:'bg-blue-50 text-blue-600', completed:'bg-slate-100 text-slate-500', cancelled:'bg-red-50 text-red-400' }[s] || 'bg-slate-100 text-slate-500'
}

async function approve(r) {
  try { await ReservationService.approve(r.id); r.status = 'approved' }
  catch(e) { alert(e?.response?.data?.error || 'Error') }
}
function openReject(r) { rejectTarget.value = r; rejectNote.value = ''; rejectModal.value = true }
async function confirmReject() {
  try { await ReservationService.reject(rejectTarget.value.id, rejectNote.value); rejectTarget.value.status = 'rejected'; rejectTarget.value.adminNote = rejectNote.value }
  catch(e) { alert(e?.response?.data?.error || 'Error') }
  finally { rejectModal.value = false }
}
async function setStatus(r, status) {
  try { await ReservationService.setStatus(r.id, status); r.status = status }
  catch(e) { alert(e?.response?.data?.error || 'Error') }
}

onMounted(async () => {
  try { const res = await ReservationService.all(); reservations.value = res.data }
  catch(e) { console.error(e) }
  finally { loading.value = false }
})
</script>
