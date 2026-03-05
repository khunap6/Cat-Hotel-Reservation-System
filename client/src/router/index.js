import { createRouter, createWebHistory } from "vue-router"

// layouts
import AuthLayout from "../layouts/AuthLayout.vue"
import CustomerLayout from "../layouts/CustomerLayout.vue"
import AdminLayout from "../layouts/AdminLayout.vue"

// auth pages
import Login from "../components/Auth/Login.vue"
import Register from "../components/Auth/Register.vue"

// customer pages
import CustomerDashboard from "../components/Customer/Dashboard.vue"
import MyCats from "../components/Customer/MyCats.vue"
import RoomBooking from "../components/Customer/RoomBooking.vue"
import MyReservations from "../components/Customer/MyReservations.vue"
import Announcements from "../components/Customer/Announcements.vue"

// admin pages
import AdminDashboard from "../components/Admin/Dashboard.vue"

// services / store
import AuthenService from "../services/AuthService.js"
import { useAuthenStore } from "../stores/authen.js"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [

    // AUTH
    {
      path: "/",
      component: AuthLayout,
      children: [
        { path: "", redirect: "/login" },

        {
          path: "login",
          name: "login",
          component: Login
        },

        {
          path: "register",
          name: "register",
          component: Register
        }
      ]
    },

    // CUSTOMER
    {
      path: "/customer",
      component: CustomerLayout,
      meta: { requiresAuth: true },
      children: [

        {
          path: "",
          redirect: "dashboard"
        },

        {
          path: "dashboard",
          name: "customer-dashboard",
          component: CustomerDashboard
        },

        {
          path: "cats",
          name: "customer-cats",
          component: MyCats
        },

        {
          path: "booking",
          name: "customer-booking",
          component: RoomBooking
        },

        {
          path: "reservations",
          name: "customer-reservations",
          component: MyReservations
        },

        {
          path: "announcements",
          name: "customer-announcements",
          component: Announcements
        }
      ]
    },

    // ADMIN
    {
      path: "/admin",
      component: AdminLayout,
      meta: { requiresAuth: true },
      children: [

        {
          path: "",
          redirect: "dashboard"
        },

        {
          path: "dashboard",
          name: "admin-dashboard",
          component: AdminDashboard
        }

      ]
    },

    // fallback
    {
      path: "/:pathMatch(.*)*",
      redirect: "/login"
    }

  ]
})


// ==========================
// ROUTER GUARD
// ==========================

router.beforeEach(async (to) => {

  const auth = useAuthenStore()

  // ดึง token จาก localStorage ถ้า store ยังว่าง
  if (!auth.token) {
    const savedToken = localStorage.getItem("token")
    if (savedToken) {
      auth.token = savedToken
    }
  }

  const hasToken = !!auth.token

  // ถ้าหน้านี้ต้อง login แต่ไม่มี token
  if (to.meta.requiresAuth && !hasToken) {
    return { name: "login" }
  }

  // ถ้ามี token แต่ยังไม่มี user
  if (hasToken && !auth.user) {
    try {
      const res = await AuthenService.me()
      auth.setUser(res.data.user ?? res.data)
    } catch (e) {
      auth.logout()
      return { name: "login" }
    }
  }

  return true
})

export default router