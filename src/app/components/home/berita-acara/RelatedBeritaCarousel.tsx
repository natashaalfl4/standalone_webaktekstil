"use client";
import React from "react";
import { API_BASE_URL } from "@/utils/apiConfig";
import Slider from "react-slick";
import Image from "next/image";
import Link from "next/link";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface RelatedBeritaCarouselProps {
    items: any[];
}

const RelatedBeritaCarousel: React.FC<RelatedBeritaCarouselProps> = ({ items }) => {
    const settings = {
        dots: true,
        infinite: items.length > 1,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    if (!items || items.length === 0) return null;

    return (
        <div className="related-carousel py-8">
            <Slider {...settings}>
                {items.map((item) => (
                    <div key={item.id} className="px-3 pb-8">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-lg h-full hover:shadow-xl hover:bg-white/15 transition-all duration-300">
                            <div className="relative h-48 bg-slate-800">
                                <Image
                                    src={item.thumbnail ?
                                        (item.thumbnail.startsWith('http') ? item.thumbnail : `${API_BASE_URL}/storage/${item.thumbnail}`)
                                        : '/images/placeholder.jpg'}
                                    alt={item.judul}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-5">
                                <h4 className="text-white font-bold text-lg line-clamp-2 mb-2 leading-tight">
                                    {item.judul}
                                </h4>
                                <Link href={`/berita/${item.url_halaman}`} className="text-blue-300 hover:text-blue-200 text-sm font-semibold hover:underline inline-flex items-center gap-1">
                                    Baca Selengkapnya
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default RelatedBeritaCarousel;
