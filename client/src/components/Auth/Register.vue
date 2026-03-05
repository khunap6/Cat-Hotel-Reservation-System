<template>
  <div class="w-full">
    <!-- heading -->
    <div class="mb-10 text-center md:text-left">
      <h2 class="text-5xl md:text-6xl font-black text-background-dark dark:text-white mb-3">
        Create account
      </h2>
      <p class="text-lg md:text-xl text-[#646f87] font-medium">
        Join The Cat Hotel and manage your cat's stays easily.
      </p>
    </div>

    <!-- tabs -->
    <div class="flex p-1.5 bg-background-light dark:bg-white/5 rounded-2xl mb-10">
      <button
        class="flex-1 py-3 text-base md:text-lg font-bold rounded-2xl text-[#646f87] hover:text-primary transition-colors"
        @click="$router.push('/login')"
        type="button"
      >
        Login
      </button>
      <button
        class="flex-1 py-3 text-base md:text-lg font-bold rounded-2xl bg-white dark:bg-primary shadow-sm text-primary dark:text-white"
        type="button"
      >
        Register
      </button>
    </div>

    <!-- form -->
    <form class="space-y-6" @submit.prevent="onRegister">
      <!-- NAME -->
      <div>
        <label class="block text-sm font-bold text-background-dark dark:text-white mb-2 ml-1">
          Full Name
        </label>
        <div class="relative group">
          <span
            class="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-[26px] text-[#646f87] group-focus-within:text-primary transition-colors"
          >
            badge
          </span>
          <input
            v-model.trim="name"
            class="w-full pl-14 pr-6 py-5 text-lg bg-background-light dark:bg-white/5 border-none rounded-2xl
                   focus:ring-4 focus:ring-primary/20 transition-all placeholder:text-[#646f87]
                   text-background-dark dark:text-white"
            placeholder="Your name"
            type="text"
            autocomplete="name"
            required
          />
        </div>
      </div>

      <!-- EMAIL -->
      <div>
        <label class="block text-sm font-bold text-background-dark dark:text-white mb-2 ml-1">
          Email Address
        </label>
        <div class="relative group">
          <span
            class="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-[26px] text-[#646f87] group-focus-within:text-primary transition-colors"
          >
            mail
          </span>
          <input
            v-model.trim="email"
            class="w-full pl-14 pr-6 py-5 text-lg bg-background-light dark:bg-white/5 border-none rounded-2xl
                   focus:ring-4 focus:ring-primary/20 transition-all placeholder:text-[#646f87]
                   text-background-dark dark:text-white"
            placeholder="hello@cathotel.com"
            type="email"
            autocomplete="email"
            required
          />
        </div>
      </div>

      <!-- PASSWORD -->
      <div>
        <label class="block text-sm font-bold text-background-dark dark:text-white mb-2 ml-1">
          Password
        </label>
        <div class="relative group">
          <span
            class="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-[26px] text-[#646f87] group-focus-within:text-primary transition-colors"
          >
            lock
          </span>
          <input
            v-model="password"
            class="w-full pl-14 pr-6 py-5 text-lg bg-background-light dark:bg-white/5 border-none rounded-2xl
                   focus:ring-4 focus:ring-primary/20 transition-all placeholder:text-[#646f87]
                   text-background-dark dark:text-white"
            placeholder="••••••••"
            type="password"
            autocomplete="new-password"
            required
          />
        </div>
      </div>

      <!-- CONFIRM -->
      <div>
        <label class="block text-sm font-bold text-background-dark dark:text-white mb-2 ml-1">
          Confirm Password
        </label>
        <div class="relative group">
          <span
            class="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-[26px] text-[#646f87] group-focus-within:text-primary transition-colors"
          >
            lock_reset
          </span>
          <input
            v-model="confirmPassword"
            class="w-full pl-14 pr-6 py-5 text-lg bg-background-light dark:bg-white/5 border-none rounded-2xl
                   focus:ring-4 focus:ring-primary/20 transition-all placeholder:text-[#646f87]
                   text-background-dark dark:text-white"
            placeholder="••••••••"
            type="password"
            autocomplete="new-password"
            required
          />
        </div>
      </div>

      <!-- ERROR -->
      <div v-if="error" class="rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm font-semibold">
        {{ error }}
      </div>

      <!-- SUBMIT -->
      <button
        class="w-full py-5 text-xl bg-primary text-white rounded-2xl font-bold
               shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all
               flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        type="submit"
        :disabled="loading"
      >
        {{ loading ? "Creating..." : "Create Account" }}
        <span class="material-symbols-outlined">arrow_forward</span>
      </button>

      <div class="text-center">
        <p class="text-sm font-medium text-[#646f87]">
          Already have an account?
          <a class="text-primary font-bold hover:underline cursor-pointer" @click="$router.push('/login')">
            Sign in
          </a>
        </p>
      </div>
    </form>
  </div>
</template>

<script>
import AuthenService from "../../services/AuthService.js"
import { useAuthenStore } from "../../stores/authen.js"

export default {
  name: "Register",
  data() {
    return {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      loading: false,
      error: null,
    }
  },
  methods: {
    async onRegister() {
      this.error = null

      if (this.password.length < 6) {
        this.error = "Password must be at least 6 characters."
        return
      }
      if (this.password !== this.confirmPassword) {
        this.error = "Passwords do not match."
        return
      }

      this.loading = true
      try {
        const res = await AuthenService.register({
          name: this.name,
          email: this.email,
          password: this.password,
        })

        const authenStore = useAuthenStore()
        authenStore.setToken(res.data.token)
        authenStore.setUser(res.data.user)

        // redirect by role
        const role = res.data.user?.role || "customer"
        if (role === "admin") {
          this.$router.push("/admin/dashboard")
        } else {
          this.$router.push("/customer/dashboard")
        }
      } catch (err) {
        this.error = err?.response?.data?.error || "Register failed"
      } finally {
        this.loading = false
      }
    },
  },
}
</script>