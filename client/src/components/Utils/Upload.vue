<template>
  <div>
    <!-- SELECT -->
    <div v-if="!image">
      <div class="dropbox">
        <input
          type="file"
          accept="image/*"
          class="input-file"
          @change="onFileChange"
        />
        <p>Select image</p>
      </div>
    </div>

    <!-- CROP -->
    <div v-else class="crop-wrapper">
      <Cropper
        ref="cropper"
        :src="image"
        :stencil-props="{ aspectRatio: 1 }"
        class="cropper"
      />

      <div class="actions">
        <!-- ✅ สำคัญมาก: type="button" กัน submit form -->
        <button type="button" @click.prevent="cancel">Cancel</button>

        <!-- ✅ สำคัญมาก: type="button" กัน submit form -->
        <button type="button" class="primary" @click.prevent="applyCrop">
          Apply
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { Cropper } from "vue-advanced-cropper"
import "vue-advanced-cropper/dist/style.css"

const image = ref(null)
const cropper = ref(null)

const emit = defineEmits(["uploaded"])

function onFileChange(e) {
  const file = e.target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (event) => {
    image.value = event.target.result
  }
  reader.readAsDataURL(file)

  // รีเซ็ตค่า input เพื่อให้เลือกไฟล์เดิมซ้ำได้
  e.target.value = ""
}

function cancel() {
  image.value = null
}

function applyCrop() {
  const c = cropper.value
  if (!c) return

  const result = c.getResult()
  const canvas = result?.canvas

  if (!canvas) {
    // ถ้ากดเร็วเกินตอนรูปยังไม่ ready จะไม่มี canvas
    return
  }

  canvas.toBlob(
    (blob) => {
      if (!blob) return

      const file = new File([blob], "cat.png", { type: "image/png" })

      // ✅ ส่งไฟล์ที่ crop แล้วกลับไปให้ MyCats.vue เพื่อ preview
      emit("uploaded", file)

      // ปิดโหมด crop
      image.value = null
    },
    "image/png",
    0.95
  )
}
</script>

<style scoped>
.dropbox {
  outline: 2px dashed #ccc;
  outline-offset: -10px;
  background: #fafafa;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  position: relative;
  border-radius: 16px;
}

.input-file {
  opacity: 0;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.crop-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cropper {
  height: 320px;
  border-radius: 16px;
  overflow: hidden;
}

.actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.actions button {
  padding: 10px 16px;
  border-radius: 999px;
  background: #eee;
  font-weight: 600;
}

.actions .primary {
  background: #4f46e5;
  color: white;
}
</style>