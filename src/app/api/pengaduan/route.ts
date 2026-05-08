import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        // KRITIS: Gunakan domain CloudFront kamu agar sesuai poin 49 & 64
        const CLOUDFRONT_DOMAIN = process.env.NEXT_PUBLIC_CLOUDFRONT_URL;
        const fileName = `laporan-${Date.now()}.jpg`;

        const newLaporan = await prisma.laporan.create({
            data: {
                judul: body.judul,
                masalah: body.masalah,
                namaUser: body.namaUser,
                // Simpan URL CloudFront ke RDS sesuai poin 48 & 49
                fotoUrl: `${CLOUDFRONT_DOMAIN}/${fileName}`, 
            },
        });
        return NextResponse.json(newLaporan, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Gagal simpan ke RDS" }, { status: 500 });
    }
}