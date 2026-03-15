<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="flex items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">ห้องพัก</h1>
        <p class="text-slate-500 text-sm mt-0.5">จัดการห้องพักทั้งหมดในโรงแรม</p>
      </div>
      <button @click="openCreate"
        class="px-5 py-2.5 rounded-full bg-primary text-white font-bold shadow-md shadow-primary/25 hover:brightness-110 transition flex items-center gap-1.5 text-sm">
        <span class="material-symbols-outlined text-base">add</span> เพิ่มห้องพัก
      </button>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      <div v-for="i in 3" :key="i" class="bg-white rounded-2xl h-72 animate-pulse border border-slate-100"></div>
    </div>

    <!-- Empty state -->
    <div v-else-if="rooms.length === 0"
      class="bg-white rounded-2xl border border-slate-100 p-16 text-center card-shadow">
      <span class="material-symbols-outlined text-6xl text-slate-200">meeting_room</span>
      <p class="text-slate-400 font-semibold mt-4">ยังไม่มีห้องพัก</p>
      <button @click="openCreate"
        class="mt-4 px-5 py-2.5 bg-primary text-white rounded-full font-bold text-sm hover:brightness-110 transition">
        เพิ่มห้องแรก
      </button>
    </div>

    <!-- Room grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      <div v-for="room in rooms" :key="room.id"
        class="bg-white rounded-2xl border border-slate-100 card-shadow overflow-hidden group flex flex-col">

        <!-- Room image -->
        <div class="relative h-44 overflow-hidden flex-shrink-0 bg-slate-100">
          <img v-if="room.imageUrl" :src="room.imageUrl"
            class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
          <div v-else class="w-full h-full flex flex-col items-center justify-center gap-2"
            :class="typeGradient(room.type)">
            <span class="material-symbols-outlined text-white/30 text-6xl">meeting_room</span>
            <span class="text-white/40 text-xs font-bold uppercase tracking-widest">{{ room.type }}</span>
          </div>

          <!-- Type badge over image -->
          <div class="absolute top-3 left-3">
            <span class="text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm"
              :class="typeBadge(room.type)">
              {{ room.type }}
            </span>
          </div>

          <!-- Status badge -->
          <div class="absolute top-3 right-3">
            <span class="text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm"
              :class="statusBadge(room.status)">
              {{ statusLabel(room.status) }}
            </span>
          </div>

          <!-- Edit overlay on hover -->
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button @click="openEdit(room)"
              class="px-4 py-2 bg-white text-slate-800 rounded-full font-bold text-xs shadow-lg hover:bg-primary hover:text-white transition flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">edit</span> แก้ไข
            </button>
            <button @click="deleteRoom(room)"
              class="px-4 py-2 bg-white text-red-500 rounded-full font-bold text-xs shadow-lg hover:bg-red-500 hover:text-white transition flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">delete</span> ลบ
            </button>
          </div>
        </div>

        <!-- Room info -->
        <div class="p-4 flex flex-col flex-1">
          <div class="flex items-start justify-between gap-2 mb-2">
            <h3 class="font-extrabold text-slate-900">{{ room.name }}</h3>
            <p class="text-lg font-black text-primary flex-shrink-0">
              ฿{{ room.pricePerNight?.toLocaleString() }}<span class="text-xs font-semibold text-slate-400">/คืน</span>
            </p>
          </div>

          <p class="text-xs text-slate-500 leading-relaxed flex-1">
            {{ room.description || 'ยังไม่มีคำอธิบาย' }}
          </p>

          <div class="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
            <span class="flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-bold">
              <span class="material-symbols-outlined text-xs">pets</span> {{ room.capacityCats }} ตัว
            </span>
            <div class="flex-1"></div>
            <button @click="openEdit(room)"
              class="size-8 rounded-full bg-slate-100 hover:bg-primary hover:text-white text-slate-500 flex items-center justify-center transition">
              <span class="material-symbols-outlined text-sm">edit</span>
            </button>
            <button @click="deleteRoom(room)"
              class="size-8 rounded-full bg-slate-100 hover:bg-red-500 hover:text-white text-slate-500 flex items-center justify-center transition">
              <span class="material-symbols-outlined text-sm">delete</span>
            </button>
          </div>
        </div>

      </div>
    </div>


    <!-- ============================================================
         MODAL: Add / Edit Room
         ============================================================ -->
    <Teleport to="body">
      <div v-if="modalOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
        @mousedown.self="modalOpen = false">

        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

        <div class="relative bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

          <!-- Modal header -->
          <div class="px-7 py-5 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
            <div>
              <h2 class="text-xl font-extrabold text-slate-900">{{ mode === 'create' ? 'เพิ่มห้องพักใหม่' : 'แก้ไขห้องพัก' }}</h2>
              <p class="text-xs text-slate-400 mt-0.5">กรอกข้อมูลและอัปโหลดรูปตัวอย่างห้อง</p>
            </div>
            <button @click="modalOpen = false"
              class="size-9 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition flex-shrink-0">
              <span class="material-symbols-outlined text-base">close</span>
            </button>
          </div>

          <!-- Modal body (scrollable) -->
          <div class="overflow-y-auto flex-1">
            <div class="p-7 space-y-6">

              <!-- ── IMAGE UPLOAD SECTION ── -->
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  รูปภาพห้องพัก
                </label>

                <!-- Current preview / drop zone -->
                <div class="relative">

                  <!-- Preview area -->
                  <div class="relative h-52 rounded-2xl overflow-hidden border-2 border-dashed transition"
                    :class="isDragging
                      ? 'border-primary bg-primary/5'
                      : form.imageUrl ? 'border-transparent' : 'border-slate-200 bg-slate-50'"
                    @dragover.prevent="isDragging = true"
                    @dragleave="isDragging = false"
                    @drop.prevent="onDrop">

                    <!-- Has image -->
                    <template v-if="form.imageUrl && !showCropper">
                      <img :src="form.imageUrl" class="w-full h-full object-cover" />
                      <div class="absolute inset-0 bg-black/0 hover:bg-black/30 transition flex items-center justify-center gap-2 opacity-0 hover:opacity-100 group">
                        <button type="button" @click="triggerFileInput"
                          class="px-4 py-2 bg-white text-slate-800 rounded-full font-bold text-xs shadow-lg hover:bg-primary hover:text-white transition">
                          <span class="material-symbols-outlined text-sm align-middle">photo_camera</span> เปลี่ยนรูป
                        </button>
                        <button type="button" @click="clearImage"
                          class="px-4 py-2 bg-white text-red-500 rounded-full font-bold text-xs shadow-lg hover:bg-red-500 hover:text-white transition">
                          <span class="material-symbols-outlined text-sm align-middle">delete</span> ลบรูป
                        </button>
                      </div>
                    </template>

                    <!-- Cropper active -->
                    <template v-else-if="showCropper">
                      <Cropper ref="cropperRef" :src="rawImageSrc"
                        :stencil-props="{ aspectRatio: 16/9 }"
                        class="w-full h-full" />
                    </template>

                    <!-- Empty drop zone -->
                    <template v-else>
                      <div class="absolute inset-0 flex flex-col items-center justify-center gap-3 cursor-pointer"
                        @click="triggerFileInput">
                        <div class="size-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                          <span class="material-symbols-outlined text-slate-400 text-3xl">photo_library</span>
                        </div>
                        <div class="text-center">
                          <p class="text-sm font-bold text-slate-600">คลิกเพื่อเลือกรูป หรือลากมาวาง</p>
                          <p class="text-xs text-slate-400 mt-0.5">PNG, JPG, WEBP · แนะนำ 16:9</p>
                        </div>
                      </div>
                    </template>

                  </div>

                  <!-- Cropper action buttons -->
                  <div v-if="showCropper" class="flex gap-3 mt-3">
                    <button type="button" @click="cancelCrop"
                      class="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-full font-bold text-sm hover:bg-slate-200 transition">
                      ยกเลิก
                    </button>
                    <button type="button" @click="applyCrop"
                      class="flex-1 py-2.5 bg-primary text-white rounded-full font-bold text-sm hover:brightness-110 transition">
                      <span class="material-symbols-outlined text-sm align-middle">crop</span> ครอบตัด & ใช้รูปนี้
                    </button>
                  </div>

                  <!-- Upload progress -->
                  <div v-if="uploading" class="mt-3 flex items-center gap-2 text-xs text-slate-500 font-semibold">
                    <svg class="animate-spin size-4 text-primary" viewBox="0 0 24 24" fill="none">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    กำลังอัปโหลดรูปภาพ...
                  </div>

                </div>

                <!-- Hidden file input -->
                <input ref="fileInputRef" type="file" accept="image/*" class="hidden" @change="onFileChange" />
              </div>

              <!-- ── ROOM DETAILS ── -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">ชื่อห้อง *</label>
                  <input v-model="form.name" placeholder="เช่น Deluxe Suite A"
                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">ประเภท *</label>
                  <select v-model="form.type"
                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition">
                    <option value="">-- เลือกประเภท --</option>
                    <option>Standard</option>
                    <option>Deluxe</option>
                    <option>VIP</option>
                    <option>Suite</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">ราคา / คืน (฿)</label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">฿</span>
                    <input v-model.number="form.pricePerNight" type="number" min="0"
                      class="w-full pl-8 pr-4 bg-slate-50 border border-slate-200 rounded-xl py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition" />
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">รองรับแมว (ตัว)</label>
                  <div class="flex items-center gap-2">
                    <button type="button" @click="form.capacityCats = Math.max(1, form.capacityCats - 1)"
                      class="size-10 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-600 flex items-center justify-center flex-shrink-0 transition">
                      <span class="material-symbols-outlined text-base">remove</span>
                    </button>
                    <input v-model.number="form.capacityCats" type="number" min="1"
                      class="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-primary/20 transition" />
                    <button type="button" @click="form.capacityCats++"
                      class="size-10 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-600 flex items-center justify-center flex-shrink-0 transition">
                      <span class="material-symbols-outlined text-base">add</span>
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">สถานะ</label>
                <div class="flex gap-3">
                  <label v-for="s in statuses" :key="s.value"
                    class="flex-1 flex items-center gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition"
                    :class="form.status === s.value
                      ? 'border-primary bg-primary/5'
                      : 'border-slate-200 hover:border-slate-300'">
                    <input type="radio" v-model="form.status" :value="s.value" class="hidden" />
                    <span class="size-3 rounded-full flex-shrink-0" :class="s.dot"></span>
                    <span class="text-xs font-bold" :class="form.status === s.value ? 'text-primary' : 'text-slate-600'">
                      {{ s.label }}
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">คำอธิบายห้อง</label>
                <textarea v-model="form.description" rows="3"
                  placeholder="อธิบายสิ่งอำนวยความสะดวก บรรยากาศ หรือจุดเด่นของห้องนี้..."
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition placeholder:text-slate-400"></textarea>
              </div>

              <!-- Error -->
              <div v-if="formError"
                class="flex items-center gap-2 bg-red-50 text-red-600 rounded-xl px-4 py-3 text-sm font-semibold">
                <span class="material-symbols-outlined text-base">error</span>
                {{ formError }}
              </div>

            </div>
          </div>

          <!-- Modal footer -->
          <div class="px-7 py-5 border-t border-slate-100 flex gap-3 flex-shrink-0 bg-white">
            <button type="button" @click="modalOpen = false"
              class="flex-1 py-3 bg-slate-100 text-slate-700 rounded-full font-bold hover:bg-slate-200 transition">
              ยกเลิก
            </button>
            <button type="button" @click="onSubmit" :disabled="submitting"
              class="flex-[2] py-3 bg-primary text-white rounded-full font-bold hover:brightness-110 transition shadow-lg shadow-primary/25 disabled:opacity-50 flex items-center justify-center gap-2">
              <svg v-if="submitting" class="animate-spin size-4" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              {{ submitting ? 'กำลังบันทึก...' : mode === 'create' ? '+ เพิ่มห้องพัก' : 'บันทึกการแก้ไข' }}
            </button>
          </div>

        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import RoomService from '../../services/RoomService'
