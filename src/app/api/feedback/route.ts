import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const feedback = await prisma.feedback.create({
            data: {
                nama: body.nama,
                email: body.email,
                pesan: body.pesan,
            },
        });
        return NextResponse.json(feedback, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Gagal menyimpan feedback" }, { status: 500 });
    }
}