<template>
  <div class="antialiased text-on-surface bg-surface-container-lowest min-h-screen">
    <header class="fixed top-0 left-0 w-full z-50 flex items-center justify-between h-16 px-margin-mobile md:px-margin-desktop bg-surface-container-lowest/80 backdrop-blur-md">
      <div class="flex items-center gap-xs">
        <span class="material-symbols-outlined text-primary text-3xl" style="font-variation-settings: 'FILL' 1;">eco</span>
        <span class="font-title-lg font-bold text-primary text-xl">Product</span>
      </div>
    </header>

    <main class="min-h-screen flex items-center justify-center p-margin-mobile md:p-margin-desktop">
      <div class="w-full max-w-md bg-white border border-outline-variant/30 rounded-xl p-lg md:p-xl shadow-sm transition-all hover:shadow-md z-10">
        
        <div class="text-center mb-xl">
          <h1 class="font-headline-lg text-primary mb-sm text-3xl font-semibold">Selamat Datang</h1>
          <p class="font-body-md text-on-surface-variant">Silakan masuk ke akun Anda untuk melanjutkan akses ke Product.</p>
        </div>

        <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm text-center">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleLogin" class="space-y-lg">
          <div class="space-y-xs">
            <label for="email" class="font-label-md text-outline uppercase tracking-wider block text-xs">Email</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">mail</span>
              <input 
                v-model="form.email" 
                type="email" 
                id="email" 
                placeholder="contoh: john@mail.com" 
                required
                class="w-full pl-10 pr-4 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-fixed focus:border-primary transition-all font-body-md placeholder:text-outline-variant"
              />
            </div>
          </div>

          <div class="space-y-xs">
            <div class="flex justify-between items-center">
              <label for="password" class="font-label-md text-outline uppercase tracking-wider block text-xs">Kata Sandi</label>
            </div>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">lock</span>
              <input 
                v-model="form.password" 
                :type="showPassword ? 'text' : 'password'" 
                id="password" 
                placeholder="••••••••" 
                required
                class="w-full pl-10 pr-12 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-fixed focus:border-primary transition-all font-body-md placeholder:text-outline-variant"
              />
              <button 
                type="button" 
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
              >
                <span class="material-symbols-outlined text-[20px]">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full mt-6 py-4 text-white font-body-md font-semibold rounded-lg shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-sm"
            :class="isLoading ? 'bg-secondary opacity-80 cursor-not-allowed' : 'bg-primary hover:bg-tertiary'"
          >
            <template v-if="isLoading">
              <span class="material-symbols-outlined animate-spin text-[20px]">refresh</span> 
              Menghubungkan...
            </template>
            <template v-else>
              Masuk Sekarang
              <span class="material-symbols-outlined text-[20px]">login</span>
            </template>
          </button>
        </form>
      </div>
    </main>

    <div class="fixed top-[-10%] right-[-5%] w-[400px] h-[400px] bg-primary-fixed/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
    <div class="fixed bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-secondary-fixed/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { isAuthenticated } from '../store'

const router = useRouter()

const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const form = reactive({
  email: '',
  password: ''
})

const handleLogin = async () => {
  if (!form.email || !form.password) {
    errorMessage.value = "Email dan password wajib diisi!"
    return
  }

  errorMessage.value = ''
  isLoading.value = true

  try {
    const response = await fetch('https://api.escuelajs.co/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: form.email,
        password: form.password
      })
    })

    const data = await response.json()

    if (response.ok) {
    localStorage.setItem('access_token', data.access_token)
    localStorage.setItem('refresh_token', data.refresh_token)
    
    isAuthenticated.value = true 
    
    router.push({ name: 'Dashboard' })
    } else {
      errorMessage.value = "Email atau password salah!"
    }
  } catch (error) {
    errorMessage.value = "Terjadi kesalahan pada server. Coba lagi nanti."
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
</script>