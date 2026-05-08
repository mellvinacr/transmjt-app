'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function MonitoringPage() {
  const [listArmada, setListArmada] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/armada')
      .then(res => res.json())
      .then(data => {
        setListArmada(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#F1F8F4] p-6 md:p-16 font-sans">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard" className="text-[10px] font-black text-[#008444] uppercase tracking-[0.2em] mb-8 block hover:translate-x-2 transition-transform">
          ← Kembali ke Dashboard
        </Link>
        
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter italic">Live Fleet Status 📡</h1>
          <p className="text-slate-500 font-bold mt-2 italic text-sm">Data armada & supir terintegrasi dengan Amazon RDS MySQL.</p>
        </div>

        <div className="grid gap-4">
          {loading ? (
            <div className="bg-white p-20 rounded-[3rem] shadow-xl text-center border border-white">
              <div className="animate-spin text-3xl mb-4">🔄</div>
              <p className="text-slate-400 font-bold italic uppercase text-xs tracking-widest">Menghubungkan ke Cloud...</p>
            </div>
          ) : listArmada.length === 0 ? (
            <div className="bg-white p-20 rounded-[3rem] shadow-xl text-center border border-white">
              <p className="text-slate-400 font-bold italic">Belum ada armada yang terdaftar di RDS.</p>
            </div>
          ) : (
            listArmada.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-[2.5rem] shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-white hover:scale-[1.02] transition-all">
                <div className="flex items-center gap-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner ${item.jenis === 'BUS' ? 'bg-blue-50' : 'bg-yellow-50'}`}>
                    {item.jenis === 'BUS' ? '🚌' : '🚐'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                        <p className="font-black italic text-xl text-slate-900 leading-none">{item.namaArmada}</p>
                        <span className="text-[9px] bg-slate-900 text-white px-2 py-0.5 rounded-md font-bold uppercase tracking-widest">{item.platNomor}</span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 mb-2">{item.rute}</p>
                    
                    {/* Info Supir dari Relasi */}
                    <div className="flex items-center gap-2 bg-[#F1F8F4] px-3 py-1.5 rounded-xl w-fit">
                        <div className="w-2 h-2 bg-[#008444] rounded-full animate-pulse"></div>
                        <p className="text-[10px] text-slate-600 font-black italic">
                            Supir: <span className="text-[#008444] uppercase tracking-tighter">{item.drivers?.[0]?.nama || 'Standby'}</span>
                        </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                  <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest w-full text-center md:w-auto ${
                    item.status === 'Beroperasi' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {item.status}
                  </span>
                  <p className="text-[9px] font-bold text-slate-300 uppercase italic">Last Sync: Just Now</p>
                </div>
              </div>
            ))
          )}
        </div>

        <footer className="mt-20 border-t border-slate-200 pt-10 text-center">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">MJT Fleet Management System • AWS Infrastructure</p>
        </footer>
      </div>
    </div>
  );
}

