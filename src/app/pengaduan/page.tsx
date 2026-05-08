'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Pengaduan() {
    const [loading, setLoading] = useState(false);
    const [userName, setUserName] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const router = useRouter();

    useEffect(() => {
        setUserName(localStorage.getItem('userName') || 'User MJT');
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const kirimLaporan = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);

        try {
            let imageUrl = "";

            // 1. PROSES UPLOAD KE S3 (VIA CLOUDFLARE WORKER)
            if (file) {
                const fileData = new FormData();
                fileData.append('file', file);

                // Nembak ke route API yang udah kita benerin tadi
                const uploadRes = await fetch('/api/upload', { 
                    method: 'POST', 
                    body: fileData 
                });
                
                const uploadResult = await uploadRes.json();

                if (uploadRes.ok) {
                    imageUrl = uploadResult.url; // Ini link gambar dari Cloudflare
                    console.log("Upload Success! URL:", imageUrl);
                } else {
                    throw new Error(uploadResult.error || "Gagal upload ke S3");
                }
            }

            // 2. KIRIM DATA KE DATABASE RDS
            const res = await fetch('/api/pengaduan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    judul: formData.get('judul'),
                    masalah: formData.get('masalah'),
                    namaUser: userName,
                    fotoUrl: imageUrl, 
                }),
            });

            if (res.ok) {
                alert("Laporan Berhasil! Data masuk ke RDS & Foto masuk ke S3.");
                window.location.href = '/dashboard';
            } else {
                const errorData = await res.json();
                alert(errorData.error || "Gagal simpan ke RDS");
            }

        } catch (err: any) {
            console.error(err);
            alert("Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFF5F5] p-6 md:p-20 font-sans">
            <div className="max-w-xl mx-auto bg-white p-10 rounded-[3rem] shadow-2xl border border-red-50 text-left">
                <h1 className="text-3xl font-black italic text-red-600 tracking-tighter">Lapor Kendala ⚠️</h1>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2 mb-10">Pelapor: {userName}</p>

                <form onSubmit={kirimLaporan} className="space-y-5">
                    <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-2 italic">Subjek Masalah</label>
                        <input name="judul" type="text" placeholder="Misal: AC Bus MJT-001 Mati" className="w-full mt-2 p-4 bg-slate-50 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-red-500" required />
                    </div>
                    
                    <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-2 italic">Detail Kronologi</label>
                        <textarea name="masalah" placeholder="Jelaskan kendala yang dialami..." className="w-full mt-2 p-4 bg-slate-50 rounded-2xl border-none font-bold text-sm h-32 outline-none focus:ring-2 focus:ring-red-500" required />
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        <label className="text-[10px] font-black uppercase text-slate-400 italic block mb-2">Unggah Bukti Foto (S3 Storage)</label>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange}
                            className="w-full text-xs font-bold text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-red-50 file:text-red-600 hover:file:bg-red-100 cursor-pointer"
                        />
                        {file && <p className="mt-2 text-[10px] text-green-600 font-bold">✓ File "{file.name}" siap diupload ke us-east-1</p>}
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-red-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-red-100 active:scale-95 transition-all disabled:opacity-50">
                        {loading ? "UPLOADING TO AWS..." : "KIRIM LAPORAN KE PUSAT"}
                    </button>
                </form>
            </div>
        </div>
    );
}