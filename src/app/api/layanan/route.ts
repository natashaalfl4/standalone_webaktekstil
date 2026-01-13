import { NextResponse } from "next/server"
import { getApiUrl } from "@/utils/apiConfig"

// Fallback data jika API Laravel tidak tersedia
const fallbackLayanan = [
    {
        id: 1,
        nama_layanan: "Penerimaan Mahasiswa Baru",
        icon: "megaphone",
        link: "/pmb",
        urutan: 1,
    },
    {
        id: 2,
        nama_layanan: "Tracer Study",
        icon: "graduation",
        link: "/tracer-study",
        urutan: 2,
    },
    {
        id: 3,
        nama_layanan: "Pengguna Dunia Industri",
        icon: "building",
        link: "/pengguna-industri",
        urutan: 3,
    },
    {
        id: 4,
        nama_layanan: "Kepuasan Pelayanan Akademik",
        icon: "check",
        link: "/kepuasan-akademik",
        urutan: 4,
    },
    {
        id: 5,
        nama_layanan: "Sistem Informasi Akademik",
        icon: "computer",
        link: "/siakad",
        urutan: 5,
    },
]

export async function GET() {
    try {
        const res = await fetch(getApiUrl("/api/layanan"), {
            cache: "no-store",
        })

        if (!res.ok) {
            throw new Error("API error")
        }

        const json = await res.json()

        return NextResponse.json({
            success: true,
            data: json.data,
        })
    } catch (error) {
        console.warn("⚠️ API Layanan gagal, pakai data fallback")
        return NextResponse.json({
            success: true,
            data: fallbackLayanan,
        })
    }
}
