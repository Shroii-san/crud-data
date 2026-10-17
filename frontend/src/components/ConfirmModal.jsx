import { useEffect, useRef } from "react";
import * as bootstrap from "bootstrap";

function ConfirmModal({
  show,
  title,
  message,
  onConfirm,
  onCancel,
  isLoading,
}) {
  const modalRef = useRef(null);
  const modalInstanceRef = useRef(null);

  useEffect(() => {
    // 1. Inisialisasi instance Bootstrap Modal sekali saja saat komponen dipasang
    if (modalRef.current && !modalInstanceRef.current) {
      modalInstanceRef.current = new bootstrap.Modal(modalRef.current, {
        backdrop: "static",
        keyboard: false,
      });
    }

    // 2. Kontrol buka/tutup modal berdasarkan prop `show`
    if (modalInstanceRef.current) {
      if (show) {
        modalInstanceRef.current.show();
      } else {
        modalInstanceRef.current.hide();
      }
    }

    // 3. Cleanup instance saat komponen unmount agar tidak meninggalkan backdrop
    return () => {
      if (modalInstanceRef.current) {
        modalInstanceRef.current.hide();
      }
    };
  }, [show]);

  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    if (!isLoading) {
      onCancel();
    }
  };

  return (
    <div
      className="modal fade"
      id="confirmModal"
      tabIndex="-1"
      aria-labelledby="confirmModalLabel"
      aria-hidden="true"
      ref={modalRef} // Menggunakan ref alih-alih getElementById
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-danger bg-gradient text-white">
            <h5 className="modal-title" id="confirmModalLabel">
              {title}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={handleCancel}
              disabled={isLoading}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">{message}</div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Batal
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Menghapus...
                </>
              ) : (
                "Hapus"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
