"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { API_BASE_URL } from "@/utils/apiConfig";

interface Berita {
    id: number;
    judul: string;
    thumbnail: string;
    url_halaman: string;
    created_at: string;
}

interface BeritaListClientProps {
    beritaData: Berita[];
    itemsPerPage?: number;
}

export default function BeritaListClient({ beritaData, itemsPerPage = 12 }: BeritaListClientProps) {
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate pagination
    const totalPages = Math.ceil(beritaData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentBerita = beritaData.slice(startIndex, endIndex);

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push("...");
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push("...");
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push("...");
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push("...");
                pages.push(totalPages);
            }
        }
        return pages;
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to top of news section
        window.scrollTo({ top: 300, behavior: "smooth" });
    };

    return (
        <>
            {/* Stats bar */}
            <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full" />
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                        Berita Terbaru
                    </h2>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-full">
                        <span className="text-blue-600 dark:text-blue-300 font-medium text-sm">
                            {beritaData.length} Berita
                        </span>
                    </div>
                    {totalPages > 1 && (
                        <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full">
                            <span className="text-slate-600 dark:text-slate-300 font-medium text-sm">
                                Halaman {currentPage} dari {totalPages}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentBerita.map((item: Berita, index: number) => (
                    <article
                        key={item.id}
                        className="group relative bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-2 flex flex-col"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        {/* Image Container */}
                        <div className="relative h-56 overflow-hidden">
                            <Image
                                src={item.thumbnail ?
                                    (item.thumbnail.startsWith('http') ? item.thumbnail : `${API_BASE_URL}/storage/${item.thumbnail}`)
                                    : '/images/placeholder.jpg'}
                                alt={item.judul}
                                fill
                                className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Date Badge */}
                            <div className="absolute top-4 left-4">
                                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
                                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 block text-center">
                                        {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric' })}
                                    </span>
                                    <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase block text-center">
                                        {new Date(item.created_at).toLocaleDateString('id-ID', { month: 'short' })}
                                    </span>
                                </div>
                            </div>

                            {/* Category Badge */}
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                                    Berita
                                </span>
                            </div>

                            {/* Read More Icon */}
                            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex flex-col flex-grow">
                            <h3 className="text-slate-800 dark:text-white font-bold text-lg leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 mb-3">
                                {item.judul}
                            </h3>

                            {/* Decorative line */}
                            <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-4 group-hover:w-20 transition-all duration-500" />

                            {/* Footer */}
                            <div className="mt-auto pt-4 flex justify-between items-center">
                                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-sm">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>
                                        {new Date(item.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </span>
                                </div>
                            </div>

                            <Link
                                href={`/berita/${item.url_halaman}`}
                                className="mt-4 inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm group/link"
                            >
                                <span className="relative">
                                    Baca Selengkapnya
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 group-hover/link:w-full transition-all duration-300" />
                                </span>
                                <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </article>
                ))}
            </div>

            {/* Empty State */}
            {beritaData.length === 0 && (
                <div className="text-center py-20">
                    <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Belum Ada Berita</h3>
                    <p className="text-slate-500 dark:text-slate-400">Berita akan segera ditambahkan</p>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                    {/* Previous Button */}
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${currentPage === 1
                                ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white shadow-md hover:shadow-lg"
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Page Numbers */}
                    {getPageNumbers().map((page, index) => (
                        <button
                            key={index}
                            onClick={() => typeof page === "number" && handlePageChange(page)}
                            disabled={page === "..."}
                            className={`flex items-center justify-center min-w-[40px] h-10 px-3 rounded-xl font-medium transition-all duration-300 ${page === currentPage
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                                    : page === "..."
                                        ? "bg-transparent text-slate-400 cursor-default"
                                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 shadow-md"
                                }`}
                        >
                            {page}
                        </button>
                    ))}

                    {/* Next Button */}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${currentPage === totalPages
                                ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white shadow-md hover:shadow-lg"
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            )}
        </>
    );
}
