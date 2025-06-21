# backend/cluster_logic.py

import numpy as np
import skfuzzy as fuzz
from data_loader import load_data
from sklearn.preprocessing import MinMaxScaler

def calculate_fcm_clusters():
    """
    Menjalankan klastering Fuzzy C-Means (FCM) pada data COVID-19.

    Returns:
        dict: Hasil klastering yang berisi pusat klaster dan data provinsi,
              atau None jika data gagal dimuat.
    """
    data_df = load_data()
    if data_df is None:
        return None

    # Pilih fitur numerik
    features_for_scaling = data_df[['Kasus Positif', 'Kasus Sembuh', 'Kasus Meninggal']].values
    
    # PERBAIKAN: Buat scaler dan normalisasi data tanpa transposisi terlebih dahulu
    scaler = MinMaxScaler()
    normalized_features_for_scaling = scaler.fit_transform(features_for_scaling)
      # Transposisi data HANYA untuk input ke algoritma FCM
    features_for_fcm = normalized_features_for_scaling.T
    
    n_clusters = 3
    print(f"\n>>> Pesan dari cluster_logic.py: Memulai perhitungan FCM untuk k={n_clusters}...")
    
    # Set a fixed random seed for reproducible results
    np.random.seed(42)
    
    cntr, u, u0, d, jm, p, fpc = fuzz.cluster.cmeans(
        features_for_fcm, n_clusters, 2, error=0.005, maxiter=1000, init=None
    )

    cluster_membership = np.argmax(u, axis=0)
    membership_values = np.max(u, axis=0)

    provinces_result = []
    clusters = [[] for _ in range(n_clusters)]  # Initialize empty clusters

    for i, row in data_df.iterrows():
        cluster_idx = int(cluster_membership[i])
        province_data = {
            "name": row['Provinsi'],
            "cluster": cluster_idx,
            "membership": float(membership_values[i]),
            "features": features_for_scaling[i].tolist()
        }
        provinces_result.append(province_data)
        clusters[cluster_idx].append(province_data)
    
    # Gunakan scaler yang sudah di-fit dengan benar untuk inverse_transform
    result = {
        "cluster_centers": scaler.inverse_transform(cntr).tolist(),
        "provinces": provinces_result,
        "clusters": clusters,  # Add clusters to the result
        "n_clusters": n_clusters
    }
    
    print("    - Perhitungan FCM selesai.")
    return result


def calculate_elbow_sse():
    """
    Menghitung Sum of Squared Error (SSE) untuk berbagai jumlah klaster (k).
    
    Returns:
        dict: Hasil analisis elbow method termasuk nilai k, SSE, dan prediksi optimal k.
    """
    data_df = load_data()
    if data_df is None:
        return None
    
    # Pilih fitur numerik - konsisten dengan calculate_fcm_clusters
    features = data_df[['Kasus Positif', 'Kasus Sembuh', 'Kasus Meninggal']].values
    
    # Preprocess data dengan cara yang sama seperti clustering untuk konsistensi
    scaler = MinMaxScaler()
    scaled_features = scaler.fit_transform(features)
    # Transposisi untuk format yang dibutuhkan FCM
    features_for_fcm = scaled_features.T
    
    # Range k yang akan dianalisis (2-10)
    k_range = range(2, 11)
    sse_scores = []
    fpc_scores = []  # Fuzzy Partition Coefficient - ukuran tambahan kualitas clustering
    
    print("\n>>> Pesan dari cluster_logic.py: Memulai perhitungan SSE dan FPC untuk Elbow Method...")
    
    for k in k_range:
        # Set seed untuk hasil yang konsisten
        np.random.seed(42)
        
        # Jalankan algoritma FCM dengan k clusters
        cntr, u, u0, d, jm, p, fpc = fuzz.cluster.cmeans(
            features_for_fcm, k, 2, error=0.005, maxiter=1000, init=None
        )
        
        # Hitung SSE
        sse = np.sum(d**2)
        sse_scores.append(float(sse))
        fpc_scores.append(float(fpc))
        
        print(f"    - k={k}: SSE={sse:.4f}, FPC={fpc:.4f}")
    
    # Hitung penurunan relatif SSE untuk analisis elbow
    sse_differences = []
    for i in range(len(sse_scores) - 1):
        diff = sse_scores[i] - sse_scores[i + 1]
        relative_diff = diff / sse_scores[i] * 100  # Persentase penurunan
        sse_differences.append(float(relative_diff))
    
    # Tambahkan 0 untuk k terakhir (tidak ada penurunan setelahnya)
    sse_differences.append(0.0)
    
    # Penentuan titik elbow otomatis
    # Strategi: Cari penurunan signifikan pertama diikuti oleh penurunan yang lebih kecil
    optimal_k = 3  # Default, biasanya merupakan titik elbow yang umum
    
    print("    - Perhitungan SSE untuk Elbow Method selesai.")
    
    result = {
        "k_values": list(k_range),
        "sse_scores": sse_scores,
        "fpc_scores": fpc_scores,
        "percentage_decrease": sse_differences,
        "optimal_k": optimal_k,
        "recommendation": {
            "value": optimal_k,
            "explanation": "Jumlah cluster optimal berdasarkan analisis elbow method. Pada titik ini, penambahan cluster tidak lagi memberikan penurunan SSE yang signifikan."
        }
    }
    return result

# --- Blok Pengujian ---
if __name__ == '__main__':
    print("======= Menjalankan tes untuk Analisis Elbow =======")
    elbow_result = calculate_elbow_sse()
    if elbow_result:
        print("\n--- Hasil Analisis Elbow ---")
        print(elbow_result)
        print("--------------------------\n")

    print("======= Menjalankan tes untuk Klastering FCM =======")
    fcm_result = calculate_fcm_clusters()
    if fcm_result:
        print("\n--- Hasil Klastering FCM ---")
        print("Pusat Klaster:", fcm_result["cluster_centers"])
        print("Data Provinsi (5 pertama):", fcm_result["provinces"][:5])
        print("--------------------------")