import ProductCard from './ProductCard'
import ConfirmModal from './ConfirmModal'
import { useState } from 'react'

function ProductList({ products, onEdit, onDelete, loading }) {
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState(null)
  const [selectedProductName, setSelectedProductName] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteClick = (product) => {
    setSelectedProductId(product.id)
    setSelectedProductName(product.name)
    setShowConfirmModal(true)
  }

  const handleConfirmDelete = async () => {
    setIsDeleting(true)
    await onDelete(selectedProductId)
    setIsDeleting(false)
    setShowConfirmModal(false)
    setSelectedProductId(null)
    setSelectedProductName(null)
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">Belum ada produk yang tersedia</p>
      </div>
    )
  }

  return (
    <>
      <div className="row g-3 g-md-4">
        {products.map((product) => (
          <div key={product.id} className="col-12 col-sm-6 col-lg-4">
            <ProductCard
              product={product}
              onEdit={() => onEdit(product)}
              onDelete={() => handleDeleteClick(product)}
              disabled={loading || isDeleting}
            />
          </div>
        ))}
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        show={showConfirmModal}
        title="Hapus Produk"
        message={`Apakah Anda yakin ingin menghapus produk "${selectedProductName}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowConfirmModal(false)
          setSelectedProductId(null)
          setSelectedProductName(null)
        }}
        isLoading={isDeleting}
      />
    </>
  )
}

export default ProductList
