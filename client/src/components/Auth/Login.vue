<template>
  <div class="max-w-[500px] mx-auto w-full">
    <div class="mb-10 text-center md:text-left">
      <h2 class="text-5xl md:text-6xl font-black text-background-dark mb-3">Welcome back</h2>
      <p class="text-lg md:text-xl text-[#646f87] font-medium">Please enter your details to access your cat's stay.</p>
    </div>

    <!-- Tabs -->
    <div class="flex p-1 bg-background-light rounded-full mb-8">
      <button class="flex-1 py-2 text-sm font-bold rounded-full bg-white shadow-sm text-primary">
        Login
      </button>
      <RouterLink
        class="flex-1 py-2 text-sm font-bold rounded-full text-center text-[#646f87] hover:text-primary transition-colors"
        to="/register"
      >
        Register
      </RouterLink>
    </div>

    <form class="space-y-5" @submit.prevent="onLogin">
      <div>
        <label class="block text-sm font-bold text-background-dark mb-2 ml-1">Email Address</label>
        <div class="relative group">
          <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#646f87] group-focus-within:text-primary transition-colors">
            mail
          </span>
          <input
            v-model="email"
            class="w-full pl-12 pr-4 py-4 bg-background-light border-none rounded-full focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-[#646f87] text-background-dark"
            placeholder="hello@cathotel.com"
            type="email"
            required
          />
        </div>
      </div>

      <div>
        <div class="flex justify-between items-center mb-2 ml-1">
          <label class="text-sm font-bold text-background-dark">Password</label>
        </div>
        <div class="relative group">
          <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#646f87] group-focus-within:text-primary transition-colors">
            lock
          </span>
          <input
            v-model="password"
            class="w-full pl-12 pr-4 py-4 bg-background-light border-none rounded-full focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-[#646f87] text-background-dark"
            placeholder="••••••••"
            type="password"
            required
          />
        </div>
      </div>

      <button
        class="w-full py-4 bg-primary text-white rounded-full font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-primary/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        type="submit"
        :disabled="loading"
      >
        {{ loading ? 'Signing in...' : 'Sign In' }}
        <span class="material-symbols-outlined">arrow_forward</span>
      </button>

      <p v-if="error" class="text-red-500 text-sm font-semibold">{{ error }}</p>
    </form>

    <div class="mt-10 text-center">
      <p class="text-sm font-medium text-[#646f87]">
        New to The Cat Hotel?
        <RouterLink class="text-primary font-bold hover:underline" to="/register">Create an account</RouterLink>
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

async function onLogin() {
  error.value = null
  loading.value = true
  try {
    await auth.login(email.value, password.value)
    router.push(auth.isAdmin ? '/admin' : '/customer')
  } catch (e) {
    error.value = e?.response?.data?.error || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>