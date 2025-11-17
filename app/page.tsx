"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaCar, FaPlus, FaTrash, FaInfoCircle, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { GiSteeringWheel } from "react-icons/gi";

// Interface struktur data mobil
interface Car {
  id: number;
  brand: string;
  model: string;
  year: string;
  description: string;
}

export default function Home() {
  // DATA LIST MOBIL
  const [cars, setCars] = useState<Car[]>([]);

  // STATE FORM INPUT
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");

  // Untuk memastikan kode hanya jalan di client (Next.js)
  const [isClient, setIsClient] = useState(false);

  // MODE EDIT
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // =======================================================
  // 1. FETCH DATA (READ) → Mengambil list mobil dari API
  // =======================================================
  const fetchCars = async () => {
    try {
      const res = await fetch('/api/cars');
      if (!res.ok) throw new Error("Gagal fetch");
      const data = await res.json();
      setCars(data); // simpan hasil ke state
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  useEffect(() => {
    setIsClient(true);   // Next.js server-side → client only
    fetchCars();         // ambil data pertama kali
  }, []);

  // =======================================================
  // 2. HANDLE SUBMIT FORM (CREATE atau UPDATE)
  // =======================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi sederhana
    if (!brand || !model) return alert("Brand dan Model wajib diisi!");

    const carData = { brand, model, year, description };

    try {
      if (editMode && editId) {
        // UPDATE DATA
        const res = await fetch(`/api/cars/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(carData),
        });
        if (!res.ok) throw new Error("Gagal Update");

        // Reset mode edit
        setEditMode(false);
        setEditId(null);

      } else {
        // CREATE DATA BARU
        const res = await fetch('/api/cars', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(carData),
        });
        if (!res.ok) throw new Error("Gagal Simpan");
      }

      // Reset input form setelah submit
      setBrand("");
      setModel("");
      setYear("");
      setDescription("");

      // Refresh list mobil
      await fetchCars();

    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menyimpan data.");
    }
  };

  // =======================================================
  // 3. HANDLE DELETE DATA
  // =======================================================
  const handleDelete = async (id: number) => {
    if (confirm("Yakin ingin menghapus mobil ini dari database?")) {
      await fetch(`/api/cars/${id}`, { method: 'DELETE' });
      fetchCars();   // refresh ulang list
    }
  };

  // =======================================================
  // 4. PREPARE EDIT → Isi form dengan data mobil yang mau diedit
  // =======================================================
  const handleEditClick = (car: Car) => {
    setEditMode(true);
    setEditId(car.id);

    // Isi form pakai data lama
    setBrand(car.brand);
    setModel(car.model);
    setYear(car.year);
    setDescription(car.description);

    // Scroll naik biar user langsung lihat form edit
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // =======================================================
  // 5. CANCEL EDIT → Reset mode edit
  // =======================================================
  const handleCancelEdit = () => {
    setEditMode(false);
    setEditId(null);

    // Kosongkan form
    setBrand("");
    setModel("");
    setYear("");
    setDescription("");
  };

  // Next.js hydration fix
  if (!isClient) return null;

  return (
    <div className="container py-5">

      {/* =======================================================
          HEADER / HERO SECTION
      ======================================================= */}
      <div className="p-5 mb-5 rounded-4 text-center"
        style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)", color: "white" }}>

        <h1 className="display-4 fw-bold d-flex justify-content-center align-items-center gap-3">
          <GiSteeringWheel /> My Dream Garage
        </h1>

        <p className="lead opacity-75">Koleksi & Impian Otomotif Masa Depan</p>

        <div className="badge bg-dark bg-opacity-25 px-3 py-2 mt-2">
          Nama: <strong>Delvyn Putra</strong> | NIM: <strong>535240090</strong>
        </div>

        <div className="mt-3">
          <Link href="/explore" className="btn btn-outline-light rounded-pill px-4 btn-sm">
            🌍 Explore The Cars
          </Link>
        </div>

      </div>

      <div className="row g-4">

        {/* =======================================================
            FORM INPUT (CREATE & EDIT)
        ======================================================= */}
        <div className="col-lg-4">
          <div className="glass-card p-4 sticky-top" style={{ top: "20px" }}>
            <h4 className="mb-3 d-flex align-items-center gap-2 text-white">
              {editMode ? <FaEdit className="text-warning" /> : <FaPlus className="text-primary" />}
              {editMode ? "Edit Kendaraan" : "Tambah Koleksi"}
            </h4>

            <form onSubmit={handleSubmit}>
              {/* Input Brand */}
              <div className="mb-3">
                <label className="form-label text-secondary small">Brand / Merk</label>
                <input
                  type="text"
                  className="form-control form-control-dark"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Porsche"
                />
              </div>

              {/* Input Model */}
              <div className="mb-3">
                <label className="form-label text-secondary small">Model Type</label>
                <input
                  type="text"
                  className="form-control form-control-dark"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. 911 GT3 RS"
                />
              </div>

              {/* Input Tahun */}
              <div className="mb-3">
                <label className="form-label text-secondary small">Tahun Keluaran</label>
                <input
                  type="text"
                  className="form-control form-control-dark"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="e.g. 2023"
                />
              </div>

              {/* Input Deskripsi */}
              <div className="mb-3">
                <label className="form-label text-secondary small">Catatan / Deskripsi</label>
                <textarea
                  className="form-control form-control-dark"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mengapa kamu menginginkan mobil ini?"
                ></textarea>
              </div>

              {/* Tombol Submit & Cancel */}
              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className={`btn w-100 fw-bold py-2 ${editMode ? "btn-warning" : "btn-primary"}`}
                >
                  {editMode ? (
                    <>
                      <FaSave className="me-2" /> Update Data
                    </>
                  ) : (
                    <>
                      <FaCar className="me-2" /> Simpan ke Garasi
                    </>
                  )}
                </button>

                {/* Tombol Cancel hanya muncul pada mode edit */}
                {editMode && (
                  <button type="button" onClick={handleCancelEdit} className="btn btn-secondary">
                    <FaTimes />
                  </button>
                )}
              </div>
            </form>

          </div>
        </div>

        {/* =======================================================
            LIST MOBIL (Card)
        ======================================================= */}
        <div className="col-lg-8">

          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="text-white mb-0">
              Daftar Garasi <span className="badge bg-primary rounded-pill ms-2">{cars.length}</span>
            </h4>
          </div>

          {/* Jika belum ada data */}
          {cars.length === 0 ? (
            <div
              className="alert alert-dark border-0 text-center py-5"
              style={{ backgroundColor: "#1e293b" }}
            >
              <FaCar size={50} className="mb-3 text-secondary opacity-50" />
              <p className="text-secondary">Garasi masih kosong</p>
            </div>
          ) : (
            <div className="row g-3">
              {cars.map((car) => (
                <div key={car.id} className="col-md-6">
                  <div className="glass-card h-100 d-flex flex-column">

                    {/* Card Body */}
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h4 className="card-title fw-bold text-white mb-0">{car.brand}</h4>
                        <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 px-3 py-2 rounded-pill">
                          {car.year}
                        </span>
                      </div>

                      <h5 className="text-primary mb-3">{car.model}</h5>

                      {/* Deskripsi singkat */}
                      <p
                        className="card-text text-secondary small text-truncate"
                        style={{ minHeight: "40px" }}
                      >
                        {car.description || "Tidak ada deskripsi."}
                      </p>
                    </div>

                    {/* Card Footer */}
                    <div className="card-footer bg-transparent border-top border-secondary border-opacity-25 px-4 py-3">
                      <div className="d-flex gap-2">

                        {/* Tombol Detail */}
                        <Link
                          href={`/car/${car.id}`}
                          className="btn btn-sm btn-outline-light flex-grow-1 fw-semibold"
                        >
                          <FaInfoCircle className="me-1" /> Detail
                        </Link>

                        {/* Tombol Edit */}
                        <button
                          onClick={() => handleEditClick(car)}
                          className="btn btn-sm btn-warning text-dark fw-bold"
                        >
                          <FaEdit />
                        </button>

                        {/* Tombol Delete */}
                        <button
                          onClick={() => handleDelete(car.id)}
                          className="btn btn-sm btn-danger bg-opacity-25 border-danger text-danger-emphasis"
                        >
                          <FaTrash />
                        </button>

                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
