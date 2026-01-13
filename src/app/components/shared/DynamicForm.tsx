"use client";

import React, { useState } from "react";
import { getApiUrl } from "@/utils/apiConfig";

interface FormField {
    id: number;
    label: string;
    name: string;
    type: "text" | "number" | "email" | "textarea" | "file" | "date" | "select" | "radio" | "checkbox";
    placeholder?: string;
    is_required: boolean;
    options?: any;
    order?: number;
}

interface DynamicFormProps {
    form: {
        id: number;
        slug: string;
        name: string;
        description?: string;
        fields: FormField[];
    };
}

export default function DynamicForm({ form }: DynamicFormProps) {
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const parseOptions = (opt: any): any[] => {
        if (!opt) return [];
        if (Array.isArray(opt)) return opt;
        if (typeof opt === "string") {
            try {
                const parsed = JSON.parse(opt);
                if (Array.isArray(parsed)) return parsed;
            } catch (e) {
                // not JSON
            }
            return opt.split(",").map((s) => s.trim()).filter(Boolean);
        }
        if (typeof opt === "object") {
            // convert object map to array of { value,label }
            try {
                return Object.keys(opt).map((k) => ({ value: k, label: opt[k] }));
            } catch (e) {
                return [];
            }
        }
        return [];
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSubmitting(true);
        setError("");
        setSuccess(false);

        const formData = new FormData(e.currentTarget);

        try {
            const res = await fetch(getApiUrl(`/api/forms/${form.slug}/submit`), {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                setSuccess(true);
                e.currentTarget.reset();
            } else {
                const json = await res.json();
                setError(json.message || "Gagal mengirim formulir.");
            }
        } catch (err) {
            console.error("Submit error:", err);
            setError("Terjadi kesalahan sistem. Silakan coba lagi.");
        } finally {
            setSubmitting(false);
        }
    }

    if (!form || !form.fields) return null;

    return (
        <div className="mt-8 p-6 md:p-8 bg-slate-50 dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{form.name}</h3>
            {form.description && <p className="text-slate-600 dark:text-slate-400 mb-6">{form.description}</p>}

            {success ? (
                <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-4 rounded-xl border border-green-200 dark:border-green-800">
                    <p className="font-semibold">✅ Data berhasil dikirim!</p>
                    <p className="text-sm">Terima kasih, formulir Anda telah kami terima.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    {form.fields.sort((a, b) => (a.order || 0) - (b.order || 0)).map((field) => (
                        <div key={field.id}>
                            <label htmlFor={field.name} className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                {field.label} {field.is_required && <span className="text-red-500">*</span>}
                            </label>

                            {field.type === "textarea" ? (
                                <textarea
                                    id={field.name}
                                    name={field.name}
                                    placeholder={field.placeholder}
                                    required={field.is_required}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    rows={4}
                                />
                            ) : field.type === "file" ? (
                                <input
                                    id={field.name}
                                    name={field.name}
                                    type="file"
                                    required={field.is_required}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
                                />
                            ) : field.type === "select" ? (
                                <select
                                    id={field.name}
                                    name={field.name}
                                    required={field.is_required}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                >
                                    <option value="">Pilih {field.label}</option>
                                    {parseOptions(field.options).map((opt: any, i: number) => {
                                        const value = opt && typeof opt === 'object' ? (opt.value ?? opt.label ?? '') : opt;
                                        const label = opt && typeof opt === 'object' ? (opt.label ?? opt.value ?? '') : opt;
                                        return (
                                            <option key={i} value={value}>{label}</option>
                                        );
                                    })}
                                </select>
                            ) : field.type === "radio" ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                                    {parseOptions(field.options).map((opt: any, i: number) => {
                                        const value = opt && typeof opt === 'object' ? (opt.value ?? opt.label ?? '') : opt;
                                        const label = opt && typeof opt === 'object' ? (opt.label ?? opt.value ?? '') : opt;
                                        return (
                                            <label key={i} className="relative flex items-center p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group">
                                                <div className="flex items-center h-5">
                                                    <input
                                                        type="radio"
                                                        name={field.name}
                                                        value={value}
                                                        required={field.is_required}
                                                        className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
                                                    />
                                                </div>
                                                <div className="ml-3 text-sm">
                                                    <span className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                        {label}
                                                    </span>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            ) : field.type === "checkbox" ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                                    {parseOptions(field.options).map((opt: any, i: number) => {
                                        const value = opt && typeof opt === 'object' ? (opt.value ?? opt.label ?? '') : opt;
                                        const label = opt && typeof opt === 'object' ? (opt.label ?? opt.value ?? '') : opt;
                                        return (
                                            <label key={i} className="relative flex items-center p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group">
                                                <div className="flex items-center h-5">
                                                    <input
                                                        type="checkbox"
                                                        name={`${field.name}[]`}
                                                        value={value}
                                                        className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
                                                    />
                                                </div>
                                                <div className="ml-3 text-sm">
                                                    <span className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                        {label}
                                                    </span>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            ) : (
                                <input
                                    id={field.name}
                                    name={field.name}
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    required={field.is_required}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            )}
                        </div>
                    ))}

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`w-full md:w-auto px-8 py-3 rounded-xl font-bold text-white transition-all transform hover:-translate-y-1 ${submitting
                                ? "bg-slate-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/30"
                                }`}
                        >
                            {submitting ? "Mengirim..." : `Kirim ${form.name}`}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
