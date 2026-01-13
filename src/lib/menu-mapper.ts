type ApiMenu = {
  id: number;
  nama_menu: string;
  link_type: string;
  url_halaman?: string | null;
  page?: {
    url_halaman: string;
  };
  children?: ApiMenu[];
};

type HeaderMenu = {
  label: string;
  href: string;
  submenu?: HeaderMenu[];
};

function resolveHref(menu: ApiMenu): string {
  switch (menu.link_type) {
    case "home":
      return "/";
    case "konten_biasa":
      return `/${menu.page?.url_halaman ?? ""}`;
    case "custom":
      return menu.url_halaman ?? "#";
    default:
      return "#";
  }
}

export function mapMenu(apiMenus: ApiMenu[]): HeaderMenu[] {
  return apiMenus.map((menu) => ({
    label: menu.nama_menu,
    href: resolveHref(menu),
    submenu: menu.children?.length
      ? mapMenu(menu.children)
      : undefined,
  }));
}