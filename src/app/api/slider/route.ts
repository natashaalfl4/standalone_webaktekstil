import { NextResponse } from "next/server"
import { getApiUrl } from "@/utils/apiConfig"

export async function GET() {
    try {
        const res = await fetch(getApiUrl("/api/slider"), {
            cache: "no-store",
        })

        if (!res.ok) {
            throw new Error("API error")
        }

        const json = await res.json()

        return NextResponse.json(json)
    } catch (error) {
        console.warn("⚠️ API Slider gagal, pakai data fallback")
        return NextResponse.json({
            success: true,
            data: [],
            message: "Fallback data (API Error)"
        })
    }
}
