
import Image from "next/image";
import Link from "next/link";

import { getApiUrl, API_BASE_URL } from "@/utils/apiConfig";

async function getPengumuman() {
    try {
        const res = await fetch(getApiUrl("/api/pengumuman"), { cache: "no-store" });
        if (!res.ok) return [];
        const json = await res.json();
        return json.data || [];
    } catch (error) {
        console.error("Failed to fetch pengumuman:", error);
        return [];
    }
}

export default async function PengumumanListTemplate() {
    const pengumumanData = await getPengumuman();

    return (
        <main className="bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-darkmode dark:via-darkmode dark:to-slate-900 min-h-screen">
            {/* Hero Header Section */}
            <section className="relative h-[300px] md:h-[400px] overflow-hidden">
                {/* Background with animated gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e40af] to-[#3b82f6]">
                    {/* Animated pattern overlay */}
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                    />
                    {/* Floating shapes */}
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-sky-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
                    <div className="text-center">
                        <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-blue-200 text-sm font-medium mb-4 border border-white/20">
                            📢 Informasi Penting
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
                            Pengumuman
                        </h1>
                        <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto opacity-90">
                            Dapatkan informasi penting dan pengumuman resmi dari Akademi Tekstil Surakarta
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
            <section className="container mx-auto px-4 py-12 md:py-16 relative z-20 max-w-6xl">
                {/* Stats bar */}
                <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-cyan-600 rounded-full" />
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                            Pengumuman Terbaru
                        </h2>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-full">
                        <span className="text-blue-600 dark:text-blue-300 font-medium text-sm">
                            {pengumumanData.length} Pengumuman
                        </span>
                    </div>
                </div>

                {/* Announcement List */}
                <div className="space-y-6">
                    {pengumumanData.map((item: any, index: number) => (
                        <Link
                            href={`/pengumuman/${item.url_halaman}`}
                            key={item.id}
                            className={`group relative flex flex-col md:flex-row ${index % 2 === 1 ? 'md:flex-row-reverse' : ''} bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-1 cursor-pointer`}
                        >
                            {/* Image Side */}
                            <div className="relative w-full md:w-2/5 h-56 md:h-auto md:min-h-[280px] overflow-hidden">
                                <Image
                                    src={item.thumbnail ?
                                        (item.thumbnail.startsWith('http') ? item.thumbnail : `${API_BASE_URL}/storage/${item.thumbnail}`)
                                        : '/images/placeholder.jpg'}
                                    alt={item.judul}
                                    fill
                                    className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                                />
                                {/* Overlay - lighter opacity */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-black/20" />


                                {/* Title Overlay on Image - Bottom */}
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <h4 className="font-bold text-lg md:text-xl leading-snug line-clamp-3" style={{ color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                                        {item.judul}
                                    </h4>
                                </div>

                                {/* Date Badge */}
                                <div className="absolute top-4 left-4">
                                    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-4 py-3 rounded-2xl shadow-lg">
                                        <span className="text-2xl font-bold text-blue-600 dark:text-white block text-center leading-tight">
                                            {new Date(item.created_at).getDate()}
                                        </span>
                                        <span className="text-xs font-semibold text-slate-500 dark:text-white uppercase block text-center">
                                            {new Date(item.created_at).toLocaleDateString('id-ID', { month: 'short' })}
                                        </span>
                                        <span className="text-[10px] text-slate-400 dark:text-slate-300 block text-center">
                                            {new Date(item.created_at).getFullYear()}
                                        </span>
                                    </div>
                                </div>

                                {/* Category Badge */}
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                                        Pengumuman
                                    </span>
                                </div>
                            </div>

                            {/* Content Side */}
                            <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                                {/* Decorative element */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/50 to-cyan-100/50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-bl-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative z-10">
                                    <h3 className="text-slate-800 dark:text-white font-bold text-xl md:text-2xl leading-snug mb-4 group-hover:text-blue-600 dark:group-hover:text-white transition-colors duration-300 line-clamp-2">
                                        {item.judul}
                                    </h3>

                                    {/* Decorative line */}
                                    <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-4 group-hover:w-24 transition-all duration-500" />

                                    <p className="text-slate-600 dark:text-slate-300 mb-6 line-clamp-3 text-sm md:text-base leading-relaxed">
                                        {item.konten ? item.konten.replace(/<[^>]+>/g, '').substring(0, 180) + "..." : "Klik untuk membaca detail pengumuman ini."}
                                    </p>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between flex-wrap gap-4">
                                        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-sm">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>
                                                {new Date(item.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                            </span>
                                        </div>

                                        <div className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm">
                                            <span className="relative">
                                                Baca Selengkapnya
                                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 group-hover:w-full transition-all duration-300" />
                                            </span>
                                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Empty State */}
                {pengumumanData.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Belum Ada Pengumuman</h3>
                        <p className="text-slate-500 dark:text-slate-400">Pengumuman akan segera ditambahkan</p>
                    </div>
                )}
            </section>

            {/* Decorative Footer */}
            <div className="relative h-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-100 dark:from-slate-900 to-transparent" />
            </div>
        </main>
    );
}
