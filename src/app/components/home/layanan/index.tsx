"use client";
import Link from "next/link";
import Image from "next/image";
import { getImgPath } from "@/utils/pathUtils";

export interface LayananItem {
    id: number;
    nama_layanan: string;
    icon: string;
    link: string;
    urutan: number;
}

interface LayananProps {
    layananData: LayananItem[];
}

const Layanan = ({ layananData }: LayananProps) => {

    if (!layananData || layananData.length === 0) {
        return null;
    }

    return (
        <section className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-darkmode dark:via-slate-900 dark:to-slate-800 py-20 px-4 overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-200/20 dark:bg-cyan-900/10 rounded-full blur-3xl" />

            <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md relative z-10">
                {/* Header Section */}
                <div className="text-center mb-14">
                    <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 text-sm font-semibold rounded-full mb-4">
                        🎓 Layanan Kami
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-800 dark:text-white mb-4 tracking-tight">
                        Layanan Akademik
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                        Akses berbagai layanan akademik dan informasi penting untuk kebutuhan mahasiswa
                    </p>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full mx-auto mt-6" />
                </div>

                {/* Service Cards Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {layananData.map((item, index) => {
                        // Array of gradient colors for variety - more saturated
                        const gradientColors = [
                            'from-blue-100 to-blue-200 border-blue-300 hover:border-blue-500',
                            'from-blue-100 to-blue-200 border-blue-300 hover:border-blue-500',
                            'from-blue-100 to-blue-200 border-blue-300 hover:border-blue-500',
                            'from-blue-100 to-blue-200 border-blue-300 hover:border-blue-500',
                            'from-blue-100 to-blue-200 border-blue-300 hover:border-blue-500',
                            'from-blue-100 to-blue-200 border-blue-300 hover:border-blue-500',
                            'from-blue-100 to-blue-200 border-blue-300 hover:border-blue-500',
                            'from-blue-100 to-blue-200 border-blue-300 hover:border-blue-500',
                            'from-blue-100 to-blue-200 border-blue-300 hover:border-blue-500',
                            'from-blue-100 to-blue-200 border-blue-300 hover:border-blue-500'
                        ];
                        const colorClass = gradientColors[index % gradientColors.length];

                        return (
                            <Link
                                key={item.id}
                                href={item.link || "#"}
                                className={`group relative bg-gradient-to-br ${colorClass} dark:from-slate-800 dark:to-slate-700 dark:border-slate-600 dark:hover:border-blue-500 border-2 rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all duration-500 hover:-translate-y-2 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 hover:shadow-2xl hover:shadow-blue-500/20 min-h-[160px]`}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Icon Container */}
                                <div className="mb-4 relative w-14 h-14 bg-white/80 dark:bg-slate-900/50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                    {item.icon ? (
                                        <Image
                                            src={item.icon.startsWith("http") ? item.icon : getImgPath(item.icon)}
                                            alt={item.nama_layanan}
                                            fill
                                            className="object-contain p-2"
                                        />
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    )}
                                </div>

                                {/* Title */}
                                <h3 className="text-slate-700 dark:text-white font-bold text-sm leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                    {item.nama_layanan}
                                </h3>

                                {/* Hover arrow indicator */}
                                <div className="absolute bottom-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Layanan;
