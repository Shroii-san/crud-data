import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const productApi = {
  // Get all products
  getAll: async () => {
    try {
      const response = await apiClient.get('/products')
      return response.data
    } catch (error) {
      return handleError(error)
    }
  },

  // Get single product by ID
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/products/${id}`)
      return response.data
    } catch (error) {
      return handleError(error)
    }
  },

  // Create new product
  create: async (productData) => {
    try {
      const response = await apiClient.post('/products', productData)
      return response.data
    } catch (error) {
      return handleError(error)
    }
  },

  // Update product
  update: async (id, productData) => {
    try {
      const response = await apiClient.put(`/products/${id}`, productData)
      return response.data
    } catch (error) {
      return handleError(error)
    }
  },

  // Delete product
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/products/${id}`)
      return response.data
    } catch (error) {
      return handleError(error)
    }
  },
}

function handleError(error) {
  if (error.response) {
    return {
      success: false,
      message: error.response.data?.message || 'Terjadi kesalahan',
      data: null,
    }
  } else if (error.request) {
    return {
      success: false,
      message: 'Tidak dapat terhubung dengan server',
      data: null,
    }
  } else {
    return {
      success: false,
      message: error.message || 'Terjadi kesalahan',
      data: null,
    }
  }
}
