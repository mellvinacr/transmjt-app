'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Pengaduan() {
    const [loading, setLoading] = useState(false);
    const [userName, setUserName] = useState('');
    const router = useRouter();

    useEffect(() => {
        setUserName(localStorage.getItem('userName') || 'User MJT');
    }, []);

    const kirimLaporan = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);

        const res = await fetch('/api/pengaduan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                judul: formData.get('judul'),
                masalah: formData.get('masalah'),
                namaUser: userName,
            }),
        });

        if (res.ok) {
            alert("Laporan Berhasil Terkirim ke Cloud RDS!");
            router.push('/dashboard');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#FFF5F5] p-6 md:p-20 font-sans">
            <div className="max-w-xl mx-auto bg-white p-10 rounded-[3rem] shadow-2xl border border-red-50">
                <h1 className="text-3xl font-black italic text-red-600 tracking-tighter">Lapor Kendala ⚠️</h1>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2 mb-10 text-left">Pelapor: {userName}</p>

                <form onSubmit={kirimLaporan} className="space-y-5 text-left">
                    <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-2 italic">Subjek Masalah</label>
                        <input name="judul" type="text" placeholder="Misal: AC Bus MJT-001 Mati" className="w-full mt-2 p-4 bg-slate-50 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-red-500" required />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-2 italic">Detail Kronologi</label>
                        <textarea name="masalah" placeholder="Jelaskan kendala yang dialami..." className="w-full mt-2 p-4 bg-slate-50 rounded-2xl border-none font-bold text-sm h-32 outline-none focus:ring-2 focus:ring-red-500" required />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-red-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-red-100 active:scale-95 transition-all">
                        {loading ? "PROSES CLOUD..." : "KIRIM LAPORAN KE PUSAT"}
                    </button>
                </form>
            </div>
        </div>
    );
}