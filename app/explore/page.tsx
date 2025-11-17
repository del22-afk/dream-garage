"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaGlobeAmericas, FaSearch, FaArrowLeft, FaCar } from "react-icons/fa";

// Tipe data sesuai struktur JSON dari API NHTSA
interface CarMake {
    MakeId: number;
    MakeName: string;
    VehicleTypeId: number;
    VehicleTypeName: string;
}

export default function Explore() {

    // State untuk menyimpan data dari API
    const [makes, setMakes] = useState<CarMake[]>([]);

    // State indikator loading ketika data diproses
    const [loading, setLoading] = useState(true);

    // State untuk input pencarian
    const [search, setSearch] = useState("");

    // useEffect → dijalankan saat komponen pertama kali muncul
    useEffect(() => {
        const fetchMakes = async () => {
            try {
                // Fetch data merk mobil dari API publik NHTSA
                const res = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json');
                const data = await res.json();

                // Ambil hanya 100 data supaya tidak memberatkan UI
                setMakes(data.Results.slice(0, 100));
            } catch (error) {
                console.error("Gagal mengambil data API", error);
            } finally {
                // Hentikan loading setelah proses selesai
                setLoading(false);
            }
        };

        fetchMakes();
    }, []);
    // [] menandakan hanya dijalankan sekali saat halaman pertama dibuka

    // Filter hasil pencarian sesuai input pengguna (client-side search)
    const filteredMakes = makes.filter((make) =>
        make.MakeName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container py-5">
            {/* ========== HEADER ========== */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-3">
                <div>
                    <h1 className="fw-bold text-white d-flex align-items-center gap-3">
                        <FaGlobeAmericas className="text-info" />
                        Explore Car Brands
                    </h1>

                    {/* Subjudul */}
                    <p className="text-secondary mb-0">
                        Data Real-time dari NHTSA Public API
                    </p>
                </div>

                {/* Tombol kembali ke halaman utama */}
                <Link href="/" className="btn btn-outline-light px-4 py-2 rounded-pill">
                    <FaArrowLeft className="me-2" /> Kembali ke Garasi
                </Link>
            </div>

            {/* ========== SEARCH BAR ========== */}
            <div className="row justify-content-center mb-5">
                <div className="col-md-8">
                    <div className="input-group input-group-lg">

                        {/* Icon search */}
                        <span className="input-group-text bg-dark border-secondary text-secondary">
                            <FaSearch />
                        </span>

                        {/* Input pencarian */}
                        <input
                            type="text"
                            className="form-control form-control-dark text-white"
                            style={{ backgroundColor: "#1e293b", borderColor: "#6c757d" }}
                            placeholder="Cari merk mobil (contoh: Ferrari, BMW)..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)} // update state
                        />
                    </div>
                </div>
            </div>

            {/* ========== CONTENT GRID ========== */}
            {loading ? (
                // TAMPILAN LOADING
                <div className="d-flex justify-content-center align-items-center py-5">
                    <div className="spinner-border text-info me-3" role="status"></div>
                    <span className="text-white">Sedang mengambil data dari satelit...</span>
                </div>

            ) : (
                <div className="row g-3">
                    {filteredMakes.length > 0 ? (

                        // Loop setiap merk mobil dan tampilkan dalam card
                        filteredMakes.map((make) => (
                            <div key={make.MakeId} className="col-md-3 col-sm-6">
                                <div className="glass-card p-4 h-100 text-center d-flex flex-column justify-content-center align-items-center"
                                    style={{ transition: "0.3s", cursor: "default" }}>

                                    {/* Icon mobil */}
                                    <div className="mb-3 p-3 rounded-circle bg-secondary bg-opacity-10">
                                        <FaCar className="text-info" size={24} />
                                    </div>

                                    {/* Nama merk mobil */}
                                    <h5 className="text-white fw-bold mb-2">{make.MakeName}</h5>

                                    {/* ID Merk */}
                                    <span className="badge bg-dark border border-secondary text-secondary small">
                                        ID: {make.MakeId}
                                    </span>
                                </div>
                            </div>
                        ))

                    ) : (
                        // Jika tidak ada hasil pencarian
                        <div className="text-center text-secondary py-5">
                            <p>Merk mobil "<strong>{search}</strong>" tidak ditemukan.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
