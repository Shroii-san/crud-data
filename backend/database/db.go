package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"product-crud/backend/model"

	_ "github.com/lib/pq"
)

type DB struct {
	conn *sql.DB
}

func NewConnection() *DB {
	host := getEnvOrDefault("DB_HOST")
	port := getEnvOrDefault("DB_PORT")
	user := getEnvOrDefault("DB_USER")
	password := getEnvOrDefault("DB_PASSWORD")
	dbname := getEnvOrDefault("DB_NAME")

	psqlInfo := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname,
	)

	conn, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	conn.SetMaxOpenConns(25)
	conn.SetMaxIdleConns(5)

	if err := conn.Ping(); err != nil {
		log.Fatalf("Database connection ping failed: %v", err)
	}

	log.Println("Database connected successfully")
	return &DB{conn: conn}
}

func (db *DB) Close() error {
	return db.conn.Close()
}

// GetAllProducts retrieves all products from database
func (db *DB) GetAllProducts() ([]model.Product, error) {
	query := `
		SELECT id, name, price, product_type, created_at, updated_at 
		FROM products 
		ORDER BY created_at DESC
	`

	rows, err := db.conn.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to query products: %w", err)
	}
	defer rows.Close()

	var products []model.Product
	for rows.Next() {
		var product model.Product
		err := rows.Scan(
			&product.ID,
			&product.Name,
			&product.Price,
			&product.ProductType,
			&product.CreatedAt,
			&product.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan product: %w", err)
		}
		products = append(products, product)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating products: %w", err)
	}

	return products, nil
}

// GetProductByID retrieves single product by ID
func (db *DB) GetProductByID(id int) (*model.Product, error) {
	query := `
		SELECT id, name, price, product_type, created_at, updated_at 
		FROM products 
		WHERE id = $1
	`

	var product model.Product
	err := db.conn.QueryRow(query, id).Scan(
		&product.ID,
		&product.Name,
		&product.Price,
		&product.ProductType,
		&product.CreatedAt,
		&product.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("product not found")
		}
		return nil, fmt.Errorf("failed to get product: %w", err)
	}

	return &product, nil
}

// CreateProduct inserts new product to database
func (db *DB) CreateProduct(req model.CreateProductRequest) (*model.Product, error) {
	query := `
		INSERT INTO products (name, price, product_type) 
		VALUES ($1, $2, $3) 
		RETURNING id, name, price, product_type, created_at, updated_at
	`

	var product model.Product
	err := db.conn.QueryRow(query, req.Name, req.Price, req.ProductType).Scan(
		&product.ID,
		&product.Name,
		&product.Price,
		&product.ProductType,
		&product.CreatedAt,
		&product.UpdatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to create product: %w", err)
	}

	return &product, nil
}

// UpdateProduct updates existing product
func (db *DB) UpdateProduct(id int, req model.UpdateProductRequest) (*model.Product, error) {
	query := `
		UPDATE products 
		SET name = $1, price = $2, product_type = $3, updated_at = CURRENT_TIMESTAMP
		WHERE id = $4 
		RETURNING id, name, price, product_type, created_at, updated_at
	`

	var product model.Product
	err := db.conn.QueryRow(query, req.Name, req.Price, req.ProductType, id).Scan(
		&product.ID,
		&product.Name,
		&product.Price,
		&product.ProductType,
		&product.CreatedAt,
		&product.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("product not found")
		}
		return nil, fmt.Errorf("failed to update product: %w", err)
	}

	return &product, nil
}

// DeleteProduct removes product by ID
func (db *DB) DeleteProduct(id int) error {
	query := "DELETE FROM products WHERE id = $1"

	result, err := db.conn.Exec(query, id)
	if err != nil {
		return fmt.Errorf("failed to delete product: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("product not found")
	}

	return nil
}

func getEnvOrDefault(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
