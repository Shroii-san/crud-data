export const validateProductForm = (formData) => {
  const errors = {}

  // Validate name
  const trimmedName = formData.name.trim()
  if (!trimmedName) {
    errors.name = 'Nama produk harus diisi'
  } else if (trimmedName.length < 3) {
    errors.name = 'Nama produk minimal 3 karakter'
  } else if (trimmedName.length > 255) {
    errors.name = 'Nama produk maksimal 255 karakter'
  }

  // Validate price
  const price = parseFloat(formData.price)
  if (!formData.price) {
    errors.price = 'Harga produk harus diisi'
  } else if (isNaN(price)) {
    errors.price = 'Harga produk harus berupa angka'
  } else if (price <= 0) {
    errors.price = 'Harga produk harus lebih dari 0'
  } else if (price > 9999999999.99) {
    errors.price = 'Harga produk terlalu besar'
  }

  // Validate product type
  const trimmedType = formData.product_type.trim()
  if (!trimmedType) {
    errors.product_type = 'Tipe produk harus diisi'
  } else if (trimmedType.length < 3) {
    errors.product_type = 'Tipe produk minimal 3 karakter'
  } else if (trimmedType.length > 100) {
    errors.product_type = 'Tipe produk maksimal 100 karakter'
  }

  return errors
}

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^(\+62|0)[0-9]{9,12}$/
  return phoneRegex.test(phone)
}
