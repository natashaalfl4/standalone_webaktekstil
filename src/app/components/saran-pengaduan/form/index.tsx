"use client";
import React, { useState, useEffect } from "react";
import { getApiUrl } from "@/utils/apiConfig";

const SaranPengaduanForm = () => {
    const [formData, setFormData] = useState({
        nama: "",
        email: "",
        no_telp: "",
        kategori_aduan_id: "",
        pesan: "",
    });
    const [categories, setCategories] = useState<any[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(getApiUrl("/api/aspirasi-aduan/kategori"));
                const json = await res.json();
                if (json.success) {
                    setCategories(json.data);
                }
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            }
        };

        fetchCategories();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const submitData = new FormData();
            submitData.append("nama", formData.nama);
            submitData.append("email", formData.email);
            submitData.append("no_telp", formData.no_telp);
            submitData.append("kategori_aduan_id", formData.kategori_aduan_id);
            submitData.append("pesan", formData.pesan);

            if (file) {
                submitData.append("data_dukung", file);
            }

            const res = await fetch(getApiUrl("/api/aspirasi-aduan"), {
                method: "POST",
                body: submitData,
            });

            const json = await res.json();

            if (json.success) {
                setIsSubmitted(true);
                setFormData({
                    nama: "",
                    email: "",
                    no_telp: "",
                    kategori_aduan_id: "",
                    pesan: "",
                });
                setFile(null);
            } else {
                setError(json.message || "Gagal mengirim pengaduan. Silakan coba lagi.");
            }
        } catch (err) {
            console.error("Error submitting form:", err);
            setError("Terjadi kesalahan koneksi. Silakan coba lagi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-darkmode dark:via-slate-900 dark:to-slate-800 py-20 px-4 overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-200/20 dark:bg-cyan-900/10 rounded-full blur-3xl" />

            <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md relative z-10">
                {/* Header Section */}
                <div className="text-center mb-14">
                    <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 text-sm font-semibold rounded-full mb-4">
                        📝 Sampaikan Aspirasi Anda
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-800 dark:text-white mb-4 tracking-tight">
                        Pengaduan Masyarakat
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                        Silakan sampaikan saran, kritik, atau pengaduan Anda melalui formulir berikut
                    </p>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full mx-auto mt-6" />
                </div>

                {/* Form Card */}
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 p-8 md:p-12 border border-slate-100 dark:border-slate-700">
                        {isSubmitted ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg
                                        className="w-10 h-10 text-green-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
                                    Pengaduan Terkirim!
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 mb-6">
                                    Terima kasih atas masukan Anda. Kami akan segera menindaklanjuti.
                                </p>
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="bg-primary text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
                                >
                                    Kirim Pengaduan Lain
                                </button>
                            </div>
                        ) : (
                            <>
                                {error && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                                        <span className="block sm:inline">{error}</span>
                                    </div>
                                )}
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Nama Field */}
                                    <div>
                                        <label
                                            htmlFor="nama"
                                            className="block text-slate-700 dark:text-slate-300 font-medium mb-2"
                                        >
                                            Nama<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="nama"
                                            name="nama"
                                            value={formData.nama}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 outline-none"
                                            placeholder="Masukkan nama lengkap"
                                        />
                                    </div>

                                    {/* Email Field */}
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-slate-700 dark:text-slate-300 font-medium mb-2"
                                        >
                                            Email<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 outline-none"
                                            placeholder="contoh@email.com"
                                        />
                                    </div>

                                    {/* No. Telp Field */}
                                    <div>
                                        <label
                                            htmlFor="no_telp"
                                            className="block text-slate-700 dark:text-slate-300 font-medium mb-2"
                                        >
                                            No. Telp<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            id="no_telp"
                                            name="no_telp"
                                            value={formData.no_telp}
                                            onChange={handleChange}
                                            required
                                            className="w-full max-w-sm px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 outline-none"
                                            placeholder="08xxxxxxxxxx"
                                        />
                                    </div>

                                    {/* Kategori Field */}
                                    <div>
                                        <label
                                            htmlFor="kategori_aduan_id"
                                            className="block text-slate-700 dark:text-slate-300 font-medium mb-2"
                                        >
                                            Kategori<span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="kategori_aduan_id"
                                            name="kategori_aduan_id"
                                            value={formData.kategori_aduan_id}
                                            onChange={handleChange}
                                            required
                                            className="w-full max-w-sm px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 outline-none custom-select"
                                        >
                                            <option value="">Pilih Kategori</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.nama_kategori}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Isi Pengaduan Field */}
                                    <div>
                                        <label
                                            htmlFor="pesan"
                                            className="block text-slate-700 dark:text-slate-300 font-medium mb-2"
                                        >
                                            Isi Pengaduan<span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            id="pesan"
                                            name="pesan"
                                            value={formData.pesan}
                                            onChange={handleChange}
                                            required
                                            rows={8}
                                            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 outline-none resize-y"
                                            placeholder="Tuliskan saran, kritik, atau pengaduan Anda secara lengkap..."
                                        />
                                    </div>

                                    {/* Data Dukung Field */}
                                    <div>
                                        <label
                                            htmlFor="data_dukung"
                                            className="block text-slate-700 dark:text-slate-300 font-medium mb-2"
                                        >
                                            Data dukung
                                        </label>
                                        <div className="flex items-center gap-4">
                                            <label className="cursor-pointer bg-slate-100 dark:bg-slate-600 hover:bg-slate-200 dark:hover:bg-slate-500 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-500 transition-colors duration-300">
                                                <span className="text-slate-700 dark:text-slate-200 text-sm font-medium">
                                                    Choose File
                                                </span>
                                                <input
                                                    type="file"
                                                    id="data_dukung"
                                                    name="data_dukung"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                />
                                            </label>
                                            <span className="text-slate-500 dark:text-slate-400 text-sm">
                                                {file ? file.name : "No file chosen"}
                                            </span>
                                        </div>
                                        <p className="text-slate-400 dark:text-slate-500 text-xs mt-2">
                                            Format yang didukung: PDF, DOC, DOCX, JPG, JPEG, PNG (Maks. 5MB)
                                        </p>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white py-3 px-8 rounded-lg font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <svg
                                                        className="animate-spin h-5 w-5"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        />
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        />
                                                    </svg>
                                                    Mengirim...
                                                </>
                                            ) : (
                                                "Kirim"
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SaranPengaduanForm;
