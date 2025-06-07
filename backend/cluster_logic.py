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
    
    cntr, u, u0, d, jm, p, fpc = fuzz.cluster.cmeans(
        features_for_fcm, n_clusters, 2, error=0.005, maxiter=1000, init=None
    )

    cluster_membership = np.argmax(u, axis=0)
    membership_values = np.max(u, axis=0)

    provinces_result = []
    for i, row in data_df.iterrows():
        provinces_result.append({
            "name": row['Provinsi'],
            "cluster": int(cluster_membership[i]),
            "membership": float(membership_values[i])
        })
    
    # Gunakan scaler yang sudah di-fit dengan benar untuk inverse_transform
    result = {
        "cluster_centers": scaler.inverse_transform(cntr).tolist(),
        "provinces": provinces_result
    }
    
    print("    - Perhitungan FCM selesai.")
    return result


def calculate_elbow_sse():
    """
    Menghitung Sum of Squared Error (SSE) untuk berbagai jumlah klaster (k).
    """
    data_df = load_data()
    if data_df is None:
        return None

    # Di fungsi ini, kita bisa tetap menggunakan cara lama karena tidak ada inverse_transform
    features_for_fcm = data_df[['Kasus Positif', 'Kasus Sembuh', 'Kasus Meninggal']].values.T
    scaler = MinMaxScaler()
    normalized_features = scaler.fit_transform(features_for_fcm)

    sse_scores = []
    k_range = range(2, 11)
    
    print("\n>>> Pesan dari cluster_logic.py: Memulai perhitungan SSE untuk Elbow Method...")
    for k in k_range:
        cntr, u, u0, d, jm, p, fpc = fuzz.cluster.cmeans(
            normalized_features, k, 2, error=0.005, maxiter=1000, init=None
        )
        sse = np.sum(d**2)
        sse_scores.append(sse)
        print(f"    - Selesai menghitung untuk k={k}, SSE={sse:.2f}")

    result = {
        "k_values": list(k_range),
        "sse_scores": [float(s) for s in sse_scores]
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