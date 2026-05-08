'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            
            const result = await res.json(); // Ambil pesan dari backend

            if (res.ok) {
                alert("Registrasi Berhasil! Data sudah masuk ke Cloud RDS.");
                // Gunakan window.location agar refresh total ke halaman login
                window.location.href = '/login';
            } else {
                // Tampilkan pesan error spesifik dari backend
                alert(result.error || "Gagal Register ke RDS!");
            }
        } catch (err) {
            console.error(err);
            alert("Terjadi kesalahan koneksi ke server!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F1F8F4] flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-md p-10 rounded-[3rem] shadow-2xl border border-white">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-[#008444] rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 italic">M</div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Daftar Akun MJT</h1>
                </div>
                <form onSubmit={handleRegister} className="space-y-4">
                    <input name="nama" type="text" placeholder="Nama Lengkap" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-bold outline-none focus:ring-2 focus:ring-[#008444]" required />
                    <input name="email" type="email" placeholder="Email" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-bold outline-none focus:ring-2 focus:ring-[#008444]" required />
                    <input name="password" type="password" placeholder="Password" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-bold outline-none focus:ring-2 focus:ring-[#008444]" required />
                    <button type="submit" disabled={loading} className="w-full bg-[#008444] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg active:scale-95 disabled:opacity-50">
                        {loading ? "SAVING TO RDS..." : "DAFTAR SEKARANG"}
                    </button>
                </form>
                <p className="mt-8 text-center text-xs font-bold text-slate-400 italic">Sudah punya akun? <Link href="/login" className="text-[#008444] underline">Login</Link></p>
            </div>
        </div>
    );
}