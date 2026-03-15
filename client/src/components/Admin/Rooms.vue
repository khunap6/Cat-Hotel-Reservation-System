<template>
  <div class="space-y-8">

    <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">ห้องพัก</h1>
        <p class="text-slate-500 font-medium mt-1">จัดการห้องพักทั้งหมดในโรงแรม</p>
      </div>
      <button @click="openCreate"
        class="px-6 py-3 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:brightness-110 transition flex items-center gap-2 w-fit">
        <span class="material-symbols-outlined">add</span> เพิ่มห้องพัก
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      <div v-for="i in 3" :key="i" class="bg-white rounded-2xl h-52 animate-pulse border border-primary/10"></div>
    </div>

    <!-- Empty -->
    <div v-else-if="rooms.length === 0"
      class="bg-white rounded-2xl border border-primary/10 card-shadow p-16 text-center">
      <span class="material-symbols-outlined text-6xl text-slate-200">meeting_room</span>
      <p class="text-slate-400 font-semibold mt-4">ยังไม่มีห้องพัก</p>
    </div>

    <!-- Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      <div v-for="room in rooms" :key="room.id"
        class="bg-white rounded-2xl border border-primary/10 card-shadow overflow-hidden group">

        <!-- Color bar by type -->
        <div class="h-3" :class="typeBg(room.type)"></div>

        <div class="p-6">
          <div class="flex items-start justify-between gap-3 mb-3">
            <div>
              <h3 class="font-extrabold text-slate-900 text-lg">{{ room.name }}</h3>
              <p class="text-sm text-slate-500 mt-0.5">{{ room.description || '—' }}</p>
            </div>
            <span class="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
              :class="statusBadge(room.status)">
              {{ statusLabel(room.status) }}
            </span>
          </div>

          <div class="flex gap-3 flex-wrap mb-4">
            <span class="text-xs px-3 py-1 rounded-full font-bold" :class="typeBadge(room.type)">{{ room.type }}</span>
            <span class="text-xs px-3 py-1 bg-slate-100 text-slate-600 rounded-full font-bold">
              <span class="material-symbols-outlined text-xs">pets</span> {{ room.capacityCats }} ตัว
            </span>
          </div>

          <div class="flex items-center justify-between">
            <p class="text-2xl font-black text-primary">฿{{ room.pricePerNight?.toLocaleString() }}<span class="text-sm font-semibold text-slate-400">/คืน</span></p>
            <div class="flex gap-2">
              <button @click="openEdit(room)"
                class="size-9 rounded-full bg-slate-100 hover:bg-primary hover:text-white text-slate-500 flex items-center justify-center transition">
                <span class="material-symbols-outlined text-base">edit</span>
              </button>
              <button @click="deleteRoom(room)"
                class="size-9 rounded-full bg-slate-100 hover:bg-red-500 hover:text-white text-slate-500 flex items-center justify-center transition">
                <span class="material-symbols-outlined text-base">delete</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Modal -->
    <div v-if="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="modalOpen = false"></div>
      <div class="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">

        <div class="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 class="text-xl font-extrabold text-slate-900">{{ mode === 'create' ? 'เพิ่มห้องพัก' : 'แก้ไขห้องพัก' }}</h2>
          <button @click="modalOpen = false" class="size-9 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200">
            <span class="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        <div class="p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1.5">ชื่อห้อง *</label>
              <input v-model="form.name" placeholder="e.g. Deluxe Suite"
                class="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm font-semibold border-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1.5">ประเภท *</label>
              <select v-model="form.type"
                class="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm font-semibold border-none focus:ring-2 focus:ring-primary/20">
                <option value="">-- เลือก --</option>
                <option>Standard</option>
                <option>Deluxe</option>
                <option>VIP</option>
                <option>Suite</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1.5">ราคา / คืน (฿)</label>
              <input v-model.number="form.pricePerNight" type="number" min="0"
                class="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm font-semibold border-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1.5">รองรับแมว (ตัว)</label>
              <input v-model.number="form.capacityCats" type="number" min="1"
                class="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm font-semibold border-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1.5">สถานะ</label>
            <select v-model="form.status"
              class="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm font-semibold border-none focus:ring-2 focus:ring-primary/20">
              <option value="available">ว่าง</option>
              <option value="full">เต็ม</option>
              <option value="maintenance">ปิดปรับปรุง</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1.5">คำอธิบาย</label>
            <textarea v-model="form.description" rows="2" placeholder="รายละเอียดห้องพัก..."
              class="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm font-semibold border-none focus:ring-2 focus:ring-primary/20 resize-none"></textarea>
          </div>

          <div v-if="formError" class="bg-red-50 text-red-600 rounded-xl px-4 py-2 text-sm font-semibold">{{ formError }}</div>

          <button @click="onSubmit"
            class="w-full py-3.5 bg-primary text-white rounded-full font-bold hover:brightness-110 transition">
            {{ mode === 'create' ? 'เพิ่มห้องพัก' : 'บันทึกการแก้ไข' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import RoomService from '../../services/RoomService'

const rooms = ref([])
const loading = ref(true)
const modalOpen = ref(false)
const mode = ref('create')
const editingId = ref(null)
const formError = ref('')

const form = ref({ name:'', type:'', pricePerNight:0, capacityCats:1, description:'', status:'available' })

function resetForm() {
  form.value = { name:'', type:'', pricePerNight:0, capacityCats:1, description:'', status:'available' }
  formError.value = ''
}
function openCreate() { mode.value = 'create'; editingId.value = null; resetForm(); modalOpen.value = true }
function openEdit(room) {
  mode.value = 'edit'; editingId.value = room.id
  form.value = { name:room.name, type:room.type, pricePerNight:room.pricePerNight, capacityCats:room.capacityCats, description:room.description||'', status:room.status }
  formError.value = ''
  modalOpen.value = true
}

function typeBg(t) { return { Standard:'bg-sky-400', Deluxe:'bg-violet-400', VIP:'bg-rose-400', Suite:'bg-amber-400' }[t] || 'bg-slate-300' }
function typeBadge(t) { return { Standard:'bg-sky-50 text-sky-600', Deluxe:'bg-violet-50 text-violet-600', VIP:'bg-rose-50 text-rose-600', Suite:'bg-amber-50 text-amber-600' }[t] || 'bg-slate-100 text-slate-600' }
function statusBadge(s) { return { available:'bg-green-50 text-green-600', full:'bg-red-50 text-red-500', maintenance:'bg-yellow-50 text-yellow-600' }[s] || '' }
function statusLabel(s) { return { available:'ว่าง', full:'เต็ม', maintenance:'ปิดปรับปรุง' }[s] || s }

async function onSubmit() {
  formError.value = ''
  if (!form.value.name || !form.value.type) { formError.value = 'กรุณากรอกชื่อและประเภทห้อง'; return }
  try {
    if (mode.value === 'create') {
      const res = await RoomService.create(form.value); rooms.value.unshift(res.data)
    } else {
      const res = await RoomService.update(editingId.value, form.value)
      const idx = rooms.value.findIndex(r => r.id === editingId.value)
      if (idx !== -1) rooms.value[idx] = res.data
    }
    modalOpen.value = false
  } catch(e) { formError.value = e?.response?.data?.error || 'เกิดข้อผิดพลาด' }
}

async function deleteRoom(room) {
  if (!confirm(`ลบห้อง "${room.name}" ?`)) return
  try { await RoomService.remove(room.id); rooms.value = rooms.value.filter(r => r.id !== room.id) }
  catch(e) { alert(e?.response?.data?.error || 'Error') }
}

onMounted(async () => {
  try { const res = await RoomService.list(); rooms.value = res.data }
  catch(e) { console.error(e) }
  finally { loading.value = false }
})
</script>
