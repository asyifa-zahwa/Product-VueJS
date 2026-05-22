<!-- src/views/AddProduct.vue -->
<template>
  <div class="bg-background text-on-background font-body-md min-h-screen flex flex-col">
    
    <!-- Toast Notification -->
    <div v-if="toast.show" class="fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300" :class="toast.isFadingOut ? 'hide-toast' : 'success-toast'">
      <div class="px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 border" :class="toast.isError ? 'bg-error-container text-on-error-container border-error' : 'bg-secondary-container text-on-secondary-container border-outline-variant'">
        <span class="material-symbols-outlined" :class="toast.isError ? 'text-error' : 'text-secondary'" style="font-variation-settings: 'FILL' 1;">{{ toast.isError ? 'error' : 'check_circle' }}</span>
        <span class="font-label-md">{{ toast.message }}</span>
      </div>
    </div>

    <Navbar :showSearch="false" />

    <main class="flex-grow w-full max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop pt-24 pb-12">

      <header class="mb-8">
        <div class="flex items-center gap-1 text-on-surface-variant mb-2 text-xs">
          <span class="font-label-md uppercase tracking-wider">Dashboard</span>
          <span class="material-symbols-outlined text-[16px]">chevron_right</span>
          <span class="font-label-md uppercase tracking-wider text-primary">Tambah Produk</span>
        </div>
        <h1 class="font-headline-lg text-3xl font-bold text-on-surface">Detail Produk Baru</h1>
        <p class="font-body-md text-on-surface-variant mt-1">Lengkapi informasi di bawah ini untuk menambahkan produk ke dalam sistem inventaris.</p>
      </header>

      <section class="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 md:p-10 shadow-sm">
        <form @submit.prevent="submitProduct" class="space-y-6">
          
          <div class="space-y-1">
            <label for="title" class="block font-label-md text-on-surface-variant text-sm">Judul Produk <span class="text-error">*</span></label>
            <input v-model="form.title" id="title" type="text" maxlength="150" placeholder="Contoh: Meja Kayu Jati Minimalis" required class="w-full bg-surface-container-lowest border border-outline rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary transition-all font-body-md outline-none" />
            <div class="flex justify-end mt-1">
              <span class="font-label-md text-xs" :class="form.title.length >= 150 ? 'text-error' : 'text-outline'">{{ form.title.length }} / 150</span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-1">
              <label for="price" class="block font-label-md text-on-surface-variant text-sm">Harga (Rp) <span class="text-error">*</span></label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-outline font-body-md">Rp</span>
                <input v-model.number="form.price" id="price" type="number" min="15000" step="1000" placeholder="150000" required class="w-full bg-surface-container-lowest border border-outline rounded-lg pl-12 pr-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary transition-all font-body-md outline-none" />
              </div>
            </div>

            <div class="space-y-1">
              <label for="category" class="block font-label-md text-on-surface-variant text-sm">Kategori <span class="text-error">*</span></label>
              <select v-model.number="form.categoryId" id="category" required class="w-full bg-surface-container-lowest border border-outline rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary transition-all font-body-md outline-none appearance-none">
                <option disabled value="">Pilih Kategori</option>
                <option value="1">Pakaian</option>
                <option value="2">Elektronik</option>
                <option value="3">Furnitur</option>
                <option value="4">Sepatu</option>
                <option value="5">Lainnya</option>
              </select>
            </div>
          </div>

          <div class="space-y-1">
            <label for="description" class="block font-label-md text-on-surface-variant text-sm">Deskripsi (Opsional)</label>
            <textarea v-model="form.description" id="description" rows="4" placeholder="Jelaskan detail produk, material, dan keunggulannya..." class="w-full bg-surface-container-lowest border border-outline rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary transition-all font-body-md outline-none resize-none"></textarea>
          </div>

          <div class="space-y-1">
            <label for="imageUrl" class="block font-label-md text-on-surface-variant text-sm">URL Foto Produk (Opsional)</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">link</span>
              <input v-model="form.imageUrl" id="imageUrl" type="url" placeholder="https://contoh.com/gambar.jpg" class="w-full bg-surface-container-lowest border border-outline rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary transition-all font-body-md outline-none" />
            </div>
          </div>

          <div v-if="form.imageUrl" class="w-32 h-32 rounded-xl overflow-hidden border border-outline-variant relative group">
            <img :src="form.imageUrl" alt="Preview" class="w-full h-full object-cover" @error="handleImageError"/>
            <button @click="form.imageUrl = ''" type="button" class="absolute top-1 right-1 bg-error text-on-error rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <span class="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>

          <div class="pt-6 border-t border-outline-variant flex flex-col md:flex-row justify-end items-center gap-4">
            <router-link to="/" class="w-full md:w-auto px-6 py-2 text-secondary font-semibold hover:bg-surface-container transition-colors rounded-lg text-center">Batalkan</router-link>
            <button type="submit" :disabled="isSubmitting" class="w-full md:w-auto px-10 py-2 bg-primary text-white font-semibold rounded-lg hover:shadow-md active:scale-95 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <span v-if="isSubmitting" class="material-symbols-outlined animate-spin">refresh</span>
              {{ isSubmitting ? 'Menyimpan...' : 'Simpan Produk' }}
            </button>
          </div>
        </form>
      </section>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import { products } from '../store'

