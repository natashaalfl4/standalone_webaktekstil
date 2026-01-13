
import React from 'react';
import Hero from '../home/hero';
import Layanan from '../home/layanan';
import BeritaAcara from '../home/berita-acara';
import Pengumuman from '../home/pengumuman';
import MitraKerjasama from '../home/mitra-kerjasama';

import { getApiUrl, API_BASE_URL } from "@/utils/apiConfig";

// ... existing imports ...

export default async function HomeTemplate() {
    let sliderData = [];
    let beritaData = [];
    let pengumumanData = [];
    let mitraData = [];
    let layananData = [];

    // Fetch Slider Data
    try {
        const res = await fetch(getApiUrl("/api/slider"), {
            cache: "no-store",
        });
        if (res.ok) {
            const json = await res.json();
            sliderData = json.data || [];
        }
    } catch (error) {
        console.error("Failed to fetch slider data:", error);
    }

    // Fetch News Data
    try {
        const res = await fetch(getApiUrl("/api/berita"), {
            cache: "no-store", // Ensure fresh data
        });
        if (res.ok) {
            const json = await res.json();
            const rawData = json.data || [];

            // Transform API data to Component Interface
            beritaData = rawData.slice(0, 4).map((item: any) => ({ // Limit to 4
                id: item.id,
                title: item.judul,
                excerpt: item.konten ? item.konten.replace(/<[^>]+>/g, '').substring(0, 100) + "..." : "", // Strip HTML & Truncate
                image: item.thumbnail ? `${API_BASE_URL}/storage/${item.thumbnail}` : "",
                date: new Date(item.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }),
                slug: item.url_halaman
            }));
        }
    } catch (error) {
        console.error("Failed to fetch berita data:", error);
    }

    // Fetch Pengumuman Data
    try {
        const res = await fetch(getApiUrl("/api/pengumuman"), {
            cache: "no-store",
        });
        if (res.ok) {
            const json = await res.json();
            const rawData = json.data || [];

            // Limit to 6 items for the bento grid
            pengumumanData = rawData.slice(0, 6).map((item: any) => ({
                id: item.id,
                title: item.judul,
                excerpt: item.konten ? item.konten.replace(/<[^>]+>/g, '').substring(0, 100) + "..." : "",
                image: item.thumbnail ? `${API_BASE_URL}/storage/${item.thumbnail}` : "", // Fallback handled in component if empty string
                date: new Date(item.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }),
                slug: item.url_halaman
            }));
        }
    } catch (error) {
        console.error("Failed to fetch pengumuman data:", error);
    }

    // Fetch Mitra Data
    try {
        const res = await fetch(getApiUrl("/api/mitra"), {
            cache: "no-store",
        });
        if (res.ok) {
            const json = await res.json();
            const rawData = json.data || [];

            mitraData = rawData.map((item: any) => ({
                id: item.id,
                nama: item.nama_mitra,
                logo: item.logo ? `${API_BASE_URL}/storage/${item.logo}` : "",
                website: item.url
            }));
        }
    } catch (error) {
        console.error("Failed to fetch mitra data:", error);
    }

    // Fetch Layanan Data
    try {
        const res = await fetch(getApiUrl("/api/layanan"), {
            cache: "no-store",
        });
        if (res.ok) {
            const json = await res.json();
            const rawData = json.data || [];

            layananData = rawData.map((item: any) => ({
                id: item.id,
                nama_layanan: item.nama_layanan,
                icon: item.ikon ? `${API_BASE_URL}/storage/${item.ikon}` : "",
                link: item.tautan,
                urutan: item.urutan || 0,
            })).sort((a: any, b: any) => (a.urutan || 0) - (b.urutan || 0));
        }
    } catch (error) {
        console.error("Failed to fetch layanan data:", error);
    }

    return (
        <main>
            <Hero sliderData={sliderData} />
            <Layanan layananData={layananData} />
            <BeritaAcara beritaData={beritaData} />
            <Pengumuman pengumumanData={pengumumanData} />
            <MitraKerjasama mitraData={mitraData} />
        </main>
    )
}
