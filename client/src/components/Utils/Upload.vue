<template>
  <div class="dropbox">
    <input
      type="file"
      accept="image/*"
      class="input-file"
      @change="uploadFile"
    />

    <p v-if="status === 'initial'">
      Click or drag image here to upload
    </p>

    <p v-if="status === 'uploading'">
      Uploading...
    </p>

    <p v-if="status === 'success'">
      Upload success
    </p>

    <p v-if="status === 'error'">
      Upload failed
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue"
import UploadService from "../../services/UploadService"

const emit = defineEmits(["uploaded"])

const status = ref("initial")

async function uploadFile(e) {
  const file = e.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append("image", file)

  status.value = "uploading"

  try {
    const res = await UploadService.upload(formData)

    emit("uploaded", res.data)

    status.value = "success"
  } catch (err) {
    console.log(err)
    status.value = "error"
  }
}
</script>

<style scoped>
.dropbox {
  outline: 2px dashed #ccc;
  outline-offset: -10px;
  background: #fafafa;
  padding: 40px;
  text-align: center;
  border-radius: 16px;
  cursor: pointer;
  position: relative;
}

.input-file {
  position: absolute;
  inset: 0;
  opacity: 0;
}
</style>