"use client";

import Image from "next/image";
import { API_BASE_URL } from "@/utils/apiConfig";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface SliderItem {
  id: number;
  judul: string;
  gambar: string;
  url: string | null;
  urutan: number;
}

interface HeroProps {
  sliderData: SliderItem[];
}

const Hero = ({ sliderData }: HeroProps) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  if (!sliderData || sliderData.length === 0) {
    return null;
  }

  return (
    <section className="relative h-[650px] md:h-[750px] w-full overflow-hidden">
      {/* Slider */}
      <Slider {...settings} className="h-full bg-transparent">
        {sliderData.map((item) => (
          <div
            key={item.id}
            className="relative h-[650px] md:h-[750px] w-full outline-none bg-transparent"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={`${API_BASE_URL}/storage/${item.gambar}`}
                alt={item.judul}
                fill
                priority
                className="object-cover object-center"
                sizes="100vw"
              />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a]/80 via-[#1e3a5f]/70 to-[#1a56db]/60" />

            {/* Animated floating shapes */}
            <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

            {/* Text Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 pb-22">
              <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-white text-center font-extrabold text-3xl md:text-5xl lg:text-6xl tracking-tight drop-shadow-lg mb-4 leading-tight">
                  {item.judul}
                </h1>
                <p className="text-blue-100/80 text-lg md:text-xl max-w-2xl mx-auto opacity-90">
                  Mencetak Tenaga Ahli Tekstil yang Profesional dan Berdaya Saing Global
                </p>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      {/* Wave decoration at bottom */}
      <div className="absolute -bottom-1 left-0 right-0 z-20">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            className="fill-[#f8fafc] dark:fill-darkmode"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
