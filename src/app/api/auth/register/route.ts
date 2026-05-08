import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // 1. Validasi Input
        if (!body.email || !body.password || !body.nama) {
            return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
        }

        // 2. Cek apakah email sudah terdaftar
        const existingUser = await prisma.user.findUnique({
            where: { email: body.email }
        });

        if (existingUser) {
            return NextResponse.json({ error: "Email sudah terdaftar di RDS" }, { status: 400 });
        }

        // 3. Simpan ke database
        const newUser = await prisma.user.create({
            data: {
                nama: body.nama,
                email: body.email,
                password: body.password, 
                role: body.role || "USER" 
            },
        });

        // 4. Return Success
        return NextResponse.json({ 
            success: true, // Kunci agar Frontend tidak bingung
            message: "User saved to RDS", 
            user: { nama: newUser.nama, email: newUser.email } 
        }, { status: 201 });

    } catch (error) {
        console.error("Register Error:", error);
        return NextResponse.json({ error: "Gagal simpan ke RDS" }, { status: 500 });
    }
}