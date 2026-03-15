<template>
  <div class="w-full">

    <!-- Heading -->
    <div class="mb-6">
      <h2 class="text-3xl font-black text-slate-900 mb-1">Welcome back</h2>
      <p class="text-sm text-slate-500">Please enter your details to access your cat's stay.</p>
    </div>

    <!-- Tabs -->
    <div class="flex p-1 bg-slate-100 rounded-xl mb-6">
      <button class="flex-1 py-2 text-sm font-bold rounded-lg bg-white shadow-sm text-primary transition">
        Login
      </button>
      <RouterLink
        class="flex-1 py-2 text-sm font-bold rounded-lg text-center text-slate-400 hover:text-primary transition"
        to="/register">
        Register
      </RouterLink>
    </div>

    <form class="space-y-4" @submit.prevent="onLogin">

      <!-- Email -->
      <div>
        <label class="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
        <div class="relative">
          <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">mail</span>
          <input
            v-model="email"
            class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/40 placeholder:text-slate-400 transition"
            placeholder="hello@cathotel.com"
            type="email"
            required
          />
        </div>
      </div>

      <!-- Password -->
      <div>
        <div class="flex items-center justify-between mb-1.5">
          <label class="text-xs font-bold text-slate-700">Password</label>
          <a class="text-xs text-primary font-semibold hover:underline cursor-pointer">Forgot?</a>
        </div>
        <div class="relative">
          <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">lock</span>
          <input
            v-model="password"
            class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/40 placeholder:text-slate-400 transition"
            placeholder="••••••••"
            type="password"
            required
          />
        </div>
      </div>

      <!-- Keep logged in -->
      <label class="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" class="rounded border-slate-300 text-primary focus:ring-primary/20" />
        <span class="text-xs text-slate-500 font-medium">Keep me logged in for a week</span>
      </label>

      <!-- Error -->
      <p v-if="error" class="text-xs text-red-500 font-semibold bg-red-50 px-3 py-2 rounded-xl">{{ error }}</p>

      <!-- Submit -->
      <button
        class="w-full py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/30 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
        type="submit"
        :disabled="loading">
        {{ loading ? 'Signing in...' : 'Sign In' }}
        <span class="material-symbols-outlined text-base">arrow_forward</span>
      </button>

    </form>

    <!-- Divider -->
    <div class="flex items-center gap-3 my-5">
      <div class="flex-1 h-px bg-slate-200"></div>
      <span class="text-xs text-slate-400 font-medium">OR CONTINUE WITH</span>
      <div class="flex-1 h-px bg-slate-200"></div>
    </div>

    <!-- Social buttons -->
    <div class="grid grid-cols-2 gap-3">
      <button class="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
        <svg class="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        Google
      </button>
      <button class="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
        Apple
      </button>
    </div>

    <!-- Footer -->
    <p class="text-center text-xs text-slate-500 mt-6">
      New to The Cat Hotel?
      <RouterLink class="text-primary font-bold hover:underline" to="/register">Create an account</RouterLink>
    </p>

    <div class="flex items-center justify-center gap-4 mt-4">
      <a class="text-xs text-slate-400 hover:text-slate-600 cursor-pointer">Privacy Policy</a>
      <a class="text-xs text-slate-400 hover:text-slate-600 cursor-pointer">Terms of Service</a>
      <a class="text-xs text-slate-400 hover:text-slate-600 cursor-pointer">Contact Support</a>
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
    router.push(auth.isAdmin ? '/admin/dashboard' : '/customer/dashboard')
  } catch (e) {
    error.value = e?.response?.data?.error || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>
