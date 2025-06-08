# backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Impor fungsi logika dari modul yang sudah kita buat
from cluster_logic import calculate_fcm_clusters, calculate_elbow_sse

# Inisialisasi aplikasi FastAPI
app = FastAPI()

# --- Konfigurasi CORS ---
# Tentukan domain front-end yang diizinkan untuk mengakses API ini.
origins = [
    "http://localhost:5173", # Alamat default Vite React
    "http://12-7.0.0.1:5173",
    "http://localhost:5174", # TAMBAHKAN INI - Alamat baru dari server Vite Anda
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Mengizinkan semua metode (GET, POST, dll.)
    allow_headers=["*"], # Mengizinkan semua header
)
# --------------------

# Endpoint untuk mendapatkan hasil klastering FCM
@app.get("/api/clusters")
def get_clusters():
    """
    Endpoint untuk menjalankan klastering FCM dan mengembalikan hasilnya.
    """
    print(">>> Menerima permintaan di /api/clusters")
    result = calculate_fcm_clusters()
    return result

# Endpoint untuk mendapatkan hasil analisis Elbow Method
@app.get("/api/elbow-analysis")
def get_elbow_analysis():
    """
    Endpoint untuk menjalankan analisis Elbow dan mengembalikan hasilnya.
    """
    print(">>> Menerima permintaan di /api/elbow-analysis")
    result = calculate_elbow_sse()
    return result

# Endpoint sederhana untuk memeriksa apakah server berjalan
@app.get("/")
def read_root():
    return {"status": "Server back-end berjalan!"}