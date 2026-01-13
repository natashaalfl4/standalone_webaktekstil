export interface Comment {
    id: number;
    nama: string;
    email: string;
    isi_komentar: string;
    tanggapan: string | null;
    created_at: string;
    is_approved: boolean;
    parent_id: number | null;
    replies?: Comment[];
}
