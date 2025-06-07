# backend/data_loader.py

import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(BASE_DIR, 'data', 'data_covid.csv')

def load_data():
    try:
        df = pd.read_csv(file_path, sep=';')
        print(">>> Pesan dari data_loader.py: File CSV berhasil dimuat.")

        # TAMBAHAN: Cetak nama-nama kolom yang terdeteksi
        print(">>> Nama kolom yang terdeteksi:", df.columns.tolist())

        return df
    except FileNotFoundError:
        print(f"!!! ERROR di data_loader.py: File tidak ditemukan di path: {file_path}")
        return None

if __name__ == '__main__':
    print("Menjalankan tes mandiri untuk data_loader.py...")
    data_df = load_data()

    if data_df is not None:
        print("\nPratinjau 5 baris pertama dari data:")
        print(data_df.head())