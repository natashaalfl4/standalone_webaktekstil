import { DM_Sans } from "next/font/google";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Aoscompo from "@/utils/aos";
const dmsans = DM_Sans({ subsets: ["latin"] });
import NextTopLoader from 'nextjs-toploader';
import Footer from "./components/layout/footer";
import ScrollToTop from "./components/scroll-to-top";
import Header from "./components/layout/header";
import { getHeaderData } from "@/lib/getHeaderData";
import { getFooterData } from "@/lib/getFooterData";
import { Metadata } from "next";
import { API_BASE_URL } from "@/utils/apiConfig";

const DEFAULT_SITE_NAME = "Akademi Tekstil Surakarta";

export async function generateMetadata(): Promise<Metadata> {
  const footerData = await getFooterData();

  const siteName = footerData?.website_title || DEFAULT_SITE_NAME;

  // Build favicon URL if available
  let faviconUrl: string | undefined;
  if (footerData?.favicon) {
    faviconUrl = footerData.favicon.startsWith('http')
      ? footerData.favicon
      : `${API_BASE_URL}/storage/${footerData.favicon}`;
  }

  return {
    title: {
      default: siteName,
      template: `%s - ${siteName}`,
    },
    description: footerData?.description || "Website resmi Akademi Tekstil Surakarta",
    icons: faviconUrl ? {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    } : undefined,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [headerData, footerData] = await Promise.all([getHeaderData(), getFooterData()]);

  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${dmsans.className}`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          enableSystem={false}
          defaultTheme="light"
        >
          <Aoscompo>
            <Header headerLogo={footerData?.header_logo ?? footerData?.logo} />
            <NextTopLoader />
            {children}
            <Footer />
          </Aoscompo>
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
