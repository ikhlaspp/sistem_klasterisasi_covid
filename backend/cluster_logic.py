import math
import random 
import numpy as np
from data_loader import load_data
import matplotlib
matplotlib.use('Agg')  
import matplotlib.pyplot as plt 


def manual_minmax_scaler(data):

    if not data:
        return [], None

    num_features = len(data[0])
    min_vals = [float('inf')] * num_features
    max_vals = [float('-inf')] * num_features

    for point in data:
        for i in range(num_features):
            if point[i] < min_vals[i]:
                min_vals[i] = point[i]
            if point[i] > max_vals[i]:
                max_vals[i] = point[i]

    normalized_data = []
    scaler_params = {'min': min_vals, 'max': max_vals}

    for point in data:
        normalized_point = []
        for i in range(num_features):
            if max_vals[i] - min_vals[i] == 0:
                 normalized_point.append(0.0) 
            else:
                normalized_point.append((point[i] - min_vals[i]) / (max_vals[i] - min_vals[i]))
        normalized_data.append(normalized_point)

    return normalized_data, scaler_params

# --- Fungsi untuk Inverse Transform (Manual) ---
def manual_inverse_transform(normalized_data, scaler_params):
    if not normalized_data or not scaler_params:
        return []

    min_vals = scaler_params['min']
    max_vals = scaler_params['max']
    num_features = len(min_vals)

    original_data = []
    for point in normalized_data:
        original_point = []
        for i in range(num_features):
             if max_vals[i] - min_vals[i] == 0:
                  original_point.append(min_vals[i]) 
             else:
                  original_point.append(point[i] * (max_vals[i] - min_vals[i]) + min_vals[i])
        original_data.append(original_point)

    return original_data


# --- Fungsi untuk Menghitung Jarak Euclidean (Manual) ---
def manual_euclidean_distance(point1, point2):

    if len(point1) != len(point2):
        raise ValueError("Kedua titik harus memiliki dimensi yang sama.")
    sum_sq_diff = 0
    for i in range(len(point1)):
        sum_sq_diff += (point1[i] - point2[i]) ** 2
    return math.sqrt(sum_sq_diff)

# --- Implementasi Fuzzy C-Means (Manual) ---
def manual_fuzzy_cmeans(data, k, fuzziness=2, max_iter=1000, error=0.005, seed=0, init=None):
    
    num_data = len(data)
    if num_data == 0:
        print("!!! ERROR di manual_fuzzy_cmeans: Data kosong.")
        return None, None, None

    num_features = len(data[0])
    if num_features == 0:
         print("!!! ERROR di manual_fuzzy_cmeans: Data tanpa fitur.")
         return None, None, None

    if k <= 1 or k > num_data:
         print(f"!!! ERROR di manual_fuzzy_cmeans: Jumlah klaster K ({k}) tidak valid.")
         return None, None, None

    if seed is not None:
        random.seed(seed)
        if np:
            np.random.seed(seed)
        print(f"    - Menggunakan seed={seed} untuk reproduksibilitas.")
    
    u = []
    if init is not None:
        try:
            if isinstance(init, list) and len(init) == num_data:
                u = init.copy()
                print(f"    - Menggunakan inisialisasi keanggotaan yang disediakan.")
            else:
                print(f"    - Format init tidak didukung, menggunakan inisialisasi acak.")
                raise ValueError("Format inisialisasi tidak didukung")
        except:
            init = None
    
    if init is None:
        for _ in range(num_data):
            row = [random.random() for _ in range(k)]
            row_sum = sum(row)
            if row_sum == 0:
                 row = [1.0 / k] * k
            else:
                 row = [val / row_sum for val in row]
            u.append(row)

    centers = None
    u_old = None

    print(f"    - Memulai iterasi FCM manual untuk k={k}...")
    
    for iteration in range(max_iter):
        centers = []
        for j in range(k):
            numerator = [0.0] * num_features
            denominator = 0.0
            for i in range(num_data):
                membership_power = u[i][j] ** fuzziness
                denominator += membership_power
                for feat in range(num_features):
                    numerator[feat] += membership_power * data[i][feat]

            center_j = []
            if denominator == 0:
                center_j = [random.random() for _ in range(num_features)]
            else:
                center_j = [num / denominator for num in numerator]
            centers.append(center_j)

        u_old = [list(row) for row in u]
        u = []

        max_u_change = 0.0
        
        for i in range(num_data):
            distances_sq = []
            for j in range(k):
                 dist = manual_euclidean_distance(data[i], centers[j])
                 distances_sq.append(dist ** 2)

            row_u = []
            for j in range(k):
                if distances_sq[j] == 0:
                    new_membership = 1.0
                else:
                    sum_denominator = 0.0
                    zero_distance_found = False
                    for l in range(k):
                         if distances_sq[l] == 0:
                              zero_distance_found = True
                              break

                    if zero_distance_found:
                         if distances_sq[j] == 0:
                              new_membership = 1.0
                         else:
                              new_membership = 0.0
                    else:
                         for l in range(k):
                              sum_denominator += (distances_sq[j] / distances_sq[l])
                         new_membership = 1.0 / sum_denominator
                         
                row_u.append(new_membership)

            u.append(row_u)

            if u_old:
                 row_change = 0.0
                 for j in range(k):
                      change = abs(u[i][j] - u_old[i][j])
                      if change > row_change:
                           row_change = change
                 if row_change > max_u_change:
                      max_u_change = row_change

        if u_old and max_u_change < error:
            print(f"    - Konvergensi tercapai setelah {iteration + 1} iterasi.")
            break

    sse = 0.0
    for i in range(num_data):
         for j in range(k):
              dist = manual_euclidean_distance(data[i], centers[j])
              sse += (u[i][j] ** fuzziness) * (dist ** 2)

    return centers, u, sse

