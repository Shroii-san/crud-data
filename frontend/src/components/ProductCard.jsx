import { formatCurrency, formatDate } from "../utils/formatter";

function ProductCard({ product, onEdit, onDelete, disabled }) {
  return (
    <div className="card h-100 shadow-sm hover-card">
      <div className="card-body d-flex flex-column">
        {/* Product Type Badge */}
        <div className="mb-2">
          <span className="badge bg-info text-dark small">
            {product.product_type}
          </span>
        </div>

        {/* Product Name */}
        <h5 className="card-title mb-3 text-truncate" title={product.name}>
          {product.name}
        </h5>

        {/* Product Price */}
        <div className="mb-3 flex-grow-1">
          <p className="text-primary fw-bold fs-5 mb-0">
            {formatCurrency(product.price)}
          </p>
          <small className="text-muted">{formatDate(product.created_at)}</small>
        </div>

        {/* Action Buttons */}
        <div className="d-grid gap-2">
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={onEdit}
            disabled={disabled}
          >
            Edit
          </button>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={onDelete}
            disabled={disabled}
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
