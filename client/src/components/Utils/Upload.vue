<template>
  <div class="dropbox">
    <input 
      type="file" 
      multiple 
      :name="uploadFieldName" 
      :disabled="isSaving" 
      @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"
      accept="image/*" 
      class="input-file">
      
    <p v-if="isInitial">
      Drag your file(s) here to begin<br> or click to browse
    </p>
    <p v-if="isSaving">
      Uploading {{ fileCount }} files...
    </p>
    <p v-if="isSuccess">
      Upload Successful.
    </p>
    <p v-if="isFailed">
      Upload Failed. {{ uploadError }}
    </p>
  </div>
</template>

<script>
import UploadService from '../../services/UploadService'

const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3

export default {
  name: 'Upload',
  data () {
    return {
      uploadedFiles: [],
      uploadError: null,
      currentStatus: null,
      uploadFieldName: 'image',
      fileCount: 0
    }
  },
  computed: {
    isInitial () { return this.currentStatus === STATUS_INITIAL },
    isSaving () { return this.currentStatus === STATUS_SAVING },
    isSuccess () { return this.currentStatus === STATUS_SUCCESS },
    isFailed () { return this.currentStatus === STATUS_FAILED }
  },
  methods: {
    reset () {
      this.currentStatus = STATUS_INITIAL
      this.uploadedFiles = []
      this.uploadError = null
    },
    async save (formData) {
      try {
        this.currentStatus = STATUS_SAVING
        const response = await UploadService.upload(formData)
        this.currentStatus = STATUS_SUCCESS
        // ส่งข้อมูลไฟล์กลับไปให้แม่ (Parent)
        this.$emit('uploaded', response.data)
        this.reset() // Reset สถานะหลังจาก Upload เสร็จ (อาจจะ Delay นิดหน่อยก็ได้)
      } catch (error) {
        console.log(error)
        this.uploadError = error.response ? error.response.data.error : error.message
        this.currentStatus = STATUS_FAILED
      }
    },
    filesChange (fieldName, fileList) {
      const formData = new FormData()
      if (!fileList.length) return
      
      // รองรับการเลือกหลายไฟล์ แต่ส่งทีละไฟล์หรือส่งเป็น Array ก็ได้ 
      // ในที่นี้เพื่อให้ง่ายต่อ Middleware ที่เราเขียนแบบ .single ไว้ เราจะ loop ส่งทีละไฟล์
      // หรือถ้า Backend รองรับ .array() ก็ส่งทีเดียวได้
      // เพื่อความเข้ากันได้กับบทที่ 12 เราจะวนลูปส่งทีละไฟล์
      Array.from(Array(fileList.length).keys()).map(x => {
        const singleFormData = new FormData()
        singleFormData.append(fieldName, fileList[x], fileList[x].name)
        this.save(singleFormData)
      })
    }
  },
  mounted () {
    this.reset()
  }
}
</script>

<style scoped>
.dropbox {
  outline: 2px dashed grey; /* the dash box */
  outline-offset: -10px;
  background: #fbfbfb;
  color: dimgray;
  padding: 10px 10px;
  min-height: 200px; /* minimum height */
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.input-file {
  opacity: 0; /* invisible but it's there! */
  width: 100%;
  height: 200px;
  position: absolute;
  cursor: pointer;
}

.dropbox:hover {
  background: #E0F7FA; /* when mouse over to the drop zone, change color */
}

.dropbox p {
  font-size: 1.2em;
  text-align: center;
  padding: 50px 0;
}
</style>