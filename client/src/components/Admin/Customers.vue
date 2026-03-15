<template>
  <div class="space-y-8">

    <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">ลูกค้า</h1>
        <p class="text-slate-500 font-medium mt-1">รายชื่อลูกค้าทั้งหมดในระบบ</p>
      </div>
      <!-- Search -->
      <div class="relative">
        <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base">search</span>
        <input v-model="search" placeholder="ค้นหาชื่อหรืออีเมล..."
          class="pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-full text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 w-64" />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 5" :key="i" class="bg-white rounded-2xl h-16 animate-pulse border border-primary/10"></div>
    </div>

    <!-- Empty -->
    <div v-else-if="filtered.length === 0"
      class="bg-white rounded-2xl border border-primary/10 card-shadow p-16 text-center">
      <span class="material-symbols-outlined text-6xl text-slate-200">group_off</span>
      <p class="text-slate-400 font-semibold mt-4">ไม่พบลูกค้า</p>
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-2xl border border-primary/10 card-shadow overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
        <p class="text-sm font-bold text-slate-500">ทั้งหมด {{ filtered.length }} คน</p>
      </div>
      <table class="w-full">
        <thead class="bg-slate-50 border-b border-slate-100">
          <tr>
            <th class="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ลูกค้า</th>
            <th class="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">อีเมล</th>
            <th class="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">เบอร์โทร</th>
            <th class="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">สมัครเมื่อ</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr v-for="u in filtered" :key="u.id" class="hover:bg-slate-50/50 transition">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="size-10 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0">
                  {{ initials(u.name) }}
                </div>
                <p class="font-bold text-slate-900">{{ u.name }}</p>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-slate-600 font-medium">{{ u.email }}</td>
            <td class="px-6 py-4 text-sm text-slate-500 font-medium">{{ u.phone || '—' }}</td>
            <td class="px-6 py-4 text-sm text-slate-400 font-medium">{{ fmt(u.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Api from '../../services/Api'

const customers = ref([])
const loading = ref(true)
const search = ref('')

const filtered = computed(() => {
  if (!search.value) return customers.value
  const s = search.value.toLowerCase()
  return customers.value.filter(u => u.name?.toLowerCase().includes(s) || u.email?.toLowerCase().includes(s))
})

function initials(name) {
  return (name || '?').split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()
}
function fmt(d) {
  return new Date(d).toLocaleDateString('th-TH', { day:'numeric', month:'short', year:'numeric' })
}

onMounted(async () => {
  try { const res = await Api().get('admin/customers'); customers.value = res.data }
  catch(e) { console.error(e) }
  finally { loading.value = false }
})
</script>
