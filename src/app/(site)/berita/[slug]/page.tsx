
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import RelatedBeritaCarousel from "@/app/components/home/berita-acara/RelatedBeritaCarousel";
import ShareButtons from "@/app/components/shared/ShareButtons";
import CommentSection from "@/app/components/shared/CommentSection";
import { getApiUrl, API_BASE_URL } from "@/utils/apiConfig";

// Dynamic metadata with Open Graph tags for Facebook sharing
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;

    try {
        const res = await fetch(getApiUrl("/api/berita"), { cache: "no-store" });
        if (res.ok) {
            const json = await res.json();
            const data = json.data.find((item: any) =>
                item.url_halaman === slug || item.id.toString() === slug
            );

            if (data) {
                const thumbnailUrl = data.thumbnail
                    ? (data.thumbnail.startsWith('http') ? data.thumbnail : `${API_BASE_URL}/storage/${data.thumbnail}`)
                    : '/images/og-default.jpg';

                return {
                    title: data.judul,
                    description: data.konten?.replace(/<[^>]*>/g, '').substring(0, 160) || 'Berita dari Akademi Tekstil Surakarta',
                    openGraph: {
                        title: data.judul,
                        description: data.konten?.replace(/<[^>]*>/g, '').substring(0, 160) || 'Berita dari Akademi Tekstil Surakarta',
                        images: [{ url: thumbnailUrl, width: 1200, height: 630 }],
                        type: 'article',
                        siteName: 'Akademi Tekstil Surakarta',
                    },
                    twitter: {
                        card: 'summary_large_image',
                        title: data.judul,
                        description: data.konten?.replace(/<[^>]*>/g, '').substring(0, 160) || 'Berita dari Akademi Tekstil Surakarta',
                        images: [thumbnailUrl],
                    },
                };
            }
        }
    } catch (error) {
        console.error("Failed to generate metadata:", error);
    }

    return {
        title: "Detail Berita",
    };
}

async function getBeritaDetail(slug: string) {
    try {
        const res = await fetch(getApiUrl("/api/berita"), { cache: "no-store" });
        if (res.ok) {
            const json = await res.json();
            // Try to find by url_halaman first, then by id
            const found = json.data.find((item: any) =>
                item.url_halaman === slug || item.id.toString() === slug
            );
            return found || null;
        }
        return null;
    } catch (error) {
        console.error("Failed to fetch detail:", error);
        return null;
    }
}

async function getRelatedBerita(currentId: string) {
    try {
        const res = await fetch(getApiUrl("/api/berita"), { cache: "no-store" });
        if (!res.ok) return [];
        const json = await res.json();
        return (json.data || []).filter((item: any) => item.id.toString() !== currentId.toString()).slice(0, 5);
    } catch (error) {
        return [];
    }
}

export default async function BeritaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    // Handle potential URL encoding issues if slug has special chars, though usually slugs don't
    const decodedSlug = decodeURIComponent(slug);
    const data = await getBeritaDetail(decodedSlug);

    // We need data.id for related items and comments
    const related = data ? await getRelatedBerita(data.id) : [];

    if (!data) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#1a56db] flex items-center justify-center text-white">
                <div className="text-center">
                    <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Berita Tidak Ditemukan</h1>
                    <p className="text-blue-200 mb-6">Berita yang Anda cari tidak tersedia atau telah dihapus.</p>
                    <Link href="/berita" className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-6 py-3 rounded-full hover:bg-blue-50 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Kembali ke Daftar Berita
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main className="bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#1a56db] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 min-h-screen pt-32 pb-20 px-4 md:px-8">
            <div className="container mx-auto max-w-4xl">

                {/* Main Content Card */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl mb-12">

                    {/* Header Info */}
                    <div className="mb-8">
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
                            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                            <span>/</span>
                            <Link href="/berita" className="hover:text-blue-600 transition-colors">Berita</Link>
                            <span>/</span>
                            <span className="text-slate-600 dark:text-slate-300 truncate max-w-[200px]">{data.judul}</span>
                        </div>

                        <h1 className="text-slate-800 dark:text-white text-2xl md:text-4xl font-extrabold leading-tight mb-4">
                            {data.judul}
                        </h1>

                        {/* Decorative line */}
                        <div className="w-20 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-6" />

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-4">
                            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 gap-4">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{new Date(data.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                </div>
                                <span className="hidden md:inline">•</span>
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span>Admin</span>
                                </div>
                            </div>

                            {/* Share Buttons - No download for berita */}
                            <ShareButtons
                                title={data.judul}
                            />
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className="relative w-full aspect-video md:aspect-[16/9] lg:aspect-[21/9] bg-slate-100 dark:bg-slate-700 rounded-2xl overflow-hidden mb-8 shadow-inner">
                        <Image
                            src={data.thumbnail ?
                                (data.thumbnail.startsWith('http') ? data.thumbnail : `${API_BASE_URL}/storage/${data.thumbnail}`)
                                : '/images/placeholder.jpg'}
                            alt={data.judul}
                            fill
                            className="object-contain bg-slate-50 dark:bg-slate-800"
                        />
                    </div>

                    {/* Content Body */}
                    <div className="blog-details prose prose-lg dark:prose-invert max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: data.konten || "<p>Tidak ada konten detail.</p>" }} />
                    </div>

                    {/* Back Link */}
                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
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
                </div>

                {/* Comment Section */}
                <CommentSection type="berita" id={data.id} />

                {/* Related Section */}
                <div className="mt-16">
                    <div className="text-center mb-8">
                        <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-blue-200 text-sm font-medium mb-4 border border-white/20">
                            📰 Baca Juga
                        </span>
                        <h3 className="text-white text-2xl md:text-3xl font-bold tracking-tight">
                            Berita Lainnya
                        </h3>
                    </div>
                    <RelatedBeritaCarousel items={related} />
                </div>

            </div>
        </main>
    );
}
