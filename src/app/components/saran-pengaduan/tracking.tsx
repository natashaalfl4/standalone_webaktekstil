"use client";
import React, { useState } from "react";
import { getApiUrl } from "@/utils/apiConfig";

interface Aduan {
    id: number;
    nama: string;
    email: string;
    no_telp: string;
    pesan: string;
    created_at: string;
    status?: string;
}

const TrackingAduan = () => {
    const [email, setEmail] = useState("");
    const [results, setResults] = useState<Aduan[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSearching(true);
        setError(null);
        setHasSearched(false);

        try {
            const res = await fetch(getApiUrl("/api/aspirasi-aduan/track"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const json = await res.json();

            if (json.success) {
                setResults(json.data);
                setHasSearched(true);
            } else {
                setError(json.message || "Gagal melacak pengaduan.");
            }
        } catch (err) {
            console.error("Tracking error:", err);
            setError("Terjadi kesalahan koneksi.");
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <section className="py-20 px-4 bg-white dark:bg-slate-900">
            <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Lacak Pengaduan Anda</h2>
                    <p className="text-slate-500 dark:text-slate-400">Masukkan email Anda untuk melihat riwayat pengaduan yang telah dikirim.</p>
                </div>

                <div className="max-w-xl mx-auto mb-16">
                    <form onSubmit={handleTrack} className="flex gap-2">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Masukkan email Anda"
                            required
                            className="flex-1 px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <button
                            type="submit"
                            disabled={isSearching}
                            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {isSearching ? "Mencari..." : "Lacak"}
                        </button>
                    </form>
                    {error && <p className="text-red-500 mt-2 text-sm text-center">{error}</p>}
                </div>

                {hasSearched && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Hasil Pelacakan:</h3>
                        {results.length > 0 ? (
                            <div className="grid gap-6">
                                {results.map((aduan) => (
                                    <div key={aduan.id} className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                            <div>
                                                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">ID: #{aduan.id}</span>
                                                <h4 className="font-bold text-slate-800 dark:text-white text-lg">{aduan.pesan.substring(0, 50)}...</h4>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                                    {new Date(aduan.created_at).toLocaleDateString("id-ID", {
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric",
                                                    })}
                                                </span>
                                                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-bold rounded-full">
                                                    {aduan.status || "Diterima"}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-300 text-sm whitespace-pre-line">{aduan.pesan}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                                <p className="text-slate-500 dark:text-slate-400">Tidak ada pengaduan ditemukan untuk email ini.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default TrackingAduan;
