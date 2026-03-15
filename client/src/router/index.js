import { createRouter, createWebHistory } from "vue-router"

// layouts
import AuthLayout from "../layouts/AuthLayout.vue"
import CustomerLayout from "../layouts/CustomerLayout.vue"
import AdminLayout from "../layouts/AdminLayout.vue"

// auth
import Login from "../components/Auth/Login.vue"
import Register from "../components/Auth/Register.vue"

// customer
import CustomerDashboard from "../components/Customer/Dashboard.vue"
import MyCats from "../components/Customer/MyCats.vue"
import RoomBooking from "../components/Customer/RoomBooking.vue"
import MyReservations from "../components/Customer/MyReservations.vue"
import CustomerAnnouncements from "../components/Customer/Announcements.vue"

// admin
import AdminDashboard from "../components/Admin/Dashboard.vue"
import AdminReservations from "../components/Admin/Reservations.vue"
import AdminCustomers from "../components/Admin/Customers.vue"
import AdminCats from "../components/Admin/Cats.vue"
import AdminRooms from "../components/Admin/Rooms.vue"
import AdminAnnouncements from "../components/Admin/Announcements.vue"

// services / store
import AuthenService from "../services/AuthService.js"
import { useAuthenStore } from "../stores/authen.js"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: AuthLayout,
      children: [
        { path: "", redirect: "/login" },
        { path: "login", name: "login", component: Login },
        { path: "register", name: "register", component: Register }
      ]
    },
    {
      path: "/customer",
      component: CustomerLayout,
      meta: { requiresAuth: true },
      children: [
        { path: "", redirect: "dashboard" },
        { path: "dashboard", name: "customer-dashboard", component: CustomerDashboard },
        { path: "cats", name: "customer-cats", component: MyCats },
        { path: "booking", name: "customer-booking", component: RoomBooking },
        { path: "reservations", name: "customer-reservations", component: MyReservations },
        { path: "announcements", name: "customer-announcements", component: CustomerAnnouncements }
      ]
    },
    {
      path: "/admin",
      component: AdminLayout,
      meta: { requiresAuth: true },
      children: [
        { path: "", redirect: "dashboard" },
        { path: "dashboard", name: "admin-dashboard", component: AdminDashboard },
        { path: "reservations", name: "admin-reservations", component: AdminReservations },
        { path: "customers", name: "admin-customers", component: AdminCustomers },
        { path: "cats", name: "admin-cats", component: AdminCats },
        { path: "rooms", name: "admin-rooms", component: AdminRooms },
        { path: "announcements", name: "admin-announcements", component: AdminAnnouncements }
      ]
    },
    { path: "/:pathMatch(.*)*", redirect: "/login" }
  ]
})

router.beforeEach(async (to) => {
  const auth = useAuthenStore()
  if (!auth.token) {
    const savedToken = localStorage.getItem("token")
    if (savedToken) auth.token = savedToken
  }
  const hasToken = !!auth.token
  if (to.meta.requiresAuth && !hasToken) return { name: "login" }
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
