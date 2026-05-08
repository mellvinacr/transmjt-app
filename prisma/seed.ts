const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Sedang mengisi data ke RDS...');

    // 1. DATA USER (Admin & User)
    await prisma.user.upsert({
        where: { email: 'admin@mjt.com' },
        update: {},
        create: { nama: 'Melvina Admin', email: 'admin@mjt.com', password: 'admin123', role: 'ADMIN' },
    });

    // 2. DATA RUTE (Lengkap 10 Koridor)
    const ruteData = [
        { koridor: 'K1', namaRute: 'Leuwipanjang - Dago', warna: 'blue', jamOps: '05:00 - 21:00 WIB' },
        { koridor: 'K2', namaRute: 'Cicaheum - Cibeureum', warna: 'green', jamOps: '05:30 - 20:00 WIB' },
        { koridor: 'K3', namaRute: 'Cibeunying - Soreang', warna: 'yellow', jamOps: '06:00 - 19:00 WIB' },
        { koridor: 'K4', namaRute: 'Antapani - Ciroyom', warna: 'red', jamOps: '05:00 - 21:00 WIB' },
        { koridor: 'K5', namaRute: 'Stasiun Hall - Lembang', warna: 'purple', jamOps: '05:00 - 18:00 WIB' },
        { koridor: 'K6', namaRute: 'Dipatiukur - Jatinangor', warna: 'orange', jamOps: '06:00 - 20:00 WIB' },
        { koridor: 'T1', namaRute: 'Cibiru - Kebon Kelapa', warna: 'pink', jamOps: '05:30 - 21:00 WIB' },
        { koridor: 'T2', namaRute: 'Ledeng - Margahayu', warna: 'indigo', jamOps: '05:00 - 20:00 WIB' },
    ];

    for (const r of ruteData) {
        await prisma.rute.upsert({ where: { koridor: r.koridor }, update: {}, create: r });
    }

    // 3. DATA ARMADA
    const armada1 = await prisma.armada.upsert({
        where: { platNomor: 'D 1234 MJT' },
        update: {},
        create: { namaArmada: 'BUS-MJT-001', jenis: 'BUS', platNomor: 'D 1234 MJT', rute: 'K1', status: 'Beroperasi' }
    });

    const armada2 = await prisma.armada.upsert({
        where: { platNomor: 'D 5678 MJT' },
        update: {},
        create: { namaArmada: 'BUS-MJT-002', jenis: 'BUS', platNomor: 'D 5678 MJT', rute: 'K2', status: 'Beroperasi' }
    });

    const armada3 = await prisma.armada.upsert({
        where: { platNomor: 'D 9901 MJT' },
        update: {},
        create: { namaArmada: 'ANGKOT-MJT-F01', jenis: 'ANGKOT', platNomor: 'D 9901 MJT', rute: 'K4', status: 'Istirahat' }
    });

    // 4. DATA DRIVER (Relasi ke Armada)
    const drivers = [
        { nama: 'Pak Asep Sunandar', armadaId: armada1.id },
        { nama: 'Pak Dadang Konelo', armadaId: armada2.id },
        { nama: 'Pak Mulyana', armadaId: armada3.id },
        { nama: 'Kang Emil', armadaId: armada1.id }, // Shift malam armada 1
        { nama: 'Mang Oleh', armadaId: armada2.id }, // Shift malam armada 2
    ];

    for (const d of drivers) {
        await prisma.driver.create({ data: d });
    }

    console.log('Data berhasil masuk semua ke RDS! 🚀');
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
