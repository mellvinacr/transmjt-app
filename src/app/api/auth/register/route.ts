import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Cek dulu apakah email sudah terdaftar biar nggak error unik
        const existingUser = await prisma.user.findUnique({
            where: { email: body.email }
        });

        if (existingUser) {
            return NextResponse.json({ error: "Email sudah terdaftar di RDS" }, { status: 400 });
        }

        const newUser = await prisma.user.create({
            data: {
                nama: body.nama,
                email: body.email,
                password: body.password, // Jika nanti pakai bcrypt, hash di sini
                role: "USER" // KRITIS: Harus ada agar tidak error pasca perubahan schema
            },
        });

        return NextResponse.json({ 
            message: "User saved to RDS", 
            user: { nama: newUser.nama, email: newUser.email, role: newUser.role } 
        }, { status: 201 });

    } catch (error) {
        console.error("Register Error:", error);
        return NextResponse.json({ error: "Gagal simpan ke RDS" }, { status: 500 });
    }
}