<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-mesh p-4 md:p-8">
    <!-- ✅ เต็มจอมากขึ้น: ใช้ vw/vh -->
    <div
      class="bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col md:flex-row
             w-[96vw] max-w-[1600px] min-h-[92vh]"
    >
      <!-- LEFT -->
      <div class="hidden md:block relative flex-[1]">
        <img
          class="absolute inset-0 w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCujXwPhgkY3JLS5LO3k2oq_6D3yimq6bVGXl7gWTcNlQiC8Y3ZrWi9XL0S7Rb4BObqXl3vlNdPmrOleUk9Y59gt4uIc-goHXKTSltI2LG3rVSdY2Q5ei0ixXpA2-dcmiUtP28tOXZqOkDlNpPfXYNHdWVucrmjz0SrceYofWK3r_R_Km1LsYiuMG-5Pb_Dl9AUgNXF9N8bIs-wmF81__rsoPZMXCzUg7dqMYi4RaWVnUGShFAcBcqwd8yYsPfaKHDhyQvlNoVRO7Tw"
          alt="Cat"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>

        <div class="absolute inset-0 p-10 text-white flex flex-col justify-between">
          <div class="flex items-center gap-3">
            <div class="bg-white/20 backdrop-blur-md p-2 rounded-full">
              <span class="material-symbols-outlined text-3xl">pets</span>
            </div>
            <h1 class="text-xl font-extrabold tracking-tight">The Cat Hotel</h1>
          </div>

          <div>
            <h2 class="text-5xl font-extrabold leading-tight">
              A Five-Star Retreat for Your Feline Friend.
            </h2>
            <p class="mt-4 text-base font-medium opacity-90 max-w-md">
              Luxury suites, gourmet treats, and round-the-clock pampering.
            </p>
          </div>

          <p class="text-sm font-semibold opacity-90">Joined by 2,000+ happy cat parents</p>
        </div>
      </div>

      <!-- RIGHT -->
      <div class="flex-[1.25] flex items-center justify-center px-8 md:px-16 py-10">
        <!-- ✅ จำกัดฟอร์มให้ไม่โล่ง -->
        <div class="w-full max-w-[780px]">
          <router-view />
        </div>
      </div>
    </div>

    <div class="fixed bottom-6 right-6 hidden xl:block">
      <div class="bg-blush-pink p-4 rounded-full shadow-lg border-4 border-white">
        <span class="material-symbols-outlined text-primary text-3xl">chat_bubble</span>
      </div>
    </div>
  </div>
</template>