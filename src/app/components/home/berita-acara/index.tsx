"use client";
import Image from "next/image";
import Link from "next/link";
import { getImgPath } from "@/utils/pathUtils";

export interface BeritaItem {
    id: number;
    title: string;
    excerpt: string;
    image: string;
    date: string;
    slug: string;
}

interface BeritaAcaraProps {
    beritaData: BeritaItem[];
}

const BeritaAcara = ({ beritaData }: BeritaAcaraProps) => {

    if (!beritaData || beritaData.length === 0) {
        return null;
    }

    return (
        <section className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-darkmode dark:via-slate-900 dark:to-slate-800 py-20 px-4 overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

            <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md relative z-10">
                {/* Header Section */}
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-800 dark:text-white mb-4 tracking-tight">
                        Berita & Kegiatan
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                        Ikuti perkembangan terbaru dan kegiatan menarik dari Akademi Tekstil Surakarta
                    </p>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full mx-auto mt-6" />
                </div>

                {/* News Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {beritaData.map((item, index) => (
                        <Link
                            key={item.id}
                            href={`/berita/${item.slug}`}
                            className="group relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-2"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Image Container */}
                            <div className="relative h-52 overflow-hidden">
                                <Image
                                    src={item.image.startsWith("http") ? item.image : getImgPath(item.image)}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-all duration-700 group-hover:scale-110"
                                />
                                {/* Overlay - lighter opacity */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-black/20" />

                                {/* Date Badge */}
                                <div className="absolute top-3 left-3">
                                    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg">
                                        <span className="text-xs font-bold text-blue-600 dark:text-white block text-center leading-tight">
                                            {item.date}
                                        </span>
                                    </div>
                                </div>

                                {/* Title on Image */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                    <h3 className="font-bold text-base leading-snug line-clamp-2" style={{ color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                                        {item.title}
                                    </h3>
                                </div>
                            </div>

                            {/* Content Container */}
                            <div className="p-4">
                                <p className="text-slate-600 dark:text-slate-300 text-xs line-clamp-2 mb-3">
                                    {item.excerpt}
                                </p>

                                {/* Read More Link */}
                                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-xs group/link">
                                    <span>Baca Selengkapnya</span>
                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>

                            {/* Hover Border Effect */}
                            <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/50 rounded-2xl transition-colors duration-300 pointer-events-none" />
                        </Link>
                    ))}
                </div>

                {/* View More Button */}
                <div className="flex justify-center">
                    <Link
                        href="/berita/"
                        className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-full shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-1"
                    >
                        <span>Lihat Semua Berita</span>
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                        {/* Button glow effect */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300 -z-10" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default BeritaAcara;
