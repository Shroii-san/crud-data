# Product CRUD Web App

Web aplikasi CRUD produk sederhana dengan Go backend, React frontend, dan PostgreSQL database.

## Tech Stack

- **Backend**: Golang
- **Frontend**: React + Bootstrap CSS
- **Database**: PostgreSQL

## Setup & Instalasi

### 1. Setup Database PostgreSQL

```bash
# Buat database
createdb product_crud

# Connect ke database
psql -U postgres -d product_crud -f database.sql
```

**database.sql:**
```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    product_type VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Setup Backend (Golang)

```bash
cd backend
go mod tidy
go run main.go
```


Server akan berjalan di `http://localhost:8080`

### 3. Setup Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

## API Endpoints

```
GET    /api/products       - List semua produk
POST   /api/products       - Buat produk baru
GET    /api/products/:id   - Dapatkan detail produk
PUT    /api/products/:id   - Update produk
DELETE /api/products/:id   - Hapus produk
```

## Environment Variables

### Backend (.env)
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=product_crud
PORT=8080
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8080

# Default sudah benar, ikuti env example
```
