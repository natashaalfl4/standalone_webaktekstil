import { NextResponse } from "next/server"
import { getApiUrl } from "@/utils/apiConfig"

function mapMenu(items: any[]): any[] {
  return items.map((item) => ({
    label: item.nama_menu,
    href: item.url_halaman || (item.page?.url_halaman ? `/${item.page.url_halaman}` : "#"),
    submenu: item.children && item.children.length
      ? mapMenu(item.children)
      : undefined,
  }))
}

export async function GET() {
  console.log("API MENU: Fetching from backend...");
  try {
    const res = await fetch(getApiUrl("/api/menu"), {
      cache: "no-store",
    })
    console.log("API MENU: Backend Fetch Status:", res.status);

    const json = await res.json();
    console.log("API MENU: Backend Data received, length:", json.data?.length);

    const mapped = mapMenu(json.data);
    console.log("API MENU: Mapped Data sample:", JSON.stringify(mapped[0]));

    return NextResponse.json({
      success: true,
      data: mapped,
    })
  } catch (error) {
    console.error("API MENU: Error fetching menu:", error);
    return NextResponse.json({ success: false, data: [] });
  }
}
