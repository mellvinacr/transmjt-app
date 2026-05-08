import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // 1. Cari user berdasarkan email di database RDS
        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        // 2. Validasi: Jika user tidak ada atau password salah
        if (!user || user.password !== password) {
            return NextResponse.json(
                { error: "Email atau Password salah!" },
                { status: 401 }
            );
        }

        // 3. Jika benar, kirim data nama user untuk disimpan di browser
        return NextResponse.json({
            message: "Login Berhasil",
            user: { nama: user.nama }
        });

    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}