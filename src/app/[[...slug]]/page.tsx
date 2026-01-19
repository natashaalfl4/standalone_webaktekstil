import { notFound } from "next/navigation";
import { Metadata } from "next";
import HomeTemplate from "@/app/components/templates/HomeTemplate";
import StandardContentTemplate from "@/app/components/templates/StandardContentTemplate";
import BeritaListTemplate from "@/app/components/templates/BeritaListTemplate";
import PengumumanListTemplate from "@/app/components/templates/PengumumanListTemplate";
import AduanTemplate from "@/app/components/templates/AduanTemplate";
import { getApiUrl } from "@/utils/apiConfig";

// Helper: Fetch menu structure
async function getMenu() {
    try {
        const res = await fetch(getApiUrl("/api/menu"), { cache: "no-store" });
        if (!res.ok) return [];
        const json = await res.json();
        return json.data || [];
    } catch (error) {
        console.error("Failed to fetch menu:", error);
        return [];
    }
}

// Helper: Fetch all pages content
async function getPages() {
    try {
        const res = await fetch(getApiUrl("/api/pages"), { cache: "no-store", });
        if (!res.ok) return [];
        const json = await res.json();
        return json.data || [];
    } catch (error) {
        console.error("Failed to fetch pages:", error);
        return [];
    }
}

// Helper: Fetch single page detail by slug
async function getPageDetail(slug: string) {
    try {
        const res = await fetch(getApiUrl(`/api/pages/url/${slug}`), { cache: "no-store" });
        if (!res.ok) return null;
        const json = await res.json();
        return json.data || null;
    } catch (error) {
        console.error("Failed to fetch page detail:", error);
        return null;
    }
}

// Helper: Flatten menu to find match easily
function flattenMenu(items: any[]): any[] {
    let flattened: any[] = [];
    items.forEach(item => {
        flattened.push(item);
        if (item.children && item.children.length > 0) {
            flattened = flattened.concat(flattenMenu(item.children));
        }
    });
    return flattened;
}

// Helper: Normalize URL to remove leading slashes for consistent matching
function normalizePath(path: string | null): string {
    if (!path) return "";
    return path.startsWith("/") ? path.substring(1) : path;
}

// Helper: Find parent menu of a matched item
function findParentMenu(menuItems: any[], matchedItem: any): { name: string; url: string } | null {
    for (const item of menuItems) {
        if (item.children && item.children.length > 0) {
            // Check if matchedItem is a direct child
            const isChild = item.children.some((child: any) => {
                const childUrl = normalizePath(child.url_halaman);
                const matchedUrl = normalizePath(matchedItem.url_halaman);
                return childUrl === matchedUrl || child.id === matchedItem.id;
            });

            if (isChild) {
                return {
                    name: item.nama_menu,
                    url: item.url_halaman ? `/${normalizePath(item.url_halaman)}` : "#"
                };
            }

            // Check in grandchildren recursively
            const parentFromChildren = findParentMenu(item.children, matchedItem);
            if (parentFromChildren) {
                return parentFromChildren;
            }
        }
    }
    return null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
    const { slug } = await params;
    const currentPath = slug ? slug.join("/") : "";

    // Untuk homepage, biarkan layout yang menangani default title
    if (!currentPath) {
        return {};
    }

    const menuItems = await getMenu();
    const allItems = flattenMenu(menuItems);

    const matchedItem = allItems.find((item: any) => {
        const itemUrl = normalizePath(item.url_halaman);
        const pageUrl = item.page ? normalizePath(item.page.url_halaman) : "";
        return itemUrl === currentPath || pageUrl === currentPath;
    });

    if (matchedItem) {
        // Hanya kirim nama menu, suffix akan ditambahkan otomatis dari layout template
        return {
            title: matchedItem.nama_menu,
        };
    }

    return {
        title: "Halaman Tidak Ditemukan",
    };
}


