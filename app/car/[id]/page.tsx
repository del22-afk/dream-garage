"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaArrowLeft, FaTag, FaCalendarAlt, FaCarSide } from "react-icons/fa";

// Struktur data mobil yang dikembalikan oleh API Backend kita
interface Car {
    id: number;
    brand: string;
    model: string;
    year: string;
    description: string;
}

export default function CarDetail() {

    // 1. Ambil parameter dari URL (misal /cars/3 → id = "3")
    const params = useParams();

    // Pastikan param.id ada dan berupa string
    const id = typeof params?.id === 'string' ? params.id : null;

    // State untuk menyimpan data mobil yang di-fetch
    const [car, setCar] = useState<Car | null>(null);

    // State loading untuk menampilkan spinner saat mengambil data
    const [loading, setLoading] = useState(true);

    // 2. Fetch detail mobil dari API ketika id berubah
    useEffect(() => {
        // Jika id tidak valid, jangan fetch apa-apa
        if (!id) return;

        const fetchCarDetail = async () => {
            try {
                setLoading(true);

                // Ambil detail mobil dari endpoint backend kita:
                // /api/cars/[id]
                const res = await fetch(`/api/cars/${id}`);

                // Jika API error (404, 500, dll)
                if (!res.ok) {
                    throw new Error("Gagal mengambil data");
                }

                // Convert JSON dan simpan di state
                const data = await res.json();
                setCar(data);

            } catch (err) {
                console.error("Gagal fetch detail:", err);

                // Set null agar masuk ke tampilan 404 custom
                setCar(null);

            } finally {
                // Matikan loading setelah selesai
                setLoading(false);
            }
        };

        fetchCarDetail();
    }, [id]); // useEffect jalan setiap id berubah (walaupun biasanya tidak berubah)


    // ============================
    // 3. TAMPILAN LOADING
    // ============================
    if (loading) return (
        <div className="container vh-100 d-flex justify-content-center align-items-center">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );


    // ============================
    // 4. TAMPILAN 404 CUSTOM
    // Jika car = null karena API gagal atau data tidak ada
    // ============================
    if (!car) return (
        <div className="container vh-100 d-flex flex-column justify-content-center align-items-center text-center">
            <div className="display-1 text-secondary mb-3">404</div>
            <h3 className="text-white mb-4">Mobil Hilang dari Radar</h3>
            <p className="text-secondary">ID Mobil: {id}</p>

            {/* Tombol kembali */}
            <Link href="/" className="btn btn-primary px-4 py-2">
                Kembali ke Garasi
            </Link>
        </div>
    );


    // ============================
    // 5. TAMPILAN UTAMA (DETAIL MOBIL)
    // Jika data berhasil ditemukan
    // ============================
    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">

                    {/* Tombol kembali ke halaman utama */}
                    <Link href="/" className="text-decoration-none text-secondary d-flex align-items-center mb-4 hover-primary">
                        <FaArrowLeft className="me-2" /> Kembali ke List
                    </Link>

                    {/* CARD UTAMA */}
                    <div className="glass-card p-5">

                        {/* Bagian Header Detail Mobil */}
                        <div className="text-center mb-5">

                            {/* Icon Mobil Besar */}
                            <div className="d-inline-block p-4 rounded-circle bg-primary bg-opacity-10 mb-3">
                                <FaCarSide size={64} className="text-primary" />
                            </div>

                            {/* Nama Mobil */}
                            <h1 className="display-5 fw-bold text-white">
                                {car.brand} {car.model}
                            </h1>

                            {/* Badge Info: Brand + Tahun */}
                            <div className="d-flex justify-content-center gap-3 mt-3">
                                <span className="badge bg-dark border border-secondary px-3 py-2 d-flex align-items-center gap-2">
                                    <FaTag className="text-warning" /> {car.brand}
                                </span>

                                <span className="badge bg-dark border border-secondary px-3 py-2 d-flex align-items-center gap-2">
                                    <FaCalendarAlt className="text-info" /> {car.year}
                                </span>
                            </div>
                        </div>

                        <hr className="border-secondary opacity-25 my-4" />

                        {/* Bagian Deskripsi */}
                        <div className="mb-4">
                            <h5 className="text-light mb-3">Deskripsi & Catatan</h5>

                            <div className="p-4 rounded-3" style={{ backgroundColor: "#0f172a" }}>
                                <p className="text-secondary mb-0" style={{ lineHeight: "1.8" }}>
                                    {car.description || "Tidak ada deskripsi detail untuk mobil ini."}
                                </p>
                            </div>
                        </div>

                        {/* ID Mobil (informasi kecil di bawah) */}
                        <div className="text-end text-secondary small fst-italic">
                            ID: {car.id}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
