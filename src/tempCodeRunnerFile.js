// import axios from "axios";

// const API_BASE_URL = "http://127.0.0.1:8000/api"; //

// /**
//  * Mengambil data hasil klasterisasi dari endpoint /clusters.
//  * @returns {Promise<object>} Data klaster yang berisi pusat klaster dan data provinsi.
//  */
// export const getClusterData = async () => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/clusters`); //
//     return response.data; // Mengembalikan hanya bagian data dari respons
//   } catch (error) {
//     console.error("Error saat mengambil data cluster:", error);
//     throw error;
//   }
// };

// /**
//  * Mengambil data hasil analisis elbow method dari endpoint /elbow-analysis.
//  * @returns {Promise<object>} Data elbow yang berisi nilai K dan skor SSE.
//  */
// export const getElbowData = async () => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/elbow-analysis`); //
//     return response.data;
//   } catch (error) {
//     console.error("Error saat mengambil data elbow:", error);
//     // Melempar error kembali agar bisa ditangkap oleh komponen yang memanggil
//     throw error;
//   }
// };