import UploadService from '../../services/UploadService'

// ─── State ───────────────────────────────────────────────
const rooms      = ref([])
const loading    = ref(true)
const modalOpen  = ref(false)
const mode       = ref('create')
const editingId  = ref(null)
const formError  = ref('')
const submitting = ref(false)

// image states
const fileInputRef = ref(null)
const cropperRef   = ref(null)
const rawImageSrc  = ref('')
const showCropper  = ref(false)
const croppedFile  = ref(null)
const isDragging   = ref(false)
const uploading    = ref(false)

const form = ref({
  name: '', type: '', pricePerNight: 0, capacityCats: 1,
  description: '', status: 'available', imageUrl: ''
})

const statuses = [
  { value: 'available', label: 'ว่าง',         dot: 'bg-green-400' },
  { value: 'full',      label: 'เต็ม',          dot: 'bg-red-400'   },
  { value: 'maintenance', label: 'ปิดปรับปรุง', dot: 'bg-yellow-400' },
]

// ─── Helpers ─────────────────────────────────────────────
function typeGradient(t) {
  return {
    Standard: 'bg-gradient-to-br from-sky-400 to-sky-600',
    Deluxe:   'bg-gradient-to-br from-violet-400 to-violet-600',
    VIP:      'bg-gradient-to-br from-rose-400 to-rose-600',
    Suite:    'bg-gradient-to-br from-amber-400 to-amber-600',
  }[t] || 'bg-gradient-to-br from-slate-400 to-slate-600'
}
function typeBadge(t) {
  return {
    Standard: 'bg-sky-500/80 text-white',
    Deluxe:   'bg-violet-500/80 text-white',
    VIP:      'bg-rose-500/80 text-white',
    Suite:    'bg-amber-500/80 text-white',
  }[t] || 'bg-slate-500/80 text-white'
}
function statusBadge(s) {
  return {
    available:   'bg-green-500/80 text-white',
    full:        'bg-red-500/80 text-white',
    maintenance: 'bg-yellow-500/80 text-white',
  }[s] || 'bg-slate-400/80 text-white'
}
function statusLabel(s) {
  return { available: 'ว่าง', full: 'เต็ม', maintenance: 'ปิดปรับปรุง' }[s] || s
}

