import Link from 'next/link';
import { FaExclamationTriangle, FaMapMarkedAlt } from "react-icons/fa";

// Halaman khusus 404 (Not Found) untuk Next.js App Router
export default function NotFound() {
    return (
        <div className="container vh-100 d-flex flex-column justify-content-center align-items-center text-center">

            {/* Icon 404 besar dengan efek visual */}
            <div className="display-1 text-warning mb-4" style={{ fontSize: "5rem" }}>
                <FaExclamationTriangle />
            </div>

            {/* Judul utama error */}
            <h1 className="fw-bold text-white display-4 mb-2">
                404 - Jalur Buntu
            </h1>

            {/* Deskripsi lucu untuk halaman 404 */}
            <p className="lead text-secondary mb-5" style={{ maxWidth: "500px" }}>
                Waduh! Halaman yang kamu cari sepertinya tidak ada di peta GPS kami.
                Mungkin salah ketik URL atau halamannya sudah diderek?
            </p>

            {/* Tombol navigasi kembali ke halaman utama */}
            <div className="d-flex gap-3">
                <Link href="/" className="btn btn-primary btn-lg px-5 rounded-pill fw-bold shadow-lg">
                    <FaMapMarkedAlt className="me-2" /> Putar Balik ke Garasi
                </Link>
            </div>

            {/* Informasi tambahan di bagian bawah halaman */}
            <div className="mt-5 text-secondary small opacity-50">
                Error Code: 404_NOT_FOUND | System: Next.js App Router
            </div>
        </div>
    );
}