const router = useRouter()
const isSubmitting = ref(false)

const form = reactive({
  title: '', price: '', description: '', categoryId: '', imageUrl: ''
})

const toast = reactive({ show: false, message: '', isError: false, isFadingOut: false })

const showToast = (msg, isError = false) => {
  toast.message = msg; toast.isError = isError; toast.show = true; toast.isFadingOut = false;
  setTimeout(() => {
    toast.isFadingOut = true;
    setTimeout(() => { toast.show = false }, 500)
  }, 3000)
}

const handleImageError = (e) => e.target.src = 'https://via.placeholder.com/150?text=Invalid+URL'

const submitProduct = async () => {
  isSubmitting.value = true
  const priceInUSD = form.price / 15000;
  const finalImagesArray = form.imageUrl ? [form.imageUrl] : ['https://lh3.googleusercontent.com/aida-public/AB6AXuCQYRlebzrGYVXLCmT8R4KaCH0ZvbQgEI6cqVc6IoZJaOi5lkV-aWC7w7zOcWCx18nK9BAe9_1bch3XrWwZ6E2vcQfESKYrK2-pVAWiO6mCD9CefQtrxApYrO8hviNSwZteBhgq3DEhx0bxGl-7BO7h9j5NxB99iBMqzTAUWStCoWbayi22f48s5MK1taJ80OLwiOhU83zXme3Kn7VmMcyrt05i0OQ4_CcNUOTvEL-Qn40wn_ZMKYyXFU4izLUMCTCTTfkWyHfMjC4'];

  try {
    const response = await fetch('https://api.escuelajs.co/api/v1/products/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title,
        price: priceInUSD,
        description: form.description || "Deskripsi tidak tersedia",
        categoryId: form.categoryId,
        images: finalImagesArray
      })
    })

    if (response.ok) {
      const newProduct = await response.json()
      
      products.value.unshift(newProduct)

      showToast('Produk berhasil ditambahkan ke katalog!', false)
      setTimeout(() => router.push('/'), 2000)
    } else {
      showToast('Gagal menambahkan produk. Periksa kembali data Anda.', true)
    }
  } catch (error) {
    showToast('Terjadi kesalahan pada server!', true)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.success-toast { animation: slideIn 0.5s ease-out forwards; }
@keyframes slideIn { from { transform: translateX(-50%) translateY(-100%); opacity: 0; } to { transform: translateX(-50%) translateY(0); opacity: 1; } }
.hide-toast { animation: slideOut 0.5s ease-in forwards; }
@keyframes slideOut { from { transform: translateX(-50%) translateY(0); opacity: 1; } to { transform: translateX(-50%) translateY(-100%); opacity: 0; } }
</style>