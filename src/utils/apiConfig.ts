export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://new.ak-tekstilsolo.ac.id';

/**
 * Helper untuk membuat URL API lengkap
 * @param path Path endpoint, misal '/api/berita' atau 'api/berita'
 * @returns Full URL string
 */
export const getApiUrl = (path: string) => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_BASE_URL}${cleanPath}`;
};

/**
 * Helper untuk membuat URL Storage lengkap (jika base URL storage berbeda, bisa disesuaikan)
 * Biasanya storage ada di subdomain atau path /storage
 */
export const getStorageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path; // Jika sudah full URL, kembalikan

    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    // Asumsi storage juga di host yang sama, atau bisa dipisah jika perlu
    return `${API_BASE_URL}${cleanPath}`;
}
