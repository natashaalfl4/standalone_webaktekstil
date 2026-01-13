import { getApiUrl } from "@/utils/apiConfig";

export interface QuickLink {
    url: string;
    label: string;
}

export interface RelatedLink {
    url: string;
    label: string;
}

export interface FooterData {
    id: number;
    logo: string;
    header_logo?: string;
    description: string;
    phone: string;
    email: string;
    address: string;
    facebook: string | null;
    instagram: string | null;
    twitter: string | null;
    youtube: string | null;
    quick_links: QuickLink[];
    related_links: RelatedLink[];
    copyright: string;
}


export const getFooterData = async (): Promise<FooterData | null> => {
    try {
        const res = await fetch(getApiUrl("/api/footer"), {
            cache: "no-store",
        });

        if (!res.ok) throw new Error("API error");

        const json = await res.json();
        return json.data;
    } catch (error) {
        console.warn("⚠️ Gagal mengambil data footer dari API");
        return null;
    }
}
