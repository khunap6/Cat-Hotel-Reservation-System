<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-mesh p-4">
    <div class="bg-white rounded-3xl shadow-2xl overflow-hidden flex w-full max-w-[900px] min-h-[580px]">

      <!-- LEFT: Cat photo panel -->
      <div class="hidden md:flex relative w-[340px] flex-shrink-0 flex-col">
        <img
          class="absolute inset-0 w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCujXwPhgkY3JLS5LO3k2oq_6D3yimq6bVGXl7gWTcNlQiC8Y3ZrWi9XL0S7Rb4BObqXl3vlNdPmrOleUk9Y59gt4uIc-goHXKTSltI2LG3rVSdY2Q5ei0ixXpA2-dcmiUtP28tOXZqOkDlNpPfXYNHdWVucrmjz0SrceYofWK3r_R_Km1LsYiuMG-5Pb_Dl9AUgNXF9N8bIs-wmF81__rsoPZMXCzUg7dqMYi4RaWVnUGShFAcBcqwd8yYsPfaKHDhyQvlNoVRO7Tw"
          alt="Cat"
        />
        <!-- Gradient overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20"></div>

        <!-- Content over image -->
        <div class="relative flex flex-col justify-between h-full p-7 text-white">
          <!-- Logo -->
          <div class="flex items-center gap-2">
            <div class="bg-white/20 backdrop-blur-sm p-1.5 rounded-xl">
              <span class="material-symbols-outlined text-xl">pets</span>
            </div>
            <span class="font-extrabold text-base tracking-tight">The Cat Hotel</span>
          </div>

          <!-- Bottom text -->
          <div>
            <h2 class="text-2xl font-extrabold leading-snug mb-2">
              A Five-Star Retreat for Your Feline Friend.
            </h2>
            <p class="text-white/75 text-xs leading-relaxed mb-5">
              Luxury suites, gourmet treats, and round-the-clock pampering for the most discerning whiskers.
            </p>

            <!-- Social proof -->
            <div class="flex items-center gap-2">
              <div class="flex -space-x-2">
                <div v-for="i in 3" :key="i"
                  class="size-7 rounded-full border-2 border-white bg-gradient-to-br from-pink-300 to-primary flex items-center justify-center text-xs font-bold">
                </div>
              </div>
              <p class="text-white/80 text-xs font-semibold">Joined by 2,000+ happy cat parents</p>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT: Form panel -->
      <div class="flex-1 flex items-center justify-center px-8 py-8">
        <div class="w-full max-w-[360px]">
          <router-view />
        </div>
      </div>

    </div>

    <!-- Chat bubble -->
    <div class="fixed bottom-6 right-6">
      <div class="bg-primary p-3 rounded-full shadow-xl shadow-primary/40 border-4 border-white cursor-pointer hover:scale-110 transition">
        <span class="material-symbols-outlined text-white text-xl">chat_bubble</span>
      </div>
    </div>
  </div>
</template>
