<template>
  <div class="w-full">

    <!-- Heading -->
    <div class="mb-5">
      <h2 class="text-3xl font-black text-slate-900 mb-1">Create account</h2>
      <p class="text-sm text-slate-500">Join The Cat Hotel and manage your cat's stays easily.</p>
    </div>

    <!-- Tabs -->
    <div class="flex p-1 bg-slate-100 rounded-xl mb-5">
      <RouterLink
        class="flex-1 py-2 text-sm font-bold rounded-lg text-center text-slate-400 hover:text-primary transition"
        to="/login">
        Login
      </RouterLink>
      <button class="flex-1 py-2 text-sm font-bold rounded-lg bg-white shadow-sm text-primary transition">
        Register
      </button>
    </div>

    <form class="space-y-3.5" @submit.prevent="onRegister">

      <!-- Name -->
      <div>
        <label class="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
        <div class="relative">
          <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">badge</span>
          <input v-model.trim="name"
            class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/40 placeholder:text-slate-400 transition"
            placeholder="Your full name" type="text" required />
        </div>
      </div>

      <!-- Email -->
      <div>
        <label class="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
        <div class="relative">
          <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">mail</span>
          <input v-model.trim="email"
            class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/40 placeholder:text-slate-400 transition"
            placeholder="hello@cathotel.com" type="email" required />
        </div>
      </div>

      <!-- Password -->
      <div>
        <label class="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
        <div class="relative">
          <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">lock</span>
          <input v-model="password"
            class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/40 placeholder:text-slate-400 transition"
            placeholder="At least 6 characters" type="password" required />
        </div>
      </div>

      <!-- Confirm Password -->
      <div>
        <label class="block text-xs font-bold text-slate-700 mb-1.5">Confirm Password</label>
        <div class="relative">
          <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">lock_reset</span>
          <input v-model="confirmPassword"
            class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/40 placeholder:text-slate-400 transition"
            placeholder="••••••••" type="password" required />
        </div>
      </div>

      <!-- Error -->
      <div v-if="error" class="text-xs text-red-500 font-semibold bg-red-50 px-3 py-2 rounded-xl">{{ error }}</div>

      <!-- Submit -->
      <button
        class="w-full py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/30 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 mt-1"
        type="submit" :disabled="loading">
        {{ loading ? 'Creating...' : 'Create Account' }}
        <span class="material-symbols-outlined text-base">arrow_forward</span>
      </button>

    </form>

    <p class="text-center text-xs text-slate-500 mt-5">
      Already have an account?
      <RouterLink class="text-primary font-bold hover:underline" to="/login">Sign in</RouterLink>
    </p>

    <div class="flex items-center justify-center gap-4 mt-3">
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
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref(null)

async function onRegister() {
  error.value = null
  if (password.value.length < 6) { error.value = 'Password must be at least 6 characters.'; return }
  if (password.value !== confirmPassword.value) { error.value = 'Passwords do not match.'; return }
  loading.value = true
  try {
    await auth.register({ name: name.value, email: email.value, password: password.value })
    router.push(auth.isAdmin ? '/admin/dashboard' : '/customer/dashboard')
  } catch (e) {
    error.value = e?.response?.data?.error || 'Register failed'
  } finally {
    loading.value = false
  }
}
</script>
