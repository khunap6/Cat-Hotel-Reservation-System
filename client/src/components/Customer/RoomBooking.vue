<template>
  <div>

    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-black text-slate-900">Choose Your Cat's Perfect Stay</h1>
      <p class="text-slate-500 text-sm mt-1">Every stay includes daily grooming, premium treats, and unlimited head scratches.</p>
    </div>

    <div class="flex gap-6 items-start">

      <!-- LEFT: Room list -->
      <div class="flex-1 min-w-0 space-y-4">

        <!-- Filter tabs -->
        <div class="flex gap-2">
          <button v-for="tab in typeTabs" :key="tab"
            class="px-4 py-2 rounded-full text-xs font-bold transition"
            :class="typeFilter === tab
              ? 'bg-primary text-white shadow-md shadow-primary/20'
              : 'bg-white text-slate-500 border border-slate-200 hover:border-primary/30'"
            @click="typeFilter = tab">
            {{ tab }}
          </button>
        </div>

        <!-- Loading -->
        <div v-if="loadingRooms" class="space-y-4">
          <div v-for="i in 3" :key="i" class="bg-white rounded-2xl h-36 animate-pulse border border-slate-100"></div>
        </div>

        <!-- No cats warning -->
        <div v-if="!loadingCats && cats.length === 0"
          class="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-center gap-3">
          <span class="material-symbols-outlined text-yellow-500">pets</span>
          <div class="flex-1">
            <p class="font-bold text-yellow-800 text-sm">ยังไม่มีข้อมูลแมว</p>
            <p class="text-xs text-yellow-600">กรุณาเพิ่มโปรไฟล์แมวก่อนทำการจอง</p>
          </div>
          <RouterLink to="/customer/cats"
            class="px-4 py-2 bg-yellow-500 text-white rounded-full font-bold text-xs hover:bg-yellow-600 transition flex-shrink-0">
            เพิ่มแมว
          </RouterLink>
        </div>

        <!-- Room cards -->
        <div v-for="room in filteredRooms" :key="room.id"
          class="bg-white rounded-2xl border-2 transition-all overflow-hidden cursor-pointer group"
          :class="form.roomId === room.id
            ? 'border-primary shadow-lg shadow-primary/10'
            : 'border-transparent hover:border-slate-200'"
          @click="room.status === 'available' && (form.roomId = room.id)">

          <div class="flex gap-0 items-stretch">
            <!-- Room image -->
            <div class="w-44 flex-shrink-0 relative overflow-hidden rounded-l-2xl self-stretch"
              :class="!room.imageUrl ? roomImgBg(room.type) : 'bg-slate-100'">

              <!-- actual photo -->
              <img v-if="room.imageUrl" :src="room.imageUrl"
                class="absolute inset-0 w-full h-full object-cover" />

              <!-- fallback gradient + icon -->
              <div v-else class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="material-symbols-outlined text-white/20 text-5xl">meeting_room</span>
              </div>

              <!-- Most popular badge -->
              <div v-if="room.type === 'VIP'"
                class="absolute top-2 left-2 bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-full z-10">
                MOST POPULAR
              </div>
            </div>

            <!-- Room info -->
            <div class="flex-1 p-4 flex flex-col justify-between">
              <div>
                <div class="flex items-start justify-between gap-2">
                  <h3 class="font-extrabold text-slate-900 text-sm">
                    {{ room.type === 'VIP' ? 'VIP (Very Important Paws) Suite' : room.name }}
                  </h3>
                  <div class="text-right flex-shrink-0">
                    <span class="text-lg font-black text-slate-900">${{ room.pricePerNight }}</span>
                    <span class="text-xs text-slate-400">/night</span>
                  </div>
                </div>
                <p class="text-xs text-slate-500 mt-1">{{ room.description || roomDesc(room.type) }}</p>
                <div class="flex gap-1.5 mt-2 flex-wrap">
                  <span v-for="feat in roomFeatures(room.type)" :key="feat"
                    class="text-[9px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full uppercase tracking-wide">
                    {{ feat }}
                  </span>
                  <span class="text-[9px] font-bold px-2 py-0.5 rounded-full"
                    :class="room.status === 'available' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'">
                    {{ room.status === 'available' ? '✓ Available' : room.status === 'full' ? '✗ Full' : '⚠ Maintenance' }}
                  </span>
                </div>
              </div>

              <div class="flex items-center justify-between mt-3">
                <a class="text-xs text-primary font-bold hover:underline cursor-pointer">View Suite Details</a>
                <button
                  class="px-4 py-1.5 rounded-full text-xs font-bold transition"
                  :class="form.roomId === room.id
                    ? 'bg-primary text-white'
                    : room.status !== 'available'
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-100 text-slate-700 hover:bg-primary/10 hover:text-primary'"
                  :disabled="room.status !== 'available'"
                  @click.stop="form.roomId = room.id">
                  {{ form.roomId === room.id ? '✓ Selected' : 'Select Suite' }}
                </button>
              </div>
            </div>
          </div>

        </div>

        <!-- Footer -->
        <p class="text-[10px] text-slate-400 text-center pt-2">© 2024 The Cat Hotel. All paws reserved.</p>
      </div>

      <!-- RIGHT: Booking panel (sticky) -->
      <div class="w-64 flex-shrink-0 sticky top-20 space-y-3">

        <div class="bg-white rounded-2xl border border-slate-100 card-shadow overflow-hidden">
          <div class="px-5 py-4 border-b border-slate-50">
            <h2 class="font-extrabold text-slate-900 text-sm">Confirm Booking</h2>
            <p class="text-[10px] text-slate-400 mt-0.5">Secure your spot for a purr-fect stay</p>
          </div>

          <div class="p-4 space-y-3">

            <!-- Selected suite -->
            <div class="flex items-center gap-2.5 bg-slate-50 rounded-xl p-3">
              <div class="size-10 rounded-lg overflow-hidden flex-shrink-0"
                :class="selectedRoom?.imageUrl ? '' : selectedRoom ? roomImgBg(selectedRoom.type) : 'bg-slate-200'">
                <img v-if="selectedRoom?.imageUrl" :src="selectedRoom.imageUrl"
                  class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <span class="material-symbols-outlined text-white/60 text-sm">hotel</span>
                </div>
              </div>
              <div>
                <p class="text-[10px] text-slate-400 font-semibold">Selected Suite</p>
                <p class="text-xs font-extrabold text-slate-900">
                  {{ selectedRoom ? selectedRoom.name : 'No room selected' }}
                </p>
              </div>
            </div>

            <!-- Cat select -->
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Your Cat</label>
              <select v-model="form.catId"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option value="">-- Select cat --</option>
                <option v-for="c in cats" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </div>

            <!-- Dates -->
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Stay Dates</label>
              <div class="bg-slate-50 border border-slate-200 rounded-xl p-2.5 space-y-2">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-primary text-sm">calendar_today</span>
                  <input type="date" v-model="form.checkIn" :min="today"
                    class="flex-1 bg-transparent text-xs font-semibold text-slate-700 focus:outline-none" />
                </div>
                <div class="h-px bg-slate-200"></div>
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-primary text-sm">calendar_today</span>
                  <input type="date" v-model="form.checkOut" :min="form.checkIn || today"
                    class="flex-1 bg-transparent text-xs font-semibold text-slate-700 focus:outline-none" />
                </div>
              </div>
            </div>

            <!-- Price breakdown -->
            <div v-if="selectedRoom && nights > 0" class="space-y-1.5 pt-1">
              <div class="flex justify-between text-xs">
                <span class="text-slate-500">{{ selectedRoom.name }} ({{ nights }} nights)</span>
                <span class="font-semibold text-slate-700">${{ (selectedRoom.pricePerNight * nights).toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-xs">
                <span class="text-slate-500">Service Fee</span>
                <span class="font-semibold text-slate-700">$15.00</span>
              </div>
              <div class="flex justify-between text-xs">
                <span class="text-slate-500">Pawsome Care Package</span>
                <span class="font-bold text-green-500">Free</span>
              </div>
              <div class="border-t border-slate-100 pt-2 flex justify-between">
                <span class="text-sm font-extrabold text-slate-900">Total Price</span>
                <span class="text-lg font-black text-primary">${{ (selectedRoom.pricePerNight * nights + 15).toFixed(2) }}</span>
              </div>
            </div>

            <!-- Error -->
            <div v-if="formError" class="bg-red-50 text-red-500 rounded-xl px-3 py-2 text-[10px] font-semibold">{{ formError }}</div>

            <!-- Note -->
            <textarea v-model="form.customerNote" rows="2" placeholder="Special requests..."
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400"></textarea>

            <button
              class="w-full py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/25 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              :disabled="submitting || !form.roomId || !form.catId || !form.checkIn || !form.checkOut || nights < 1"
              @click="submitBooking">
              {{ submitting ? 'Booking...' : 'Confirm & Pay →' }}
            </button>

            <div class="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
              <span class="material-symbols-outlined text-green-400 text-xs">lock</span>
              Secure encrypted payment
            </div>
          </div>

          <!-- Concierge help -->
          <div class="px-4 py-3 border-t border-slate-50 bg-slate-50/50 flex items-center gap-2">
            <span class="material-symbols-outlined text-slate-400 text-sm">support_agent</span>
            <p class="text-[10px] text-slate-500">Need help picking a suite?<br>
              <a class="text-primary font-bold hover:underline cursor-pointer">Chat with our Concierge</a>
            </p>
          </div>
        </div>

        <!-- Testimonial -->
        <div class="bg-white rounded-2xl border border-slate-100 card-shadow p-4">
          <div class="flex gap-0.5 mb-2">
            <span v-for="i in 5" :key="i" class="material-symbols-outlined text-yellow-400 text-sm">star</span>
          </div>
          <p class="text-[11px] text-slate-600 italic leading-relaxed">
            "Luna loved her stay in the VIP suite! The 24/7 camera gave me such peace of mind. Truly a 5-star experience."
          </p>
          <div class="flex items-center gap-2 mt-3">
            <div class="size-6 rounded-full bg-gradient-to-br from-pink-300 to-primary flex items-center justify-center text-white text-[9px] font-bold">SM</div>
            <p class="text-[10px] font-bold text-slate-700">Sarah M. & Luna</p>
          </div>
        </div>

      </div>
    </div>

    <!-- Success modal -->
    <div v-if="successModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      <div class="relative bg-white rounded-3xl p-10 text-center max-w-sm w-full shadow-2xl">
        <div class="size-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="material-symbols-outlined text-green-500 text-4xl">check_circle</span>
        </div>
        <h2 class="text-xl font-extrabold text-slate-900">Booking Confirmed!</h2>
        <p class="text-slate-500 text-sm mt-2">Your booking is pending approval from our team.</p>
        <div class="flex gap-3 mt-6">
          <RouterLink to="/customer/reservations"
            class="flex-1 py-3 bg-primary text-white rounded-full font-bold text-sm hover:brightness-110 transition">
            View Booking
          </RouterLink>
          <button @click="resetForm"
            class="flex-1 py-3 bg-slate-100 text-slate-700 rounded-full font-bold text-sm hover:bg-slate-200 transition">
            Book Again
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import RoomService from '../../services/RoomService'
import CatService from '../../services/CatsService'
import ReservationService from '../../services/ReservationsService'

const rooms = ref([])
const cats = ref([])
const loadingRooms = ref(true)
const loadingCats = ref(true)
const submitting = ref(false)
const formError = ref('')
const successModal = ref(false)
const typeFilter = ref('All Suites')
const today = new Date().toISOString().split('T')[0]
const form = ref({ catId: '', roomId: null, checkIn: '', checkOut: '', customerNote: '' })

const typeTabs = computed(() => {
  const types = [...new Set(rooms.value.map(r => r.type))]
  return ['All Suites', ...types]
})

const filteredRooms = computed(() =>
  typeFilter.value === 'All Suites' ? rooms.value
    : rooms.value.filter(r => r.type === typeFilter.value)
)

const nights = computed(() => {
  if (!form.value.checkIn || !form.value.checkOut) return 0
  return Math.max(0, Math.ceil((new Date(form.value.checkOut) - new Date(form.value.checkIn)) / 86400000))
})

const selectedRoom = computed(() => rooms.value.find(r => r.id === form.value.roomId))

function roomImgBg(t) {
  return { Standard:'bg-emerald-500', Deluxe:'bg-violet-500', VIP:'bg-rose-500', Suite:'bg-amber-500' }[t] || 'bg-slate-400'
}
function roomDesc(t) {
  return { Standard:'Cozy nooks for the curious cat. Includes window view of the garden bird feeder and premium kibble selection.', Deluxe:'Extra space for the climbing connoisseur. Includes multiple levels, orthopedic bedding, and daily feather toy sessions.', VIP:'The ultimate luxury with 24/7 web-cam access, a private balcony, and a dedicated butler for playtime and treats.', Suite:'Royal suite experience with dedicated play area and personalized care.' }[t] || ''
}
function roomFeatures(t) {
  return { Standard:['Garden View','Premium Kibble'], Deluxe:['Orthopedic Bed','Feather Toys'], VIP:['Live Cam','Gourmet Menu','Climbing Wall'], Suite:['Butler Service','Royal Menu'] }[t] || []
}

async function submitBooking() {
  formError.value = ''
  if (!form.value.catId) { formError.value = 'Please select your cat'; return }
  if (!form.value.checkIn || !form.value.checkOut) { formError.value = 'Please select dates'; return }
  if (nights.value < 1) { formError.value = 'Check-out must be after check-in'; return }
  submitting.value = true
  try {
    await ReservationService.create({ catId: form.value.catId, roomId: form.value.roomId, checkIn: form.value.checkIn, checkOut: form.value.checkOut, customerNote: form.value.customerNote })
    successModal.value = true
  } catch (e) {
    formError.value = e?.response?.data?.error || 'Something went wrong'
  } finally { submitting.value = false }
}

function resetForm() {
  form.value = { catId:'', roomId:null, checkIn:'', checkOut:'', customerNote:'' }
  successModal.value = false
}

onMounted(async () => {
  try {
    const [r,c] = await Promise.all([RoomService.list(), CatService.myCats()])
    rooms.value = r.data
    cats.value = c.data
  } catch(e) { console.error(e) } finally {
    loadingRooms.value = false
    loadingCats.value = false
  }
})
</script>
