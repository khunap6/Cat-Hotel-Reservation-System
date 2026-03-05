<template>
  <div class="bg-white rounded-xl p-8 card-shadow border border-primary/5">

    <h1 class="text-2xl font-bold mb-6">
      Announcements
    </h1>

    <div v-if="announcements.length" class="space-y-4">

      <div
        v-for="a in announcements"
        :key="a.id"
        class="p-5 border rounded-lg hover:shadow-md transition"
      >

        <div class="flex items-center justify-between">

          <h2 class="font-bold text-lg">
            {{ a.title }}
          </h2>

          <span
            class="text-xs px-2 py-1 rounded"
            :class="badgeColor(a.type)"
          >
            {{ a.type }}
          </span>

        </div>

        <p class="text-gray-600 mt-2">
          {{ a.content }}
        </p>

        <div class="text-xs text-gray-400 mt-3">
          {{ formatDate(a.createdAt) }}
        </div>

      </div>

    </div>

    <div v-else class="text-gray-500">
      No announcements yet
    </div>

  </div>
</template>

<script>
import AnnouncementService from "../../services/AnnouncementsService"

export default {

  data() {
    return {
      announcements: []
    }
  },

  async mounted() {

    const res = await AnnouncementService.list()
    this.announcements = res.data

  },

  methods: {

    formatDate(date) {
      return new Date(date).toLocaleDateString()
    },

    badgeColor(type) {

      if (type === "promotion")
        return "bg-green-100 text-green-600"

      if (type === "alert")
        return "bg-red-100 text-red-600"

      return "bg-blue-100 text-blue-600"

    }

  }

}
</script>