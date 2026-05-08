'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

function MenuCard({ title, icon, sub, color, href }: any) {
    return (
        <Link href={href}>
            <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-green-900/5 border border-slate-50 flex flex-col gap-3 hover:scale-105 transition-all cursor-pointer h-full text-left">
                <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center text-2xl shadow-inner`}>{icon}</div>
                <div>
                    <p className="font-black text-sm text-slate-900 italic">{title}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{sub}</p>
                </div>
            </div>
        </Link>
    );
}

export default function DashboardPage() {
    const [userName, setUserName] = useState('User MJT');
    const [selectedRating, setSelectedRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [drivers, setDrivers] = useState<any[]>([]);
    const [selectedDriverId, setSelectedDriverId] = useState('');

    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        if (storedName) setUserName(storedName);

        // Fetch daftar supir dari RDS via API Armada
        fetch('/api/armada')
            .then(res => res.json())
            .then(data => {
                const allDrivers = data.flatMap((armada: any) => armada.drivers);
                setDrivers(allDrivers);
            })
            .catch(err => console.error("RDS Fetch Error:", err));
    }, []);

    const handleSendRating = async () => {
        if (!selectedDriverId) return alert("Pilih supirnya dulu dong!");
        if (selectedRating === 0) return alert("Bintangnya belum diklik, Mel!");
        
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/rating', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    skor: selectedRating,
                    driverId: parseInt(selectedDriverId),
                }),
            });

            if (res.ok) {
                alert("Rating tersimpan di RDS! ⭐");
                setSelectedRating(0);
                setSelectedDriverId('');
            }
        } catch (err) {
            alert("Gagal koneksi ke server AWS.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F1F8F4] font-sans pb-20">
            <header className="p-6 md:px-20 flex justify-between items-center bg-white/30 backdrop-blur-md sticky top-0 z-50 border-b border-white/20">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#008444] rounded-lg flex items-center justify-center text-white font-bold italic shadow-lg">M</div>
                    <span className="font-black text-sm text-slate-900 tracking-tighter italic leading-none">MetroJabarTrans</span>
                </div>
                <div className="flex items-center gap-3 text-right">
                    <div className="flex flex-col items-end">
                        <span className="text-[8px] font-black text-green-600 uppercase tracking-widest animate-pulse leading-none mb-1">● Live RDS Link</span>
                        <span className="text-[10px] font-black text-slate-400 italic hidden md:block leading-none">Region: us-east-1</span>
                    </div>
                    <div className="w-10 h-10 bg-[#D4AF37] rounded-full border-2 border-white shadow-md flex items-center justify-center text-white font-black text-xs uppercase leading-none">
                        {userName.substring(0, 2)}
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 mt-10 text-left">
                <div className="mb-10">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">Halo, <span className="text-[#008444]">{userName}!</span></h1>
                    <p className="text-slate-500 font-bold italic mt-2 italic leading-relaxed">Siap berkeliling Jawa Barat dengan nyaman hari ini?</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <MenuCard title="Lacak Armada" icon="🚌" sub="LIVE MONITORING" color="bg-blue-50 text-blue-600" href="/monitoring" />
                    <MenuCard title="Cek Rute" icon="📍" sub="KORIDOR MJT" color="bg-yellow-50 text-yellow-600" href="/rute" />
                    <MenuCard title="Lapor MJT" icon="✍️" sub="S3 UPLOAD CENTER" color="bg-red-50 text-red-600" href="/pengaduan" />
                </div>

                <div className="bg-white p-8 rounded-[3.5rem] shadow-2xl border border-white relative overflow-hidden group">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#F1F8F4] rounded-full group-hover:scale-150 transition-transform duration-700 opacity-50"></div>
                    <div className="relative z-10">
                        <span className="bg-[#008444] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest italic leading-none">Quality Control</span>
                        <h3 className="text-2xl font-black text-slate-900 mt-4 italic tracking-tighter leading-none">Gimana Sopir Kamu Tadi?</h3>
                        <p className="text-slate-400 text-sm font-bold mt-2 mb-6 max-w-xs leading-relaxed">Bantu kami meningkatkan pelayanan supir melalui database RDS.</p>
                        
                        {/* Dropdown Supir Dinamis dari RDS */}
                        <div className="mb-6">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest leading-none mb-2 block">Pilih Nama Supir</label>
                            <select 
                                value={selectedDriverId}
                                onChange={(e) => setSelectedDriverId(e.target.value)}
                                className="w-full p-4 bg-[#F1F8F4] rounded-2xl outline-none font-bold text-sm text-slate-700 appearance-none focus:ring-2 focus:ring-[#008444] transition-all"
                            >
                                <option value="">-- Cari Supir MJT --</option>
                                {drivers.map((d: any) => (
                                    <option key={d.id} value={d.id}>{d.nama}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-3 mb-8">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <button 
                                    key={s} 
                                    onClick={() => setSelectedRating(s)}
                                    className={`text-4xl transition-all hover:scale-125 ${selectedRating >= s ? 'grayscale-0' : 'grayscale opacity-30'}`}
                                >
                                    ⭐
                                </button>
                            ))}
                        </div>
                        
                        <button 
                            onClick={handleSendRating}
                            disabled={isSubmitting}
                            className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-[#008444] transition-all transform active:scale-95 disabled:opacity-50 w-full md:w-auto"
                        >
                            {isSubmitting ? "MENGIRIM..." : "KIRIM PENILAIAN"}
                        </button>
                    </div>
                </div>

                <footer className="mt-20 text-center pb-10 border-t border-slate-100 pt-10">
                    <div className="flex flex-wrap justify-center gap-4 mb-4">
                        <span className="text-[9px] bg-white border border-slate-100 px-3 py-1 rounded-full font-black text-slate-400 tracking-widest leading-none">AMAZON RDS</span>
                        <span className="text-[9px] bg-white border border-slate-100 px-3 py-1 rounded-full font-black text-slate-400 tracking-widest leading-none">AWS ECS FARGATE</span>
                        <span className="text-[9px] bg-white border border-slate-100 px-3 py-1 rounded-full font-black text-slate-400 tracking-widest leading-none">CLOUDFRONT CDN</span>
                    </div>
                    <p className="text-[10px] text-slate-300 uppercase tracking-[0.4em] font-black italic leading-none">Metro Jabar Trans Infrastructure • 2026</p>
                </footer>
            </main>
        </div>
    );
}