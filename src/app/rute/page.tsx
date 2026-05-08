'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function RutePage() {
    const [listRute, setListRute] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/rute')
            .then(res => res.json())
            .then(data => setListRute(data));
    }, []);

    return (
        <div className="min-h-screen bg-[#F1F8F4] p-8 md:p-20 font-sans text-left">
            <Link href="/dashboard" className="text-[10px] font-black text-[#008444] uppercase tracking-widest mb-6 block">← Kembali</Link>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">Koridor & Rute 📍</h1>
            <p className="text-slate-500 font-bold mt-2 mb-10">Daftar koridor resmi yang dikelola secara terpusat di RDS.</p>

            <div className="grid gap-4">
                {listRute.length === 0 ? (
                    <p className="text-slate-400 font-bold italic">Mengambil data koridor dari cloud...</p>
                ) : (
                    listRute.map((r) => (
                        <div key={r.id} className="bg-white p-6 rounded-[2rem] shadow-xl flex items-center gap-6 border border-white">
                            <div className={`w-12 h-12 bg-${r.warna}-500 rounded-2xl flex items-center justify-center text-white font-black text-xs shadow-lg`}>
                                {r.koridor}
                            </div>
                            <div>
                                <p className="font-black italic text-lg text-slate-900">{r.namaRute}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Operasional: {r.jamOps}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}