// ─── Modal open / close ───────────────────────────────────
function resetForm() {
  form.value = { name: '', type: '', pricePerNight: 0, capacityCats: 1, description: '', status: 'available', imageUrl: '' }
  formError.value = ''
  rawImageSrc.value = ''
  showCropper.value = false
  croppedFile.value = null
}
function openCreate() {
  mode.value = 'create'; editingId.value = null; resetForm(); modalOpen.value = true
}
function openEdit(room) {
  mode.value = 'edit'; editingId.value = room.id
  form.value = {
    name: room.name, type: room.type, pricePerNight: room.pricePerNight,
    capacityCats: room.capacityCats, description: room.description || '',
    status: room.status, imageUrl: room.imageUrl || ''
  }
  rawImageSrc.value = ''; showCropper.value = false; croppedFile.value = null
  formError.value = ''; modalOpen.value = true
}

// ─── File / Drag handling ─────────────────────────────────
function triggerFileInput() { fileInputRef.value?.click() }

function onFileChange(e) {
  const file = e.target.files?.[0]
  if (!file) return
  loadImageToString(file)
  e.target.value = ''
}

function onDrop(e) {
  isDragging.value = false
  const file = e.dataTransfer.files?.[0]
  if (!file || !file.type.startsWith('image/')) return
  loadImageToString(file)
}

