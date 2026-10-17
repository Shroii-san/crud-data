import { useState, useEffect } from "react";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";
import { productApi } from "./services/api";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    const result = await productApi.getAll();
    if (result.success) {
      setProducts(result.data || []);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const handleAddNewClick = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    let result;

    if (editingProduct) {
      result = await productApi.update(editingProduct.id, formData);
    } else {
      result = await productApi.create(formData);
    }

    if (result.success) {
      setSuccessMessage(
        editingProduct
          ? "Produk berhasil diubah"
          : "Produk berhasil ditambahkan",
      );
      setShowForm(false);
      setEditingProduct(null);
      await loadProducts();
    } else {
      setError(result.message);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const result = await productApi.delete(id);
    if (result.success) {
      setSuccessMessage("Produk berhasil dihapus");
      await loadProducts();
    } else {
      setError(result.message);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <header className="bg-primary text-white sticky-top shadow-sm">
        <div className="container-fluid py-3 py-md-4">
          <div className="row align-items-center">
            <div className="col">
              <h1 className="mb-0 fs-5 fs-md-3">Manajemen Produk</h1>
            </div>
            <div className="col-auto">
              <button
                className="btn btn-light btn-sm"
                onClick={handleAddNewClick}
                disabled={loading}
              >
                Tambah Produk
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-fluid py-4 py-md-5">
        {/* Alert Messages */}
        {successMessage && (
          <div
            className="alert alert-success alert-dismissible fade show mb-4"
            role="alert"
          >
            <strong>Sukses!</strong> {successMessage}
            <button
              type="button"
              className="btn-close"
              onClick={() => setSuccessMessage(null)}
            ></button>
          </div>
        )}

        {error && (
          <div
            className="alert alert-danger alert-dismissible fade show mb-4"
            role="alert"
          >
            <strong>Kesalahan!</strong> {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => setError(null)}
            ></button>
          </div>
        )}

        {/* Form Section */}
        {showForm && (
          <div className="mb-4">
            <ProductForm
              product={editingProduct}
              onSubmit={handleFormSubmit}
              onCancel={handleFormClose}
            />
          </div>
        )}

        {/* Products List/Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Memuat data produk...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted mb-0">
              Belum ada produk. Klik "Tambah Produk" untuk membuat yang baru.
            </p>
          </div>
        ) : (
          <ProductList
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        )}
      </main>
    </div>
  );
}

export default App;
