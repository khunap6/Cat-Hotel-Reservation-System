<template>
  <div class="space-y-8">

    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">My Cats</h1>
        <p class="text-slate-500 font-medium mt-1">
          Manage your cat profiles for faster booking.
        </p>
      </div>

      <button
        class="px-6 py-3 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:brightness-110 transition flex items-center gap-2"
        @click="openCreate">
        <span class="material-symbols-outlined">add</span>
        Add New Cat
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="bg-white rounded-2xl p-6 border border-primary/10 card-shadow">
      <p class="text-slate-500 font-semibold">Loading cats...</p>
    </div>

    <!-- List -->
    <div v-if="!loading && cats.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

      <div v-for="cat in cats" :key="cat.id"
        class="bg-white rounded-2xl border border-primary/10 overflow-hidden card-shadow group">

        <div class="relative aspect-square overflow-hidden bg-slate-100">

          <img v-if="cat.imageUrl" :src="cat.imageUrl"
            class="w-full h-full object-cover group-hover:scale-105 transition" />

          <div v-else class="w-full h-full flex items-center justify-center text-slate-400">
            <span class="material-symbols-outlined text-6xl">photo</span>
          </div>

          <button
            class="absolute top-4 right-4 size-11 rounded-full bg-white/90 border border-white flex items-center justify-center"
            @click="openEdit(cat)">
            <span class="material-symbols-outlined">edit</span>
          </button>

        </div>

        <div class="p-6">

          <h3 class="text-xl font-extrabold text-slate-900">
            {{ cat.name }}
          </h3>

          <p class="text-sm text-slate-500">
            {{ cat.breed }}
          </p>

          <div class="mt-4 flex gap-2">
            <button class="flex-1 px-4 py-2 bg-primary text-white rounded-full" @click="openEdit(cat)">
              Edit
            </button>

            <button class="flex-1 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600"
              @click="deleteCat(cat)">
              Delete
            </button>
          </div>

        </div>

      </div>
    </div>

    <!-- Modal -->
    <div v-if="modalOpen" class="fixed inset-0 z-[60] flex items-center justify-center p-4">

      <div class="absolute inset-0 bg-black/40" @click="closeModal"></div>

      <div class="relative w-full max-w-[720px] bg-white rounded-3xl shadow-2xl overflow-hidden">

        <div class="p-6 border-b flex justify-between">

          <h2 class="text-2xl font-bold">
            {{ mode === 'create' ? 'Add Cat' : 'Edit Cat' }}
          </h2>

          <button class="size-10 bg-slate-100 rounded-full flex items-center justify-center" @click="closeModal">
            <span class="material-symbols-outlined">close</span>
          </button>

        </div>

        <form class="p-6 space-y-4" @submit.prevent="onSubmit">

          <input v-model="form.name" placeholder="Name" class="w-full border rounded-lg px-4 py-2" />

          <input v-model="form.breed" placeholder="Breed" class="w-full border rounded-lg px-4 py-2" />

          <input v-model.number="form.age" type="number" placeholder="Age" class="w-full border rounded-lg px-4 py-2" />

          <select v-model="form.gender" class="w-full border rounded-lg px-4 py-2">
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <!-- Upload -->
          <Upload @uploaded="onUploaded" />

          <!-- Preview -->
          <img v-if="form.imageUrl" :src="form.imageUrl" class="w-full h-40 object-cover rounded-lg" />

          <textarea v-model="form.note" placeholder="Notes" class="w-full border rounded-lg px-4 py-2" />

          <button class="w-full bg-primary text-white py-2 rounded-lg">
            Save
          </button>

        </form>

      </div>
    </div>

  </div>
</template>

<script setup>

import { ref, onMounted } from "vue"
import CatService from "../../services/CatsService"
import UploadService from "../../services/UploadService"
import Upload from "../Utils/Upload.vue"

const cats = ref([])
const modalOpen = ref(false)
const mode = ref("create")
const editingId = ref(null)

const loading = ref(false)

// เก็บไฟล์ที่ crop
const croppedFile = ref(null)

const form = ref({
  name: "",
  breed: "",
  age: null,
  gender: "",
  note: "",
  imageUrl: ""
})

function resetForm() {
  form.value = {
    name: "",
    breed: "",
    age: null,
    gender: "",
    note: "",
    imageUrl: ""
  }

  croppedFile.value = null
}

function openCreate() {
  mode.value = "create"
  editingId.value = null
  resetForm()
  modalOpen.value = true
}

function openEdit(cat) {

  mode.value = "edit"
  editingId.value = cat.id

  form.value = {
    name: cat.name,
    breed: cat.breed,
    age: cat.age,
    gender: cat.gender,
    note: cat.note,
    imageUrl: cat.imageUrl
  }

  croppedFile.value = null

  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
}

// ตอน set preview ใหม่ ถ้าเคยสร้าง URL เดิมไว้ ให้ revoke ก่อน
let lastObjectUrl = null

function onUploaded(file) {
  croppedFile.value = file

  if (lastObjectUrl) URL.revokeObjectURL(lastObjectUrl)
  lastObjectUrl = URL.createObjectURL(file)

  form.value.imageUrl = lastObjectUrl
}

async function loadCats() {

  loading.value = true

  const res = await CatService.myCats()

  cats.value = res.data

  loading.value = false
}

async function onSubmit() {

  // ถ้ามีรูปใหม่
  if (croppedFile.value) {

    const formData = new FormData()
    formData.append("image", croppedFile.value)

    const res = await UploadService.upload(formData)

    form.value.imageUrl = res.data.url
  }

  if (mode.value === "create") {
    await CatService.create(form.value)
  } else {
    await CatService.update(editingId.value, form.value)
  }

  modalOpen.value = false

  await loadCats()

}

onMounted(loadCats)

</script>