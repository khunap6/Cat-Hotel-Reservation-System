import { createRouter, createWebHistory } from "vue-router"

import AuthLayout from "../layouts/AuthLayout.vue"
import CustomerLayout from "../layouts/CustomerLayout.vue"
import AdminLayout from "../layouts/AdminLayout.vue"

///components
import Login from "../components/Auth/Login.vue"
import Register from "../components/Auth/Register.vue"

import CustomerDashboard from "../components/Customer/Dashboard.vue"
import AdminDashboard from "../components/Admin/Dashboard.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // AUTH
    {
      path: "/",
      component: AuthLayout,
      children: [
        { path: "", redirect: "/login" },
        { path: "login", name: "login", component: Login },
        { path: "register", name: "register", component: Register },
      ],
    },

    // CUSTOMER
    {
      path: "/customer",
      component: CustomerLayout,
      children: [
        { path: "dashboard", name: "customer-dashboard", component: CustomerDashboard },
      ],
    },

    // ADMIN
    {
      path: "/admin",
      component: AdminLayout,
      children: [
        { path: "dashboard", name: "admin-dashboard", component: AdminDashboard },
      ],
    },
  ],
})

export default router