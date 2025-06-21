# SiKov-Clust: Sistem Klasterisasi COVID-19

SiKov-Clust adalah aplikasi berbasis web untuk visualisasi dan analisis klasterisasi data COVID-19 di Indonesia dengan menggunakan algoritma Fuzzy C-Means. Aplikasi ini terdiri dari frontend React dan backend FastAPI yang menyediakan analisis data dan perhitungan klaster.

## Fitur Utama

- Visualisasi peta Indonesia dengan pewarnaan provinsi berdasarkan klaster
- Analisis Elbow Method untuk menentukan jumlah klaster optimal
- Implementasi algoritma Fuzzy C-Means yang deterministik dan konsisten
- Pengelompokan provinsi berdasarkan kasus positif, sembuh, dan meninggal
- Detail statistik untuk setiap provinsi dan klaster
- Kontrol dinamis untuk mengubah rentang nilai K dalam analisis Elbow Method

## Persyaratan Sistem

### Frontend
- Node.js (v16.0 atau lebih tinggi)
- npm atau yarn

### Backend
- Python 3.8 atau lebih tinggi
- pip (package manager Python)

## Struktur Proyek

```
sistem_klasterisasi_covid/
│
├── backend/                 # Kode backend Python/FastAPI
│   ├── data/                # Data COVID-19
│   │   └── data_covid.csv   # Dataset provinsi Indonesia
│   ├── cluster_logic.py     # Logika klasterisasi Fuzzy C-Means
│   ├── data_loader.py       # Modul untuk memuat data
│   ├── main.py              # Entry point aplikasi FastAPI
│   └── requirements.txt     # Dependensi Python
│
├── public/                  # Assets publik
│   └── icon.png             # Ikon aplikasi
│
├── src/                     # Kode frontend React
│   ├── assets/              # Assets frontend
│   │   └── indonesia-prov.geojson  # Data geografis Indonesia
│   ├── components/          # Komponen React
│   └── utils/               # Utilitas
│
├── index.html               # Entry point HTML
└── package.json             # Konfigurasi dan dependensi npm
```

## Panduan Instalasi dan Menjalankan Proyek

### Langkah 1: Clone atau Download Repositori

```bash
# Jika menggunakan Git
git clone https://github.com/username/sistem_klasterisasi_covid.git
cd sistem_klasterisasi_covid

# Atau download dan ekstrak ZIP dari repositori
# kemudian masuk ke direktori hasil ekstrak
```

### Langkah 2: Setup Frontend

```bash
# Install dependensi frontend
npm install

# Jalankan server development
npm run dev
```

Server development akan berjalan di `http://localhost:5173`.

### Langkah 3: Setup Backend

```bash
# Pindah ke direktori backend
cd backend

# Buat virtual environment Python (opsional tapi disarankan)
python -m venv venv

# Aktifkan virtual environment
# Untuk Windows:
venv\Scripts\activate
# Untuk macOS/Linux:
source venv/bin/activate

# Install dependensi backend
pip install -r requirements.txt

# Jalankan server FastAPI
python -m uvicorn main:app --reload
```

Server backend akan berjalan di `http://localhost:8000`.

### Langkah 4: Akses Aplikasi

Buka browser dan kunjungi `http://localhost:5173` untuk mengakses aplikasi.

## Panduan Penggunaan Aplikasi

### 1. Dashboard Utama

Saat pertama kali membuka aplikasi, Anda akan melihat dashboard utama yang menampilkan:
- Peta Indonesia dengan provinsi yang dikelompokkan berdasarkan klaster
- Grafik analisis Elbow Method untuk menentukan jumlah klaster optimal

### 2. Menjelajahi Peta Klaster

- **Hover pada provinsi**: Menampilkan informasi detail provinsi termasuk nama, klaster, dan statistik COVID-19
- **Panel Legend**: Menunjukkan warna untuk setiap klaster dan statistik terkait
- **Dropdown Filter**: Memungkinkan melihat statistik berdasarkan:
  - Nilai rata-rata klaster
  - Rentang nilai statistik

### 3. Analisis Elbow Method

- Grafik menampilkan analisis untuk menentukan jumlah klaster optimal
- **Input K-min dan K-max**: Mengubah rentang nilai K untuk analisis
- **Tombol Hitung Ulang**: Menjalankan kembali analisis Elbow Method dengan rentang nilai K baru

### 4. Konsol Log

- Buka konsol browser (F12) untuk melihat daftar provinsi yang dikelompokkan berdasarkan klaster

## Detail Implementasi Teknis

### Algoritma Klasterisasi

Aplikasi menggunakan implementasi manual algoritma Fuzzy C-Means dengan fitur:
- Reproduksibilitas melalui parameter `seed` dan `init`
- Normalisasi data menggunakan MinMaxScaler manual
- Deteksi otomatis jumlah klaster optimal melalui analisis Elbow Method
- Pengurutan klaster berdasarkan rata-rata kasus positif

### FastAPI Backend

- Endpoint `/api/clusters`: Mengembalikan hasil klasterisasi provinsi
- Endpoint `/api/elbow-analysis`: Mengembalikan hasil analisis Elbow Method dengan parameter opsional `k_min` dan `k_max`
- Endpoint `/api/clear-cache`: Menghapus cache hasil perhitungan

### Frontend React

- Visualisasi peta menggunakan Leaflet dan React-Leaflet
- Visualisasi grafik menggunakan Chart.js dan React-Chartjs-2
- State management dengan React Hooks

## Troubleshooting

### Masalah Backend

1. **Error saat menjalankan backend**:
   ```
   Pastikan semua dependensi terinstal: pip install -r requirements.txt
   ```

2. **Masalah terkait matplotlib**:
   ```
   Backend menggunakan matplotlib.use('Agg') untuk menghindari issues di lingkungan headless
   ```

### Masalah Frontend

1. **Error CORS**:
   ```
   Pastikan backend berjalan dan origins di main.py mengizinkan domain frontend Anda
   ```

2. **Data tidak muncul di peta**:
   ```
   Periksa konsol browser untuk error dan pastikan path ke GeoJSON benar
   ```

## Pengembangan Lanjutan

Untuk pengembangan lebih lanjut, Anda dapat:

1. Menambahkan algoritma klasterisasi lain untuk perbandingan
2. Menambahkan visualisasi tambahan seperti statistik temporal
3. Mengintegrasikan data COVID-19 terbaru melalui API eksternal
4. Menambahkan fitur export hasil klasterisasi (CSV, PDF)

## Deployment

Untuk informasi tentang deployment ke server produksi, lihat:
- [Panduan Deployment SSH](deployment-ssh.md) - untuk deployment via SSH
- [Panduan Deployment Alternatif](deployment-alternative.md) - untuk shared hosting
- [Panduan Deployment Bisnis](deployment-business.md) - untuk paket bisnis Hostinger

## Kontributor

SiKov-Clust dikembangkan oleh:
- Nama Anda
- Anggota Tim Lainnya

---

© 2025 SiKov-Clust. Dibuat sebagai proyek [Nama Mata Kuliah/Proyek].
