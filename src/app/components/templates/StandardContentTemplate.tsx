
import React from 'react';
import HeroSub from '@/app/components/shared/hero-sub';
import DynamicForm from "@/app/components/shared/DynamicForm";

// Types for embed items
interface EmbedItem {
    url: string;
    keterangan?: string;
}

// Types for button items  
interface ButtonItem {
    text: string;
    url: string;
    color?: string;
}

// Types for link groups (like UNIB Pusat Informasi)
interface LinkItem {
    url: string;
    text: string;
}

interface LinkGroup {
    title: string;
    links: LinkItem[];
}

interface StandardContentTemplateProps {
    title: string;
    content: string;
    description?: string;
    form?: any;
    // Support both single string (legacy) and array of embeds
    embedUrl?: string | EmbedItem[];
    // Support both single values (legacy) and array of buttons
    buttonUrl?: string | ButtonItem[] | string[];
    buttonText?: string;
    buttons?: ButtonItem[]; // New: array of button objects
    // Link groups (like UNIB Pusat Informasi cards)
    linkGroups?: LinkGroup[];
    // Parent menu for breadcrumb (e.g., "Unit", "Kemahasiswaan")
    parentMenu?: {
        name: string;
        url: string;
    };
}

export default function StandardContentTemplate({
    title,
    content,
    description = "",
    form,
    embedUrl,
    buttonUrl,
    buttonText,
    buttons,
    linkGroups,
    parentMenu
}: StandardContentTemplateProps) {
    // Build breadcrumb dynamically based on parent menu
    const breadcrumbLinks = parentMenu
        ? [
            { href: parentMenu.url || "#", text: parentMenu.name },
            { href: "#", text: title },
        ]
        : [
            { href: "/", text: "Home" },
            { href: "#", text: title },
        ];

    // Function to convert various URLs to embed format
    const convertToEmbedUrl = (url: string): string => {
        if (!url) return "";

        // === YOUTUBE CONVERSION ===
        // Already an embed URL
        if (url.includes('youtube.com/embed/')) {
            return url;
        }

        // Convert youtu.be share links (e.g., https://youtu.be/xnOwOBYaA3w?si=...)
        if (url.includes('youtu.be/')) {
            const videoIdMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
            if (videoIdMatch) {
                return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
            }
        }

        // Convert youtube.com/watch links (e.g., https://www.youtube.com/watch?v=xnOwOBYaA3w)
        if (url.includes('youtube.com/watch')) {
            const videoIdMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
            if (videoIdMatch) {
                return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
            }
        }

        // === GOOGLE MAPS CONVERSION ===
        // If it's already an embed URL, return as is
        if (url.includes('/maps/embed') || url.includes('output=embed')) {
            return url;
        }

        // For Google Maps share links (maps.app.goo.gl, goo.gl/maps)
        if (url.includes('maps.app.goo.gl') || url.includes('goo.gl/maps')) {
            return "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1977.585306246149!2d110.8517004!3d-7.5563682!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a16fd32cd9f15%3A0x3c9cd32da376901c!2sAK-Tekstil%20Solo%20(Akademi%20Komunitas%20Industri%20Tekstil%20dan%20Produk%20Tekstil%20Surakarta)!5e0!3m2!1sid!2sid!4v1767593501798!5m2!1sid!2sid";
        }

        // For regular Google Maps URLs, try to extract and convert
        if (url.includes('google.com/maps')) {
            const placeMatch = url.match(/place\/([^\/\?]+)/);
            if (placeMatch) {
                const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
                return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(placeName)}`;
            }
        }

        return url;
    };

    // Function to render a single embed
    const renderSingleEmbed = (embed: string | EmbedItem, index: number) => {
        const url = typeof embed === 'string' ? embed : embed.url;
        const label = typeof embed === 'string' ? '' : (embed.keterangan || '');

        if (!url) return null;

        // Check if it's already an iframe HTML
        if (url.trim().startsWith('<iframe')) {
            return (
                <div key={index} className="mb-6">
                    {label && (
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">{label}</h3>
                    )}
                    <div
                        className="rounded-2xl overflow-hidden shadow-xl [&>iframe]:w-full [&>iframe]:min-h-[450px]"
                        dangerouslySetInnerHTML={{ __html: url }}
                    />
                </div>
            );
        }

        // Convert the URL to proper embed format
        const finalUrl = convertToEmbedUrl(url);

        // Check if it's a Google Drive preview
        if (url.includes('drive.google.com')) {
            const fileMatch = url.match(/\/d\/([^\/]+)/);
            const fileId = fileMatch ? fileMatch[1] : null;
            const previewUrl = fileId ? `https://drive.google.com/file/d/${fileId}/preview` : url;

            return (
                <div key={index} className="mb-6">
                    {label && (
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">{label}</h3>
                    )}
                    <div className="rounded-2xl overflow-hidden shadow-xl">
                        <iframe
                            src={previewUrl}
                            width="100%"
                            height="600"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            className="w-full"
                            title={label || "Google Drive Preview"}
                        />
                    </div>
                </div>
            );
        }

        // Check if it's a YouTube embed
        if (finalUrl.includes('youtube.com/embed/') || url.includes('youtu.be') || url.includes('youtube.com/watch')) {
            return (
                <div key={index} className="mb-6">
                    {label && (
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">{label}</h3>
                    )}
                    <div className="rounded-2xl overflow-hidden shadow-xl aspect-video">
                        <iframe
                            src={finalUrl}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            loading="lazy"
                            className="w-full h-full"
                            title={label || "YouTube Video"}
                        />
                    </div>
                </div>
            );
        }

        return (
            <div key={index} className="mb-6">
                {label && (
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">{label}</h3>
                )}
                <div className="rounded-2xl overflow-hidden shadow-xl">
                    <iframe
                        src={finalUrl}
                        width="100%"
                        height="450"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full"
                        title={label || "Embedded Content"}
                    />
                </div>
            </div>
        );
    };

    // Render all embeds
    const renderEmbeds = () => {
        if (!embedUrl) return null;

        // Handle array of embeds
        if (Array.isArray(embedUrl)) {
            return (
                <div className="mt-12 space-y-8">
                    {embedUrl.map((embed, index) => renderSingleEmbed(embed, index))}
                </div>
            );
        }

        // Handle single embed (legacy)
        return (
            <div className="mt-12">
                {renderSingleEmbed(embedUrl, 0)}
            </div>
        );
    };

    // Get button color class based on color name
    const getButtonColorClass = (color?: string) => {
        switch (color?.toLowerCase()) {
            case 'hijau':
            case 'green':
                return 'bg-green-600 hover:bg-green-700';
            case 'merah':
            case 'red':
                return 'bg-red-600 hover:bg-red-700';
            case 'kuning':
            case 'yellow':
                return 'bg-yellow-500 hover:bg-yellow-600 text-black';
            case 'abu':
            case 'gray':
                return 'bg-gray-600 hover:bg-gray-700';
            case 'biru':
            case 'blue':
            default:
                return 'bg-[#1a56db] hover:bg-blue-700';
        }
    };

    // Render all buttons
    const renderButtons = () => {
        // Priority: buttons array > buttonUrl array > single buttonUrl
        if (buttons && buttons.length > 0) {
            return (
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                    {buttons.map((btn, index) => (
                        <a
                            key={index}
                            href={btn.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-2 px-6 py-3 ${getButtonColorClass(btn.color)} text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5`}
                        >
                            {btn.text}
                        </a>
                    ))}
                </div>
            );
        }

        // Handle buttonUrl as array of ButtonItem objects
        if (buttonUrl && Array.isArray(buttonUrl)) {
            return (
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                    {buttonUrl.map((btn, index) => {
                        const btnObj = btn as ButtonItem;
                        if (typeof btn === 'string') {
                            return (
                                <a
                                    key={index}
                                    href={btn}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a56db] hover:bg-blue-700 text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                >
                                    Lihat Selengkapnya
                                </a>
                            );
                        }
                        return (
                            <a
                                key={index}
                                href={btnObj.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center gap-2 px-6 py-3 ${getButtonColorClass(btnObj.color)} text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5`}
                            >
                                {btnObj.text || "Lihat Selengkapnya"}
                            </a>
                        );
                    })}
                </div>
            );
        }

        // Handle single buttonUrl (legacy)
        if (buttonUrl && typeof buttonUrl === 'string') {
            return (
                <div className="mt-8 flex justify-center">
                    <a
                        href={buttonUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a56db] hover:bg-blue-700 text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        {buttonText || "Lihat Selengkapnya"}
                    </a>
                </div>
            );
        }

        return null;
    };

    // Card colors for link groups (like UNIB: dark blue, yellow, light blue)
    const linkGroupColors = [
        {
            header: 'bg-[#1a237e]', // Dark Navy Blue
            body: 'bg-[#283593]',   // Slightly lighter blue
            text: 'text-white',
            link: 'text-white hover:text-blue-200'
        },
        {
            header: 'bg-[#ffd54f]', // Yellow
            body: 'bg-[#ffecb3]',   // Light yellow
            text: 'text-slate-800',
            link: 'text-slate-800 hover:text-slate-600'
        },
        {
            header: 'bg-[#4fc3f7]', // Light Blue
            body: 'bg-[#b3e5fc]',   // Very light blue
            text: 'text-slate-800',
            link: 'text-slate-800 hover:text-slate-600'
        }
    ];

    // Render link groups cards
    const renderLinkGroups = () => {
        console.log('renderLinkGroups called with:', linkGroups);
        if (!linkGroups || linkGroups.length === 0) {
            console.log('linkGroups is empty or undefined');
            return null;
        }
        console.log('Rendering', linkGroups.length, 'link groups');

        return (
            <div className="mt-12">
                <div className={`grid gap-6 ${linkGroups.length === 1 ? 'grid-cols-1' :
                    linkGroups.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
                        'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                    }`}>
                    {linkGroups.map((group, index) => {
                        const colorIndex = index % linkGroupColors.length;
                        const colors = linkGroupColors[colorIndex];

                        return (
                            <div
                                key={index}
                                className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                            >
                                {/* Card Header */}
                                <div className={`${colors.header} px-6 py-4`}>
                                    <h3 className={`text-xl font-bold ${colors.text}`}>
                                        {group.title}
                                    </h3>
                                </div>

                                {/* Card Body with Links */}
                                <div className={`${colors.body} px-6 py-4 min-h-[200px]`}>
                                    <ul className="space-y-3">
                                        {group.links && group.links.map((link, linkIndex) => (
                                            <li key={linkIndex} className="flex items-baseline">
                                                <span className={`${colors.text} mr-2 flex-shrink-0`}>•</span>
                                                <a
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`${colors.link} underline hover:no-underline transition-colors text-sm leading-relaxed`}
                                                >
                                                    {link.text}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <main>
            <HeroSub
                title={title}
                description={description}
                breadcrumbLinks={breadcrumbLinks}
            />

            <section className="py-20 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div
                        className="prose prose-lg dark:prose-invert max-w-none 
                        prose-headings:text-slate-800 dark:prose-headings:text-white
                        prose-p:text-slate-600 dark:prose-p:text-slate-300
                        prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:text-blue-700
                        prose-img:rounded-3xl prose-img:shadow-xl"
                        dangerouslySetInnerHTML={{ __html: content || "" }}
                    />

                    {/* Link Groups Cards - like UNIB Pusat Informasi */}
                    {renderLinkGroups()}

                    {/* Embeds - Google Maps, YouTube, Google Drive, etc. */}
                    {renderEmbeds()}

                    {/* Link Buttons */}
                    {renderButtons()}

                    {/* Dynamic Form Parsing */}
                    {form && <DynamicForm form={form} />}
                </div>
            </section>
        </main>
    );
}
