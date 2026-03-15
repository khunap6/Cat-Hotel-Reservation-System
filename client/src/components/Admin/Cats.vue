<template>
  <div class="space-y-8">

    <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">แมวในระบบ</h1>
        <p class="text-slate-500 font-medium mt-1">รายชื่อแมวทั้งหมดของลูกค้า</p>
      </div>
      <div class="relative">
        <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base">search</span>
        <input v-model="search" placeholder="ค้นหาชื่อแมวหรือเจ้าของ..."
          class="pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-full text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 w-64" />
      </div>
    </div>

    <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
      <div v-for="i in 8" :key="i" class="bg-white rounded-2xl h-64 animate-pulse border border-primary/10"></div>
    </div>

    <div v-else-if="filtered.length === 0"
      class="bg-white rounded-2xl border border-primary/10 card-shadow p-16 text-center">
      <span class="material-symbols-outlined text-6xl text-slate-200">pets</span>
      <p class="text-slate-400 font-semibold mt-4">ไม่พบแมวในระบบ</p>
    </div>

    <div v-else class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
      <div v-for="cat in filtered" :key="cat.id"
        class="bg-white rounded-2xl border border-primary/10 card-shadow overflow-hidden group">

        <div class="aspect-square overflow-hidden bg-slate-100 relative">
          <img v-if="cat.imageUrl" :src="cat.imageUrl" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
          <div v-else class="w-full h-full flex items-center justify-center">
            <span class="material-symbols-outlined text-6xl text-slate-200">pets</span>
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
        </div>

        <div class="p-4">
          <h3 class="font-extrabold text-slate-900">{{ cat.name }}</h3>
          <p class="text-xs text-slate-400 font-semibold mt-0.5">{{ cat.breed }} · {{ cat.gender === 'male' ? '♂' : cat.gender === 'female' ? '♀' : '' }} {{ cat.age ? cat.age+'ปี' : '' }}</p>

          <!-- Owner -->
          <div class="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
            <div class="size-7 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              {{ initials(cat.user?.name) }}
            </div>
            <p class="text-xs font-semibold text-slate-500 truncate">{{ cat.user?.name || '—' }}</p>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Api from '../../services/Api'

const cats = ref([])
const loading = ref(true)
const search = ref('')

const filtered = computed(() => {
  if (!search.value) return cats.value
  const s = search.value.toLowerCase()
  return cats.value.filter(c => c.name?.toLowerCase().includes(s) || c.user?.name?.toLowerCase().includes(s))
})

function initials(name) {
  return (name||'?').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
}

onMounted(async () => {
  try { const res = await Api().get('admin/cats'); cats.value = res.data }
  catch(e) { console.error(e) }
  finally { loading.value = false }
})
</script>
