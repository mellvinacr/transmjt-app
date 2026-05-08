import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        // Mengambil data armada sekaligus data supir yang terelasi
        const data = await prisma.armada.findMany({
            include: {
                drivers: true
            }
        });
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Gagal ambil data dari RDS" }, { status: 500 });
    }
}