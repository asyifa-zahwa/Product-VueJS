
<template>
  <div class="font-body-md text-on-surface bg-background min-h-screen flex flex-col">

    <Navbar v-model="searchQuery" :showSearch="true" />

    <main class="flex-grow pt-24 pb-2xl px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto w-full">

      <section class="mb-xl flex flex-col md:flex-row md:items-end justify-between gap-md">
        <div>
          <h1 class="font-headline-xl text-headline-xl text-primary mb-xs font-bold text-3xl">Semua Produk</h1>
          <p class="font-body-lg text-body-lg text-on-surface-variant">List Semua Products</p>
        </div>
        <div class="sm:hidden w-full">
          <div class="relative">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input 
              v-model="searchQuery"
              class="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-body-sm" 
              placeholder="Cari produk..." 
              type="text"
            />
          </div>
        </div>
      </section>

      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <span class="material-symbols-outlined animate-spin text-primary text-5xl">refresh</span>
      </div>

      <div v-else-if="paginatedProducts.length === 0" class="text-center py-20 bg-surface-container-lowest border border-outline-variant rounded-xl">
        <span class="material-symbols-outlined text-outline text-5xl mb-4">inventory_2</span>
        <h2 class="text-xl font-semibold text-primary">Produk tidak ditemukan</h2>
        <p class="text-on-surface-variant mt-2">Coba gunakan kata kunci lain untuk pencarian Anda.</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-lg">
        <div v-for="product in paginatedProducts" :key="product.id" class="group bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col">
          <div class="aspect-square w-full overflow-hidden bg-surface-container relative">
            <img :src="getValidImage(product.images)" :alt="product.title" @error="handleImageError" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div class="p-lg flex flex-col flex-grow p-4">
            <div class="flex justify-between items-start mb-2">
              <span class="bg-primary-fixed text-on-primary-fixed-variant px-2 py-1 rounded-full font-label-md text-xs font-medium">{{ product.category.name }}</span>
            </div>
            <h3 class="font-title-lg text-lg font-semibold text-primary mb-2 line-clamp-2" :title="product.title">{{ product.title }}</h3>
            <p class="font-headline-lg text-xl font-bold text-secondary mt-auto">{{ formatPrice(product.price) }}</p>
          </div>
        </div>
      </div>

      <nav v-if="totalPages > 1" class="mt-12 flex justify-center items-center gap-2">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="w-10 h-10 flex items-center justify-center rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          <span class="material-symbols-outlined">chevron_left</span>
        </button>

        <button v-for="page in visiblePages" :key="page" @click="changePage(page)" class="w-10 h-10 flex items-center justify-center rounded-xl transition-colors font-body-md" :class="currentPage === page ? 'bg-primary text-white' : 'border border-outline-variant text-on-surface-variant hover:bg-surface-container-low'">
          {{ page }}
        </button>

        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="w-10 h-10 flex items-center justify-center rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          <span class="material-symbols-outlined">chevron_right</span>
        </button>
      </nav>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import { products, isProductsLoaded } from '../store' 

const isLoading = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 8

const fetchProducts = async () => {
  if (isProductsLoaded.value) return 

  isLoading.value = true
  try {
    const response = await fetch('https://api.escuelajs.co/api/v1/products')
    if (response.ok) {
      products.value = await response.json()
      isProductsLoaded.value = true 
    }
  } catch (error) {
    console.error('Gagal mengambil data produk:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => fetchProducts())

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value
  const query = searchQuery.value.toLowerCase()
  return products.value.filter(p => p.title.toLowerCase().includes(query))
})

watch(searchQuery, () => { currentPage.value = 1 })

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage))
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredProducts.value.slice(start, start + itemsPerPage)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = start + maxVisible - 1
  if (end > totalPages.value) { end = totalPages.value; start = Math.max(1, end - maxVisible + 1) }
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const formatPrice = (priceInUSD) => {
  const rawIDR = priceInUSD * 15000
  const roundedIDR = Math.round(rawIDR / 5000) * 5000

  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR', 
    maximumFractionDigits: 0 
  }).format(roundedIDR)
}

const getValidImage = (images) => {
  if (!images || images.length === 0) return 'https://via.placeholder.com/640x480?text=No+Image'
  let img = images[0]
  if (img.startsWith('["')) { try { return JSON.parse(img)[0] } catch (e) { return img } }
  return img
}

const handleImageError = (e) => e.target.src = 'https://via.placeholder.com/640x480?text=Image+Error'
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
</style>