function loadImageToString(file) {
  const reader = new FileReader()
  reader.onload = (ev) => {
    rawImageSrc.value = ev.target.result
    showCropper.value = true
  }
  reader.readAsDataURL(file)
}

function cancelCrop() {
  showCropper.value = false
  rawImageSrc.value = ''
}

function applyCrop() {
  const c = cropperRef.value
  if (!c) return
  const result = c.getResult()
  const canvas = result?.canvas
  if (!canvas) return
  canvas.toBlob((blob) => {
    if (!blob) return
    croppedFile.value = new File([blob], 'room.jpg', { type: 'image/jpeg' })
    // local preview
    const prev = URL.createObjectURL(croppedFile.value)
    form.value.imageUrl = prev
    showCropper.value = false
  }, 'image/jpeg', 0.92)
}

function clearImage() {
  form.value.imageUrl = ''
  croppedFile.value = null
  rawImageSrc.value = ''
  showCropper.value = false
}

// ─── Submit ───────────────────────────────────────────────
async function onSubmit() {
  formError.value = ''
  if (!form.value.name || !form.value.type) {
    formError.value = 'กรุณากรอกชื่อและประเภทห้อง'; return
  }

  submitting.value = true
  try {
    // upload image first if new file selected
    if (croppedFile.value) {
      uploading.value = true
      const fd = new FormData()
      fd.append('image', croppedFile.value)
      const up = await UploadService.upload(fd)
      form.value.imageUrl = up.data.url
      uploading.value = false
    }

    if (mode.value === 'create') {
      const res = await RoomService.create(form.value)
      rooms.value.unshift(res.data)
    } else {
      const res = await RoomService.update(editingId.value, form.value)
      const idx = rooms.value.findIndex(r => r.id === editingId.value)
      if (idx !== -1) rooms.value[idx] = res.data
    }
    modalOpen.value = false
  } catch(e) {
    formError.value = e?.response?.data?.error || 'เกิดข้อผิดพลาด กรุณาลองใหม่'
  } finally {
    submitting.value = false
    uploading.value = false
  }
}

// ─── Delete ───────────────────────────────────────────────
async function deleteRoom(room) {
  if (!confirm(`ลบห้อง "${room.name}" ?`)) return
  try {
    await RoomService.remove(room.id)
    rooms.value = rooms.value.filter(r => r.id !== room.id)
  } catch(e) { alert(e?.response?.data?.error || 'Error') }
}

// ─── Init ─────────────────────────────────────────────────
onMounted(async () => {
  try { const res = await RoomService.list(); rooms.value = res.data }
  catch(e) { console.error(e) }
  finally { loading.value = false }
})
</script>
