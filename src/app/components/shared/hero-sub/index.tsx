import React, { FC } from "react";
import { BreadcrumbLink } from "@/app/types/data/breadcrumb";

interface HeroSubProps {
    title: string;
    description?: string;
    breadcrumbLinks?: BreadcrumbLink[];
}

const HeroSub: FC<HeroSubProps> = ({ title }) => {

    return (
        <>
            <section className="text-center bg-cover pt-24 pb-10 relative bg-gradient-to-b from-white from-10% dark:from-darkmode to-herobg to-90% dark:to-darklight overflow-x-hidden">
                <h2 className="text-midnight_text text-[40px] leading-[1.2] relative font-bold dark:text-white capitalize">{title}</h2>
            </section>
        </>
    );
};

export default HeroSub;
