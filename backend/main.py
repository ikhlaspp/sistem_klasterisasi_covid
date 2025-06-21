# backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Impor fungsi logika dari modul yang sudah kita buat
from cluster_logic import calculate_fcm_clusters, calculate_elbow_sse

# Cache results for static responses
CLUSTER_CACHE = None
ELBOW_CACHE = None

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
    Menggunakan hasil analisis elbow untuk menentukan jumlah klaster optimal.
    Hasil akan di-cache setelah perhitungan pertama.
    """
    global CLUSTER_CACHE, ELBOW_CACHE
    print(">>> Menerima permintaan di /api/clusters")
    
    # First get elbow results to determine optimal k
    elbow_result = None
    if ELBOW_CACHE is not None:
        print("    - Using cached elbow analysis result")
        elbow_result = ELBOW_CACHE
    else:
        print("    - Calculating elbow analysis first")
        elbow_result = calculate_elbow_sse()
        ELBOW_CACHE = elbow_result
        
    # Return cached cluster result if available
    if CLUSTER_CACHE is not None:
        print("    - Returning cached cluster result")
        return CLUSTER_CACHE
    
    # Calculate and cache the result using elbow result
    result = calculate_fcm_clusters(elbow_result=elbow_result)
    CLUSTER_CACHE = result
    print(f"    - Calculated and cached new cluster result with k={result['n_clusters']}")
    return result

# Endpoint untuk mendapatkan hasil analisis Elbow Method
@app.get("/api/elbow-analysis")
def get_elbow_analysis():
    """
    Endpoint untuk menjalankan analisis Elbow dan mengembalikan hasilnya.
    Hasil akan di-cache setelah perhitungan pertama.
    """
    global ELBOW_CACHE
    print(">>> Menerima permintaan di /api/elbow-analysis")
    
    # Return cached result if available
    if ELBOW_CACHE is not None:
        print("    - Returning cached elbow analysis result")
        return ELBOW_CACHE
    
    # Calculate and cache the result
    result = calculate_elbow_sse()
    ELBOW_CACHE = result
    print("    - Calculated and cached new elbow analysis result")
    return result

# Endpoint untuk menghapus cache dan memaksa perhitungan ulang
@app.get("/api/clear-cache")
def clear_cache():
    """
    Endpoint untuk menghapus cache dan memaksa perhitungan ulang saat request berikutnya.
    """
    global CLUSTER_CACHE, ELBOW_CACHE
    CLUSTER_CACHE = None
    ELBOW_CACHE = None
    return {"status": "Cache has been cleared. Next requests will recalculate results."}

# Endpoint sederhana untuk memeriksa apakah server berjalan
@app.get("/")
def read_root():
    return {"status": "Server back-end berjalan!"}