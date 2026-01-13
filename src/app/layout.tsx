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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [headerData, footerData] = await Promise.all([getHeaderData(), getFooterData()]);

  return (
    <html lang="en" suppressHydrationWarning>
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

