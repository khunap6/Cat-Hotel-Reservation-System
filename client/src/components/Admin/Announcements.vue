<template>
  <div class="space-y-8">

    <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">ประกาศ</h1>
        <p class="text-slate-500 font-medium mt-1">จัดการประกาศและข้อมูลสำหรับลูกค้า</p>
      </div>
      <button @click="openCreate"
        class="px-6 py-3 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:brightness-110 transition flex items-center gap-2 w-fit">
        <span class="material-symbols-outlined">add</span> สร้างประกาศ
      </button>
    </div>

    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="bg-white rounded-2xl h-28 animate-pulse border border-primary/10"></div>
    </div>

    <div v-else-if="announcements.length === 0"
      class="bg-white rounded-2xl border border-primary/10 card-shadow p-16 text-center">
      <span class="material-symbols-outlined text-6xl text-slate-200">campaign</span>
      <p class="text-slate-400 font-semibold mt-4">ยังไม่มีประกาศ</p>
    </div>

    <div v-else class="space-y-4">
      <div v-for="a in announcements" :key="a.id"
        class="bg-white rounded-2xl border border-primary/10 card-shadow p-6 flex gap-5">

        <!-- Type icon -->
        <div class="size-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          :class="typeIconBg(a.type)">
          <span class="material-symbols-outlined" :class="typeIconColor(a.type)">{{ typeIcon(a.type) }}</span>
        </div>

        <div class="flex-1">
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-bold px-2.5 py-0.5 rounded-full" :class="typeBadge(a.type)">{{ a.type }}</span>
                <span v-if="!a.isActive" class="text-xs font-bold px-2.5 py-0.5 bg-slate-100 text-slate-400 rounded-full">ซ่อนอยู่</span>
              </div>
              <h3 class="font-extrabold text-slate-900">{{ a.title }}</h3>
              <p class="text-sm text-slate-500 mt-1 line-clamp-2">{{ a.content }}</p>
              <p class="text-xs text-slate-400 mt-2">{{ fmt(a.createdAt) }}</p>
            </div>
            <div class="flex gap-2 flex-shrink-0">
              <button @click="openEdit(a)"
                class="size-9 rounded-full bg-slate-100 hover:bg-primary hover:text-white text-slate-500 flex items-center justify-center transition">
                <span class="material-symbols-outlined text-base">edit</span>
              </button>
              <button @click="deleteAnnouncement(a)"
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
          <h2 class="text-xl font-extrabold text-slate-900">{{ mode === 'create' ? 'สร้างประกาศ' : 'แก้ไขประกาศ' }}</h2>
          <button @click="modalOpen = false" class="size-9 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200">
            <span class="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        <div class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1.5">หัวข้อ *</label>
            <input v-model="form.title" placeholder="หัวข้อประกาศ..."
              class="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm font-semibold border-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1.5">ประเภท</label>
            <select v-model="form.type"
              class="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm font-semibold border-none focus:ring-2 focus:ring-primary/20">
              <option value="info">Info (ทั่วไป)</option>
              <option value="promotion">Promotion</option>
              <option value="alert">Alert (แจ้งเตือน)</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1.5">เนื้อหา *</label>
            <textarea v-model="form.content" rows="4" placeholder="เนื้อหาประกาศ..."
              class="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm font-semibold border-none focus:ring-2 focus:ring-primary/20 resize-none"></textarea>
          </div>
          <div class="flex items-center gap-3">
            <button
              class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none"
              :class="form.isActive ? 'bg-primary' : 'bg-slate-200'"
              @click="form.isActive = !form.isActive">
              <span class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                :class="form.isActive ? 'translate-x-5' : 'translate-x-0'"></span>
            </button>
            <span class="text-sm font-bold text-slate-600">{{ form.isActive ? 'แสดงต่อลูกค้า' : 'ซ่อน' }}</span>
          </div>

          <div v-if="formError" class="bg-red-50 text-red-600 rounded-xl px-4 py-2 text-sm font-semibold">{{ formError }}</div>

          <button @click="onSubmit"
            class="w-full py-3.5 bg-primary text-white rounded-full font-bold hover:brightness-110 transition">
            {{ mode === 'create' ? 'สร้างประกาศ' : 'บันทึกการแก้ไข' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AnnouncementService from '../../services/AnnouncementsService'

const announcements = ref([])
const loading = ref(true)
const modalOpen = ref(false)
const mode = ref('create')
const editingId = ref(null)
const formError = ref('')

const form = ref({ title:'', type:'info', content:'', isActive:true })

function resetForm() { form.value = { title:'', type:'info', content:'', isActive:true }; formError.value = '' }
function openCreate() { mode.value='create'; editingId.value=null; resetForm(); modalOpen.value=true }
function openEdit(a) {
  mode.value='edit'; editingId.value=a.id
  form.value = { title:a.title, type:a.type, content:a.content, isActive:a.isActive }
  formError.value=''; modalOpen.value=true
}

function fmt(d) { return new Date(d).toLocaleDateString('th-TH', { day:'numeric', month:'short', year:'numeric' }) }
function typeIcon(t) { return { info:'info', promotion:'sell', alert:'warning' }[t] || 'campaign' }
function typeIconBg(t) { return { info:'bg-blue-50', promotion:'bg-green-50', alert:'bg-red-50' }[t] || 'bg-slate-100' }
function typeIconColor(t) { return { info:'text-blue-500', promotion:'text-green-500', alert:'text-red-500' }[t] || 'text-slate-500' }
function typeBadge(t) { return { info:'bg-blue-50 text-blue-600', promotion:'bg-green-50 text-green-600', alert:'bg-red-50 text-red-500' }[t] || 'bg-slate-100 text-slate-500' }

async function onSubmit() {
  formError.value = ''
  if (!form.value.title || !form.value.content) { formError.value = 'กรุณากรอกหัวข้อและเนื้อหา'; return }
  try {
    if (mode.value === 'create') {
      const res = await AnnouncementService.create(form.value); announcements.value.unshift(res.data)
    } else {
      const res = await AnnouncementService.update(editingId.value, form.value)
      const idx = announcements.value.findIndex(a => a.id === editingId.value)
      if (idx !== -1) announcements.value[idx] = res.data
    }
    modalOpen.value = false
  } catch(e) { formError.value = e?.response?.data?.error || 'เกิดข้อผิดพลาด' }
}

async function deleteAnnouncement(a) {
  if (!confirm(`ลบประกาศ "${a.title}" ?`)) return
  try { await AnnouncementService.delete(a.id); announcements.value = announcements.value.filter(x => x.id !== a.id) }
  catch(e) { alert(e?.response?.data?.error || 'Error') }
}

onMounted(async () => {
  try { const res = await AnnouncementService.list(); announcements.value = res.data }
  catch(e) { console.error(e) }
  finally { loading.value = false }
})
</script>
