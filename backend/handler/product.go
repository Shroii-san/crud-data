package handler

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"github.com/gorilla/mux"
	"product-crud/backend/database"
	"product-crud/backend/model"
)

type ProductHandler struct {
	db *database.DB
}

func NewProductHandler(db *database.DB) *ProductHandler {
	return &ProductHandler{db: db}
}

// GetAllProducts handles GET /api/products
func (h *ProductHandler) GetAllProducts(w http.ResponseWriter, r *http.Request) {
	products, err := h.db.GetAllProducts()
	if err != nil {
		writeErrorResponse(w, http.StatusInternalServerError, "Gagal mengambil data produk")
		return
	}

	if products == nil {
		products = []model.Product{}
	}

	response := model.PaginatedResponse{
		Success: true,
		Message: "Data produk berhasil diambil",
		Data:    products,
		Total:   len(products),
	}

	writeJSONResponse(w, http.StatusOK, response)
}

// GetProductByID handles GET /api/products/:id
func (h *ProductHandler) GetProductByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		writeErrorResponse(w, http.StatusBadRequest, "ID produk tidak valid")
		return
	}

	product, err := h.db.GetProductByID(id)
	if err != nil {
		writeErrorResponse(w, http.StatusNotFound, "Produk tidak ditemukan")
		return
	}

	response := model.APIResponse{
		Success: true,
		Message: "Produk berhasil diambil",
		Data:    product,
	}

	writeJSONResponse(w, http.StatusOK, response)
}

// CreateProduct handles POST /api/products
func (h *ProductHandler) CreateProduct(w http.ResponseWriter, r *http.Request) {
	var req model.CreateProductRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeErrorResponse(w, http.StatusBadRequest, "Format data tidak valid")
		return
	}

	// Validasi input
	if validationError := validateProductInput(req.Name, req.Price, req.ProductType); validationError != "" {
		writeErrorResponse(w, http.StatusBadRequest, validationError)
		return
	}

	product, err := h.db.CreateProduct(req)
	if err != nil {
		writeErrorResponse(w, http.StatusInternalServerError, "Gagal membuat produk")
		return
	}

	response := model.APIResponse{
		Success: true,
		Message: "Produk berhasil dibuat",
		Data:    product,
	}

	writeJSONResponse(w, http.StatusCreated, response)
}

// UpdateProduct handles PUT /api/products/:id
func (h *ProductHandler) UpdateProduct(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		writeErrorResponse(w, http.StatusBadRequest, "ID produk tidak valid")
		return
	}

	var req model.UpdateProductRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeErrorResponse(w, http.StatusBadRequest, "Format data tidak valid")
		return
	}

	// Validasi input
	if validationError := validateProductInput(req.Name, req.Price, req.ProductType); validationError != "" {
		writeErrorResponse(w, http.StatusBadRequest, validationError)
		return
	}

	product, err := h.db.UpdateProduct(id, req)
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			writeErrorResponse(w, http.StatusNotFound, "Produk tidak ditemukan")
			return
		}
		writeErrorResponse(w, http.StatusInternalServerError, "Gagal mengubah produk")
		return
	}

	response := model.APIResponse{
		Success: true,
		Message: "Produk berhasil diubah",
		Data:    product,
	}

	writeJSONResponse(w, http.StatusOK, response)
}

// DeleteProduct handles DELETE /api/products/:id
func (h *ProductHandler) DeleteProduct(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		writeErrorResponse(w, http.StatusBadRequest, "ID produk tidak valid")
		return
	}

	err = h.db.DeleteProduct(id)
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			writeErrorResponse(w, http.StatusNotFound, "Produk tidak ditemukan")
			return
		}
		writeErrorResponse(w, http.StatusInternalServerError, "Gagal menghapus produk")
		return
	}

	response := model.APIResponse{
		Success: true,
		Message: "Produk berhasil dihapus",
		Data:    nil,
	}

	writeJSONResponse(w, http.StatusOK, response)
}

// Helper functions

func validateProductInput(name string, price float64, productType string) string {
	name = strings.TrimSpace(name)
	productType = strings.TrimSpace(productType)

	if name == "" {
		return "Nama produk harus diisi"
	}

	if len(name) < 3 {
		return "Nama produk minimal 3 karakter"
	}

	if len(name) > 255 {
		return "Nama produk maksimal 255 karakter"
	}

	if price <= 0 {
		return "Harga produk harus lebih dari 0"
	}

	if productType == "" {
		return "Tipe produk harus diisi"
	}

	if len(productType) > 100 {
		return "Tipe produk maksimal 100 karakter"
	}

	return ""
}

func writeJSONResponse(w http.ResponseWriter, statusCode int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(data)
}

func writeErrorResponse(w http.ResponseWriter, statusCode int, message string) {
	response := model.APIResponse{
		Success: false,
		Message: message,
		Data:    nil,
	}
	writeJSONResponse(w, statusCode, response)
}
