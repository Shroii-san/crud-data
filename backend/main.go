package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"

	"product-crud/backend/database"
	"product-crud/backend/handler"
	"product-crud/backend/middleware"
)

func init() {
	godotenv.Load()
}

func main() {
	// Initialize database
	db := database.NewConnection()
	defer db.Close()

	// Initialize router
	router := mux.NewRouter()

	// Initialize product handler
	productHandler := handler.NewProductHandler(db)

	// API routes
	apiRouter := router.PathPrefix("/api").Subrouter()

	// Product endpoints
	// Product endpoints - Tambahkan "OPTIONS" di setiap .Methods()
    apiRouter.HandleFunc("/products", productHandler.GetAllProducts).Methods("GET", "OPTIONS")
    apiRouter.HandleFunc("/products", productHandler.CreateProduct).Methods("POST", "OPTIONS")
    apiRouter.HandleFunc("/products/{id}", productHandler.GetProductByID).Methods("GET", "OPTIONS")
    apiRouter.HandleFunc("/products/{id}", productHandler.UpdateProduct).Methods("PUT", "OPTIONS")
    apiRouter.HandleFunc("/products/{id}", productHandler.DeleteProduct).Methods("DELETE", "OPTIONS")

	// Apply CORS middleware
	router.Use(middleware.EnableCORS)

	// Get port from environment or use default
	port := getEnvOrDefault("PORT", "8080")

	// Start server
	log.Printf("Server starting on port %s...\n", port)
    if err := http.ListenAndServe(":"+port, middleware.EnableCORS(router)); err != nil {
        log.Fatalf("Server failed to start: %v", err)
    }
}

func getEnvOrDefault(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
