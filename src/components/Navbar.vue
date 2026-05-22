<template>
  <header class="bg-surface-container-lowest fixed top-0 w-full z-50 border-b border-outline-variant shadow-sm">
    <div class="flex justify-between items-center h-16 px-margin-mobile md:px-margin-desktop w-full max-w-7xl mx-auto">
      
      <div class="flex items-center gap-xl">
        <router-link to="/" class="font-title-lg text-title-lg font-bold text-primary">Product</router-link>
        <nav class="hidden md:flex gap-lg">
          <router-link to="/" class="font-body-md transition-colors duration-200" :class="route.path === '/' ? 'text-primary font-semibold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'">
            Katalog
          </router-link>
          <router-link v-if="isAuthenticated" to="/add-product" class="font-body-md transition-colors duration-200" :class="route.path === '/add-product' ? 'text-primary font-semibold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'">
            Tambah Produk
          </router-link>
        </nav>
      </div>

      <div class="flex items-center gap-md">
        <div v-if="showSearch" class="relative hidden sm:block">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" class="pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-body-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-64" placeholder="Cari nama produk..." type="text"/>
        </div>
        
        <button v-if="isAuthenticated" @click="logout" class="flex items-center gap-xs font-body-md text-error hover:text-red-700 transition-colors duration-200 active:scale-95">
          <span class="material-symbols-outlined">logout</span>
          <span class="hidden lg:inline">Keluar</span>
        </button>
        <router-link v-else to="/login" class="flex items-center gap-xs font-body-md text-primary hover:text-secondary transition-colors duration-200 active:scale-95">
          <span class="material-symbols-outlined">login</span>
          <span class="hidden lg:inline">Masuk</span>
        </router-link>
      </div>

    </div>
  </header>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { isAuthenticated } from '../store'

defineProps({
  showSearch: { type: Boolean, default: false },
  modelValue: { type: String, default: '' }
})

defineEmits(['update:modelValue'])

const router = useRouter()
const route = useRoute()

const logout = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  isAuthenticated.value = false
  router.push('/login')
}
</script>