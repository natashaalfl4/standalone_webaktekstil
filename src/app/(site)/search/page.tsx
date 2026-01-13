"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { getApiUrl, API_BASE_URL } from "@/utils/apiConfig";

interface SearchResult {
    id: number;
    judul: string;
    konten?: string;
    thumbnail?: string;
    created_at: string;
    type: "berita" | "pengumuman";
}

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query.trim()) {
                setResults([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                // Fetch both berita and pengumuman
                const [beritaRes, pengumumanRes] = await Promise.all([
                    fetch(getApiUrl("/api/berita"), { cache: "no-store" }),
                    fetch(getApiUrl("/api/pengumuman"), { cache: "no-store" }),
                ]);

                const beritaJson = beritaRes.ok ? await beritaRes.json() : { data: [] };
                const pengumumanJson = pengumumanRes.ok ? await pengumumanRes.json() : { data: [] };

                const beritaData = (beritaJson.data || []).map((item: any) => ({
                    ...item,
                    type: "berita" as const,
                }));

                const pengumumanData = (pengumumanJson.data || []).map((item: any) => ({
                    ...item,
                    type: "pengumuman" as const,
                }));

                // Combine and filter by query
                const allData = [...beritaData, ...pengumumanData];
                const lowerQuery = query.toLowerCase();
                const filtered = allData.filter(
                    (item) =>
                        item.judul?.toLowerCase().includes(lowerQuery) ||
                        item.konten?.toLowerCase().includes(lowerQuery)
                );

                // Sort by date (newest first)
                filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

                setResults(filtered);
            } catch (error) {
                console.error("Search error:", error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    return (
        <main className="bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-darkmode dark:via-darkmode dark:to-slate-900 min-h-screen">
            {/* Hero Header Section */}
            <section className="relative h-[250px] md:h-[300px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#1a56db]">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
                </div>

                <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
                    <div className="text-center">
                        <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-blue-200 text-sm font-medium mb-4 border border-white/20">
                            🔍 Hasil Pencarian
                        </span>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                            Pencarian: &quot;{query}&quot;
                        </h1>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                        <path
                            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                            className="fill-slate-50 dark:fill-darkmode"
                        />
                    </svg>
                </div>
            </section>

            {/* Results Section */}
            <section className="container mx-auto px-4 py-12 md:py-16 max-w-5xl">
                <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full" />
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Hasil Pencarian</h2>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-full">
                        <span className="text-blue-600 dark:text-blue-300 font-medium text-sm">
                            {loading ? "Mencari..." : `${results.length} Hasil`}
                        </span>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : results.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                            {query ? "Tidak Ditemukan" : "Masukkan Kata Kunci"}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400">
                            {query ? `Tidak ada hasil untuk "${query}"` : "Silakan masukkan kata kunci pencarian"}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* Berita Section */}
                        {results.filter(item => item.type === "berita").length > 0 && (
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full" />
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">📰 Berita</h3>
                                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-sm font-medium px-3 py-1 rounded-full">
                                        {results.filter(item => item.type === "berita").length} hasil
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    {results.filter(item => item.type === "berita").map((item) => (
                                        <Link
                                            key={`berita-${item.id}`}
                                            href={`/berita/${(item as any).url_halaman || item.id}`}
                                            className="group flex flex-col md:flex-row bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-1"
                                        >
                                            <div className="relative w-full md:w-56 h-44 md:h-auto md:min-h-[160px] overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={
                                                        item.thumbnail
                                                            ? item.thumbnail.startsWith("http")
                                                                ? item.thumbnail
                                                                : `${API_BASE_URL}/storage/${item.thumbnail}`
                                                            : "/images/placeholder.jpg"
                                                    }
                                                    alt={item.judul}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            </div>
                                            <div className="flex-1 p-5">
                                                <h4 className="text-slate-800 dark:text-white font-bold text-lg leading-snug mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
                                                    {item.judul}
                                                </h4>
                                                <div className="w-10 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-3 group-hover:w-16 transition-all duration-500" />
                                                {item.konten && (
                                                    <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-2 mb-3">
                                                        {item.konten.replace(/<[^>]+>/g, "").substring(0, 120)}...
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span>
                                                        {new Date(item.created_at).toLocaleDateString("id-ID", {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Pengumuman Section */}
                        {results.filter(item => item.type === "pengumuman").length > 0 && (
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-1 h-6 bg-gradient-to-b from-emerald-600 to-teal-600 rounded-full" />
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">📢 Pengumuman</h3>
                                    <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 text-sm font-medium px-3 py-1 rounded-full">
                                        {results.filter(item => item.type === "pengumuman").length} hasil
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    {results.filter(item => item.type === "pengumuman").map((item) => (
                                        <Link
                                            key={`pengumuman-${item.id}`}
                                            href={`/pengumuman/${item.id}`}
                                            className="group flex flex-col md:flex-row bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 hover:-translate-y-1"
                                        >
                                            <div className="relative w-full md:w-56 h-44 md:h-auto md:min-h-[160px] overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={
                                                        item.thumbnail
                                                            ? item.thumbnail.startsWith("http")
                                                                ? item.thumbnail
                                                                : `${API_BASE_URL}/storage/${item.thumbnail}`
                                                            : "/images/placeholder.jpg"
                                                    }
                                                    alt={item.judul}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            </div>
                                            <div className="flex-1 p-5">
                                                <h4 className="text-slate-800 dark:text-white font-bold text-lg leading-snug mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300 line-clamp-2">
                                                    {item.judul}
                                                </h4>
                                                <div className="w-10 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mb-3 group-hover:w-16 transition-all duration-500" />
                                                {item.konten && (
                                                    <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-2 mb-3">
                                                        {item.konten.replace(/<[^>]+>/g, "").substring(0, 120)}...
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span>
                                                        {new Date(item.created_at).toLocaleDateString("id-ID", {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </main>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-darkmode dark:via-darkmode dark:to-slate-900">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}
