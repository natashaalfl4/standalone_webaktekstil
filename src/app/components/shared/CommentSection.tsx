"use client";

import { useState, useEffect } from "react";
import { Comment } from "@/app/types/comment";
import { getApiUrl } from "@/utils/apiConfig";

interface CommentSectionProps {
    type: "berita" | "pengumuman";
    id: string | number;
}

const CommentItem = ({
    comment,
    onReply
}: {
    comment: Comment;
    onReply: (comment: Comment) => void
}) => {
    return (
        <div className="mb-6">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                            {comment.nama.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">{comment.nama}</h4>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                {new Date(comment.created_at).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => onReply(comment)}
                        className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                        Balas
                    </button>
                </div>
                <p className="text-slate-600 dark:text-slate-300 ml-13">{comment.isi_komentar}</p>

                {/* Tanggapan Admin */}
                {comment.tanggapan && (
                    <div className="mt-4 ml-4 bg-blue-50 dark:bg-slate-700/50 p-4 rounded-xl border-l-4 border-blue-500">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">Admin</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 text-sm">{comment.tanggapan}</p>
                    </div>
                )}
            </div>

            {/* Render Replies recursively */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="ml-8 md:ml-12 mt-4 space-y-4 border-l-2 border-slate-100 dark:border-slate-700 pl-4 md:pl-6">
                    {comment.replies.map((reply) => (
                        <CommentItem key={reply.id} comment={reply} onReply={onReply} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default function CommentSection({ type, id }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [replyTo, setReplyTo] = useState<Comment | null>(null);
    const [form, setForm] = useState({
        nama: "",
        email: "",
        isi_komentar: "",
    });
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        fetchComments();
    }, [type, id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ... existing code ...

    const fetchComments = async () => {
        try {
            const res = await fetch(getApiUrl(`/api/komentar?type=${type}&id=${id}`));
            if (res.ok) {
                const json = await res.json();
                setComments(json.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch comments", error);
        } finally {
            setLoading(false);
        }
    };

    // ... existing code ...

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setSuccessMessage("");

        try {
            // NOTE: Using the main store endpoint for both top-level comments and replies.
            // The backend controller's 'reply' endpoint is meant for ADMIN TANGGAPAN only.
            // User replies are created via 'store' with a parent_id.
            const url = getApiUrl(`/api/komentar`);

            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json", // Prevent redirects on error
                },
                body: JSON.stringify({
                    type,
                    id,
                    ...form,
                    parent_id: replyTo ? replyTo.id : null,
                }),
            });

            if (res.ok) {
                setSuccessMessage("Komentar berhasil dikirim.");
                setForm({ ...form, isi_komentar: "" }); // Clear only comment
                setReplyTo(null);
                fetchComments(); // Refresh list

                setTimeout(() => setSuccessMessage(""), 3000);
            } else {
                alert("Gagal mengirim komentar. Silakan coba lagi.");
            }
        } catch (error) {
            console.error("Error submitting comment", error);
            alert("Terjadi kesalahan.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleReply = (comment: Comment) => {
        setReplyTo(comment);
        const formElement = document.getElementById("comment-form");
        if (formElement) {
            formElement.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl mb-12 border border-slate-100 dark:border-slate-700">
            {/* List Komentar */}
            <div className="mb-12">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-8">
                    {comments.length} Komentar
                </h3>

                {loading ? (
                    <div className="flex items-center gap-2 text-slate-500">
                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        Memuat komentar...
                    </div>
                ) : comments.length > 0 ? (
                    <div className="space-y-4">
                        {comments.map((comment) => (
                            <CommentItem key={comment.id} comment={comment} onReply={handleReply} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                        <p className="text-slate-500 italic">Belum ada komentar. Jadilah yang pertama berkomentar!</p>
                    </div>
                )}
            </div>

            {/* Form Komentar */}
            <div id="comment-form" className="pt-8 border-t border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h3 className="text-2xl font-extrabold text-blue-600 dark:text-white mb-2">
                            {replyTo ? `Balas: ${replyTo.nama}` : "Tinggalkan Balasan"}
                        </h3>
                        {replyTo && (
                            <button
                                onClick={() => setReplyTo(null)}
                                className="text-red-500 text-sm hover:underline"
                            >
                                Batalkan Balasan
                            </button>
                        )}
                        {!replyTo && (
                            <p className="text-slate-500 text-sm italic">Alamat email Anda tidak akan dipublikasikan. Ruas yang wajib ditandai *</p>
                        )}
                    </div>
                </div>

                {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl border border-green-200 dark:border-green-800 animate-fade-in-down">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {successMessage}
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Nama *</label>
                            <input
                                type="text"
                                name="nama"
                                value={form.nama}
                                onChange={handleChange}
                                placeholder="Nama lengkap Anda"
                                required
                                className="w-full px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="nama@email.com"
                                required
                                className="w-full px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Komentar *</label>
                        <textarea
                            name="isi_komentar"
                            value={form.isi_komentar}
                            onChange={handleChange}
                            rows={5}
                            placeholder={replyTo ? "Tulis balasan Anda..." : "Tulis komentar Anda..."}
                            required
                            className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none shadow-sm"
                        ></textarea>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-1 flex items-center gap-2 ${submitting ? "opacity-70 cursor-not-allowed" : ""}`}
                        >
                            {submitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Mengirim...
                                </>
                            ) : (
                                "Kirim Komentar"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
