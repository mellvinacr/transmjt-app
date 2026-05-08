'use client';
import React, { useState } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [loading, setLoading] = useState(false);

  const handleFeedback = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        alert("Terima kasih! Masukan Anda sudah tersimpan di Amazon RDS.");
        (e.target as HTMLFormElement).reset();
      }
    } catch (err) {
      alert("Gagal mengirim feedback ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-6 py-6 md:px-20 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-[#008444] rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-green-200">M</div>
          <span className="font-black text-xl tracking-tighter italic">MetroJabar<span className="text-[#008444]">Trans</span></span>
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/login" className="text-slate-500 font-black text-xs uppercase tracking-widest hover:text-[#008444] transition-colors">Login</Link>
          <Link href="/register" className="bg-[#008444] text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-green-100 hover:bg-[#006b37] transition-all">Daftar</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 md:px-20 py-20 grid grid-cols-1 md:grid-cols-2 items-center gap-10">
        <div className="text-left">
          <span className="text-[#008444] font-black text-[10px] uppercase tracking-[0.4em] mb-4 block italic">Transportasi Masa Depan</span>
          <h1 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter mb-8 italic">Bus Hebat<br /><span className="text-[#008444]">Untuk Semua.</span></h1>
          <p className="text-slate-500 font-bold text-lg max-w-sm mb-10 leading-snug">Nikmati perjalanan aman, nyaman, dan terintegrasi di seluruh wilayah Jawa Barat.</p>
          <Link href="/register" className="inline-block bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform text-xs">Mulai Perjalanan</Link>
        </div>
        <div className="bg-[#f0f8f3] rounded-[4rem] aspect-square flex items-center justify-center text-8xl shadow-inner border border-white">🚌</div>
      </section>

      {/* Features List */}
      <section className="bg-[#f8fcf9] py-24 px-6 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { t: "Lacak Armada", d: "Pantau posisi bus & angkot secara real-time melalui sistem terintegrasi MJT.", i: "📍" },
            { t: "Konektivitas", d: "Rute yang saling terhubung antara bus utama dan angkutan pengumpan (feeder).", i: "🔗" },
            { t: "Digitalisasi", d: "Semua data perjalanan dan feedback tersimpan aman di Cloud Amazon RDS.", i: "☁️" }
          ].map((f, i) => (
            <div key={i} className="bg-white p-10 rounded-[3rem] shadow-xl shadow-green-900/5 border border-white hover:-translate-y-2 transition-all">
              <div className="text-4xl mb-6">{f.i}</div>
              <h3 className="font-black text-xl mb-4 italic tracking-tight">{f.t}</h3>
              <p className="text-slate-400 text-sm font-bold leading-relaxed">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feedback Section (RDS Integrated) */}
      <section className="py-24 px-6 md:px-20 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20">
        <div>
          <h2 className="text-4xl font-black italic tracking-tighter mb-6">Suara Anda,<br /><span className="text-[#008444]">Inovasi Kami.</span></h2>
          <p className="text-slate-500 font-bold leading-relaxed mb-8">Setiap masukan yang Anda kirimkan diproses langsung ke basis data cloud kami untuk peningkatan layanan yang berkelanjutan.</p>
        </div>
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-white">
          <form onSubmit={handleFeedback} className="space-y-4 text-left">
            <input name="nama" type="text" placeholder="Nama Lengkap" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-sm" required />
            <input name="email" type="email" placeholder="Email" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-sm" required />
            <textarea name="pesan" placeholder="Ceritakan pengalaman Anda..." className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-sm h-32" required></textarea>
            <button type="submit" disabled={loading} className="w-full bg-[#008444] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-green-100 hover:bg-[#006b37] transition-all disabled:opacity-50">
              {loading ? "Menyimpan ke RDS..." : "Kirim Masukan"}
            </button>
          </form>
        </div>
      </section>

      <footer className="py-10 text-center border-t border-slate-100">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Metro Jabar Trans © 2025 • Cloud Infrastructure ETS</p>
      </footer>
    </div>
  );
}