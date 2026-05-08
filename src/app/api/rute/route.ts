import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const data = await prisma.rute.findMany();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Gagal ambil data rute" }, { status: 500 });
    }
}