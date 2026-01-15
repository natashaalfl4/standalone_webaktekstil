"use client";
import Image from "next/image";
import { getImgPath } from "@/utils/pathUtils";
import Link from "next/link";

export interface MitraItem {
    id: number;
    nama: string;
    logo: string;
    website?: string;
}

interface MitraKerjasamaProps {
    mitraData: MitraItem[];
}

const MitraKerjasama = ({ mitraData }: MitraKerjasamaProps) => {

    if (!mitraData || mitraData.length === 0) {
        return null;
    }

    // Duplicate the data for seamless infinite scroll
    const duplicatedData = [...mitraData, ...mitraData];

    return (
        <section className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-darkmode dark:via-slate-900 dark:to-slate-800 py-20 overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-80 h-80 bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
            <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-purple-200/20 dark:bg-purple-900/10 rounded-full blur-3xl" />

            <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md relative z-10 px-4">
                {/* Header Section */}
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-800 dark:text-white mb-4 tracking-tight">
                        Mitra Kerja Sama
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                        Berbagai instansi dan perusahaan yang bekerja sama dengan Akademi Tekstil Surakarta
                    </p>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full mx-auto mt-6" />
                </div>
            </div>

            {/* Marquee Container */}
            <div className="relative w-full overflow-hidden py-8">
                {/* Gradient fade on left */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-50 dark:from-darkmode to-transparent z-10 pointer-events-none" />
                {/* Gradient fade on right */}
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-50 dark:from-darkmode to-transparent z-10 pointer-events-none" />

                {/* Scrolling Track */}
                <div className="flex animate-marquee hover:pause-animation">
                    {duplicatedData.map((item, index) => (
                        <Link
                            href={item.website || "#"}
                            key={`${item.id}-${index}`}
                            target={item.website ? "_blank" : "_self"}
                            className="group relative flex-shrink-0 w-40 h-32 mx-4 bg-white dark:bg-slate-800 rounded-2xl p-4 flex items-center justify-center shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-110 border-2 border-gray-100 dark:border-slate-700 hover:border-blue-400 overflow-visible hover:z-20"
                        >
                            {/* Logo */}
                            <div className="relative w-full h-full">
                                {item.logo ? (
                                    <Image
                                        src={item.logo.startsWith("http") ? item.logo : getImgPath(item.logo)}
                                        alt={item.nama}
                                        fill
                                        className="object-contain p-1"
                                        sizes="160px"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl">
                                        <span className="text-4xl">🏢</span>
                                    </div>
                                )}
                            </div>

                            {/* Tooltip on hover */}
                            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 group-hover:translate-y-2 transition-all duration-300 pointer-events-none z-30">
                                <div className="bg-slate-800 dark:bg-white text-white dark:text-slate-800 text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                                    {item.nama}
                                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-800 dark:bg-white rotate-45" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* CSS Animation */}
            <style jsx>{`
                @keyframes marquee {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
};

export default MitraKerjasama;
