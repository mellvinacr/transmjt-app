'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            // Di dalam fungsi handleLogin
            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('userName', data.nama);
                localStorage.setItem('userRole', data.role); // Simpan role

                if (data.role === 'ADMIN') {
                    router.push('/admin'); // Redirect ke halaman admin
                } else {
                    router.push('/dashboard'); // User biasa ke dashboard
                }
            }
        } catch (err) {
            alert("Gagal koneksi ke database RDS!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F1F8F4] flex items-center justify-center p-6 font-sans">
            <div className="bg-white w-full max-w-md p-10 rounded-[3rem] shadow-2xl border border-white">
                <div className="text-center mb-10">
                    <div className="w-12 h-12 bg-[#D4AF37] rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 italic">M</div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic">Selamat Datang</h1>
                    <p className="text-slate-400 font-bold text-xs mt-2 italic uppercase tracking-widest text-center">Masukkan akun Metro Jabar Trans</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <input name="email" type="email" placeholder="Email" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-bold outline-none focus:ring-2 focus:ring-[#D4AF37]" required />
                    <input name="password" type="password" placeholder="Password" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-bold outline-none focus:ring-2 focus:ring-[#D4AF37]" required />

                    <button type="submit" disabled={loading} className="w-full bg-[#008444] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50">
                        {loading ? "VERIFIKASI RDS..." : "MASUK KE APLIKASI"}
                    </button>
                </form>

                <p className="mt-8 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Belum terdaftar? <Link href="/register" className="text-[#008444] underline">Buat akun baru</Link>
                </p>
            </div>
        </div>
    );
}