export default async function DynamicPage({ params }: { params: Promise<{ slug?: string[] }> }) {
    const { slug } = await params;
    const currentPath = slug ? slug.join("/") : "";

    // Debug log removed for cleaner production code, but can be added back if needed

    const menuItems = await getMenu();
    const allItems = flattenMenu(menuItems);

    // 1. Root handling (Home)
    if (!currentPath) {
        const homeItem = allItems.find((item: any) => item.link_type === 'home');
        if (homeItem) {
            return <HomeTemplate />;
        }
        return <HomeTemplate />;
    }

    // 2. Find matching menu item with normalized paths
    const matchedItem = allItems.find((item: any) => {
        const itemUrl = normalizePath(item.url_halaman);
        const pageUrl = item.page ? normalizePath(item.page.url_halaman) : "";
        return itemUrl === currentPath || pageUrl === currentPath;
    });

    if (!matchedItem) {
        // Fallback for hardcoded routes if they are not in the menu yet
        if (currentPath === 'berita') return <BeritaListTemplate />;
        if (currentPath === 'pengumuman') return <PengumumanListTemplate />;
        if (currentPath === 'saran-dan-pengaduan') return <AduanTemplate />;

        return notFound();
    }

    // 3. Switch based on link_type
    switch (matchedItem.link_type) {
        case 'home':
            return <HomeTemplate />;
        case 'berita_list':
            return <BeritaListTemplate />;
        case 'pengumuman_list':
            return <PengumumanListTemplate />;
        case 'aduan':
        case 'aspirasi_aduan':
            return <AduanTemplate />;

        case 'konten_biasa': {
            let content = matchedItem.page ? matchedItem.page.konten : "";
            let formData = null;
            let embedUrl: any = matchedItem.page ? matchedItem.page.embed_url : "";
            let buttons: any[] = [];
            let linkGroups: any[] = [];

            // Fetch full details to get form if available
            const pageSlug = matchedItem.page?.url_halaman || normalizePath(matchedItem.url_halaman);

            if (pageSlug) {
                const fullPage = await getPageDetail(pageSlug);
                if (fullPage) {
                    content = fullPage.konten;
                    formData = fullPage.form;

                    // Handle embeds - can be array or single value
                    embedUrl = fullPage.embeds || fullPage.embed_url || "";

                    // Handle buttons - try multiple possible field names
                    const buttonData = fullPage.link_buttons || fullPage.buttons || fullPage.daftar_tombol || fullPage.tombol || [];

                    if (Array.isArray(buttonData) && buttonData.length > 0) {
                        buttons = buttonData.map((btn: any) => ({
                            text: btn.text || btn.teks_tombol || btn.button_text || btn.label || btn.nama || "",
                            url: btn.url || btn.link_tujuan || btn.button_url || btn.link || btn.href || "",
                            color: btn.color || btn.warna_tombol || btn.button_color || btn.warna || "biru"
                        }));
                    } else if (fullPage.button_url) {
                        buttons = [{
                            text: fullPage.button_text || "Lihat Selengkapnya",
                            url: fullPage.button_url,
                            color: "biru"
                        }];
                    }

                    // Handle link groups (like UNIB Pusat Informasi)
                    console.log('fullPage.link_groups:', fullPage.link_groups);
                    if (fullPage.link_groups && Array.isArray(fullPage.link_groups)) {
                        linkGroups = fullPage.link_groups;
                        console.log('linkGroups assigned:', linkGroups);
                    }
                }
            }

            // Find parent menu for breadcrumb
            const parentMenu = findParentMenu(menuItems, matchedItem);

            return (
                <StandardContentTemplate
                    title={matchedItem.nama_menu}
                    content={content || "<p>Belum ada konten.</p>"}
                    form={formData}
                    embedUrl={embedUrl}
                    buttons={buttons}
                    linkGroups={linkGroups}
                    parentMenu={parentMenu || undefined}
                />
            );
        }
        default:
            // Fallback for types without special handling
            const defaultParentMenu = findParentMenu(menuItems, matchedItem);
            return (
                <StandardContentTemplate
                    title={matchedItem.nama_menu}
                    content="<p>Halaman sedang dalam pengembangan.</p>"
                    parentMenu={defaultParentMenu || undefined}
                />
            );
    }
}
