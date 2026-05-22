import { ref } from 'vue'

export const products = ref([])
export const isProductsLoaded = ref(false)
export const isAuthenticated = ref(localStorage.getItem('access_token') !== null)