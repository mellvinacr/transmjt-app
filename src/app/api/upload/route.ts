import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`; // Hapus spasi biar URL aman

        // 1. Ambil URL dari ENV
        const cdnBaseUrl = process.env.NEXT_PUBLIC_CDN_URL?.replace(/\/$/, ''); // Buang slash di akhir kalo ada
        const finalUrl = `${cdnBaseUrl}/${fileName}`;

        console.log("🚀 Mencoba upload ke:", finalUrl);

        // 2. NEMBAK KE CLOUDFLARE WORKER
        const response = await fetch(finalUrl, {
            method: 'PUT',
            body: buffer,
            headers: {
                'Content-Type': file.type,
            },
        });

        // 3. Cek respon dari Cloudflare
        if (response.ok) {
            console.log("✅ Cloudflare Success!");
            return NextResponse.json({ 
                success: true, 
                url: finalUrl 
            });
        } else {
            const errorText = await response.text();
            console.error("❌ Cloudflare Error:", response.status, errorText);
            return NextResponse.json({ 
                error: `Cloudflare rejected: ${response.status} - ${errorText}` 
            }, { status: 500 });
        }

    } catch (error: any) {
        console.error("🔥 Server Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}