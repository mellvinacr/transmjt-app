'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
    const [laporan, setLaporan] = useState<any[]>([]);
    const [rute, setRute] = useState<any[]>([]);

    useEffect(() => {
        // Ambil data dari RDS
        fetch('/api/pengaduan').then(res => res.json()).then(setLaporan);
        fetch('/api/rute').then(res => res.json()).then(setRute);
    }, []);

    const downloadPDF = () => {
        alert("Fitur Export PDF Laporan Pengaduan Sedang di-generate via Cloud...");
        // Di sini kamu bisa pakai library seperti jspdf di masa depan
    };

    return (
        <div className="min-h-screen bg-slate-50 p-10 text-left font-sans">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-black italic text-slate-900 mb-2">Admin Command Center 🕹️</h1>
                <p className="text-slate-400 font-bold mb-10 uppercase tracking-widest text-xs">Infrastructure: AWS ECS & RDS</p>

                <div className="grid md:grid-cols-2 gap-10">
                    {/* Manajemen Rute */}
                    <section className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100">
                        <h2 className="text-xl font-black mb-6 italic text-[#008444]">Update Status Rute</h2>
                        <div className="space-y-4">
                            {rute.map(r => (
                                <div key={r.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                                    <span className="font-bold">{r.koridor} - {r.namaRute}</span>
                                    <select className="bg-white text-[10px] font-black p-2 rounded-lg border border-slate-200">
                                        <option>Lancar</option>
                                        <option>Padat</option>
                                        <option>Dialihkan</option>
                                    </select>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Manajemen Pengaduan & Export */}
                    <section className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black italic text-red-600">Daftar Pengaduan</h2>
                            <button onClick={downloadPDF} className="bg-slate-900 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-tighter hover:bg-red-600 transition-all">
                                Download PDF
                            </button>
                        </div>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                            {laporan.map(lp => (
                                <div key={lp.id} className="p-4 border-b border-slate-100 last:border-0">
                                    <p className="font-black text-sm italic">{lp.judul}</p>
                                    <p className="text-[10px] text-slate-400 font-bold mb-2">Pelapor: {lp.namaUser}</p>
                                    <a href={lp.fotoUrl} target="_blank" className="text-[9px] font-black text-blue-600 uppercase underline">Cek Bukti via CloudFront</a>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}