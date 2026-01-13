import { mapMenu } from "@/lib/menu-mapper";
import layoutData from "@/../public/data/layoutdata.json";
import { getApiUrl } from "@/utils/apiConfig";

export async function getHeaderData() {
  try {
    const res = await fetch(getApiUrl("/api/menu"), {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("API error");

    const json = await res.json();
    return mapMenu(json.data); // 🔥 dari Laravel
  } catch (error) {
    console.warn("⚠️ API gagal, pakai JSON statis");
    return layoutData.headerData; // 🔙 fallback
  }
}