def calculate_fcm_clusters(n_clusters=None, elbow_result=None):
    data_df = load_data()
    if data_df is None:
        return None

    if n_clusters is None:
        if elbow_result and "optimal_k" in elbow_result:
            n_clusters = elbow_result["optimal_k"]
            print(f"\n>>> Menggunakan jumlah cluster optimal dari parameter: k={n_clusters}")
        else:
            print("\n>>> Menentukan jumlah cluster optimal menggunakan metode Elbow...")
            elbow_result = calculate_elbow_sse()
            
            if elbow_result and "optimal_k" in elbow_result:
                n_clusters = elbow_result["optimal_k"]
                print(f">>> Jumlah cluster optimal berdasarkan analisis Elbow: k={n_clusters}")
            else:
                n_clusters = 3
                print(f">>> Tidak dapat menentukan k optimal, menggunakan default: k={n_clusters}")

    # Pilih fitur numerik
    features_for_scaling = data_df[['Kasus Positif', 'Kasus Sembuh', 'Kasus Meninggal']].values
    
    # Konversi ke list untuk fungsi manual
    features_list = features_for_scaling.tolist()
    
    # Normalisasi data secara manual
    normalized_features, scaler_params = manual_minmax_scaler(features_list)
    
    print(f"\n>>> Pesan dari cluster_logic.py: Memulai perhitungan FCM untuk k={n_clusters}...")
    
    # Set a fixed random seed for reproducible results
    # random.seed(42)
    # np.random.seed(42)
      # Menggunakan fungsi FCM manual
    centers, u, _ = manual_fuzzy_cmeans(
        normalized_features, n_clusters, fuzziness=2, max_iter=1000, error=0.005, seed=0, init=None
    )

    if centers is None or u is None:
        print("!!! ERROR saat menjalankan FCM manual.")
        return None

    # Tentukan keanggotaan klaster dan nilai keanggotaan maksimum untuk setiap data
    cluster_membership = []
    membership_values = []
    for row in u:
        max_membership = max(row)
        assigned_cluster = row.index(max_membership)
        cluster_membership.append(assigned_cluster)
        membership_values.append(max_membership)

    provinces_result = []
    clusters = [[] for _ in range(n_clusters)]  # Initialize empty clusters

    for i, row in data_df.iterrows():
        cluster_idx = cluster_membership[i]
        province_data = {
            "name": row['Provinsi'],
            "cluster": cluster_idx,
            "membership": float(membership_values[i]),
            "features": features_list[i]
        }
        provinces_result.append(province_data)
        clusters[cluster_idx].append(province_data)
      # Inverse transform pusat klaster kembali ke skala asli
    original_centers = manual_inverse_transform(centers, scaler_params)
    
    # Reorder clusters based on average positive cases (first feature)
    # Calculate average positive cases for each cluster
    cluster_avg_positives = []
    for i in range(n_clusters):
        if clusters[i]:  # Make sure cluster is not empty
            # Calculate average positive cases (first feature in features)
            avg_positives = sum(province["features"][0] for province in clusters[i]) / len(clusters[i])
            cluster_avg_positives.append((i, avg_positives))
        else:
            cluster_avg_positives.append((i, 0))  # Default for empty clusters
    
    # Sort clusters by average positive cases (descending)
    cluster_avg_positives.sort(key=lambda x: x[1], reverse=True)
    
    # Create mapping from old cluster index to new cluster index
    cluster_mapping = {old_idx: new_idx for new_idx, (old_idx, _) in enumerate(cluster_avg_positives)}
    
    # Reorder centers
    reordered_centers = [original_centers[old_idx] for old_idx, _ in cluster_avg_positives]
    
    # Update cluster assignments in provinces data
    for province in provinces_result:
        old_cluster = province["cluster"]
        province["cluster"] = cluster_mapping[old_cluster]
    
    # Reorder clusters list
    reordered_clusters = [[] for _ in range(n_clusters)]
    for old_idx, new_idx in cluster_mapping.items():
        reordered_clusters[new_idx] = clusters[old_idx]
        # Update cluster field in each province in this cluster
        for province in reordered_clusters[new_idx]:
            province["cluster"] = new_idx
    
    print("    - Mengurutkan cluster berdasarkan rata-rata kasus positif (tertinggi ke terendah).")
    for new_idx, (old_idx, avg) in enumerate(cluster_avg_positives):
        print(f"      Cluster {new_idx} (asalnya {old_idx}): {avg:.2f} kasus positif rata-rata")
    
    result = {
        "cluster_centers": reordered_centers,
        "provinces": provinces_result,
        "clusters": reordered_clusters,
        "n_clusters": n_clusters,
        "cluster_mapping": cluster_mapping  # Add mapping for reference
    }
    
    print("    - Perhitungan FCM selesai.")
    return result


