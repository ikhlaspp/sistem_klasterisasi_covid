# SiKov-Clust: Sistem Klasterisasi COVID-19

SiKov-Clust adalah aplikasi berbasis web untuk visualisasi dan analisis klasterisasi data COVID-19 di Indonesia menggunakan algoritma Fuzzy C-Means.

## Cara Menjalankan Aplikasi

### Kebutuhan Sistem
- **Frontend**: Node.js v16.0+ dan npm/yarn
- **Backend**: Python 3.8+ dan pip

### Langkah 1: Persiapan Awal

```bash
# Clone repository (jika menggunakan Git)
git clone https://github.com/username/sistem_klasterisasi_covid.git
cd sistem_klasterisasi_covid

# Atau download dan ekstrak ZIP dari repositori
```

### Langkah 2: Menjalankan Frontend

```bash
# Install dependensi frontend
npm install

# Jalankan server development
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

### Langkah 3: Menjalankan Backend

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

Backend akan berjalan di `http://localhost:8000`

### Langkah 4: Akses Aplikasi
Buka browser dan kunjungi `http://localhost:5173`

### Cara Cepat (Alternatif)
Jika sudah pernah menginstal dependensi:

1. **Frontend (Terminal 1)**
   ```bash
   npm run dev
   ```

2. **Backend (Terminal 2)**
   ```bash
   cd backend
   # Aktifkan virtual environment jika ada
   venv\Scripts\activate  # Windows
   # source venv/bin/activate  # macOS/Linux
   python -m uvicorn main:app --reload
   ```

## Cara Menggunakan Aplikasi

1. Pada halaman utama, lihat peta Indonesia dengan provinsi yang dikelompokkan dalam klaster
2. Gunakan panel kontrol untuk menyesuaikan jumlah klaster:
   - Masukkan nilai K-min dan K-max untuk analisis Elbow
   - Klik "Hitung Ulang" untuk memperbarui analisis
3. Hover pada provinsi untuk melihat detail statistik COVID-19
4. Lihat panel legend untuk informasi tentang setiap klaster

## Fitur Utama

- Visualisasi peta Indonesia dengan pewarnaan provinsi berdasarkan klaster
- Analisis Elbow Method untuk menentukan jumlah klaster optimal
- Implementasi algoritma Fuzzy C-Means yang deterministik
- Kontrol dinamis untuk mengubah rentang nilai K dalam analisis

## Troubleshooting

### Masalah Umum dan Solusi

1. **Error saat menjalankan backend**
   ```
   Pastikan semua dependensi terinstal: pip install -r requirements.txt
   ```

2. **Error CORS**
   ```
   Pastikan backend berjalan dan origins di main.py mengizinkan domain frontend Anda
   ```

3. **Data tidak muncul di peta**
   ```
   Periksa konsol browser untuk error dan pastikan backend merespons dengan benar
   ```

4. **Matplotlib error**
   ```
   Backend menggunakan matplotlib.use('Agg') untuk menghindari masalah di lingkungan headless
   ```

## Struktur Proyek

```
sistem_klasterisasi_covid/
├── backend/                 # Backend Python/FastAPI
│   ├── data/                # Data COVID-19
│   ├── cluster_logic.py     # Algoritma Fuzzy C-Means
│   ├── data_loader.py       # Modul untuk memuat data
│   ├── main.py              # Entry point aplikasi FastAPI
│   └── requirements.txt     # Dependensi Python
├── src/                     # Frontend React
│   ├── assets/              # Termasuk GeoJSON Indonesia
│   ├── components/          # Komponen React
│   └── utils/               # Utilitas
├── index.html               # Entry point HTML
└── package.json             # Konfigurasi npm
```

## Kontributor

SiKov-Clust dikembangkan oleh:
- Nama Anda
- Anggota Tim Lainnya

---

© 2025 SiKov-Clust
