
"use client";

import React from "react";
import HeroSub from "@/app/components/shared/hero-sub";
import SaranPengaduanForm from "@/app/components/saran-pengaduan/form";

const AduanTemplate = () => {
    const breadcrumbLinks = [
        { href: "/", text: "Home" },
        { href: "/saran-dan-pengaduan", text: "Saran dan Pengaduan" },
    ];

    return (
        <>
            <HeroSub
                title="Saran dan Pengaduan"
                description="Sampaikan aspirasi, saran, kritik, atau pengaduan Anda untuk membantu kami memberikan pelayanan yang lebih baik"
                breadcrumbLinks={breadcrumbLinks}
            />
            <SaranPengaduanForm />
        </>
    );
};

export default AduanTemplate;
