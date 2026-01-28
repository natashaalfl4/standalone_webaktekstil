import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { getApiUrl, API_BASE_URL } from "@/utils/apiConfig";

// Get all berita and filter by tag
async function getBeritaByTag(tagSlug: string) {
    try {
        const res = await fetch(getApiUrl("/api/berita"), { cache: "no-store" });
        if (!res.ok) return [];
        const json = await res.json();

        // Filter berita that have the specified tag
        const filtered = (json.data || []).filter((item: any) => {
            if (!item.tags || !Array.isArray(item.tags)) return false;
            return item.tags.some((tag: any) =>
                (typeof tag === 'string' && tag.toLowerCase() === tagSlug.toLowerCase()) ||
                (typeof tag === 'object' && tag.slug === tagSlug)
            );
        });

        return filtered;
    } catch (error) {
        console.error("Failed to fetch berita by tag:", error);
        return [];
    }
}

// Get tag name from tag slug
function getTagName(beritaList: any[], tagSlug: string): string {
    for (const berita of beritaList) {
        if (berita.tags && Array.isArray(berita.tags)) {
            const tag = berita.tags.find((t: any) =>
                (typeof t === 'object' && t.slug === tagSlug)
            );
            if (tag && typeof tag === 'object') {
                return tag.nama_tag;
            }
        }
    }
    return tagSlug;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const beritaList = await getBeritaByTag(slug);
    const tagName = getTagName(beritaList, slug);

    return {
        title: `Berita dengan Tag #${tagName}`,
        description: `Semua berita yang memiliki tag ${tagName} di Akademi Tekstil Surakarta`,
    };
}

export default async function TagFilterPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const beritaList = await getBeritaByTag(slug);
    const tagName = getTagName(beritaList, slug);

    return (
        <main className="bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-darkmode dark:via-darkmode dark:to-slate-900 min-h-screen">
            {/* Hero Header Section */}
            <section className="relative h-[300px] md:h-[350px] overflow-hidden">
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
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
                    <div className="text-center">



                        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                            Berita dengan Tag <span className="text-blue-300">#{tagName}</span>
                        </h1>
                        <p className="text-blue-100 text-base md:text-lg max-w-2xl mx-auto opacity-90">
                            {beritaList.length} berita ditemukan
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
                {beritaList.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {beritaList.map((item: any, index: number) => (
                            <article
                                key={item.id}
                                className="group relative bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-2 flex flex-col"
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
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-slate-800 dark:text-white font-bold text-lg leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 mb-3">
                                        {item.judul}
                                    </h3>

                                    {/* Decorative line */}
                                    <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-4 group-hover:w-20 transition-all duration-500" />

                                    {/* Footer */}
                                    <div className="mt-auto pt-4">
                                        <Link
                                            href={`/berita/${item.url_halaman}`}
                                            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm group/link"
                                        >
                                            <span className="relative">
                                                Baca Selengkapnya
                                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 group-hover/link:w-full transition-all duration-300" />
                                            </span>
                                            <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Tidak Ada Berita</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-6">Belum ada berita dengan tag #{tagName}</p>
                        <Link
                            href="/berita"
                            className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Lihat Semua Berita
                        </Link>
                    </div>
                )}

                {/* Back Link */}
                {beritaList.length > 0 && (
                    <div className="mt-12 text-center">
                        <Link
                            href="/berita"
                            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:underline group"
                        >
                            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Kembali ke Semua Berita
                        </Link>
                    </div>
                )}
            </section>
        </main>
    );
}
