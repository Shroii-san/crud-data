import { useState, useEffect } from "react";
import { validateProductForm } from "../utils/validation";

function ProductForm({ product, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    product_type: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const productTypes = [
    "Elektronik",
    "Fashion",
    "Makanan",
    "Minuman",
    "Furnitur",
    "Buku",
    "Mainan",
    "Perawatan",
    "Olahraga",
    "Lainnya",
  ];

  // Initialize form with product data if editing
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        product_type: product.product_type,
      });
    } else {
      setFormData({
        name: "",
        price: "",
        product_type: "",
      });
    }
    setErrors({});
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const newErrors = validateProductForm(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        product_type: formData.product_type.trim(),
      };
      await onSubmit(submitData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-primary bg-gradient text-white">
        <h5 className="mb-0">
          {product ? "Edit Produk" : "Tambah Produk Baru"}
        </h5>
      </div>
      <div className="card-body p-3 p-md-4">
        <form onSubmit={handleSubmit} noValidate>
          <div className="row g-3">
            {/* Nama Produk */}
            <div className="col-12">
              <label htmlFor="name" className="form-label fw-semibold">
                Nama Produk <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Masukkan nama produk"
                disabled={isSubmitting}
                autoFocus
              />
              {errors.name && (
                <div className="invalid-feedback d-block">{errors.name}</div>
              )}
            </div>

            {/* Harga */}
            <div className="col-12 col-md-6">
              <label htmlFor="price" className="form-label fw-semibold">
                Harga (Rp) <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                className={`form-control ${errors.price ? "is-invalid" : ""}`}
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0"
                disabled={isSubmitting}
                step="0.01"
                min="0"
              />
              {errors.price && (
                <div className="invalid-feedback d-block">{errors.price}</div>
              )}
            </div>

            {/* Tipe Produk */}
            <div className="col-12 col-md-6">
              <label htmlFor="product_type" className="form-label fw-semibold">
                Tipe Produk <span className="text-danger">*</span>
              </label>
              <select
                className={`form-select ${errors.product_type ? "is-invalid" : ""}`}
                id="product_type"
                name="product_type"
                value={formData.product_type}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="">-- Pilih Tipe Produk --</option>
                {productTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.product_type && (
                <div className="invalid-feedback d-block">
                  {errors.product_type}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="row g-2 mt-2">
            <div className="col-6 col-md-3">
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Menyimpan...
                  </>
                ) : (
                  `${product ? "Ubah" : "Simpan"} Produk`
                )}
              </button>
            </div>
            <div className="col-6 col-md-3">
              <button
                type="button"
                className="btn btn-secondary w-100"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Batal
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;
