import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { getApiUrl, API_BASE_URL } from "@/utils/apiConfig";

export const metadata: Metadata = {
    title: "Semua Berita - Akademi Tekstil Surakarta",
};

async function getBerita() {
    try {
        const res = await fetch(getApiUrl("/api/berita"), { cache: "no-store" });
        if (!res.ok) return [];
        const json = await res.json();
        return json.data || [];
    } catch (error) {
        console.error("Failed to fetch berita:", error);
        return [];
    }
}

export default async function BeritaPage() {
    const beritaData = await getBerita();

    return (
        <main className="bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-darkmode dark:via-darkmode dark:to-slate-900 min-h-screen">
            {/* Hero Header Section */}
            <section className="relative h-[300px] md:h-[400px] overflow-hidden">
                {/* Background with animated gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#1a56db]">
                    {/* Animated pattern overlay */}
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                    />
                    {/* Floating shapes */}
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
                    <div className="text-center">
                        <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-blue-200 text-sm font-medium mb-4 border border-white/20">
                            📰 Informasi Terkini
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
                            Berita & Kegiatan
                        </h1>
                        <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto opacity-90">
                            Temukan informasi terbaru seputar kegiatan dan perkembangan Akademi Tekstil Surakarta
                        </p>
                    </div>
                </div>

                {/* Wave decoration */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                        <path
                            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                            className="fill-slate-50 dark:fill-darkmode"
                        />
                    </svg>
                </div>
            </section>

            {/* Content Grid */}
            <section className="container mx-auto px-4 py-12 md:py-16 relative z-20">
                {/* Stats bar */}
                <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full" />
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                            Berita Terbaru
                        </h2>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-full">
                        <span className="text-blue-600 dark:text-blue-300 font-medium text-sm">
                            {beritaData.length} Berita
                        </span>
                    </div>
                </div>

                {/* News Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {beritaData.map((item: any, index: number) => (
                        <Link
                            href={`/berita/${item.url_halaman || item.id}`}
                            key={item.id}
                            className="group relative bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-2 flex flex-col cursor-pointer"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Image Container */}
                            <div className="relative h-56 overflow-hidden">
                                <Image
                                    src={item.thumbnail ?
                                        (item.thumbnail.startsWith('http') ? item.thumbnail : `${API_BASE_URL}/storage/${item.thumbnail}`)
                                        : '/images/placeholder.jpg'}
                                    alt={item.judul}
                                    fill
                                    className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                                />
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Date Badge */}
                                <div className="absolute top-4 left-4">
                                    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
                                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 block text-center">
                                            {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric' })}
                                        </span>
                                        <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase block text-center">
                                            {new Date(item.created_at).toLocaleDateString('id-ID', { month: 'short' })}
                                        </span>
                                    </div>
                                </div>

                                {/* Category Badge (optional decorative) */}
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                                        Berita
                                    </span>
                                </div>

                                {/* Read More Icon */}
                                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-slate-800 dark:text-white font-bold text-lg leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 mb-3">
                                    {item.judul}
                                </h3>

                                {/* Decorative line */}
                                <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-4 group-hover:w-20 transition-all duration-500" />

                                {/* Footer */}
                                <div className="mt-auto pt-4 flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-sm">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>
                                            {new Date(item.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm">
                                    <span className="relative">
                                        Baca Selengkapnya
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 group-hover:w-full transition-all duration-300" />
                                    </span>
                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Empty State */}
                {beritaData.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Belum Ada Berita</h3>
                        <p className="text-slate-500 dark:text-slate-400">Berita akan segera ditambahkan</p>
                    </div>
                )}
            </section>

            {/* Decorative Footer Wave */}
            <div className="relative h-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-100 dark:from-slate-900 to-transparent" />
            </div>
        </main>
    );
}
