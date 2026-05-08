import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const newRating = await prisma.rating.create({
            data: {
                skor: body.skor,
                komentar: body.komentar || "Rating dari Dashboard",
                driverId: body.driverId, // Hubungkan ke ID supir yang dinilai
            },
        });
        return NextResponse.json(newRating, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Gagal menyimpan rating" }, { status: 500 });
    }
}