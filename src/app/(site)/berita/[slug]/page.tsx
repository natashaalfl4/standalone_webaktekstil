
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
        // Fetch first page
        const firstRes = await fetch(getApiUrl("/api/berita?page=1"), { cache: "no-store" });
        if (!firstRes.ok) return { title: "Detail Berita" };

        const firstJson = await firstRes.json();
        let allBerita = firstJson.data || [];
        const lastPage = firstJson.meta?.last_page || 1;

        // Fetch remaining pages if there are more
        if (lastPage > 1) {
            const pagePromises = [];
            for (let page = 2; page <= lastPage; page++) {
                pagePromises.push(
                    fetch(getApiUrl(`/api/berita?page=${page}`), { cache: "no-store" })
                        .then(res => res.ok ? res.json() : { data: [] })
                        .then(json => json.data || [])
                );
            }
            const additionalPages = await Promise.all(pagePromises);
            additionalPages.forEach(pageData => {
                allBerita = allBerita.concat(pageData);
            });
        }

        const data = allBerita.find((item: any) =>
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
    } catch (error) {
        console.error("Failed to generate metadata:", error);
    }

    return {
        title: "Detail Berita",
    };
}

async function getBeritaDetail(slug: string) {
    try {
        // Fetch first page to get pagination info
        const firstRes = await fetch(getApiUrl("/api/berita?page=1"), { cache: "no-store" });
        if (!firstRes.ok) return null;

        const firstJson = await firstRes.json();
        let allBerita = firstJson.data || [];
        const lastPage = firstJson.meta?.last_page || 1;

        console.log(`[DETAIL] Fetching berita detail for slug: ${slug}`);
        console.log(`[DETAIL] Total pages: ${lastPage}`);

        // Fetch remaining pages if there are more
        if (lastPage > 1) {
            const pagePromises = [];
            for (let page = 2; page <= lastPage; page++) {
                pagePromises.push(
                    fetch(getApiUrl(`/api/berita?page=${page}`), { cache: "no-store" })
                        .then(res => res.ok ? res.json() : { data: [] })
                        .then(json => json.data || [])
                );
            }
            const additionalPages = await Promise.all(pagePromises);
            additionalPages.forEach(pageData => {
                allBerita = allBerita.concat(pageData);
            });
        }

        console.log(`[DETAIL] Total berita fetched: ${allBerita.length}`);

        // Try to find by url_halaman first, then by id
        const found = allBerita.find((item: any) => {
            const match = item.url_halaman === slug || item.id.toString() === slug;
            if (match) {
                console.log(`[DETAIL] Found match: ${item.judul} (url_halaman: ${item.url_halaman})`);
            }
            return match;
        });

        if (!found) {
            console.log(`[DETAIL] No match found for slug: ${slug}`);
            console.log(`[DETAIL] Available slugs:`, allBerita.map((item: any) => item.url_halaman).slice(0, 5));
        }

        return found || null;
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

                    {/* Tags Section */}
                    {(() => {
                        // Convert tags to array format if needed
                        let tagsArray: any[] = [];

                        if (data.tags) {
                            if (Array.isArray(data.tags)) {
                                tagsArray = data.tags;
                            } else if (typeof data.tags === 'string') {
                                // If tags is a string like "teknologi,industri", split it
                                tagsArray = data.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0);
                            }
                        }

                        return tagsArray.length > 0 ? (
                            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
                                <div className="flex items-start gap-3">
                                    <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-sm font-medium min-w-fit">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                        <span>Tags:</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {tagsArray.map((tag: any, index: number) => {
                                            const tagSlug = typeof tag === 'string' ? tag.toLowerCase().replace(/\s+/g, '-') : tag.slug;
                                            const tagName = typeof tag === 'string' ? tag : tag.nama_tag;

                                            return (
                                                <Link
                                                    key={tag.id || index}
                                                    href={`/berita/tag/${tagSlug}`}
                                                    className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-200 dark:border-blue-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white hover:border-blue-600 transition-all duration-200 hover:scale-105 cursor-pointer"
                                                >
                                                    <span className="text-blue-500 dark:text-blue-500 group-hover:text-white">#</span>
                                                    {tagName}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        ) : null;
                    })()}

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