def calculate_elbow_sse():

    data_df = load_data()
    if data_df is None:
        return None
    
    # Pilih fitur numerik - konsisten dengan calculate_fcm_clusters
    features = data_df[['Kasus Positif', 'Kasus Sembuh', 'Kasus Meninggal']].values
    
    # Konversi ke list untuk fungsi manual
    features_list = features.tolist()
    
    # Normalisasi data secara manual
    normalized_features, scaler_params = manual_minmax_scaler(features_list)
      # Range k yang akan dianalisis (2-10)
    k_range = range(, 6)
    sse_scores = []
    fpc_scores = []  # Fuzzy Partition Coefficient - ukuran tambahan kualitas clustering
    
    print("\n>>> Pesan dari cluster_logic.py: Memulai perhitungan SSE dan FPC untuk Elbow Method...")
    print("  --- Memulai Metode Elbow untuk Menentukan Jumlah Cluster Optimal ---")
    
    for k in k_range:
        # Set seed untuk hasil yang konsisten
        # random.seed(42)
        # np.random.seed(42)
          # Jalankan algoritma FCM dengan k clusters menggunakan fungsi manual
        centers, u, sse = manual_fuzzy_cmeans(
            normalized_features, k, fuzziness=2, max_iter=1000, error=0.005, seed=0, init=None
        )
        
        if centers is not None and u is not None and sse is not None:
            sse_scores.append(float(sse))
            
            # Hitung FPC untuk konsistensi dengan versi sebelumnya
            fpc = 0.0
            num_data = len(normalized_features)
            for i in range(num_data):
                for j in range(k):
                    fpc += u[i][j] ** 2
            fpc = fpc / num_data  # Normalisasi berdasarkan jumlah data
            fpc_scores.append(float(fpc))
            
            # Format output dengan lebih jelas
            print(f"  - Selesai menghitung untuk k={k}, SSE={sse:.2f}, FPC={fpc:.2f}")
        else:
            print(f"  - k={k}: FCM gagal, menggunakan nilai default")
            sse_scores.append(float('nan'))
            fpc_scores.append(float('nan'))
    
    # Hapus nilai NaN jika ada
    valid_k = [k_range[i] for i, sse in enumerate(sse_scores) if not math.isnan(sse)]
    valid_sse = [sse for sse in sse_scores if not math.isnan(sse)]
    valid_fpc = [fpc for fpc in fpc_scores if not math.isnan(fpc)]
    
    if not valid_k:
        print("!!! ERROR: Tidak ada perhitungan SSE yang berhasil.")
        return None
    
    # Hitung penurunan relatif SSE untuk analisis elbow
    sse_differences = []
    for i in range(len(valid_sse) - 1):
        diff = valid_sse[i] - valid_sse[i + 1]
        relative_diff = diff / valid_sse[i] * 100  # Persentase penurunan
        sse_differences.append(float(relative_diff))
    
    # Tambahkan 0 untuk k terakhir (tidak ada penurunan setelahnya)
    sse_differences.append(0.0)    # Penentuan titik elbow otomatis
    # Strategi yang lebih baik: Cari penurunan signifikan di awal grafik
    if len(sse_differences) > 1:
        # Menghitung penurunan SSE dan memberikan bobot lebih pada nilai k yang kecil
        weighted_differences = []
        for i, diff in enumerate(sse_differences[:-1]):  # Abaikan elemen terakhir (selalu 0)
            # Berikan bobot lebih tinggi pada k yang lebih kecil
            # yaitu penurunan awal yang signifikan
            # Menggunakan bobot eksponensial untuk memprioritaskan penurunan awal secara lebih agresif
            weight = 2.0 ** (len(sse_differences) - i - 1)  # Bobot eksponensial menurun
            weighted_diff = diff * weight
            weighted_differences.append((i, weighted_diff))
        
        # Urutkan berdasarkan perbedaan tertimbang (dari besar ke kecil)
        weighted_differences.sort(key=lambda x: x[1], reverse=True)
        
        # Ambil indeks dengan penurunan tertimbang terbesar
        largest_weighted_drop_idx = weighted_differences[0][0]
        
        # k optimal adalah nilai k setelah penurunan signifikan
        optimal_k = valid_k[largest_weighted_drop_idx + 1]
        
        print(f"    - Penurunan tertimbang terbesar terjadi dari k={valid_k[largest_weighted_drop_idx]} ke k={optimal_k}")
        print(f"    - Persentase penurunan: {sse_differences[largest_weighted_drop_idx]:.2f}%")
    else:
        # Fallback jika analisis tidak memberikan hasil yang jelas
        optimal_k = valid_k[0]
    
    print(f"    - Perhitungan SSE untuk Elbow Method selesai. Optimal k = {optimal_k}")
      # Normalisasi SSE untuk plot yang lebih baik (skala 0-1)
    if min(valid_sse) < max(valid_sse):  # Cek untuk menghindari pembagian dengan nol
        normalized_sse = [(val - min(valid_sse)) / (max(valid_sse) - min(valid_sse)) for val in valid_sse]
    else:
        normalized_sse = [0.5] * len(valid_sse)  # Fallback jika semua nilai sama
      # Buat plot elbow dengan matplotlib
    plt.figure(figsize=(12, 8))
    
    # Plot SSE dengan sumbu y di kiri
    ax1 = plt.gca()
    ax1.plot(valid_k, normalized_sse, 'o-', color='#00a6a6', linewidth=2, label='Normalized SSE')
    ax1.set_xlabel('Jumlah Klaster (k)', fontsize=14)
    ax1.set_ylabel('Nilai SSE (Dinormalisasi)', fontsize=14, color='#00a6a6')
    ax1.tick_params(axis='y', labelcolor='#00a6a6')
    ax1.set_xticks(valid_k)
    ax1.grid(True, linestyle='--', alpha=0.7)
    
    # Tandai titik elbow yang dipilih
    elbowIndex = valid_k.index(optimal_k)
    if elbowIndex > 0:  # Pastikan ada titik sebelumnya
        # Berikan highlight pada titik elbow
        ax1.plot(optimal_k, normalized_sse[elbowIndex], 'o', markersize=12, 
                 color='gold', markeredgecolor='black', markeredgewidth=1.5)
                 
        # Tambahkan anotasi untuk persentase penurunan
        prev_idx = elbowIndex - 1
        plt.annotate(f"{sse_differences[prev_idx]:.1f}% penurunan",
                    xy=(valid_k[prev_idx] + 0.1, (normalized_sse[prev_idx] + normalized_sse[elbowIndex])/2),
                    xytext=(valid_k[prev_idx] + 0.5, (normalized_sse[prev_idx] + normalized_sse[elbowIndex])/2 + 0.1),
                    arrowprops=dict(facecolor='black', shrink=0.05, width=1.5, headwidth=8),
                    fontsize=12)
        
        # Tambahkan highlight untuk transisi k=3 ke k=4 jika ini adalah penurunan signifikan
        if valid_k[1] == 3 and valid_k[2] == 4:
            # Highlight penurunan dari k=3 ke k=4 karena ini biasanya awal penurunan yang signifikan
            if sse_differences[1] > 30:  # Jika penurunannya signifikan (lebih dari 30%)
                plt.annotate("Penurunan Signifikan",
                          xy=(3.5, (normalized_sse[1] + normalized_sse[2])/2),
                          xytext=(3.5, normalized_sse[1] - 0.05),
                          ha='center',
                          arrowprops=dict(arrowstyle='->', color='red', lw=2),
                          color='red', fontsize=12, fontweight='bold')
    
    # Plot FPC dengan sumbu y di kanan
    ax2 = ax1.twinx()
    ax2.plot(valid_k, valid_fpc, 's--', color='#3a86ff', linewidth=1.5, label='FPC')
    ax2.set_ylabel('Fuzzy Partition Coefficient (FPC)', fontsize=14, color='#3a86ff')
    ax2.tick_params(axis='y', labelcolor='#3a86ff')
    
    # Gabungkan legenda dari kedua sumbu y
    lines1, labels1 = ax1.get_legend_handles_labels()
    lines2, labels2 = ax2.get_legend_handles_labels()
    ax1.legend(lines1 + lines2, labels1 + labels2, loc='upper center', fontsize=12)
    
    plt.title('Analisis Metode Elbow dan FPC untuk Penentuan Jumlah Cluster Optimal', fontsize=16)
    
    # Tambahkan keterangan untuk titik elbow
    plt.figtext(0.5, 0.01, f"Berdasarkan analisis Elbow Method, jumlah klaster optimal adalah {optimal_k}", 
                ha="center", fontsize=14, bbox={"facecolor":"lightgrey", "alpha":0.5, "pad":5})
      # Simpan plot ke file
    plt.tight_layout(rect=[0, 0.03, 1, 0.95])
    plt.savefig('elbow_plot.png', dpi=300, bbox_inches='tight')
    plt.close('all')  # Close all figures to ensure proper cleanup
    
    print(f"    - Plot Elbow Method disimpan sebagai 'elbow_plot.png'")
    
    result = {
        "k_values": valid_k,
        "sse_scores": valid_sse,
        "fpc_scores": valid_fpc,
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
    try:
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
    finally:
        # Ensure proper cleanup of matplotlib resources when script exits
        plt.close('all')
        # Force the garbage collector to clean up
        import gc
        gc.collect()
