<template>
  <div class="max-w-[400px] mx-auto w-full">
    <div class="mb-10 text-center md:text-left">
      <h2 class="text-4xl font-black text-background-dark mb-2">Create account</h2>
      <p class="text-[#646f87] font-medium">Sign up to book a luxury stay for your cat.</p>
    </div>

    <!-- Tabs -->
    <div class="flex p-1 bg-background-light rounded-full mb-8">
      <RouterLink
        class="flex-1 py-2 text-sm font-bold rounded-full text-center text-[#646f87] hover:text-primary transition-colors"
        to="/login"
      >
        Login
      </RouterLink>
      <button class="flex-1 py-2 text-sm font-bold rounded-full bg-white shadow-sm text-primary">
        Register
      </button>
    </div>

    <form class="space-y-5" @submit.prevent="onRegister">
      <div>
        <label class="block text-sm font-bold text-background-dark mb-2 ml-1">Email Address</label>
        <input v-model="email"
               class="w-full px-5 py-4 bg-background-light border-none rounded-full focus:ring-2 focus:ring-primary/20"
               type="email" required />
      </div>

      <div>
        <label class="block text-sm font-bold text-background-dark mb-2 ml-1">Password</label>
        <input v-model="password"
               class="w-full px-5 py-4 bg-background-light border-none rounded-full focus:ring-2 focus:ring-primary/20"
               type="password" required />
      </div>

      <!-- คุณเพิ่ม name/phone ได้ถ้า backend รองรับ -->
      <button class="w-full py-4 bg-primary text-white rounded-full font-bold text-lg shadow-lg shadow-primary/30"
              type="submit" :disabled="loading">
        {{ loading ? 'Creating...' : 'Create Account' }}
        <span class="material-symbols-outlined">arrow_forward</span>
      </button>

      <p v-if="error" class="text-red-500 text-sm font-semibold">{{ error }}</p>
    </form>

    <div class="mt-10 text-center">
      <p class="text-sm font-medium text-[#646f87]">
        Already have an account?
        <RouterLink class="text-primary font-bold hover:underline" to="/login">Login</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthenStore } from '../../stores/authen'

const router = useRouter()
const auth = useAuthenStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref(null)

async function onRegister() {
  error.value = null
  loading.value = true
  try {
    await auth.register({ email: email.value, password: password.value })
    router.push(auth.isAdmin ? '/admin' : '/customer')
  } catch (e) {
    error.value = e?.response?.data?.error || 'Register failed'
  } finally {
    loading.value = false
  }
}
</script>