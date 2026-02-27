<template>
  <div class="container">
    <h1>Create Blog</h1>
    <form v-on:submit.prevent="createBlog">
      <div class="mb-3">
        <label class="form-label">Title:</label>
        <input type="text" v-model="blog.title" class="form-control" placeholder="Enter blog title">
      </div>

      <div class="mb-3">
        <label class="form-label">Upload Images:</label>
        <upload-image @uploaded="onUploaded"></upload-image>
      </div>

      <div class="mb-3">
        <label class="form-label">Thumbnail:</label>
        <transition name="fade">
          <div class="thumbnail-pic" v-if="blog.thumbnail != 'null'">
            <img :src="BASE_URL + blog.thumbnail" alt="thumbnail">
          </div>
        </transition>
      </div>

      <div class="mb-3">
        <transition-group tag="ul" name="fade" class="pictures">
          <li v-for="picture in pictures" :key="picture.id">
            <div class="img-wrapper">
              <img :src="BASE_URL + picture.name" alt="picture image">
            </div>
            <div class="btn-wrapper">
              <button class="btn btn-sm btn-info me-1" v-on:click.prevent="useThumbnail(picture.name)">Thumbnail</button>
              <button class="btn btn-sm btn-danger" v-on:click.prevent="delFile(picture)">Delete</button>
            </div>
          </li>
        </transition-group>
        <div class="clearfix"></div>
      </div>

      <div class="mb-3 editor-wrapper">
        <label class="form-label">Content:</label>
        <ckeditor :editor="editor" v-model="blog.content" :config="editorConfig"></ckeditor>
      </div>

      <div class="mb-3">
        <label class="form-label">Category:</label>
        <input type="text" v-model="blog.category" class="form-control">
      </div>

      <div class="mb-3">
        <label class="form-label">Status:</label>
        <input type="text" v-model="blog.status" class="form-control">
      </div>

      <button type="submit" class="btn btn-primary">Create Blog</button>
    </form>
  </div>
</template>

<script>
import BlogsService from '../../services/BlogsService'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import UploadService from '../../services/UploadService'
import UploadImage from '../Utils/Upload.vue' // Import

export default {
  components: {
    UploadImage // Register Component
  },
  data() {
    return {
      editor: ClassicEditor,  // 1. กำหนด Editor Build
      editorConfig: {
        licenseKey: 'GPL',
        // สามารถปรับแต่ง Toolbar ได้ตามต้องการ
        toolbar: ['heading', 'bold', 'italic', '|', 'link', 'bulletedList', 'numberedList', 'blockQuote'] // 2. ตั้งค่า Toolbar
      },
      blog: {
        title: '',
        thumbnail: 'null',
        pictures: 'null',
        content: '',
        category: '',
        status: 'saved'
      },
      pictures: [], // เก็บรายการรูปภาพที่อัปโหลด { id: 1, name: 'filename.jpg' }
      pictureIndex: 0,
      BASE_URL: 'http://localhost:8081/assets/uploads/' // URL ของ Server เรา
    }
  },
  methods: {
    // เมื่ออัปโหลดเสร็จ Component ลูกจะส่งข้อมูลไฟล์มา
    onUploaded (fileData) {
      this.pictureIndex++
      const pictureJSON = {
        id: this.pictureIndex,
        name: fileData.filename
      }
      this.pictures.push(pictureJSON)
    },
    useThumbnail (filename) {
      this.blog.thumbnail = filename
    },
    async delFile (picture) {
      let result = confirm("Want to delete?")
      if (result) {
        try {
          await UploadService.delete(picture.name)
          // ลบออกจาก array pictures
          this.pictures = this.pictures.filter(p => p.id !== picture.id)
        } catch (err) {
          console.log(err)
        }
      }
    },
    async createBlog() {
      // แปลง Array Pictures เป็น JSON String ก่อนบันทึก
      
      this.blog.pictures = JSON.stringify(this.pictures)
      try {
        await BlogsService.post(this.blog)
        this.$router.push({
          name: 'blogs'
        })
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
<style scoped>
/* ปรับแต่ง CSS เฉพาะส่วน Editor */
.editor-wrapper {
  text-align: left;
}

/* แก้ไขความสูงขั้นต่ำของ Editor ให้พิมพ์ง่ายขึ้น */
:deep(.ck-editor__editable) {
  min-height: 300px;
}
/* Fade transition สำหรับ Vue 3 */
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
}

/* Style สำหรับ Gallery */
.thumbnail-pic img {
  width: 200px;
  border: 1px solid #ddd;
  padding: 5px;
  margin-bottom: 10px;
}

ul.pictures {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
}

ul.pictures li {
  margin-right: 20px;
  margin-bottom: 20px;
  border: 1px solid #eee;
  padding: 10px;
  text-align: center;
}

ul.pictures li img {
  max-width: 180px;
  height: auto;
  margin-bottom: 5px;
}

.clearfix {
  clear: both;
}
</style>