import { Metadata } from "next";
import { getApiUrl } from "@/utils/apiConfig";
import BeritaListClient from "@/app/components/templates/BeritaListClient";

export const metadata: Metadata = {
    title: "Semua Berita",
};

async function getBerita() {
    try {
        // First fetch to get total pages from meta
        const firstRes = await fetch(getApiUrl("/api/berita?page=1"), { cache: "no-store" });
        if (!firstRes.ok) return [];
        const firstJson = await firstRes.json();

        let allBerita = firstJson.data || [];
        const lastPage = firstJson.meta?.last_page || 1;

        console.log(`[BERITA] First page fetched. Total in meta: ${firstJson.meta?.total}, Last Page: ${lastPage}, Current items: ${allBerita.length}`);

        // Fetch remaining pages if there are more
        if (lastPage > 1) {
            console.log(`[BERITA] Fetching additional pages 2 to ${lastPage}...`);
            const pagePromises = [];
            for (let page = 2; page <= lastPage; page++) {
                pagePromises.push(
                    fetch(getApiUrl(`/api/berita?page=${page}`), { cache: "no-store" })
                        .then(res => res.ok ? res.json() : { data: [] })
                        .then(json => {
                            console.log(`[BERITA] Page ${page} fetched: ${json.data?.length || 0} items`);
                            return json.data || [];
                        })
                );
            }
            const additionalPages = await Promise.all(pagePromises);
            additionalPages.forEach(pageData => {
                allBerita = allBerita.concat(pageData);
            });
        }

        console.log(`[BERITA] Total items fetched: ${allBerita.length}`);
        return allBerita;
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

            {/* Content Grid with Pagination */}
            <section className="container mx-auto px-4 py-12 md:py-16 relative z-20">
                <BeritaListClient beritaData={beritaData} itemsPerPage={12} />
            </section>

            {/* Decorative Footer Wave */}
            <div className="relative h-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-100 dark:from-slate-900 to-transparent" />
            </div>
        </main>
    );
}

