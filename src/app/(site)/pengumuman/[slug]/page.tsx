
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import RelatedCarousel from "@/app/components/home/pengumuman/RelatedCarousel";
import ShareButtons from "@/app/components/shared/ShareButtons";
import CommentSection from "@/app/components/shared/CommentSection";
import { getApiUrl, API_BASE_URL } from "@/utils/apiConfig";

// Dynamic metadata with Open Graph tags for Facebook sharing
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;

    try {
        const res = await fetch(getApiUrl(`/api/pengumuman/${slug}`), { cache: "no-store" });
        if (res.ok) {
            const json = await res.json();
            if (json.success && json.data) {
                const data = json.data;
                const thumbnailUrl = data.thumbnail
                    ? (data.thumbnail.startsWith('http') ? data.thumbnail : `${API_BASE_URL}/storage/${data.thumbnail}`)
                    : '/images/og-default.jpg';

                return {
                    title: `${data.judul} - Akademi Tekstil Surakarta`,
                    description: data.konten?.replace(/<[^>]*>/g, '').substring(0, 160) || 'Pengumuman dari Akademi Tekstil Surakarta',
                    openGraph: {
                        title: data.judul,
                        description: data.konten?.replace(/<[^>]*>/g, '').substring(0, 160) || 'Pengumuman dari Akademi Tekstil Surakarta',
                        images: [{ url: thumbnailUrl, width: 1200, height: 630 }],
                        type: 'article',
                        siteName: 'Akademi Tekstil Surakarta',
                    },
                    twitter: {
                        card: 'summary_large_image',
                        title: data.judul,
                        description: data.konten?.replace(/<[^>]*>/g, '').substring(0, 160) || 'Pengumuman dari Akademi Tekstil Surakarta',
                        images: [thumbnailUrl],
                    },
                };
            }
        }
    } catch (error) {
        console.error("Failed to generate metadata:", error);
    }

    return {
        title: "Detail Pengumuman - Akademi Tekstil Surakarta",
    };
}

async function getAnnouncementDetail(slug: string) {
    try {
        // First try the detail endpoint that returns button_url and button_text
        const detailRes = await fetch(getApiUrl(`/api/pengumuman/${slug}`), { cache: "no-store" });
        if (detailRes.ok) {
            const json = await detailRes.json();
            if (json.success && json.data) {
                return json.data;
            }
        }

        // Fallback to list endpoint if detail doesn't work
        const res = await fetch(getApiUrl("/api/pengumuman"), { cache: "no-store" });
        if (res.ok) {
            const json = await res.json();
            const found = json.data.find((item: any) => item.url_halaman?.trim() === slug?.trim());

            if (!found) {
                return {
                    notFound: true,
                    debug: {
                        receivedSlug: slug,
                        availableSlugs: json.data.map((i: any) => i.url_halaman).slice(0, 10),
                        totalItems: json.data.length
                    }
                };
            }
            return found;
        }
        return null;
    } catch (error) {
        console.error("Failed to fetch detail:", error);
        return null;
    }
}

async function getRelatedAnnouncements(currentId: string) {
    try {
        const res = await fetch(getApiUrl("/api/pengumuman"), { cache: "no-store" });
        if (!res.ok) return [];
        const json = await res.json();
        return (json.data || []).filter((item: any) => item.id.toString() !== currentId.toString()).slice(0, 5);
    } catch (error) {
        return [];
    }
}

