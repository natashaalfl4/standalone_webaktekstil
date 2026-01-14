import Image from "next/image";
import Link from "next/link";
import { getImgPath } from '@/utils/pathUtils';
import { getFooterData } from "@/lib/getFooterData";

const Footer = async () => {
  const data = await getFooterData();

  if (!data) {
    return (
      <footer className="relative bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#1a56db] text-white overflow-hidden min-h-[400px] flex items-center justify-center">
        <div className="text-blue-200">Footer content unavailable</div>
      </footer>
    )
  }

  return (
    <footer className="relative bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#1a56db] text-white overflow-hidden">
      {/* Wave Decoration at Top */}
      <div className="absolute top-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,0 L0,0 Z" fill="#f8fafc" className="dark:fill-darkmode" />
        </svg>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md pt-24 pb-8 px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <div className="bg-white rounded-xl p-3 inline-block shadow-lg">
                <Image
                  src={getImgPath(data.logo)}
                  alt="AK Tekstil Solo Logo"
                  width={140}
                  height={35}
                  className="rounded"
                />
              </div>
            </Link>
            <p className="text-blue-100 text-sm leading-relaxed mb-6">
              {data.description}
            </p>
            {/* Social Media */}
            <div className="flex items-center gap-3">
              {data.facebook && (
                <a
                  aria-label="Facebook link"
                  href={data.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-blue-500 transition-all duration-300 group"
                >
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" className="text-white">
                    <path d="M16.294 8.86875H14.369H13.6815V8.18125V6.05V5.3625H14.369H15.8128C16.1909 5.3625 16.5003 5.0875 16.5003 4.675V1.03125C16.5003 0.653125 16.2253 0.34375 15.8128 0.34375H13.3034C10.5878 0.34375 8.69714 2.26875 8.69714 5.12187V8.1125V8.8H8.00964H5.67214C5.19089 8.8 4.74402 9.17812 4.74402 9.72812V12.2031C4.74402 12.6844 5.12214 13.1313 5.67214 13.1313H7.94089H8.62839V13.8188V20.7281C8.62839 21.2094 9.00652 21.6562 9.55652 21.6562H12.7878C12.994 21.6562 13.1659 21.5531 13.3034 21.4156C13.4409 21.2781 13.544 21.0375 13.544 20.8312V13.8531V13.1656H14.2659H15.8128C16.2596 13.1656 16.6034 12.8906 16.6721 12.4781V12.4438V12.4094L17.1534 10.0375C17.1878 9.79688 17.1534 9.52187 16.9471 9.24687C16.8784 9.075 16.569 8.90312 16.294 8.86875Z" />
                  </svg>
                </a>
              )}
              {data.twitter && (
                <a
                  aria-label="Twitter link"
                  href={data.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-blue-500 transition-all duration-300 group"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-white">
                    <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
                  </svg>
                </a>
              )}
              {data.instagram && (
                <a
                  aria-label="Instagram link"
                  href={data.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-blue-500 transition-all duration-300 group"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.344 3.608 1.32.975.975 1.258 2.242 1.32 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.344 2.633-1.32 3.608-.975.975-2.242 1.258-3.608 1.32-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.344-3.608-1.32-.975-.975-1.258-2.242-1.32-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.344-2.633 1.32-3.608.975-.975 2.242-1.258 3.608-1.32C8.416 2.175 8.796 2.163 12 2.163zM12 0C8.74 0 8.332.013 7.052.072 5.765.131 4.64.361 3.678.922 2.692 1.5 1.825 2.367 1.246 3.353c-.56.962-.79 2.087-.849 3.374C.013 8.333 0 8.741 0 12s.013 3.667.072 4.948c.059 1.287.289 2.412.849 3.374.58.986 1.447 1.853 2.433 2.432.962.56 2.087.79 3.374.849C8.333 23.987 8.741 24 12 24s3.667-.013 4.948-.072c1.287-.059 2.412-.289 3.374-.849.986-.58 1.853-1.447 2.432-2.433.56-.962.79-2.087.849-3.374.059-1.281.072-1.689.072-4.948s-.013-3.667-.072-4.948c-.059-1.287-.289-2.412-.849-3.374-.58-.986-1.447-1.853-2.433-2.432-.962-.56-2.087-.79-3.374-.849C15.667.013 15.259 0 12 0z" />
                    <path d="M12 5.838A6.162 6.162 0 1 0 18.162 12 6.169 6.169 0 0 0 12 5.838zm0 10.162A3.999 3.999 0 1 1 16 12a4 4 0 0 1-4 4z" />
                    <circle cx="18.406" cy="5.594" r="1.44" />
                  </svg>
                </a>
              )}
              {data.youtube && (
                <a
                  aria-label="YouTube link"
                  href={data.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-red-500 transition-all duration-300 group"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-500/30 rounded-lg flex items-center justify-center">📞</span>
              Hubungi Kami
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <span className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                <div>
                  <p className="text-blue-200 text-xs">Telepon</p>
                  <p className="text-white text-sm">{data.phone}</p>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <span className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <div>
                  <p className="text-blue-200 text-xs">Email</p>
                  <p className="text-white text-sm">{data.email}</p>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <span className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <div>
                  <p className="text-blue-200 text-xs">Alamat</p>
                  <p className="text-white text-sm">{data.address}</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-500/30 rounded-lg flex items-center justify-center">🔗</span>
              Link Cepat
            </h4>
            <ul className="space-y-3">
              {data.quick_links.map((link, index) => {
                // Normalize URL: add https:// if starts with www.
                let normalizedUrl = link.url;
                if (link.url.startsWith('www.')) {
                  normalizedUrl = `https://${link.url}`;
                }

                const isExternal = normalizedUrl.startsWith('http://') || normalizedUrl.startsWith('https://');
                return (
                  <li key={index}>
                    {isExternal ? (
                      <a
                        href={normalizedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-100 hover:text-white transition-colors flex items-center gap-2 group"
                      >
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full group-hover:bg-white transition-colors"></span>
                        {link.label}
                      </a>
                    ) : (
                      <Link href={`/${normalizedUrl}`} className="text-blue-100 hover:text-white transition-colors flex items-center gap-2 group">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full group-hover:bg-white transition-colors"></span>
                        {link.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Related Pages */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-500/30 rounded-lg flex items-center justify-center">🌐</span>
              Halaman Terkait
            </h4>
            <ul className="space-y-3">
              {data.related_links.map((link, index) => {
                // Normalize URL: add https:// if starts with www.
                let normalizedUrl = link.url;
                if (link.url.startsWith('www.')) {
                  normalizedUrl = `https://${link.url}`;
                } else if (!link.url.startsWith('http://') && !link.url.startsWith('https://')) {
                  normalizedUrl = `https://${link.url}`;
                }

                return (
                  <li key={index}>
                    <a
                      href={normalizedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-100 hover:text-white transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full group-hover:bg-white transition-colors"></span>
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent mb-6" />

        {/* Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-blue-200 text-sm text-center md:text-left">
            {data.copyright}
          </p>
          <div className="flex items-center gap-2 text-blue-200 text-sm">
            <span>Di bawah naungan</span>
            <Link href="https://www.kemenperin.go.id/" target="_blank" className="text-white hover:text-blue-300 font-semibold transition-colors">
              Kementerian Perindustrian RI
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