export default async function AnnouncementDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    // Handle potential URL encoding issues if slug has special chars, though usually slugs don't
    const decodedSlug = decodeURIComponent(slug);
    const data = await getAnnouncementDetail(decodedSlug);

    // We need data.id for related items and comments
    const related = (data && !data.notFound) ? await getRelatedAnnouncements(data.id) : [];

    if (!data || data.notFound) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#1a56db] flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Pengumuman Tidak Ditemukan</h1>
                    <Link href="/pengumuman" className="underline hover:text-blue-200">Kembali ke Daftar Pengumuman</Link>

                    {/* DEBUG SECTION - REMOVE LATER */}
                    <div className="mt-8 p-4 bg-black/50 rounded text-left font-mono text-xs overflow-auto max-h-96 max-w-4xl mx-auto break-all whitespace-pre-wrap">
                        <p className="font-bold text-yellow-300">DEBUG INFO:</p>
                        <p>Recieved Slug: &quot;{decodedSlug}&quot;</p>
                        <p>String Length: {decodedSlug.length}</p>
                        <hr className="my-2 border-white/20" />
                        {data?.debug && (
                            <>
                                <p>Available Slugs (First 10):</p>
                                <ul className="list-disc pl-4">
                                    {data.debug.availableSlugs.map((s: string, i: number) => (
                                        <li key={i}>
                                            &quot;{s}&quot; <span className="text-gray-400"> (len: {s.length})</span>
                                            {s === decodedSlug ? <span className="text-green-400 font-bold"> MATCH!</span> : <span className="text-red-400"> NO MATCH</span>}
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
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
                        <h1 className="text-[#1a365d] dark:text-white text-3xl md:text-4xl font-extrabold uppercase leading-tight mb-4">
                            {data.judul}
                        </h1>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-4">
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-4">
                                <span>{new Date(data.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                <span>•</span>
                                <span>Admin</span>
                            </div>

                            {/* Share Buttons (Right aligned) - only share, no download */}
                            <ShareButtons title={data.judul} />
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className="relative w-full aspect-video md:aspect-[16/9] lg:aspect-[21/9] bg-gray-100 rounded-2xl overflow-hidden mb-8 shadow-inner">
                        <Image
                            src={data.thumbnail ?
                                (data.thumbnail.startsWith('http') ? data.thumbnail : `${API_BASE_URL}/storage/${data.thumbnail}`)
                                : '/images/placeholder.jpg'}
                            alt={data.judul}
                            fill
                            className="object-contain bg-gray-50 dark:bg-gray-800"
                        />
                    </div>

                    {/* Content Body */}
                    <div className="blog-details">
                        <div dangerouslySetInnerHTML={{ __html: data.konten || "<p>Tidak ada konten detail.</p>" }} />
                    </div>

                    {/* Link Buttons - from CMS link_buttons array or single button_url */}
                    {(() => {
                        // Get button color class
                        const getButtonColorClass = (color?: string) => {
                            switch (color?.toLowerCase()) {
                                case 'hijau':
                                case 'green':
                                    return 'bg-green-600 hover:bg-green-700';
                                case 'merah':
                                case 'red':
                                    return 'bg-red-600 hover:bg-red-700';
                                case 'kuning':
                                case 'yellow':
                                    return 'bg-yellow-500 hover:bg-yellow-600 text-black';
                                case 'abu':
                                case 'gray':
                                    return 'bg-gray-600 hover:bg-gray-700';
                                case 'utama (biru)':
                                case 'biru':
                                case 'blue':
                                default:
                                    return 'bg-[#1a56db] hover:bg-blue-700';
                            }
                        };

                        // Check for array of buttons first
                        const buttonData = data.link_buttons || data.buttons || data.daftar_tombol || [];

                        if (Array.isArray(buttonData) && buttonData.length > 0) {
                            return (
                                <div className="mt-8 flex flex-wrap justify-center gap-4">
                                    {buttonData.map((btn: any, index: number) => (
                                        <a
                                            key={index}
                                            href={btn.url || btn.link_tujuan || btn.button_url || "#"}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`inline-flex items-center gap-2 px-6 py-3 ${getButtonColorClass(btn.color || btn.warna_tombol)} text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5`}
                                        >
                                            {btn.text || btn.teks_tombol || btn.button_text || "Lihat Selengkapnya"}
                                        </a>
                                    ))}
                                </div>
                            );
                        }

                        // Fallback to single button
                        if (data.button_url) {
                            return (
                                <div className="mt-8 flex justify-center">
                                    <a
                                        href={data.button_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a56db] hover:bg-blue-700 text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                    >
                                        {data.button_text || "Download Pengumuman"}
                                    </a>
                                </div>
                            );
                        }

                        return null;
                    })()}



                    <div className="mt-8 pt-6">
                        <Link href="/pengumuman" className="inline-flex items-center text-blue-600 font-semibold hover:underline">
                            &larr; Kembali ke Semua Pengumuman
                        </Link>
                    </div>
                </div>

                {/* Comment Section */}
                <CommentSection type="pengumuman" id={data.id} />

                {/* Related Section */}
                <div className="mt-16">
                    <h3 className="text-white text-2xl font-bold mb-6 text-center uppercase tracking-wide">Pengumuman Lainnya</h3>
                    <RelatedCarousel items={related} />
                </div>

            </div>
        </main>
    );
}
